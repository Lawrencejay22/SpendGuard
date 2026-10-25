"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, ShieldAlert, LogIn, Bell } from "lucide-react";

export default function NotificationsPage() {
  const [pref, setPref] = useState({
    deposit: true,
    payAuth: true,
    payReject: true,
    cashout: true,
    threshold50: true,
    threshold80: true,
    threshold100: true,
    suspicious: true,
  });

  const [markedAllRead, setMarkedAllRead] = useState(false);

  const notifications = [
    {
      id: 1,
      icon: CheckCircle,
      color: "#5DE0B0",
      title: "Deposit confirmed",
      body: "PHP 5,000.00 credited via Instant Funding.",
      time: "4h ago",
      unread: !markedAllRead,
    },
    {
      id: 2,
      icon: AlertTriangle,
      color: "#F59E0B",
      title: "80% cash-out threshold reached",
      body: "You have used 80% of today's PHP 1,000 cash-out limit.",
      time: "5h ago",
      unread: !markedAllRead,
    },
    {
      id: 3,
      icon: ShieldAlert,
      color: "#F87171",
      title: "Payment rejected",
      body: "PHP 1,500 payment to Shopee PH exceeded remaining allowance.",
      time: "5h ago",
      unread: !markedAllRead,
    },
    {
      id: 4,
      icon: LogIn,
      color: "#9AA9A6",
      title: "New sign-in detected",
      body: "Chrome on Windows · Manila, PH",
      time: "2d ago",
      unread: false,
    },
    {
      id: 5,
      icon: CheckCircle,
      color: "#5DE0B0",
      title: "Identity verified",
      body: "Your identity verification application was approved.",
      time: "3d ago",
      unread: false,
    },
  ];

  function togglePref(key: keyof typeof pref) {
    setPref((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Notifications</h1>
        <p className="text-stext text-sm mt-1">Alerts for deposits, payments, limits, and security events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Notifications List */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent alerts</h3>
            <button
              type="button"
              className="text-xs text-accent hover:underline bg-transparent border-0 cursor-pointer"
              onClick={() => setMarkedAllRead(true)}
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 p-3.5 rounded-xl transition ${
                    n.unread ? "border border-line bg-[#0F1618]" : "bg-transparent"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(93,224,176,.08)" }}
                  >
                    <Icon size={18} color={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{n.title}</span>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                    </div>
                    <div className="text-xs text-stext mt-0.5">{n.body}</div>
                    <div className="text-[10px] text-stext mt-1">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Alert preferences</h3>
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span>Deposit confirmed</span>
              <div
                className={`switch ${pref.deposit ? "on" : ""}`}
                onClick={() => togglePref("deposit")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Payment authorized</span>
              <div
                className={`switch ${pref.payAuth ? "on" : ""}`}
                onClick={() => togglePref("payAuth")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Payment rejected</span>
              <div
                className={`switch ${pref.payReject ? "on" : ""}`}
                onClick={() => togglePref("payReject")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Cash-out completed</span>
              <div
                className={`switch ${pref.cashout ? "on" : ""}`}
                onClick={() => togglePref("cashout")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>50% threshold</span>
              <div
                className={`switch ${pref.threshold50 ? "on" : ""}`}
                onClick={() => togglePref("threshold50")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>80% threshold</span>
              <div
                className={`switch ${pref.threshold80 ? "on" : ""}`}
                onClick={() => togglePref("threshold80")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>100% threshold</span>
              <div
                className={`switch ${pref.threshold100 ? "on" : ""}`}
                onClick={() => togglePref("threshold100")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Suspicious login</span>
              <div
                className={`switch ${pref.suspicious ? "on" : ""}`}
                onClick={() => togglePref("suspicious")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
