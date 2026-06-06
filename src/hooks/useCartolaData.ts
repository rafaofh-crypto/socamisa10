import { useState, useEffect, useCallback } from 'react';
import { syncCartolaData, CartolaData } from '../services/cartolaService';

export function useCartolaData() {
  const [data, setData] = useState<CartolaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [source, setSource] = useState<string>(() => localStorage.getItem('cartolaDataSource') || 'FALLBACK');

  // Memoize sync to handle multiple calls safely
  const sync = useCallback(async (onProgressMsg?: (msg: string) => void) => {
    setLoading(true);
    setError(null);
    const logs: string[] = [];
    
    const trackProgress = (msg: string) => {
      const timestamped = `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`;
      logs.push(timestamped);
      setProgressLog([...logs]);
      if (onProgressMsg) {
        onProgressMsg(msg);
      }
    };

    trackProgress("Iniciando processo de ETL no Hook...");
    try {
      const storedToken = localStorage.getItem('cartolaGloboToken') || '';
      if (storedToken) {
        trackProgress("Token Globo ID / GLOBO_ID encontrado no armazenamento local. Efetuando chamada autenticada...");
      } else {
        trackProgress("Nenhum Globo ID token fornecido. Tentando chamada pública / usando fallback...");
      }
      const result = await syncCartolaData(trackProgress, storedToken);
      setData(result);
      setSource(localStorage.getItem('cartolaDataSource') || 'FALLBACK');
      setLastSync(new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR"));
      trackProgress(`ETL finalizado com êxito! Sincronizados ${result.times.length} times.`);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro desconhecido ao sincronizar';
      setError(errorMsg);
      trackProgress(`FALHA CRÍTICA ETL: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, load cached data from localStorage if available, or fetch
  useEffect(() => {
    const cached = localStorage.getItem('cartolaData');
    const cachedTimestamp = localStorage.getItem('cartolaDataTimestamp');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CartolaData;
        setData(parsed);
        setSource(localStorage.getItem('cartolaDataSource') || 'FALLBACK');
        setLastSync(new Date(cachedTimestamp || Date.now()).toLocaleDateString("pt-BR") + " " + new Date(cachedTimestamp || Date.now()).toLocaleTimeString("pt-BR"));
        setLoading(false);
        // Sync in background to update
        sync();
      } catch (e) {
        sync();
      }
    } else {
      sync();
    }
  }, [sync]);

  return { data, loading, error, sync, lastSync, progressLog, source };
}
