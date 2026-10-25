import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const ledgers = await prisma.ledgerEntry.findMany({ where: { walletId: wallet.id } });

    return NextResponse.json({
      wallet: {
        id: wallet.id,
        phpBalanceCents: Number(wallet.phpBalanceCents),
        phpBalance: Number(wallet.phpBalanceCents) / 100,
        reservedCents: Number(wallet.reservedCents),
        reservedPhp: Number(wallet.reservedCents) / 100,
        pendingCents: Number(wallet.pendingCents),
        pendingPhp: Number(wallet.pendingCents) / 100,
        availablePhp: Number(wallet.phpBalanceCents - wallet.reservedCents) / 100,
      },
      ledgers: ledgers.map((l) => ({
        id: l.id,
        ref: l.ref,
        type: l.type,
        debitPhp: Number(l.debitCents) / 100,
        creditPhp: Number(l.creditCents) / 100,
        recipient: l.recipient,
        purpose: l.purpose,
        status: l.status,
        date: l.createdAt.toISOString(),
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
