import { prisma, UserRecord } from "./prisma";

export async function getCurrentUser(req?: Request): Promise<UserRecord | null> {
  // Check authorization header or session cookie
  let roleHeader = req?.headers?.get("x-spendguard-role");
  let userIdHeader = req?.headers?.get("x-spendguard-user-id");

  if (userIdHeader) {
    const user = await prisma.user.findUnique({ where: { id: userIdHeader } });
    if (user) return user;
  }

  if (roleHeader === "MODERATOR") {
    const mod = await prisma.user.findUnique({ where: { id: "usr_maria_mod" } });
    if (mod) return mod;
  }

  if (roleHeader === "ADMIN") {
    const admin = await prisma.user.findUnique({ where: { id: "usr_admin_001" } });
    if (admin) return admin;
  }

  // Default demo user is Juan Dela Cruz (Customer)
  const defaultUser = await prisma.user.findUnique({ where: { id: "usr_juan_001" } });
  return defaultUser;
}

export async function getUserWalletAddress(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.stellarAddress || "GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP";
}

export async function getOrder(orderId: string, userId: string) {
  return prisma.order.findUnique({ where: { id: orderId, userId } });
}
