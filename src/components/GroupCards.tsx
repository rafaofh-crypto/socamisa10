import React from "react";
import { Team } from "../types";
import { getBestThirdPlaced } from "../tournamentData";
import TeamShield from "./TeamShield";

interface GroupCardsProps {
  groups: Record<string, Team[]>;
  isAwaitingRound20?: boolean;
}

export default function GroupCards({ groups, isAwaitingRound20 = false }: GroupCardsProps) {
  const letters = Object.keys(groups).sort();

  if (letters.length === 0) {
    return (
      <div className="p-8 text-center bg-charcoal-dark/40 border border-gold/10 rounded-2xl text-slate-400">
        Nenhum grupo gerado ainda. Avance na Rodada de Corte para criar os grupos.
      </div>
    );
  }

  // Gather all teams across all groups to determine the 8 best 3rd placed teams
  const allTeams: Team[] = [];
  Object.values(groups).forEach((g) => allTeams.push(...g));

  const bestThirds = allTeams.length > 0 ? getBestThirdPlaced(allTeams) : [];
  const bestThirdsNamesSet = new Set(bestThirds.map((t) => t.name));

  return (
    <div className="space-y-6" id="group-phase-container">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-charcoal-dark/30 border border-white/5 p-3.5 rounded-xl text-xs font-mono">
        <span className="text-slate-400 font-bold uppercase tracking-wider">Legenda de Classificação:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-green-500/15 border border-green-500/30 inline-block"></span>
          <span className="text-green-300">Classificação Direta (1º e 2º)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500/15 border border-amber-500/30 inline-block"></span>
          <span className="text-amber-300">Melhores 3º Colocados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-white/5 border border-white/10 inline-block"></span>
          <span className="text-slate-400">Eliminados</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-white" id="group-phase-grid-tables">
        {letters.map((letter) => {
          const groupTeams = groups[letter] || [];
          // Sort inside group by points desc, difference desc, goalsFor desc, then position asc
          const sorted = [...groupTeams].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            return a.position - b.position;
          });

          return (
            <div
              key={letter}
              className="bg-charcoal-dark/45 border border-gold/10 rounded-2xl p-5 flex flex-col hover:border-gold/30 transition-all shadow-lg text-xs"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gold/15 pb-2.5 mb-4 select-none">
                <span className="font-display font-black text-sm text-gold tracking-widest uppercase">
                  Grupo {letter} - Copa 2026
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-black/30 border border-white/5 px-2 py-0.5 rounded uppercase">
                  Grupo de 4 Times
                </span>
              </div>

              {/* Table conforming to exact Cartola-like style */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[9.5px] uppercase tracking-wider text-slate-500 font-mono">
                      <th className="py-2.5 px-1 text-center w-6 select-none">#</th>
                      <th className="py-2.5 px-1 text-center w-10 select-none">Escudo</th>
                      <th className="py-2.5 px-2 text-left">Time</th>
                      <th className="py-2.5 px-2 text-right w-16">R1 (Gr)</th>
                      <th className="py-2.5 px-2 text-right w-16">R2 (Gr)</th>
                      <th className="py-2.5 px-2 text-right w-16">R3 (Gr)</th>
                      <th className="py-2.5 px-3 text-right w-20 text-gold font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {sorted.map((t, index) => {
                      const isTopTwo = index < 2;
                      const isThird = index === 2;
                      const isAdvancedThird = isThird && bestThirdsNamesSet.has(t.name);

                      const isVaga47 = t.qualifyingPosition === 47;
                      const isVaga48 = t.qualifyingPosition === 48;
                      const isRealTeam = Boolean(t.name && !t.name.startsWith("Aguardando") && t.name !== "Vaga 47" && t.name !== "Vaga 48");
                      const isPendingEsperneioSlot = (isVaga47 || isVaga48) && !isRealTeam;
                      const displayName = isPendingEsperneioSlot ? (isVaga47 ? "Vaga 47" : "Vaga 48") : t.name;

                      // Style rows based on classification status
                      const rowClass = isAwaitingRound20
                        ? "text-slate-400 opacity-80 border-l-2 border-l-transparent"
                        : (isTopTwo
                          ? "bg-green-500/10 text-green-300 border-l-2 border-l-green-500 font-semibold"
                          : isAdvancedThird
                          ? "bg-yellow-500/10 text-yellow-300 border-l-2 border-l-yellow-500 font-semibold"
                          : isThird
                          ? "bg-[#3A3A3A] text-slate-500 opacity-60 border-l-2 border-l-stone-600"
                          : "text-slate-500 opacity-50 border-l-2 border-l-transparent");

                      const r1Str = typeof t.groupRound1 === "number" && t.groupRound1 > 0 ? t.groupRound1.toFixed(2) : "-";
                      const r2Str = typeof t.groupRound2 === "number" && t.groupRound2 > 0 ? t.groupRound2.toFixed(2) : "-";
                      const r3Str = typeof t.groupRound3 === "number" && t.groupRound3 > 0 ? t.groupRound3.toFixed(2) : "-";
                      const scoreStr = t.points > 0 ? t.points.toFixed(2) : "0.00";

                      // Helper to calculate rank in previous phase to compare
                      const getRankVariation = () => {
                        const hasR1 = groupTeams.some(x => typeof x.groupRound1 === "number" && x.groupRound1 > 0);
                        const hasR2 = groupTeams.some(x => typeof x.groupRound2 === "number" && x.groupRound2 > 0);
                        const hasR3 = groupTeams.some(x => typeof x.groupRound3 === "number" && x.groupRound3 > 0);

                        if (!hasR1) return 0;

                        if (hasR3) {
                          // Compare status at R2 (r1 + r2) vs status at R3 (r1 + r2 + r3)
                          const r2Sorted = [...groupTeams].sort((a, b) => {
                            const pointsA = (a.groupRound1 || 0) + (a.groupRound2 || 0);
                            const pointsB = (b.groupRound1 || 0) + (b.groupRound2 || 0);
                            if (pointsB !== pointsA) return pointsB - pointsA;
                            return a.originalIndex - b.originalIndex;
                          });
                          const r3Sorted = [...groupTeams].sort((a, b) => {
                            const pointsA = (a.groupRound1 || 0) + (a.groupRound2 || 0) + (a.groupRound3 || 0);
                            const pointsB = (b.groupRound1 || 0) + (b.groupRound2 || 0) + (b.groupRound3 || 0);
                            if (pointsB !== pointsA) return pointsB - pointsA;
                            return a.originalIndex - b.originalIndex;
                          });
                          const prevIndex = r2Sorted.findIndex(x => x.name === t.name);
                          const currIndex = r3Sorted.findIndex(x => x.name === t.name);
                          return prevIndex - currIndex; // positive means rank improved
                        } else if (hasR2) {
                          // Compare status at R1 vs status at R2
                          const r1Sorted = [...groupTeams].sort((a, b) => {
                            const pointsA = (a.groupRound1 || 0);
                            const pointsB = (b.groupRound1 || 0);
                            if (pointsB !== pointsA) return pointsB - pointsA;
                            return a.originalIndex - b.originalIndex;
                          });
                          const r2Sorted = [...groupTeams].sort((a, b) => {
                            const pointsA = (a.groupRound1 || 0) + (a.groupRound2 || 0);
                            const pointsB = (b.groupRound1 || 0) + (b.groupRound2 || 0);
                            if (pointsB !== pointsA) return pointsB - pointsA;
                            return a.originalIndex - b.originalIndex;
                          });
                          const prevIndex = r1Sorted.findIndex(x => x.name === t.name);
                          const currIndex = r2Sorted.findIndex(x => x.name === t.name);
                          return prevIndex - currIndex;
                        }
                        return 0;
                      };

                      const variation = getRankVariation();

                      return (
                        <tr
                          key={isPendingEsperneioSlot ? `esperneio_vaga_${t.qualifyingPosition}` : t.name}
                          className={`${rowClass} hover:bg-gold/5 transition-all text-[11px]`}
                        >
                          {/* Position Badge */}
                          <td className="py-2 px-1 text-center font-bold select-none text-[10px]">
                            <div className="flex flex-col items-center justify-center">
                              <span>{index + 1}º</span>
                              {!isAwaitingRound20 && variation > 0 && (
                                <span className="text-emerald-400 text-[8px] font-bold flex items-center justify-center gap-0.5 leading-none">
                                  ▲{variation}
                                </span>
                              )}
                              {!isAwaitingRound20 && variation < 0 && (
                                <span className="text-red-400 text-[8px] font-bold flex items-center justify-center gap-0.5 leading-none">
                                  ▼{Math.abs(variation)}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Render Shield SVG */}
                          <td className="py-1 px-1 text-center select-none">
                            <div className="w-7 h-7 bg-black/10 rounded-lg p-1 flex items-center justify-center mx-auto overflow-hidden">
                              {isPendingEsperneioSlot ? (
                                <span className="font-mono text-[9.5px] font-black text-[#c5a880] bg-[#c5a880]/15 px-1 py-0.5 rounded border border-[#c5a880]/30">
                                  {isVaga47 ? "47" : "48"}
                                </span>
                              ) : (
                                <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                              )}
                            </div>
                          </td>

                          {/* Team Name */}
                          <td className="py-2 px-2 text-left font-display font-medium text-slate-100 truncate max-w-[130px] sm:max-w-none">
                            <div className="flex flex-col">
                              <span className={`font-semibold uppercase tracking-wide truncate ${isPendingEsperneioSlot ? "text-[#c5a880] font-black" : ""}`}>
                                {displayName}
                              </span>
                              <span className="text-[8px] text-slate-400 font-mono lower-case font-light truncate">
                                {isPendingEsperneioSlot 
                                  ? "Aguardando Rod. do Esperneio" 
                                  : (t.qualifyingPosition && !isAwaitingRound20 
                                      ? ((isVaga47 || isVaga48) ? `Corte #${t.qualifyingPosition} (Esperneio)` : `Corte #${t.qualifyingPosition}`) 
                                      : "")}
                              </span>
                            </div>
                          </td>

                          {/* Round 1 (Group) */}
                          <td className="py-2 px-2 text-right text-slate-300">
                            {r1Str}
                          </td>

                          {/* Round 2 (Group) */}
                          <td className="py-2 px-2 text-right text-slate-300">
                            {r2Str}
                          </td>

                          {/* Round 3 (Group) */}
                          <td className="py-2 px-2 text-right text-slate-300">
                            {r3Str}
                          </td>

                          {/* Soma Total */}
                          <td className="py-2 px-3 text-right font-bold text-gold text-xs">
                            {scoreStr} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Card Footer status info */}
              <div className="mt-3.5 pt-2 border-t border-gold/5 flex justify-between text-[9px] text-slate-500 select-none uppercase tracking-wider font-mono">
                <span>Classificados: 1º e 2º</span>
                <span className="text-amber-500/80">Vaga por Repescagem: Top 8 Terceiros</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
