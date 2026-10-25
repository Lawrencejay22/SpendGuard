"use client";

import React, { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

export default function AdminPolicyPage() {
  const [minSpend, setMinSpend] = useState(100);
  const [maxSpend, setMaxSpend] = useState(50000);
  const [maxPerTx, setMaxPerTx] = useState(10000);
  const [minCashout, setMinCashout] = useState(100);
  const [maxCashout, setMaxCashout] = useState(20000);
  const [maxEmergency, setMaxEmergency] = useState(5000);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Policy Configuration</h1>
        <p className="text-stext text-sm mt-1">Configure platform-wide spending limit boundaries and safety ceilings.</p>
      </div>

      {saved && (
        <div className="card p-3 px-4 bg-card border-accent text-accent text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          <span>System policy ranges updated across all nodes.</span>
        </div>
      )}

      <div className="card p-6">
        <h3 className="font-bold mb-5">Allowed policy ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Min daily spend (PHP)</label>
            <input
              className="input"
              type="number"
              value={minSpend}
              onChange={(e) => setMinSpend(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="field-label">Max daily spend (PHP)</label>
            <input
              className="input"
              type="number"
              value={maxSpend}
              onChange={(e) => setMaxSpend(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="field-label">Max per-tx (PHP)</label>
            <input
              className="input"
              type="number"
              value={maxPerTx}
              onChange={(e) => setMaxPerTx(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="field-label">Min daily cash-out (PHP)</label>
            <input
              className="input"
              type="number"
              value={minCashout}
              onChange={(e) => setMinCashout(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="field-label">Max daily cash-out (PHP)</label>
            <input
              className="input"
              type="number"
              value={maxCashout}
              onChange={(e) => setMaxCashout(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="field-label">Emergency max (PHP)</label>
            <input
              className="input"
              type="number"
              value={maxEmergency}
              onChange={(e) => setMaxEmergency(Number(e.target.value))}
            />
          </div>
        </div>

        <button type="button" className="btn btn-accent mt-6 text-xs" onClick={handleSave}>
          <Save size={14} /> Save configuration
        </button>
      </div>
    </div>
  );
}
