import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader, hashPassword } from "@/lib/auth";
import { z } from "zod";

// ── Auth guard ──────────────────────────────────────────────────────────────
async function getAdminUser(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  if (payload.role !== "ADMIN" && payload.role !== "ORGANIZER") return null;
  return payload;
}

// ── GET /api/users ─────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // filter by role
    const search = searchParams.get("search"); // search by name/email

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await db.user.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get count by role for stats
    const countByRole = await db.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    return NextResponse.json({ users, countByRole });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/users (admin creates a user) ──────────────────────────────────
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "ORGANIZER", "PLAYER", "SPECTATOR"]).default("SPECTATOR"),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role, phone, avatar } = parsed.data;

    // Check if email exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword, role, phone, avatar },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── PUT /api/users ──────────────────────────────────────────────────────────
const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "ORGANIZER", "PLAYER", "SPECTATOR"]).optional(),
  phone: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  password: z.string().min(6).optional(), // optional password change
});

export async function PUT(request: Request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, name, email, role, phone, avatar, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness if changing
    if (email && email !== existing.email) {
      const emailExists = await db.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password) updateData.password = await hashPassword(password);

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE /api/users ───────────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Prevent self-deletion
    if (id === admin.userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
