import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const amountXlm = Number(body.amountXlm || 1);
    const asset = body.asset || "XLM";
    const merchantAddress = body.merchantAddress || "G_MERCHANT_DEMO_ADDRESS";
    const savingsDestination = body.savingsDestination || "savings";

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        amountXlm,
        asset,
        merchantAddress,
        savingsDestination,
      },
    });

    return NextResponse.json(order);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({ where: { userId: user.id } });
  return NextResponse.json(orders);
}
