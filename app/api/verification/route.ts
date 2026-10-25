import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const verification = await prisma.identityVerification.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      verified: verification?.status === "APPROVED",
      status: verification?.status || "UNVERIFIED",
      idType: verification?.idType,
      livenessOk: verification?.livenessOk ?? false,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();

    const application = await prisma.identityVerification.create({
      data: {
        userId: user?.id || `usr_${Date.now()}`,
        applicantName: body.name || user?.fullName || "Applicant",
        applicantEmail: body.email || user?.email || "applicant@email.com",
        applicantMobile: body.mobile || user?.mobile || "+63 9XX XXX XXXX",
        birthdate: body.birthdate,
        gender: body.gender,
        idType: body.idType || "PhilSys ID",
        selfieUrl: body.selfie,
        idFrontUrl: body.idfront,
        idBackUrl: body.idback,
        livenessOk: body.livenessOk ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: "PENDING_REVIEW",
      message: "Application submitted for verification officer review.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
