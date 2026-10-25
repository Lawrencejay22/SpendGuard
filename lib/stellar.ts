import * as StellarSdk from "@stellar/stellar-sdk";

export const STELLAR_TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";
export const STELLAR_TESTNET_HORIZON = "https://horizon-testnet.stellar.org";
export const STELLAR_EXPERT_TESTNET = "https://stellar.expert/explorer/testnet";

export const TESTNET_USDC_CODE = process.env.NEXT_PUBLIC_STELLAR_USDC_CODE || "USDC";
export const TESTNET_USDC_ISSUER =
  process.env.NEXT_PUBLIC_STELLAR_USDC_ISSUER || "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

const server = new StellarSdk.Horizon.Server(STELLAR_TESTNET_HORIZON);
const USDC = new StellarSdk.Asset(TESTNET_USDC_CODE, TESTNET_USDC_ISSUER);

export function getAccountExplorerUrl(address: string): string {
  return `${STELLAR_EXPERT_TESTNET}/account/${address}`;
}

export function getTxExplorerUrl(txHash: string): string {
  return `${STELLAR_EXPERT_TESTNET}/tx/${txHash}`;
}

export async function fundWithFriendbot(publicKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    if (resp.ok) {
      return { success: true, message: "Account successfully funded with 10,000 testnet XLM" };
    }
    const text = await resp.text();
    return { success: false, message: text || "Friendbot funding failed" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
}

export function xlmToStroops(amountXlm: number | string): string {
  const parsed = typeof amountXlm === "number" ? amountXlm : parseFloat(amountXlm);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error("Invalid amount");
  }
  return BigInt(Math.round(parsed * 10_000_000)).toString();
}

export function stroopsToXlm(stroops: string | bigint): string {
  const b = typeof stroops === "string" ? BigInt(stroops) : stroops;
  const whole = b / 10_000_000n;
  const frac = (b % 10_000_000n).toString().padStart(7, "0").replace(/0+$/, "");
  return frac.length > 0 ? `${whole}.${frac}` : whole.toString();
}

export const StellarServer = {
  async getBalances(address: string) {
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
      if (address.startsWith("GDKXJ2")) {
        // Built-in demo simulation balance
        return { xlm: "10000.00", usdc: "100.00", hasUsdcTrustline: true, notFunded: false, isDemo: true };
      }
      return { xlm: "0", usdc: "0", hasUsdcTrustline: false, notFunded: true };
    }

    try {
      const account = await server.loadAccount(address);
      const xlmBalance = account.balances.find((b) => b.asset_type === "native");
      const usdcBalance = account.balances.find(
        (b): b is StellarSdk.Horizon.HorizonApi.BalanceLineAsset =>
          b.asset_type !== "native" &&
          b.asset_type !== "liquidity_pool_shares" &&
          "asset_code" in b &&
          (b as { asset_code: string }).asset_code === TESTNET_USDC_CODE &&
          "asset_issuer" in b &&
          (b as { asset_issuer: string }).asset_issuer === TESTNET_USDC_ISSUER
      );
      return {
        xlm: xlmBalance?.balance ?? "0",
        usdc: usdcBalance?.balance ?? "0",
        hasUsdcTrustline: !!usdcBalance,
        notFunded: false,
      };
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 400) {
        // Account not yet funded on Stellar testnet
        return { xlm: "0", usdc: "0", hasUsdcTrustline: false, notFunded: true };
      }
      throw err;
    }
  },

  // For USDC trustline setup — server builds the XDR, browser signs it
  async buildTrustlineXdr(sourceAddress: string): Promise<string> {
    let account: StellarSdk.Account;
    try {
      const loaded = await server.loadAccount(sourceAddress);
      account = new StellarSdk.Account(sourceAddress, loaded.sequence);
    } catch {
      account = new StellarSdk.Account(sourceAddress, "0");
    }

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.changeTrust({ asset: USDC }))
      .setTimeout(60)
      .build();

    return tx.toXDR();
  },

  // Submit a signed trustline transaction
  async submitTrustline(signedXdr: string) {
    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    return server.submitTransaction(tx as StellarSdk.Transaction);
  },

  // Fund a testnet account with Friendbot
  async fundWithFriendbot(address: string) {
    const resp = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
    return resp.ok;
  },
};

export async function buildTrustlineXdr(sourcePublic: string): Promise<string> {
  return StellarServer.buildTrustlineXdr(sourcePublic);
}
