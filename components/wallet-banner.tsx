"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/wallet-provider";
import {
  Loader2,
  Hexagon,
  Link as LinkIcon,
  LogOut,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Zap,
} from "lucide-react";

export function WalletBanner() {
  const { wallet, connecting, error, connect, connectDemo, disconnect } = useWallet();
  const [showGuide, setShowGuide] = useState(false);

  // Connected state
  if (wallet.connected && wallet.address) {
    const shortAddr = `${wallet.address.slice(0, 6)}…${wallet.address.slice(-6)}`;
    const isTestnet = wallet.network ? wallet.network.includes("TESTNET") : true;

    return (
      <div className="card p-4 mb-4 relative overflow-hidden space-y-3">
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: isTestnet ? "rgba(93,224,176,.12)" : "rgba(245,158,11,.12)" }}
            >
              <Hexagon size={20} color={isTestnet ? "#5DE0B0" : "#F59E0B"} />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2 flex-wrap">
                Stellar Wallet
                <span className={`badge ${isTestnet ? "b-ok" : "b-warn"}`}>
                  <span
                    className="w-1.5 h-1.5 rounded-full pulse-dot"
                    style={{ background: isTestnet ? "#5DE0B0" : "#F59E0B" }}
                  />
                  Connected · {shortAddr} ({wallet.network || "TESTNET"})
                </span>
              </div>
              <div className="text-xs text-stext mt-0.5">
                {isTestnet
                  ? "Freighter connected on Stellar Testnet. 90/10 split ready."
                  : "Freighter connected. Note: On-chain transactions will be submitted to Stellar Testnet."}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            {!isTestnet && (
              <button
                type="button"
                className="btn btn-soft text-xs"
                onClick={() => setShowGuide(!showGuide)}
              >
                <HelpCircle size={13} /> Switch to Testnet
              </button>
            )}
            <button type="button" className="btn btn-ghost text-xs" onClick={disconnect}>
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        </div>

        {/* Notice if wallet is on Public network */}
        {!isTestnet && (
          <div
            className="p-3 rounded-xl text-xs flex items-start gap-2 border border-amber-500/20"
            style={{ background: "rgba(245,158,11,.08)" }}
          >
            <AlertTriangle size={15} color="#F59E0B" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-warn">Freighter is set to Public network. </span>
              <span className="text-stext">
                To fund from Friendbot and use testnet USDC, switch Freighter to <strong>Testnet</strong> (Open extension &rarr; ⚙️ Settings &rarr; Network &rarr; Testnet).
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Disconnected / idle state
  return (
    <div className="card p-4 mb-4 relative overflow-hidden space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 relative">
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
              <div className="text-xs text-err mt-1.5 flex items-center gap-1.5">
                <AlertTriangle size={13} /> {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-accent"
            onClick={connect}
            disabled={connecting}
          >
            {connecting ? <Loader2 size={16} className="spin" /> : <LinkIcon size={16} />}
            {connecting ? "Connecting…" : "Connect Wallet"}
          </button>
          <button
            type="button"
            className="btn btn-soft text-xs"
            onClick={connectDemo}
            title="Connect pre-funded Testnet Demo Wallet"
          >
            <Zap size={14} color="#5DE0B0" /> Use Demo Wallet
          </button>
        </div>
      </div>

      {/* Helper guide when error or when user clicks */}
      {error && error.includes("Wrong network") && (
        <div
          className="p-3.5 rounded-xl text-xs space-y-2 border border-amber-500/25"
          style={{ background: "#0F1618" }}
        >
          <div className="font-semibold text-warn flex items-center gap-1.5">
            <AlertTriangle size={14} /> How to switch Freighter to Testnet:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-stext text-[11px] pl-1">
            <li>Click the <strong>Freighter icon</strong> in your browser&apos;s extension toolbar.</li>
            <li>Click the gear icon (<strong>⚙️ Settings</strong>) in the top-right of Freighter.</li>
            <li>Under <strong>Network</strong>, select <strong>Testnet</strong>.</li>
            <li>Click <strong>Connect Wallet</strong> above.</li>
          </ol>
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              className="btn btn-accent text-xs py-1.5 px-3"
              onClick={connect}
            >
              Try Reconnect
            </button>
            <span className="text-stext text-[11px]">or</span>
            <button
              type="button"
              className="btn btn-ghost text-xs py-1.5 px-3"
              onClick={connectDemo}
            >
              Use Demo Testnet Wallet (1-Click)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
