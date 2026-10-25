"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  RefreshCw,
  User,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ModApp {
  id: string;
  name: string;
  email: string;
  mobile: string;
  birthdate: string;
  gender: string;
  idType: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "resubmit";
  liveness: boolean;
  docCheck: string;
  identityMatch: string;
  decisionReason?: string;
}

export default function ModApplicationsPage() {
  const [apps, setApps] = useState<ModApp[]>([
    {
      id: "APP-2025-00892",
      name: "Maria Clara Reyes",
      email: "maria.reyes@email.com",
      mobile: "+63 917 555 0192",
      birthdate: "1995-03-14",
      gender: "Female",
      idType: "PhilSys ID",
      submittedAt: "Oct 25 14:32",
      status: "pending",
      liveness: true,
      docCheck: "Passed",
      identityMatch: "95% match",
    },
    {
      id: "APP-2025-00891",
      name: "Jose Eduardo Santos",
      email: "jose.santos@email.com",
      mobile: "+63 918 555 0287",
      birthdate: "1990-07-22",
      gender: "Male",
      idType: "Driver's License",
      submittedAt: "Oct 25 13:18",
      status: "pending",
      liveness: true,
      docCheck: "Passed",
      identityMatch: "92% match",
    },
    {
      id: "APP-2025-00890",
      name: "Ana Patricia Lim",
      email: "ana.lim@email.com",
      mobile: "+63 919 555 0341",
      birthdate: "1998-11-05",
      gender: "Female",
      idType: "Passport",
      submittedAt: "Oct 25 12:45",
      status: "approved",
      liveness: true,
      docCheck: "Passed",
      identityMatch: "97% match",
    },
    {
      id: "APP-2025-00889",
      name: "Ramon Dela Cruz",
      email: "ramon.dc@email.com",
      mobile: "+63 920 555 0456",
      birthdate: "1988-01-30",
      gender: "Male",
      idType: "UMID",
      submittedAt: "Oct 25 11:02",
      status: "resubmit",
      liveness: true,
      docCheck: "Failed — blurry",
      identityMatch: "Pending",
      decisionReason: "ID front image is blurry. Please retake under clear lighting.",
    },
    {
      id: "APP-2025-00888",
      name: "Liza Marie Wong",
      email: "liza.wong@email.com",
      mobile: "+63 921 555 0589",
      birthdate: "1992-09-18",
      gender: "Female",
      idType: "PhilSys ID",
      submittedAt: "Oct 25 09:48",
      status: "rejected",
      liveness: false,
      docCheck: "Failed",
      identityMatch: "61% match",
      decisionReason: "Identity match below threshold (61% < 80%).",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>("APP-2025-00892");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Identity match below threshold");

  const selectedApp: ModApp = (apps.find((a) => a.id === selectedId) || apps[0])!;

  function handleApprove(id: string) {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)),
    );
  }

  function handleReject(id: string) {
    setApps((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "rejected" as const, decisionReason: rejectReason } : a,
      ),
    );
    setRejectModalOpen(false);
  }

  function handleResubmit(id: string) {
    setApps((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "resubmit" as const,
              decisionReason: "Please retake your ID front photo in better lighting.",
            }
          : a,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Applications</h1>
        <p className="text-stext text-sm mt-1">
          Complete KYC identity verification submissions queue. Review documents, biometric checks, and approve.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Applications List */}
        <div className="card p-5 lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                  <th className="text-left py-3 px-3">App ID</th>
                  <th className="text-left py-3 px-3">Applicant</th>
                  <th className="text-left py-3 px-3">Submitted</th>
                  <th className="text-left py-3 px-3">ID Type</th>
                  <th className="text-left py-3 px-3">Status</th>
                  <th className="text-left py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`border-b border-line/50 hover:bg-[#13201F] transition cursor-pointer ${
                      selectedId === a.id ? "bg-[#13201F]" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-xs text-accent">{a.id}</td>
                    <td className="py-3 px-3 font-medium">{a.name}</td>
                    <td className="py-3 px-3 text-stext text-xs">{a.submittedAt}</td>
                    <td className="py-3 px-3 text-stext">{a.idType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`badge text-[10px] ${
                          a.status === "approved"
                            ? "b-ok"
                            : a.status === "rejected"
                            ? "b-err"
                            : a.status === "resubmit"
                            ? "b-warn"
                            : "b-warn"
                        }`}
                      >
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button type="button" className="btn btn-ghost p-1.5">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Application Review Panel */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Application review</h3>
            <span
              className={`badge text-[10px] ${
                selectedApp.status === "approved"
                  ? "b-ok"
                  : selectedApp.status === "rejected"
                  ? "b-err"
                  : "b-warn"
              }`}
            >
              {selectedApp.status.toUpperCase()}
            </span>
          </div>

          {/* Applicant Info */}
          <div className="card p-4 mb-4" style={{ background: "#0F1618" }}>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(93,224,176,.15)", border: "1px solid #1F2A2D" }}
              >
                <User size={22} color="#5DE0B0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base truncate">{selectedApp.name}</div>
                <div className="text-xs text-stext font-mono">{selectedApp.id}</div>
                <div className="text-xs text-stext mt-0.5">{selectedApp.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-line">
              <div>
                <span className="text-stext">Mobile:</span> {selectedApp.mobile}
              </div>
              <div>
                <span className="text-stext">Birthdate:</span> {selectedApp.birthdate}
              </div>
              <div>
                <span className="text-stext">Gender:</span> {selectedApp.gender}
              </div>
              <div>
                <span className="text-stext">ID:</span> {selectedApp.idType}
              </div>
            </div>
          </div>

          {/* Verification Checks */}
          <div className="card p-4 mb-4" style={{ background: "#0F1618" }}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stext mb-2.5">Automated Checks</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stext">Document check</span>
                <span className={`badge ${selectedApp.docCheck === "Passed" ? "b-ok" : "b-err"}`}>
                  {selectedApp.docCheck}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stext">Liveness check</span>
                <span className={`badge ${selectedApp.liveness ? "b-ok" : "b-err"}`}>
                  {selectedApp.liveness ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stext">Biometric match</span>
                <span className="badge b-ok">{selectedApp.identityMatch}</span>
              </div>
            </div>
          </div>

          {/* Document Previews */}
          <div className="card p-4 mb-4" style={{ background: "#0F1618" }}>
            <div className="text-xs font-bold uppercase tracking-wider text-stext mb-2.5">Captured Documents</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-1"
                  style={{ background: "#151E20", border: "1px dashed #1F2A2D" }}
                >
                  <User size={20} color="#5DE0B0" />
                </div>
                <span className="text-[10px] text-stext">Selfie</span>
              </div>
              <div>
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-1"
                  style={{ background: "#151E20", border: "1px dashed #1F2A2D" }}
                >
                  <CreditCard size={20} color="#5DE0B0" />
                </div>
                <span className="text-[10px] text-stext">ID Front</span>
              </div>
              <div>
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-1"
                  style={{ background: "#151E20", border: "1px dashed #1F2A2D" }}
                >
                  <CreditCard size={20} color="#9AA9A6" />
                </div>
                <span className="text-[10px] text-stext">ID Back</span>
              </div>
            </div>
          </div>

          {selectedApp.decisionReason && (
            <div
              className="p-3 rounded-xl mb-4 text-xs"
              style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)" }}
            >
              <span className="font-semibold text-err">Decision Note:</span> {selectedApp.decisionReason}
            </div>
          )}

          {/* Action Buttons */}
          {selectedApp.status === "pending" || selectedApp.status === "resubmit" ? (
            <div className="space-y-2">
              <button
                type="button"
                className="btn btn-accent w-full justify-center text-xs py-2.5"
                onClick={() => handleApprove(selectedApp.id)}
              >
                <Check size={14} /> Approve application
              </button>
              <button
                type="button"
                className="btn btn-danger w-full justify-center text-xs py-2.5"
                onClick={() => setRejectModalOpen(true)}
              >
                <X size={14} /> Reject with reason
              </button>
              <button
                type="button"
                className="btn btn-ghost w-full justify-center text-xs py-2.5"
                onClick={() => handleResubmit(selectedApp.id)}
              >
                <RefreshCw size={14} /> Request resubmission
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-stext p-3 rounded-xl" style={{ background: "#0F1618" }}>
              Application has been {selectedApp.status}. Decision audit-logged.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setRejectModalOpen(false)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-1">Reject application</h3>
            <p className="text-xs text-stext mb-4">Select reason for rejection for {selectedApp.name}</p>

            <label className="field-label">Reason code</label>
            <select
              className="input mb-4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option>Identity match below threshold</option>
              <option>Document unreadable or blurry</option>
              <option>ID expired</option>
              <option>Name mismatch</option>
              <option>Failed liveness check</option>
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setRejectModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger flex-1 justify-center text-xs"
                onClick={() => handleReject(selectedApp.id)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
