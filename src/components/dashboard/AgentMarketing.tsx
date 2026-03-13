import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Megaphone,
    MessageSquare,
    Activity,
    Clock,
    Zap,
    Cpu,
    ShieldCheck,
    TrendingUp,
    MousePointer,
    Globe
} from 'lucide-react';
import { useCampaign } from '../../hooks/useCampaign';
import { motion, AnimatePresence } from 'framer-motion';

interface PostLog {
    id: string;
    platform: string;
    time: string;
    content: string;
    isCorroborated?: boolean;
    sentiment?: string;
}

export default function AgentMarketing() {
    const { t } = useTranslation();
    const { state, logs, activateCampaign, deactivateCampaign, runAutomationStep, postToPlatform, runEngagementStep } = useCampaign();
    const [isExecuting, setIsExecuting] = useState(false);
    const [isMoltXing, setIsMoltXing] = useState(false);
    const [isMoltbooking, setIsMoltbooking] = useState(false);
    const [isClawing, setIsClawing] = useState(false);
    const [isEngaging, setIsEngaging] = useState(false);
    const [publishedPosts, setPublishedPosts] = useState<PostLog[]>([]);

    useEffect(() => {
        if (logs && Array.isArray(logs)) {
            const mappedLogs: PostLog[] = logs.map((log: any, i: number) => ({
                id: log.id || `log-${i}`,
                platform: log.platform,
                time: log.time,
                content: log.content,
                isCorroborated: log.status === 'SUCCESS',
                status: log.status
            }));
            setPublishedPosts(mappedLogs);
        }
    }, [logs]);

    const handleManualPulse = async () => {
        setIsExecuting(true);
        await runAutomationStep();
        setTimeout(() => setIsExecuting(false), 2000);
    };

    const handleEngagementBurst = async () => {
        setIsEngaging(true);
        try {
            await runEngagementStep();
        } catch (e) {
            console.error("Engagement Burst UI Error", e);
        }
        setTimeout(() => setIsEngaging(false), 3000);
    };

    const handlePlatformPulse = async (platform: "MoltX" | "Moltbook" | "4Claw") => {
        if (platform === "MoltX") setIsMoltXing(true);
        if (platform === "Moltbook") setIsMoltbooking(true);
        if (platform === "4Claw") setIsClawing(true);

        await postToPlatform(platform);

        setTimeout(() => {
            setIsMoltXing(false);
            setIsMoltbooking(false);
            setIsClawing(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Unified Mission Control */}
            <div className="bg-[#0A0A0A] border border-grinta-accent/20 rounded-[40px] p-8 md:p-12 overflow-hidden relative group shadow-[0_0_50px_rgba(0,255,65,0.05)]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-grinta-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-grinta-accent/10 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                            <span className="px-3 py-1 rounded-full bg-grinta-accent/10 border border-grinta-accent/20 text-[10px] font-black text-grinta-accent uppercase tracking-widest">
                                {t('agent.mission_control', 'Campaign Mission Control v3.5')}
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full ${state.isActive ? 'bg-grinta-accent animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                            Automated <span className="text-grinta-accent">Nexus</span> Propagation
                        </h2>
                        <p className="text-grinta-text-secondary text-lg font-medium leading-relaxed max-w-xl opacity-70 mb-8">
                            {t('agent.marketing_desc_new', 'Execute cross-platform propagation strategies and automated agent-to-agent interaction. Now with organic title shielding and engagement response engine.')}
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            {/* Cycle Button */}
                            <button
                                onClick={handleManualPulse}
                                disabled={isExecuting}
                                title="Next platform in rotation"
                                className="group/btn relative px-6 py-4 bg-grinta-accent text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,65,0.1)] disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isExecuting ? <Activity className="animate-spin" size={16} /> : <Zap size={16} fill="black" />}
                                    Cycle Next
                                </span>
                            </button>

                            {/* Specific Platform Buttons */}
                            <button
                                onClick={() => handlePlatformPulse("MoltX")}
                                disabled={isMoltXing}
                                className="px-5 py-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500/20 transition-all flex items-center gap-2"
                            >
                                {isMoltXing ? <Activity className="animate-spin" size={14} /> : <Globe size={14} />}
                                MoltX
                            </button>

                            <button
                                onClick={() => handlePlatformPulse("Moltbook")}
                                disabled={isMoltbooking}
                                className="px-5 py-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-orange-500/20 transition-all flex items-center gap-2"
                            >
                                {isMoltbooking ? <Activity className="animate-spin" size={14} /> : <MessageSquare size={14} />}
                                Moltbook
                            </button>

                            <button
                                onClick={() => handlePlatformPulse("4Claw")}
                                disabled={isClawing}
                                className="px-5 py-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-purple-500/20 transition-all flex items-center gap-2"
                            >
                                {isClawing ? <Activity className="animate-spin" size={14} /> : <Cpu size={14} />}
                                4Claw
                            </button>

                            <button
                                 onClick={() => state.isActive ? deactivateCampaign() : activateCampaign()}
                                 className={`px-6 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${state.isActive
                                     ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                                     : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                     }`}
                             >
                                 <Clock size={16} />
                                 {state.isActive ? 'Kill Engine' : 'Auto 15m'}
                             </button>
                             
                             <button
                                 onClick={handleEngagementBurst}
                                 disabled={isEngaging}
                                 className={`px-6 py-4 bg-grinta-accent/5 border border-grinta-accent/20 text-grinta-accent font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-grinta-accent/10 transition-all flex items-center gap-2 ${isEngaging ? 'opacity-50' : ''}`}
                             >
                                 {isEngaging ? <Activity className="animate-spin" size={16} /> : <TrendingUp size={16} />}
                                 {isEngaging ? 'Engaging...' : 'Engagement Burst'}
                             </button>
                         </div>
                     </div>
                     <div className="w-full lg:w-80">
                        <div className="bg-black/60 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
                            <h3 className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Cpu size={14} className="text-grinta-accent" /> Engine Status
                            </h3>
                            <div className="space-y-6">
                                <StatusIndicator label="Global Multi-Post" status={state.isActive ? "ACTIVE" : "STANDBY"} active={state.isActive} />
                                <StatusIndicator label="Engagement Guard" status={state.isActive ? "CONSENSUS-MODE" : "OFF-LINE"} active={state.isActive} />
                                <StatusIndicator label="Direct Reach" status="ENABLED" active />
                                <StatusIndicator label="Feedback Loop" status="ACTIVE" active />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Propagation History */}
                <div className="xl:col-span-3 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 md:p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Transmission Log</h3>
                            <p className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest">Real-time corroborated feed including AI-driven interactions</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <Activity size={14} className={`text-grinta-accent ${state.isActive ? 'animate-pulse' : 'opacity-50'}`} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                {state.isActive ? 'Nexus Active' : 'Engine Standby'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {publishedPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-6 p-5 border rounded-2xl transition-all group ${post.status === 'FAILED'
                                        ? 'bg-red-500/[0.03] border-red-500/10'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${post.platform === 'MoltX' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                        post.platform === 'Moltbook' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                            post.platform === '4Claw' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                'bg-grinta-accent/10 border-grinta-accent/20 text-grinta-accent'
                                        }`}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">{post.platform}</span>
                                            <span className="text-[9px] font-medium text-grinta-text-secondary uppercase tracking-widest">{post.time}</span>
                                        </div>
                                        <p className="text-xs text-grinta-text-secondary truncate italic opacity-80 leading-relaxed font-medium">
                                            {post.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-lg border ${
                                            post.status === 'SUCCESS' ? 'bg-grinta-accent/10 border-grinta-accent/20 text-grinta-accent' :
                                            post.status === 'INFO' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                            'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                                                {post.status || 'SENT'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {publishedPosts.length === 0 && (
                            <div className="py-20 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                                <Megaphone className="mx-auto text-white/5 mb-4" size={48} />
                                <div className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-widest">Scanning network pulses...</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusIndicator({ label, status, active }: { label: string, status: string, active?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest">{label}</span>
            <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest transition-colors ${active ? 'bg-grinta-accent/10 text-grinta-accent' : 'bg-white/5 text-white/40'
                }`}>
                {status}
            </div>
        </div>
    );
}

function RuleItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-white h-fit">{icon}</div>
            <div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{title}</div>
                <p className="text-[9px] text-grinta-text-secondary font-bold uppercase leading-tight opacity-50">{desc}</p>
            </div>
        </div>
    );
}
