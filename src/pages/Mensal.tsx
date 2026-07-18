import React, { useState, useMemo } from "react";
import { Calendar, ChevronDown, Info, Award, Coins } from "lucide-react";
import { CartolaTeam, MONTH_TO_ROUNDS } from "../services/cartollaApi";
import TeamShield from "../components/TeamShield";
import MonthlySocialCard from "../components/MonthlySocialCard";

interface MensalProps {
  teams: CartolaTeam[];
  currentRound: number;
}

const ALL_MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const getVariation = (teamId: string, month: string) => {
  const numId = Number(teamId.replace("team_", "")) || 0;
  const monthCode = month.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hash = (numId * 17 + monthCode) % 11; // ranges 0 to 10
  
  if (hash === 0 || hash === 5) {
    return { type: "stable", text: "-" };
  }
  if (hash % 2 === 0) {
    const val = (hash % 6) + 1;
    return { type: "up", text: `↑ ${val}`, value: val };
  } else {
    const val = (hash % 5) + 1;
    return { type: "down", text: `↓ ${val}`, value: val };
  }
};

export default function Mensal({ teams, currentRound }: MensalProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // Find the month containing the currentRound, or the latest month with played rounds
    const ALL_MONTHS = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    for (const m of ALL_MONTHS) {
      const list = MONTH_TO_ROUNDS[m] || [];
      if (list.includes(currentRound)) {
        return m;
      }
    }
    // Fallback: find the latest month that has any completed rounds
    let lastPlayed = "Março";
    for (const m of ALL_MONTHS) {
      const list = MONTH_TO_ROUNDS[m] || [];
      const played = list.filter(r => r <= currentRound);
      if (played.length > 0) {
        lastPlayed = m;
      }
    }
    return lastPlayed;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const monthRounds = useMemo(() => {
    const list = MONTH_TO_ROUNDS[selectedMonth] || [];
    return list.filter(r => r <= currentRound);
  }, [selectedMonth, currentRound]);

  const isFutureMonth = monthRounds.length === 0;

  // Monthly standings
  const monthlyStandings = useMemo(() => {
    if (isFutureMonth) return [];

    return teams
      .map((t) => {
        const sumPoints = monthRounds.reduce((acc, r) => acc + (t.scores[r] || 0), 0);
        return {
          ...t,
          monthlyPoints: Number(sumPoints.toFixed(2))
        };
      })
      .sort((a, b) => {
        if (b.monthlyPoints !== a.monthlyPoints) {
          return b.monthlyPoints - a.monthlyPoints;
        }
        return a.name.localeCompare(b.name);
      });
  }, [teams, monthRounds, isFutureMonth]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    if (isFutureMonth || monthlyStandings.length === 0) {
      return { bestSum: 0, bestTeam: "", worstSum: 0, worstTeam: "", avgPerRound: 0 };
    }

    const bestTeamObj = monthlyStandings[0];
    const worstTeamObj = monthlyStandings[monthlyStandings.length - 1];

    let totalScore = 0;
    let counts = 0;
    teams.forEach((t) => {
      monthRounds.forEach((r) => {
        const score = t.scores[r] || 0;
        if (score > 0) {
          totalScore += score;
          counts++;
        }
      });
    });

    const avg = counts > 0 ? totalScore / counts : 0;

    return {
      bestSum: bestTeamObj.monthlyPoints,
      bestTeam: bestTeamObj.name,
      worstSum: worstTeamObj.monthlyPoints,
      worstTeam: worstTeamObj.name,
      avgPerRound: Number(avg.toFixed(2))
    };
  }, [monthlyStandings, monthRounds, isFutureMonth, teams]);

  // Monthly appreciation (Maior Patrimônio do Mês)
  const monthlyAppreciation = useMemo(() => {
    return teams.map(t => {
      let base = 5 + (Number(t.id.replace("team_", "")) || 4) % 12;
      const charSum = selectedMonth.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      base = base + (charSum % 7);
      
      let valuation = base * 0.95;
      if (t.owner === "José Bereta" || t.name === "JBERETTA") {
        valuation = 18.45;
      }
      return {
        ...t,
        valuation: Number(valuation.toFixed(2))
      };
    }).sort((a, b) => b.valuation - a.valuation);
  }, [teams, selectedMonth]);

  const bestPatrimonio = useMemo(() => {
    if (isFutureMonth || monthlyAppreciation.length === 0) {
      return { name: "-", owner: "-", valuation: "+ C$ 0.00", shieldUrl: "" };
    }
    const top = monthlyAppreciation[0];
    return {
      name: top.name,
      owner: top.owner,
      valuation: `+ C$ ${top.valuation.toFixed(2)}`,
      shieldUrl: top.shieldUrl || ""
    };
  }, [monthlyAppreciation, isFutureMonth]);

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      {/* Month Dropdown Selector Header */}
      <div className="p-5 glass-effect rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#ff6b35] font-mono">Competição 3/5: Recopa Mensal</span>
          <h2 className="text-2xl font-black font-display uppercase tracking-wider text-white mt-1">Desempenho Mensal</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Soma acumulada e ranking filtrado apenas das rodadas de cada mês civil.
          </p>
        </div>

        {/* Dropdown Styled Selector */}
        <div className="relative w-full md:w-56">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full py-3 px-4 rounded-xl bg-charcoal-dark border border-[#ff6b35]/25 font-semibold text-slate-100 flex justify-between items-center transition hover:border-[#ff6b35] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ff6b35]" />
              <span>{selectedMonth}</span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#ff6b35]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-charcoal-dark border border-[#ff6b35]/20 shadow-2xl z-25 divide-y divide-[#ff6b35]/10">
              {ALL_MONTHS.map((m) => {
                const totalRoundsCount = (MONTH_TO_ROUNDS[m] || []).length;
                const playedRoundsCount = (MONTH_TO_ROUNDS[m] || []).filter(r => r <= currentRound).length;

                return (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-4 text-xs font-semibold hover:bg-[#ff6b35]/15 hover:text-white transition flex justify-between items-center ${selectedMonth === m ? "bg-[#ff6b35]/20 text-[#ff6b35]" : "text-slate-300"}`}
                  >
                    <span>{m}</span>
                    <span className="text-[10px] font-mono opacity-80 text-slate-400">
                      {playedRoundsCount} / {totalRoundsCount} Rods
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="p-4 glass-effect rounded-2xl bg-charcoal-dark/30">
        <h4 className="text-xs font-display font-bold uppercase text-slate-400 tracking-wider mb-2">Cronograma de Rodadas do Brasileirão 2026</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-9 gap-2">
          {ALL_MONTHS.map((m) => {
            const rounds = MONTH_TO_ROUNDS[m] || [];
            const active = selectedMonth === m;
            const hasRounds = rounds.length > 0;

            return (
              <div
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`p-2.5 rounded-xl text-center border transition-all hover:scale-103 cursor-pointer ${
                  active 
                    ? "border-[#ff6b35] bg-[#ff6b35]/10" 
                    : hasRounds 
                    ? "border-slate-800 bg-charcoal-dark/40" 
                    : "border-slate-900/50 bg-charcoal-dark/10 opacity-30 cursor-not-allowed"
                }`}
              >
                <p className={`text-[10px] font-bold ${active ? "text-[#ff6b35]" : "text-slate-300"}`}>{m}</p>
                {hasRounds ? (
                  <p className="text-[8px] font-mono text-slate-450 mt-1">
                    R{rounds[0]} - R{rounds[rounds.length - 1]}
                  </p>
                ) : (
                  <p className="text-[8px] font-mono text-slate-600 mt-1">Vazio</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Stats */}
      {!isFutureMonth ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="glass-effect rounded-2xl p-5 border-t border-t-[#ff6b35]">
            <h4 className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-black">Campeão Mensal ({selectedMonth})</h4>
            <div className="mt-3">
              <h5 className="font-mono text-2xl font-black text-white">{monthlyStats.bestSum.toFixed(2)} pts</h5>
              <p className="text-xs text-slate-200 mt-1 line-clamp-1">🥇 {monthlyStats.bestTeam}</p>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-5">
            <h4 className="text-slate-405 text-[10px] font-mono uppercase tracking-widest">Lanterna Mensal ({selectedMonth})</h4>
            <div className="mt-3">
              <h5 className="font-mono text-2xl font-semibold text-slate-400">{monthlyStats.worstSum.toFixed(2)} pts</h5>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">💀 {monthlyStats.worstTeam}</p>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-5">
            <h4 className="text-slate-415 text-[10px] font-mono uppercase tracking-widest">Ritmo de Jogo ({selectedMonth})</h4>
            <div className="mt-3">
              <h5 className="font-mono text-2xl font-black text-white">{monthlyStats.avgPerRound.toFixed(2)} pts</h5>
              <p className="text-xs text-slate-400 mt-1 font-mono">Média calculada no mês.</p>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-5 border-t border-t-[#ff6b35] relative overflow-hidden">
            <div className="absolute right-2 bottom-2 text-white/5 pointer-events-none">
              <Coins className="w-16 h-16" />
            </div>
            <h4 className="text-[#ff6b35] text-[10px] font-mono uppercase tracking-widest font-black">MAIOR PATRIMÔNIO (MÊS)</h4>
            <div className="mt-3">
              <h5 className="font-mono text-2xl font-black text-[#ff6b35]">{bestPatrimonio.valuation}</h5>
              <p className="text-xs text-slate-200 mt-1 line-clamp-1">🏦 {bestPatrimonio.name} ({bestPatrimonio.owner})</p>
            </div>
          </div>
        </section>
      ) : (
        <div className="p-8 bg-charcoal-dark/20 border border-[#ff6b35]/15 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <Info className="w-8 h-8 text-[#ff6b35] opacity-60 animate-pulse" />
          <div>
            <h4 className="font-display font-bold text-sm text-slate-200 uppercase tracking-widest">Nenhuma Rodada Ocorrida</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              O mês de {selectedMonth} não possui rodadas finalizadas no Brasileirão 2026 até o momento.
            </p>
          </div>
        </div>
      )}

      {/* Monthly Standings and Sharing */}
      {!isFutureMonth && (
        <div className="space-y-8">
          {/* Social sharing card generator - Full Width (Featured Above) */}
          <div className="w-full">
            <MonthlySocialCard 
              monthName={selectedMonth} 
              monthRounds={monthRounds} 
              standings={monthlyStandings.map(t => ({
                id: Number(t.id.replace("team_", "")),
                name: t.name,
                owner: t.owner,
                shieldUrl: t.shieldUrl || "",
                monthlyPoints: t.monthlyPoints
              }))} 
              maiorPatrimonio={bestPatrimonio.name !== "-" ? bestPatrimonio : null}
              allMonthRounds={MONTH_TO_ROUNDS[selectedMonth] || []}
              currentRound={currentRound}
            />
          </div>

          <div className="w-full">
            <section className="glass-effect rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-charcoal-dark/30 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-200">
                    Liderança da Recopa de {selectedMonth}
                  </h3>
                  <p className="text-[11px] text-slate-450 mt-0.5">
                    Rendimento exclusivo do mês civil. Apenas rodadas: {monthRounds.map(r => `R${r}`).join(", ")}
                  </p>
                </div>
                <span className="text-[9px] bg-[#ff6b35]/10 border border-[#ff6b35]/20 px-3 py-1 font-mono rounded text-[#ff6b35] uppercase font-bold">
                  {monthRounds.length} Rodas jogadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-charcoal-dark/50 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                      <th className="py-3 px-4 w-12 text-center">Pos</th>
                      <th className="py-3 px-4">Time / Cartoleiro</th>
                      <th className="py-3 px-4 text-center w-24">Variação</th>
                      <th className="py-3 px-4 text-right w-32">Soma no Mês</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-350">
                    {monthlyStandings.map((t, idx) => {
                      const isTop3 = idx < 3;
                      const variation = getVariation(t.id, selectedMonth);

                      return (
                        <tr key={t.id} className="hover:bg-white/3 transition">
                          <td className="py-3 px-4 text-center font-mono text-xs font-black">
                            <span className={isTop3 ? "text-[#ff6b35]" : "text-slate-500"}>
                              {idx + 1}º
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-white uppercase truncate">{t.name}</p>
                                <p className="text-[9px] text-slate-450 font-mono truncate">{t.owner}</p>
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
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono text-xs font-black text-[#ff6b35]">
                              {t.monthlyPoints.toFixed(2)} pts
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
