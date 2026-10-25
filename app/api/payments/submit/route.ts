import { NextResponse } from "next/server";
import { submitPayment, verifyPayment } from "@/lib/paiflow";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envelopeHash } from "@/lib/transaction";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, signedXdr } = await req.json();
    if (!orderId || !signedXdr) {
      return NextResponse.json({ error: "orderId and signedXdr are required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId, userId: user.id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let txHash: string;
    try {
      if (order.preparedXdr && !order.preparedXdr.includes("...")) {
        const originalHash = envelopeHash(order.preparedXdr);
        const signedHash = envelopeHash(signedXdr);
        if (originalHash !== signedHash) {
          return NextResponse.json({ error: "Transaction body altered — rejected" }, { status: 400 });
        }
        txHash = signedHash;
      } else {
        txHash = `tx_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
      }
    } catch {
      txHash = `tx_${Date.now()}`;
    }

    // Persist signed envelope before submission
    await prisma.order.update({
      where: { id: orderId },
      data: {
        signedXdr,
        txHash,
        status: "SUBMITTING",
      },
    });

    const deploymentId =
      order.asset === "USDC"
        ? process.env.PAIFLOW_DEPLOYMENT_ID_USDC
        : process.env.PAIFLOW_DEPLOYMENT_ID_XLM || process.env.PAIFLOW_DEPLOYMENT_ID;

    // Submit via server-only SDK
    await submitPayment(
      signedXdr,
      order.preparationRequestId || undefined,
      deploymentId,
    );

    // Verify payment and split
    const verification = await verifyPayment({
      deploymentId,
      txHash,
    });

    const isVerified = verification.verified;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: isVerified ? "COMPLETED" : "PENDING",
        verifiedAt: isVerified ? new Date() : null,
      },
    });

    // Record on-chain payment ledger entry
    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (wallet && isVerified) {
      await prisma.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          type: "PAYMENT",
          debitCents: BigInt(Math.round(order.amountXlm * 100)),
          creditCents: 0n,
          ref: `PF-${txHash.slice(0, 8).toUpperCase()}`,
          recipient: order.merchantAddress || "Shop Merchant",
          purpose: `On-chain ${order.asset} 90/10 Split`,
          status: "completed",
        },
      });
    }

    return NextResponse.json({
      txHash,
      status: isVerified ? "success" : "pending",
      split: {
        merchant: `${Number(order.amountXlm) * 0.9} ${order.asset} (90%)`,
        savings: `${Number(order.amountXlm) * 0.1} ${order.asset} (10%)`,
        destination: order.savingsDestination,
      },
      verified: isVerified,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
