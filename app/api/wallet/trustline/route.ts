import { NextResponse } from "next/server";
import { StellarServer, STELLAR_TESTNET_PASSPHRASE } from "@/lib/stellar";

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    const xdr = await StellarServer.buildTrustlineXdr(address);
    return NextResponse.json({
      unsignedXdr: xdr,
      networkPassphrase: STELLAR_TESTNET_PASSPHRASE,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to build trustline";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
