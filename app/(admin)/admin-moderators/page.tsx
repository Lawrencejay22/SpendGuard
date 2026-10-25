"use client";

import React, { useState } from "react";
import { UserPlus, Shield } from "lucide-react";

export default function AdminModeratorsPage() {
  const [moderators, setModerators] = useState([
    { name: "Maria Santos", email: "maria.m@spendguard.app", status: "Active", cases: 142, onDuty: true },
    { name: "Carlos Tan", email: "carlos.t@spendguard.app", status: "Active", cases: 98, onDuty: false },
    { name: "Elena Cruz", email: "elena.c@spendguard.app", status: "Active", cases: 187, onDuty: true },
    { name: "Ramon Diaz", email: "ramon.d@spendguard.app", status: "Suspended", cases: 54, onDuty: false },
    { name: "Liza Wong", email: "liza.w@spendguard.app", status: "Active", cases: 121, onDuty: false },
    { name: "Mark Aquino", email: "mark.a@spendguard.app", status: "Active", cases: 163, onDuty: true },
  ]);

  function toggleMod(name: string) {
    setModerators((prev) =>
      prev.map((m) => {
        if (m.name === name) {
          const nextStatus = m.status === "Active" ? "Suspended" : "Active";
          return { ...m, status: nextStatus, onDuty: nextStatus === "Active" ? m.onDuty : false };
        }
        return m;
      }),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Moderator Management</h1>
          <p className="text-stext text-sm mt-1">Create and manage authorized verification officer accounts.</p>
        </div>
        <button type="button" className="btn btn-accent text-xs">
          <UserPlus size={14} /> Invite moderator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moderators.map((m) => (
          <div key={m.name} className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #5DE0B0, #3FBF8F)", color: "#062018" }}
              >
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{m.name}</div>
                <div className="text-xs text-stext truncate">{m.email}</div>
              </div>
              {m.onDuty && (
                <span className="badge b-ok text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  On duty
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <div className="text-xs text-stext">Cases reviewed</div>
                <div className="font-bold">{m.cases}</div>
              </div>
              <div>
                <div className="text-xs text-stext">Status</div>
                <span className={`badge ${m.status === "Active" ? "b-ok" : "b-err"} text-[10px]`}>
                  {m.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost flex-1 justify-center text-xs">
                <Shield size={12} /> Permissions
              </button>
              <button
                type="button"
                className={`btn ${m.status === "Active" ? "btn-danger" : "btn-soft"} flex-1 justify-center text-xs`}
                onClick={() => toggleMod(m.name)}
              >
                {m.status === "Active" ? "Suspend" : "Reactivate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
