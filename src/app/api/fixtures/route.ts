import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/fixtures — public
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;

    const fixtures = await db.fixture.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        team1: { select: { name: true, shortName: true, color: true } },
        team2: { select: { name: true, shortName: true, color: true } },
      },
      orderBy: [{ matchNumber: "asc" }],
    });

    const formatted = fixtures.map((f) => ({
      id: f.id,
      matchNumber: f.matchNumber,
      team1: f.team1.name,
      team1Short: f.team1.shortName,
      team1Color: f.team1.color,
      team2: f.team2.name,
      team2Short: f.team2.shortName,
      team2Color: f.team2.color,
      date: f.date,
      time: f.time,
      venue: f.venue,
      status: f.status,
      score: f.score,
      result: f.result,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET fixtures error:", error);
    return NextResponse.json({ error: "Failed to fetch fixtures" }, { status: 500 });
  }
}

// POST /api/fixtures — create fixture
export async function POST(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { matchNumber, team1Id, team2Id, date, time, venue, status, score, result } = body;

    if (!team1Id || !team2Id || !date || !venue) {
      return NextResponse.json({ error: "Teams, date, and venue are required" }, { status: 400 });
    }

    // Auto-assign match number if not provided
    let matchNum = matchNumber;
    if (!matchNum) {
      const max = await db.fixture.findFirst({ orderBy: { matchNumber: "desc" }, select: { matchNumber: true } });
      matchNum = (max?.matchNumber || 0) + 1;
    }

    const fixture = await db.fixture.create({
      data: {
        matchNumber: matchNum,
        team1Id,
        team2Id,
        date,
        time: time || "4:00 PM",
        venue,
        status: status || "UPCOMING",
        score: score || null,
        result: result || null,
      },
      include: {
        team1: { select: { name: true, shortName: true, color: true } },
        team2: { select: { name: true, shortName: true, color: true } },
      },
    });

    return NextResponse.json(fixture, { status: 201 });
  } catch (error) {
    console.error("POST fixture error:", error);
    return NextResponse.json({ error: "Failed to create fixture" }, { status: 500 });
  }
}

// PUT /api/fixtures — update fixture
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: "Fixture ID required" }, { status: 400 });

    const fixture = await db.fixture.update({
      where: { id },
      data: {
        matchNumber: data.matchNumber,
        team1Id: data.team1Id,
        team2Id: data.team2Id,
        date: data.date,
        time: data.time,
        venue: data.venue,
        status: data.status,
        score: data.score || null,
        result: data.result || null,
      },
      include: {
        team1: { select: { name: true, shortName: true, color: true } },
        team2: { select: { name: true, shortName: true, color: true } },
      },
    });

    return NextResponse.json(fixture);
  } catch (error) {
    console.error("PUT fixture error:", error);
    return NextResponse.json({ error: "Failed to update fixture" }, { status: 500 });
  }
}

// DELETE /api/fixtures
export async function DELETE(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Fixture ID required" }, { status: 400 });

    await db.fixture.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE fixture error:", error);
    return NextResponse.json({ error: "Failed to delete fixture" }, { status: 500 });
  }
}
