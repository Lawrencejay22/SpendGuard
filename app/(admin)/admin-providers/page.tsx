"use client";

import React, { useState } from "react";
import { Zap, Smartphone, Building2, Settings } from "lucide-react";

export default function AdminProvidersPage() {
  const [providers] = useState([
    {
      name: "Instant Funding",
      type: "Funding",
      status: "Active",
      desc: "Instant credit to your SpendGuard controlled wallet via internal ledger.",
      icon: Zap,
      ok: true,
    },
    {
      name: "GCash",
      type: "Funding & Payout",
      status: "Planned",
      desc: "Official partner access required. Integration specs prepared.",
      icon: Smartphone,
      ok: false,
      warn: true,
    },
    {
      name: "InstaPay",
      type: "Funding & Payout",
      status: "Coming",
      desc: "Real-time bank transfers through BancNet / InstaPay rails.",
      icon: Building2,
      ok: false,
    },
    {
      name: "PESONet",
      type: "Funding & Payout",
      status: "Coming",
      desc: "Batch same-day automated clearing house bank transfers.",
      icon: Building2,
      ok: false,
    },
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Payment Providers</h1>
        <p className="text-stext text-sm mt-1">Manage supported funding and payout rails across payment gateways.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(93,224,176,.1)" }}
                >
                  <Icon size={20} color="#5DE0B0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-stext">{p.type}</div>
                </div>
                <span className={`badge ${p.ok ? "b-ok" : p.warn ? "b-warn" : "b-info"} text-[10px]`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-stext mb-4 leading-relaxed">{p.desc}</p>
              <button type="button" className="btn btn-ghost w-full justify-center text-xs">
                <Settings size={12} /> Configure provider settings
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
