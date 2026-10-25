# SpendGuard

> **Your money. Your limits. Your control.**

A spending-protection wallet built for the Stellar Hackathon. Every payment automatically splits **90% to the merchant and 10% to the user's savings**, enforced on-chain by Paiflow on the Stellar Testnet.

---

## 🌟 Key Features

1. **Automatic 90/10 On-Chain Split**: Every payment routes 90% to the recipient/merchant and 10% directly into the customer's savings destination (Personal Savings, Bayanihan Community Fund, or Creator Tip).
2. **Freighter Wallet Integration**: Connect and sign payments directly in browser via Freighter on Stellar Testnet.
3. **Live Horizon Balances**: Real-time polling for testnet XLM and USDC balances.
4. **USDC Trustline Setup**: One-click establishment of USDC trustlines on Stellar Testnet.
5. **Spending Protection Controls**: Enforce daily limits, cash-out rules, and single-transaction thresholds with Asia/Manila reset timezones.
6. **Bento Grid Dashboard**: Dark fintech visual design system with glassmorphism, animated SVG shield, category breakdowns, and weekly spending analytics.
7. **Identity Verification & Moderation**: Multi-step registration wizard with PhilSys ID capture, selfie liveness check, and administrative audit logging.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Design System (`#0B1014` dark slate, `#5DE0B0` mint accent)
- **Blockchain**: Stellar SDK (`@stellar/stellar-sdk`), Freighter API (`@stellar/freighter-api`), Stellar Testnet Horizon
- **Payment Automation**: Paiflow SDK (`@paiflow/sdk`) for on-chain split execution and verification
- **Database / State**: Prisma schema with in-memory double-entry ledger datastore
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `>=22.22.2 <23`
- pnpm `10.4.1`
- [Freighter Wallet](https://www.freighter.app/) browser extension configured to **Testnet**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Lawrencejay22/SpendGuard.git
cd SpendGuard

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
```

### 3. Environment Configuration
Configure `.env.local` with your Paiflow and Stellar credentials:
```env
PAIFLOW_BASE_URL=https://beta.app.paiflow.xyz
PAIFLOW_DEPLOYMENT_ID_XLM=<your-xlm-deployment-uuid>
PAIFLOW_DEPLOYMENT_ID_USDC=<your-usdc-deployment-uuid>
PAIFLOW_API_TOKEN=<your-pfd-or-pfk-token>
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
```

### 4. Running Locally
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, or visit [http://localhost:3000/overview](http://localhost:3000/overview) for the customer spending dashboard.

---

## 🧪 Testing & Validation

```bash
# Run test suite (78 tests)
pnpm test

# Run TypeScript typecheck
pnpm typecheck

# Check browser bundle security
node scripts/check-browser-bundle.mjs
```

---

## 📄 License
MIT License. Built for the Stellar Hackathon 2026.
