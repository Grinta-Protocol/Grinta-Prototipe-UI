import React, { useState } from 'react';
import { Wallet, LogOut, ChevronDown, MousePointerClick, Bitcoin, Mail, Globe } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { useTranslation } from 'react-i18next';
import StarkZapOnboardingModal from './StarkZapOnboardingModal';
import { useVaults } from '../context/VaultContext';

interface WalletConnectProps {
    variant?: 'nav' | 'flow';
    className?: string;
}

export default function WalletConnect({ variant = 'nav', className = '' }: WalletConnectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isZapModalOpen, setIsZapModalOpen] = useState(false);
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { t } = useTranslation();
    const { starkzapWallet, setStarkzapWallet } = useVaults();

    const displayAddress = address || (starkzapWallet ? (starkzapWallet.address || starkzapWallet.account?.address) : undefined);
    const shortAddress = displayAddress ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}` : (starkzapWallet ? 'StarkZap' : '');
    const isWalletConnected = (isConnected && address) || starkzapWallet;

    if (isWalletConnected) {
        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={variant === 'nav'
                        ? "h-8 px-4 rounded-full bg-white/5 border border-white/5 text-white font-bold text-[10px] flex items-center gap-1.5 hover:bg-white/10 transition-all"
                        : "w-full py-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-lg flex items-center justify-center gap-3"
                    }
                >
                    <Wallet size={variant === 'nav' ? 12 : 20} className="text-grinta-accent" />
                    <span>{shortAddress}</span>
                    <ChevronDown size={variant === 'nav' ? 10 : 18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#0D0F10] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50">
                        <button
                            onClick={() => {
                                disconnect();
                                setStarkzapWallet(null);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-500 font-bold text-xs"
                        >
                            <span>{t('wallet.disconnect')}</span>
                            <LogOut size={14} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={variant === 'nav'
                    ? "h-8 px-4 rounded-full bg-grinta-accent text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg shadow-grinta-accent/20"
                    : "w-full py-6 rounded-3xl bg-grinta-accent text-black font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                }
            >
                {variant === 'nav' ? <Wallet size={12} /> : <MousePointerClick size={20} />}
                <span>{t('wallet.connect')}</span>
                <ChevronDown size={variant === 'nav' ? 10 : 18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-64 bg-[#0D0F10] border border-white/10 rounded-3xl p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in duration-200`}>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-3">Create Wallet (Web2)</div>
                    <div className="space-y-1 mb-4">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsZapModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white text-black hover:bg-white/90 rounded-2xl transition-all group font-bold text-xs"
                        >
                            <span className="flex items-center gap-2">
                                <Globe size={16} /> Email / Social
                            </span>
                            <span className="text-[9px] font-black bg-black/10 px-2 py-0.5 rounded-full uppercase">StarkZap</span>
                        </button>
                    </div>

                    <div className="h-px bg-white/5 my-3 mx-2"></div>

                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-3">{t('wallet.choose')}</div>
                    <div className="space-y-1">
                        {connectors.map((connector) => (
                            <button
                                key={connector.id}
                                onClick={() => {
                                    connect({ connector });
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/5"
                            >
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-grinta-accent/20 group-hover:text-grinta-accent transition-colors">
                                    {connector.id.toLowerCase().includes('argent') ? (
                                        <img src="https://argent.xyz/favicon.ico" className="w-4 h-4" alt="A" />
                                    ) : connector.id.toLowerCase().includes('braavos') ? (
                                        <img src="https://braavos.app/favicon.ico" className="w-4 h-4" alt="B" />
                                    ) : (
                                        <Wallet size={16} />
                                    )}
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-white font-bold text-xs">
                                        {connector.id.toLowerCase().includes('argent') ? 'Argent' : connector.id.toLowerCase().includes('braavos') ? 'Braavos' : connector.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pt-0.5">Starknet L2</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="h-px bg-white/5 my-3 mx-2"></div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 px-3">{t('wallet.xverse_desc')}</div>

                    <button
                        onClick={() => {
                            // Phase 2, Sprint 1: Sats Connect Integration placeholder
                            alert(t('wallet.sats_connect') + " logic coming soon!");
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F7931A]/5 rounded-2xl transition-all group border border-transparent hover:border-[#F7931A]/20"
                    >
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#F7931A]/20 group-hover:text-[#F7931A] transition-colors">
                            <Bitcoin size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-white font-bold text-xs">XVerse</span>
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pt-0.5">{t('wallet.sats_connect')}</span>
                        </div>
                    </button>
                </div>
            )}
            <StarkZapOnboardingModal isOpen={isZapModalOpen} onClose={() => setIsZapModalOpen(false)} />
        </div>
    );
}
