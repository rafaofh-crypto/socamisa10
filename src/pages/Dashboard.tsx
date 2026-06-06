import React, { useState, useMemo } from "react";
import { Trophy, Award, Calendar, TrendingUp } from "lucide-react";
import { CartolaTeam } from "../services/cartollaApi";
import { getActiveRounds, calculateStandings, calculateStats } from "../services/rankings";
import SyncStatus from "../components/SyncStatus";
import RankingTable from "../components/RankingTable";
import TeamShield from "../components/TeamShield";
import DashboardSocialCard from "../components/DashboardSocialCard";
import HallDaFama from "../components/HallDaFama";

interface DashboardProps {
  teams: CartolaTeam[];
  currentRound: number;
  syncTimestamp: string;
}

export default function Dashboard({
  teams,
  currentRound,
  syncTimestamp
}: DashboardProps) {
  const [selectedTurno, setSelectedTurno] = useState<"acumulado" | "turno1" | "turno2">("acumulado");

  // Show Hall-of-Fame component as default view if current analyzed round is R38 (Modo Gala)
  const [dashboardView, setDashboardView] = useState<"hall_of_fame" | "traditional text-slate-100">(() => {
    return currentRound === 38 ? "hall_of_fame" : "traditional text-slate-100";
  });

  // Calculate rounds based on selected filter
  const activeRounds = useMemo(() => {
    return getActiveRounds(currentRound, selectedTurno);
  }, [selectedTurno, currentRound]);

  // Calculate scores for each team based on active rounds using the central ranking service
  const standings = useMemo(() => {
    return calculateStandings(teams, activeRounds);
  }, [teams, activeRounds]);

  // Calculate stats using the central ranking service
  const stats = useMemo(() => {
    return calculateStats(teams, activeRounds);
  }, [teams, activeRounds]);

  const top5 = standings.slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      {/* Sinc Status Section */}
      <div className="space-y-4">
        <SyncStatus 
          currentRound={currentRound} 
          syncTimestamp={syncTimestamp} 
          source={teams.length > 0 && teams[0].id === "team_1" ? "FALLBACK" : "API" /* robust detection */} 
          isSyncing={false} 
        />
        
        {/* Dynamic View Toggle (especially for R38 Gala mode) */}
        <div className="flex md:flex-row flex-col gap-4 justify-between items-center bg-[#121212]/30 p-4 border border-white/5 rounded-2xl">
          <div className="space-y-0.5 text-center md:text-left">
            <h4 className="text-xs font-mono font-extrabold text-[#D4AF37] uppercase tracking-wider">
              Painel da Temporada 2026
            </h4>
            <p className="text-[10px] text-slate-400">
              {currentRound === 38 
                ? "Modo Gala ativo pelo fechamento do campeonato de 38 rodadas." 
                : "Consulte as classificações gerais acumuladas ou ative o Hall da Fama."}
            </p>
          </div>
          <div className="inline-flex bg-charcoal-dark border border-gold/10 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setDashboardView("traditional text-slate-100")}
              className={`px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition cursor-pointer ${dashboardView !== "hall_of_fame" ? "bg-white/10 text-white font-display" : "text-slate-400 hover:text-white"}`}
            >
              📊 Classificação Geral
            </button>
            <button
              onClick={() => setDashboardView("hall_of_fame")}
              className={`px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${dashboardView === "hall_of_fame" ? "bg-gradient-to-r from-amber-500 to-[#D4AF37] text-charcoal-dark font-black" : "text-slate-400 hover:text-white"}`}
            >
              🌟 Hall da Fama {currentRound === 38 ? "(Recomendado)" : ""}
            </button>
          </div>
        </div>

        {/* Toggle Turnos bar (only visible in traditional view) */}
        {dashboardView !== "hall_of_fame" && (
          <div className="flex justify-end animate-fadeIn">
            <div className="inline-flex bg-charcoal-dark border border-gold/10 p-1 rounded-xl">
              <button
                onClick={() => setSelectedTurno("acumulado")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${selectedTurno === "acumulado" ? "bg-gold text-charcoal-dark font-display" : "text-slate-400 hover:text-white"}`}
              >
                Acumulado (38R)
              </button>
              <button
                onClick={() => setSelectedTurno("turno1")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${selectedTurno === "turno1" ? "bg-gold text-charcoal-dark font-display" : "text-slate-400 hover:text-white"}`}
              >
                1º Turno (1-19)
              </button>
              <button
                onClick={() => setSelectedTurno("turno2")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${selectedTurno === "turno2" ? "bg-gold text-charcoal-dark font-display" : "text-slate-400 hover:text-white"}`}
              >
                2º Turno (20-38)
              </button>
            </div>
          </div>
        )}
      </div>

      {dashboardView === "hall_of_fame" ? (
        <HallDaFama teams={teams} currentRound={currentRound} />
      ) : (
        <>
          {/* Top 5 Row */}
          <section className="bg-charcoal-dark/20 p-6 glass-effect rounded-2xl border-t-2 border-t-gold animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-gold" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase">Elite Só Camisa 10 - Top 5 Liderança</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {top5.map((t, idx) => (
                <div
                  key={t.id}
                  className="relative bg-charcoal-dark/40 border border-gold/10 p-4 rounded-xl flex flex-col items-center justify-between text-center transition-all hover:scale-105 hover:border-gold/35"
                >
                  <div className="absolute top-2 left-2 flex items-center justify-center w-5 h-5 rounded-full font-sans font-black text-[10px]" style={{
                    background: idx === 0 ? "#D4AF37" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "#333",
                    color: idx < 3 ? "#121212" : "#999"
                  }}>
                    {idx + 1}º
                  </div>
                  
                  <div className="w-14 h-14 my-2 flex items-center justify-center overflow-hidden">
                    <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                  </div>
                  
                  <div className="mt-2">
                    <p className="font-display font-bold text-[13px] tracking-wide text-white line-clamp-1">{t.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{t.owner}</p>
                  </div>

                  <div className="mt-3 bg-gold/10 px-3 py-1 rounded-full border border-gold/15">
                    <span className="font-mono text-xs font-bold text-gold">{t.calculatedPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-gold font-mono font-bold tracking-widest">Melhor Desempenho</p>
                  <h4 className="text-slate-350 text-xs mt-1 uppercase font-semibold">Melhor Rodada Histórica</h4>
                </div>
                <Award className="w-5 h-5 text-gold opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl font-black text-white">{stats.bestScore} pts</h5>
                <p className="text-[11px] text-slate-300 mt-2 font-display bg-gold/10 px-2 py-1 rounded border border-gold/10 inline-block max-w-full truncate">
                  🚀 {stats.bestTeam} na Rodada {stats.bestRound}
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-red-500 font-mono font-bold tracking-widest">Lanterna de Gesso</p>
                  <h4 className="text-slate-355 text-xs mt-1 uppercase font-semibold">Menor Rodada Ativa</h4>
                </div>
                <Calendar className="w-5 h-5 text-red-400 opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl text-red-400">{stats.worstScore} pts</h5>
                <p className="text-[11px] text-slate-400 mt-2 bg-red-950/20 px-2 py-1 rounded border border-red-950/30 inline-block max-w-full truncate">
                  📉 {stats.worstTeam} na R{stats.worstRound}
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-gold font-mono font-bold tracking-widest">Média Geral</p>
                  <h4 className="text-slate-400 text-xs mt-1 uppercase font-semibold">Média Geral por Rodada</h4>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400 opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl font-black text-white">{stats.average} pts</h5>
                <p className="text-[11px] text-slate-450 mt-2 font-mono">
                  Calculada com base em todas as rodadas analisadas.
                </p>
              </div>
            </div>
          </section>

          {/* Complete Leaderboard & Dynamic Share Exporter */}
          <div className="space-y-8 animate-fadeIn">
            <div className="w-full">
              <DashboardSocialCard 
                turnoType={selectedTurno} 
                currentRound={currentRound}
                standings={standings.map(s => ({
                  id: s.id,
                  name: s.name,
                  owner: s.owner,
                  shieldUrl: s.shieldUrl || "",
                  calculatedPoints: s.calculatedPoints
                }))} 
              />
            </div>
            <div className="w-full">
              <RankingTable standings={standings} activeRounds={activeRounds} selectedTurno={selectedTurno} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
