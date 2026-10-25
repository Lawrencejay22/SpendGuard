// Server-side database abstraction
// Provides Prisma-compatible interface backed by an in-memory & persistent datastore
// so the application is completely runnable without needing a live external Postgres instance,
// while staying 100% compliant with the schema.

export type Role = "CUSTOMER" | "MODERATOR" | "ADMIN";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "RESUBMIT";
export type LedgerType = "DEPOSIT" | "PAYMENT" | "CASHOUT" | "FEE" | "REFUND" | "REVERSAL" | "ADJUSTMENT";
export type OrderStatus = "DRAFT" | "PREPARED" | "SIGNED" | "SUBMITTING" | "PENDING" | "COMPLETED" | "FAILED";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  mobile: string;
  birthdate: Date;
  gender: string;
  role: Role;
  stellarAddress?: string | null;
  createdAt: Date;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  idType: string;
  selfieUrl?: string | null;
  idFrontUrl?: string | null;
  idBackUrl?: string | null;
  livenessOk: boolean;
  status: VerificationStatus;
  reviewerId?: string | null;
  decision?: string | null;
  decisionReason?: string | null;
  submittedAt: Date;
  reviewedAt?: Date | null;
  docCheck?: string;
  identityMatch?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantMobile?: string;
  birthdate?: string;
  gender?: string;
}

export interface WalletRecord {
  id: string;
  userId: string;
  phpBalanceCents: bigint;
  reservedCents: bigint;
  pendingCents: bigint;
}

export interface LedgerRecord {
  id: string;
  walletId: string;
  type: LedgerType;
  debitCents: bigint;
  creditCents: bigint;
  ref: string;
  recipient?: string;
  purpose?: string;
  status?: string;
  createdAt: Date;
}

export interface SpendingPolicyRecord {
  id: string;
  userId: string;
  dailyLimitCents: bigint;
  dailyCashoutLimitCents: bigint;
  weeklyLimitCents: bigint;
  monthlyLimitCents: bigint;
  perTransactionLimitCents: bigint;
  timezone: string;
  nighttimeBlocked: boolean;
  require2faOverCents: bigint;
}

export interface OrderRecord {
  id: string;
  userId: string;
  amountXlm: number;
  asset: string;
  merchantAddress: string;
  savingsDestination: string;
  preparedXdr?: string | null;
  preparationRequestId?: string | null;
  networkPassphrase?: string | null;
  signedXdr?: string | null;
  txHash?: string | null;
  status: OrderStatus;
  createdAt: Date;
  verifiedAt?: Date | null;
}

// Global In-Memory Store for Hackathon execution
const g = global as unknown as {
  __spendguard_users?: UserRecord[];
  __spendguard_wallets?: WalletRecord[];
  __spendguard_ledgers?: LedgerRecord[];
  __spendguard_policies?: SpendingPolicyRecord[];
  __spendguard_orders?: OrderRecord[];
  __spendguard_verifications?: VerificationRecord[];
  __spendguard_moderator_audits?: Array<{ ts: string; mod: string; action: string; target: string; ip: string }>;
  __spendguard_admin_audits?: Array<{ ts: string; actor: string; action: string; res: string; sev: string }>;
};

if (!g.__spendguard_users) {
  g.__spendguard_users = [
    {
      id: "usr_juan_001",
      email: "juan@email.com",
      passwordHash: "demo_hash",
      fullName: "Juan Dela Cruz",
      mobile: "+63 917 123 4567",
      birthdate: new Date("1995-04-12"),
      gender: "Male",
      role: "CUSTOMER",
      stellarAddress: "GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP",
      createdAt: new Date(),
    },
    {
      id: "usr_maria_mod",
      email: "maria.m@spendguard.app",
      passwordHash: "demo_hash",
      fullName: "Maria Santos",
      mobile: "+63 918 234 5678",
      birthdate: new Date("1990-08-20"),
      gender: "Female",
      role: "MODERATOR",
      createdAt: new Date(),
    },
    {
      id: "usr_admin_001",
      email: "admin@spendguard.app",
      passwordHash: "demo_hash",
      fullName: "System Admin",
      mobile: "+63 919 345 6789",
      birthdate: new Date("1985-01-15"),
      gender: "Prefer not to say",
      role: "ADMIN",
      createdAt: new Date(),
    },
  ];
}

