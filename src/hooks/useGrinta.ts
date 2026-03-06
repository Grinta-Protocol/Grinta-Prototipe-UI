import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { config } from "../config/contracts";
import {
  getSafeEngine,
  getSafeManager,
  getWbtcContract,
  toBigInt,
  formatRay,
  formatUsd,
  formatAnnualRate,
  formatWadPercent,
  formatWad,
} from "../lib/starknet";

// ─── System Rates (read from SafeEngine via direct RPC) ───

export interface RatesData {
  redemptionPrice: string;
  redemptionPriceRaw: bigint;
  redemptionRate: string;
  redemptionRateRaw: bigint;
  collateralPrice: string;
  collateralPriceRaw: bigint;
  liquidationRatio: string;
  liquidationRatioRaw: bigint;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRates(): RatesData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    redemptionPriceRaw: bigint;
    redemptionRateRaw: bigint;
    collateralPriceRaw: bigint;
    liquidationRatioRaw: bigint;
  } | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const engine = getSafeEngine();
      const [rPrice, rRate, cPrice, liqRatio] = await Promise.all([
        engine.get_redemption_price(),
        engine.get_redemption_rate(),
        engine.get_collateral_price(),
        engine.get_liquidation_ratio(),
      ]);

      setData({
        redemptionPriceRaw: toBigInt(rPrice),
        redemptionRateRaw: toBigInt(rRate),
        collateralPriceRaw: toBigInt(cPrice),
        liquidationRatioRaw: toBigInt(liqRatio),
      });
    } catch (e) {
      console.error("[useRates] error:", e);
      setError(e instanceof Error ? e.message : "Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  if (loading || !data) {
    return {
      redemptionPrice: "Loading...",
      redemptionPriceRaw: 0n,
      redemptionRate: "Loading...",
      redemptionRateRaw: 0n,
      collateralPrice: "Loading...",
      collateralPriceRaw: 0n,
      liquidationRatio: "Loading...",
      liquidationRatioRaw: 0n,
      loading: true,
      error,
      refetch: fetchRates,
    };
  }

  return {
    redemptionPrice: formatRay(data.redemptionPriceRaw, "USD"),
    redemptionPriceRaw: data.redemptionPriceRaw,
    redemptionRate: formatAnnualRate(data.redemptionRateRaw),
    redemptionRateRaw: data.redemptionRateRaw,
    collateralPrice: formatUsd(data.collateralPriceRaw),
    collateralPriceRaw: data.collateralPriceRaw,
    liquidationRatio: formatWadPercent(data.liquidationRatioRaw),
    liquidationRatioRaw: data.liquidationRatioRaw,
    loading: false,
    error,
    refetch: fetchRates,
  };
}

// ─── User SAFEs (scan safe_count and filter by owner) ───

export interface UserSafe {
  id: number;
  collateral: bigint;
  debt: bigint;
  collateralValue: bigint;
  ltv: bigint;
  liquidationPrice: bigint;
}

export function useUserSafes() {
  const { address } = useAccount();
  const [safes, setSafes] = useState<UserSafe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debug, setDebug] = useState("waiting...");

  const fetchSafes = useCallback(async () => {
    if (!address) {
      setDebug("no wallet address");
      setSafes([]);
      return;
    }

    setDebug("fetching...");
    setIsLoading(true);
    try {
      const engine = getSafeEngine();
      const count = await engine.get_safe_count();
      const total = Number(count);
      setDebug(`safe_count=${total}, scanning...`);
      const userSafes: UserSafe[] = [];

      for (let id = 1; id <= total; id++) {
        try {
          const owner = await engine.get_safe_owner(id);
          const ownerHex = "0x" + BigInt(owner).toString(16);
          const userHex = "0x" + BigInt(address).toString(16);
          if (ownerHex === userHex) {
            const safe = await engine.get_safe(id);
            const health = await engine.get_safe_health(id);
            userSafes.push({
              id,
              collateral: toBigInt(safe.collateral),
              debt: toBigInt(safe.debt),
              collateralValue: toBigInt(health.collateral_value),
              ltv: toBigInt(health.ltv),
              liquidationPrice: toBigInt(health.liquidation_price),
            });
          }
        } catch (err) {
          setDebug(`safe ${id} error: ${(err as Error).message}`);
        }
      }

      setDebug(`found ${userSafes.length} safes`);
      setSafes(userSafes);
    } catch (err) {
      setDebug(`fetchSafes error: ${(err as Error).message}`);
      setSafes([]);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchSafes();
  }, [fetchSafes]);

  return { safes, isLoading, refetch: fetchSafes, debug };
}

// ─── WBTC Balance ───

export function useWbtcBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address) { setBalance(0n); return; }
    setIsLoading(true);
    try {
      const wbtc = getWbtcContract();
      const result = await wbtc.balance_of(address);
      setBalance(toBigInt(result));
    } catch (e) {
      console.error("[useWbtcBalance] error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  return { balance, isLoading, refetch: fetchBalance };
}

// ─── Max Borrow for a SAFE ───

export function useMaxBorrow(safeId: number | null) {
  const [maxBorrow, setMaxBorrow] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (safeId == null) return;
    setIsLoading(true);
    const mgr = getSafeManager();
    mgr.get_max_borrow(safeId)
      .then((r: unknown) => setMaxBorrow(toBigInt(r)))
      .catch((e: Error) => console.error("get_max_borrow error:", e))
      .finally(() => setIsLoading(false));
  }, [safeId]);

  return { maxBorrow, isLoading };
}

// ─── Position Health for a SAFE ───

export function usePositionHealth(safeId: number | null) {
  const [health, setHealth] = useState<{
    collateralValue: bigint;
    debt: bigint;
    ltv: bigint;
    liquidationPrice: bigint;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (safeId == null) return;
    setIsLoading(true);
    const mgr = getSafeManager();
    mgr.get_position_health(safeId)
      .then((r: any) => {
        setHealth({
          collateralValue: toBigInt(r.collateral_value),
          debt: toBigInt(r.debt),
          ltv: toBigInt(r.ltv),
          liquidationPrice: toBigInt(r.liquidation_price),
        });
      })
      .catch((e: Error) => console.error("get_position_health error:", e))
      .finally(() => setIsLoading(false));
  }, [safeId]);

  return { health, isLoading };
}
