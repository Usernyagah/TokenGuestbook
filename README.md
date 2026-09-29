# 📜 Token-Gated Guestbook dApp (Stacks Blockchain)

A state-of-the-art, decentralized, token-gated guestbook application built on the **Stacks Blockchain** using **Clarity 2**, **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Scaffolding, contract type-checking, ABI code generation, and testnet deployments are powered by [`stacksdapp`](https://github.com/scaffold-stack/scaffold-stack).

---

## 🌟 Key Features

- 🔐 **Token-Gated Entry Verification**: Read-only on-chain access verification checking user's SIP-010 token balance ($\ge 1$ ACCESS token required to post).
- 🪙 **SIP-010 Access Token**: Custom fungible token contract (`access-token.clar`) with full transfer, minting, burning, and balance inspection capabilities.
- 💼 **Web3 Wallet Integration**: Seamless connect flow supporting **Leather Wallet** and **Xverse Wallet** via `@stacks/connect`.
- ⚡ **Auto-Generated Contract Bindings**: Typed TypeScript contract interfaces and hooks auto-generated via `stacksdapp generate`.
- 🎨 **Modern Glassmorphic Interface**: Fully responsive, dark-mode aesthetic built with Tailwind CSS, custom badges, and smooth micro-interactions.
- 🔄 **Real-Time Data Feed**: Live message retrieval with rate limiting (30s cooldown) and auto-refresh mechanisms.
- 🛡️ **Built-in Secret Guard**: Integrated git pre-commit hook preventing accidental commits of testnet/mainnet seed phrases.

---

## 🚀 Deployed Testnet Contracts

| Contract Name | Contract Identifier | Status | Explorer Details |
| :--- | :--- | :---: | :--- |
| **Access Token (SIP-010)** | `ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F.access-token` | `Confirmed` | [View on Hiro Explorer](https://explorer.hiro.so/txid/0x39e2731fb0a1ddbedc416f813acd67afbde52a16828c3343666e48425e335f86?chain=testnet) |
| **Guestbook Contract** | `ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F.guestbook` | `Confirmed` | [View on Hiro Explorer](https://explorer.hiro.so/txid/0x8b522ae48143cb0f7183e57627866c330542a56250db57fed0157b1e84392e08?chain=testnet) |

- **Deployer Account**: `ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F`
- **Network**: Stacks Testnet (`https://api.testnet.hiro.so`)
- **Block Height**: `577280`

---

## 🛠️ Architecture & Tech Stack

### Smart Contracts (Clarity 2)
- **[`contracts/access-token.clar`](contracts/access-token.clar)**: Implements the SIP-010 Fungible Token standard for gating guestbook access.
- **[`contracts/guestbook-v2.clar`](contracts/guestbook-v2.clar)**: Handles message validation, access checks via `contract-call? .access-token get-balance`, and on-chain storage.


### Frontend Application
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Stacks SDKs**: `@stacks/connect`, `@stacks/transactions`, `@stacks/network`, `@stacks/wallet-sdk`

### Tooling & CLI
- **`stacksdapp`**: scaffold-stacks CLI tool for type-checking, code generation, testing, and deployment.
- **Clarinet (3.24+)**: Clarity smart contract runtime, linter, and testing suite.

---

## 📁 Project Directory Structure

```text
TokenGuestbook/
├── contracts/
│   ├── Clarinet.toml                   # Clarinet contract project manifest
│   ├── access-token.clar               # SIP-010 Access Token contract
│   ├── guestbook-v2.clar               # Token-gated Guestbook contract
│   ├── settings/
│   │   ├── Devnet.toml                 # Devnet deployment configuration
│   │   ├── Testnet.toml                # Testnet deployment configuration & mnemonic
│   │   └── Mainnet.toml                # Mainnet deployment configuration
│   └── tests/                          # TypeScript unit tests for contracts
├── app/
│   ├── layout.tsx                      # Root layout with dark background
│   ├── page.tsx                        # Guestbook landing & dashboard
│   └── globals.css                     # Global styles & animation tokens
├── components/
│   ├── Header.tsx                      # Wallet connect button & status bar
│   ├── Hero.tsx                        # Hero section & feature badges
│   ├── TokenStatus.tsx                 # Real-time token balance indicator
│   ├── PostForm.tsx                    # Message composition form
│   └── GuestbookFeed.tsx               # On-chain guestbook feed
├── src/generated/
│   ├── deployments.json                # Live deployed contract addresses
│   └── abi/                            # Auto-generated contract ABIs
├── scripts/
│   └── export-abi.mjs                  # ABI extraction script for codegen
├── stacksdapp.toml                     # Scaffold Stacks configuration
├── .env.local                          # Environment variables & contract IDs
├── package.json                        # Dependencies & scripts
└── README.md                           # Documentation
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: v18.19+ (Node 20+ recommended)
- **Rust & Cargo**: For `stacksdapp` CLI compilation
- **Clarinet**: 3.23+ (`cargo install stacksdapp` / `clarinet --version`)

---

### Installation & Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/scaffold-stack/TokenGuestbook.git
   cd TokenGuestbook
   npm install
   ```

2. **Configure Environment Variables**:
   Ensure `.env.local` contains the deployed contract addresses:
   ```env
   NEXT_PUBLIC_NETWORK=testnet
   NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

   NEXT_PUBLIC_ACCESS_TOKEN_CONTRACT=ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F.access-token
   NEXT_PUBLIC_GUESTBOOK_CONTRACT=ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F.guestbook
   NEXT_PUBLIC_DEPLOYER_ADDRESS=ST2T6C1JTXS6AVQ4PTSQNS0MF666191WNC77NC2F
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   # or with stacksdapp CLI:
   stacksdapp dev --network testnet
   ```

4. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser. Connect Leather or Xverse wallet set to **Testnet**.

---

## 🧪 Smart Contract Development & Workflow

### 1. Type-Check Contracts
Validate Clarity syntax and contract type signatures:
```bash
stacksdapp check
```

### 2. Generate TypeScript Bindings
Extract ABIs and update generated interfaces in `src/generated/`:
```bash
stacksdapp generate
```

### 3. Deploy Contracts to Testnet
Deploy compiled contracts to Stacks Testnet using `stacksdapp`:
```bash
# Add deployer mnemonic to contracts/settings/Testnet.toml
stacksdapp deploy --network testnet --yes
```

---

## 📜 Smart Contract Reference

### 1. `access-token.clar` (SIP-010 Fungible Token)
- **`(get-name)`**: Returns `(ok "Access Token")`
- **`(get-symbol)`**: Returns `(ok "ACCESS")`
- **`(get-decimals)`**: Returns `(ok u0)`
- **`(get-total-supply)`**: Returns `(ok uint)`
- **`(get-balance (account principal))`**: Returns `(ok uint)`
- **`(transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 256))))`**: Transfers tokens between accounts.
- **`(mint (amount uint) (recipient principal))`**: Owner-only minting function.

### 2. `guestbook-v2.clar` (Token-Gated Guestbook)
- **`(post-message (content (string-utf8 280)))`**: Checks that `(contract-call? .access-token get-balance tx-sender)` $\ge 1$ before storing message on-chain.
- **`(get-message-count)`**: Read-only function returning total posts.
- **`(get-message (message-id uint))`**: Read-only lookup for a specific entry.
- **`(can-post (user principal))`**: Read-only helper verifying if `user` holds required access token.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
