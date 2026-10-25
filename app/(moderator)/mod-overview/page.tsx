"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ChevronRight, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function ModOverviewPage() {
  const [stats] = useState({
    pending: 2,
    approved: 1,
    rejected: 1,
    resubmit: 1,
  });

  const pendingQueue = [
    {
      id: "APP-2025-00892",
      name: "Maria Clara Reyes",
      idType: "PhilSys ID",
      time: "14:32 Today",
      status: "pending",
    },
    {
      id: "APP-2025-00891",
      name: "Jose Eduardo Santos",
      idType: "Driver's License",
      time: "13:18 Today",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Verification Review Dashboard</h1>
        <p className="text-stext text-sm mt-1">
          Review customer identity submissions. Verification officers cannot perform financial debits or transactions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Pending review</div>
          <div className="text-3xl font-bold text-warn">{stats.pending}</div>
          <div className="text-xs text-stext mt-1">Awaiting decision</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Approved</div>
          <div className="text-3xl font-bold text-accent">{stats.approved}</div>
          <div className="text-xs text-stext mt-1">All time</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Rejected</div>
          <div className="text-3xl font-bold text-err">{stats.rejected}</div>
          <div className="text-xs text-stext mt-1">All time</div>
        </div>

        <div className="card card-hover card-shine p-5">
          <div className="text-xs text-stext mb-1">Resubmission requested</div>
          <div className="text-3xl font-bold">{stats.resubmit}</div>
          <div className="text-xs text-stext mt-1">Awaiting applicant</div>
        </div>
      </div>

      {/* Queue and Recent Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Review queue</h3>
            <Link href="/mod-applications" className="btn btn-ghost py-1 px-3 text-xs">
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {pendingQueue.map((app) => (
              <Link
                key={app.id}
                href="/mod-applications"
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#13201F] transition no-underline text-inherit cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(93,224,176,.1)" }}
                >
                  <User size={20} color="#5DE0B0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{app.name}</div>
                  <div className="text-xs text-stext truncate">
                    {app.id} · {app.idType}
                  </div>
                </div>
                <span className="badge b-warn text-[10px]">Pending</span>
                <ChevronRight size={16} className="text-stext" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4">My recent decisions</h3>
          <div className="space-y-2.5 text-sm">
            <div className="p-3 rounded-lg" style={{ background: "#0F1618" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs">APP-2025-00890</span>
                <span className="badge b-ok text-[10px]">Approved</span>
              </div>
              <div className="text-xs text-stext mt-1">12 min ago · Ana Patricia Lim</div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: "#0F1618" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs">APP-2025-00888</span>
                <span className="badge b-err text-[10px]">Rejected</span>
              </div>
              <div className="text-xs text-stext mt-1">1 hour ago · Failed liveness</div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: "#0F1618" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs">APP-2025-00889</span>
                <span className="badge b-warn text-[10px]">Resubmit</span>
              </div>
              <div className="text-xs text-stext mt-1">2 hours ago · Blurry ID photo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
