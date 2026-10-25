import { NextResponse } from "next/server";
import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";

export const DEMO_WALLET_PUBLIC = "GBBW2CTAEIFCCDNYEDJRHM3TX5FWNQQG3WSFKEQYP7T53CIDEXC2UBEX";
const DEMO_WALLET_SECRET = process.env.DEMO_WALLET_SECRET || "SAQCLF7XCGPLXT67MTX5AQT7SY273NDDUGTKJVGJOXKLINTOCMLMR4YD";

export async function POST(req: Request) {
  try {
    const { unsignedXdr, networkPassphrase = "Test SDF Network ; September 2015" } = await req.json();

    if (!unsignedXdr) {
      return NextResponse.json({ error: "unsignedXdr is required" }, { status: 400 });
    }

    const kp = Keypair.fromSecret(DEMO_WALLET_SECRET);
    const tx = TransactionBuilder.fromXDR(unsignedXdr, networkPassphrase);
    tx.sign(kp);
    const signedXdr = tx.toXDR();

    return NextResponse.json({
      success: true,
      signedXdr,
      signer: DEMO_WALLET_PUBLIC,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
