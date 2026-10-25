import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, LedgerRecord } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const wallet = await prisma.walletAccount.findUnique({ where: { userId: user.id } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const entries = await prisma.ledgerEntry.findMany({ where: { walletId: wallet.id } });

    return NextResponse.json(
      entries.map((e: LedgerRecord) => ({
        id: e.id,
        ref: e.ref,
        type: e.type === "PAYMENT" ? "Online payment" : e.type === "CASHOUT" ? "Cash-out" : "Deposit",
        purpose: e.purpose || "General",
        recipient: e.recipient || "Merchant",
        amount: Number(e.debitCents > 0n ? -e.debitCents : e.creditCents) / 100,
        date: e.createdAt.toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: e.status || "completed",
      })),
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
