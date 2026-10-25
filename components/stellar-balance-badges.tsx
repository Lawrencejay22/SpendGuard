"use client";

import React from "react";
import Link from "next/link";
import { Hexagon, CircleDollarSign } from "lucide-react";

interface StellarBalanceBadgesProps {
  xlmBalance: number;
  usdcBalance: number;
  className?: string;
}

export function StellarBalanceBadges({
  xlmBalance,
  usdcBalance,
  className = "",
}: StellarBalanceBadgesProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-[10px] text-stext uppercase tracking-wider">On-chain:</span>
      <Link
        href="/blockchain"
        className="badge b-info hover:b-accent transition cursor-pointer"
        title="XLM balance (Stellar testnet)"
      >
        <Hexagon size={12} color="#5DE0B0" />
        <span>{xlmBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XLM</span>
      </Link>
      <Link
        href="/blockchain"
        className="badge b-info hover:b-accent transition cursor-pointer"
        title="USDC balance (Stellar testnet)"
      >
        <CircleDollarSign size={12} color="#3FBF8F" />
        <span>{usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
      </Link>
      <span className="text-[10px] text-stext">· Testnet</span>
    </div>
  );
}
