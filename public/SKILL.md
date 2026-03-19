---
name: grinta-cdp-agent
description: >
  Onboard an AI agent onto Starknet Sepolia and interact with the Grinta CDP protocol
  via MCP tools. Use when: (1) creating a new agent account on Starknet (keypair generation,
  funding, deployment, WBTC minting), (2) managing Grinta CDPs — open/close safes, deposit/withdraw
  WBTC collateral, borrow/repay GRIT stablecoin, (3) checking position health, system status,
  or wallet balances, (4) swapping tokens via Ekubo DEX, (5) updating BTC/USD oracle price.
  Supports Claude Code (.mcp.json), OpenCode (opencode.json), and OpenClaw (mcporter).
metadata:
  openclaw:
    mcp:
      server: "@grinta-mcp/server"
      env:
        - STARKNET_ACCOUNT_ADDRESS
        - STARKNET_PRIVATE_KEY
        - STARKNET_RPC_URL
    requires:
      bins: ["node", "npm", "npx"]
      packages: ["starknet@^8.9.0", "tsx@^4.19.0"]
---

# Grinta CDP Agent

## Phase 1: Onboard Agent

Create a new Starknet agent account with WBTC collateral. This phase requires no project clone — create and run the script below directly.

### Prerequisites

- Node.js 18+ (available in Claude Code, OpenCode, and OpenClaw runtimes)
- `starknet` v8+ (`npm i starknet@^8.9.0`) — v6 API is incompatible
- `tsx` for running TypeScript (`npm i -D tsx`)
- A Starknet Sepolia RPC URL (e.g. `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/<key>`)

> **Runtime note**: All three environments (Claude Code, OpenCode, OpenClaw) have access to
> Node.js and npm. The onboarding script can be created and executed directly in any of them.
> OpenClaw agents should create the working directory (e.g. `~/grinta-agent/`) and run
> `npm init -y && npm i starknet@^8.9.0 tsx@^4.19.0` before proceeding.

### Step 1: Generate Keypair

Create `onboard-agent.ts` and run with `npx tsx onboard-agent.ts generate`.
Set env: `STARKNET_RPC_URL`.

This generates the keypair and precalculated address, then saves to `agent-credentials.json`.

### Step 2: Fund via Faucet (MANUAL — requires user action)

> **IMPORTANT**: This step cannot be automated by the agent. You must ask the user to do it.

Tell the user to go to https://starknet-faucet.vercel.app/ and paste the agent address from step 1.
This sends STRK tokens for gas. **Wait for the user to confirm funding before proceeding to step 3.**
If the faucet fails or is rate-limited, alternatives:
- Alchemy faucet: https://www.alchemy.com/faucets/starknet-sepolia
- Wait 24h and retry

After funding, verify the balance on-chain before deploying:
- Check https://sepolia.starkscan.co/contract/<agent-address> for STRK balance > 0
- Or use the RPC to call `starknet_getBalance` on the agent address

### Step 3: Deploy & Mint

Run `npx tsx onboard-agent.ts deploy` to deploy the account and mint 1 WBTC.

### Onboarding Script

