import { NextResponse } from "next/server";
import { StellarServer } from "@/lib/stellar";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  try {
    const balances = await StellarServer.getBalances(address);
    return NextResponse.json(balances);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch balances";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
