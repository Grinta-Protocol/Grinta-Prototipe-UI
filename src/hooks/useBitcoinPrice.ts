import { useState, useEffect, useCallback } from "react";

export interface BitcoinPrice {
  usd: number;
  usd_24h_change: number;
}

export function useBitcoinPrice() {
  const [price, setPrice] = useState<BitcoinPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrice(data.bitcoin);
    } catch (e) {
      console.error("[useBitcoinPrice] error:", e);
      setError(e instanceof Error ? e.message : "Failed to fetch BTC price");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return {
    price,
    loading,
    error,
    refetch: fetchPrice,
  };
}
