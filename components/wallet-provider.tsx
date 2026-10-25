"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  connectFreighter,
  disconnectFreighter,
  checkConnection,
  type WalletState,
} from "@/lib/freighter";

type WalletContextValue = {
  wallet: WalletState;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  connectDemo: () => void;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, check if already connected (user previously approved)
  useEffect(() => {
    checkConnection().then(async (isConn) => {
      if (isConn) {
        try {
          const { getAddress, getNetwork } = await import("@stellar/freighter-api");
          const addrRes = await getAddress();
          const address =
            addrRes && typeof addrRes === "object" && "address" in addrRes
              ? addrRes.address
              : typeof addrRes === "string"
              ? addrRes
              : null;

          const netRes = await getNetwork();
          const network =
            typeof netRes === "string"
              ? (netRes as string).toUpperCase()
              : netRes && typeof netRes === "object" && "network" in netRes
              ? String((netRes as { network?: string }).network || "TESTNET").toUpperCase()
              : "TESTNET";

          if (address) {
            setWallet({ connected: true, address, network });
          }
        } catch {
          // ignore — user will click connect manually
        }
      }
    });
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const state = await connectFreighter();
      setWallet(state);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }, []);

  const connectDemo = useCallback(() => {
    setWallet({
      connected: true,
      address: "GB3XPHAPMYBNFPQIUEG46SN5LCKHMSIT2NCICWCJJUSWISQU674GTSIU",
      network: "TESTNET",
    });
    setError(null);
  }, []);

  const disconnect = useCallback(async () => {
    const state = await disconnectFreighter();
    setWallet(state);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connecting, error, connect, connectDemo, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
