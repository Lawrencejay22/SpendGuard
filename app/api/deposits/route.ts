import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amountPhp, method } = await req.json();
    const amount = Number(amountPhp);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Valid deposit amount required" }, { status: 400 });
    }

    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const amountCents = BigInt(Math.round(amount * 100));

    // Update wallet balance atomically
    await prisma.walletAccount.update({
      where: { id: wallet.id },
      data: {
        phpBalanceCents: { increment: amountCents },
      },
    });

    const ref = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const ledger = await prisma.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        type: "DEPOSIT",
        debitCents: 0n,
        creditCents: amountCents,
        ref,
        recipient: method || "Instant Funding",
        purpose: "Top-up",
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      ref,
      depositedPhp: amount,
      ledgerId: ledger.id,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
