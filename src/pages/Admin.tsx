import React, { useState, useEffect } from 'react';
import SyncComponent from '../components/SyncComponent';

const Admin: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncComplete = (data: any) => {
    console.log('Sync complete', data);
    localStorage.setItem('admin_data_rounds', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-12 font-sans">
      <header className="mb-10 border-b border-[#D4AF37]/30 pb-6">
        <h1 className="text-4xl font-bold text-[#D4AF37] tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage round data (1-17) and system synchronization</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1e1e1e]/50 backdrop-blur-xl border border-[#D4AF37]/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">Data Synchronization</h2>
          <p className="text-sm text-gray-300 mb-6">
            Fetch and cache team shields and match results for rounds 1 through 17. 
            Ensure your API keys are configured correctly before initiating.
          </p>
          <div className="flex items-center justify-center p-4 border border-dashed border-[#D4AF37]/30 rounded-lg">
            <SyncComponent 
              onSyncStart={() => setIsSyncing(true)} 
              onSyncComplete={(data) => {
                setIsSyncing(false);
                handleSyncComplete(data);
              }}
            />
          </div>
        </div>

        <div className="bg-[#1e1e1e]/50 backdrop-blur-xl border border-[#D4AF37]/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-[#121212] rounded-lg border border-[#D4AF37]/10">
              <span className="text-gray-400">Storage Status</span>
              <span className="text-[#D4AF37]">Active</span>
            </div>
            <div className="flex justify-between p-4 bg-[#121212] rounded-lg border border-[#D4AF37]/10">
              <span className="text-gray-400">Last Sync</span>
              <span className="text-white">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
