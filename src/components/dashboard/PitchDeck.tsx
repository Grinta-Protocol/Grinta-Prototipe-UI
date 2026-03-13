import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertOctagon, BrainCircuit, Activity, Lock, TrendingUp, Zap, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const marketData = [
        { name: t('pitch_deck.market.tam', 'TAM (Global Stablecoins)'), value: 180 },
        { name: t('pitch_deck.market.sam', 'SAM (Crypto-Native CDP)'), value: 42 },
        { name: t('pitch_deck.market.som', 'SOM (Grinta Target)'), value: 2.1 }
    ];

    return (
        <div className="flex flex-col gap-16 py-8 pb-32">
            {/* SLIDE 1: Problem & Solution */}
            <motion.section variants={containerVariants} initial="hidden" animate="show" className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    1. {t('pitch_deck.slide1.title_prefix', 'The Problem &')} <span className="text-[#00FF41]">{t('pitch_deck.slide1.title_suffix', 'Our Solution')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Problem */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest font-space-grotesk flex items-center gap-2">
                            <AlertOctagon className="text-red-500" /> {t('pitch_deck.slide1.problem_title', 'Current Paradigm')}
                        </h3>
                        <ul className="space-y-4">
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                <strong className="text-red-400 block mb-1">{t('pitch_deck.slide1.problem1_title', 'The Centralization Trap')}</strong>
                                {t('pitch_deck.slide1.problem1_desc', 'Current stablecoins rely on custodial fiat choke points or easily manipulated, centralized oracle subsets.')}
                            </li>
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                <strong className="text-red-400 block mb-1">{t('pitch_deck.slide1.problem2_title', 'Governance Paralysis')}</strong>
                                {t('pitch_deck.slide1.problem2_desc', 'Slow, human-driven DAOs are inherently incapable of reacting to sub-second market volatility and black swan events.')}
                            </li>
                            <li className="bg-[#0A0A0A] p-4 rounded-xl border border-red-900/20 text-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                <strong className="text-red-400 block mb-1">{t('pitch_deck.slide1.problem3_title', 'Idle Deep Capital')}</strong>
                                {t('pitch_deck.slide1.problem3_desc', 'Over $1.3 Trillion in Bitcoin sits dormant, lacking a native, trust-minimized pathway to generate deep liquidity ecosystem yield.')}
                            </li>
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#00FF41] uppercase tracking-widest font-space-grotesk flex items-center gap-2">
                            <BrainCircuit /> {t('pitch_deck.slide1.solution_title', 'Grinta Protocol')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Activity size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">{t('pitch_deck.slide1.sol1_title', 'Mathematical Stability')}</span>
                                <span className="text-xs text-gray-500">{t('pitch_deck.slide1.sol1_desc', 'Autonomous PID Controller mechanism.')}</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Globe size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">{t('pitch_deck.slide1.sol2_title', 'Agentic First')}</span>
                                <span className="text-xs text-gray-500">{t('pitch_deck.slide1.sol2_desc', 'Designed for AI interaction via MCP.')}</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <TrendingUp size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">{t('pitch_deck.slide1.sol3_title', 'Capital Efficiency')}</span>
                                <span className="text-xs text-gray-500">{t('pitch_deck.slide1.sol3_desc', 'Unlocks WBTC with dynamic max leverage.')}</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#00FF41]/20 flex flex-col gap-2 hover:border-[#00FF41]/50 transition-colors">
                                <Lock size={24} className="text-[#00FF41]" />
                                <span className="font-bold text-white font-space-grotesk">{t('pitch_deck.slide1.sol4_title', 'Immutable')}</span>
                                <span className="text-xs text-gray-500">{t('pitch_deck.slide1.sol4_desc', 'No keepers. No governance wrappers.')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SLIDE 2: Why Now? */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    2. <span className="text-[#00FF41]">{t('pitch_deck.slide2.title', 'Why Now?')}</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222] hover:border-[#00FF41]/30 transition-all">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">01</span>
                        <h4 className="text-lg font-bold text-white mb-2">{t('pitch_deck.slide2.point1_title', 'The MiCA Catalyst')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide2.point1_desc', 'Strict global regulations are forcing a massive capital shift away from fiat-backed IOUs toward truly decentralized, algorithmically sound stablecoins.')}</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222] hover:border-[#00FF41]/30 transition-all">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">02</span>
                        <h4 className="text-lg font-bold text-white mb-2">{t('pitch_deck.slide2.point2_title', 'The Agentic Economy')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide2.point2_desc', 'The maturity of Starknet scaling and the explosion of autonomous AI agents demand a financial base layer built specifically for programmatic, machine-speed interaction.')}</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222] hover:border-[#00FF41]/30 transition-all">
                        <span className="text-4xl font-black text-[#00FF41]/20 mb-2 block">03</span>
                        <h4 className="text-lg font-bold text-white mb-2">{t('pitch_deck.slide2.point3_title', 'Proven Mathematics')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide2.point3_desc', 'PID controllers have been battle-tested in extreme stress tests (e.g., RAI/HAI). Grinta is the first to apply this unbreakable math strictly to the immense liquidity of Bitcoin.')}</p>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-[#00FF41]/5 border border-[#00FF41]/20 p-8 rounded-2xl text-center">
                    <Zap className="mx-auto text-[#00FF41] mb-4" size={32} />
                    <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">{t('pitch_deck.slide2.zap_title', 'The Post-Halving Liquidity Crunch')}</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        {t('pitch_deck.slide2.zap_desc', 'Institutions and retail hold BTC tightly. They need liquidity without triggering tax events or relinquishing their spot positions. Grinta provides the mathematical bridge to liquid USD value.')}
                    </p>
                </motion.div>
            </motion.section>

            {/* SLIDE 3: Market Opportunity */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    3. {t('pitch_deck.slide3.title_prefix', 'Market')} <span className="text-[#00FF41]">{t('pitch_deck.slide3.title_suffix', 'Opportunity')}</span>
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
                                    {marketData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00FF41' }}
                                    formatter={(value: number) => [`$${value}B`, t('pitch_deck.slide3.market_size', 'Market Size')]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-[#00FF41] font-bold text-2xl">$2.1B</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{t('pitch_deck.slide3.som_label', 'SOM (Target)')}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="border border-[#00FF41]/30 bg-[#00FF41]/5 p-6 rounded-2xl">
                            <span className="text-sm text-gray-400 uppercase tracking-widest">{t('pitch_deck.slide3.projected_revenue', 'Projected Protocol Revenue')}</span>
                            <div className="text-5xl font-black text-white my-2 font-syncopate mt-1">$31M <span className="text-xl text-[#00FF41]">{t('pitch_deck.slide3.arr', 'ARR')}</span></div>
                            <p className="text-sm text-gray-400 mt-2">{t('pitch_deck.slide3.revenue_desc', "Captured through stability fees embedded directly in the PID controller's natural drift.")}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222]">
                                <Users className="text-[#00FF41] mb-2" size={20} />
                                <h4 className="font-bold text-white text-sm">{t('pitch_deck.slide3.target1_title', 'Crypto Whales')}</h4>
                                <p className="text-xs text-gray-500">{t('pitch_deck.slide3.target1_desc', 'Tax-free liquidity on large BTC spots.')}</p>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222]">
                                <BrainCircuit className="text-[#00FF41] mb-2" size={20} />
                                <h4 className="font-bold text-white text-sm">{t('pitch_deck.slide3.target2_title', 'AI Agents / DAOs')}</h4>
                                <p className="text-xs text-gray-500">{t('pitch_deck.slide3.target2_desc', 'Autonomous vault management.')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SLIDE 4: Execution */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    4. {t('pitch_deck.slide4.title_prefix', 'Execution &')} <span className="text-[#00FF41]">{t('pitch_deck.slide4.title_suffix', 'Adoption Plan')}</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#00FF41] pl-3">{t('pitch_deck.slide4.phase1_title', 'Phase 1: Autonomous Bootstrapping')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide4.phase1_desc', 'Igniting initial liquidity through agentic networks (Moltbook, 4claw). Establishing the first generation of AI-managed safe deployments without human friction.')}</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#15803d] pl-3">{t('pitch_deck.slide4.phase2_title', 'Phase 2: Deep Protocol Integration')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide4.phase2_desc', 'Embedding GRIT directly into leading Starknet DEXs (Ekubo, Jediswap) to capture extreme capital efficiency and incentivize cross-layer L1/L2 arbitrage pools.')}</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white font-space-grotesk border-l-4 border-[#0a361c] pl-3">{t('pitch_deck.slide4.phase3_title', 'Phase 3: Real-World Penetration')}</h4>
                        <p className="text-sm text-gray-400">{t('pitch_deck.slide4.phase3_desc', 'Unlocking mass retail adoption by plugging directly into LATAM fiat-offramps, transforming the protocol from a DeFi instrument into a censorship-resistant daily currency.')}</p>
                    </div>
                </div>

                <div className="h-[300px] w-full bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 relative overflow-hidden">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">{t('pitch_deck.slide4.tvl_label', 'TVL Projection (Millions $)')}</h4>
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

            {/* SLIDE 5: Funding & Expansion Vision */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#111111] border border-[#222222] rounded-3xl p-10">
                <h2 className="text-3xl font-syncopate font-bold text-white mb-8 border-b border-[#222222] pb-4">
                    5. {t('pitch_deck.slide5.title_prefix', 'Scale')} <span className="text-[#00FF41]">{t('pitch_deck.slide5.title_suffix', 'Objective')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="border border-[#00FF41]/30 bg-[#00FF41]/5 p-6 rounded-2xl text-center shadow-[0_0_25px_rgba(0,255,65,0.1)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF41] to-transparent"></div>
                            <span className="text-sm text-[#00FF41] font-bold uppercase tracking-widest block mb-2">{t('pitch_deck.slide5.milestone', 'Post-Audit Milestone (Year 1)')}</span>
                            <div className="text-5xl font-black text-white my-2 font-syncopate">$2.73M <span className="text-xl text-gray-400">{t('pitch_deck.slide5.usd', 'USD')}</span></div>
                            <p className="text-xs text-gray-400 mt-3 font-mono">{t('pitch_deck.slide5.precision', 'Precision focused: We require only 30 BTC to hit this exact threshold.')}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222222] text-center filter hover:border-[#00FF41]/40 transition-all">
                                <span className="text-3xl font-bold text-white block mb-1">30 <span className="text-base text-gray-500">BTC</span></span>
                                <span className="text-[10px] text-[#00FF41] uppercase tracking-widest font-bold">{t('pitch_deck.slide5.capital_base', 'Total Capital Base')}</span>
                            </div>
                            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222222] text-center filter hover:border-[#00FF41]/40 transition-all">
                                <span className="text-3xl font-bold text-white block mb-1">$70k</span>
                                <span className="text-[10px] text-[#00FF41] uppercase tracking-widest font-bold">{t('pitch_deck.slide5.benchmark', 'Median Benchmark')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest font-space-grotesk flex items-center gap-2">
                            <Globe className="text-[#00FF41]" size={20} /> {t('pitch_deck.slide5.global_reach', 'Global Reach, Local Impact')}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {t('pitch_deck.slide5.catalyst_desc', 'Our ultimate catalyst for mass adoption is providing a direct, mathematical escape hatch from hyperinflation. By deploying deep, localized liquidity corridors in high-need economies, Grinta transitions from a decentralized protocol into a powerful real-world financial sanctuary.')}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {['ARGENTINA', 'BRASIL', 'CHILE', 'COLOMBIA', 'BOLIVIA', 'COSTA RICA', 'GUATEMALA', 'PANAMA', 'PARAGUAY', 'FILIPINAS', 'PERU', 'MEXICO'].map(country => (
                                <span key={country} className="px-3 py-1.5 bg-[#0A0A0A] text-white border border-[#222222] hover:border-[#00FF41]/50 hover:text-[#00FF41] transition-colors rounded-lg text-[10px] font-bold tracking-widest font-space-grotesk">
                                    {country}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
