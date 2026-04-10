import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/standings — public (returns teams sorted by points/NRR)
export async function GET() {
  try {
    const teams = await db.team.findMany({
      orderBy: [{ points: "desc" }, { nrr: "desc" }],
      include: {
        _count: { select: { players: true } },
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET standings error:", error);
    return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
  }
}

// PUT /api/standings — update team standings (admin)
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, points, nrr, wins, losses, draws, matchesPlayed } = body;

    if (!id) return NextResponse.json({ error: "Team ID required" }, { status: 400 });

    const team = await db.team.update({
      where: { id },
      data: {
        points: points !== undefined ? points : undefined,
        nrr: nrr !== undefined ? nrr : undefined,
        wins: wins !== undefined ? wins : undefined,
        losses: losses !== undefined ? losses : undefined,
        draws: draws !== undefined ? draws : undefined,
        matchesPlayed: matchesPlayed !== undefined ? matchesPlayed : undefined,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("PUT standings error:", error);
    return NextResponse.json({ error: "Failed to update standings" }, { status: 500 });
  }
}
