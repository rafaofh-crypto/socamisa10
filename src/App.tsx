import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useCartolaData } from "./hooks/useCartolaData";
import { CartolaTeam } from "./services/cartolaService";

// Import modular layouts and pages
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Destaques from "./pages/Destaques";
import Mensal from "./pages/Mensal";
import MataMata from "./pages/MataMata";
import CopaB10 from "./pages/CopaB10";
import Admin from "./pages/Admin";
import RulesBook from "./pages/RulesBook";
import CompetitionSelector from "./components/CompetitionSelector";
import TournamentCalendarView from "./components/TournamentCalendarView";

export default function App() {
  const { data, loading, error, sync, lastSync, progressLog, source } = useCartolaData();

  // Application active tab navigation state
  const [activeTab, setActiveTab ] = useState<"dashboard" | "rodada" | "mensal" | "copa" | "copa_b10" | "calendario" | "regras" | "admin" >("dashboard");

  // Visible components states managed by Admin
  const [isM10Enabled, setIsM10Enabled] = useState<boolean>(() => {
    return localStorage.getItem("isM10Enabled") !== "false";
  });
  const [isB10Enabled, setIsB10Enabled] = useState<boolean>(() => {
    return localStorage.getItem("isB10Enabled") !== "false";
  });
  const [isSimulatorsEnabled, setIsSimulatorsEnabled] = useState<boolean>(() => {
    return localStorage.getItem("isSimulatorsEnabled") === "true";
  });

  const handleM10EnabledChange = (val: boolean) => {
    setIsM10Enabled(val);
    localStorage.setItem("isM10Enabled", val ? "true" : "false");
    if (!val && activeTab === "copa") {
      setActiveTab("dashboard");
    }
  };

  const handleB10EnabledChange = (val: boolean) => {
    setIsB10Enabled(val);
    localStorage.setItem("isB10Enabled", val ? "true" : "false");
    if (!val && activeTab === "copa_b10") {
      setActiveTab("dashboard");
    }
  };

  const handleSimulatorsEnabledChange = (val: boolean) => {
    setIsSimulatorsEnabled(val);
    localStorage.setItem("isSimulatorsEnabled", val ? "true" : "false");
  };

  // Derived states from the useCartolaData hook
  const teams = data?.times || [];
  const currentRound = data?.rodadaAtual || 17;
  const syncTimestamp = lastSync || "Carregando...";
  const isSyncing = loading;
  const syncLogs = progressLog;

  // Mata-Mata parameter states
  const [cutRound, setCutRound] = useState<number>(20);

  // Theme states
  const [theme, setTheme] = useState<string>("gold");

  // Update theme colors in document element
  useEffect(() => {
    const root = document.documentElement;
    if (activeTab === "copa") {
      // Copa M10 - World Cup Theme (Azul Marinho, Branco, Prata)
      root.style.setProperty("--color-gold", "#CBD5E1"); // Silver Prata
      root.style.setProperty("--color-gold-glow", "rgba(203, 213, 225, 0.18)");
      root.style.setProperty("--color-charcoal-dark", "#051124"); // Azul Marinho
      root.style.setProperty("--color-charcoal-card", "rgba(10, 25, 48, 0.65)");
      document.body.style.background = "linear-gradient(135deg, #051124 0%, #0d2140 100%)";
    } else if (activeTab === "copa_b10") {
      // Copa B10 - Elite Brasil Theme (Dark Charcoal, Rich Gold, sutil Verde Esmeralda)
      root.style.setProperty("--color-gold", "#D4AF37"); // Rich Gold
      root.style.setProperty("--color-gold-glow", "rgba(212, 175, 55, 0.25)");
      root.style.setProperty("--color-charcoal-dark", "#0f0f10"); // Charcoal
      root.style.setProperty("--color-charcoal-card", "rgba(18, 18, 20, 0.7)");
      document.body.style.background = "linear-gradient(110deg, #0c0c0d 0%, #17171a 100%)";
    } else {
      // Restore standard body styling
      document.body.style.background = "linear-gradient(135deg, #0b1a3a 0%, #0d1f40 100%)";
      
      if (theme === "emerald") {
        root.style.setProperty("--color-gold", "#10B981");
        root.style.setProperty("--color-gold-glow", "rgba(16, 185, 129, 0.25)");
      } else if (theme === "ruby") {
        root.style.setProperty("--color-gold", "#EF4444");
        root.style.setProperty("--color-gold-glow", "rgba(239, 68, 68, 0.25)");
      } else if (theme === "neon") {
        root.style.setProperty("--color-gold", "#D946EF");
        root.style.setProperty("--color-gold-glow", "rgba(217, 70, 239, 0.25)");
      } else {
        // Vibrant Orange (Season 2026 Base)
        root.style.setProperty("--color-gold", "#ff6b35");
        root.style.setProperty("--color-gold-glow", "rgba(255, 107, 53, 0.25)");
      }
    }
  }, [theme, activeTab]);

  // Execute ETL sync via hook
  const handleTriggerSync = async () => {
    await sync();
  };

  return (
    <div className="min-h-screen bg-charcoal-dark font-sans text-slate-100 flex flex-col justify-between selection:bg-gold selection:text-charcoal-dark relative pb-12 overflow-x-hidden">
      {/* Background soccer tactical grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="soccer-field-texture" />
      </div>

      {/* Background visual details */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/8 via-transparent to-transparent z-0" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-gold/3 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Primary header & Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRound={currentRound} 
        isM10Enabled={isM10Enabled}
        isB10Enabled={isB10Enabled}
      />

      {/* Main workspace frame */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-5 py-6 sm:py-8 flex-grow">
        
        {/* Syncing Overlay Loader */}
        {isSyncing && teams.length === 0 && (
          <div className="p-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-gold animate-spin mx-auto" />
            <p className="font-display font-extrabold text-sm uppercase text-slate-400">Sincronizando dados via ETL do Cartola FC...</p>
          </div>
        )}

        {/* Tab content renders */}
        {(!isSyncing || teams.length > 0) && (
          <>
            {activeTab === "dashboard" && (
              <Dashboard 
                teams={teams} 
                currentRound={currentRound} 
                syncTimestamp={syncTimestamp} 
              />
            )}

            {activeTab === "rodada" && (
              <Destaques 
                teams={teams} 
                currentRound={currentRound} 
              />
            )}

            {activeTab === "mensal" && (
              <Mensal 
                teams={teams} 
                currentRound={currentRound} 
              />
            )}

            {(activeTab === "copa" || activeTab === "copa_b10") && (
              <div className="space-y-6">
                <CompetitionSelector
                  activeTab={activeTab === "copa" ? "copa" : "copa_b10"}
                  onSelect={(tab) => setActiveTab(tab)}
                />
                
                {activeTab === "copa" && (
                  <MataMata 
                    teams={teams} 
                    currentRound={currentRound} 
                    cutRound={cutRound} 
                    isSimulatorsEnabled={isSimulatorsEnabled}
                  />
                )}

                {activeTab === "copa_b10" && (
                  <CopaB10 
                    teams={teams}
                    currentRound={currentRound}
                    isSimulatorsEnabled={isSimulatorsEnabled}
                  />
                )}
              </div>
            )}

            {activeTab === "calendario" && (
              <div className="space-y-6">
                <TournamentCalendarView currentRound={currentRound} />
              </div>
            )}

            {activeTab === "regras" && (
              <RulesBook />
            )}

            {activeTab === "admin" && (
              <Admin
                currentRound={currentRound}
                syncTimestamp={syncTimestamp}
                source={source}
                isSyncing={isSyncing}
                onSyncTrigger={handleTriggerSync}
                syncLogs={syncLogs}
                cutRound={cutRound}
                onCutRoundChange={setCutRound}
                theme={theme}
                onThemeChange={setTheme}
                teams={teams}
                allSyncedScores={data?.allSyncedScores}
                isM10Enabled={isM10Enabled}
                onM10EnabledChange={handleM10EnabledChange}
                isB10Enabled={isB10Enabled}
                onB10EnabledChange={handleB10EnabledChange}
                isSimulatorsEnabled={isSimulatorsEnabled}
                onSimulatorsEnabledChange={handleSimulatorsEnabledChange}
              />
            )}

          </>
        )}
      </main>

      {/* Footer credits block */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-5 pt-8 pb-4 text-center border-t border-gold/10 text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          &copy; 2026 SÓ CAMISA 10 - TODOS OS DIREITOS RESERVADOS.
        </div>
        <div className="flex gap-4">
          <span className="font-bold text-gold">COMPETIÇÕES ATIVAS: 5</span>
          <span>RODADA DE ANÁLISE: {currentRound}</span>
          <span>VERSÃO: MVP.PRO</span>
        </div>
      </footer>
    </div>
  );
}
