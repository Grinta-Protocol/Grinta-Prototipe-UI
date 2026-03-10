import React, { useState, useEffect, useRef } from 'react';
import { Mail, Globe, X, Zap, Loader2 } from 'lucide-react';
import Controller from '@cartridge/controller';
import { useVaults } from '../context/VaultContext';

const ALCHEMY_RPC = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/_zuaFihvvIkJ2dwMdRZ0_';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function StarkZapOnboardingModal({ isOpen, onClose }: Props) {
    const { setStarkzapWallet } = useVaults();
    const [isLoading, setIsLoading] = useState(false);
    const controllerRef = useRef<Controller | null>(null);

    // Pre-initialize the Controller so the keychain iframe loads in the background
    useEffect(() => {
        if (!controllerRef.current) {
            try {
                controllerRef.current = new Controller({
                    chains: [{ rpcUrl: ALCHEMY_RPC }],
                    defaultChainId: "0x534e5f5345504f4c4941", // SN_SEPOLIA
                    // TEMP: policies removed to test if they're causing initialization issues
                    // policies: toSessionPolicies([...]),
                });
                console.log("Controller initialized successfully");
            } catch (err) {
                console.error("Controller init failed:", err);
            }
        }
    }, []);

    if (!isOpen) return null;

    const handleConnect = async () => {
        setIsLoading(true);
        try {
            const controller = controllerRef.current;
            if (!controller) throw new Error("Controller not initialized");

            console.log("Calling controller.connect()...");
            
            // controller.connect() internally waits up to 50s for the keychain iframe
            const account = await controller.connect();
            console.log("controller.connect() returned:", account);
            
            if (!account) {
                throw new Error("Connection cancelled or failed. Make sure popups are allowed.");
            }

            // Wrap as a minimal wallet-like object for the rest of the app
            setStarkzapWallet({
                address: account.address,
                account,
                controller,
                execute: async (calls: any[]) => {
                    const result = await account.execute(calls);
                    return result;
                },
                disconnect: async () => {
                    await controller.disconnect();
                },
            });
            onClose();
        } catch (error) {
            console.error("StarkZap connection failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#0D0F10] border border-orange-500/20 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="text-center mb-8 mt-2">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                        <Zap size={32} className="text-orange-500 fill-orange-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Create Wallet</h2>
                    <p className="text-sm text-grinta-text-secondary">Powered by StarkZap. No seed phrase required.</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />}
                        <span>Continue with Google / Social</span>
                    </button>

                    <button
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/5 hover:border-white/10 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                        <span>Continue with Email</span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-[10px] text-grinta-text-secondary uppercase tracking-widest font-bold">
                        Secured by Passkeys & Starknet
                    </p>
                </div>
            </div>
        </div>
    );
}
