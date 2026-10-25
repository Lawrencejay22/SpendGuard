"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Save, ShieldCheck } from "lucide-react";

export default function ControlsPage() {
  const [dailyLimit, setDailyLimit] = useState(2000);
  const [dailyCashout, setDailyCashout] = useState(1000);
  const [weeklyLimit, setWeeklyLimit] = useState(10000);
  const [monthlyLimit, setMonthlyLimit] = useState(30000);
  const [perTxLimit, setPerTxLimit] = useState(1000);
  const [timezone, setTimezone] = useState("Asia/Manila (default)");
  const [nighttimeBlocked, setNighttimeBlocked] = useState(true);
  const [require2fa, setRequire2fa] = useState(true);
  const [whitelist, setWhitelist] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/policies")
      .then((res) => res.json())
      .then((data) => {
        if (data.dailyLimitPhp) setDailyLimit(data.dailyLimitPhp);
        if (data.dailyCashoutLimitPhp) setDailyCashout(data.dailyCashoutLimitPhp);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    await fetch("/api/policies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dailyLimitPhp: dailyLimit,
        dailyCashoutLimitPhp: dailyCashout,
        perTransactionLimitPhp: perTxLimit,
        nighttimeBlocked,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Spending Controls</h1>
        <p className="text-stext text-sm mt-1">
          Configure spending and cash-out policies. Enforcement happens server-side before authorization.
        </p>
      </div>

      {saved && (
        <div className="card p-3 px-4 bg-card border-accent text-accent text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Spending policy updated and active on server.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold">Spending policy</h3>
            <span className="badge b-ok">
              <CheckCircle size={12} /> Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Daily spending limit (PHP)</label>
              <input
                className="input"
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
              />
              <div className="progress mt-2">
                <span style={{ width: "40%" }} />
              </div>
              <div className="text-xs text-stext mt-1">PHP 800 used today</div>
            </div>

            <div>
              <label className="field-label">Daily cash-out limit (PHP)</label>
              <input
                className="input"
                type="number"
                value={dailyCashout}
                onChange={(e) => setDailyCashout(Number(e.target.value))}
              />
              <div className="progress warn mt-2">
                <span style={{ width: "50%" }} />
              </div>
              <div className="text-xs text-stext mt-1">PHP 500 used today</div>
            </div>

            <div>
              <label className="field-label">Weekly spending limit (PHP)</label>
              <input
                className="input"
                type="number"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="field-label">Monthly spending limit (PHP)</label>
              <input
                className="input"
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="field-label">Per-transaction limit (PHP)</label>
              <input
                className="input"
                type="number"
                value={perTxLimit}
                onChange={(e) => setPerTxLimit(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="field-label">Daily reset timezone</label>
              <select className="input" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option>Asia/Manila (default)</option>
                <option>Asia/Singapore</option>
                <option>UTC</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="field-label">Allowed transaction types</label>
            <div className="flex flex-wrap gap-2">
              <span className="badge b-accent px-3 py-1.5 cursor-pointer">Online Payment</span>
              <span className="badge b-accent px-3 py-1.5 cursor-pointer">Cash-Out</span>
              <span className="badge b-info px-3 py-1.5 cursor-pointer">Transfer</span>
              <span className="badge b-info px-3 py-1.5 cursor-pointer">Emergency Mode</span>
            </div>
          </div>

          <div className="mt-5">
            <label className="field-label">Spending alert thresholds</label>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-accent" /> 50%
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-accent" /> 80%
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-accent" /> 100%
              </label>
            </div>
          </div>

          <button type="button" className="btn btn-accent mt-6" onClick={handleSave}>
            <Save size={16} /> Save policy
          </button>
        </div>

        {/* Sidebar Restrictions */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Today&apos;s usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stext">Spending</span>
                  <span>PHP 800 / {dailyLimit.toLocaleString()}</span>
                </div>
                <div className="progress">
                  <span style={{ width: "40%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stext">Cash-out</span>
                  <span>PHP 500 / {dailyCashout.toLocaleString()}</span>
                </div>
                <div className="progress warn">
                  <span style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-3 text-sm">Optional restrictions</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stext">Recipient whitelist</span>
                <div
                  className={`switch ${whitelist ? "on" : ""}`}
                  onClick={() => setWhitelist(!whitelist)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stext">Block nighttime (22:00–06:00)</span>
                <div
                  className={`switch ${nighttimeBlocked ? "on" : ""}`}
                  onClick={() => setNighttimeBlocked(!nighttimeBlocked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stext">Require 2FA &gt; PHP 500</span>
                <div
                  className={`switch ${require2fa ? "on" : ""}`}
                  onClick={() => setRequire2fa(!require2fa)}
                />
              </div>
            </div>
          </div>

          <div
            className="card p-5 text-xs"
            style={{ background: "rgba(93,224,176,.05)", borderColor: "rgba(93,224,176,.2)" }}
          >
            <div className="flex gap-2">
              <ShieldCheck size={18} color="#5DE0B0" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-accent mb-1">Backend enforcement</p>
                <p className="text-stext">
                  Policy is enforced server-side at authorization time. Frontend values are never trusted. Concurrent
                  requests are serialized to prevent limit bypass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
