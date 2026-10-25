"use client";

import React, { useState } from "react";

export default function ModAuditPage() {
  const [logs] = useState([
    { ts: "Oct 25 14:42", mod: "M. Santos", action: "APPROVE", target: "APP-2025-00891", ip: "10.0.0.14" },
    { ts: "Oct 25 14:18", mod: "E. Cruz", action: "DOCUMENT_VIEW", target: "APP-2025-00892", ip: "10.0.0.22" },
    { ts: "Oct 25 13:55", mod: "M. Santos", action: "REJECT", target: "APP-2025-00888", ip: "10.0.0.14" },
    { ts: "Oct 25 13:30", mod: "C. Tan", action: "RESUBMIT_REQUEST", target: "APP-2025-00889", ip: "10.0.0.31" },
    { ts: "Oct 25 13:18", mod: "E. Cruz", action: "DOCUMENT_VIEW", target: "APP-2025-00891", ip: "10.0.0.22" },
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Audit Logs</h1>
        <p className="text-stext text-sm mt-1">
          Complete verification decisions and document access events. All actions are immutable and cryptographically
          verifiable.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">Moderator</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Target ID</th>
                <th className="text-left py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="border-b border-line/50 hover:bg-[#13201F] transition">
                  <td className="py-3 px-4 text-stext text-xs">{l.ts}</td>
                  <td className="py-3 px-4 font-medium">{l.mod}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] ${
                        l.action === "APPROVE"
                          ? "b-ok"
                          : l.action === "REJECT"
                          ? "b-err"
                          : l.action === "RESUBMIT_REQUEST"
                          ? "b-warn"
                          : "b-info"
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-accent">{l.target}</td>
                  <td className="py-3 px-4 text-stext font-mono text-xs">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
