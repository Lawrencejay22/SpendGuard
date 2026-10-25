"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import { signWithFreighter } from "@/lib/freighter";
import { Link2, Loader2, CheckCircle } from "lucide-react";

export function TrustlineButton({ onDone }: { onDone?: () => void }) {
  const { wallet } = useWallet();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function establishTrustline() {
    if (!wallet.address) return;
    setBusy(true);
    setError(null);
    try {
      // 1. Server builds the trustline XDR
      const buildResp = await fetch("/api/wallet/trustline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address }),
      });
      if (!buildResp.ok) {
        const errData = await buildResp.json();
        throw new Error(errData.error || "Failed to build trustline");
      }
      const { unsignedXdr, networkPassphrase } = await buildResp.json();

      // 2. Browser signs via Freighter
      const signedXdr = await signWithFreighter(unsignedXdr, networkPassphrase);

      // 3. Server submits to Stellar
      const submitResp = await fetch("/api/wallet/trustline/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedXdr }),
      });
      const result = await submitResp.json();

      if (result.success) {
        setDone(true);
        if (onDone) onDone();
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Trustline setup failed";
      setError(msg);
      alert(msg);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <span className="badge b-ok inline-flex items-center gap-1">
        <CheckCircle size={12} /> Trustline active
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="btn btn-soft text-xs"
        onClick={establishTrustline}
        disabled={busy || !wallet.connected}
      >
        {busy ? <Loader2 size={13} className="spin" /> : <Link2 size={13} />}
        {busy ? "Establishing…" : "Establish USDC trustline"}
      </button>
      {error && <span className="text-[11px] text-err">{error}</span>}
    </div>
  );
}
