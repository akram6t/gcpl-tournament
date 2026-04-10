import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/gallery — public
export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST /api/gallery — create gallery image
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, category, imageUrl } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
    }

    const image = await db.galleryImage.create({
      data: { title, category, imageUrl: imageUrl || null },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("POST gallery error:", error);
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}

// PUT /api/gallery — update gallery image
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: "Image ID required" }, { status: 400 });

    const image = await db.galleryImage.update({ where: { id }, data });
    return NextResponse.json(image);
  } catch (error) {
    console.error("PUT gallery error:", error);
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}

// DELETE /api/gallery
export async function DELETE(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Image ID required" }, { status: 400 });

    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE gallery error:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
