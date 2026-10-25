import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const path = params.path?.join("/") || "";

  if (path === "metrics") {
    return NextResponse.json({
      totalUsers: 12847,
      verifiedUsers: 9421,
      activeModerators: 6,
      failedTxToday: 17,
      uptime: "99.98%",
      avgLatencyMs: 142,
    });
  }

  if (path === "users") {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  }

  if (path === "audit") {
    const logs = prisma.audits.getAdminAudits();
    return NextResponse.json(logs);
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function POST(
  req: Request,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const path = params.path?.join("/") || "";

  if (path === "user-status") {
    const { userId, status } = await req.json();
    return NextResponse.json({ success: true, userId, status });
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}
