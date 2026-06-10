import React, { useState } from "react";
import { 
  Sliders, Settings, RefreshCw, Layout, AlertCircle
} from "lucide-react";

interface AdminProps {
  currentRound: number;
  syncTimestamp: string;
  source: string;
  isSyncing: boolean;
  onSyncTrigger: () => void;
  syncLogs: string[];
  cutRound: number;
  onCutRoundChange: (val: number) => void;
  theme: string;
  onThemeChange: (val: string) => void;
}

export default function Admin({
  currentRound,
  syncTimestamp,
  source,
  isSyncing,
  onSyncTrigger,
  syncLogs,
  cutRound,
  onCutRoundChange,
  theme,
  onThemeChange
}: AdminProps) {
  const [globoToken, setGloboToken] = useState<string>(() => localStorage.getItem("cartolaGloboToken") || "");

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setGloboToken(val);
    localStorage.setItem("cartolaGloboToken", val);
  };

  const [syncingR17, setSyncingR17] = useState(false);
  const [r17Logs, setR17Logs] = useState<string[]>([]);
  const [r17Sql, setR17Sql] = useState<string[]>([]);
  const [showSql, setShowSql] = useState(false);

  const handleSyncR17 = async () => {
    setSyncingR17(true);
    setR17Logs(["[" + new Date().toLocaleTimeString("pt-BR") + "] Conectando ao servidor backend..." ]);
    setR17Sql([]);

    try {
      const response = await fetch("/api/sync/rodada17", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setR17Logs(result.logs);
        setR17Sql(result.sqlQueries);
        onSyncTrigger(); // Notifica o contexto de dados para regerar os rankings gerais e a aba Copa
      } else {
        throw new Error("Sincronização retornou código de falha no servidor.");
      }
    } catch (e: any) {
      setR17Logs((prev) => [
        ...prev,
        `[FALHA] Falha na sincronização completa: ${e.message}`
      ]);
    } finally {
      setSyncingR17(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      
      <div className="p-5 glass-effect rounded-2xl flex items-center gap-4 border border-gold/15">
        <Settings className="w-6 h-6 text-gold" />
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B0B0B0] font-mono">Gerência e Controle White-Label</span>
          <h2 className="text-2xl font-black font-display uppercase tracking-wider text-white mt-0.5">Painel de Administração</h2>
        </div>
      </div>

      {currentRound >= 38 && (
        <div className="p-5 bg-gradient-to-r from-red-950/20 via-red-900/10 to-red-950/20 border-2 border-red-500/20 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-wider">
              🔒 Bloqueio de Copas & Modo Gala Ativo
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              O campeonato foi totalmente concluído e consolidado no final da <strong>Rodada 37 (Copas M10 e B10 finalizadas)</strong>. Todas as sincronizações parciais de dados de copas, alteração dos pontos/rodada de corte e testes estão atualmente <strong>bloqueados para preservar os dados oficiais dos pódios e campeões</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API SYNC CONTAINER */}
        <section className="bg-charcoal-dark/45 border border-white/5 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <RefreshCw className="w-5 h-5 text-gold" />
            <h3 className="font-display font-semibold text-xs tracking-wider uppercase">Sincronização com Cartola FC (ETL Real)</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <p>🔄 Rodada Ativa no Cartola: <span className="text-gold font-bold">{currentRound}</span></p>
            <p>🗓️ Último Fetch Efetuado: <span className="text-slate-250">{syncTimestamp}</span></p>
            <p>📡 Servidor Ativo: <span className="text-slate-300 bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{source}</span></p>
          </div>

          <div className="bg-[#121212]/80 border border-gold/10 p-3 rounded-xl space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-extrabold block">
                🔑 Token Globo ID (Opcional)
              </span>
              <span className="text-[9px] text-gold bg-gold/5 px-1.5 py-0.2 rounded font-mono uppercase font-semibold">
                Privado
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              A liga <strong className="text-white">Só Camisa 10 2026</strong> é privada no Cartola FC. Para burlar o Erro 500/401 do servidor da Globo, insira seu token GLOBO_ID obtido após fazer login em <a href="https://cartola.globo.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">cartola.globo.com</a>.
            </p>
            <input
              type="text"
              placeholder="Cole seu GLB ID token aqui..."
              value={globoToken}
              onChange={handleTokenChange}
              disabled={currentRound >= 38}
              className="w-full px-3 py-2 rounded-lg bg-charcoal-dark border border-slate-700 text-xs text-slate-150 placeholder:text-slate-500 font-mono disabled:opacity-40"
            />
            <span className="block text-[9px] text-slate-500 leading-tight">
              * O token é salvo localmente em seu navegador e retransmitido de forma segura pelo nosso proxy. Se deixado vazio, usaremos o Banco de Dados simulado local de Alta Fidelidade (Rodada 17).
            </span>
          </div>

          <button
            onClick={onSyncTrigger}
            disabled={isSyncing || currentRound >= 38}
            className="w-full py-3 bg-gold hover:bg-gold/90 text-charcoal-dark font-display font-bold text-xs uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{currentRound >= 38 ? "Sincronização Bloqueada (Gala)" : isSyncing ? "Sincronizando..." : "Sincronizar Agora (ETL)"}</span>
          </button>

          {/* Sync logs timeline */}
          <div className="mt-4">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-extrabold block">Fila de Processamento de API (Logs)</span>
            <div className="mt-2 text-[9.5px] font-mono leading-relaxed bg-[#0a0a0a] border border-white/5 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1 block">
              {syncLogs.length > 0 ? (
                syncLogs.map((l, index) => (
                  <div key={index} className="text-slate-400">
                    &gt; {l}
                  </div>
                ))
              ) : (
                <span className="text-slate-600 block">Nenhum log registrado na sessão ativa.</span>
              )}
            </div>
          </div>
        </section>

        {/* CUP SETTINGS CONTAINER */}
        <section className="bg-charcoal-dark/45 border border-white/5 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders className="w-5 h-5 text-gold" />
              <h3 className="font-display font-semibold text-xs tracking-wider uppercase">Parâmetros do Mata-Mata (Copa)</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1 font-bold">Rodada de Corte do Brasileirão</label>
                <input
                  type="number"
                  min={1}
                  max={38}
                  value={cutRound}
                  onChange={(e) => onCutRoundChange(Math.max(1, parseInt(e.target.value) || 21))}
                  disabled={currentRound >= 38}
                  className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-charcoal-dark border border-gold/20 font-mono text-xs font-bold text-gold disabled:opacity-40"
                />
                <span className="block text-[10px] text-slate-500 mt-1 max-w-sm">Define qual rodada civil serve de corte (padrão CBF: 21)</span>
              </div>

              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1 font-extrabold">Rodadas da Fase de Grupos</span>
                <div className="flex gap-2">
                  <span className="bg-white/5 font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-405">R22</span>
                  <span className="bg-white/5 font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-410">R23</span>
                  <span className="bg-white/5 font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-415">R24</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLOR THEMES BRANDING */}
          <div className="border-t border-white/5 pt-4">
            <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-gold" />
              White-Label Branding (SaaS Temas)
            </span>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                { id: "gold", name: "Gold 10", color: "#D4AF37" },
                { id: "emerald", name: "Emerald", color: "#10B981" },
                { id: "ruby", name: "Ruby", color: "#EF4444" },
                { id: "neon", name: "Cyberpunk", color: "#EC4899" }
              ].map((themeOpt) => (
                <button
                  key={themeOpt.id}
                  onClick={() => onThemeChange(themeOpt.id)}
                  className={`p-2.5 rounded-xl border transition-all text-center cursor-pointer ${theme === themeOpt.id ? "border-gold bg-gold/10" : "border-slate-800 bg-charcoal-dark/30 hover:bg-white/5"}`}
                >
                  <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: themeOpt.color }} />
                  <span className="text-[9px] font-bold block mt-1">{themeOpt.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* INTEGRATION SECTION FOR ROUND 17 REAL SCORE FETCHER */}
      <section className="bg-charcoal-dark/45 border border-gold/15 p-6 rounded-2xl space-y-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gold/10 p-2.5 rounded-xl border border-gold/25">
              <RefreshCw className="w-5 h-5 text-gold animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                🏆 Sincronizador de Pontuações de Campo Real (Rodada 17)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Substitui as simulações e puxa as notas consolidadas pontuadas pelos 50 participantes diretamente da API do Cartola FC.
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={handleSyncR17}
              disabled={syncingR17 || currentRound >= 38}
              className="px-5 py-3 bg-gold hover:bg-gold/90 text-charcoal-dark font-display font-black text-xs uppercase rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${syncingR17 ? "animate-spin" : ""}`} />
              <span>{currentRound >= 38 ? "Bloqueado em Gala" : syncingR17 ? "Sincronizando..." : "Sincronizar Rodada 17"}</span>
            </button>
          </div>
        </div>

        {/* METRICS OF THE COMPONENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/25 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-gold">1. Varredura Segura</span>
            <p className="text-xs text-slate-350 font-sans leading-normal">
              Consome individualmente as APIs de tempo/slug para cada participante de forma sequencial com timeouts controlados.
            </p>
          </div>
          <div className="bg-black/25 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-gold">2. Extração Fiel</span>
            <p className="text-xs text-slate-350 font-sans leading-normal">
              Extrai o campo oficial consolidado <code className="text-gold font-mono bg-white/5 px-1 rounded">pontos</code> do time.
            </p>
          </div>
          <div className="bg-black/25 border border-white/5 p-4 rounded-xl space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-gold">3. Escrita SQL Direta</span>
            <p className="text-xs text-slate-350 font-sans leading-normal">
              Gera queries <code className="text-gold font-mono bg-white/5 px-1 rounded block mt-1">INSERT INTO scores ... ON CONFLICT</code> prontas para rodar.
            </p>
          </div>
        </div>

        {/* LOGS and SQL OUTPUT */}
        {(r17Logs.length > 0 || r17Sql.length > 0) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pt-2">
            {/* LOG STREAMER */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block uppercase">
                🖥️ Logs da Fila de Processamento (API)
              </span>
              <div className="text-[10px] font-mono leading-relaxed bg-[#0a0a0a] border border-white/5 rounded-xl p-4 max-h-60 overflow-y-auto space-y-1 text-slate-300">
                {r17Logs.map((log, idx) => (
                  <div key={idx} className={log.includes("[Sufixo OK]") ? "text-emerald-400" : log.includes("[Alerta API]") ? "text-amber-400 font-semibold" : ""}>
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>

            {/* SQL OUTPUT COMMANDS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block uppercase">
                  💾 Queries SQL Geradas (<code className="text-gold font-mono bg-white/10 px-1 rounded">scores</code>)
                </span>
                <button 
                  onClick={() => setShowSql(!showSql)}
                  className="text-[9px] text-gold border border-gold/30 hover:bg-gold/10 px-2.5 py-1 rounded uppercase font-extrabold transition font-mono cursor-pointer"
                >
                  {showSql ? "Ocultar SQL" : "Ver Código SQL"}
                </button>
              </div>
              
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 max-h-60 overflow-y-auto relative">
                {r17Sql.length > 0 ? (
                  showSql ? (
                    <pre className="text-[9.5px] font-mono leading-normal text-slate-300 whitespace-pre-wrap select-all">
                      {r17Sql.join("\n")}
                    </pre>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs text-slate-400">Total de <strong className="text-gold">{r17Sql.length} queries SQL</strong> geradas com sucesso.</p>
                      <p className="text-[10px] text-slate-500">Clique em "Ver Código SQL" para examinar as instruções preparadas.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs text-slate-650 font-mono">
                    Logs SQL serão processados após início da sincronização.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
