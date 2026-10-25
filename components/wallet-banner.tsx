"use client";

import React from "react";
import { useWallet } from "@/components/wallet-provider";
import { Loader2, Hexagon, Link as LinkIcon, LogOut, AlertTriangle } from "lucide-react";

export function WalletBanner() {
  const { wallet, connecting, error, connect, disconnect } = useWallet();

  // Connected state
  if (wallet.connected && wallet.address) {
    const shortAddr = `${wallet.address.slice(0, 6)}…${wallet.address.slice(-6)}`;
    return (
      <div className="card p-4 mb-4 flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
        />
        <div className="flex items-center gap-3 relative">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(93,224,176,.12)" }}
          >
            <Hexagon size={20} color="#5DE0B0" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              Stellar Wallet
              <span className="badge b-ok">
                <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" style={{ background: "#5DE0B0" }} />
                Connected · {shortAddr}
              </span>
            </div>
            <div className="text-xs text-stext">
              Wallet connected on Stellar testnet. Run a 1 XLM payment below to see the 90/10 split.
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-ghost text-xs relative" onClick={disconnect}>
          <LogOut size={14} /> Disconnect
        </button>
      </div>
    );
  }

  // Disconnected / idle state
  return (
    <div className="card p-4 mb-4 flex flex-wrap items-center justify-between gap-3 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(245,158,11,.12)" }}
        >
          <Hexagon size={20} color="#F59E0B" />
        </div>
        <div>
          <div className="font-semibold flex items-center gap-2">
            Stellar Wallet
            <span className="badge b-warn">
              <span className="w-1.5 h-1.5 rounded-full bg-warn" /> Not connected
            </span>
          </div>
          <div className="text-xs text-stext">
            Connect your Stellar wallet to enable on-chain payments with automatic 10% savings.
          </div>
          {error && (
            <div className="text-xs text-err mt-1 flex items-center gap-1.5">
              <AlertTriangle size={13} /> {error}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-accent"
        onClick={connect}
        disabled={connecting}
      >
        {connecting ? <Loader2 size={16} className="spin" /> : <LinkIcon size={16} />}
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
    </div>
  );
}
