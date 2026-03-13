import React, { useState, useRef, useEffect } from 'react';
import { Wallet, LogOut, ChevronDown, MousePointerClick, Bitcoin } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { useTranslation } from 'react-i18next';


interface WalletConnectProps {
    variant?: 'nav' | 'flow';
    className?: string;
}

export default function WalletConnect({ variant = 'nav', className = '' }: WalletConnectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isManualConnecting, setIsManualConnecting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { address, isConnected, status: accountStatus } = useAccount();
    const { connect, connectors, isPending: isConnectPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { t } = useTranslation();

    // Consolidated pending state
    const isPending = accountStatus === 'connecting' || isConnectPending || isManualConnecting;

    // Reset manual connecting state when account becomes connected or status settles
    useEffect(() => {
        if (isConnected && address) {
            setIsManualConnecting(false);
            setIsOpen(false);
        }
        if (accountStatus === 'disconnected' && !isConnectPending) {
            // Give it a tiny bit of time to settle if we just clicked
            const timer = setTimeout(() => {
                if (!isConnectPending) setIsManualConnecting(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isConnected, address, accountStatus, isConnectPending]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    if (variant === 'flow') {
        return (
            <div className="space-y-4">
                {connectors.map((connector) => (
                    <button
                        key={connector.id}
                        onClick={async () => {
                            setIsManualConnecting(true);

                            try {
                                await connect({ connector });
                            } catch (e) {

                                console.error("[WalletConnect] manual connection failed:", e);
                                setIsManualConnecting(false);
                            }
                        }}
                        disabled={isPending}
                        className="w-full h-16 bg-[#0A0A0A] border border-white/5 rounded-2xl flex items-center justify-between px-6 hover:border-grinta-accent/30 hover:bg-grinta-accent/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-grinta-accent/20 group-hover:text-grinta-accent transition-colors">
                                <MousePointerClick size={20} />
                            </div>
                            <span className="text-white font-bold">{connector.id}</span>
                        </div>
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-grinta-accent border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-grinta-accent animate-pulse"></div>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending && !isConnected}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all border ${className} ${isConnected
                    ? 'bg-grinta-accent/10 border-grinta-accent/30 text-grinta-accent hover:bg-grinta-accent/20'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                    } ${isPending && !isConnected ? 'opacity-50 cursor-wait' : ''}`}
            >
                {isConnected ? (
                    <>
                        <div className="w-2 h-2 rounded-full bg-grinta-accent animate-pulse"></div>
                        <span className="font-mono text-sm font-bold tracking-tight">{truncatedAddress}</span>
                    </>
                ) : isPending ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('wallet.connecting', 'Connecting...')}</span>
                    </>
                ) : (
                    <>
                        <Wallet size={18} />
                        <span className="text-sm font-black uppercase tracking-tighter">{t('wallet.connect')}</span>
                    </>
                )}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-3 right-0 w-64 bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {!isConnected ? (
                        <div className="px-3 space-y-2">
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-3">{t('wallet.choose')}</div>
                            {connectors.map((connector) => (
                                <button
                                    key={connector.id}
                                    onClick={async () => {
                                        setIsManualConnecting(true);

                                        try {
                                            await connect({ connector });
                                        } catch (e) {

                                            console.error("[WalletConnect] dropdown manual connection failed:", e);
                                            setIsManualConnecting(false);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/10"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-grinta-accent/20 group-hover:text-grinta-accent transition-colors">
                                        <MousePointerClick size={16} />
                                    </div>
                                    <span className="text-white font-bold text-xs uppercase tracking-widest">{connector.id}</span>
                                </button>
                            ))}

                            <div className="h-px bg-white/5 my-3 mx-2"></div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-3">{t('wallet.xverse_desc')}</div>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F7931A]/5 rounded-2xl transition-all group border border-transparent hover:border-[#F7931A]/20"
                            >
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#F7931A]/20 group-hover:text-[#F7931A] transition-colors">
                                    <Bitcoin size={16} />
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-white font-bold text-xs">XVerse</span>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pt-0.5">{t('wallet.sats_connect')}</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="px-3">
                            <button
                                onClick={() => {
                                    disconnect();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-2xl transition-all group border border-transparent hover:border-red-500/20 text-red-500"
                            >
                                <LogOut size={16} />
                                <span className="font-bold text-xs uppercase tracking-widest">{t('wallet.disconnect')}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
