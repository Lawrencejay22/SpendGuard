"use client";

import React, { useState } from "react";
import { Search, ChevronRight, ChevronLeft, CreditCard, X, Download } from "lucide-react";

interface TxRecord {
  ref: string;
  type: string;
  purpose: string;
  recip: string;
  amt: number;
  date: string;
  status: "completed" | "pending" | "failed" | "rejected";
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTx, setSelectedTx] = useState<TxRecord | null>(null);

  const allTx: TxRecord[] = [
    {
      ref: "TX-9821",
      type: "Online payment",
      purpose: "Groceries",
      recip: "GroceryMart PH",
      amt: -800,
      date: "Today 18:42",
      status: "completed",
    },
    {
      ref: "TX-9818",
      type: "Cash-out",
      purpose: "Food",
      recip: "GCash · ****4567",
      amt: -510,
      date: "Today 16:20",
      status: "completed",
    },
    {
      ref: "TX-9815",
      type: "Deposit",
      purpose: "Top-up",
      recip: "Instant Funding",
      amt: 5000,
      date: "Today 14:05",
      status: "completed",
    },
    {
      ref: "TX-9810",
      type: "Online payment",
      purpose: "Bills",
      recip: "Meralco",
      amt: -1200,
      date: "Yesterday 19:30",
      status: "completed",
    },
    {
      ref: "TX-9808",
      type: "Emergency",
      purpose: "Medical",
      recip: "Mercury Drug",
      amt: -1500,
      date: "Yesterday 11:14",
      status: "completed",
    },
    {
      ref: "TX-9805",
      type: "Online payment",
      purpose: "Food",
      recip: "FoodPanda",
      amt: -450,
      date: "Oct 23, 12:48",
      status: "completed",
    },
    {
      ref: "TX-9802",
      type: "Cash-out",
      purpose: "Family expenses",
      recip: "Bank · BPI",
      amt: -1010,
      date: "Oct 22, 09:15",
      status: "completed",
    },
    {
      ref: "TX-9799",
      type: "Refund",
      purpose: "Shopping",
      recip: "Shopee PH",
      amt: 350,
      date: "Oct 21, 16:00",
      status: "completed",
    },
  ];

  const filtered = allTx.filter((t) => {
    const matchesSearch =
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.purpose.toLowerCase().includes(search.toLowerCase()) ||
      t.recip.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || t.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Transactions</h1>
        <p className="text-stext text-sm mt-1">
          Complete spending history with purpose tracking, filters, and digital receipts.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stext" />
            <input
              className="input pl-9"
              placeholder="Search by reference, recipient, purpose…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All types</option>
            <option value="Deposit">Deposit</option>
            <option value="Online payment">Online payment</option>
            <option value="Cash-out">Cash-out</option>
            <option value="Emergency">Emergency</option>
            <option value="Refund">Refund</option>
          </select>

          <select className="input">
            <option>All statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {["All", "Today", "7 days", "30 days", "Food", "Groceries", "Bills"].map((tag) => (
            <button
              key={tag}
              type="button"
              className={`badge ${tag === "All" ? "b-accent" : "b-info"} cursor-pointer hover:b-accent transition`}
              onClick={() => {
                if (tag === "All") {
                  setSearch("");
                  setTypeFilter("All");
                } else if (tag === "Food" || tag === "Groceries" || tag === "Bills") {
                  setSearch(tag);
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stext text-xs uppercase tracking-wider border-b border-line">
                <th className="text-left py-3 px-4">Reference</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Purpose</th>
                <th className="text-left py-3 px-4">Recipient</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.ref}
                  onClick={() => setSelectedTx(t)}
                  className="border-b border-line/50 hover:bg-[#13201F] transition cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-xs text-accent">{t.ref}</td>
                  <td className="py-3 px-4">
                    <span className="badge b-info">{t.type}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{t.purpose}</td>
                  <td className="py-3 px-4 text-stext">{t.recip}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${t.amt < 0 ? "" : "text-accent"}`}>
                    {t.amt < 0 ? "-" : "+"}PHP {Math.abs(t.amt).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-stext text-xs">{t.date}</td>
                  <td className="py-3 px-4">
                    <span className="badge b-ok text-[10px]">Completed</span>
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight size={14} className="text-stext" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-line">
          <div className="text-xs text-stext">Showing 1–{filtered.length} of {allTx.length}</div>
          <div className="flex gap-1">
            <button type="button" className="btn btn-ghost p-2">
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="btn btn-soft px-3 py-1 text-xs">
              1
            </button>
            <button type="button" className="btn btn-ghost px-3 py-1 text-xs">
              2
            </button>
            <button type="button" className="btn btn-ghost p-2">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0 bg-black/75" onClick={() => setSelectedTx(null)} />
          <div className="modal-panel relative card max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-stext">Transaction receipt</div>
                <div className="font-mono text-sm">{selectedTx.ref}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-stext hover:text-ptext p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-4 mb-4 rounded-xl" style={{ background: "#0F1618" }}>
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <CreditCard size={20} color="#5DE0B0" />
              </div>
              <div className={`text-2xl font-bold ${selectedTx.amt < 0 ? "" : "text-accent"}`}>
                {selectedTx.amt < 0 ? "-" : "+"}PHP {Math.abs(selectedTx.amt).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </div>
              <span className="badge b-ok text-[10px] mt-1">Completed</span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-stext">Type</span>
                <span>{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Purpose</span>
                <span>{selectedTx.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Recipient</span>
                <span>{selectedTx.recip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Date</span>
                <span>{selectedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Source</span>
                <span>SpendGuard Wallet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Provider ref</span>
                <span className="font-mono text-xs">PRV-{selectedTx.ref.split("-")[1]}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setSelectedTx(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-soft flex-1 justify-center text-xs"
                onClick={() => setSelectedTx(null)}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
