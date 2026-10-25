"use client";

import React, { useState } from "react";
import { Save, CheckCircle, Snowflake, Download, LogOut } from "lucide-react";

export default function SecurityPage() {
  const [fullName, setFullName] = useState("Juan Dela Cruz");
  const [email, setEmail] = useState("juan@email.com");
  const [mobile, setMobile] = useState("+63 917 123 4567");
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    notify("Profile details updated.");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Security & Settings</h1>
        <p className="text-stext text-sm mt-1">Manage authentication, verification tier, and account security.</p>
      </div>

      {toastMsg && (
        <div className="card p-3 px-4 bg-card border-accent text-accent text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold mb-5">Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Full legal name</label>
                <input
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Mobile</label>
                <input
                  className="input"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Account ID</label>
                <input className="input" value="SG-2025-001234" disabled />
              </div>
            </div>

            <button type="submit" className="btn btn-accent mt-5 text-xs">
              <Save size={14} /> Save changes
            </button>
          </form>
        </div>

        {/* Verification Status */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Verification status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stext">Email</span>
              <span className="badge b-ok">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Mobile</span>
              <span className="badge b-ok">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Identity</span>
              <span className="badge b-ok">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Account tier</span>
              <span className="badge b-accent">Verified Customer</span>
            </div>
          </div>
        </div>

        {/* Authentication Options */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Authentication</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-stext">Password</span>
              <button
                type="button"
                className="btn btn-ghost py-1 px-3 text-xs"
                onClick={() => notify("Password reset link sent to your email.")}
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">2FA (TOTP)</span>
              <span className="badge b-ok">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stext">Passkey / WebAuthn</span>
              <span className="badge b-ok">Configured</span>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Active sessions</h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 rounded-lg" style={{ background: "#0F1618" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Chrome · Windows (Manila)</span>
                <span className="badge b-ok text-[10px]">Current</span>
              </div>
              <div className="text-xs text-stext mt-1">Active right now</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0F1618" }}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Safari · iOS (Manila)</span>
                <button
                  type="button"
                  className="text-xs text-err hover:underline"
                  onClick={() => notify("Remote session revoked.")}
                >
                  Revoke
                </button>
              </div>
              <div className="text-xs text-stext mt-1">2 hours ago</div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-danger w-full justify-center mt-3 text-xs"
            onClick={() => notify("Signed out of all other devices.")}
          >
            <LogOut size={14} /> Sign out everywhere else
          </button>
        </div>

        {/* Danger Zone */}
        <div className="card p-5">
          <h3 className="font-bold mb-4">Danger zone</h3>
          <div className="space-y-2">
            <button
              type="button"
              className="btn btn-danger w-full justify-center text-xs"
              onClick={() => notify("Account freeze requested.")}
            >
              <Snowflake size={14} /> Freeze account
            </button>
            <button
              type="button"
              className="btn btn-ghost w-full justify-center text-xs"
              onClick={() => notify("Data export prepared.")}
            >
              <Download size={14} /> Export personal data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
