---
name: starknet-wallet
description: Manage Starknet wallets for AI agents with native Account Abstraction support.
repo: keep-starknet-strange/starknet-agentic
---

# Starknet Wallet Skill

Enable AI agents to perform wallet operations on Starknet.

## Capabilities
- **Transfer Tokens**: Send ETH, STRK, USDC or any ERC20.
- **Check Balance**: Audit balances across multiple tokens (batch supported).
- **Session Keys**: Delegated signing for autonomous actions.
- **Gasless Transactions**: Paymaster integration (Pay gas in tokens using AVNU/Cartridge).
- **Multi-call**: Chain multiple interactions in a single atomic transaction.

## MCP Tools
- `get_balance`: Check token balance for a specific address.
- `execute_transfer`: Execute a token transfer.
- `simulate_call`: Simulate an interaction to estimate gas.
- `batch_transfer`: Execute multiple transfers in one call.
- `create_session`: Create a scoped session key for a tool.

## SDK Version
- Requires `starknet.js` ^9.0.0
- Compatible with `starknet-agentic` Core.
