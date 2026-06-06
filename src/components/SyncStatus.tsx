import React from "react";
import { RefreshCw, CheckCircle, Wifi, Database } from "lucide-react";

interface SyncStatusProps {
  currentRound: number;
  syncTimestamp: string;
  source: "API" | "FALLBACK";
  isSyncing: boolean;
  onSyncTrigger?: () => void;
}

export default function SyncStatus({
  currentRound,
  syncTimestamp,
  source,
  isSyncing,
  onSyncTrigger
}: SyncStatusProps) {
  const isFallback = source === "FALLBACK";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 glass-effect rounded-2xl gap-4 text-white" id="sync-status-widget">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase font-bold tracking-widest text-gold font-mono">MVP Só Camisa 10</span>
          <div className={`p-1 px-2 rounded text-[9px] font-mono font-bold flex items-center gap-1 uppercase ${
            isFallback ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/15 text-emerald-450 border border-emerald-500/25"
          }`}>
            {isFallback ? <Database className="w-2.5 h-2.5" /> : <Wifi className="w-2.5 h-2.5" />}
            <span>Base: {source}</span>
          </div>

          <div className="p-1 px-2 rounded text-[9px] font-mono font-bold flex items-center gap-1 uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mercado Aberto - Rodada 18</span>
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight font-display text-white mt-1.5 uppercase">Série A Fantasy</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Última Sincronização: <span className="text-gold font-semibold">{syncTimestamp}</span> &bull; Rodada Atual: <span className="text-white font-bold">{currentRound}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onSyncTrigger && (
          <button
            onClick={onSyncTrigger}
            disabled={isSyncing}
            className="px-4 py-2 bg-charcoal-dark/80 border border-gold/20 hover:border-gold text-xs font-bold font-mono rounded-xl flex items-center gap-2 text-gold hover:bg-gold/5 transition disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-white" : ""}`} />
            <span>Sincronizar Agora</span>
          </button>
        )}
      </div>
    </div>
  );
}
