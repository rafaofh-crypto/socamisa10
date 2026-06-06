import React, { useState } from "react";
import { getTournamentCalendar } from "../tournamentData";
import { Calendar, Info, Clock, CheckCircle2, Lock, Sparkles, Award, Crown, HelpCircle } from "lucide-react";

interface TournamentCalendarViewProps {
  currentRound: number;
}

export default function TournamentCalendarView({ currentRound }: TournamentCalendarViewProps) {
  const calendarData = getTournamentCalendar(currentRound);
  const [selectedCupFilter, setSelectedCupFilter] = useState<"all" | "copaM10" | "copaB10">("all");

  const getStatusBadge = (status: "upcoming" | "active" | "completed" | "historical" | "inactive") => {
    switch (status) {
      case "historical":
        return {
          label: "Histórico",
          classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: Clock
        };
      case "completed":
        return {
          label: "Concluído",
          classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]",
          icon: CheckCircle2
        };
      case "active":
        return {
          label: "Em Andamento (Ativo)",
          classes: "bg-amber-500/15 text-amber-500 border-amber-500/30 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.15)]",
          icon: Sparkles
        };
      case "inactive":
        return {
          label: "Inativo",
          classes: "bg-charcoal-dark text-slate-500 border-white/5",
          icon: Lock
        };
      case "upcoming":
      default:
        return {
          label: "Agendado",
          classes: "bg-sky-500/5 text-sky-400 border-sky-500/15",
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-6 text-white w-full">
      {/* Header card with information details and filter options */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ff6b35]/10 via-black/40 to-black/60 border border-[#ff6b35]/25 shadow-xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff6b35]/15 flex items-center justify-center border border-[#ff6b35]/25 text-[#ff6b35]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-sm tracking-widest uppercase text-white">
              Calendário Unificado de Copas <span className="text-[#ff6b35]">M10 & B10</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Acompanhe o cronograma simultâneo integrado do Brasileirão (Rodadas 19 a 38).
          </p>
        </div>

        {/* Filter Selection Tabs */}
        <div className="inline-flex bg-black/40 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setSelectedCupFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
              selectedCupFilter === "all" ? "bg-[#ff6b35] text-charcoal-dark" : "text-slate-400 hover:text-white"
            }`}
          >
            Ver Tudo
          </button>
          <button
            onClick={() => setSelectedCupFilter("copaM10")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 ${
              selectedCupFilter === "copaM10" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-3 h-3" /> Copa M10
          </button>
          <button
            onClick={() => setSelectedCupFilter("copaB10")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 ${
              selectedCupFilter === "copaB10" ? "bg-cyan-500/20 text-cyan-350 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Crown className="w-3 h-3" /> Copa B10
          </button>
        </div>
      </div>

      {/* Visual Overlay Highlight Card for Overlapping Period: R25 - R29 */}
      <div className="p-4 bg-gradient-to-r from-purple-950/20 via-sky-950/15 to-amber-950/10 border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
              Período de Alta Voltagem: Coexistência (R25 - R29)
            </h4>
            <p className="text-[10px] text-slate-400 font-mono max-w-2xl">
              Nestas 5 rodadas de sobreposição frenética, as duas copas ocorrem em paralelo. O sistema computa as notas do Cartola de forma independente para alimentar as chaves exclusivas de cada torneio!
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded bg-[#ff6b35]/15 border border-[#ff6b35]/20 text-[10px] font-mono text-[#ff6b35] uppercase font-black tracking-wide">
          Rodada Atual: R{currentRound}
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l-2 border-white/10 ml-4 pl-6 md:pl-8 space-y-6 py-2">
        {calendarData.map((item) => {
          const isOverlapRound = item.round >= 25 && item.round <= 29;
          const isMainActiveRound = item.round === currentRound;

          // Determine if we should render this item based on the selected filter
          const showM10MatchDetails = selectedCupFilter === "all" || selectedCupFilter === "copaM10";
          const showB10MatchDetails = selectedCupFilter === "all" || selectedCupFilter === "copaB10";

          // If filtering B10 and M10 is complete/inactive and vice versa
          if (selectedCupFilter === "copaM10" && item.copaM10.phase === "Inativa") return null;
          if (selectedCupFilter === "copaB10" && item.copaB10.phase === "Inativa") return null;

          const m10Props = getStatusBadge(item.copaM10.status);
          const b10Props = getStatusBadge(item.copaB10.status);

          const M15Icon = m10Props.icon;
          const B10Icon = b10Props.icon;

          return (
            <div 
              key={item.round} 
              className={`relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                isMainActiveRound 
                  ? "bg-gradient-to-br from-[#ff6b35]/10 via-black/50 to-[#ff6b35]/5 border-[#ff6b35]/45 shadow-[0_0_15px_rgba(255,107,53,0.08)] scale-[1.01] z-10" 
                  : isOverlapRound 
                    ? "bg-black/30 border-purple-500/10 hover:border-purple-500/25" 
                    : "bg-[#121212]/35 border-white/5 hover:border-white/10"
              }`}
            >
              {/* Timeline dot marker */}
              <div className={`absolute -left-[35px] md:-left-[41px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                isMainActiveRound 
                  ? "bg-[#ff6b35] border-white ring-4 ring-[#ff6b35]/25" 
                  : isOverlapRound 
                    ? "bg-purple-600 border-[#121212]" 
                    : item.round === 19 
                      ? "bg-slate-600 border-[#121212]"
                      : "bg-charcoal-dark border-[#121212]"
              }`}>
                {isMainActiveRound && (
                  <span className="absolute w-2 h-2 rounded-full bg-white animate-ping" />
                )}
              </div>

              {/* Round indicator & general Event */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                    isMainActiveRound ? "bg-[#ff6b35] text-charcoal-dark" : "bg-white/10 text-slate-200"
                  }`}>
                    RODADA {item.round}
                  </span>
                  {item.generalEvent && (
                    <span className="text-[10px] font-black text-[#ff6b35] uppercase font-mono tracking-wider">
                      ✨ {item.generalEvent}
                    </span>
                  )}
                  {isOverlapRound && selectedCupFilter === "all" && (
                    <span className="text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest">
                      SOBREPOSIÇÃO
                    </span>
                  )}
                </div>
                {item.round === 19 && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 border border-slate-500/10 rounded uppercase">
                    Preservado Histórico do 1º Turno
                  </span>
                )}
              </div>

              {/* Grid content for the cups */}
              <div className={`grid grid-cols-1 ${selectedCupFilter === "all" ? "md:grid-cols-2" : "grid-cols-1"} gap-4 mt-1`}>
                {/* COPA M10 COLUMN */}
                {showM10MatchDetails && (
                  <div className={`space-y-2 p-3 rounded-xl ${
                    item.copaM10.status === "active" 
                      ? "bg-amber-500/5 border border-amber-500/15" 
                      : item.copaM10.status === "inactive" 
                        ? "opacity-40" 
                        : "bg-black/10 border border-transparent"
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-display font-bold text-xs uppercase text-amber-200">Copa M10 (Mundo)</span>
                      </div>
                      
                      {/* Dynamic phase status */}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-1 border uppercase ${m10Props.classes}`}>
                        <M15Icon className="w-2.5 h-2.5" />
                        {m10Props.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-extra bold text-white font-mono uppercase">{item.copaM10.phase}</p>
                      <p className="text-[10px] text-slate-350 leading-relaxed">{item.copaM10.description}</p>
                      {item.copaM10.rules && (
                        <div className="text-[9px] text-slate-400 bg-black/40 p-1.5 rounded border border-white/5 font-mono leading-normal">
                          <span className="text-amber-500 font-bold uppercase">Regra:</span> {item.copaM10.rules}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* COPA B10 COLUMN */}
                {showB10MatchDetails && (
                  <div className={`space-y-2 p-3 rounded-xl ${
                    item.copaB10.status === "active" 
                      ? "bg-cyan-500/5 border border-cyan-500/15" 
                      : item.copaB10.status === "inactive" 
                        ? "opacity-40" 
                        : "bg-black/10 border border-transparent"
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-display font-bold text-xs uppercase text-cyan-200">Copa B10 (Brasil)</span>
                      </div>

                      {/* Dynamic phase status */}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-1 border uppercase ${b10Props.classes}`}>
                        <B10Icon className="w-2.5 h-2.5" />
                        {b10Props.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-extra bold text-white font-mono uppercase">{item.copaB10.phase}</p>
                      <p className="text-[10px] text-slate-350 leading-relaxed">{item.copaB10.description}</p>
                      {item.copaB10.rules && (
                        <div className="text-[9px] text-slate-400 bg-black/40 p-1.5 rounded border border-white/5 font-mono leading-normal">
                          <span className="text-cyan-400 font-bold uppercase">Regra:</span> {item.copaB10.rules}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
