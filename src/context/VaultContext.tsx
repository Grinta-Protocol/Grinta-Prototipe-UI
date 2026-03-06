import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Step = 'connect' | 'deposit' | 'create_vault' | 'vault_view' | 'main_dashboard';

interface LogEntry {
    id: string;
    message: string;
    timestamp: Date;
    type: 'info' | 'success' | 'agent';
}

interface Vault {
    id: string;
    amount: number;
    strategy: string;
    type: 'agentic' | 'manual';
    apy: number;
    yieldEarned: number;
    debt: number; // Added debt field
    flashMints: number;
    agentActions: number;
    logs: LogEntry[];
    createdAt: Date;
}

interface MarketState {
    btcPrice: number;
    redemptionRate: number;
    redemptionPrice: number;
    redemptionPriceHistory: number[];
    liquidationRatio: number;
    tvl: number;
    flashMints24h: number;
    arbitrageVol: number;
}

interface VaultContextType {
    step: Step;
    setStep: (step: Step) => void;
    vaults: Vault[];
    balanceL1: number;
    setBalanceL1: (balance: number) => void;
    balanceL2: number;
    setBalanceL2: (balance: number) => void;
    activeVaultId: string | null;
    setActiveVaultId: (id: string | null) => void;
    addVault: (vault: Vault) => void;
    updateVault: (id: string, updates: Partial<Vault>) => void;
    depositToVault: (id: string, amount: number) => void;
    withdrawFromVault: (id: string, amount: number) => void;
    borrowGrit: (id: string, amount: number) => void;
    repayGrit: (id: string, amount: number) => void;
    startNewFlow: () => void;
    market: MarketState;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState<Step>('main_dashboard');
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [balanceL1, setBalanceL1] = useState(5.0); // Initial L1 balance to allow bridging
    const [balanceL2, setBalanceL2] = useState(0);
    const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

    // Global Market State
    const [market, setMarket] = useState<MarketState>({
        btcPrice: 70266.00,
        redemptionRate: 0.00,
        redemptionPrice: 1.000,
        redemptionPriceHistory: Array(20).fill(1.000),
        liquidationRatio: 150.00,
        tvl: 0.00,
        flashMints24h: 0,
        arbitrageVol: 0.00
    });

    const marketRef = useRef(market);
    marketRef.current = market;

    const vaultsRef = useRef(vaults);
    vaultsRef.current = vaults;

