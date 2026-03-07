import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Settings2, Zap, BrainCircuit, ActivitySquare, Loader2 } from 'lucide-react';

export default function EconomicModel() {
    const [layer, setLayer] = useState<'math' | 'ds' | 'quantum'>('math');
    const [shock, setShock] = useState(30);
    const [volatility, setVolatility] = useState(20);
    const [isSimulating, setIsSimulating] = useState(false);
    const [graphData, setGraphData] = useState<any[]>([]);

    // Generator math
    useEffect(() => {
        generateData();
    }, [layer, shock, volatility]);

    const generateData = () => {
        const data = [];
        const points = 50;

        if (layer === 'math') {
            // Deterministic PID: sudden drop by 'shock', then smooth recovery
            let price = 1.0;
            for (let i = 0; i <= points; i++) {
                if (i === 10) {
                    price = 1.0 - (shock / 100) * 0.5; // Shock event
                } else if (i > 10) {
                    // PID recovery
                    price += (1.0 - price) * 0.15;
                }
                data.push({ time: i, price: Number(price.toFixed(4)), target: 1.0 });
            }
        } else if (layer === 'ds') {
            // Monte Carlo: 3 stochastic paths and 1 mean
            let p1 = 1.0, p2 = 1.0, p3 = 1.0;
            for (let i = 0; i <= points; i++) {
                if (i === 10) {
                    p1 = p2 = p3 = 1.0 - (shock / 100) * 0.5;
                } else if (i > 10) {
                    const v = (volatility / 100) * 0.1;
                    p1 += (1.0 - p1) * 0.1 + (Math.random() - 0.5) * v;
                    p2 += (1.0 - p2) * 0.1 + (Math.random() - 0.5) * v;
                    p3 += (1.0 - p3) * 0.1 + (Math.random() - 0.5) * v;
                }
                const mean = (p1 + p2 + p3) / 3;
                data.push({
                    time: i,
                    path1: Number(p1.toFixed(4)),
                    path2: Number(p2.toFixed(4)),
                    path3: Number(p3.toFixed(4)),
                    mean: Number(mean.toFixed(4)),
                    target: 1.0
                });
            }
        } else if (layer === 'quantum') {
            // Energy Landscape: Scatter plot converging
            for (let i = 0; i <= points; i++) {
                const spread = i < 10 ? 0.01 : Math.max(0.01, (volatility / 100) * 0.5 * Math.exp(-(i - 10) * 0.1));
                const numParticles = 5;
                for (let j = 0; j < numParticles; j++) {
                    const y = 1.0 + (Math.random() - 0.5) * spread;
                    const z = Math.random() * 100; // Probability / mass
                    data.push({ x: i, y: Number(y.toFixed(4)), z });
                }
            }
        }
        setGraphData(data);
    };

    const runSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => {
            generateData();
            setIsSimulating(false);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-8 text-white min-h-screen font-space-grotesk pb-20">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest text-[#00FF41]">Governance / Utility</span>
                    <h2 className="text-2xl font-bold font-syncopate">$GRNT</h2>
                    <p className="text-sm text-gray-500">Absorbs system volatility. Staked by agents to propose PID parameter adjustments.</p>
                </div>
                <div className="bg-[#111111] border border-[#00FF41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF41]/5 rounded-full blur-3xl"></div>
                    <span className="text-xs uppercase tracking-widest text-[#00FF41]">Stablecoin (CDP)</span>
                    <h2 className="text-2xl font-bold font-syncopate tracking-widest">$GRIT</h2>
                    <p className="text-sm text-gray-400">Target Peg: <strong>$1.00</strong><br />Maintained exclusively by the PI Controller.</p>
                </div>
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest text-[#00FF41]">Mechanism</span>
                    <h2 className="text-2xl font-bold font-syncopate">Seigniorage</h2>
                    <p className="text-sm text-gray-500">Stability fees generated from debt positions accrue value continuously to the protocol.</p>
                </div>
            </div>

            {/* Simulator Core */}
            <div className="flex flex-col lg:flex-row gap-6 bg-[#0A0A0A] border border-[#222222] rounded-3xl p-6 lg:p-8">

                {/* Sidebar Controls */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r border-[#222222] pb-8 lg:pb-0 lg:pr-8">
                    <div>
                        <h3 className="text-lg font-bold font-syncopate uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Settings2 className="text-[#00FF41]" /> Parameters
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                                    <span>Market Shock</span>
                                    <span className="text-[#00FF41]">{shock}%</span>
                                </div>
                                <input
                                    type="range" min="10" max="100" value={shock}
                                    onChange={(e) => setShock(Number(e.target.value))}
                                    className="w-full accent-[#00FF41] h-1 bg-[#222222] rounded-full appearance-none outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                                    <span>Volatility Factor</span>
                                    <span className="text-[#00FF41]">{volatility}</span>
                                </div>
                                <input
                                    type="range" min="10" max="100" value={volatility}
                                    onChange={(e) => setVolatility(Number(e.target.value))}
                                    className="w-full accent-[#00FF41] h-1 bg-[#222222] rounded-full appearance-none outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <h4 className="text-xs text-gray-500 uppercase font-bold tracking-widest">Simulation Model</h4>

                        <button
                            onClick={() => setLayer('math')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-bold ${layer === 'math' ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]' : 'border-[#222222] text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <ActivitySquare size={16} /> 1. Deterministic (PID)
                        </button>
                        <button
                            onClick={() => setLayer('ds')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-bold ${layer === 'ds' ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]' : 'border-[#222222] text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <BrainCircuit size={16} /> 2. Stochastic (Monte Carlo)
                        </button>
                        <button
                            onClick={() => setLayer('quantum')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-bold ${layer === 'quantum' ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]' : 'border-[#222222] text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <Zap size={16} /> 3. Energy Landscape (Scatter)
                        </button>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="mt-auto w-full py-4 bg-[#00FF41] text-black font-syncopate font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSimulating ? <Loader2 size={18} className="animate-spin" /> : 'Run Scenario'}
                    </button>
                </div>

                {/* Chart Area */}
                <div className="w-full lg:w-2/3 h-[400px] lg:h-auto relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!isSimulating ? (
                            <motion.div
                                key={layer}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <div className="w-full h-full">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase font-syncopate tracking-widest mb-4">
                                        {layer === 'math' ? 'Peg Recovery Trajectory' : layer === 'ds' ? 'Price Paths (Mean Reversion)' : 'Probability Density State'}
                                    </h3>

                                    <ResponsiveContainer width="100%" height="90%">
                                        {layer === 'math' ? (
                                            <LineChart data={graphData}>
                                                <XAxis dataKey="time" stroke="#444" tick={false} />
                                                <YAxis domain={['auto', 'auto']} stroke="#444" tick={{ fill: '#888', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                                <Line type="monotone" dataKey="target" stroke="#444" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                                                <Line type="monotone" dataKey="price" stroke="#00FF41" strokeWidth={3} dot={false} />
                                            </LineChart>
                                        ) : layer === 'ds' ? (
                                            <LineChart data={graphData}>
                                                <XAxis dataKey="time" stroke="#444" tick={false} />
                                                <YAxis domain={['auto', 'auto']} stroke="#444" tick={{ fill: '#888', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                                <Line type="monotone" dataKey="target" stroke="#444" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                                                <Line type="monotone" dataKey="path1" stroke="#15803d" strokeWidth={1} dot={false} opacity={0.6} activeDot={false} />
                                                <Line type="monotone" dataKey="path2" stroke="#15803d" strokeWidth={1} dot={false} opacity={0.6} activeDot={false} />
                                                <Line type="monotone" dataKey="path3" stroke="#22c55e" strokeWidth={1} dot={false} opacity={0.6} activeDot={false} />
                                                <Line type="monotone" dataKey="mean" stroke="#00FF41" strokeWidth={4} dot={false} />
                                            </LineChart>
                                        ) : (
                                            <ScatterChart>
                                                <XAxis dataKey="x" type="number" stroke="#444" tick={false} />
                                                <YAxis dataKey="y" type="number" domain={['auto', 'auto']} stroke="#444" tick={{ fill: '#888', fontSize: 10 }} />
                                                <ZAxis dataKey="z" range={[10, 200]} />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                                <Scatter name="State" data={graphData} fill="#00FF41" fillOpacity={0.5} />
                                            </ScatterChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
