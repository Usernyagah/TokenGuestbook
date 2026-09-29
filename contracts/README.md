# Token-Gated Guestbook Smart Contracts

This directory contains the Clarity smart contracts for the Token-Gated Guestbook dapp.

## Contracts

### 1. `guestbook-token.clar` - SIP-010 Fungible Token
A standard SIP-010 fungible token that serves as the primary gate for accessing the guestbook.

**Key Features:**
- Standard SIP-010 compliance
- Minting (owner only)
- Transfers
- Burning
- Total supply: 1,000,000 tokens
- Decimals: 0 (whole tokens)

**Key Functions:**
- `transfer(amount, sender, recipient, memo)` - Transfer tokens
- `mint(amount, recipient)` - Mint new tokens (owner only)
- `burn(amount)` - Burn tokens
- `get-balance(account)` - Get token balance
- `has-access(account)` - Check if account has ≥ 1 token

### 2. `guestbook-nft.clar` - SIP-009 Non-Fungible Token
A standard SIP-009 NFT that serves as an alternative gate for accessing the guestbook.

**Key Features:**
- Standard SIP-009 compliance
- Minting (owner only)
- Transfers
- Burning
- Max supply: 1,000 NFTs

**Key Functions:**
- `mint(recipient)` - Mint new NFT (owner only)
- `transfer(token-id, sender, recipient)` - Transfer NFT
- `burn(token-id)` - Burn NFT
- `get-owner(token-id)` - Get NFT owner
- `has-access(account)` - Check if account owns ≥ 1 NFT

### 3. `guestbook.clar` - Main Guestbook Contract
The main contract that stores messages and enforces token-gating.

**Key Features:**
- Token-gated posting (requires ≥ 1 GUEST token OR ≥ 1 Guestbook NFT)
- Message storage with author, content, timestamp, and block height
- Rate limiting (12 blocks / ~1 minute between posts)
- Empty message prevention
- Max message length: 280 characters
- Pagination support
- Author-specific message queries

**Key Functions:**
- `set-token-contract(contract)` - Set the SIP-10 token contract address (owner only)
- `set-nft-contract(contract)` - Set the SIP-009 NFT contract address (owner only)
- `post-message(content)` - Post a new message (requires token/NFT)
- `get-message(message-id)` - Get a specific message by ID
- `get-latest-messages(count)` - Get the latest N messages (max 50)
- `get-messages-paginated(offset, limit)` - Get messages with pagination
- `get-message-count()` - Get total message count
- `can-post(user)` - Check if a user can post (read-only)
- `get-messages-by-author(author, limit)` - Get messages by a specific author
- `get-rate-limit-info(user)` - Get rate limit info for a user

## Deployment Steps

### 1. Deploy the Token Contract
```bash
clarinet deploy guestbook-token
```

### 2. Deploy the NFT Contract
```bash
clarinet deploy guestbook-nft
```

### 3. Deploy the Guestbook Contract
```bash
clarinet deploy guestbook
```

### 4. Configure the Guestbook Contract
After deployment, the contract owner must set the token and NFT contract addresses:

```clarity
# Set the token contract address
contract-call? guestbook set-token-contract <token-contract-principal>

# Set the NFT contract address
contract-call? guestbook set-nft-contract <nft-contract-principal>
```

## Usage Example

### Minting Tokens (Owner)
```clarity
contract-call? guestbook-token mint u100 <user-principal>
```

### Minting NFTs (Owner)
```clarity
contract-call? guestbook-nft mint <user-principal>
```

### Posting a Message (Token/NFT Holder)
```clarity
contract-call? guestbook post-message "Hello from the token-gated guestbook!"
```

### Reading Messages
```clarity
# Get latest 10 messages
contract-call? guestbook get-latest-messages u10

# Get message by ID
contract-call? guestbook get-message u1

# Get messages with pagination
contract-call? guestbook get-messages-paginated u0 u20
```

## Rate Limiting

The guestbook enforces a rate limit of 12 blocks (approximately 1 minute on Stacks) between posts per wallet. This prevents spam while allowing reasonable usage.

## Error Codes

### Guestbook Contract
- `u100` - Not contract owner
- `u101` - Not contract owner (NFT)
- `u200` - Empty message
- `u201` - Message too long
- `u202` - No token/NFT access
- `u203` - Rate limited
- `u300` - Message not found

### Token Contract
- `u100` - Sender must be tx-sender
- `u101` - Insufficient balance
- `u102` - Amount must be > 0
- `u200` - Only owner can mint
- `u201` - Amount must be > 0
- `u300` - Insufficient balance
- `u301` - Amount must be > 0

### NFT Contract
- `u100` - Only owner can mint
- `u101` - Max supply reached
- `u200` - Token doesn't exist
- `u201` - Sender is not owner
- `u202` - tx-sender must be owner
- `u300` - Token doesn't exist
- `u301` - tx-sender must be owner
- `u401` - Token not found

## Testing

Run tests with Clarinet:
```bash
clarinet test
```

Run in REPL:
```bash
clarinet console
```

## Clarity Version

All contracts use Clarity 2 (clarity_version = "2").
