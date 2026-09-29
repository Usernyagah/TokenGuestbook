#!/bin/bash

# Token-Gated Guestbook Testnet Deployment Script
# Deployer: ST2C947592C8D33GE30PYAC71B4CD6QFR8G1EEKMS

echo "🚀 Deploying Token-Gated Guestbook to Testnet..."
echo "Deployer: ST2C947592C8D33GE30PYAC71B4CD6QFR8G1EEKMS"
echo ""

# Step 1: Deploy Access Token Contract
echo "📦 Step 1: Deploying Access Token contract..."
clarinet publish access-token
echo ""

# Step 2: Deploy Guestbook Contract
echo "📦 Step 2: Deploying Guestbook contract..."
clarinet publish guestbook-v2
echo ""

# Step 3: Get the deployed contract addresses
echo "📋 Step 3: Configure Guestbook with Token contract address..."
echo "You need to call set-token-contract with the deployed token contract address"
echo ""
echo "Example:"
echo "clarinet execute guestbook-v2 set-token-contract <token-contract-address>"
echo ""

echo "✅ Deployment complete!"
echo "Please record the contract addresses for future reference."
