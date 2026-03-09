---
name: starknet-defi
description: Execute DeFi operations on Starknet.
repo: keep-starknet-strange/starknet-agentic
---

# Starknet DeFi Skill

Enable AI agents to perform complex DeFi operations in one-click flows.

## Core Operations
- **Zap & Swap**: Multi-token swaps via AVNU/Ekubo in a single call.
- **DCA**: Recurring token purchase strategies.
- **Staking**: Deposit STRK/WBTC into native Starknet protocols.
- **Lending**: Manage debt and collateral positions (e.g., Vesu).

## MCP Tools
- `get_swap_quote`: Fetch best route and price from AVNU.
- `execute_swap`: Perform a token swap with slippage protection.
- `stake_token`: Deposit tokens into a vault with auto-compound.
- `rebalance_portfolio`: Move liquidity across protocols based on yield.

## Integrations
- **AVNU**: Primary swap aggregator.
- **Ekubo / JediSwap**: Direct liquidity provision.
- **StarkZap**: Onboarding and gasless orchestration.
