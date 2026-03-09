import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SafeActions from '../components/SafeActions';
import RightPanel from '../components/RightPanel';
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

  return (
    <div className="h-screen flex overflow-hidden bg-grinta-bg">
      <div className="stardust-bg"></div>

      {/* Sidebar - Fixed by its own class, but ensuring layout stays correct */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen relative z-10 overflow-hidden">
        <div className="flex-1 flex px-12 pb-0 gap-12 overflow-hidden">
          {/* Central Column - The ONLY scrolling part */}
          <div className={`flex-1 overflow-y-auto no-scrollbar pb-24 ${step === 'main_dashboard' ? '' : 'flex flex-col items-center justify-start'}`}>
            {/* Margen superior solo para la columna central */}
            <div className="h-12 w-full flex-shrink-0"></div>

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
                    <Route path="/admin/agent-hub" element={<AgentHubAdmin />} />
                    <Route path="*" element={<Navigate to="/app/" replace />} />
                  </Routes>
                </div>
              ) : (
                <NewVaultFlow />
              )}
            </div>
          </div>

          {/* Right Column - Fixed */}
          <div className="hidden lg:block w-80 pt-2 pb-24 overflow-y-auto no-scrollbar">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
