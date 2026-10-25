import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkPolicy } from "@/lib/policy-engine";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amountPhp, purpose, destination } = await req.json();
    const amount = Number(amountPhp);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Valid cash-out amount required" }, { status: 400 });
    }
    if (!purpose) {
      return NextResponse.json({ error: "Transaction purpose is required for cash-out" }, { status: 400 });
    }

    const amountCents = BigInt(Math.round(amount * 100));

    // Server-side spending policy check
    const policyResult = await checkPolicy({
      userId: user.id,
      amountCents,
      type: "CASHOUT",
    });

    if (!policyResult.allowed) {
      return NextResponse.json(
        { error: policyResult.reason || "Policy check failed" },
        { status: 400 },
      );
    }

    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const feeCents = 1000n; // PHP 10.00 fee
    const totalDeduction = amountCents + feeCents;

    // Settle debit
    await prisma.walletAccount.update({
      where: { id: wallet.id },
      data: {
        phpBalanceCents: { decrement: totalDeduction },
      },
    });

    const ref = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const ledger = await prisma.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        type: "CASHOUT",
        debitCents: totalDeduction,
        creditCents: 0n,
        ref,
        recipient: destination || "Verified GCash account",
        purpose,
        status: "completed",
      },
    });

    return NextResponse.json({
      success: true,
      ref,
      amountPhp: amount,
      feePhp: 10,
      totalPhp: amount + 10,
      ledgerId: ledger.id,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