```typescript
import { Account, RpcProvider, Contract, hash, ec, stark } from "starknet";
import { writeFileSync, readFileSync, existsSync } from "fs";

const RPC_URL = process.env.STARKNET_RPC_URL!;
if (!RPC_URL) {
  console.error("Missing STARKNET_RPC_URL");
  process.exit(1);
}

const OZ_ACCOUNT_CLASS_HASH = "0x5b4b537eaa2399e3aa99c4e2e0208ebd6c71bc1467938cd52c798c601e43564";

const TOKENS = {
  WBTC: "0x055adbd6123ce69b2498fc99aec5006d00ac8b57070c99133f2c67c262e69223",
};

const MINTABLE_ABI = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" },
    ],
    outputs: [],
    state_mutability: "external",
  },
];

const provider = new RpcProvider({ nodeUrl: RPC_URL });

async function waitTx(txHash: string, label: string) {
  const receipt = await provider.waitForTransaction(txHash);
  console.log(`   Done: ${label}`);
  return receipt;
}

async function generate() {
  console.log("Step 1: Generate keypair");
  const privateKey = stark.randomAddress();
  const publicKey = ec.starkCurve.getStarkKey(privateKey);
  const agentAddress = hash.calculateContractAddressFromHash(
    0, OZ_ACCOUNT_CLASS_HASH, [publicKey], BigInt(0)
  );
  console.log(`   Address:     ${agentAddress}`);
  console.log(`   Private Key: ${privateKey}`);

  const result = { address: agentAddress, privateKey, publicKey, rpcUrl: RPC_URL };
  writeFileSync("./agent-credentials.json", JSON.stringify(result, null, 2));
  console.log("Saved to agent-credentials.json");
  console.log("\nNext: fund this address with STRK via https://starknet-faucet.vercel.app/");
  console.log("Then run: npx tsx onboard-agent.ts deploy");
}

async function deploy() {
  if (!existsSync("./agent-credentials.json")) {
    console.error("No agent-credentials.json found. Run 'npx tsx onboard-agent.ts generate' first.");
    process.exit(1);
  }
  const creds = JSON.parse(readFileSync("./agent-credentials.json", "utf-8"));
  const { address, privateKey, publicKey } = creds;

  // Deploy OZ account
  console.log("Step 3: Deploy account");
  const agentAccount = new Account({ provider, address, signer: privateKey });
  try {
    const deployResult = await agentAccount.deployAccount({
      classHash: OZ_ACCOUNT_CLASS_HASH,
      constructorCalldata: [publicKey],
      addressSalt: 0,
    });
    await waitTx(deployResult.transaction_hash, "Account deployed");
  } catch (e: any) {
    if (e.message?.includes("already deployed") || e.message?.includes("0x20")) {
      console.log("   Account already deployed");
    } else {
      throw e;
    }
  }

  // Mint WBTC
  console.log("Step 4: Mint WBTC");
  const wbtcAmount = BigInt(100_000_000); // 1 WBTC (8 decimals)
  const wbtc = new Contract({ abi: MINTABLE_ABI, address: TOKENS.WBTC, providerOrAccount: agentAccount });
  const { transaction_hash: mintTx } = await agentAccount.execute([
    wbtc.populate("mint", [address, wbtcAmount]),
  ]);
  await waitTx(mintTx, "1 WBTC minted");

  console.log("\nOnboarding complete! Configure MCP server with these credentials.");
}

const command = process.argv[2];
if (command === "generate") {
  generate().catch((e) => { console.error("Failed:", e.message || e); process.exit(1); });
} else if (command === "deploy") {
  deploy().catch((e) => { console.error("Failed:", e.message || e); process.exit(1); });
} else {
  console.log("Usage: npx tsx onboard-agent.ts <generate|deploy>");
}
```

Output is saved to `agent-credentials.json`:
```json
{ "address": "0x...", "privateKey": "0x...", "rpcUrl": "https://..." }
```

## Phase 2: Configure MCP Server

After onboarding, connect the `grinta-cdp` MCP server using the agent credentials.
The MCP server is available as an npm package: `npm i @grinta-mcp/server`.

### Claude Code (`.mcp.json`)

```json
{
  "mcpServers": {
    "grinta-cdp": {
      "command": "npx",
      "args": ["@grinta-mcp/server"],
      "env": {
        "STARKNET_ACCOUNT_ADDRESS": "<address from agent-credentials.json>",
        "STARKNET_PRIVATE_KEY": "<privateKey from agent-credentials.json>",
        "STARKNET_RPC_URL": "<rpcUrl from agent-credentials.json>"
      }
    }
  }
}
```

### OpenCode (`opencode.json`)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "grinta-cdp": {
      "type": "local",
      "command": ["npx", "@grinta-mcp/server"],
      "enabled": true,
      "environment": {
        "STARKNET_ACCOUNT_ADDRESS": "<address from agent-credentials.json>",
        "STARKNET_PRIVATE_KEY": "<privateKey from agent-credentials.json>",
        "STARKNET_RPC_URL": "<rpcUrl from agent-credentials.json>"
      }
    }
  }
}
```

### OpenClaw (`.mcporter.json`)

OpenClaw agents use `mcporter` to bridge MCP servers into the OpenClaw runtime.
The working directory is typically `~/grinta-agent/`.

```bash
# 1. Install dependencies in your working directory
npm init -y && npm i starknet@^8.9.0 tsx@^4.19.0
```

```json
{
  "servers": {
    "grinta-cdp": {
      "command": "npx",
      "args": ["@grinta-mcp/server"],
      "env": {
        "STARKNET_ACCOUNT_ADDRESS": "<address from agent-credentials.json>",
        "STARKNET_PRIVATE_KEY": "<privateKey from agent-credentials.json>",
        "STARKNET_RPC_URL": "<rpcUrl from agent-credentials.json>"
      }
    }
  }
}
```

Once configured, call tools via mcporter:
```bash
# Verify connection
mcporter call grinta-cdp.grinta_get_balances --config .mcporter.json

