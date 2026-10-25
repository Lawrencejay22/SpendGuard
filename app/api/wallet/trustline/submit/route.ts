import { NextResponse } from "next/server";
import { StellarServer } from "@/lib/stellar";

export async function POST(req: Request) {
  try {
    const { signedXdr } = await req.json();
    if (!signedXdr) {
      return NextResponse.json({ error: "signedXdr required" }, { status: 400 });
    }

    const result = await StellarServer.submitTrustline(signedXdr);
    return NextResponse.json({ success: true, hash: result.hash });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to submit trustline";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
