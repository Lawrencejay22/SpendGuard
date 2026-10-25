import { NextResponse } from "next/server";
import { prepareSpendGuardPayment } from "@/lib/paiflow";
import { getCurrentUser, getUserWalletAddress } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { xlmToStroops } from "@/lib/stellar";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, customerAddress: customAddr } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId, userId: user.id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotent return if already prepared
    if (order.preparedXdr) {
      return NextResponse.json({
        unsignedXdr: order.preparedXdr,
        networkPassphrase: order.networkPassphrase,
        preparationRequestId: order.preparationRequestId,
        orderDetails: { amount: order.amountXlm, recipient: order.merchantAddress },
      });
    }

    const walletAddress = customAddr || (await getUserWalletAddress(user.id));
    const amountStroops = xlmToStroops(order.amountXlm);

    const deploymentId =
      order.asset === "USDC"
        ? process.env.PAIFLOW_DEPLOYMENT_ID_USDC
        : process.env.PAIFLOW_DEPLOYMENT_ID_XLM || process.env.PAIFLOW_DEPLOYMENT_ID;

    const preparation = await prepareSpendGuardPayment({
      deploymentId,
      customerAddress: walletAddress,
      amountStroops,
    });

    // Persist the original preparation before returning XDR to browser
    await prisma.order.update({
      where: { id: orderId },
      data: {
        preparedXdr: preparation.unsignedXdr,
        preparationRequestId: preparation.preparationRequestId,
        networkPassphrase: preparation.networkPassphrase,
        status: "PREPARED",
      },
    });

    // Send only unsigned XDR + network info to browser — never the Paiflow API token
    return NextResponse.json({
      unsignedXdr: preparation.unsignedXdr,
      networkPassphrase: preparation.networkPassphrase,
      preparationRequestId: preparation.preparationRequestId,
      orderDetails: {
        id: order.id,
        amount: order.amountXlm,
        asset: order.asset,
        recipient: order.merchantAddress,
        savingsDestination: order.savingsDestination,
      },
      isSimulated: (preparation as { isSimulated?: boolean }).isSimulated || false,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
