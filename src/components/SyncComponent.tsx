import React, { useState } from 'react';

interface SyncState {
  loading: boolean;
  progress: number;
  error: string | null;
}

export const SyncComponent: React.FC = () => {
  const [state, setState] = useState<SyncState>({ loading: false, progress: 0, error: null });

  const syncData = async () => {
    setState({ loading: true, progress: 0, error: null });
    const results: any[] = [];

    try {
      for (let round = 1; round <= 17; round++) {
        const response = await fetch(`https://api.cartola.globo.com/liga/so-camisa-10-2026/pontuacao/${round}`);
        if (!response.ok) throw new Error(`Failed to fetch round ${round}`);
        
        const data = await response.json();
        results.push({ round, data });
        
        setState(prev => ({ ...prev, progress: Math.round((round / 17) * 100) }));
      }
      
      localStorage.setItem('tournament_data', JSON.stringify(results));
      alert('Sync completed successfully!');
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Sync failed. Please check your connection.' }));
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-yellow-600 shadow-2xl max-w-md mx-auto">
      <h2 className="text-yellow-500 text-xl font-bold mb-4">Sync Historical Data</h2>
      <button 
        onClick={syncData} 
        disabled={state.loading}
        className="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded transition-all disabled:opacity-50"
      >
        {state.loading ? 'Syncing...' : 'Sync Now (R1-R17)'}
      </button>
      
      {state.loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full transition-all" style={{ width: `${state.progress}%` }} />
          </div>
          <p className="text-yellow-500 text-xs mt-2">Progress: {state.progress}%</p>
        </div>
      )}
      
      {state.error && <p className="text-red-500 mt-4 text-sm">{state.error}</p>}
    </div>
  );
};