# Example operations
mcporter call grinta-cdp.grinta_open_safe --config .mcporter.json
mcporter call grinta-cdp.grinta_deposit safe_id=1 amount=0.5 --config .mcporter.json
mcporter call grinta-cdp.grinta_borrow safe_id=1 amount=1000 --config .mcporter.json
```

**Credential storage**: Save `agent-credentials.json` to your agent's persistent memory
(e.g. `~/.openclaw/workspace/agents/<AgentName>/memory/grinta-cdp.md`) so credentials
survive across sessions. Never share the private key.

After configuring, restart the MCP server in your tool to pick up credentials.

## Phase 3: Grinta CDP Flow (MCP Tools)

All protocol interactions use MCP tools — no scripts needed.

### Typical CDP Lifecycle

```
1. grinta_get_balances          — verify WBTC is available
2. grinta_open_safe             — create a new SAFE (vault)
3. grinta_deposit               — deposit WBTC collateral into SAFE
4. grinta_get_max_borrow        — check how much GRIT can be borrowed
5. grinta_borrow                — borrow GRIT against collateral
6. grinta_get_position_health   — monitor LTV and liquidation price
7. grinta_swap                  — swap GRIT for USDC on Ekubo DEX
8. grinta_repay                 — repay GRIT debt
9. grinta_withdraw              — withdraw WBTC collateral
10. grinta_close_safe           — close SAFE (requires zero debt)
```

### MCP Tools Reference

| Tool | Action | Key Parameters |
|------|--------|----------------|
| `grinta_get_balances` | Wallet balances (ETH, WBTC, GRIT, USDC) | `address` (optional) |
| `grinta_get_system_status` | BTC price, GRIT price, total debt, debt ceiling | — |
| `grinta_get_position_health` | Collateral value, debt, LTV, liquidation price | `safe_id` |
| `grinta_get_safe` | Raw SAFE data (collateral/debt in WAD) | `safe_id` |
| `grinta_get_max_borrow` | Max additional GRIT borrowable | `safe_id` |
| `grinta_open_safe` | Open a new empty SAFE | — |
| `grinta_deposit` | Approve + deposit WBTC into SAFE | `safe_id`, `amount` |
| `grinta_withdraw` | Withdraw WBTC from SAFE | `safe_id`, `amount` |
| `grinta_borrow` | Borrow GRIT against collateral | `safe_id`, `amount` |
| `grinta_repay` | Repay GRIT debt | `safe_id`, `amount` |
| `grinta_close_safe` | Close SAFE (debt must be zero) | `safe_id` |
| `grinta_swap` | Swap tokens via Ekubo DEX | `from`, `to`, `amount` |
| `grinta_update_btc_price` | Push BTC/USD price to oracle | — |
| `grinta_trigger_update` | Trigger system price/rate update | — |

### Safety Rules

- Check `grinta_get_position_health` before and after borrowing.
- Keep LTV below 50% for safety margin (liquidation at 150% ratio = ~66.7% LTV).
- Always repay all debt before calling `grinta_close_safe`.
- Amounts use human-readable format: `"0.5"` for WBTC, `"1000"` for GRIT.

### Token Decimals

| Token | Decimals | Example |
|-------|----------|---------|
| WBTC | 8 | `"0.1"` = 10,000,000 |
| GRIT | 18 | `"100"` = 100 * 10^18 |
| ETH | 18 | `"0.01"` = 10^16 |

## Network

- **Chain**: Starknet Sepolia (testnet)
- **Explorer**: https://sepolia.starkscan.co

## Contract Addresses

| Contract | Address |
|----------|---------|
| SAFE Manager | `0x044728823ae43429eb96c14646077a461101a5db09ce6329a16684dcf199e552` |
| SAFE Engine | `0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2` |
| Collateral Join | `0x042a4228c74a2d8933549fb06208b1055ea628d63fa43081d76e41a9d43a8c22` |
| Grinta Hook | `0x062347cbbb4e4da5c5eea0df072c471ffa530da08b9c04080875d2087f39f38d` |
| WBTC | `0x055adbd6123ce69b2498fc99aec5006d00ac8b57070c99133f2c67c262e69223` |
| GRIT | `0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2` |
| USDC | `0x0728f54606297716e46af72251733521e2c2a374abbc3dce4bcee8df4744dd30` |
| ETH | `0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7` |

## Troubleshooting

- **Account deployment fails**: Ensure the agent address has sufficient STRK balance for gas. Check on explorer before deploying.
- **"Resources bounds exceed balance (0)"**: The wallet has no STRK. The faucet funding either failed or hasn't confirmed yet. Ask the user to verify and re-fund.
- **Starknet v8 Account constructor**: In v8, `Account` takes an options object: `new Account({ provider, address, signer: privateKey })`. Do NOT use positional arguments like v6 (`new Account(provider, address, privateKey)`) — this will fail silently or throw.
- **MCP not responding**: Restart MCP server; verify credentials in config file. For OpenClaw, check `.mcporter.json` is in the working directory.
- **"Exceeds max borrow"**: Reduce borrow amount or deposit more collateral.
- **"SAFE not authorized"**: Agent is not the owner of that SAFE ID.
- **Nonce errors**: Retry the transaction — nonce may have been consumed by a prior tx.
- **Script corruption**: If the onboarding script gets corrupted during creation, delete it and rewrite from scratch using the template in this skill.
