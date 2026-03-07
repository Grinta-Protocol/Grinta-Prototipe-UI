import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Step = 'connect' | 'fund' | 'deposit' | 'create_vault' | 'vault_view' | 'main_dashboard';

interface LogEntry {
    id: string;
    message: string;
    timestamp: Date;
    type: 'info' | 'success' | 'agent';
}

interface Vault {
    id: string;
    safeId?: number;
    amount: number;
    strategy: string;
    type: 'agentic' | 'manual';
    apy: number;
    yieldEarned: number;
    debt: number;
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
    const [balanceL1, setBalanceL1] = useState(10.5); // Initial simulated L1 balance
    const [balanceL2, setBalanceL2] = useState(0);
    const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

    const [market, setMarket] = useState<MarketState>({
        btcPrice: 0,
        redemptionRate: 0,
        redemptionPrice: 1.0,
        redemptionPriceHistory: Array(20).fill(1.0),
        liquidationRatio: 150.00,
        tvl: 0.00,
        flashMints24h: 0,
        arbitrageVol: 0.00
    });

    const marketRef = useRef(market);
    marketRef.current = market;

    const vaultsRef = useRef(vaults);
    vaultsRef.current = vaults;

    // Simulation interval removed to migrate to real on-chain data.
    // Infrastructure ready to receive real-time updates from Starknet hooks.
    useEffect(() => {
        // Initial protocol data fetching will be implemented here
    }, []);

    const addVault = (vault: Vault) => {
        setVaults(prev => [...prev, vault]);
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
                const newLogs = [...v.logs, { id: Math.random().toString(36).substr(2, 9), message: `Depósito Manual: ${amount} WBTC a colateral`, timestamp: new Date(), type: 'info' } as LogEntry];
                return { ...v, amount: v.amount + amount, logs: newLogs.slice(-20) };
            }
            return v;
        }));
        setBalanceL2(prev => prev - amount);
    };

    const withdrawFromVault = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, {
                    id: Math.random().toString(36).substr(2, 9),
                    message: `Retiro Manual: ${amount} WBTC de colateral`,
                    timestamp: new Date(),
                    type: 'info'
                } as LogEntry];
                return { ...v, amount: Math.max(0, v.amount - amount), logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const borrowGrit = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, { id: Math.random().toString(36).substr(2, 9), message: `Generación de Deuda: +${amount} GRIT`, timestamp: new Date(), type: 'info' } as LogEntry];
                return { ...v, debt: (v.debt || 0) + amount, logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const repayGrit = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, { id: Math.random().toString(36).substr(2, 9), message: `Pago de Deuda: -${amount} GRIT`, timestamp: new Date(), type: 'info' } as LogEntry];
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

    const startNewFlow = () => { setStep('deposit'); };

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