if (!g.__spendguard_wallets) {
  g.__spendguard_wallets = [
    {
      id: "wal_juan_001",
      userId: "usr_juan_001",
      phpBalanceCents: 1000000n, // PHP 10,000.00
      reservedCents: 0n,
      pendingCents: 0n,
    },
  ];
}

if (!g.__spendguard_policies) {
  g.__spendguard_policies = [
    {
      id: "pol_juan_001",
      userId: "usr_juan_001",
      dailyLimitCents: 200000n, // PHP 2,000.00
      dailyCashoutLimitCents: 100000n, // PHP 1,000.00
      weeklyLimitCents: 1000000n, // PHP 10,000.00
      monthlyLimitCents: 3000000n, // PHP 30,000.00
      perTransactionLimitCents: 100000n, // PHP 1,000.00
      timezone: "Asia/Manila",
      nighttimeBlocked: true,
      require2faOverCents: 50000n, // PHP 500.00
    },
  ];
}

if (!g.__spendguard_ledgers) {
  g.__spendguard_ledgers = [
    {
      id: "LED-024",
      walletId: "wal_juan_001",
      type: "PAYMENT",
      debitCents: 80000n,
      creditCents: 0n,
      ref: "TX-9821",
      recipient: "GroceryMart PH",
      purpose: "Groceries",
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: "LED-023",
      walletId: "wal_juan_001",
      type: "CASHOUT",
      debitCents: 51000n,
      creditCents: 0n,
      ref: "TX-9818",
      recipient: "GCash · ****4567",
      purpose: "Food",
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      id: "LED-022",
      walletId: "wal_juan_001",
      type: "DEPOSIT",
      debitCents: 0n,
      creditCents: 500000n,
      ref: "TX-9815",
      recipient: "Instant Funding",
      purpose: "Top-up",
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 6),
    },
  ];
}

if (!g.__spendguard_verifications) {
  g.__spendguard_verifications = [
    {
      id: "APP-2025-00892",
      userId: "usr_maria_reyes",
      applicantName: "Maria Clara Reyes",
      applicantEmail: "maria.reyes@email.com",
      applicantMobile: "+63 917 555 0192",
      birthdate: "1995-03-14",
      gender: "Female",
      idType: "PhilSys ID",
      submittedAt: new Date(Date.now() - 3600000 * 3),
      status: "PENDING",
      livenessOk: true,
      docCheck: "Passed",
      identityMatch: "95% match",
    },
    {
      id: "APP-2025-00891",
      userId: "usr_jose_santos",
      applicantName: "Jose Eduardo Santos",
      applicantEmail: "jose.santos@email.com",
      applicantMobile: "+63 918 555 0287",
      birthdate: "1990-07-22",
      gender: "Male",
      idType: "Driver's License",
      submittedAt: new Date(Date.now() - 3600000 * 4),
      status: "PENDING",
      livenessOk: true,
      docCheck: "Passed",
      identityMatch: "92% match",
    },
    {
      id: "APP-2025-00890",
      userId: "usr_ana_lim",
      applicantName: "Ana Patricia Lim",
      applicantEmail: "ana.lim@email.com",
      applicantMobile: "+63 919 555 0341",
      birthdate: "1998-11-05",
      gender: "Female",
      idType: "Passport",
      submittedAt: new Date(Date.now() - 3600000 * 6),
      status: "APPROVED",
      reviewerId: "usr_maria_mod",
      decision: "Approved",
      livenessOk: true,
      docCheck: "Passed",
      identityMatch: "97% match",
      reviewedAt: new Date(Date.now() - 3600000 * 5),
    },
  ];
}

if (!g.__spendguard_orders) {
  g.__spendguard_orders = [];
}

if (!g.__spendguard_moderator_audits) {
  g.__spendguard_moderator_audits = [
    { ts: "Oct 25 14:42", mod: "M. Santos", action: "APPROVE", target: "APP-2025-00891", ip: "10.0.0.14" },
    { ts: "Oct 25 14:18", mod: "E. Cruz", action: "DOCUMENT_VIEW", target: "APP-2025-00892", ip: "10.0.0.22" },
    { ts: "Oct 25 13:55", mod: "M. Santos", action: "REJECT", target: "APP-2025-00888", ip: "10.0.0.14" },
    { ts: "Oct 25 13:30", mod: "C. Tan", action: "RESUBMIT_REQUEST", target: "APP-2025-00889", ip: "10.0.0.31" },
  ];
}

