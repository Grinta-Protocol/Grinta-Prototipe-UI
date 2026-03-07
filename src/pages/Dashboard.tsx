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
import { useVaults } from '../context/VaultContext';

export default function Dashboard() {
  const { step } = useVaults();

  return (
    <div className="min-h-screen flex">
      <div className="stardust-bg"></div>

      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <TopBar />

        <div className="flex-1 flex px-8 py-6 gap-8 overflow-y-auto">
          {/* Central Column */}
          <div className={`flex-1 flex flex-col ${step === 'main_dashboard' ? '' : 'items-center justify-start'}`}>
            {step === 'main_dashboard' ? (
              <div className="flex-1 flex flex-col gap-8 w-full">
                <div className="flex-1 flex items-start justify-center">
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/manage" element={<SafeActions />} />
                    <Route path="/vaults" element={<MyVaults />} />
                    <Route path="/metrics" element={<NetworkMetrics />} />
                    <Route path="/wallet" element={<WalletView />} />
                    <Route path="/papel" element={<PapelOficial />} />
                    <Route path="*" element={<Navigate to="/app/" replace />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <NewVaultFlow />
            )}
          </div>

          {/* Right Column */}
          <div className="hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
