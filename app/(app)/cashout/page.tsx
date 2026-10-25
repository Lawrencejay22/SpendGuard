"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function CashoutPage() {
  const router = useRouter();
  const [purpose, setPurpose] = useState("Food");
  const [amount, setAmount] = useState<number>(500);
  const [dest, setDest] = useState("GCash — +63 9XX 123 4567 (verified)");
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fee = 10;
  const remainingAllowance = 500; // PHP 500 remaining today

  function handleReview() {
    setErrorMsg(null);
    if (!amount || amount <= 0) {
      setErrorMsg("Please enter a valid cash-out amount.");
      return;
    }
    if (amount > remainingAllowance) {
      setErrorMsg(
        `Rejected: PHP ${amount.toLocaleString()} exceeds your remaining daily cash-out allowance (PHP ${remainingAllowance.toLocaleString()}).`,
      );
      return;
    }
    setModalOpen(true);
  }

  async function handleAuthorize() {
    try {
      const res = await fetch("/api/cashouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPhp: amount,
          purpose,
          destination: dest,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Cashout failed");
        setModalOpen(false);
        return;
      }
      setModalOpen(false);
      router.push("/transactions");
    } catch {
      setModalOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Cash-Out</h1>
        <p className="text-stext text-sm mt-1">
          Withdraw funds to a verified destination. Purpose is required for accountability.
        </p>
      </div>

      {errorMsg && (
        <div className="card p-3 px-4 bg-card border-err text-err text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form Card */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-5">Cash-out details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">Transaction purpose *</label>
              <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>Food</option>
                <option>Groceries</option>
                <option>Transportation</option>
                <option>Bills</option>
                <option>Education</option>
                <option>Medical</option>
                <option>Shopping</option>
                <option>Family expenses</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="field-label">Amount (PHP) *</label>
              <input
                className="input"
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="field-label">Destination *</label>
              <select className="input" value={dest} onChange={(e) => setDest(e.target.value)}>
                <option>GCash — +63 9XX 123 4567 (verified)</option>
                <option>Bank — BPI ****1234 (verified)</option>
                <option>Bank — BDO ****5678 (verified)</option>
              </select>
            </div>

            <div>
              <label className="field-label">Category (optional)</label>
              <select className="input">
                <option>General</option>
                <option>Savings</option>
                <option>Family support</option>
                <option>Emergency</option>
              </select>
            </div>

            <div>
              <label className="field-label">Notes (optional)</label>
              <input className="input" placeholder="Short description" />
            </div>
          </div>

          <div className="p-4 rounded-xl mt-5 space-y-2 text-sm" style={{ background: "#0F1618" }}>
            <div className="flex justify-between">
              <span className="text-stext">Requested amount</span>
              <span>PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Cash-out fee</span>
              <span>PHP {fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Remaining cash-out allowance</span>
              <span className="text-accent">PHP {remainingAllowance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-line pt-2">
              <span>Total deducted</span>
              <span>PHP {(amount + fee).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="button"
              className="btn btn-ghost flex-1 justify-center text-xs"
              onClick={() => router.push("/transactions")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-accent flex-1 justify-center text-xs"
              onClick={handleReview}
            >
              <ShieldCheck size={16} /> Review & authorize
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Today&apos;s cash-out budget</h3>
            <div className="text-2xl font-bold mb-1">PHP 500 / 1,000</div>
            <div className="progress warn">
              <span style={{ width: "50%" }} />
            </div>
            <div className="text-xs text-stext mt-2">After this cash-out: PHP 0 remaining allowance</div>
          </div>

          <div
            className="card p-5 text-xs"
            style={{ background: "rgba(248,113,113,.05)", borderColor: "rgba(248,113,113,.2)" }}
          >
            <div className="flex gap-2">
              <AlertTriangle size={18} color="#F87171" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-err mb-1">Reservation safety</p>
                <p className="text-stext">
                  Funds are reserved atomically. If the provider fails, the reservation is reconciled correctly — never
                  released on timeout alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Authorization Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setModalOpen(false)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <ShieldCheck size={26} color="#5DE0B0" />
              </div>
              <h3 className="text-lg font-bold mb-1">Authorize cash-out</h3>
              <p className="text-stext text-sm">Enter your 6-digit 2FA code to authorize</p>
            </div>

            <div className="flex justify-center gap-2 mb-5">
              {["1", "2", "3", "4", "5", "6"].map((val, idx) => (
                <input
                  key={idx}
                  className="input text-center font-bold text-lg w-12 p-0"
                  maxLength={1}
                  defaultValue={val}
                />
              ))}
            </div>

            <div className="p-3 rounded-xl mb-4 text-xs text-stext space-y-1" style={{ background: "#0F1618" }}>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="text-ptext">PHP {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee</span>
                <span className="text-ptext">PHP 10.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total deducted</span>
                <span className="text-ptext">PHP {(amount + 10).toFixed(2)}</span>
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
                onClick={handleAuthorize}
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
