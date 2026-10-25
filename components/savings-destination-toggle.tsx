"use client";

import React from "react";
import { PiggyBank, Users, Heart } from "lucide-react";
import { SAVINGS_DESTINATIONS, type SavingsDestination } from "@/lib/savings-destinations";

const ICONS = { "piggy-bank": PiggyBank, users: Users, heart: Heart };

export function SavingsDestinationToggle({
  value,
  onChange,
}: {
  value: SavingsDestination;
  onChange: (dest: SavingsDestination) => void;
}) {
  return (
    <div>
      <label className="text-xs text-stext mb-2 block font-medium">
        Where should your 10% savings go?
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(SAVINGS_DESTINATIONS) as SavingsDestination[]).map((key) => {
          const dest = SAVINGS_DESTINATIONS[key];
          const Icon = ICONS[dest.icon as keyof typeof ICONS];
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`card p-3 text-center cursor-pointer transition ${
                isActive ? "border-accent ring-accent" : "hover:border-[#2a3a3e]"
              }`}
              style={{
                borderColor: isActive ? "#5DE0B0" : undefined,
                boxShadow: isActive ? "0 0 0 1px rgba(93,224,176,.35), 0 0 20px -6px rgba(93,224,176,.25)" : undefined,
              }}
            >
              <Icon style={{ color: dest.color, width: 20, height: 20, margin: "0 auto" }} />
              <div className="text-xs font-semibold mt-1.5">{dest.label}</div>
              <div className="text-[10px] text-stext mt-0.5">
                {key === "savings" ? "Default" : key === "community" ? "Bayanihan pool" : "Tip a creator"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
