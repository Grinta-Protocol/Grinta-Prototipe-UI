import { RpcProvider, Contract, num } from "starknet";
import { config } from "../config/contracts";

const WAD = 10n ** 18n;
const RAY = 10n ** 27n;
const WAD_DECIMALS = 18;
const RAY_DECIMALS = 27;
const WBTC_DECIMALS = 8;

let _provider: RpcProvider | undefined;
let _safeManager: Contract | undefined;
let _safeEngine: Contract | undefined;
let _wbtcContract: Contract | undefined;
let _pidController: Contract | undefined;
let _grintaHook: Contract | undefined;
let _collateralJoin: Contract | undefined;

export function getProvider(): RpcProvider {
  if (!_provider) {
    _provider = new RpcProvider({ nodeUrl: config.rpcUrl });
  }
  return _provider;
}

export function getSafeManager(): Contract {
  if (!_safeManager) {
    _safeManager = new Contract({
      abi: config.abis.safeManager,
      address: config.safeManagerAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _safeManager;
}

export function getSafeEngine(): Contract {
  if (!_safeEngine) {
    _safeEngine = new Contract({
      abi: config.abis.safeEngine,
      address: config.safeEngineAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _safeEngine;
}

export function getWbtcContract(): Contract {
  if (!_wbtcContract) {
    _wbtcContract = new Contract({
      abi: config.abis.erc20,
      address: config.wbtcAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _wbtcContract;
}

export function getPidController(): Contract {
  if (!_pidController) {
    _pidController = new Contract({
      abi: config.abis.pidController,
      address: config.pidControllerAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _pidController;
}

export function getGrintaHook(): Contract {
  if (!_grintaHook) {
    _grintaHook = new Contract({
      abi: config.abis.grintaHook,
      address: config.grintaHookAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _grintaHook;
}

export function getCollateralJoin(): Contract {
  if (!_collateralJoin) {
    _collateralJoin = new Contract({
      abi: config.abis.collateralJoin,
      address: config.collateralJoinAddress,
      providerOrAccount: getProvider(),
    });
  }
  return _collateralJoin;
}

export function formatBtcAmount(value: bigint): string {
  const whole = value / 10n ** BigInt(WBTC_DECIMALS);
  const frac = value % 10n ** BigInt(WBTC_DECIMALS);
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(WBTC_DECIMALS, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

export interface StarknetCall {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

export function formatWad(value: bigint, symbol?: string): string {
  const whole = value / WAD;
  const frac = value % WAD;
  const fracStr = frac.toString().padStart(WAD_DECIMALS, "0").replace(/0+$/, "");
  const numStr = fracStr ? `${whole}.${fracStr}` : `${whole}`;
  return symbol ? `${numStr} ${symbol}` : numStr;
}

export function formatRay(value: bigint, symbol?: string): string {
  const whole = value / RAY;
  const frac = value % RAY;
  const fracStr = frac.toString().padStart(RAY_DECIMALS, "0").replace(/0+$/, "");
  const numStr = fracStr ? `${whole}.${fracStr}` : `${whole}`;
  return symbol ? `${numStr} ${symbol}` : numStr;
}

export function formatWadPercent(value: bigint): string {
  const pct = (value * 10000n) / WAD;
  const whole = pct / 100n;
  const frac = pct % 100n;
  return `${whole}.${frac.toString().padStart(2, "0")}%`;
}

export function formatUsd(value: bigint): string {
  return "$" + formatWad(value);
}

export function parseBtcAmount(amount: string): bigint {
  const parts = amount.split(".");
  const whole = BigInt(parts[0] || "0");
  const fracStr = (parts[1] || "").padEnd(WBTC_DECIMALS, "0").slice(0, WBTC_DECIMALS);
  return whole * 10n ** BigInt(WBTC_DECIMALS) + BigInt(fracStr);
}

export function parseGritAmount(amount: string): bigint {
  const parts = amount.split(".");
  const whole = BigInt(parts[0] || "0");
  const fracStr = (parts[1] || "").padEnd(WAD_DECIMALS, "0").slice(0, WAD_DECIMALS);
  return whole * WAD + BigInt(fracStr);
}

export function formatBtcFromWad(wadAmount: bigint): string {
  return formatWad(wadAmount, "BTC");
}

export function formatAnnualRate(rayRate: bigint): string {
  const SECONDS_PER_YEAR = 31536000;
  const ratePerSecond = Number(rayRate) / Number(RAY);
  const annualRate = Math.exp(Math.log(ratePerSecond) * SECONDS_PER_YEAR) - 1;
  const pct = annualRate * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function toBigInt(val: unknown): bigint {
  if (typeof val === "bigint") return val;
  if (typeof val === "number") return BigInt(val);
  if (typeof val === "string") return num.toBigInt(val);
  if (val && typeof val === "object" && "low" in val && "high" in val) {
    const obj = val as { low: bigint | string; high: bigint | string };
    const low = typeof obj.low === "bigint" ? obj.low : BigInt(obj.low);
    const high = typeof obj.high === "bigint" ? obj.high : BigInt(obj.high);
    return low + (high << 128n);
  }
  return BigInt(String(val));
}

export function u256Calldata(value: bigint): string[] {
  const low = value & ((1n << 128n) - 1n);
  const high = value >> 128n;
  return ["0x" + low.toString(16), "0x" + high.toString(16)];
}

export function btcToWad(btcAmount: bigint): bigint {
  return btcAmount * 10n ** 10n;
}

/**
 * Helper to build a Starknet call object for multicalls
 */
export function buildCall(address: string, entrypoint: string, calldata: (string | number | bigint)[]): StarknetCall {
  return {
    contractAddress: address,
    entrypoint,
    calldata: calldata.map(c => String(c))
  };
}

/**
 * Helper for ERC20 Approve call
 */
export function erc20ApproveCall(token: string, spender: string, amount: bigint): StarknetCall {
  return buildCall(token, "approve", [spender, ...u256Calldata(amount)]);
}

/**
 * Helper for ERC20 Transfer call
 */
export function erc20TransferCall(token: string, recipient: string, amount: bigint): StarknetCall {
  return buildCall(token, "transfer", [recipient, ...u256Calldata(amount)]);
}

export { config };
