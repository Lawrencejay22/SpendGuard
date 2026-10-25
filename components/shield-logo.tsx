"use client";

import React from "react";

interface ShieldLogoProps {
  size?: number;
  float?: boolean;
  className?: string;
}

export function ShieldLogo({ size = 36, float = true, className = "" }: ShieldLogoProps) {
  const gradId = `sg-grad-${size}`;
  const gradInnerId = `sg-grad-inner-${size}`;

  return (
    <div
      className={`sg-shield ${float ? "float" : ""} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="SpendGuard Shield Logo"
    >
      <div className="shield-glow" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5DE0B0" />
            <stop offset="1" stopColor="#3FBF8F" />
          </linearGradient>
          <linearGradient id={gradInnerId} x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A2428" />
            <stop offset="1" stopColor="#0F1618" />
          </linearGradient>
        </defs>
        <path
          d="M24 3 L41 9 V22 C41 32 34 40 24 45 C14 40 7 32 7 22 V9 Z"
          fill={`url(#${gradId})`}
          stroke="#5DE0B0"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M24 7 L37 11.5 V22 C37 29.5 31.5 36 24 40.5 C16.5 36 11 29.5 11 22 V11.5 Z"
          fill={`url(#${gradInnerId})`}
          stroke="rgba(93,224,176,.4)"
          strokeWidth="1"
        />
        <path
          className="shield-check"
          d="M17 24 L22 29 L31 19"
          stroke="#5DE0B0"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
