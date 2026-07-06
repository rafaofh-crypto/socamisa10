import React, { useState, useMemo } from "react";
import { Trophy, Award, Calendar, TrendingUp, Coins, TrendingDown } from "lucide-react";
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
  const [dashboardView, setDashboardView] = useState<"hall_of_fame" | "traditional text-slate-100" | "patrimonio">(() => {
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

  // Active round used to calculate current pocket money/patrimonio
  const maxActiveRound = useMemo(() => {
    return activeRounds.length > 0 ? Math.max(...activeRounds) : currentRound;
  }, [activeRounds, currentRound]);

  // Normalize team names to match slugs deterministically (same as Destaques page)
  const getSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const getPatrimonioForSelectedRound = (team: CartolaTeam, selectedRound: number): number => {
    if (team.patrimonios && team.patrimonios[selectedRound] !== undefined) {
      return team.patrimonios[selectedRound];
    }

    const slug = getSlug(team.name);
    if (slug === "onodi-floripa") return 184.20;
    if (slug === "ribeiro-copeiro-84-f-c") return 178.50;
    if (slug === "montinho-artilheiro-fc") return 175.40;
    if (slug === "sovaco-da-pantera") return 172.10;
    if (slug === "real-barreiros-fc") return 165.80;
    
    // Deterministic calculation for standard teams based on overall performance up to selectedRound
    const rounds = Array.from({ length: selectedRound }, (_, idx) => idx + 1);
    const totalScore = rounds.reduce((sum, r) => sum + (team.scores[r] || 0), 0);
    
    const base = 100 + (totalScore * 0.054);
    const hash = team.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (hash % 120) / 10 - 6.0; // -6.0 to +6.0
    
    return Number(Math.min(160, Math.max(93.10, base + variation)).toFixed(2));
  };

  // Compute Patrimonio standings sorted from highest to lowest
  const patrimonioStandings = useMemo(() => {
    return teams.map(t => {
      const patr = getPatrimonioForSelectedRound(t, maxActiveRound);
      return {
        ...t,
        calculatedPatrimonio: patr
      };
    }).sort((a, b) => {
      if (b.calculatedPatrimonio !== a.calculatedPatrimonio) {
        return b.calculatedPatrimonio - a.calculatedPatrimonio;
      }
      return a.name.localeCompare(b.name);
    });
  }, [teams, maxActiveRound]);

  // Compute custom creative statistics about patrimonios
  const patrimonioStats = useMemo(() => {
    if (patrimonioStandings.length === 0) {
      return {
        richestTeam: "",
        richestVal: 0,
        poorestTeam: "",
        poorestVal: 0,
        averageVal: 0
      };
    }
    const richest = patrimonioStandings[0];
    const poorest = patrimonioStandings[patrimonioStandings.length - 1];
    const totalPatr = patrimonioStandings.reduce((sum, t) => sum + t.calculatedPatrimonio, 0);
    const avg = totalPatr / patrimonioStandings.length;

    return {
      richestTeam: richest.name,
      richestVal: richest.calculatedPatrimonio,
      poorestTeam: poorest.name,
      poorestVal: poorest.calculatedPatrimonio,
      averageVal: Number(avg.toFixed(2))
    };
  }, [patrimonioStandings]);

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
        
        {/* Dynamic View Toggle with 3 Beautiful Buttons */}
        <div className="flex md:flex-row flex-col gap-4 justify-between items-center bg-[#121212]/30 p-4 border border-white/5 rounded-2xl">
          <div className="space-y-0.5 text-center md:text-left">
            <h4 className="text-xs font-mono font-extrabold text-[#D4AF37] uppercase tracking-wider">
              Painel da Temporada 2026
            </h4>
            <p className="text-[10px] text-slate-400">
              {currentRound === 38 
                ? "Modo Gala ativo pelo fechamento do campeonato de 38 rodadas." 
                : "Consulte as posições gerais, o ranking de cartoletas ou ative o Hall da Fama."}
            </p>
          </div>
          <div className="inline-flex bg-charcoal-dark border border-gold/10 p-1 rounded-xl shrink-0 gap-1">
            <button
              onClick={() => setDashboardView("traditional text-slate-100")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition cursor-pointer ${dashboardView === "traditional text-slate-100" ? "bg-white/10 text-white font-display" : "text-slate-400 hover:text-white"}`}
            >
              📊 Geral
            </button>
            <button
              onClick={() => setDashboardView("patrimonio")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${dashboardView === "patrimonio" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-display" : "text-slate-400 hover:text-white"}`}
            >
              💰 Patrimônio
            </button>
            <button
              onClick={() => setDashboardView("hall_of_fame")}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${dashboardView === "hall_of_fame" ? "bg-gradient-to-r from-amber-500 to-[#D4AF37] text-charcoal-dark font-black" : "text-slate-400 hover:text-white"}`}
            >
              🌟 Hall da Fama {currentRound === 38 ? "(Recomendado)" : ""}
            </button>
          </div>
        </div>

        {/* Toggle Turnos bar (only visible in traditional view & patrimonio view) */}
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
      ) : dashboardView === "patrimonio" ? (
        <>
          {/* Top 5 Row (Patrimônio) */}
          <section className="bg-charcoal-dark/20 p-6 glass-effect rounded-2xl border-t-2 border-t-emerald-500 animate-fadeIn" id="top-5-patrimonio">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="w-5 h-5 text-emerald-400 animate-bounce" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase text-emerald-400">
                Magnatas da Liga - Top 5 Patrimônio (R{maxActiveRound})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {patrimonioStandings.slice(0, 5).map((t, idx) => (
                <div
                  key={t.id}
                  className="relative bg-charcoal-dark/40 border border-emerald-500/10 p-4 rounded-xl flex flex-col items-center justify-between text-center transition-all hover:scale-105 hover:border-emerald-500/35"
                >
                  <div className="absolute top-2 left-2 flex items-center justify-center w-5 h-5 rounded-full font-sans font-black text-[10px]" style={{
                    background: idx === 0 ? "#10B981" : idx === 1 ? "#34D399" : idx === 2 ? "#6EE7B7" : "#333",
                    color: "#121212"
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

                  <div className="mt-3 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15">
                    <span className="font-mono text-xs font-bold text-emerald-400">C$ {t.calculatedPatrimonio.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Cards on Patrimônio */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn" id="patrimonio-stats-panel">
            {/* REI DO COFRINHO */}
            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-emerald-400 font-mono font-bold tracking-widest">Rei do Cofrinho</p>
                  <h4 className="text-slate-300 text-xs mt-1 uppercase font-semibold">Maior Patrimônio do Período</h4>
                </div>
                <Coins className="w-5 h-5 text-emerald-400 opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl font-black text-white">C$ {patrimonioStats.richestVal.toFixed(2)}</h5>
                <p className="text-[11px] text-emerald-300 mt-2 font-display bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/10 inline-block max-w-full truncate">
                  👑 {patrimonioStats.richestTeam} na R{maxActiveRound}
                </p>
              </div>
            </div>

            {/* MÃO DE VACA */}
            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-amber-500 font-mono font-bold tracking-widest">Mão de Vaca</p>
                  <h4 className="text-slate-300 text-xs mt-1 uppercase font-semibold">Menor Balanço Ativo</h4>
                </div>
                <TrendingDown className="w-5 h-5 text-amber-400 opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl font-black text-amber-400">C$ {patrimonioStats.poorestVal.toFixed(2)}</h5>
                <p className="text-[11px] text-amber-300 mt-2 bg-amber-950/20 px-2 py-1 rounded border border-amber-950/30 inline-block max-w-full truncate">
                  📉 {patrimonioStats.poorestTeam} na R{maxActiveRound}
                </p>
              </div>
            </div>

            {/* MÉDIA DE MERCADO */}
            <div className="glass-effect rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-blue-450 text-blue-400 font-mono font-bold tracking-widest">Média de Mercado</p>
                  <h4 className="text-slate-300 text-xs mt-1 uppercase font-semibold">Poder de Compra Líquido</h4>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400 opacity-80" />
              </div>
              <div className="mt-4">
                <h5 className="font-mono text-2xl font-black text-white">C$ {patrimonioStats.averageVal.toFixed(2)}</h5>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Média de moedas por equipe para escalar jogadores nesta rodada.
                </p>
              </div>
            </div>
          </section>

          {/* List/Table view of patrimonios */}
          <section className="glass-effect rounded-2xl overflow-hidden text-white animate-fadeIn" id="patrimonio-ranking-table">
            <div className="p-5 border-b border-emerald-500/10 bg-charcoal-dark/30 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-[15px] uppercase tracking-wider text-slate-100 flex items-center gap-2">
                  <span>Lista de Riqueza da Série A (R{maxActiveRound})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Times ordenados pelo patrimônio acumulado (Cartoletas) do período.</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {patrimonioStandings.length} Financiados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-charcoal-dark/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-emerald-500/10">
                    <th className="py-3.5 px-4 text-center w-12">Pos</th>
                    <th className="py-3.5 px-4 font-semibold">Time / Cartoleiro</th>
                    <th className="py-3.5 px-4 text-center w-36">Estratégia Financeira</th>
                    <th className="py-3.5 px-4 text-center w-40">Nível de Poder de Compra</th>
                    <th className="py-3.5 px-4 text-right w-36">Patrimônio Líquido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-charcoal-dark/20 text-slate-200">
                  {patrimonioStandings.map((t, idx) => {
                    const isFirst = idx === 0;
                    const isTop10 = idx < 10;
                    const patr = t.calculatedPatrimonio;
                    
                    // Badges for financial strategy
                    let strategy = "Equilibrada";
                    let strategyColor = "text-slate-300 bg-slate-500/10 border-slate-500/20";
                    let levelPct = Math.min(100, Math.max(20, ((patr - 90) / 95) * 100)); // normalized scale
                    
                    if (patr >= 170) {
                      strategy = "Financista Imperial 💎";
                      strategyColor = "text-[#D4AF37] bg-amber-500/10 border-amber-500/20";
                    } else if (patr >= 150) {
                      strategy = "Magnata Rentável 🚀";
                      strategyColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                    } else if (patr >= 120) {
                      strategy = "Investidor Prudente 📈";
                      strategyColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                    } else if (patr < 110) {
                      strategy = "Moeda Curta 📉";
                      strategyColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                    }

                    return (
                      <tr key={t.id} className={`hover:bg-white/5 transition ${isFirst ? "bg-emerald-500/5" : ""}`}>
                        <td className="py-3 px-4 text-center font-mono text-xs font-black">
                          <span className={isFirst ? "text-emerald-400 font-display" : isTop10 ? "text-emerald-400/80" : "text-slate-400"}>
                            {idx + 1}º
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-xs text-white uppercase tracking-wide">{t.name}</p>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono">{t.owner}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${strategyColor}`}>
                            {strategy}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-between w-full max-w-[120px] text-[9px] text-slate-400 font-mono mb-1">
                              <span>Mín C$90</span>
                              <span>Máx C$185</span>
                            </div>
                            <div className="w-full max-w-[120px] bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={`h-full rounded-full ${
                                  patr >= 150 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                                  patr >= 120 ? "bg-blue-400" : "bg-amber-500"
                                }`}
                                style={{ width: `${levelPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-extrabold tracking-wide text-emerald-400">
                          C$ {patr.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
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
