import { NextResponse } from "next/server";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: payload.userId, name: payload.name, email: payload.email, role: payload.role },
  });
}
