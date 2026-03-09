import React from 'react';
import { useAccount } from '@starknet-react/core';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgentMarketing from './AgentMarketing';

const AUTHORIZED_WALLETS = [
    "0x028607Cc6A079F47b175A30cC4f58147d76F96A669937ef771CB5A7b001f06ef",
    "0x072F0D2391F7ce9103D31a64b6A36e0Fe8d32f908D2e183A02d9D46403b21ce2"
];

export default function AgentHubAdmin() {
    const { address } = useAccount();
    const navigate = useNavigate();

    const isAuthorized = React.useMemo(() => {
        if (!address) return false;
        // Normalize for comparison
        const userAddr = address.toLowerCase().replace(/^0x0+/, '0x');
        return AUTHORIZED_WALLETS.some(auth =>
            auth.toLowerCase().replace(/^0x0+/, '0x') === userAddr
        );
    }, [address]);

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <Lock size={40} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Access Denied</h2>
                <p className="text-grinta-text-secondary max-w-md mb-8 font-medium">
                    This orchestration layer is isolated. Only authorized Grinta Protocol operators can access the Agentic Hub Control.
                </p>
                <button
                    onClick={() => navigate('/app/')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Return to Dashboard
                </button>

                {address && (
                    <div className="mt-12 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[9px] text-white/20">
                        CONNECTED: {address}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Agentic Hub Control</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-grinta-accent"></div>
                        <span className="text-[10px] font-black text-grinta-accent uppercase tracking-widest leading-none">Restricted Manager Access</span>
                    </div>
                </div>
            </div>

            <AgentMarketing />

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <ShieldAlert size={18} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Operational Security</h4>
                    <p className="text-[11px] text-grinta-text-secondary font-medium">
                        All automated propagations from this hub are signed and tracked. Campaign execution logs are archived in `agents/campaign/execution_log.md`.
                    </p>
                </div>
            </div>
        </div>
    );
}
