import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SafeActions from '../components/SafeActions';
import RightPanel from '../components/RightPanel';
import WalletConnect from '../components/WalletConnect';
import NewVaultFlow from '../components/NewVaultFlow';
import Overview from '../components/dashboard/Overview';
import MyVaults from '../components/dashboard/MyVaults';
import NetworkMetrics from '../components/dashboard/NetworkMetrics';
import WalletView from '../components/dashboard/WalletView';
import PapelOficial from '../components/dashboard/PapelOficial';
import AgentHubAdmin from '../components/dashboard/AgentHubAdmin';
import { useVaults } from '../context/VaultContext';

export default function Dashboard() {
  const { step } = useVaults();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-grinta-bg">
      <div className="stardust-bg"></div>

      {/* Sidebar - Fixed by its own class, but ensuring layout stays correct */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen relative z-10 overflow-hidden w-full max-w-full">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#050708]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-white hover:bg-white/5 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <span className="text-xl font-extrabold tracking-tighter uppercase font-syncopate text-white">Grinta</span>
          </div>
          <div className="flex items-center gap-2">
            <WalletConnect variant="nav" />
          </div>
        </div>

        <div className="flex-1 flex px-4 lg:px-12 pb-0 gap-6 lg:gap-12 overflow-hidden w-full max-w-full">
          {/* Central Column - The ONLY scrolling part */}
          <div className={`flex-1 overflow-y-auto no-scrollbar pb-24 w-full ${step === 'main_dashboard' ? '' : 'flex flex-col items-center justify-start'}`}>
            {/* Top margin for the central column on Desktop */}
            <div className="hidden lg:block h-12 w-full flex-shrink-0"></div>

            <div className={`w-full ${step === 'main_dashboard' ? 'max-w-7xl mx-auto' : ''}`}>
              {step === 'main_dashboard' ? (
                <div className="flex flex-col gap-8 w-full py-2">
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/manage" element={<SafeActions />} />
                    <Route path="/vaults" element={<MyVaults />} />
                    <Route path="/metrics" element={<NetworkMetrics />} />
                    <Route path="/wallet" element={<WalletView />} />
                    <Route path="/papel" element={<PapelOficial />} />
                    <Route path="/admin" element={<AgentHubAdmin />} />
                    <Route path="*" element={<Navigate to="/app/" replace />} />
                  </Routes>
                </div>
              ) : (
                <NewVaultFlow />
              )}
            </div>
          </div>

          {/* Right Column - Fixed, hidden on smaller screens */}
          <div className="hidden xl:block w-80 pt-2 pb-24 overflow-y-auto no-scrollbar">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
