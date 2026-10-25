import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ path: string[] }> },
) {
  const params = await props.params;
  const path = params.path?.join("/") || "";

  if (path === "applications") {
    const apps = await prisma.identityVerification.findMany();
    return NextResponse.json(apps);
  }

  if (path === "audit") {
    const logs = prisma.audits.getModeratorAudits();
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

  if (path === "decide") {
    const { applicationId, action, reason, moderatorName } = await req.json();
    const app = await prisma.identityVerification.findUnique({ where: { id: applicationId } });
    if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const newStatus = action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "RESUBMIT";
    const mod = moderatorName || "M. Santos";
    const nowStr = new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });

    await prisma.identityVerification.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        reviewerId: mod,
        decision: action,
        decisionReason: reason || null,
        reviewedAt: new Date(),
      },
    });

    prisma.audits.addModeratorAudit({
      ts: nowStr,
      mod,
      action,
      target: applicationId,
      ip: "10.0.0.14",
    });

    return NextResponse.json({
      success: true,
      applicationId,
      status: newStatus,
    });
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}
