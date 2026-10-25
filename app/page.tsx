import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Wallet,
  Lock,
  ArrowDown,
  User,
  ShoppingBag,
  PiggyBank,
  Info,
  SlidersHorizontal,
  ShieldAlert,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import { ShieldLogo } from "@/components/shield-logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg text-ptext">
      {/* Animated Background Auroras */}
      <div
        className="aurora"
        style={{
          top: "-10%",
          right: "-5%",
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, rgba(93,224,176,.22), transparent 60%)",
        }}
      />
      <div
        className="aurora"
        style={{
          bottom: "-15%",
          left: "-10%",
          width: "580px",
          height: "580px",
          background: "radial-gradient(circle, rgba(63,191,143,.16), transparent 60%)",
          animationDelay: "-7s",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between border-b border-line/40">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-inherit">
          <ShieldLogo size={36} />
          <span className="text-lg font-bold tracking-tight">SpendGuard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="btn btn-ghost text-sm">
            Sign in
          </Link>
          <Link href="/auth/register" className="btn btn-accent text-sm">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 lg:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="demo-pill inline-flex items-center gap-1.5 mb-4">
              <Zap size={13} />
              <span>STELLAR HACKATHON · PAIFLOW SPLIT</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight mb-6 fade-up">
              Your money.
              <br />
              Your limits.
              <br />
              <span
                style={{
                  background: "linear-gradient(120deg, #5DE0B0, #3FBF8F)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Your control.
              </span>
            </h1>
            <p className="text-stext text-lg leading-relaxed mb-8 max-w-md">
              SpendGuard is a spending-protection wallet where every payment automatically saves{" "}
              <strong className="text-ptext">10% before it reaches the merchant</strong>. Enforced on-chain by Stellar.
              Built with Paiflow.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/auth/register" className="btn btn-accent text-base px-6 py-3">
                <UserPlus size={18} /> Create your account
              </Link>
              <Link href="/auth/login" className="btn btn-ghost text-base px-6 py-3">
                <LogIn size={18} /> Sign in
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stext">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} color="#5DE0B0" /> Stellar Testnet
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} color="#5DE0B0" /> Paiflow SDK
              </div>
              <div className="flex items-center gap-1.5">
                <Wallet size={14} color="#5DE0B0" /> Freighter wallet
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} color="#5DE0B0" /> Self-custody
              </div>
            </div>
          </div>

          {/* Hero Visual: Live 90/10 Split Diagram */}
          <div className="relative fade-up">
            <div className="card p-6 relative overflow-hidden">
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(93,224,176,.15), transparent 70%)" }}
              />
              <div className="flex items-center justify-between mb-5 relative">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(93,224,176,.12)" }}
                  >
                    <Zap size={16} color="#5DE0B0" />
                  </div>
                  <span className="font-semibold text-sm">Live payment preview</span>
                </div>
                <span className="badge b-accent">On-Chain Trigger</span>
              </div>

              {/* Mini Split Flow */}
              <div className="space-y-3 relative">
                <div className="p-3.5 rounded-xl flex items-center justify-between" style={{ background: "#0F1618" }}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(93,224,176,.1)" }}
                    >
                      <User size={16} color="#5DE0B0" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">You pay</div>
                      <div className="text-xs text-stext">1.00 XLM</div>
                    </div>
                  </div>
                  <ArrowDown size={16} className="text-stext" />
                </div>

                <div
                  className="p-3.5 rounded-xl flex items-center justify-between"
                  style={{
                    background: "rgba(93,224,176,.06)",
                    border: "1px solid rgba(93,224,176,.22)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(93,224,176,.15)" }}
                    >
                      <ShoppingBag size={16} color="#5DE0B0" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-accent">→ Merchant</div>
                      <div className="text-xs text-stext">0.90 XLM (90%)</div>
                    </div>
                  </div>
                  <span className="badge b-ok">Auto Payout</span>
                </div>

                <div
                  className="p-3.5 rounded-xl flex items-center justify-between"
                  style={{
                    background: "rgba(245,158,11,.06)",
                    border: "1px solid rgba(245,158,11,.22)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(245,158,11,.15)" }}
                    >
                      <PiggyBank size={16} color="#F59E0B" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#F59E0B" }}>
                        → Your savings
                      </div>
                      <div className="text-xs text-stext">0.10 XLM (10%)</div>
                    </div>
                  </div>
                  <span className="badge b-warn">Protected</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl text-xs text-stext flex gap-2" style={{ background: "#0F1618" }}>
                <Info size={16} color="#5DE0B0" className="flex-shrink-0 mt-0.5" />
                <span>
                  The 10% savings is enforced by Paiflow's on-chain trigger contract — not by our backend. Even if our
                  server is compromised, your savings still happens automatically on Stellar.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 border-t border-line">
        <div className="text-center mb-12">
          <div className="demo-pill inline-block mb-3">WHY SPENDGUARD</div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Spending protection, built into every payment</h2>
          <p className="text-stext max-w-2xl mx-auto">
            Three layers of control that turn every transaction into an intentional, protected act.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card card-hover card-shine p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(93,224,176,.12)" }}
            >
              <SlidersHorizontal size={22} color="#5DE0B0" />
            </div>
            <h3 className="font-bold text-lg mb-2">Set your limits</h3>
            <p className="text-stext text-sm leading-relaxed">
              Daily spending caps, cash-out limits, per-transaction limits, allowed recipients — all configurable, all
              enforced server-side before authorization.
            </p>
          </div>

          <div className="card card-hover card-shine p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(245,158,11,.12)" }}
            >
              <PiggyBank size={22} color="#F59E0B" />
            </div>
            <h3 className="font-bold text-lg mb-2">Save 10% automatically</h3>
            <p className="text-stext text-sm leading-relaxed">
              Every payment splits 90/10 — merchant receives 90%, your savings receives 10%. Enforced by Paiflow on
              Stellar. You cannot bypass it.
            </p>
          </div>

          <div className="card card-hover card-shine p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(93,224,176,.12)" }}
            >
              <ShieldAlert size={22} color="#5DE0B0" />
            </div>
            <h3 className="font-bold text-lg mb-2">Emergency exceptions</h3>
            <p className="text-stext text-sm leading-relaxed">
              Need to exceed your limit for an urgent emergency? Submit a one-time, time-boxed (2h), audit-logged
              exception. Funds and identity checks still apply.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 border-t border-line">
        <div className="max-w-3xl">
          <div className="demo-pill inline-block mb-3">HOW IT WORKS</div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Your app for the experience.
            <br />
            Paiflow for the money.
          </h2>
          <p className="text-stext mb-6 leading-relaxed">
            SpendGuard handles registration, identity verification, spending controls, and the customer dashboard.
            Paiflow handles the actual money movement — preparing the transaction, signing with Freighter, submitting
            to Stellar, and verifying the 90/10 split.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: "#5DE0B0", color: "#062018" }}
              >
                1
              </div>
              <div className="text-sm">
                <strong className="text-ptext">You authorize a payment</strong> in SpendGuard with a stated purpose and
                amount.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: "#5DE0B0", color: "#062018" }}
              >
                2
              </div>
              <div className="text-sm">
                <strong className="text-ptext">Paiflow prepares the transaction</strong> server-side — your wallet
                signs in the browser via Freighter.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: "#5DE0B0", color: "#062018" }}
              >
                3
              </div>
              <div className="text-sm">
                <strong className="text-ptext">Paiflow submits to Stellar</strong> — the on-chain trigger contract
                splits 90/10 automatically.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: "#5DE0B0", color: "#062018" }}
              >
                4
              </div>
              <div className="text-sm">
                <strong className="text-ptext">SpendGuard verifies the receipt</strong> — confirms 0.9 XLM to merchant
                + 0.1 XLM to your savings.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 border-t border-line">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-accent">90/10</div>
            <div className="text-xs text-stext mt-1">Split on every payment</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold">~0.00001</div>
            <div className="text-xs text-stext mt-1">XLM network fee</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold">100%</div>
            <div className="text-xs text-stext mt-1">Self-custody (Freighter)</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold">3 min</div>
            <div className="text-xs text-stext mt-1">Pitch ready</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 border-t border-line">
        <div className="card p-8 lg:p-12 text-center relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(93,224,176,.15), transparent 70%)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(63,191,143,.12), transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex justify-center mb-4">
              <ShieldLogo size={64} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">Start protecting your spending</h2>
            <p className="text-stext mb-6 max-w-md mx-auto">
              Create your SpendGuard account, connect your Freighter wallet, and watch every payment save 10%
              automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/auth/register" className="btn btn-accent px-6 py-3">
                <UserPlus size={18} /> Create your account
              </Link>
              <Link href="/auth/login" className="btn btn-ghost px-6 py-3">
                <LogIn size={18} /> Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8 border-t border-line">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stext">
          <div className="flex items-center gap-2">
            <ShieldLogo size={24} float={false} />
            <span>SpendGuard · Your money, your limits, your control</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Stellar Hackathon 2026</span>
            <span>·</span>
            <span>Built on Stellar</span>
            <span>·</span>
            <span>Powered by Paiflow SDK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
