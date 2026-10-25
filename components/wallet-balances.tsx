"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/components/wallet-provider";
import { Hexagon, CircleDollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { TrustlineButton } from "@/components/trustline-button";

interface BalanceData {
  xlm: string;
  usdc: string;
  hasUsdcTrustline: boolean;
  notFunded?: boolean;
}

export function WalletBalances() {
  const { wallet } = useWallet();
  const [data, setData] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!wallet.address) return;
    try {
      setIsLoading(true);
      const resp = await fetch(`/api/wallet/balance?address=${encodeURIComponent(wallet.address)}`);
      if (resp.ok) {
        const result = await resp.json();
        setData(result);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [wallet.address]);

  useEffect(() => {
    if (!wallet.connected || !wallet.address) {
      setData(null);
      return;
    }
    fetchBalances();
    const timer = setInterval(fetchBalances, 10_000);
    return () => clearInterval(timer);
  }, [wallet.connected, wallet.address, fetchBalances]);

  if (!wallet.connected) return null;

  const xlmNum = Number(data?.xlm ?? 0);
  const usdcNum = Number(data?.usdc ?? 0);

  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* XLM Balance Card */}
        <div className="card p-4 relative overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-28 h-28 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
          />
          <div className="flex items-center justify-between text-stext text-sm mb-2 relative">
            <div className="flex items-center gap-2">
              <Hexagon size={16} color="#5DE0B0" />
              <span>Stellar Lumens (XLM)</span>
            </div>
            {isLoading && <RefreshCw size={12} className="spin text-stext" />}
          </div>
          <div className="text-2xl font-bold tracking-tight relative">
            {isLoading && !data
              ? "…"
              : `${xlmNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XLM`}
          </div>
          <div className="text-[11px] text-stext mt-1 relative">
            Native Stellar asset · Used for fees & 90/10 payments
          </div>
        </div>

        {/* USDC Balance Card */}
        <div className="card p-4 relative overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-28 h-28 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(63,191,143,.12), transparent 70%)" }}
          />
          <div className="flex items-center justify-between text-stext text-sm mb-2 relative">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} color="#3FBF8F" />
              <span>USD Coin (USDC)</span>
            </div>
            {isLoading && <RefreshCw size={12} className="spin text-stext" />}
          </div>
          <div className="text-2xl font-bold tracking-tight relative">
            {isLoading && !data
              ? "…"
              : `${usdcNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`}
          </div>

          <div className="mt-2 relative flex items-center justify-between gap-2 flex-wrap">
            {data && !data.hasUsdcTrustline ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertCircle size={12} /> No USDC trustline
                </span>
                <TrustlineButton onDone={fetchBalances} />
              </div>
            ) : (
              <span className="badge b-ok text-[11px]">Trustline active</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