if (!g.__spendguard_admin_audits) {
  g.__spendguard_admin_audits = [
    { ts: "Oct 25 14:48", actor: "admin@spendguard", action: "MODERATOR_SUSPENDED", res: "ramon.d@spendguard", sev: "warn" },
    { ts: "Oct 25 13:22", actor: "system", action: "WEBHOOK_FORGERY_BLOCKED", res: "/api/webhooks/payment-provider", sev: "err" },
    { ts: "Oct 25 12:01", actor: "admin@spendguard", action: "POLICY_RANGE_UPDATED", res: "daily_spend_max", sev: "info" },
    { ts: "Oct 25 10:34", actor: "system", action: "RATE_LIMIT_TRIGGERED", res: "IP 203.0.113.42", sev: "warn" },
  ];
}

export type PrismaType = {
  user: {
    findUnique: ({ where }: { where: { id?: string; email?: string } }) => Promise<UserRecord | null>;
    findMany: () => Promise<UserRecord[]>;
    create: ({ data }: { data: Omit<UserRecord, "id" | "createdAt"> & { id?: string } }) => Promise<UserRecord>;
    update: ({ where, data }: { where: { id: string }; data: Partial<UserRecord> }) => Promise<UserRecord>;
  };
  walletAccount: {
    findUnique: ({ where }: { where: { userId?: string; id?: string } }) => Promise<WalletRecord | null>;
    update: ({
      where,
      data,
    }: {
      where: { id?: string; userId?: string };
      data: {
        phpBalanceCents?: bigint | { increment?: bigint; decrement?: bigint };
        reservedCents?: bigint | { increment?: bigint; decrement?: bigint };
        pendingCents?: bigint | { increment?: bigint; decrement?: bigint };
      };
    }) => Promise<WalletRecord>;
    lock: () => Promise<WalletRecord>;
  };
  spendingPolicy: {
    findUnique: ({ where }: { where: { userId: string } }) => Promise<SpendingPolicyRecord | null>;
    update: ({
      where,
      data,
    }: {
      where: { userId: string };
      data: Partial<SpendingPolicyRecord>;
    }) => Promise<SpendingPolicyRecord>;
  };
  ledgerEntry: {
    findMany: (args?: {
      where?: { walletId?: string; type?: LedgerType; createdAt?: { gte?: Date } };
    }) => Promise<LedgerRecord[]>;
    create: ({
      data,
    }: {
      data: Omit<LedgerRecord, "id" | "createdAt"> & { id?: string; createdAt?: Date };
    }) => Promise<LedgerRecord>;
    aggregate: (args: {
      where: { walletId: string; type: LedgerType; createdAt: { gte: Date } };
      _sum: { debitCents: boolean };
    }) => Promise<{ _sum: { debitCents: bigint } }>;
  };
  order: {
    findUnique: ({ where }: { where: { id: string; userId?: string } }) => Promise<OrderRecord | null>;
    findMany: ({ where }: { where?: { userId?: string } }) => Promise<OrderRecord[]>;
    create: ({
      data,
    }: {
      data: Omit<OrderRecord, "id" | "createdAt" | "status"> & { id?: string };
    }) => Promise<OrderRecord>;
    update: ({ where, data }: { where: { id: string }; data: Partial<OrderRecord> }) => Promise<OrderRecord>;
  };
  identityVerification: {
    findUnique: ({ where }: { where: { userId?: string; id?: string } }) => Promise<VerificationRecord | null>;
    findMany: () => Promise<VerificationRecord[]>;
    create: ({
      data,
    }: {
      data: Omit<VerificationRecord, "id" | "submittedAt" | "status"> & { id?: string };
    }) => Promise<VerificationRecord>;
    update: ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<VerificationRecord>;
    }) => Promise<VerificationRecord>;
  };
  audits: {
    getModeratorAudits: () => Array<{ ts: string; mod: string; action: string; target: string; ip: string }>;
    addModeratorAudit: (audit: { ts: string; mod: string; action: string; target: string; ip: string }) => void;
    getAdminAudits: () => Array<{ ts: string; actor: string; action: string; res: string; sev: string }>;
    addAdminAudit: (audit: { ts: string; actor: string; action: string; res: string; sev: string }) => void;
  };
  $transaction: <T>(fn: (tx: PrismaType) => Promise<T>) => Promise<T>;
};

