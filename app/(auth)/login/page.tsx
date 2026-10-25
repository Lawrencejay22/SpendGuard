"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
  Fingerprint,
  UserCheck,
  Settings2,
  Gauge,
  Banknote,
  ShieldAlert,
} from "lucide-react";
import { ShieldLogo } from "@/components/shield-logo";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("juan@email.com");
  const [password, setPassword] = useState("••••••••");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    router.push("/overview");
  }

  return (
    <div className="min-h-screen flex bg-bg text-ptext">
      {/* Left Brand Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-line"
        style={{
          background: "linear-gradient(155deg, #0B1014 0%, #0f1a18 55%, #0B1014 100%)",
        }}
      >
        <div
          className="aurora"
          style={{
            top: "-15%",
            right: "-10%",
            width: "480px",
            height: "480px",
            background: "radial-gradient(circle, rgba(93,224,176,.22), transparent 60%)",
          }}
        />
        <div
          className="aurora"
          style={{
            bottom: "-20%",
            left: "-15%",
            width: "520px",
            height: "520px",
            background: "radial-gradient(circle, rgba(63,191,143,.16), transparent 60%)",
            animationDelay: "-7s",
          }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <ShieldLogo size={40} />
          <span className="text-xl font-bold tracking-tight">SpendGuard</span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-7">
            <ShieldLogo size={84} />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Your money.
            <br />
            Your limits.
            <br />
            <span style={{ color: "#5DE0B0" }}>Your control.</span>
          </h1>
          <p className="text-stext leading-relaxed mb-8 text-sm">
            A personal money management platform that requires a transaction purpose and amount before your funds can
            leave their controlled account. Set spending limits, cash-out limits, and transaction rules — all enforced
            before authorization.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-soft rounded-xl p-3.5 border border-line card-hover">
              <Gauge size={20} color="#5DE0B0" />
              <p className="text-xs text-stext mt-2">Daily spend limits</p>
            </div>
            <div className="glass-soft rounded-xl p-3.5 border border-line card-hover">
              <Banknote size={20} color="#5DE0B0" />
              <p className="text-xs text-stext mt-2">Cash-out rules</p>
            </div>
            <div className="glass-soft rounded-xl p-3.5 border border-line card-hover">
              <ShieldAlert size={20} color="#5DE0B0" />
              <p className="text-xs text-stext mt-2">Emergency mode</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-stext">
          SpendGuard · Built on Stellar Testnet · Powered by Paiflow SDK
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md">
          <Link href="/" className="text-xs text-stext hover:text-ptext mb-6 inline-flex items-center gap-1.5 transition">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <ShieldLogo size={36} />
            <span className="text-xl font-bold">SpendGuard</span>
          </div>

          <div className="seg mb-6">
            <button type="button" className="active">
              Sign in
            </button>
            <Link href="/auth/register" className="text-stext text-xs px-3 py-1.5 hover:text-ptext">
              Create account
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-stext text-sm mb-6">Sign in to manage your spending controls.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="field-label">Email or mobile number</label>
              <input
                className="input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="field-label">Password</label>
                <span className="text-xs text-accent hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <div className="relative">
                <input
                  className="input pr-10"
                  style={{ paddingRight: "2.75rem" }}
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stext hover:text-ptext p-1"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-accent w-full justify-center text-sm py-3 mt-2">
              <LogIn size={18} /> Sign in
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs text-stext">OR DEMO ROLES</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="btn btn-ghost w-full justify-center text-xs py-2.5"
              onClick={() => router.push("/overview")}
            >
              <Fingerprint size={16} /> Continue with passkey (Customer)
            </button>
            <button
              type="button"
              className="btn btn-soft w-full justify-center text-xs py-2.5"
              onClick={() => router.push("/mod-overview")}
            >
              <UserCheck size={16} /> Sign in as Moderator
            </button>
            <button
              type="button"
              className="btn btn-soft w-full justify-center text-xs py-2.5"
              onClick={() => router.push("/admin-overview")}
            >
              <Settings2 size={16} /> Sign in as Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
