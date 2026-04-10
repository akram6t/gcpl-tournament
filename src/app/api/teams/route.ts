import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

// Helper: verify admin auth
async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/teams — public
export async function GET() {
  try {
    const teams = await db.team.findMany({
      orderBy: [{ points: "desc" }, { nrr: "desc" }],
      include: { _count: { select: { players: true } } },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET teams error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

// POST /api/teams — create team (admin/organizer)
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, shortName, color, colorLight, captain, logo } = body;

    if (!name || !shortName || !color) {
      return NextResponse.json({ error: "Name, shortName, and color are required" }, { status: 400 });
    }

    const team = await db.team.create({
      data: {
        name,
        shortName,
        color,
        colorLight: colorLight || `${color}33`,
        captain: captain || "",
        logo: logo || "🏏",
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST team error:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

// PUT /api/teams/:id — update team
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const team = await db.team.update({ where: { id }, data });
    return NextResponse.json(team);
  } catch (error) {
    console.error("PUT team error:", error);
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}

// DELETE /api/teams — delete team
export async function DELETE(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    await db.team.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE team error:", error);
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
