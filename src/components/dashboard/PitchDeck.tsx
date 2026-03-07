import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertOctagon, BrainCircuit, Activity, Lock, TrendingUp, Zap, Users, Globe } from 'lucide-react';

const marketData = [
    { name: 'TAM (Global Stablecoins)', value: 180 },
    { name: 'SAM (Crypto-Native CDP)', value: 42 },
    { name: 'SOM (Grinta Target)', value: 2.1 }
];
const COLORS = ['#0a361c', '#15803d', '#00FF41'];

const gtmData = [
    { month: 'M1', tvl: 0 },
    { month: 'M3', tvl: 2 },
    { month: 'M6', tvl: 8 },
    { month: 'M9', tvl: 25 },
    { month: 'M12', tvl: 60 },
    { month: 'M15', tvl: 120 },
    { month: 'M18', tvl: 250 }
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function PitchDeck() {
    return (
        <div className="flex flex-col gap-16 py-8 pb-32">
            {/* SLIDE 1: Problem & Solution */}
            <motion.section variants={containerVariants} initial="hidden" animate="show" className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    1. The Problem & <span className="text-[#00FF41]">Our Solution</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Problem */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest font-space-grotesk flex items-center gap-2">
                            <AlertOctagon className="text-red-500" /> Current Paradigm
                        </h3>
                        <ul className="space-y-4">
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300">
                                <strong className="text-red-400 block mb-1">Centralization Risk</strong>
                                Reliance on custodial fiat or easily manipulated oracle subsets.
                            </li>
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300">
                                <strong className="text-red-400 block mb-1">Governance Fragility</strong>
                                Slow, human-driven DAOs failing to react to real-time market shocks.
                            </li>
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300">
                                <strong className="text-red-400 block mb-1">Idle Bitcoin Capital</strong>
                                Over $1 Trillion in BTC sits unutilized, lacking native, trust-minimized yield avenues.
                            </li>
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#00FF41] uppercase tracking-widest font-space-grotesk flex items-center gap-2">
                            <BrainCircuit /> Grinta Protocol
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Activity size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">Mathematical Stability</span>
                                <span className="text-xs text-gray-500">Autonomous PID Controller mechanism.</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Globe size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">Agentic First</span>
                                <span className="text-xs text-gray-500">Designed for AI interaction via MCP.</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <TrendingUp size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">Capital Efficiency</span>
                                <span className="text-xs text-gray-500">Unlocks WBTC with dynamic max leverage.</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Lock size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">Immutable</span>
                                <span className="text-xs text-gray-500">No keepers. No governance wrappers.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SLIDE 2: Why Now? */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    2. <span className="text-[#00FF41]">Why Now?</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222]">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">01</span>
                        <h4 className="text-lg font-bold text-white mb-2">MiCA & Regulatory Shifts</h4>
                        <p className="text-sm text-gray-400">Strict stablecoin regulations are pushing markets toward truly decentralized, algorithm-backed stablecoins over fiat-backed IOUs.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222]">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">02</span>
                        <h4 className="text-lg font-bold text-white mb-2">Rise of L2s & Agents</h4>
                        <p className="text-sm text-gray-400">The maturity of Starknet and the explosion of autonomous AI agents demand protocols built natively for programmatic interaction.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222]">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">03</span>
                        <h4 className="text-lg font-bold text-white mb-2">PID Validation</h4>
                        <p className="text-sm text-gray-400">Mathematical models (RAI, HAI) have proven PID controllers work in stress tests. Grinta applies this strictly to Bitcoin.</p>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-[#00FF41]/5 border border-[#00FF41]/20 p-8 rounded-2xl text-center">
                    <Zap className="mx-auto text-[#00FF41] mb-4" size={32} />
                    <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">The Post-Halving Liquidity Crunch</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Institutions and retail hold BTC tightly. They need liquidity without triggering tax events or relinquishing their spot positions. Grinta provides the mathematical bridge to liquid USD value.
                    </p>
                </motion.div>
            </motion.section>

            {/* SLIDE 3: Market Opportunity */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    3. Market <span className="text-[#00FF41]">Opportunity</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={marketData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {marketData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00FF41' }}
                                    formatter={(value: number) => [`$${value}B`, 'Market Size']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-[#00FF41] font-bold text-2xl">$2.1B</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">SOM (Target)</span>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="border border-[#00FF41]/30 bg-[#00FF41]/5 p-6 rounded-2xl">
                            <span className="text-sm text-gray-400 uppercase tracking-widest">Projected Protocol Revenue</span>
                            <div className="text-5xl font-black text-white my-2 font-syncopate mt-1">$31M <span className="text-xl text-[#00FF41]">ARR</span></div>
                            <p className="text-sm text-gray-400 mt-2">Captured through stability fees embedded directly in the PID controller's natural drift.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222]">
                                <Users className="text-[#00FF41] mb-2" size={20} />
                                <h4 className="font-bold text-white text-sm">Crypto Whales</h4>
                                <p className="text-xs text-gray-500">Tax-free liquidity on large BTC spots.</p>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222]">
                                <BrainCircuit className="text-[#00FF41] mb-2" size={20} />
                                <h4 className="font-bold text-white text-sm">AI Agents / DAOs</h4>
                                <p className="text-xs text-gray-500">Autonomous vault management.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SLIDE 4: GTM Strategy */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    4. Go-To-Market <span className="text-[#00FF41]">Strategy</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#00FF41] pl-3">Phase 1: Agent Launch</h4>
                        <p className="text-sm text-gray-400">Community-led bootstrapping via autonomous networks (Moltbook, 4claw). Establishing the first AI-managed safe deployments.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#15803d] pl-3">Phase 2: DeFi Primitives</h4>
                        <p className="text-sm text-gray-400">Integrating GRIT into Starknet DEXs (Ekubo, Jediswap) for deep liquidity and incentivized arb pools bridging L1 and L2.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#0a361c] pl-3">Phase 3: Real World</h4>
                        <p className="text-sm text-gray-400">Expansion into LATAM fiat-offramps. Allowing emerging market users to hold a censorship-resistant stablecoin shielded from local inflation.</p>
                    </div>
                </div>

                <div className="h-[300px] w-full bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">TVL Projection (Millions $)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={gtmData}>
                            <defs>
                                <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#444" tick={{ fill: '#888', fontSize: 12 }} />
                            <YAxis stroke="#444" tick={{ fill: '#888', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ color: '#00FF41' }}
                            />
                            <Area type="monotone" dataKey="tvl" stroke="#00FF41" strokeWidth={3} fillOpacity={1} fill="url(#colorTvl)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.section>
        </div>
    );
}
