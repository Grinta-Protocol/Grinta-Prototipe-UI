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
    const [balanceL1, setBalanceL1] = useState(10.5);
    const [balanceL2, setBalanceL2] = useState(0);
    const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

    const [market, setMarket] = useState<MarketState>({
        btcPrice: 70266.00,
        redemptionRate: 0.00,
        redemptionPrice: 1.000,
        liquidationRatio: 150.00,
        tvl: 2150.45,
        flashMints24h: 1245,
        arbitrageVol: 0.85
    });

    const marketRef = useRef(market);
    marketRef.current = market;

    useEffect(() => {
        const interval = setInterval(() => {
            const btcChange = (Math.random() - 0.5) * 50;
            const newBtcPrice = marketRef.current.btcPrice + btcChange;
            const rateChange = (Math.random() - 0.5) * 0.02;
            const newRedemptionRate = Math.max(-0.5, Math.min(0.5, marketRef.current.redemptionRate + rateChange));
            const newRedemptionPrice = marketRef.current.redemptionPrice * (1 + (newRedemptionRate / 10000));
            const newTvl = marketRef.current.tvl + (Math.random() * 0.1);
            const newFlashMints24h = marketRef.current.flashMints24h + (Math.random() > 0.7 ? 1 : 0);
            const newArbitrageVol = marketRef.current.arbitrageVol + (Math.random() * 0.001);

            setMarket({
                btcPrice: newBtcPrice,
                redemptionRate: newRedemptionRate,
                redemptionPrice: newRedemptionPrice,
                liquidationRatio: 150.00,
                tvl: newTvl,
                flashMints24h: newFlashMints24h,
                arbitrageVol: newArbitrageVol
            });

            setVaults(prevVaults => prevVaults.map(vault => {
                if (vault.type === 'manual') return vault;

                const yieldIncrement = (vault.amount * (vault.apy / 100)) / (365 * 24 * 60 * 20);
                const newYield = vault.yieldEarned + yieldIncrement;
                let newAgentActions = vault.agentActions;
                let newFlashMints = vault.flashMints;
                let newLogs = [...vault.logs];

                if (Math.random() < 0.4) {
                    newAgentActions += 1;
                    newLogs.push({ id: Math.random().toString(36).substr(2, 9), message: `Arbitraje Exitoso: +0.00005 BTC`, timestamp: new Date(), type: 'agent' });
                }
                if (Math.random() < 0.2) {
                    newFlashMints += 1;
                    newLogs.push({ id: Math.random().toString(36).substr(2, 9), message: "Flash-Mint Ejecutado", timestamp: new Date(), type: 'success' });
                }
                if (newLogs.length > 20) newLogs = newLogs.slice(-20);

                return { ...vault, yieldEarned: newYield, agentActions: newAgentActions, flashMints: newFlashMints, logs: newLogs };
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const addVault = (vault: Vault) => { setVaults(prev => [...prev, vault]); };
    const updateVault = (id: string, updates: Partial<Vault>) => { setVaults(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v)); };

    const depositToVault = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, { id: Math.random().toString(36).substr(2, 9), message: `Depósito Manual: ${amount} WBTC a colateral`, timestamp: new Date(), type: 'info' } as LogEntry];
                return { ...v, amount: v.amount + amount, logs: newLogs.slice(-20) };
            }
            return v;
        }));
    };

    const withdrawFromVault = (id: string, amount: number) => {
        setVaults(prev => prev.map(v => {
            if (v.id === id) {
                const newLogs = [...v.logs, { id: Math.random().toString(36).substr(2, 9), message: `Retiro Manual: ${amount} WBTC de colateral`, timestamp: new Date(), type: 'info' } as LogEntry];
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

    const startNewFlow = () => { setStep('deposit'); };

    return (
        <VaultContext.Provider value={{
            step, setStep, vaults, balanceL1, setBalanceL1, balanceL2, setBalanceL2, activeVaultId, setActiveVaultId, addVault, updateVault, depositToVault, withdrawFromVault, borrowGrit, repayGrit, startNewFlow, market
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
