"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Smartphone, Building2, ArrowDownToLine, Info, CheckCircle, X } from "lucide-react";

export default function AddMoneyPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"instant" | "gcash" | "bank">("instant");
  const [amount, setAmount] = useState<number>(5000);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleConfirmDeposit() {
    setBusy(true);
    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPhp: amount,
          method: method === "instant" ? "Instant Funding" : method === "gcash" ? "GCash" : "Bank Transfer",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setSuccessMsg(`PHP ${amount.toLocaleString()} credited successfully via ${data.ref}!`);
        setTimeout(() => {
          router.push("/wallet");
        }, 1200);
      }
    } catch {
      setModalOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Add Money</h1>
        <p className="text-stext text-sm mt-1">
          Fund your SpendGuard account through supported rails. All deposits are reconciled before crediting.
        </p>
      </div>

      {successMsg && (
        <div className="card p-3 px-4 bg-card border-accent text-accent text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Deposit Form */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-4">1. Choose funding method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div
              onClick={() => setMethod("instant")}
              className={`card p-4 cursor-pointer transition ${
                method === "instant" ? "border-accent ring-accent" : "hover:border-[#2a3a3e]"
              }`}
              style={{ borderColor: method === "instant" ? "#5DE0B0" : undefined }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} color="#5DE0B0" />
                <span className="font-semibold text-sm">Instant Funding</span>
              </div>
              <div className="text-xs text-stext">Instant credit · No fee</div>
              <span className="badge b-ok text-[10px] mt-2">Active</span>
            </div>

            <div
              onClick={() => setMethod("gcash")}
              className={`card p-4 cursor-pointer transition ${
                method === "gcash" ? "border-accent ring-accent" : "hover:border-[#2a3a3e]"
              }`}
              style={{ borderColor: method === "gcash" ? "#5DE0B0" : undefined }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={18} color="#5DE0B0" />
                <span className="font-semibold text-sm">GCash</span>
              </div>
              <div className="text-xs text-stext">Planned · 0% fee</div>
              <span className="badge b-warn text-[10px] mt-2">Planned</span>
            </div>

            <div
              onClick={() => setMethod("bank")}
              className={`card p-4 cursor-pointer transition ${
                method === "bank" ? "border-accent ring-accent" : "hover:border-[#2a3a3e]"
              }`}
              style={{ borderColor: method === "bank" ? "#5DE0B0" : undefined }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={18} color="#5DE0B0" />
                <span className="font-semibold text-sm">Bank Transfer</span>
              </div>
              <div className="text-xs text-stext">InstaPay / PESONet</div>
              <span className="badge b-info text-[10px] mt-2">Coming</span>
            </div>
          </div>

          <h3 className="font-bold mb-4">2. Enter amount</h3>
          <div className="flex items-center gap-2.5 input mb-4 px-4 py-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <span className="text-stext font-semibold text-lg select-none flex-shrink-0 tracking-wide">
              PHP
            </span>
            <input
              className="bg-transparent border-0 outline-none text-2xl font-bold text-ptext w-full p-0 focus:ring-0 focus:outline-none"
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[1000, 2000, 5000, 10000].map((preset) => (
              <button
                key={preset}
                type="button"
                className="btn btn-soft text-xs"
                onClick={() => setAmount(preset)}
              >
                PHP {preset.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl mb-4 space-y-2 text-sm" style={{ background: "#0F1618" }}>
            <div className="flex justify-between">
              <span className="text-stext">Amount</span>
              <span>PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Fee</span>
              <span>PHP 0.00</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-line pt-2">
              <span>You receive</span>
              <span className="text-accent">PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-accent w-full justify-center text-sm py-3"
            onClick={() => setModalOpen(true)}
          >
            <ArrowDownToLine size={16} /> Continue to deposit
          </button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Deposit flow</h3>
            <ol className="space-y-2.5 text-xs text-stext">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-bg flex items-center justify-center font-bold text-[10px] flex-shrink-0" style={{ color: "#062018" }}>
                  1
                </span>
                <span>Select funding method</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-card2 text-stext flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  2
                </span>
                <span>Enter amount & review fees</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-card2 text-stext flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  3
                </span>
                <span>Complete provider payment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-card2 text-stext flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  4
                </span>
                <span>Backend verifies via webhook</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-card2 text-stext flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                  5
                </span>
                <span>Funds reconciled & credited</span>
              </li>
            </ol>
          </div>

          <div
            className="card p-5 text-xs"
            style={{ background: "rgba(245,158,11,.05)", borderColor: "rgba(245,158,11,.2)" }}
          >
            <div className="flex gap-2">
              <Info size={16} color="#F59E0B" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-warn mb-1">GCash integration note</p>
                <p className="text-stext">
                  SpendGuard will never ask for your GCash password, MPIN, or OTP. Official partner access is scheduled
                  for general availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setModalOpen(false)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <ArrowDownToLine size={26} color="#5DE0B0" />
              </div>
              <h3 className="text-lg font-bold mb-1">Confirm deposit</h3>
              <p className="text-stext text-sm">
                Instant Funding · PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-4 rounded-xl mb-4 space-y-2 text-sm" style={{ background: "#0F1618" }}>
              <div className="flex justify-between text-stext">
                <span>Amount</span>
                <span className="text-ptext">PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-stext">
                <span>Fee</span>
                <span className="text-ptext">PHP 0.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-line pt-2">
                <span>You receive</span>
                <span className="text-accent">PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-accent flex-1 justify-center text-xs"
                disabled={busy}
                onClick={handleConfirmDeposit}
              >
                Confirm deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
