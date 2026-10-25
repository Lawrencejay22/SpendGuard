"use client";

import React, { useState } from "react";

export default function AdminAuditPage() {
  const [auditLogs] = useState([
    { ts: "Oct 25 14:48", actor: "admin@spendguard", action: "MODERATOR_SUSPENDED", res: "ramon.d@spendguard", sev: "warn" },
    { ts: "Oct 25 13:22", actor: "system", action: "WEBHOOK_FORGERY_BLOCKED", res: "/api/webhooks/payment-provider", sev: "err" },
    { ts: "Oct 25 12:01", actor: "admin@spendguard", action: "POLICY_RANGE_UPDATED", res: "daily_spend_max", sev: "info" },
    { ts: "Oct 25 10:34", actor: "system", action: "RATE_LIMIT_TRIGGERED", res: "IP 203.0.113.42", sev: "warn" },
    { ts: "Oct 25 09:12", actor: "system", action: "BACKUP_COMPLETED", res: "pg-backup-2026-10-25", sev: "info" },
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Security & Audit</h1>
        <p className="text-stext text-sm mt-1">
          System-wide cryptographic audit trail, tamper detection, and security health monitoring.
        </p>
      </div>

      {/* 4 Health Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="card p-5">
          <div className="text-xs text-stext mb-1">Avg response time</div>
          <div className="text-2xl font-bold text-accent">142ms</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-stext mb-1">Uptime (30d)</div>
          <div className="text-2xl font-bold text-accent">99.98%</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-stext mb-1">Webhooks verified</div>
          <div className="text-2xl font-bold">8,421</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-stext mb-1">Blocked attacks (24h)</div>
          <div className="text-2xl font-bold text-err">23</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">Actor</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Resource</th>
                <th className="text-left py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((a, i) => (
                <tr key={i} className="border-b border-line/50 hover:bg-[#13201F] transition">
                  <td className="py-3 px-4 text-stext text-xs">{a.ts}</td>
                  <td className="py-3 px-4 font-mono text-xs">{a.actor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] ${
                        a.sev === "err" ? "b-err" : a.sev === "warn" ? "b-warn" : "b-info"
                      }`}
                    >
                      {a.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stext font-mono text-xs">{a.res}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] ${
                        a.sev === "err" ? "b-err" : a.sev === "warn" ? "b-warn" : "b-info"
                      }`}
                    >
                      {a.sev === "err" ? "Critical" : a.sev === "warn" ? "Warning" : "Info"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
