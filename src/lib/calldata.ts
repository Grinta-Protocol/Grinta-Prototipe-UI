import {
  config,
  parseBtcAmount,
  parseGritAmount,
  u256Calldata,
  btcToWad,
  type StarknetCall,
} from "../lib/starknet";

export function generateOpenSafeCalldata(): StarknetCall[] {
  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "open_safe",
      calldata: [],
    },
  ];
}

export function generateOpenAndBorrowCalldata(
  collateralAmount: string,
  borrowAmount: string
): StarknetCall[] {
  const collateralAmountRaw = parseBtcAmount(collateralAmount);
  const borrowAmountRaw = parseGritAmount(borrowAmount);

  return [
    {
      contractAddress: config.wbtcAddress,
      entrypoint: "approve",
      calldata: [config.collateralJoinAddress, ...u256Calldata(collateralAmountRaw)],
    },
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "open_and_borrow",
      calldata: [...u256Calldata(collateralAmountRaw), ...u256Calldata(borrowAmountRaw)],
    },
  ];
}

export function generateDepositCalldata(safeId: bigint, amount: string): StarknetCall[] {
  const amountRaw = parseBtcAmount(amount);

  return [
    {
      contractAddress: config.wbtcAddress,
      entrypoint: "approve",
      calldata: [config.collateralJoinAddress, ...u256Calldata(amountRaw)],
    },
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "deposit",
      calldata: ["0x" + safeId.toString(16), ...u256Calldata(amountRaw)],
    },
  ];
}

export function generateWithdrawCalldata(safeId: bigint, amount: string): StarknetCall[] {
  const btcAmount = parseBtcAmount(amount);
  const wadAmount = btcToWad(btcAmount);

  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "withdraw",
      calldata: ["0x" + safeId.toString(16), ...u256Calldata(wadAmount)],
    },
  ];
}

export function generateBorrowCalldata(safeId: bigint, amount: string): StarknetCall[] {
  const amountRaw = parseGritAmount(amount);

  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "borrow",
      calldata: ["0x" + safeId.toString(16), ...u256Calldata(amountRaw)],
    },
  ];
}

export function generateRepayCalldata(safeId: bigint, amount: string): StarknetCall[] {
  const amountRaw = parseGritAmount(amount);

  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "repay",
      calldata: ["0x" + safeId.toString(16), ...u256Calldata(amountRaw)],
    },
  ];
}

export function generateCloseSafeCalldata(safeId: bigint): StarknetCall[] {
  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "close_safe",
      calldata: ["0x" + safeId.toString(16)],
    },
  ];
}

export function generateAuthorizeAgentCalldata(
  safeId: bigint,
  agentAddress: string
): StarknetCall[] {
  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "authorize_agent",
      calldata: ["0x" + safeId.toString(16), agentAddress],
    },
  ];
}

export function generateRevokeAgentCalldata(
  safeId: bigint,
  agentAddress: string
): StarknetCall[] {
  return [
    {
      contractAddress: config.safeManagerAddress,
      entrypoint: "revoke_agent",
      calldata: ["0x" + safeId.toString(16), agentAddress],
    },
  ];
}