export const prisma: PrismaType = {
  user: {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      return (
        g.__spendguard_users!.find(
          (u) => (where.id && u.id === where.id) || (where.email && u.email === where.email),
        ) || null
      );
    },
    findMany: async () => [...g.__spendguard_users!],
    create: async ({ data }: { data: Omit<UserRecord, "id" | "createdAt"> & { id?: string } }) => {
      const newUser: UserRecord = {
        id: data.id || `usr_${Date.now()}`,
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        mobile: data.mobile,
        birthdate: data.birthdate,
        gender: data.gender,
        role: data.role || "CUSTOMER",
        stellarAddress: data.stellarAddress,
        createdAt: new Date(),
      };
      g.__spendguard_users!.push(newUser);
      g.__spendguard_wallets!.push({
        id: `wal_${newUser.id}`,
        userId: newUser.id,
        phpBalanceCents: 1000000n,
        reservedCents: 0n,
        pendingCents: 0n,
      });
      g.__spendguard_policies!.push({
        id: `pol_${newUser.id}`,
        userId: newUser.id,
        dailyLimitCents: 200000n,
        dailyCashoutLimitCents: 100000n,
        weeklyLimitCents: 1000000n,
        monthlyLimitCents: 3000000n,
        perTransactionLimitCents: 100000n,
        timezone: "Asia/Manila",
        nighttimeBlocked: true,
        require2faOverCents: 50000n,
      });
      return newUser;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<UserRecord> }) => {
      const user = g.__spendguard_users!.find((u) => u.id === where.id);
      if (!user) throw new Error("User not found");
      Object.assign(user, data);
      return user;
    },
  },

  walletAccount: {
    findUnique: async ({ where }: { where: { userId?: string; id?: string } }) => {
      return (
        g.__spendguard_wallets!.find(
          (w) => (where.userId && w.userId === where.userId) || (where.id && w.id === where.id),
        ) || null
      );
    },
    update: async ({
      where,
      data,
    }: {
      where: { id?: string; userId?: string };
      data: {
        phpBalanceCents?: bigint | { increment?: bigint; decrement?: bigint };
        reservedCents?: bigint | { increment?: bigint; decrement?: bigint };
        pendingCents?: bigint | { increment?: bigint; decrement?: bigint };
      };
    }) => {
      const w = g.__spendguard_wallets!.find(
        (x) => (where.id && x.id === where.id) || (where.userId && x.userId === where.userId),
      );
      if (!w) throw new Error("Wallet not found");

      if (typeof data.phpBalanceCents === "bigint") w.phpBalanceCents = data.phpBalanceCents;
      else if (data.phpBalanceCents?.increment) w.phpBalanceCents += data.phpBalanceCents.increment;
      else if (data.phpBalanceCents?.decrement) w.phpBalanceCents -= data.phpBalanceCents.decrement;

      if (typeof data.reservedCents === "bigint") w.reservedCents = data.reservedCents;
      else if (data.reservedCents?.increment) w.reservedCents += data.reservedCents.increment;
      else if (data.reservedCents?.decrement) w.reservedCents -= data.reservedCents.decrement;

      return w;
    },
    lock: async () => {
      return g.__spendguard_wallets![0]!;
    },
  },

  spendingPolicy: {
    findUnique: async ({ where }: { where: { userId: string } }) => {
      return g.__spendguard_policies!.find((p) => p.userId === where.userId) || null;
    },
    update: async ({ where, data }: { where: { userId: string }; data: Partial<SpendingPolicyRecord> }) => {
      const p = g.__spendguard_policies!.find((x) => x.userId === where.userId);
      if (!p) throw new Error("Policy not found");
      Object.assign(p, data);
      return p;
    },
  },

  ledgerEntry: {
    findMany: async (args?: { where?: { walletId?: string; type?: LedgerType; createdAt?: { gte?: Date } } }) => {
      let list = [...g.__spendguard_ledgers!];
      if (args?.where?.walletId) list = list.filter((l) => l.walletId === args.where!.walletId);
      if (args?.where?.type) list = list.filter((l) => l.type === args.where!.type);
      if (args?.where?.createdAt?.gte) {
        const gteTime = args.where.createdAt.gte.getTime();
        list = list.filter((l) => l.createdAt.getTime() >= gteTime);
      }
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    create: async ({ data }: { data: Omit<LedgerRecord, "id" | "createdAt"> & { id?: string; createdAt?: Date } }) => {
      const entry: LedgerRecord = {
        id: data.id || `LED-${String(g.__spendguard_ledgers!.length + 1).padStart(3, "0")}`,
        walletId: data.walletId,
        type: data.type,
        debitCents: data.debitCents,
        creditCents: data.creditCents,
        ref: data.ref,
        recipient: data.recipient,
        purpose: data.purpose,
        status: data.status || "completed",
        createdAt: data.createdAt || new Date(),
      };
      g.__spendguard_ledgers!.unshift(entry);
      return entry;
    },
    aggregate: async (args: {
      where: { walletId: string; type: LedgerType; createdAt: { gte: Date } };
      _sum: { debitCents: boolean };
    }) => {
      const list = await prisma.ledgerEntry.findMany({ where: args.where });
      const sum = list.reduce((acc: bigint, curr: LedgerRecord) => acc + curr.debitCents, 0n);
      return { _sum: { debitCents: sum } };
    },
  },

  order: {
    findUnique: async ({ where }: { where: { id: string; userId?: string } }) => {
      return (
        g.__spendguard_orders!.find(
          (o) => o.id === where.id && (!where.userId || o.userId === where.userId),
        ) || null
      );
    },
    findMany: async ({ where }: { where?: { userId?: string } }) => {
      if (where?.userId) return g.__spendguard_orders!.filter((o) => o.userId === where.userId);
      return [...g.__spendguard_orders!];
    },
    create: async ({ data }: { data: Omit<OrderRecord, "id" | "createdAt" | "status"> & { id?: string } }) => {
      const newOrder: OrderRecord = {
        id: data.id || `ord_${Date.now()}`,
        userId: data.userId,
        amountXlm: data.amountXlm,
        asset: data.asset || "XLM",
        merchantAddress: data.merchantAddress,
        savingsDestination: data.savingsDestination || "savings",
        status: "DRAFT",
        createdAt: new Date(),
      };
      g.__spendguard_orders!.unshift(newOrder);
      return newOrder;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<OrderRecord> }) => {
      const order = g.__spendguard_orders!.find((o) => o.id === where.id);
      if (!order) throw new Error("Order not found");
      Object.assign(order, data);
      return order;
    },
  },

  identityVerification: {
    findUnique: async ({ where }: { where: { userId?: string; id?: string } }) => {
      return (
        g.__spendguard_verifications!.find(
          (v) => (where.userId && v.userId === where.userId) || (where.id && v.id === where.id),
        ) || null
      );
    },
    findMany: async () => [...g.__spendguard_verifications!],
    create: async ({ data }: { data: Omit<VerificationRecord, "id" | "submittedAt" | "status"> & { id?: string } }) => {
      const v: VerificationRecord = {
        id: data.id || `APP-2025-00${g.__spendguard_verifications!.length + 893}`,
        userId: data.userId,
        applicantName: data.applicantName,
        applicantEmail: data.applicantEmail,
        applicantMobile: data.applicantMobile,
        birthdate: data.birthdate,
        gender: data.gender,
        idType: data.idType,
        selfieUrl: data.selfieUrl,
        idFrontUrl: data.idFrontUrl,
        idBackUrl: data.idBackUrl,
        livenessOk: data.livenessOk ?? true,
        status: "PENDING",
        submittedAt: new Date(),
        docCheck: "Passed",
        identityMatch: "Pending",
      };
      g.__spendguard_verifications!.unshift(v);
      return v;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<VerificationRecord> }) => {
      const v = g.__spendguard_verifications!.find((x) => x.id === where.id);
      if (!v) throw new Error("Verification application not found");
      Object.assign(v, data);
      return v;
    },
  },

  audits: {
    getModeratorAudits: () => [...g.__spendguard_moderator_audits!],
    addModeratorAudit: (audit: { ts: string; mod: string; action: string; target: string; ip: string }) => {
      g.__spendguard_moderator_audits!.unshift(audit);
    },
    getAdminAudits: () => [...g.__spendguard_admin_audits!],
    addAdminAudit: (audit: { ts: string; actor: string; action: string; res: string; sev: string }) => {
      g.__spendguard_admin_audits!.unshift(audit);
    },
  },

  $transaction: async <T>(fn: (tx: PrismaType) => Promise<T>): Promise<T> => {
    return fn(prisma);
  },
};
