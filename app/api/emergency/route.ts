import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reason, amountPhp, recipient, purpose, explanation } = await req.json();
    const amount = Number(amountPhp);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Valid emergency amount required" }, { status: 400 });
    }

    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const amountCents = BigInt(Math.round(amount * 100));
    const available = wallet.phpBalanceCents - wallet.reservedCents;
    if (amountCents > available) {
      return NextResponse.json(
        { error: "Insufficient available funds for emergency exception" },
        { status: 400 },
      );
    }

    const ref = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 2 * 3600 * 1000); // 2 hours

    // Debit funds for authorized emergency payment
    await prisma.walletAccount.update({
      where: { id: wallet.id },
      data: {
        phpBalanceCents: { decrement: amountCents },
      },
    });

    const ledger = await prisma.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        type: "PAYMENT",
        debitCents: amountCents,
        creditCents: 0n,
        ref,
        recipient: recipient || "Emergency Merchant",
        purpose: purpose || "Medical",
        status: "completed",
      },
    });

    prisma.audits.addAdminAudit({
      ts: new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }),
      actor: user.email,
      action: "EMERGENCY_EXCEPTION_GRANTED",
      res: `PHP ${amount.toLocaleString()} · ${reason}`,
      sev: "warn",
    });

    return NextResponse.json({
      success: true,
      ref,
      reason,
      amountPhp: amount,
      recipient,
      expiresAt: expiresAt.toISOString(),
      ledgerId: ledger.id,
      status: "APPROVED_AND_EXECUTED",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
