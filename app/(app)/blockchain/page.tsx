"use client";

import React, { useState } from "react";
import {
  Wallet,
  Hexagon,
  CircleDollarSign,
  Droplets,
  Coins,
  Copy,
  ExternalLink,
  Link2,
  Check,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Key,
  X,
  Loader2,
} from "lucide-react";
import { connectFreighter } from "@/lib/freighter";
import { fundWithFriendbot } from "@/lib/stellar";
import { SplitDestination, SplitDestinationToggle } from "@/components/split-destination-toggle";

interface OnChainTx {
  hash: string;
  type: string;
  asset: string;
  amount: number;
  ledger: number;
  status: "success" | "pending" | "failed";
  memo: string;
}

export default function BlockchainPage() {
  const [connected, setConnected] = useState(true);
  const [address, setAddress] = useState(
    "GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP",
  );
  const [xlmBalance, setXlmBalance] = useState(10000.0);
  const [usdcBalance, setUsdcBalance] = useState(100.0);
  const [trustline, setTrustline] = useState(true);

  // Flow State
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [running, setRunning] = useState(false);
  const [splitDest, setSplitDest] = useState<SplitDestination>("savings");
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [txList, setTxList] = useState<OnChainTx[]>([
    {
      hash: "2c4f8b21e091...",
      type: "Payment",
      asset: "USDC",
      amount: -25.0,
      ledger: 4829173,
      status: "success",
      memo: "Groceries · GroceryMart PH",
    },
    {
      hash: "9a823f17d452...",
      type: "Receive",
      asset: "USDC",
      amount: 100.0,
      ledger: 4829161,
      status: "success",
      memo: "Mint from USDC faucet (testnet)",
    },
    {
      hash: "1d6ce740b829...",
      type: "Payment",
      asset: "USDC",
      amount: -15.5,
      ledger: 4829155,
      status: "success",
      memo: "Transportation",
    },
    {
      hash: "4b1af8c2a114...",
      type: "Trustline",
      asset: "USDC",
      amount: 0,
      ledger: 4829148,
      status: "success",
      memo: "Established USDC trustline",
    },
    {
      hash: "7e3d2a19c532...",
      type: "Create account",
      asset: "XLM",
      amount: 10000.0,
      ledger: 4829132,
      status: "success",
      memo: "Funded by Friendbot (testnet)",
    },
  ]);

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-6)}` : "";

  function notify(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  async function handleConnect() {
    try {
      const state = await connectFreighter();
      setAddress(state.address || "");
      setConnected(state.connected);
      notify("Connected to Freighter testnet wallet");
    } catch {
      setAddress("GDKXJ2XKM7W5VJ3KQ4HJ6N7YBQ3RPZ5LXE7TXQHW4VXJYCIWQE4DKMNP");
      setConnected(true);
      notify("Connected to demo testnet wallet");
    }
  }

  async function handleFaucetXlm() {
    notify("Requesting testnet XLM from Friendbot…");
    const res = await fundWithFriendbot(address);
    if (res.success) {
      setXlmBalance((prev) => prev + 10000);
      notify("10,000 XLM credited via Friendbot!");
    } else {
      setXlmBalance((prev) => prev + 10000);
      notify("10,000 XLM simulated credit.");
    }
  }

  function handleFaucetUsdc() {
    if (!trustline) {
      notify("Establish USDC trustline first!");
      return;
    }
    setUsdcBalance((prev) => prev + 100);
    notify("100 USDC minted from testnet faucet!");
  }

  function copyAddress() {
    navigator.clipboard?.writeText(address);
    notify("Stellar public key copied to clipboard");
  }

  async function run1XlmPayment() {
    if (running) return;
    setRunning(true);
    setStep(1);

    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          setStep(4);
          setXlmBalance((prev) => Math.max(0, prev - 1));

          const hash = Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
          const short = `${hash.slice(0, 6)}…${hash.slice(-4)}`;

          setTxList((prev) => [
            {
              hash: short,
              type: "Payment",
              asset: "XLM",
              amount: -1.0,
              ledger: 4829200 + Math.floor(Math.random() * 50),
              status: "success",
              memo: "Customer → Paiflow Split (1 XLM)",
            },
            {
              hash: short,
              type: "Split payout",
              asset: "XLM",
              amount: 0.9,
              ledger: 4829200 + Math.floor(Math.random() * 50),
              status: "success",
              memo: "→ Merchant (90%)",
            },
            {
              hash: short,
              type: "Split payout",
              asset: "XLM",
              amount: 0.1,
              ledger: 4829200 + Math.floor(Math.random() * 50),
              status: "success",
              memo: `→ Savings: ${splitDest} (10%)`,
            },
            ...prev,
          ]);

          setModalOpen(true);
          setRunning(false);
        }, 700);
      }, 600);
    }, 700);
  }

  return (
    <div className="space-y-4">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[80] card p-3 px-4 bg-card border-accent text-accent text-sm shadow-xl flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Blockchain Wallet</h1>
        <p className="text-stext text-sm mt-1">
          Your Stellar testnet account holding XLM and USDC. On-chain balances are separate from your PHP ledger.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(93,224,176,.12)" }}
          >
            <Wallet size={20} color="#5DE0B0" />
          </div>
          <div>
            <div className="font-semibold">Stellar Wallet Connection</div>
            <div className="text-xs text-stext">
              {connected ? (
                <span className="text-accent flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" /> Connected · {shortAddr}
                </span>
              ) : (
                "Not connected · Click Connect Wallet to bind Freighter"
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!connected ? (
            <button type="button" className="btn btn-accent" onClick={handleConnect}>
              Connect Wallet
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost text-xs"
              onClick={() => {
                setConnected(false);
                notify("Wallet disconnected");
              }}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Account Info & Trustline Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold mb-4 text-sm">Stellar Testnet Account</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-stext flex-shrink-0">Public address</span>
              <div className="flex items-center gap-2 min-w-0">
                <code className="font-mono text-xs truncate text-accent">{address}</code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="btn btn-ghost p-1.5"
                  title="Copy address"
                >
                  <Copy size={13} />
                </button>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost p-1.5"
                  title="View on Stellar Expert"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stext">Network</span>
              <span className="badge b-info">Stellar Testnet (SDF)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Minimum XLM reserve</span>
              <span className="font-medium">1 XLM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">USDC trustline</span>
              <span className={`badge ${trustline ? "b-ok" : "b-warn"}`}>
                {trustline ? "Active" : "Not established"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Policy contract (Soroban)</span>
              <code className="font-mono text-xs text-accent">C…spendguard_policy</code>
            </div>
          </div>
        </div>

        {/* USDC Trustline Setup */}
        <div className="card p-5">
          <h3 className="font-bold mb-2 text-sm">USDC Trustline</h3>
          <p className="text-xs text-stext mb-4">
            Before receiving or sending USDC, your wallet establishes a ChangeTrust operation to Circle&apos;s testnet
            issuer.
          </p>
          <div className="p-3 rounded-xl text-xs text-stext mb-4 space-y-1" style={{ background: "#0F1618" }}>
            <div className="flex justify-between">
              <span>Asset code</span>
              <span className="font-mono text-ptext">USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Issuer</span>
              <span className="font-mono text-[10px] text-accent">GBBD47…FLA5</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className={trustline ? "text-accent font-semibold" : "text-warn"}>
                {trustline ? "Active" : "Pending"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-soft w-full justify-center text-xs"
            onClick={() => {
              setTrustline(true);
              notify("USDC trustline established on Stellar Testnet");
            }}
          >
            <Link2 size={14} /> Establish trustline
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5 stat-spark relative overflow-hidden">
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(93,224,176,.12), transparent 70%)" }}
          />
          <div className="flex items-center gap-2 text-stext text-sm mb-2 relative">
            <Hexagon size={16} color="#5DE0B0" />
            <span>XLM Balance</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight relative">
            {xlmBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span className="text-sm text-stext font-medium">XLM</span>
          </div>
          <div className="text-xs text-stext mt-1 relative">Native Stellar asset · Used for fees & 90/10 split</div>
        </div>

        <div className="card p-5 stat-spark relative overflow-hidden">
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(63,191,143,.12), transparent 70%)" }}
          />
          <div className="flex items-center gap-2 text-stext text-sm mb-2 relative">
            <CircleDollarSign size={16} color="#3FBF8F" />
            <span>USDC Balance</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight relative">
            {usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            <span className="text-sm text-stext font-medium">USDC</span>
          </div>
          <div className="text-xs text-stext mt-1 relative">Testnet stablecoin · 1 USDC ≈ 1 USD (test value)</div>
        </div>
      </div>

      {/* Faucet & Funding */}
      <div className="card p-5">
        <h3 className="font-bold mb-3 text-sm">Fund testnet account</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <button
            type="button"
            className="btn btn-soft justify-start text-left p-4 cursor-pointer"
            onClick={handleFaucetXlm}
          >
            <Droplets size={22} color="#5DE0B0" className="flex-shrink-0 mr-1" />
            <div>
              <div className="font-semibold">Request testnet XLM</div>
              <div className="text-xs text-stext">Free Friendbot faucet · 10,000 XLM per request</div>
            </div>
          </button>

          <button
            type="button"
            className="btn btn-soft justify-start text-left p-4 cursor-pointer"
            onClick={handleFaucetUsdc}
          >
            <Coins size={22} color="#3FBF8F" className="flex-shrink-0 mr-1" />
            <div>
              <div className="font-semibold">Mint testnet USDC</div>
              <div className="text-xs text-stext">Requires active trustline · Circle testnet</div>
            </div>
          </button>
        </div>
      </div>

      {/* 1 XLM Test Payment Full Simulator */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold">1 XLM test payment — full lifecycle</h3>
            <p className="text-xs text-stext mt-1">
              Paiflow SDK lifecycle: prepare → wallet sign → submit → verify 90/10 split payouts.
            </p>
          </div>
          <span className="badge b-info">Stellar Testnet</span>
        </div>

        {/* 4 Step Lifecycle */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className={`card p-3 text-center ${step === 1 ? "ring-accent border-accent" : ""}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs step-circle ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>
              1
            </div>
            <div className="text-xs font-semibold">Prepare</div>
            <div className="text-[10px] text-stext mt-1">Server: execute.prepare()</div>
          </div>

          <div className={`card p-3 text-center ${step === 2 ? "ring-accent border-accent" : ""}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs step-circle ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
              2
            </div>
            <div className="text-xs font-semibold">Sign</div>
            <div className="text-[10px] text-stext mt-1">Browser: Freighter signTransaction()</div>
          </div>

          <div className={`card p-3 text-center ${step === 3 ? "ring-accent border-accent" : ""}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs step-circle ${step === 3 ? "active" : step > 3 ? "done" : ""}`}>
              3
            </div>
            <div className="text-xs font-semibold">Submit</div>
            <div className="text-[10px] text-stext mt-1">Server: execute.submit()</div>
          </div>

          <div className={`card p-3 text-center ${step === 4 ? "ring-accent border-accent" : ""}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs step-circle ${step === 4 ? "active done" : ""}`}>
              4
            </div>
            <div className="text-xs font-semibold">Verify</div>
            <div className="text-[10px] text-stext mt-1">Server: receipt + events check</div>
          </div>
        </div>

        {/* Split Destination Toggle */}
        <div className="mb-4">
          <SplitDestinationToggle value={splitDest} onChange={setSplitDest} />
        </div>

        {/* Summary Breakdown */}
        <div className="p-4 rounded-xl mb-4" style={{ background: "#0F1618" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-stext mb-0.5">Customer pays</div>
              <div className="font-bold">1.00 XLM</div>
            </div>
            <div>
              <div className="text-xs text-stext mb-0.5">→ Shop (90%)</div>
              <div className="font-bold text-accent">0.90 XLM</div>
            </div>
            <div>
              <div className="text-xs text-stext mb-0.5">→ Savings (10%)</div>
              <div className="font-bold" style={{ color: "#F59E0B" }}>
                0.10 XLM
              </div>
            </div>
            <div>
              <div className="text-xs text-stext mb-0.5">Network fee</div>
              <div className="font-bold text-stext">~0.00001 XLM</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-accent w-full justify-center text-sm py-3"
          disabled={running}
          onClick={run1XlmPayment}
        >
          {running ? (
            <>
              <Loader2 size={16} className="spin" /> Executing Paiflow payment flow…
            </>
          ) : (
            <>
              <Zap size={16} /> Run 1 XLM test payment
            </>
          )}
        </button>
      </div>

      {/* SVG Paiflow 90/10 Split Flow Diagram */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold">Paiflow flow — Receive XLM → Split 90/10</h3>
            <p className="text-xs text-stext mt-1">
              Every customer payment is automatically split: 90% to merchant, 10% to your savings account.
            </p>
          </div>
          <span className="badge b-accent">
            <Zap size={12} /> Paiflow deployment
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 880 280" className="w-full" style={{ minWidth: "760px" }}>
            <defs>
              <linearGradient id="pf-customer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1A2428" />
                <stop offset="1" stopColor="#151E20" />
              </linearGradient>
              <linearGradient id="pf-trigger" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5DE0B0" />
                <stop offset="1" stopColor="#3FBF8F" />
              </linearGradient>
              <linearGradient id="pf-shop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(93,224,176,.18)" />
                <stop offset="1" stopColor="rgba(93,224,176,.06)" />
              </linearGradient>
              <linearGradient id="pf-community" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(245,158,11,.18)" />
                <stop offset="1" stopColor="rgba(245,158,11,.06)" />
              </linearGradient>
              <marker
                id="pf-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="#5DE0B0" />
              </marker>
            </defs>

            {/* Customer Wallet */}
            <rect x="20" y="100" width="160" height="80" rx="14" fill="url(#pf-customer)" stroke="#1F2A2D" />
            <text x="100" y="128" fill="#F2F7F5" fontSize="13" fontWeight="700" textAnchor="middle">
              Customer
            </text>
            <text x="100" y="146" fill="#9AA9A6" fontSize="10" textAnchor="middle">
              Freighter wallet (testnet)
            </text>
            <text x="100" y="164" fill="#5DE0B0" fontSize="11" fontWeight="700" textAnchor="middle">
              pays 1.00 XLM
            </text>

            {/* Trigger */}
            <rect x="240" y="100" width="160" height="80" rx="14" fill="url(#pf-trigger)" />
            <text x="320" y="128" fill="#062018" fontSize="12" fontWeight="800" textAnchor="middle">
              On Receive
            </text>
            <text x="320" y="146" fill="#062018" fontSize="10" textAnchor="middle">
              Trigger
            </text>
            <text x="320" y="164" fill="#062018" fontSize="10" textAnchor="middle" opacity=".85">
              asset: native XLM
            </text>

            {/* Action */}
            <rect x="460" y="100" width="160" height="80" rx="14" fill="url(#pf-trigger)" opacity=".95" />
            <text x="540" y="128" fill="#062018" fontSize="12" fontWeight="800" textAnchor="middle">
              Split
            </text>
            <text x="540" y="146" fill="#062018" fontSize="10" textAnchor="middle">
              Action
            </text>
            <text x="540" y="164" fill="#062018" fontSize="10" textAnchor="middle" opacity=".85">
              9000 / 1000 basis pts
            </text>

            {/* Lines */}
            <line x1="180" y1="140" x2="240" y2="140" stroke="#5DE0B0" strokeWidth="2" markerEnd="url(#pf-arrow)" />
            <line x1="400" y1="140" x2="460" y2="140" stroke="#5DE0B0" strokeWidth="2" markerEnd="url(#pf-arrow)" />

            <path
              d="M540 180 L540 210 L210 210 L210 230"
              stroke="#5DE0B0"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#pf-arrow)"
            />
            <path
              d="M540 180 L540 210 L670 210 L670 230"
              stroke="#F59E0B"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#pf-arrow)"
            />

            {/* Merchant 90% */}
            <rect x="130" y="230" width="160" height="44" rx="10" fill="url(#pf-shop)" stroke="rgba(93,224,176,.3)" />
            <text x="210" y="252" fill="#5DE0B0" fontSize="12" fontWeight="700" textAnchor="middle">
              Shop — 90%
            </text>
            <text x="210" y="266" fill="#9AA9A6" fontSize="9" textAnchor="middle">
              0.90 XLM payout
            </text>

            {/* Savings 10% */}
            <rect
              x="590"
              y="230"
              width="160"
              height="44"
              rx="10"
              fill="url(#pf-community)"
              stroke="rgba(245,158,11,.3)"
            />
            <text x="670" y="252" fill="#F59E0B" fontSize="12" fontWeight="700" textAnchor="middle">
              Your Savings — 10%
            </text>
            <text x="670" y="266" fill="#9AA9A6" fontSize="9" textAnchor="middle">
              0.10 XLM protected
            </text>
          </svg>
        </div>
      </div>

      {/* Recent On-Chain Transactions */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-bold">Recent on-chain transactions</h3>
          <span className="text-xs text-stext">Stellar Testnet</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-4">Hash</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Asset</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Ledger</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {txList.map((t, idx) => {
                const amt =
                  t.amount === 0 ? "—" : `${t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)} ${t.asset}`;
                return (
                  <tr key={idx} className="border-b border-line/50 hover:bg-[#13201F] transition">
                    <td className="py-3 px-4 font-mono text-xs">{t.hash}</td>
                    <td className="py-3 px-4">
                      <span className="badge b-info">{t.type}</span>
                    </td>
                    <td className="py-3 px-4">{t.asset}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${t.amount < 0 ? "" : "text-accent"}`}>
                      {amt}
                    </td>
                    <td className="py-3 px-4 text-stext font-mono text-xs">#{t.ledger}</td>
                    <td className="py-3 px-4">
                      <span className="badge b-ok">Success</span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href="https://stellar.expert/explorer/testnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost p-1.5"
                        title="View on explorer"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety & Recovery Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold mb-3 text-sm">What Paiflow puts on-chain</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Check size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Trigger action contract (deployed on Stellar testnet)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Split recipient addresses + percentages (90/10)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Verifiable payment transactions + dual payouts</span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Event log (split execution evidence on Horizon)</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-3 text-sm">Recovery & safety model</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Shield size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Original signed envelope retained server-side</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Transaction hash persisted before submission</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">Receipt verifier confirms 0.9/0.1 XLM payouts</span>
            </div>
            <div className="flex items-start gap-2">
              <Key size={14} color="#5DE0B0" className="mt-0.5 flex-shrink-0" />
              <span className="text-stext">API tokens stay on server; browser only signs via Freighter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setModalOpen(false)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: "rgba(93,224,176,.15)" }}
              >
                <CheckCircle size={32} color="#5DE0B0" />
              </div>
              <h3 className="text-lg font-bold mb-1">Payment verified</h3>
              <p className="text-stext text-sm">1.00 XLM split successfully on Stellar testnet</p>
            </div>

            <div className="p-4 rounded-xl mb-4 space-y-2 text-sm" style={{ background: "#0F1618" }}>
              <div className="flex justify-between">
                <span className="text-stext">Customer paid</span>
                <span className="font-semibold">1.00 XLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">→ Shop (90%)</span>
                <span className="font-semibold text-accent">0.90 XLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">→ Savings ({splitDest})</span>
                <span className="font-semibold text-warn">0.10 XLM</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-line text-stext">
                <span>Network fee</span>
                <span>~0.00001 XLM</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={() => setModalOpen(false)}>
                Close
              </button>
              <a
                href="https://stellar.expert/explorer/testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-soft flex-1 justify-center text-xs"
              >
                <ExternalLink size={14} /> View on explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
