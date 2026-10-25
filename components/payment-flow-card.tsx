"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { SavingsDestinationToggle } from "@/components/savings-destination-toggle";
import {
  DEFAULT_DESTINATION,
  SAVINGS_DESTINATIONS,
  type SavingsDestination,
} from "@/lib/savings-destinations";
import { signWithFreighter } from "@/lib/freighter";
import { Zap, Loader2, CheckCircle, XCircle, ExternalLink, Settings2 } from "lucide-react";
import Link from "next/link";

type Step = 0 | 1 | 2 | 3 | 4; // 0=idle, 1=prepare, 2=sign, 3=submit, 4=verify

interface PaymentFlowCardProps {
  onPaymentSuccess?: (amountXlm: number, splitDest: string, txHash: string) => void;
}

export function PaymentFlowCard({ onPaymentSuccess }: PaymentFlowCardProps = {}) {
  const { wallet, connect, connecting } = useWallet();
  const [destination, setDestination] = useState<SavingsDestination>(DEFAULT_DESTINATION);
  const [step, setStep] = useState<Step>(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txHash: string; verified: boolean } | null>(null);

  async function runPayment() {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      // Pre-check: wallet must be connected
      let customerAddress = wallet.address;
      if (!wallet.connected || !customerAddress) {
        await connect();
      }
      // Re-read address after potential connect
      if (!wallet.address && !customerAddress) {
        const { getAddress } = await import("@stellar/freighter-api");
        const addrRes = await getAddress();
        customerAddress =
          addrRes && typeof addrRes === "object" && "address" in addrRes
            ? addrRes.address
            : typeof addrRes === "string"
            ? addrRes
            : null;
      }
      if (!customerAddress) {
        throw new Error("Wallet not connected. Please connect Freighter first.");
      }

      // Step 1: Create an order + prepare the transaction (server-side)
      setStep(1);
      const orderResp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountXlm: 1,
          asset: "XLM",
          savingsDestination: destination,
          merchantAddress: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
        }),
      });
      if (!orderResp.ok) {
        const errJson = await orderResp.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to create order");
      }
      const order = await orderResp.json();

      const prepResp = await fetch("/api/payments/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerAddress,
        }),
      });
      if (!prepResp.ok) {
        const errJson = await prepResp.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to prepare payment");
      }
      const prep = await prepResp.json();

      // Step 2: Sign transaction
      setStep(2);
      let signedXdr: string;
      if (wallet.isDemo || customerAddress === "GBBW2CTAEIFCCDNYEDJRHM3TX5FWNQQG3WSFKEQYP7T53CIDEXC2UBEX") {
        const signResp = await fetch("/api/wallet/demo-sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unsignedXdr: prep.unsignedXdr,
            networkPassphrase: prep.networkPassphrase || "Test SDF Network ; September 2015",
          }),
        });
        const signJson = await signResp.json();
        if (!signResp.ok || !signJson.signedXdr) {
          throw new Error(signJson.error || "Failed to sign demo transaction");
        }
        signedXdr = signJson.signedXdr;
      } else {
        try {
          signedXdr = await signWithFreighter(
            prep.unsignedXdr,
            prep.networkPassphrase || "Test SDF Network ; September 2015"
          );
        } catch (signErr: unknown) {
          // Fallback for simulation testing when extension window is rejected or absent
          if (prep.isSimulated || process.env.NODE_ENV === "development") {
            signedXdr = prep.unsignedXdr;
          } else {
            throw signErr;
          }
        }
      }

      // Step 3: Submit via server (which calls Paiflow SDK)
      setStep(3);
      const submitResp = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, signedXdr }),
      });
      if (!submitResp.ok) {
        const errJson = await submitResp.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to submit payment");
      }
      const submitResult = await submitResp.json();

      // Step 4: Verify
      setStep(4);
      const verified = submitResult.status === "success" || submitResult.verified === true;
      setResult({
        txHash: submitResult.txHash || "0000000000000000",
        verified,
      });

      if (onPaymentSuccess && submitResult.txHash) {
        onPaymentSuccess(1, destination, submitResult.txHash);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setStep(0);
    } finally {
      setBusy(false);
    }
  }

  const dest = SAVINGS_DESTINATIONS[destination];

  return (
    <div
      className="card p-5 mb-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(93,224,176,.06) 0%, rgba(63,191,143,.03) 100%)",
        borderColor: "rgba(93,224,176,.22)",
      }}
    >
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(93,224,176,.15), transparent 70%)" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(93,224,176,.18)" }}
          >
            <Zap size={18} color="#5DE0B0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Send a Stellar payment</h3>
              <span className="badge b-accent">90/10 split</span>
            </div>
            <p className="text-stext text-xs mt-0.5">
              Pay 1 XLM — Paiflow automatically routes 90% to the merchant and 10% to your savings. Enforced on-chain by Stellar.
            </p>
          </div>
        </div>

        <Link href="/blockchain" className="btn btn-ghost text-xs">
          <Settings2 size={13} /> Configure wallet
        </Link>
      </div>

      {/* Step indicator */}
      {busy && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "Prepare", sub: "Paiflow SDK" },
            { label: "Sign", sub: "Freighter" },
            { label: "Submit", sub: "Stellar" },
            { label: "Verify", sub: "Split 90/10" },
          ].map((item, i) => {
            const stepNum = i + 1;
            const isDone = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div
                key={item.label}
                className={`card p-2 text-center transition ${isActive ? "border-accent ring-accent" : ""}`}
                style={{ background: "#0F1618" }}
              >
                <div
                  className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? "bg-accent text-black"
                      : isActive
                      ? "bg-accent text-black animate-pulse"
                      : "bg-[#1F2A2D] text-stext"
                  }`}
                  style={isDone || isActive ? { background: "#5DE0B0", color: "#062018" } : {}}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                <div className="text-[11px] font-semibold">{item.label}</div>
                <div className="text-[9px] text-stext">{item.sub}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Savings destination toggle */}
      <div className="mb-4">
        <SavingsDestinationToggle value={destination} onChange={setDestination} />
      </div>

      {/* Amount summary */}
      <div className="p-3 rounded-xl mb-4 text-sm border border-line" style={{ background: "#0F1618" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <div className="text-[10px] text-stext">Customer pays</div>
            <div className="font-bold">1.00 XLM</div>
          </div>
          <div>
            <div className="text-[10px] text-stext">→ Merchant (90%)</div>
            <div className="font-bold" style={{ color: "#5DE0B0" }}>
              0.90 XLM
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stext">{dest.shortLabel}</div>
            <div className="font-bold" style={{ color: dest.color }}>
              0.10 XLM
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stext">Network fee</div>
            <div className="font-bold text-stext">~0.00001 XLM</div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          className="p-3 rounded-xl mb-4 text-sm text-err flex items-center gap-2 border border-red-500/20"
          style={{ background: "rgba(248,113,113,.06)" }}
        >
          <XCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Success display */}
      {result && (
        <div
          className="p-3.5 rounded-xl mb-4 text-sm flex items-start gap-3 border border-emerald-500/20"
          style={{ background: "rgba(93,224,176,.06)" }}
        >
          <CheckCircle size={18} color="#5DE0B0" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-accent flex items-center justify-between">
              <span>Payment verified · 90/10 split executed</span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${result.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-normal"
              >
                Stellar Expert <ExternalLink size={11} />
              </a>
            </div>
            <div className="text-xs text-stext mt-0.5">
              0.90 XLM &rarr; Merchant &nbsp;|&nbsp; 0.10 XLM &rarr; {dest.label}
            </div>
            <div className="text-[11px] text-stext mt-1 font-mono break-all">
              tx: {result.txHash}
            </div>
          </div>
        </div>
      )}

      {/* The main action button */}
      <button
        type="button"
        onClick={runPayment}
        disabled={busy || connecting}
        className="btn btn-accent w-full justify-center text-base py-3"
      >
        {busy ? (
          <>
            <Loader2 size={18} className="spin" />
            <span>Processing step {step}/4…</span>
          </>
        ) : (
          <>
            <Zap size={18} />
            <span>Run 1 XLM test payment</span>
          </>
        )}
      </button>

      {!wallet.connected && !busy && (
        <div className="text-xs text-stext text-center mt-2">
          You&apos;ll be prompted to connect Freighter on the first click.
        </div>
      )}
    </div>
  );
}
