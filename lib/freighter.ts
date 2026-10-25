"use client";

import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
} from "@stellar/freighter-api";

export type WalletState = {
  connected: boolean;
  address: string | null;
  network: string | null;
};

export async function isFreighterInstalled(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await isConnected();
    if (typeof res === "boolean") return res;
    if (res && typeof res === "object" && "isConnected" in res) {
      return (res as { isConnected?: boolean }).isConnected === true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function checkConnection(): Promise<boolean> {
  return isFreighterInstalled();
}

export async function connectFreighter(): Promise<WalletState> {
  // Check if Freighter extension is installed
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error("Freighter not detected. Please install Freighter from freighter.app to continue.");
  }

  // Request access
  const access = await requestAccess();
  if (access && typeof access === "object" && "error" in access && access.error) {
    const errorMsg = (access.error as { message?: string })?.message || "User rejected access request.";
    throw new Error(errorMsg);
  }

  // Get address
  let address: string | null = null;
  if (access && typeof access === "object" && "address" in access && access.address) {
    address = access.address;
  }
  if (!address) {
    const addrRes = await getAddress();
    if (addrRes && typeof addrRes === "object" && "address" in addrRes && addrRes.address) {
      address = addrRes.address;
    } else if (typeof addrRes === "string") {
      address = addrRes;
    }
  }

  if (!address) {
    throw new Error("Freighter did not return a public key. User may have rejected.");
  }

  // Get network
  let networkName = "TESTNET";
  try {
    const net = await getNetwork();
    if (typeof net === "string") {
      networkName = (net as string).toUpperCase();
    } else if (net && typeof net === "object" && "network" in net) {
      networkName = String((net as { network?: string }).network || "TESTNET").toUpperCase();
    }
  } catch {
    try {
      const details = await getNetworkDetails();
      if (details && typeof details === "object" && "network" in details) {
        networkName = String((details as { network?: string }).network || "TESTNET").toUpperCase();
      }
    } catch {
      networkName = "TESTNET";
    }
  }

  // Verify testnet
  if (!networkName.includes("TESTNET") && networkName !== "TESTNET") {
    throw new Error(`Wrong network. Switch Freighter to "Testnet" (currently: ${networkName}).`);
  }

  return { connected: true, address, network: networkName };
}

export async function disconnectFreighter(): Promise<WalletState> {
  return { connected: false, address: null, network: null };
}

export async function signWithFreighter(
  unsignedXdr: string,
  networkPassphrase = "Test SDF Network ; September 2015"
): Promise<string> {
  const signRes = await signTransaction(unsignedXdr, {
    networkPassphrase,
  });

  if (signRes && typeof signRes === "object") {
    if ("error" in signRes && signRes.error) {
      const msg = (signRes.error as { message?: string })?.message || "Signing was rejected or failed.";
      throw new Error(msg);
    }
    if ("signedTxXdr" in signRes && signRes.signedTxXdr) {
      return signRes.signedTxXdr;
    }
  }

  if (typeof signRes === "string") {
    return signRes;
  }

  throw new Error("Freighter did not return a signed transaction.");
}

export async function getFreighterUserInfo() {
  try {
    const addr = await getAddress();
    const net = await getNetwork();
    return { addr, net };
  } catch {
    return null;
  }
}
