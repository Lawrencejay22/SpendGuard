"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  SlidersHorizontal,
  Banknote,
  CreditCard,
  ShieldAlert,
  Receipt,
  Hexagon,
  Bell,
  Lock,
  ClipboardCheck,
  FileClock,
  Users,
  UserCog,
  Sliders,
  Plug,
  Shield,
  Menu,
  Search,
  Settings,
  LogOut,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  LucideIcon,
} from "lucide-react";
import { ShieldLogo } from "./shield-logo";

export type UserRole = "customer" | "moderator" | "admin";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "warn" | "info";
  message: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-detect role from path
  useEffect(() => {
    if (pathname.startsWith("/mod-")) {
      setRole("moderator");
    } else if (pathname.startsWith("/admin-")) {
      setRole("admin");
    } else if (pathname.startsWith("/auth") || pathname === "/") {
      // Landing or auth
    } else {
      setRole("customer");
    }
  }, [pathname]);

  const addToast = (message: string, type: "success" | "error" | "warn" | "info" = "info") => {
    const id = `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const roleMeta = {
    customer: {
      name: "Juan Dela Cruz",
      title: "Customer · Verified",
      initials: "JD",
    },
    moderator: {
      name: "Maria Santos",
      title: "Moderator · Officer",
      initials: "MS",
    },
    admin: {
      name: "System Admin",
      title: "Administrator",
      initials: "SA",
    },
  };

  const navCustomer = [
    { href: "/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/add-money", label: "Add Money", icon: PlusCircle },
    { href: "/controls", label: "Spending Controls", icon: SlidersHorizontal },
    { href: "/cashout", label: "Cash-Out", icon: Banknote },
    { href: "/payments", label: "Online Payments", icon: CreditCard },
    { href: "/emergency", label: "Emergency Mode", icon: ShieldAlert },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/blockchain", label: "Blockchain Wallet", icon: Hexagon },
    { href: "/notifications", label: "Notifications", icon: Bell, badge: "3" },
    { href: "/security", label: "Security & Settings", icon: Lock },
  ];

  const navModerator = [
    { href: "/mod-overview", label: "Review Dashboard", icon: LayoutDashboard },
    { href: "/mod-applications", label: "Applications", icon: ClipboardCheck },
    { href: "/mod-audit", label: "Audit Logs", icon: FileClock },
  ];

  const navAdmin = [
    { href: "/admin-overview", label: "Overview", icon: LayoutDashboard },
    { href: "/admin-users", label: "User Management", icon: Users },
    { href: "/admin-moderators", label: "Moderators", icon: UserCog },
    { href: "/admin-policy", label: "Policy Config", icon: Sliders },
    { href: "/admin-providers", label: "Payment Providers", icon: Plug },
    { href: "/admin-audit", label: "Security & Audit", icon: Shield },
  ];

  const activeNav: NavItem[] =
    role === "customer" ? navCustomer : role === "moderator" ? navModerator : navAdmin;

  return (
    <div className="min-h-screen bg-bg text-ptext relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar sidebar-aside glass fixed top-0 left-0 bottom-0 z-50 w-[260px] flex flex-col border-r border-line transition-transform duration-200 ${
          sidebarOpen ? "open translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-line">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-inherit">
            <ShieldLogo size={34} float={false} />
            <div>
              <div className="font-bold leading-none text-base">SpendGuard</div>
              <div className="text-[10px] text-stext mt-0.5 tracking-wider">Your money, your control</div>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden text-stext hover:text-ptext p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pt-3">
          <div className="seg w-full flex">
            <button
              type="button"
              className={`flex-1 text-center ${role === "customer" ? "active" : ""}`}
              onClick={() => {
                setRole("customer");
                router.push("/overview");
              }}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 text-center ${role === "moderator" ? "active" : ""}`}
              onClick={() => {
                setRole("moderator");
                router.push("/mod-overview");
              }}
            >
              Moderator
            </button>
            <button
              type="button"
              className={`flex-1 text-center ${role === "admin" ? "active" : ""}`}
              onClick={() => {
                setRole("admin");
                router.push("/admin-overview");
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="text-[10px] text-stext uppercase tracking-wider px-3 pt-3 pb-1.5 font-semibold">
            {role === "customer" ? "Customer" : role === "moderator" ? "Moderator" : "Administrator"}
          </div>

          {activeNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="badge b-accent text-[10px]">{item.badge}</span>}
              </Link>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-card2 cursor-pointer transition">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #5DE0B0, #3FBF8F)", color: "#062018" }}
            >
              {roleMeta[role].initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{roleMeta[role].name}</div>
              <div className="text-xs text-stext truncate">{roleMeta[role].title}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                addToast("Signed out successfully", "info");
                router.push("/");
              }}
              title="Sign out"
              className="text-stext hover:text-err transition p-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-area lg:ml-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="glass sticky top-0 z-30 border-b border-line">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button
              type="button"
              className="lg:hidden btn btn-ghost p-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Quick Search */}
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stext" />
              <input
                className="input pl-9 py-2 text-sm"
                placeholder="Search transactions, recipients, policies…"
              />
            </div>
            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-2">
              <Link href="/notifications" className="btn btn-ghost p-2.5 relative" title="Notifications">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-err pulse-dot" />
              </Link>
              <Link href="/security" className="btn btn-ghost p-2.5" title="Settings">
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>

      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-[70] space-y-2 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const colors = {
            success: { border: "#5DE0B0", icon: CheckCircle, color: "#5DE0B0" },
            error: { border: "#F87171", icon: AlertTriangle, color: "#F87171" },
            warn: { border: "#F59E0B", icon: AlertTriangle, color: "#F59E0B" },
            info: { border: "#9AA9A6", icon: Info, color: "#9AA9A6" },
          };
          const cfg = colors[t.type];
          const Icon = cfg.icon;

          return (
            <div
              key={t.id}
              className="toast card p-3.5 flex items-start gap-3 shadow-2xl pointer-events-auto"
              style={{ borderLeft: `3px solid ${cfg.border}` }}
            >
              <Icon size={18} color={cfg.color} className="flex-shrink-0 mt-0.5" />
              <div className="text-sm flex-1">{t.message}</div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="text-stext hover:text-ptext p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
