import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const policy = await prisma.spendingPolicy.findUnique({ where: { userId: user.id } });
    if (!policy) return NextResponse.json({ error: "Policy not found" }, { status: 404 });

    return NextResponse.json({
      dailyLimitPhp: Number(policy.dailyLimitCents) / 100,
      dailyCashoutLimitPhp: Number(policy.dailyCashoutLimitCents) / 100,
      weeklyLimitPhp: Number(policy.weeklyLimitCents) / 100,
      monthlyLimitPhp: Number(policy.monthlyLimitCents) / 100,
      perTransactionLimitPhp: Number(policy.perTransactionLimitCents) / 100,
      timezone: policy.timezone,
      nighttimeBlocked: policy.nighttimeBlocked,
      require2faOverPhp: Number(policy.require2faOverCents) / 100,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.dailyLimitPhp !== undefined) {
      updateData.dailyLimitCents = BigInt(Math.round(Number(body.dailyLimitPhp) * 100));
    }
    if (body.dailyCashoutLimitPhp !== undefined) {
      updateData.dailyCashoutLimitCents = BigInt(Math.round(Number(body.dailyCashoutLimitPhp) * 100));
    }
    if (body.perTransactionLimitPhp !== undefined) {
      updateData.perTransactionLimitCents = BigInt(Math.round(Number(body.perTransactionLimitPhp) * 100));
    }
    if (body.timezone) updateData.timezone = body.timezone;
    if (body.nighttimeBlocked !== undefined) updateData.nighttimeBlocked = Boolean(body.nighttimeBlocked);

    const updated = await prisma.spendingPolicy.update({
      where: { userId: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      dailyLimitPhp: Number(updated.dailyLimitCents) / 100,
      dailyCashoutLimitPhp: Number(updated.dailyCashoutLimitCents) / 100,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
