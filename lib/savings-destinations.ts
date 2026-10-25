export type SavingsDestination = "savings" | "community" | "creator";

export const SAVINGS_DESTINATIONS: Record<
  SavingsDestination,
  { label: string; shortLabel: string; icon: string; color: string; description: string }
> = {
  savings: {
    label: "My savings",
    shortLabel: "My savings (10%)",
    icon: "piggy-bank",
    color: "#F59E0B",
    description: "Default — 10% routes to your own savings wallet",
  },
  community: {
    label: "Community fund",
    shortLabel: "Community fund (10%)",
    icon: "users",
    color: "#5DE0B0",
    description: "Bayanihan pool — helps other SpendGuard users in need",
  },
  creator: {
    label: "Creator tip",
    shortLabel: "Creator tip (10%)",
    icon: "heart",
    color: "#F87171",
    description: "Tip a creator you want to support",
  },
};

export const DEFAULT_DESTINATION: SavingsDestination = "savings";
