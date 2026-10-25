"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, AlertTriangle, Info } from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState("GroceryMart PH");
  const [amount, setAmount] = useState<number>(800);
  const [purpose, setPurpose] = useState("Groceries");
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const remainingDailySpend = 1200; // PHP 1,200 remaining today

  function handleAuthorizeClick() {
    setErrorMsg(null);
    if (!amount || amount <= 0) {
      setErrorMsg("Please enter a valid payment amount.");
      return;
    }
    if (amount > remainingDailySpend) {
      setErrorMsg(
        `Policy check failed: PHP ${amount.toLocaleString()} exceeds your remaining daily allowance (PHP ${remainingDailySpend.toLocaleString()}).`,
      );
      return;
    }
    setModalOpen(true);
  }

  function handleTestRejection() {
    setAmount(1500);
    setErrorMsg(
      `Policy check: PHP 1,500 exceeds remaining allowance PHP 1,200. Transaction rejected by server spending policy engine.`,
    );
  }

  async function handleConfirmPayment() {
    setModalOpen(false);
    router.push("/transactions");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Online Payments</h1>
        <p className="text-stext text-sm mt-1">
          Pay supported merchants from your controlled SpendGuard account with purpose verification.
        </p>
      </div>

      {errorMsg && (
        <div className="card p-3 px-4 bg-card border-err text-err text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Form */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-5">Payment details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">Merchant or recipient *</label>
              <select className="input" value={merchant} onChange={(e) => setMerchant(e.target.value)}>
                <option>GroceryMart PH</option>
                <option>FoodPanda</option>
                <option>Meralco Bills</option>
                <option>Smart Communications</option>
                <option>Shopee PH</option>
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
              <label className="field-label">Purpose *</label>
              <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>Groceries</option>
                <option>Food</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Transportation</option>
                <option>Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Notes (optional)</label>
              <input className="input" placeholder="Short description" />
            </div>
          </div>

          <div className="p-4 rounded-xl mt-5 space-y-2 text-sm" style={{ background: "#0F1618" }}>
            <div className="flex justify-between">
              <span className="text-stext">Amount</span>
              <span>PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Fee</span>
              <span>PHP 0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stext">Remaining spend allowance</span>
              <span className="text-accent">PHP {remainingDailySpend.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-line pt-2">
              <span>Total</span>
              <span className="text-accent">PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              type="button"
              className="btn btn-ghost flex-1 justify-center text-xs"
              onClick={handleTestRejection}
            >
              Test rejection (PHP 1,500)
            </button>
            <button
              type="button"
              className="btn btn-accent flex-1 justify-center text-xs"
              onClick={handleAuthorizeClick}
            >
              <ShieldCheck size={16} /> Authorize payment
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Today&apos;s spend budget</h3>
            <div className="text-2xl font-bold mb-1">PHP 800 / 2,000</div>
            <div className="progress">
              <span style={{ width: "40%" }} />
            </div>
            <div className="text-xs text-stext mt-2">After this payment: PHP 400 remaining</div>
          </div>

          <div
            className="card p-5 text-xs"
            style={{ background: "rgba(245,158,11,.05)", borderColor: "rgba(245,158,11,.2)" }}
          >
            <div className="flex gap-2">
              <Info size={16} color="#F59E0B" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-warn mb-1">Scope of control</p>
                <p className="text-stext">
                  SpendGuard controls transactions through its authorization system. Each transaction requires a purpose
                  and is checked atomically against your spending policy.
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
                <CreditCard size={26} color="#5DE0B0" />
              </div>
              <h3 className="text-lg font-bold mb-1">Confirm payment</h3>
              <p className="text-stext text-sm">
                {merchant} · PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-4 rounded-xl mb-4 space-y-2 text-sm" style={{ background: "#0F1618" }}>
              <div className="flex justify-between">
                <span className="text-stext">Merchant</span>
                <span>{merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Purpose</span>
                <span>{purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Amount</span>
                <span>PHP {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Policy check</span>
                <span className="badge b-ok">Passed</span>
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
                onClick={handleConfirmPayment}
              >
                Authorize & pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
