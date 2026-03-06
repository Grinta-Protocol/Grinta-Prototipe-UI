import { RpcProvider, Contract, num } from "starknet";
import { config } from "../config/contracts";
import { SAFE_MANAGER_ABI } from "./abi/safe-manager";
import { SAFE_ENGINE_ABI } from "./abi/safe-engine";

const WAD = 10n ** 18n;
const RAY = 10n ** 27n;
const WAD_DECIMALS = 18;
const RAY_DECIMALS = 27;
const WBTC_DECIMALS = 8;

let _provider: RpcProvider | undefined;
let _safeManager: Contract | undefined;
let _safeEngine: Contract | undefined;

export function getProvider(): RpcProvider {
  if (!_provider) {
    _provider = new RpcProvider({ nodeUrl: config.rpcUrl });
  }
  return _provider;
}

export function getSafeManager(): Contract {
  if (!_safeManager) {
    _safeManager = new Contract({
      abi: SAFE_MANAGER_ABI as any,
      address: config.safeManagerAddress,
      provider: getProvider(),
    });
  }
  return _safeManager;
}

export function getSafeEngine(): Contract {
  if (!_safeEngine) {
    _safeEngine = new Contract({
      abi: SAFE_ENGINE_ABI as any,
      address: config.safeEngineAddress,
      provider: getProvider(),
    });
  }
  return _safeEngine;
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
  const diff = rayRate - RAY;
  const annualBps = (diff * 31536000n * 10000n) / RAY;
  const whole = annualBps / 100n;
  const frac = annualBps < 0n ? -annualBps : annualBps;
  const fracAbs = frac % 100n;
  const sign = annualBps < 0n ? "-" : "+";
  return `${sign}${whole}.${fracAbs.toString().padStart(2, "0")}%`;
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

export { config };
