"use client";

import React, { useState } from "react";
import { Search, MoreHorizontal, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: "SG-2025-001234",
      name: "Juan Dela Cruz",
      email: "juan@email.com",
      verified: true,
      joined: "Oct 20, 2026",
      status: "active",
    },
    {
      id: "SG-2025-001233",
      name: "Maria Santos",
      email: "maria@email.com",
      verified: true,
      joined: "Oct 19, 2026",
      status: "active",
    },
    {
      id: "SG-2025-001232",
      name: "Pedro Reyes",
      email: "pedro@email.com",
      verified: false,
      joined: "Oct 19, 2026",
      status: "pending",
    },
    {
      id: "SG-2025-001231",
      name: "Ana Lim",
      email: "ana@email.com",
      verified: true,
      joined: "Oct 18, 2026",
      status: "frozen",
    },
  ]);

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === "active" ? "frozen" : "active";
          return { ...u, status: next };
        }
        return u;
      }),
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">User Management</h1>
        <p className="text-stext text-sm mt-1">
          Manage registered customer accounts, verify identities, and govern account permissions.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Verified</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line/50 hover:bg-[#13201F] transition">
                  <td className="py-3 px-4 font-mono text-xs text-accent">{u.id}</td>
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-stext">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${u.verified ? "b-ok" : "b-warn"}`}>
                      {u.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stext text-xs">{u.joined}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] ${
                        u.status === "active" ? "b-ok" : u.status === "frozen" ? "b-err" : "b-warn"
                      }`}
                    >
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      className="btn btn-ghost py-1 px-2.5 text-xs"
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === "active" ? "Freeze" : "Activate"}
                    </button>
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
