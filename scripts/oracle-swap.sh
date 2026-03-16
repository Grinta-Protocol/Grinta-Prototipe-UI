#!/bin/bash
# Grinta Protocol - Oracle Update + Swap Script
# Runs every 30 minutes via cron
# Usage: ./scripts/oracle-swap.sh

set -e

# =============================================================================
# Configuration
# =============================================================================
RPC_URL="${STARKNET_RPC_URL:-https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/A_aQEk8ItXSiyZveFp_6y}"
ACCOUNT="${ACCOUNT:-account_ready}"

# Contract Addresses (Sepolia)
SAFE_ENGINE="0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2"
GRINTA_HOOK="0x062347cbbb4e4da5c5eea0df072c471ffa530da08b9c04080875d2087f39f38d"
ORACLE_RELAYER="0x04acb771661162edeb881001a38282faff841e9118230b08f6df8e3a0920516f"
WBTC_TOKEN="0x055adbd6123ce69b2498fc99aec5006d00ac8b57070c99133f2c67c262e69223"
USDC_TOKEN="0x0728f54606297716e46af72251733521e2c2a374abbc3dce4bcee8df4744dd30"
GRIT_TOKEN="0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2"

# Swap Amount (1 GRIT = 1e18 in WAD format)
SWAP_AMOUNT_WAD="1000000000000000000"

# Price APIs (CoinGecko has rate limits, fallback to Coinbase)
COINGECKO_URL="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
COINBASE_URL="https://api.coinbase.com/v2/prices/BTC-USD/spot"

# =============================================================================
# Helper Functions
# =============================================================================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Convert USD price to WAD format (18 decimals)
usd_to_wad() {
    local usd_price=$1
    # Multiply by 10^18 to get WAD format
    python3 -c "print(int($usd_price * 10**18))"
}

# =============================================================================
# Step 1: Fetch BTC Price (try CoinGecko first, fallback to Coinbase)
# =============================================================================
log "Fetching BTC price..."

BTC_PRICE=""

# Try Coinbase first (more reliable)
BTC_RESPONSE=$(curl -s --max-time 10 "$COINBASE_URL")
if [ $? -eq 0 ] && echo "$BTC_RESPONSE" | grep -q "data"; then
    BTC_PRICE=$(echo "$BTC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['amount'])")
    log "Got BTC price from Coinbase: \$$BTC_PRICE"
else
    # Fallback to CoinGecko
    log "Coinbase failed, trying CoinGecko..."
    BTC_RESPONSE=$(curl -s --max-time 10 "$COINGECKO_URL")
    if [ $? -eq 0 ] && echo "$BTC_RESPONSE" | grep -q "bitcoin"; then
        BTC_PRICE=$(echo "$BTC_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['bitcoin']['usd'])")
        log "Got BTC price from CoinGecko: \$$BTC_PRICE"
    else
        error "Failed to fetch BTC price from both APIs"
        exit 1
    fi
fi

if [ -z "$BTC_PRICE" ]; then
    error "Failed to parse BTC price"
    exit 1
fi

log "Current BTC price: \$$BTC_PRICE USD"

# Convert to WAD format (18 decimals)
BTC_WAD=$(usd_to_wad "$BTC_PRICE")
log "BTC price in WAD format: $BTC_WAD"

# =============================================================================
# Step 2: Update Collateral Price on OracleRelayer
# =============================================================================
log "Updating collateral price on OracleRelayer..."

UPDATE_COLLATERAL_RESULT=$(sncast \
    --account "$ACCOUNT" \
    invoke \
    --url "$RPC_URL" \
    --contract-address "$ORACLE_RELAYER" \
    --function update_price \
    --arguments "$WBTC_TOKEN, $USDC_TOKEN, $BTC_WAD" 2>&1)

if echo "$UPDATE_COLLATERAL_RESULT" | grep -q "Invoke completed"; then
    log "Collateral price updated successfully"
else
    error "Failed to update collateral price: $UPDATE_COLLATERAL_RESULT"
    exit 1
fi

# Wait for transaction to be accepted
sleep 5

# =============================================================================
# Step 3: Update GrintaHook (refreshes Ekubo oracle prices)
# =============================================================================
log "Updating GrintaHook..."

UPDATE_HOOK_RESULT=$(sncast \
    --account "$ACCOUNT" \
    invoke \
    --url "$RPC_URL" \
    --contract-address "$GRINTA_HOOK" \
    --function update 2>&1)

if echo "$UPDATE_HOOK_RESULT" | grep -q "Invoke completed"; then
    log "GrintaHook updated successfully"
else
    error "Failed to update GrintaHook: $UPDATE_HOOK_RESULT"
    exit 1
fi

# Wait for transaction to be accepted
sleep 5

# =============================================================================
# Step 4: Execute Swap on Ekubo (USDC -> GRIT)
# =============================================================================
log "Executing swap on Ekubo Router..."

# Note: Ekubo requires a lock callback contract for swaps
# This is a placeholder - you need to deploy a swap contract
# The swap contract should:
# 1. Call ICore.lock() on Ekubo router
# 2. In the locked() callback, execute the swap

log "WARNING: Ekubo swap requires a custom contract with lock callback"
log "Please deploy a swap contract and update SWAP_CONTRACT_ADDRESS"

# Example of what the swap call would look like (after deploying swap contract):
# SWAP_CONTRACT="0xYOUR_SWAP_CONTRACT_ADDRESS"
# sncast invoke \
#     --url "$RPC_URL" \
#     --account "$ACCOUNT" \
#     --contract-address "$SWAP_CONTRACT" \
#     --function execute_swap \
#     --calldata "$USDC_TOKEN" "$GRIT_TOKEN" "$SWAP_AMOUNT_WAD" "0" "0" "0" "0"

# =============================================================================
# Summary
# =============================================================================
log "=== Oracle Update Complete ==="
log "BTC Price: \$$BTC_PRICE"
log "Collateral Price (WAD): $BTC_WAD"
log "SafeEngine: Updated"
log "GrintaHook: Updated"
log "Swap: Skipped (requires swap contract deployment)"
log "=============================="

exit 0
