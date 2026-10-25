"use client";

import React from "react";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">System Overview</h1>
        <p className="text-stext text-sm mt-1">Platform health, user statistics, volume charts, and security telemetry.</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Total users</div>
          <div className="text-3xl font-bold">12,847</div>
          <div className="text-xs text-accent mt-1">↑ 234 this week</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Verified users</div>
          <div className="text-3xl font-bold">9,421</div>
          <div className="text-xs text-stext mt-1">73.4% pass rate</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Active moderators</div>
          <div className="text-3xl font-bold text-accent">6</div>
          <div className="text-xs text-stext mt-1">2 currently on duty</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Failed tx today</div>
          <div className="text-3xl font-bold text-err">17</div>
          <div className="text-xs text-stext mt-1">0.04% exception rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transaction Volume Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Transaction volume (7 days)</h3>
            <div className="flex items-center gap-3 text-xs text-stext">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Deposits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3FBF8F" }} /> Payments
              </span>
            </div>
          </div>

          <div className="h-60 flex items-end gap-3 pt-6 pb-2 px-3" style={{ background: "#0F1618", borderRadius: "0.75rem" }}>
            {[
              { day: "Mon", dep: "42k", pay: "28k", hDep: "50%", hPay: "35%" },
              { day: "Tue", dep: "51k", pay: "34k", hDep: "60%", hPay: "42%" },
              { day: "Wed", dep: "38k", pay: "22k", hDep: "45%", hPay: "28%" },
              { day: "Thu", dep: "67k", pay: "41k", hDep: "78%", hPay: "50%" },
              { day: "Fri", dep: "52k", pay: "31k", hDep: "62%", hPay: "38%" },
              { day: "Sat", dep: "89k", pay: "56k", hDep: "100%", hPay: "68%" },
              { day: "Sun", dep: "71k", pay: "44k", hDep: "82%", hPay: "54%" },
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div
                    className="flex-1 rounded-t-md transition-all group-hover:brightness-110"
                    style={{ height: col.hDep, background: "#5DE0B0" }}
                  />
                  <div
                    className="flex-1 rounded-t-md transition-all group-hover:brightness-110"
                    style={{ height: col.hPay, background: "#3FBF8F" }}
                  />
                </div>
                <span className="text-xs text-stext font-medium">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events Feed */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Security events</h3>
          <div className="space-y-2.5 text-sm">
            <div className="p-3 rounded-lg" style={{ background: "rgba(248,113,113,.06)" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs text-err">Forged webhook blocked</span>
                <span className="text-[10px] text-stext">2m ago</span>
              </div>
              <div className="text-[11px] text-stext mt-0.5">Signature mismatch from external provider</div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(245,158,11,.06)" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs text-warn">5 failed logins (1 IP)</span>
                <span className="text-[10px] text-stext">14m ago</span>
              </div>
              <div className="text-[11px] text-stext mt-0.5">IP temporarily rate-limited</div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(245,158,11,.06)" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs text-warn">Rate limit triggered</span>
                <span className="text-[10px] text-stext">1h ago</span>
              </div>
              <div className="text-[11px] text-stext mt-0.5">Prepare API exceeded 20/min ceiling</div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(93,224,176,.06)" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs text-accent">Snapshot backup completed</span>
                <span className="text-[10px] text-stext">3h ago</span>
              </div>
              <div className="text-[11px] text-stext mt-0.5">State persisted and encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
