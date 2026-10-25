"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  CheckCircle,
  Plus,
  Banknote,
  TrendingDown,
  Hourglass,
  Calendar,
  CreditCard,
  SlidersHorizontal,
  ShieldAlert,
  Receipt,
  Pencil,
  Shield,
  X,
  Download,
  AlertTriangle,
} from "lucide-react";
import { WalletBanner } from "@/components/wallet-banner";
import { WalletBalances } from "@/components/wallet-balances";
import { PaymentFlowCard } from "@/components/payment-flow-card";
import { StellarBalanceBadges } from "@/components/stellar-balance-badges";
import { connectFreighter } from "@/lib/freighter";

interface TransactionItem {
  ref: string;
  type: string;
  purpose: string;
  recip: string;
  amt: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function OverviewPage() {
  const [walletConnected, setWalletConnected] = useState(true);
  const [stellarAddress, setStellarAddress] = useState<string | null>(
    "GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP",
  );
  const [xlmBalance, setXlmBalance] = useState(10000.0);
  const [usdcBalance, setUsdcBalance] = useState(100.0);
  const [trustlineActive, setTrustlineActive] = useState(true);

  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      ref: "TX-9821",
      type: "Online payment",
      purpose: "Groceries",
      recip: "GroceryMart PH",
      amt: -800,
      date: "Today 18:42",
      status: "completed",
    },
    {
      ref: "TX-9818",
      type: "Cash-out",
      purpose: "Food",
      recip: "GCash · ****4567",
      amt: -510,
      date: "Today 16:20",
      status: "completed",
    },
    {
      ref: "TX-9815",
      type: "Deposit",
      purpose: "Top-up",
      recip: "Instant Funding",
      amt: 5000,
      date: "Today 14:05",
      status: "completed",
    },
    {
      ref: "TX-9810",
      type: "Online payment",
      purpose: "Bills",
      recip: "Meralco",
      amt: -1200,
      date: "Yesterday 19:30",
      status: "completed",
    },
    {
      ref: "TX-9808",
      type: "Emergency",
      purpose: "Medical",
      recip: "Mercury Drug",
      amt: -1500,
      date: "Yesterday 11:14",
      status: "completed",
    },
  ]);

  const todayStr = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  async function handleConnectWallet() {
    try {
      const state = await connectFreighter();
      setStellarAddress(state.address);
      setWalletConnected(state.connected);
    } catch {
      // Demo simulated fallback
      setStellarAddress("GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP");
      setWalletConnected(true);
    }
  }

  function handlePaymentSuccess(amount: number, splitDest: string, txHash: string) {
    setXlmBalance((prev) => Math.max(0, prev - amount));
    const newTx: TransactionItem = {
      ref: `PF-${txHash.slice(0, 4).toUpperCase()}`,
      type: "Stellar 90/10 Split",
      purpose: `Save 10% to ${splitDest}`,
      recip: "Shop Merchant (90%)",
      amt: -amount,
      date: "Just now",
      status: "completed",
    };
    setTransactions((prev) => [newTx, ...prev]);
  }

  return (
    <div className="space-y-4">
      {/* Top Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Good evening, Juan</h1>
          <p className="text-stext text-sm mt-1">
            Here&apos;s your spending snapshot for today, <span className="text-ptext">{todayStr}</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/add-money" className="btn btn-ghost text-xs">
            <Plus size={14} /> Add Money
          </Link>
          <Link href="/cashout" className="btn btn-accent text-xs">
            <Banknote size={14} /> Cash-Out
          </Link>
        </div>
      </div>

      {/* Stellar Wallet Banner */}
      <WalletBanner />

      {/* Live Stellar Balances (XLM + USDC) */}
      <WalletBalances />

      {/* Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
        {/* Available Balance (Large Bento Card) */}
        <div className="card card-hover card-shine stat-spark p-5 col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
          />
          <div className="flex items-center justify-between mb-3 relative">
            <div className="flex items-center gap-2 text-stext text-sm">
              <Wallet size={16} color="#5DE0B0" />
              <span>Available Balance</span>
            </div>
            <span className="badge b-ok">
              <CheckCircle size={12} />
              <span>Verified</span>
            </span>
          </div>

          <div className="text-4xl lg:text-5xl font-extrabold tracking-tight relative">
            PHP 10,000<span className="text-lg text-stext font-medium">.00</span>
          </div>
          <div className="text-xs text-stext mt-1.5 relative">
            Total: PHP 10,000 · Reserved: PHP 0 · Pending deposits: PHP 0
          </div>

          {/* Dual Balance: On-Chain Stellar Badges */}
          <div className="mt-3 relative">
            <StellarBalanceBadges xlmBalance={xlmBalance} usdcBalance={usdcBalance} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 relative">
            <div className="p-3 rounded-xl" style={{ background: "#0F1618" }}>
              <div className="text-xs text-stext mb-1">Today&apos;s spending</div>
              <div className="text-lg font-bold">PHP 800</div>
              <div className="progress mt-2">
                <span style={{ width: "40%" }} />
              </div>
              <div className="text-[10px] text-stext mt-1">40% of PHP 2,000 limit</div>
            </div>

            <div className="p-3 rounded-xl" style={{ background: "#0F1618" }}>
              <div className="text-xs text-stext mb-1">Today&apos;s cash-outs</div>
              <div className="text-lg font-bold">PHP 500</div>
              <div className="progress mt-2">
                <span style={{ width: "50%" }} />
              </div>
              <div className="text-[10px] text-stext mt-1">50% of PHP 1,000 limit</div>
            </div>
          </div>
        </div>

        {/* Remaining Spend */}
        <div className="card card-hover card-shine p-5">
          <div className="flex items-center gap-2 text-stext text-sm mb-2">
            <TrendingDown size={16} color="#5DE0B0" />
            <span>Remaining Spend</span>
          </div>
          <div className="text-2xl font-bold">PHP 1,200</div>
          <div className="text-xs text-stext mt-1">Daily limit PHP 2,000</div>
          <div className="progress mt-3">
            <span style={{ width: "60%" }} />
          </div>
        </div>

        {/* Remaining Cash-Out */}
        <div className="card card-hover card-shine p-5">
          <div className="flex items-center gap-2 text-stext text-sm mb-2">
            <Banknote size={16} color="#5DE0B0" />
            <span>Remaining Cash-Out</span>
          </div>
          <div className="text-2xl font-bold">PHP 500</div>
          <div className="text-xs text-stext mt-1">Daily limit PHP 1,000</div>
          <div className="progress mt-3">
            <span style={{ width: "50%" }} />
          </div>
        </div>

        {/* Pending Holds */}
        <div className="card card-hover card-shine p-5">
          <div className="flex items-center gap-2 text-stext text-sm mb-2">
            <Hourglass size={16} color="#F59E0B" />
            <span>Pending / Holds</span>
          </div>
          <div className="text-2xl font-bold">PHP 0</div>
          <div className="text-xs text-stext mt-1">No active reservations</div>
          <div className="mt-3 text-xs text-stext">All transactions reconciled.</div>
        </div>

        {/* Monthly Spending */}
        <div className="card card-hover card-shine p-5">
          <div className="flex items-center gap-2 text-stext text-sm mb-2">
            <Calendar size={16} color="#5DE0B0" />
            <span>Monthly Spending</span>
          </div>
          <div className="text-2xl font-bold">PHP 12,450</div>
          <div className="text-xs text-stext mt-1">October 2026 · ↓ 8% vs last month</div>
          <div className="progress mt-3 warn">
            <span style={{ width: "48%" }} />
          </div>
        </div>
      </div>

      {/* Hero 1 XLM Test Payment Component */}
      <PaymentFlowCard onPaymentSuccess={handlePaymentSuccess} />

      {/* Spending Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Weekly Spending Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Weekly spending</h3>
              <p className="text-xs text-stext">Last 7 days · PHP</p>
            </div>
            <div className="seg">
              <button type="button" className="active">
                Week
              </button>
              <button type="button">Month</button>
            </div>
          </div>

          {/* Custom SVG Weekly Chart */}
          <div className="h-60 w-full flex items-end gap-3 pt-6 pb-2 px-2" style={{ background: "#0F1618", borderRadius: "0.75rem" }}>
            {[
              { day: "Mon", val: 420, h: "35%" },
              { day: "Tue", val: 680, h: "55%" },
              { day: "Wed", val: 310, h: "25%" },
              { day: "Thu", val: 950, h: "80%" },
              { day: "Fri", val: 800, h: "65%" },
              { day: "Sat", val: 1240, h: "100%" },
              { day: "Sun", val: 580, h: "48%" },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <span className="text-[10px] text-stext group-hover:text-accent transition">₱{bar.val}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                  style={{
                    height: bar.h,
                    background: "linear-gradient(180deg, #5DE0B0 0%, rgba(93,224,176,0.3) 100%)",
                  }}
                />
                <span className="text-xs text-stext font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Doughnut Breakdown */}
        <div className="card p-5">
          <h3 className="font-bold mb-1">Spending categories</h3>
          <p className="text-xs text-stext mb-4">This month</p>

          <div className="flex justify-center py-2">
            <div className="doughnut-wrap">
              <svg
                viewBox="0 0 100 100"
                className="doughnut-svg -rotate-90"
                style={{ width: "140px", height: "140px", minWidth: "140px", minHeight: "140px" }}
              >
                {/* Doughnut Circles */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#151E20" strokeWidth="14" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#5DE0B0"
                  strokeWidth="14"
                  strokeDasharray="76.4 238.8"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3FBF8F"
                  strokeWidth="14"
                  strokeDasharray="66.8 238.8"
                  strokeDashoffset="-76.4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="14"
                  strokeDasharray="43.0 238.8"
                  strokeDashoffset="-143.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray="33.4 238.8"
                  strokeDashoffset="-186.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#9AA9A6"
                  strokeWidth="14"
                  strokeDasharray="19.2 238.8"
                  strokeDashoffset="-219.6"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5DE0B0" }} /> Food · 32%
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3FBF8F" }} /> Groceries · 28%
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#7DD3FC" }} /> Transport · 18%
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} /> Bills · 14%
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#9AA9A6" }} /> Other · 8%
            </div>
          </div>
        </div>
      </div>

      {/* Budget Utilization & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Budget Utilization */}
        <div className="card p-5">
          <h3 className="font-bold mb-1">Budget utilization</h3>
          <p className="text-xs text-stext mb-4">Daily limits usage</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stext">Spending</span>
                <span className="font-semibold">PHP 800 / 2,000</span>
              </div>
              <div className="progress">
                <span style={{ width: "40%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stext">Cash-out</span>
                <span className="font-semibold">PHP 500 / 1,000</span>
              </div>
              <div className="progress warn">
                <span style={{ width: "50%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stext">Per-transaction</span>
                <span className="font-semibold">PHP 500 / 1,000</span>
              </div>
              <div className="progress">
                <span style={{ width: "50%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-stext">Monthly</span>
                <span className="font-semibold">PHP 12,450 / 30,000</span>
              </div>
              <div className="progress">
                <span style={{ width: "41%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent transactions</h3>
            <Link href="/transactions" className="text-xs text-accent hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-1">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t.ref}
                onClick={() => setSelectedTx(t)}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-[#13201F] transition"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(93,224,176,.08)" }}
                >
                  <CreditCard size={18} color={t.amt < 0 ? "#5DE0B0" : "#3FBF8F"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.purpose}</div>
                  <div className="text-xs text-stext truncate">
                    {t.recip} · {t.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${t.amt < 0 ? "" : "text-accent"}`}>
                    {t.amt < 0 ? "-" : "+"}PHP {Math.abs(t.amt).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </div>
                  <span className="badge b-ok text-[10px] mt-0.5">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Policy Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="card p-5">
          <h3 className="font-bold mb-3">Quick actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/add-money" className="btn btn-soft justify-center text-xs">
              <Plus size={14} /> Add Money
            </Link>
            <Link href="/payments" className="btn btn-soft justify-center text-xs">
              <CreditCard size={14} /> Pay
            </Link>
            <Link href="/cashout" className="btn btn-soft justify-center text-xs">
              <Banknote size={14} /> Cash-Out
            </Link>
            <Link href="/controls" className="btn btn-soft justify-center text-xs">
              <SlidersHorizontal size={14} /> Adjust Limits
            </Link>
            <Link href="/emergency" className="btn btn-soft justify-center text-xs">
              <ShieldAlert size={14} /> Emergency
            </Link>
            <Link href="/transactions" className="btn btn-soft justify-center text-xs">
              <Receipt size={14} /> History
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-3">Active policies</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stext">Daily spend limit</span>
              <span className="font-semibold">PHP 2,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Daily cash-out limit</span>
              <span className="font-semibold">PHP 1,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Per-transaction</span>
              <span className="font-semibold">PHP 1,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Reset schedule</span>
              <span className="font-semibold">Asia/Manila 00:00</span>
            </div>
            <Link href="/controls" className="btn btn-ghost w-full justify-center mt-2 text-xs">
              <Pencil size={12} /> Edit policies
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-3">Security status</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stext">Identity verified</span>
              <span className="badge b-ok">
                <CheckCircle size={10} /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">2FA enabled</span>
              <span className="badge b-ok">
                <CheckCircle size={10} /> Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Passkey</span>
              <span className="badge b-ok">Configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Last login</span>
              <span className="text-stext text-xs">2 hrs ago · Manila</span>
            </div>
            <Link href="/security" className="btn btn-ghost w-full justify-center mt-2 text-xs">
              <Shield size={12} /> Manage security
            </Link>
          </div>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setSelectedTx(null)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-stext">Transaction receipt</div>
                <div className="font-mono text-sm">{selectedTx.ref}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-stext hover:text-ptext p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-4 mb-4 rounded-xl" style={{ background: "#0F1618" }}>
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <CreditCard size={20} color="#5DE0B0" />
              </div>
              <div className={`text-2xl font-bold ${selectedTx.amt < 0 ? "" : "text-accent"}`}>
                {selectedTx.amt < 0 ? "-" : "+"}PHP {Math.abs(selectedTx.amt).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </div>
              <span className="badge b-ok text-[10px] mt-1">Completed</span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-stext">Type</span>
                <span>{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Purpose</span>
                <span>{selectedTx.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Recipient</span>
                <span>{selectedTx.recip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Date</span>
                <span>{selectedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Source</span>
                <span>SpendGuard Wallet</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={() => setSelectedTx(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-soft flex-1 justify-center text-xs"
                onClick={() => setSelectedTx(null)}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
