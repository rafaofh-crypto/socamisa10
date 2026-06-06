import React, { useState } from 'react';

interface Team {
  time_id: number;
  nome: string;
  nome_cartola: string;
  url_escudo_png: string;
}

interface SyncState {
  progress: number;
  status: string;
  isSyncing: boolean;
}

const CartolaSyncDashboard: React.FC = () => {
  const [state, setState] = useState<SyncState>({ progress: 0, status: 'Ready', isSyncing: false });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const syncData = async () => {
    setState({ progress: 0, status: 'Fetching league data...', isSyncing: true });
    try {
      const leagueRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.cartola.globo.com/liga/so-camisa-10-2026')}`);
      const leagueData = JSON.parse((await leagueRes.json()).contents);
      const teams: Team[] = leagueData.times;
      const results: any[] = [];

      for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        const teamScores = [];
        setState({ progress: Math.round((i / teams.length) * 100), status: `Processing ${team.nome}...`, isSyncing: true });

        for (let round = 1; round <= 17; round++) {
          try {
            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.cartola.globo.com/time/id/${team.time_id}/${round}`)}`);
            const data = JSON.parse((await res.json()).contents);
            teamScores.push({ round, score: data.pontos || 0 });
          } catch (e) {
            console.error(`Error fetching round ${round} for ${team.nome}`);
          }
          await delay(200);
        }
        results.push({ ...team, history: teamScores });
      }

      localStorage.setItem('cartola_rankings', JSON.stringify(results));
      setState({ progress: 100, status: 'Sync Complete!', isSyncing: false });
    } catch (error) {
      setState({ progress: 0, status: 'Sync Failed. Check console.', isSyncing: false });
    }
  };

  return (
    <div className="p-8 bg-[#1a1a1a] text-[#d4af37] min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 border-b border-[#d4af37] pb-2">Cartola Sync Dashboard</h1>
      <div className="bg-[#262626] p-6 rounded-lg shadow-xl">
        <p className="mb-4">Status: {state.status}</p>
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden mb-6">
          <div className="bg-[#d4af37] h-full transition-all duration-300" style={{ width: `${state.progress}%` }} />
        </div>
        <button 
          onClick={syncData} 
          disabled={state.isSyncing} 
          className="bg-[#d4af37] text-[#1a1a1a] px-6 py-2 rounded font-bold hover:bg-[#b8962d] disabled:opacity-50"
        >
          {state.isSyncing ? 'Syncing...' : 'Start Sync'}
        </button>
      </div>
    </div>
  );
};

export default CartolaSyncDashboard;
