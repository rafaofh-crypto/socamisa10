import React, { useState } from 'react';

/**
 * Local de salvamento sugerido: src/components/Admin/SyncComponent.tsx
 * Este componente realiza a sincronização das 17 rodadas do Cartola FC
 * e persiste os dados no localStorage.
 */

const SyncComponent: React.FC = () => {
  const [status, setStatus] = useState<string>('Sincronizar Dados');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSync = async () => {
    setLoading(true);
    const allResults: any[] = [];

    for (let rodada = 1; rodada <= 17; rodada++) {
      setStatus(`Sincronizando Rodada ${rodada}...`);
      
      try {
        // Simulação de chamada de API
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = { rodada, status: 'success', timestamp: new Date().toISOString() };
        allResults.push(mockData);
      } catch (error) {
        console.error(`Erro na rodada ${rodada}:`, error);
      }
    }

    localStorage.setItem('cartola_data_sync', JSON.stringify(allResults));
    setStatus('Sincronização Concluída!');
    setLoading(false);

    setTimeout(() => setStatus('Sincronizar Dados'), 3000);
  };

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[#D4AF37] font-bold shadow-lg transition-all hover:bg-white/20 hover:scale-105 disabled:opacity-50"
    >
      {status}
    </button>
  );
};

export default SyncComponent;
