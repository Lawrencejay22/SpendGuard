"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Zap,
  ArrowDownToLine,
  ShieldAlert,
  PiggyBank,
  CheckCircle,
} from "lucide-react";
import { WalletBanner } from "@/components/wallet-banner";
import { WalletBalances } from "@/components/wallet-balances";

interface LedgerItem {
  ref: string;
  date: string;
  type: string;
  acct: string;
  db: number;
  cr: number;
  st: string;
}

export default function WalletPage() {
  const [balancePhp, setBalancePhp] = useState(10000.0);
  const [reservedPhp, setReservedPhp] = useState(0.0);
  const [ledger, setLedger] = useState<LedgerItem[]>([
    {
      ref: "LED-024",
      date: "Today 18:42",
      type: "Payment",
      acct: "Wallet → Merchant",
      db: 800,
      cr: 0,
      st: "completed",
    },
    {
      ref: "LED-023",
      date: "Today 16:20",
      type: "Cash-out",
      acct: "Wallet → Payout",
      db: 510,
      cr: 0,
      st: "completed",
    },
    {
      ref: "LED-022",
      date: "Today 14:05",
      type: "Deposit",
      acct: "Funding → Wallet",
      db: 0,
      cr: 5000,
      st: "completed",
    },
    {
      ref: "LED-021",
      date: "Today 00:00",
      type: "Daily reset",
      acct: "Policy usage",
      db: 0,
      cr: 0,
      st: "system",
    },
    {
      ref: "LED-020",
      date: "Yesterday 19:30",
      type: "Payment",
      acct: "Wallet → Merchant",
      db: 1200,
      cr: 0,
      st: "completed",
    },
  ]);

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => {
        if (data.wallet) {
          setBalancePhp(data.wallet.phpBalance || 10000);
          setReservedPhp(data.wallet.reservedPhp || 0);
        }
        if (data.ledgers && Array.isArray(data.ledgers) && data.ledgers.length > 0) {
          const mapped: LedgerItem[] = data.ledgers.map((l: {
            ref: string;
            date: string;
            type: string;
            recipient?: string;
            purpose?: string;
            debitPhp?: number;
            creditPhp?: number;
            status?: string;
          }) => ({
            ref: l.ref,
            date: new Date(l.date).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: l.type === "DEPOSIT" ? "Deposit" : l.type === "CASHOUT" ? "Cash-out" : "Payment",
            acct: l.type === "DEPOSIT" ? `${l.recipient || "Funding"} → Wallet` : `Wallet → ${l.recipient || "Merchant"}`,
            db: l.debitPhp || 0,
            cr: l.creditPhp || 0,
            st: l.status || "completed",
          }));
          setLedger(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Wallet</h1>
        <p className="text-stext text-sm mt-1">
          Your controlled account balance, Paiflow on-chain settlement, and double-entry ledger overview.
        </p>
      </div>

      {/* Stellar & Freighter Wallet Connection Banner */}
      <WalletBanner />

      {/* Live Stellar XLM + USDC Balances with 10s Poller */}
      <WalletBalances />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className="card p-6 lg:col-span-2 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
          />
          <div className="text-sm text-stext mb-2 relative">Available balance</div>
          <div className="text-4xl lg:text-5xl font-extrabold tracking-tight relative">
            PHP {balancePhp.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative">
            <div>
              <div className="text-xs text-stext">Total balance</div>
              <div className="font-bold">PHP {balancePhp.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-stext">Reserved</div>
              <div className="font-bold">PHP {reservedPhp.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-stext">Pending deposits</div>
              <div className="font-bold">PHP 0</div>
            </div>
            <div>
              <div className="text-xs text-stext">Ledger entries</div>
              <div className="font-bold">{ledger.length}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6 relative">
            <Link href="/add-money" className="btn btn-accent text-xs">
              <Plus size={14} /> Add Money
            </Link>
            <Link href="/cashout" className="btn btn-ghost text-xs">
              <Banknote size={14} /> Cash-Out
            </Link>
            <Link href="/payments" className="btn btn-ghost text-xs">
              <CreditCard size={14} /> Pay
            </Link>
            <Link href="/emergency" className="btn btn-danger text-xs">
              <ShieldAlert size={14} /> Emergency Mode
            </Link>
          </div>
        </div>

        {/* Funding Sources List */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Funding sources</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-line flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <Smartphone size={20} color="#5DE0B0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">GCash</div>
                <div className="text-xs text-stext">Planned integration</div>
              </div>
              <span className="badge b-warn text-[10px]">Planned</span>
            </div>

            <div className="p-3.5 rounded-xl border border-line flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <Building2 size={20} color="#5DE0B0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Bank Transfer</div>
                <div className="text-xs text-stext">InstaPay / PESONet</div>
              </div>
              <span className="badge b-info text-[10px]">Coming</span>
            </div>

            <div className="p-3.5 rounded-xl border border-line flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <Zap size={20} color="#5DE0B0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Instant Funding</div>
                <div className="text-xs text-stext">Instant credit</div>
              </div>
              <span className="badge b-ok text-[10px]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Ledger Entries Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Ledger entries (immutable)</h3>
          <span className="text-xs text-stext">Double-entry · balanced · audited</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-3">Ref</th>
                <th className="text-left py-3 px-3">Date</th>
                <th className="text-left py-3 px-3">Type</th>
                <th className="text-left py-3 px-3">Account</th>
                <th className="text-right py-3 px-3">Debit</th>
                <th className="text-right py-3 px-3">Credit</th>
                <th className="text-left py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.ref} className="border-b border-line/50 hover:bg-[#13201F] transition">
                  <td className="py-3 px-3 font-mono text-xs text-accent">{l.ref}</td>
                  <td className="py-3 px-3 text-stext text-xs">{l.date}</td>
                  <td className="py-3 px-3">
                    <span className="badge b-info">{l.type}</span>
                  </td>
                  <td className="py-3 px-3 text-stext">{l.acct}</td>
                  <td className="py-3 px-3 text-right">
                    {l.db > 0 ? (
                      <span className="text-err">PHP {l.db.toLocaleString()}</span>
                    ) : (
                      <span className="text-stext">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {l.cr > 0 ? (
                      <span className="text-accent">PHP {l.cr.toLocaleString()}</span>
                    ) : (
                      <span className="text-stext">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge b-ok text-[10px]">{l.st}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
