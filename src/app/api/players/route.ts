import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/players — public
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const teamId = searchParams.get("teamId");

    const where: Record<string, unknown> = {};
    if (role && role !== "all") where.role = role;
    if (teamId) where.teamId = teamId;

    const players = await db.player.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: { team: { select: { name: true, shortName: true, color: true } } },
      orderBy: [{ runs: "desc" }],
    });

    const formatted = players.map((p) => ({
      id: p.id,
      name: p.name,
      team: p.team.name,
      teamShort: p.team.shortName,
      teamColor: p.team.color,
      teamId: p.teamId,
      role: p.role,
      matches: p.matches,
      runs: p.runs,
      wickets: p.wickets,
      avg: p.avg,
      sr: p.sr,
      bestBatting: p.bestBatting,
      bestBowling: p.bestBowling,
      isCaptain: p.isCaptain,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET players error:", error);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

// POST /api/players — create player (admin)
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, teamId, role, matches, runs, wickets, avg, sr, bestBatting, bestBowling, isCaptain } = body;

    if (!name || !teamId) {
      return NextResponse.json({ error: "Name and team are required" }, { status: 400 });
    }

    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const player = await db.player.create({
      data: {
        name,
        teamId,
        teamColor: team.color,
        teamShort: team.shortName,
        role: role || "Batsman",
        matches: matches || 0,
        runs: runs || 0,
        wickets: wickets || 0,
        avg: avg || "0.00",
        sr: sr || "0.00",
        bestBatting: bestBatting || "-",
        bestBowling: bestBowling || "-",
        isCaptain: isCaptain || false,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("POST player error:", error);
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}

// PUT /api/players — update player
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, teamId, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    // If team changed, update team color/short
    if (teamId) {
      const team = await db.team.findUnique({ where: { id: teamId } });
      if (team) {
        data.teamColor = team.color;
        data.teamShort = team.shortName;
      }
      data.teamId = teamId;
    }

    const player = await db.player.update({ where: { id }, data });
    return NextResponse.json(player);
  } catch (error) {
    console.error("PUT player error:", error);
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

// DELETE /api/players
export async function DELETE(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Player ID required" }, { status: 400 });

    await db.player.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE player error:", error);
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
