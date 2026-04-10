import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

async function verifyAuth(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/settings — public
export async function GET() {
  try {
    const settings = await db.tournamentSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT /api/settings — update settings (admin)
export async function PUT(request: Request) {
  try {
    const payload = await verifyAuth(request);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json(); // { key: value, ... }

    const operations = Object.entries(body).map(([key, value]) =>
      db.tournamentSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(operations);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
