import React, { useState } from 'react';
import PitchDeck from './PitchDeck';
import EconomicModel from './EconomicModel';

export default function PapelOficial() {
    const [activeTab, setActiveTab] = useState<'pitch' | 'economic'>('pitch');

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h1 className="text-3xl font-syncopate uppercase tracking-widest font-bold">Official Paper</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('pitch')}
                        className={`px-4 py-2 font-space-grotesk font-bold uppercase text-sm border-b-2 transition-colors ${activeTab === 'pitch' ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        Pitch Deck
                    </button>
                    <button
                        onClick={() => setActiveTab('economic')}
                        className={`px-4 py-2 font-space-grotesk font-bold uppercase text-sm border-b-2 transition-colors ${activeTab === 'economic' ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        Economic Model
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'pitch' ? <PitchDeck /> : <EconomicModel />}
            </div>
        </div>
    );
}
