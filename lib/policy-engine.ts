import { prisma } from "./prisma";

export function getTodayInTimezone(timeZone = "Asia/Manila"): Date {
  const now = new Date();
  const dStr = now.toLocaleDateString("en-CA", { timeZone }); // YYYY-MM-DD
  return new Date(`${dStr}T00:00:00+08:00`);
}

export async function checkPolicy(params: {
  userId: string;
  amountCents: bigint;
  type: "PAYMENT" | "CASHOUT";
}): Promise<{ allowed: boolean; reason?: string }> {
  const { userId, amountCents, type } = params;

  const policy = await prisma.spendingPolicy.findUnique({ where: { userId } });
  const wallet = await prisma.walletAccount.findUnique({ where: { userId } });

  if (!wallet) {
    return { allowed: false, reason: "Wallet account not found" };
  }

  const available = wallet.phpBalanceCents - wallet.reservedCents;
  if (amountCents > available) {
    return { allowed: false, reason: "Insufficient available funds" };
  }

  if (!policy) {
    return { allowed: true };
  }

  if (amountCents > policy.perTransactionLimitCents) {
    const maxPhp = Number(policy.perTransactionLimitCents) / 100;
    return {
      allowed: false,
      reason: `Exceeds per-transaction limit of PHP ${maxPhp.toLocaleString()}`,
    };
  }

  const today = getTodayInTimezone(policy.timezone || "Asia/Manila");
  const ledgerType = type === "CASHOUT" ? "CASHOUT" : "PAYMENT";
  const limit = type === "CASHOUT" ? policy.dailyCashoutLimitCents : policy.dailyLimitCents;

  const todaySpent = await prisma.ledgerEntry.aggregate({
    where: {
      walletId: wallet.id,
      type: ledgerType,
      createdAt: { gte: today },
    },
    _sum: { debitCents: true },
  });

  const totalUsed = (todaySpent._sum.debitCents || 0n) + amountCents;
  if (totalUsed > limit) {
    const limitPhp = Number(limit) / 100;
    return {
      allowed: false,
      reason: `Exceeds daily ${type === "CASHOUT" ? "cash-out" : "spending"} limit of PHP ${limitPhp.toLocaleString()}`,
    };
  }

  return { allowed: true };
}

export async function reserveFunds(params: {
  orderId?: string;
  userId: string;
  amountCents: bigint;
  type?: "PAYMENT" | "CASHOUT";
}) {
  return prisma.$transaction(async (tx) => {
    const policyResult = await checkPolicy({
      userId: params.userId,
      amountCents: params.amountCents,
      type: params.type || "PAYMENT",
    });

    if (!policyResult.allowed) {
      throw new Error(policyResult.reason || "Policy violation");
    }

    const wallet = await tx.walletAccount.findUnique({ where: { userId: params.userId } });
    if (!wallet) throw new Error("Wallet not found");

    await tx.walletAccount.update({
      where: { id: wallet.id },
      data: {
        reservedCents: { increment: params.amountCents },
      },
    });

    if (params.orderId) {
      await tx.order.update({
        where: { id: params.orderId },
        data: { status: "PREPARED" },
      });
    }

    return { success: true };
  });
}

export async function releaseFunds(params: {
  userId: string;
  amountCents: bigint;
  settleDebit?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.walletAccount.findUnique({ where: { userId: params.userId } });
    if (!wallet) throw new Error("Wallet not found");

    await tx.walletAccount.update({
      where: { id: wallet.id },
      data: {
        reservedCents: { decrement: params.amountCents },
        ...(params.settleDebit ? { phpBalanceCents: { decrement: params.amountCents } } : {}),
      },
    });
  });
}
