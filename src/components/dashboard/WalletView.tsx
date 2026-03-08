import React, { useState } from 'react';
import { useVaults } from '../../context/VaultContext';
import { Wallet, ArrowDownRight, ArrowUpRight, Bitcoin, CreditCard, ChevronRight, Loader2, Coins, TrendingUp } from 'lucide-react';
import { useAccount, useSendTransaction } from '@starknet-react/core';
import { useWbtcBalance } from '../../hooks/useGrinta';
import { config } from '../../config/contracts';
import { formatBtcAmount } from '../../lib/starknet';

export default function WalletView() {
    const { vaults, claimAllYield } = useVaults();
    const { address, isConnected } = useAccount();
    const { sendAsync, isPending } = useSendTransaction({});
    const { balance: wbtcBalance, refetch: refetchBalance } = useWbtcBalance();

    const [isMinting, setIsMinting] = useState(false);

    const totalUserYield = vaults.reduce((acc, v) => acc + v.yieldEarned, 0);
    const totalVaultDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);

    const handleGetWbtc = async () => {
        if (!address || isPending) return;
        setIsMinting(true);
        try {
            await sendAsync([
                {
                    contractAddress: config.wbtcAddress,
                    entrypoint: 'mint',
                    calldata: [address, '0x5f5e100', '0x0'], // 1.0 WBTC (8 decimals)
                }
            ]);
            setTimeout(() => refetchBalance(), 3000);
        } catch (err) {
            console.error('Mint failed:', err);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Wallet Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* WBTC Faucet Card (L2) - Orange Bitcoin Style */}
                <div className={`bg-grinta-card border border-orange-500/20 rounded-[28px] p-6 shadow-xl relative overflow-hidden group`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                                <Bitcoin size={24} />
                            </div>
                            <span className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">WBTC (Faucet L2)</span>
                        </div>
                        {isConnected && wbtcBalance === 0n && (
                            <button
                                onClick={handleGetWbtc}
                                disabled={isMinting || isPending}
                                className="text-[10px] font-black bg-orange-500 text-black px-3 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] flex items-center gap-1.5"
                            >
                                {isMinting ? <Loader2 size={12} className="animate-spin" /> : <ArrowDownRight size={12} />}
                                SOLICITAR WBTC
                            </button>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">{formatBtcAmount(wbtcBalance)}</span>
                        <span className="text-sm font-bold text-grinta-text-secondary">WBTC</span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Bitcoin size={100} />
                    </div>
                </div>

                <BalanceCard
                    label="BTC en Vaults (L2)"
                    amount={totalVaultDeposits}
                    unit="BTC"
                    icon={<CreditCard size={24} className="text-grinta-accent" />}
                    color="border-grinta-accent/20"
                />
                <BalanceCard
                    label="Total Yield"
                    amount={totalUserYield}
                    unit="BTC"
                    icon={<TrendingUp size={24} className="text-purple-400" />}
                    color="border-purple-500/20"
                />
            </div>

            {/* Yield Claim Card */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-grinta-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-2">Accumulated Yield</h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-extrabold text-white">+{totalUserYield.toFixed(6)}</span>
                            <span className="text-2xl font-bold text-grinta-accent">BTC</span>
                        </div>
                        <p className="text-grinta-text-secondary text-sm mt-4">Disponible para reclamar instantáneamente a L2.</p>
                    </div>

                    <button
                        onClick={() => claimAllYield()}
                        disabled={totalUserYield <= 0}
                        className="px-8 py-5 bg-grinta-accent text-black font-bold text-lg rounded-[20px] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(74,222,128,0.3)] disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center gap-3"
                    >
                        RECLAMAR YIELD
                        <ArrowUpRight size={24} />
                    </button>
                </div>
            </div>

            {/* Recent History (Simulated) */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                <div className="space-y-4">
                    {vaults.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-grinta-text-secondary opacity-30 mb-4">
                                <Wallet size={32} />
                            </div>
                            <p className="text-sm text-grinta-text-secondary">No registered transactions.<br />Your deposits and Vault operations will appear here.</p>
                        </div>
                    ) : (
                        vaults.map((v, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-grinta-accent/10 flex items-center justify-center text-grinta-accent">
                                        <ArrowDownRight size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Deposit in Vault {v.id}</div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase tracking-wide">Exitoso • L2 Network</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">-{v.amount.toFixed(2)} WBTC</div>
                                    <div className="text-[10px] text-grinta-text-secondary">Justo ahora</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function BalanceCard({ label, amount, unit, icon, color }: { label: string, amount: number, unit: string, icon: React.ReactNode, color: string }) {
    return (
        <div className={`bg-grinta-card border ${color} rounded-[28px] p-6 shadow-xl relative group overflow-hidden`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{amount.toFixed(4)}</span>
                <span className="text-sm font-bold text-grinta-text-secondary">{unit}</span>
            </div>
        </div>
    );
}
