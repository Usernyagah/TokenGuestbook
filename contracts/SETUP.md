# Token-Gated Guestbook - Complete Setup

This directory contains the complete Clarity contracts and tests for a token-gated guestbook using SIP-010 tokens.

## 📁 Files

### Contracts
- **`access-token.clar`** - SIP-010 fungible token that serves as the gate
- **`guestbook-v2.clar`** - Main guestbook contract with token-gating logic

### Tests
- **`tests/guestbook_test.clar`** - Clarinet test file (`.clar` format)
- **`tests/guestbook_v2_test.ts`** - Vitest/TypeScript test template

### Configuration
- **`Clarinet.toml`** - Clarinet configuration with test accounts

## 🚀 Quick Start

### 1. Install Clarinet
```bash
npm install -g @hirosystems/clarinet
```

### 2. Run Tests
```bash
# Run Clarinet tests
clarinet test

# Or run in REPL
clarinet console
# Then: (include "tests/guestbook_test.clar")
```

### 3. Deploy Contracts
```bash
# Deploy to local devnet
clarinet deploy access-token
clarinet deploy guestbook-v2
```

## 📋 Contract Overview

### Access Token (SIP-010)
- **Total Supply**: 1,000,000 tokens
- **Decimals**: 0 (whole tokens)
- **Functions**:
  - `mint(amount, recipient)` - Owner only
  - `transfer(amount, sender, recipient, memo)`
  - `burn(amount)`
  - `get-balance(account)`

### Guestbook (Token-Gated)
- **Gating**: Requires ≥ 1 access token
- **Message Limit**: 280 characters
- **Functions**:
  - `set-token-contract(contract)` - Configure token contract (owner only)
  - `post-message(content)` - Post a message (requires token)
  - `get-messages(limit)` - Get latest messages (max 50)
  - `get-message-count()` - Total message count
  - `get-message(id)` - Get specific message
  - `can-post(user)` - Check if user can post

## 🧪 Test Coverage

The Clarinet tests cover:
1. ✅ Initial token supply and balances
2. ✅ Setting token contract address
3. ✅ **Successful post when holding token**
4. ✅ **Failed post when not holding token**
5. ✅ **Empty message rejection**
6. ✅ **Message too long rejection**
7. ✅ Reading messages
8. ✅ Message count tracking
9. ✅ Can-post checks
10. ✅ Token burn and regain access

## 📝 Error Codes

### Guestbook Contract
- `u100` - Not contract owner
- `u200` - Empty message
- `u201` - Message too long (> 280 chars)
- `u202` - No token access (balance < 1)
- `u300` - Message not found

### Access Token Contract
- `u100` - Sender must be tx-sender
- `u101` - Insufficient balance
- `u102` - Amount must be > 0
- `u200` - Only owner can mint
- `u201` - Amount must be > 0
- `u300` - Insufficient balance
- `u301` - Amount must be > 0

## 🔧 Deployment Steps

1. **Deploy the token contract first**
2. **Deploy the guestbook contract**
3. **Configure the guestbook** (as contract owner):
   ```clarity
   contract-call? guestbook-v2 set-token-contract <token-contract-principal>
   ```
4. **Mint tokens to users who should have access**
5. **Users can now post messages**

## 📄 Usage Example

```clarity
;; Mint token to a user
contract-call? access-token mint u1 <user-principal>

;; User posts a message
contract-call? guestbook-v2 post-message "Hello world!"

;; Read latest messages
contract-call? guestbook-v2 get-messages u10

;; Check if user can post
contract-call? guestbook-v2 can-post <user-principal>
```

## 🎯 Key Features

- **Token Gating**: Only token holders can post
- **Message Validation**: Prevents empty and overly long messages
- **Configurable**: Token contract address can be set after deployment
- **Efficient Storage**: Messages stored with author, content, timestamp, block-height
- **Pagination**: Support for reading messages in batches
- **Read Functions**: Helper functions for frontend integration

## 🔄 Integration Notes

The guestbook contract is designed to be easily integrated with:
- Next.js frontend (via @stacks/transactions)
- Scaffold Stacks hooks
- Any Stacks wallet (Leather, Xverse, etc.)

The `can-post(user)` function is particularly useful for frontend validation before showing the post form.
