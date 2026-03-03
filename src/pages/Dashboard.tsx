import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SafeActions from '../components/SafeActions';
import RightPanel from '../components/RightPanel';
import AiAgents from '../components/AiAgents';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex">
      <div className="stardust-bg"></div>
      
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <TopBar />
        
        <div className="flex-1 flex px-8 py-6 gap-8 overflow-y-auto">
          <div className="flex-1 flex items-start justify-center">
            <Routes>
              <Route path="/" element={<SafeActions />} />
              <Route path="/agents" element={<AiAgents />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </div>
          <div className="hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
