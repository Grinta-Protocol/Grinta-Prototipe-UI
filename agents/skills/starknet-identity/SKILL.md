---
name: starknet-identity
description: ERC-8004 on-chain identity and reputation for agents.
repo: keep-starknet-strange/starknet-agentic
---

# Starknet Identity Skill

Enable AI agents to register and build reputation on Starknet using the trustless agents standard.

## Features
- **ERC-8004 Registration**: Mint agent identity as a non-fungible on-chain token.
- **Reputation Tracking**: Feedback loop for success/failure of agent tasks.
- **Third-Party Validation**: Request on-chain audit of agent code or behavior.
- **Attribute Registry**: Define agent capabilities and constraints in a public registry.

## Use Cases
- Verifiable AI agents (proving "Agentic Origin").
- Trustless interaction between autonomous agents (Agent-to-Agent).
- Credential management for session-keys and spend-policing.

## Implementation Details
- Uses `erc8004-cairo` contracts.
- Integrated with `mcp-server` for attribute verification.
- Supports cross-chain identity resolution.