    useEffect(() => {
        const interval = setInterval(() => {
            const activeVaults = vaultsRef.current;
            const totalCollateral = activeVaults.reduce((sum, v) => sum + v.amount, 0);

            // Only update market/pid if there is actual collateral in the system
            if (totalCollateral === 0) {
                setMarket(prev => ({
                    ...prev,
                    btcPrice: prev.btcPrice + (Math.random() - 0.5) * 50,
                    tvl: 0,
                    redemptionPriceHistory: [...prev.redemptionPriceHistory.slice(1), prev.redemptionPrice]
                }));
                return;
            }

            // 1. Update BTC Price (Random Walk)
            const btcChange = (Math.random() - 0.5) * 50;
            const newBtcPrice = marketRef.current.btcPrice + btcChange;

            // 2. Update Redemption Rate (PID Simulation)
            // Error = (Market Price - Redemption Price) / Redemption Price
            // Simulating market price drift for PID logic
            const marketPriceDrift = 1.000 + (Math.sin(Date.now() / 10000) * 0.01);
            const error = marketPriceDrift - marketRef.current.redemptionPrice;
            const rateChange = error * 0.05 + (Math.random() - 0.5) * 0.005;
            const newRedemptionRate = Math.max(-0.5, Math.min(0.5, marketRef.current.redemptionRate + rateChange));

            // 3. Update Redemption Price (Compound Growth)
            const newRedemptionPrice = marketRef.current.redemptionPrice * (1 + (newRedemptionRate / 10000));

            // 4. Update TVL (Incremental Growth based on current vaults)
            const totalVaultBalance = activeVaults.reduce((sum, v) => sum + v.amount + v.yieldEarned, 0);
            const newTvl = totalVaultBalance + (Math.random() * 0.1);

            // 5. Update Daily Metrics
            const newFlashMints24h = marketRef.current.flashMints24h + (Math.random() > 0.7 ? 1 : 0);
            const newArbitrageVol = marketRef.current.arbitrageVol + (Math.random() * 0.001);

            setMarket({
                btcPrice: newBtcPrice,
                redemptionRate: newRedemptionRate,
                redemptionPrice: newRedemptionPrice,
                redemptionPriceHistory: [...marketRef.current.redemptionPriceHistory.slice(1), newRedemptionPrice],
                liquidationRatio: 150.00,
                tvl: newTvl,
                flashMints24h: newFlashMints24h,
                arbitrageVol: newArbitrageVol
            });

            // 6. Update Vaults Yield and Activity (ONLY for Agentic)
            setVaults(prevVaults => prevVaults.map(vault => {
                // If vault is manual (Staking Pasivo), we don't add yield or logs automatically
                if (vault.type === 'manual') return vault;

                const yieldIncrement = (vault.amount * (vault.apy / 100)) / (365 * 24 * 60 * 20); // Accurate yield per 3s
                const newYield = vault.yieldEarned + yieldIncrement;

                let newAgentActions = vault.agentActions;
                let newFlashMints = vault.flashMints;
                let newLogs = [...vault.logs];

                // Arbitraje (40% probability)
                if (Math.random() < 0.4) {
                    newAgentActions += 1;
                    newLogs.push({
                        id: Math.random().toString(36).substr(2, 9),
                        message: `Arbitraje Exitoso: +0.00005 BTC`,
                        timestamp: new Date(),
                        type: 'agent'
                    });
                }

                // Flash Mints (20% probability)
                if (Math.random() < 0.2) {
                    newFlashMints += 1;
                    newLogs.push({
                        id: Math.random().toString(36).substr(2, 9),
                        message: "Flash-Mint Ejecutado",
                        timestamp: new Date(),
                        type: 'success'
                    });
                }

                // Keep only last 20 logs
                if (newLogs.length > 20) newLogs = newLogs.slice(-20);

                return {
                    ...vault,
                    yieldEarned: newYield,
                    agentActions: newAgentActions,
                    flashMints: newFlashMints,
                    logs: newLogs
                };
            }));

        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const addVault = (vault: Vault) => {
        setVaults(prev => [...prev, vault]);
        // When creating a vault, it already subtracted from balanceL2 in the flow,
        // but let's double check if we need to do it here. 
        // In NewVaultFlow, addVault is called with the total L2 balance usually.
    };

    const updateVault = (id: string, updates: Partial<Vault>) => {
        setVaults(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    };

    const depositToVault = (id: string, amount: number) => {
        if (balanceL2 < amount) {
            alert("No tienes suficiente BTC disponible en L2.");
            return;
        }

        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Depósito Manual: ${amount} WBTC a colateral`,
                    timestamp: new Date(),
                    type: 'info'
                } as LogEntry];
                return { ...v, amount: v.amount + amount, logs: newLogs.slice(-20) };
            }
            return v;
        }));
        setBalanceL2(prev => prev - amount);
    };

    const withdrawFromVault = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const withdrawable = Math.min(v.amount, amount);
                const newLogs = [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Retiro Manual: ${withdrawable} WBTC de colateral`,
                    timestamp: new Date(),
                    type: 'info'
                } as LogEntry];

                // Add withdrawn amount back to L2 balance
                setBalanceL2(curr => curr + withdrawable);

                return { ...v, amount: Math.max(0, v.amount - withdrawable), logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const borrowGrit = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Generación de Deuda: +${amount} GRIT`,
                    timestamp: new Date(),
                    type: 'info'
                } as LogEntry];
                return { ...v, debt: (v.debt || 0) + amount, logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const repayGrit = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Pago de Deuda: -${amount} GRIT`,
                    timestamp: new Date(),
                    type: 'info'
                } as LogEntry];
                return { ...v, debt: Math.max(0, (v.debt || 0) - amount), logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const claimAllYield = () => {
        let totalYield = 0;
        setVaults(prev => prev.map(v => {
            totalYield += v.yieldEarned;
            return {
                ...v,
                yieldEarned: 0,
                logs: [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Yield Reclamado: ${v.yieldEarned.toFixed(6)} BTC`,
                    timestamp: new Date(),
                    type: 'success'
                }].slice(-20)
            };
        }));
        setBalanceL2(prev => prev + totalYield);
    };

    const startNewFlow = () => {
        setStep('deposit');
    };

    return (
        <VaultContext.Provider value={{
            step, setStep, vaults, balanceL1, setBalanceL1, balanceL2, setBalanceL2, activeVaultId, setActiveVaultId, addVault, updateVault, depositToVault, withdrawFromVault, borrowGrit, repayGrit, startNewFlow, market, claimAllYield
        }}>
            {children}
        </VaultContext.Provider>
    );
}

export const useVaults = () => {
    const context = useContext(VaultContext);
    if (!context) throw new Error('useVaults must be used within a VaultProvider');
    return context;
}

