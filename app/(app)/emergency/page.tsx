"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Check, X, AlertTriangle } from "lucide-react";

export default function EmergencyPage() {
  const router = useRouter();
  const [reason, setReason] = useState("Urgent medicine");
  const [amount, setAmount] = useState<number>(1500);
  const [recipient, setRecipient] = useState("Mercury Drug");
  const [purpose, setPurpose] = useState("Medical");
  const [explanation, setExplanation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleConfirmSubmit() {
    await fetch("/api/emergency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason,
        amountPhp: amount,
        recipient,
        purpose,
        explanation,
      }),
    });
    setModalOpen(false);
    setSubmitted(true);
    setTimeout(() => {
      router.push("/transactions");
    }, 1500);
  }

  return (
    <div className="space-y-4">
      <div>
        <div
          className="demo-pill inline-block mb-2"
          style={{ background: "rgba(248,113,113,.12)", color: "#F87171", borderColor: "rgba(248,113,113,.3)" }}
        >
          EMERGENCY
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">Emergency Mode</h1>
        <p className="text-stext text-sm mt-1">
          Request a one-time exception to your normal spending policy. All requests are logged and audited.
        </p>
      </div>

      {submitted && (
        <div className="card p-3 px-4 bg-card border-ok text-accent text-sm flex items-center gap-2">
          <Check size={16} />
          <span>Emergency exception authorized and executed successfully.</span>
        </div>
      )}

      {/* Emergency Explanation Banner */}
      <div
        className="card p-5"
        style={{ background: "rgba(248,113,113,.06)", borderColor: "rgba(248,113,113,.22)" }}
      >
        <div className="flex gap-3">
          <ShieldAlert size={22} color="#F87171" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-err mb-1">How emergency mode works</p>
            <p className="text-stext leading-relaxed">
              Emergency mode does not create money or bypass authentication. An approved exception grants a limited,
              one-time authorization for an exact amount and recipient expiring in 2 hours. Funds availability and
              identity checks still apply. All actions are strictly audit-logged.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Emergency Request Form */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-5">Emergency request</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Emergency reason *</label>
              <select className="input" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option>Urgent medicine</option>
                <option>Emergency transportation</option>
                <option>Urgent family need</option>
                <option>Unexpected essential expense</option>
                <option>Other emergency</option>
              </select>
            </div>

            <div>
              <label className="field-label">Requested amount (PHP) *</label>
              <input
                className="input"
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="field-label">Recipient *</label>
              <input
                className="input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Merchant or recipient"
              />
            </div>

            <div>
              <label className="field-label">Transaction purpose *</label>
              <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>Medical</option>
                <option>Transportation</option>
                <option>Family expenses</option>
                <option>Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Short explanation (optional)</label>
              <textarea
                className="input"
                rows={2}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Brief context only — no sensitive medical details required"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl mt-5 space-y-2 text-sm" style={{ background: "#0F1618" }}>
            <div className="flex justify-between">
              <span className="text-stext">Normal remaining allowance</span>
              <span>PHP 1,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Requested exception</span>
              <span className="text-warn">PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Exception type</span>
              <span>One-time payment</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Expiration</span>
              <span>2 hours from approval</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-danger w-full justify-center mt-5 text-sm py-3"
            onClick={() => setModalOpen(true)}
          >
            <ShieldAlert size={16} /> Submit emergency request
          </button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Authorization scope</h3>
            <ul className="space-y-2 text-xs text-stext">
              <li className="flex items-center gap-2">
                <Check size={14} color="#5DE0B0" /> Exact authorized amount
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} color="#5DE0B0" /> Exact recipient only
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} color="#5DE0B0" /> Expiration time enforced (2h)
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} color="#5DE0B0" /> Duplicate protection
              </li>
              <li className="flex items-center gap-2">
                <X size={14} color="#F87171" /> Changes require reauthorization
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Recent emergency requests</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg" style={{ background: "#0F1618" }}>
                <span>Medical · PHP 2,000</span>
                <span className="badge b-ok text-[10px]">Completed</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg" style={{ background: "#0F1618" }}>
                <span>Transport · PHP 800</span>
                <span className="badge b-err text-[10px]">Expired</span>
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
                style={{ background: "rgba(248,113,113,.12)" }}
              >
                <ShieldAlert size={26} color="#F87171" />
              </div>
              <h3 className="text-lg font-bold mb-1">Submit emergency request</h3>
              <p className="text-stext text-sm">One-time exception · expires in 2 hours</p>
            </div>

            <div className="p-4 rounded-xl mb-4 space-y-2 text-sm" style={{ background: "#0F1618" }}>
              <div className="flex justify-between">
                <span className="text-stext">Reason</span>
                <span>{reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Amount</span>
                <span className="text-warn font-semibold">PHP {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Recipient</span>
                <span>{recipient}</span>
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
                className="btn btn-danger flex-1 justify-center text-xs"
                onClick={handleConfirmSubmit}
              >
                Submit request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
