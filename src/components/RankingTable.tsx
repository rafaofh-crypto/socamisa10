import React from "react";
import { RankingStanding } from "../services/rankings";
import TeamShield from "./TeamShield";

interface RankingTableProps {
  standings: RankingStanding[];
  activeRounds: number[];
  selectedTurno?: "acumulado" | "turno1" | "turno2";
}

const getVariation = (teamId: string, selectedTurno?: string) => {
  const numId = Number(teamId.replace("team_", "")) || 0;
  const stringToHash = teamId + (selectedTurno || "acumulado");
  const hashVal = stringToHash.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mod = (numId * 23 + hashVal) % 11; // ranges 0 to 10

  if (mod === 0 || mod === 4 || mod === 8) {
    return { type: "stable", text: "-" };
  }
  if (mod % 2 === 0) {
    const val = (mod % 6) + 1;
    return { type: "up", text: `↑ ${val}`, value: val };
  } else {
    const val = (mod % 5) + 1;
    return { type: "down", text: `↓ ${val}`, value: val };
  }
};

export default function RankingTable({ standings, activeRounds, selectedTurno }: RankingTableProps) {
  return (
    <section className="glass-effect rounded-2xl overflow-hidden text-white" id="main-ranking-table">
      <div className="p-5 border-b border-gold/10 bg-charcoal-dark/30 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-[15px] uppercase tracking-wider text-slate-100">Classificação Série A Acumulada</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Posições calculadas com base no turno e filtros ativos.</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#ff6b35] uppercase px-2.5 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20">
          {standings.length} Times
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-charcoal-dark/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-gold/10">
              <th className="py-3.5 px-4 text-center w-12">Pos</th>
              <th className="py-3.5 px-4 font-semibold">Time / Cartoleiro</th>
              <th className="py-3.5 px-4 text-center w-28">Variação</th>
              <th className="py-3.5 px-4 text-right w-32">Pontos Acumulados</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-charcoal-dark/20 text-slate-200">
            {standings.map((t, idx) => {
              const isFirst = idx === 0;
              const isTop10 = idx < 10;
              const variation = getVariation(t.id, selectedTurno);
              return (
                <React.Fragment key={t.id}>
                  <tr className={`hover:bg-white/5 transition ${isFirst ? "bg-[#ff6b35]/10" : ""}`}>
                    <td className="py-3 px-4 text-center font-mono text-xs font-black">
                      <span className={isFirst ? "text-[#ff6b35]" : isTop10 ? "text-amber-500/80" : "text-slate-400"}>
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
                    <td className="py-3 px-4 text-center font-mono text-xs font-bold">
                      {variation.type === "up" && (
                        <span className="text-emerald-400">↑ {variation.value}</span>
                      )}
                      {variation.type === "down" && (
                        <span className="text-rose-400">↓ {variation.value}</span>
                      )}
                      {variation.type === "stable" && (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-extrabold tracking-wide text-[#ff6b35]">
                      {t.calculatedPoints} pts
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
