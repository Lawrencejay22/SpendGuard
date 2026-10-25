import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/paiflow";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    const order = await prisma.order.findUnique({
      where: { id: params.id, userId: user.id },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    let verificationDetails = null;
    if (order.txHash) {
      const deploymentId =
        order.asset === "USDC"
          ? process.env.PAIFLOW_DEPLOYMENT_ID_USDC
          : process.env.PAIFLOW_DEPLOYMENT_ID_XLM || process.env.PAIFLOW_DEPLOYMENT_ID;
      verificationDetails = await verifyPayment({ deploymentId, txHash: order.txHash });
    }

    return NextResponse.json({
      order,
      verification: verificationDetails,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
