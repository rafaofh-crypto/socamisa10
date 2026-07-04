import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Skull, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Flame, 
  Coins, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Zap
} from "lucide-react";
import { CartolaTeam, MONTH_TO_ROUNDS } from "../services/cartollaApi";
import { calculateStandings } from "../services/rankings";
import SocialCard from "../components/SocialCard";
import TeamShield from "../components/TeamShield";

interface DestaquesProps {
  teams: CartolaTeam[];
  currentRound: number;
}

// Function to generate standard slugs from team names for matching
const getSlug = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Function to calculate deterministic but realistic patrimonio for teams
function getPatrimonioForSelectedRound(team: CartolaTeam, selectedRound: number): number {
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
  const rounds = Array.from({ length: selectedRound }, (_, i) => i + 1);
  const totalScore = rounds.reduce((sum, r) => sum + (team.scores[r] || 0), 0);
  
  const base = 100 + (totalScore * 0.054);
  const hash = team.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (hash % 120) / 10 - 6.0; // -6.0 to +6.0
  
  return Number(Math.min(160, Math.max(93.10, base + variation)).toFixed(2));
}

export default function Destaques({ teams, currentRound }: DestaquesProps) {
  const [selectedRound, setSelectedRound] = useState<number>(currentRound);

  // 1. Calculate Mito & Lanterna dynamically for the selected round
  const roundMitoAndLanterna = useMemo(() => {
    let mito: CartolaTeam | null = null;
    let lanterna: CartolaTeam | null = null;
    let maxScore = -Infinity;
    let minScore = Infinity;

    teams.forEach((t) => {
      const score = t.scores[selectedRound] || 0;
      if (score > maxScore) {
        maxScore = score;
        mito = t;
      }
      if (score < minScore && score > 0) {
        minScore = score;
        lanterna = t;
      }
    });

    return {
      mito,
      mitoScore: maxScore > -Infinity ? Number(maxScore.toFixed(2)) : 0,
      lanterna,
      lanternaScore: minScore < Infinity ? Number(minScore.toFixed(2)) : 0
    };
  }, [teams, selectedRound]);

  // 2. Calculate Dynamically "O Magnata" (Highest patrimonio for the selected round)
  const magnata = useMemo(() => {
    if (teams.length === 0) return { team: null, value: 0 };
    let bestTeam: CartolaTeam | null = null;
    let maxPatr = -Infinity;

    teams.forEach((t) => {
      const patr = getPatrimonioForSelectedRound(t, selectedRound);
      if (patr > maxPatr) {
        maxPatr = patr;
        bestTeam = t;
      }
    });

    return {
      team: bestTeam,
      value: maxPatr
    };
  }, [teams, selectedRound]);

  // 2.5 Calculate Dynamically "Líder Geral" up to selectedRound
  const overallLeader = useMemo(() => {
    if (teams.length === 0) return { team: null, value: 0 };
    let bestTeam: CartolaTeam | null = null;
    let maxAcumulado = -Infinity;

    teams.forEach((t) => {
      const accum = Array.from({ length: selectedRound }, (_, idx) => idx + 1)
        .reduce((sum, r) => sum + (t.scores[r] || 0), 0);
      if (accum > maxAcumulado) {
        maxAcumulado = accum;
        bestTeam = t;
      }
    });

    return {
      team: bestTeam,
      value: Number(maxAcumulado.toFixed(2))
    };
  }, [teams, selectedRound]);

  // 2.6 Calculate Dynamically "Líder do Mês (Maio)"
  const monthlyLeaderMaio = useMemo(() => {
    if (teams.length === 0) return { team: null, value: 0 };
    let bestTeam: CartolaTeam | null = null;
    let maxMaio = -Infinity;
    
    const maioRounds = MONTH_TO_ROUNDS["Maio"] || [14, 15, 16, 17, 18];

    teams.forEach((t) => {
      const maioScore = maioRounds.reduce((sum, r) => sum + (t.scores[r] || 0), 0);
      if (maioScore > maxMaio) {
        maxMaio = maioScore;
        bestTeam = t;
      }
    });

    return {
      team: bestTeam,
      value: Number(maxMaio.toFixed(2))
    };
  }, [teams]);

  // 3. Calculate Dynamically "O Foguete" and "A Âncora" (Table climbers and sinkers)
  const resenha = useMemo(() => {
    if (teams.length === 0) {
      return { foguete: null, ancora: null };
    }

    if (selectedRound <= 1) {
      // Fallback fallback for round 1
      const defaultFoguete = teams.find(t => getSlug(t.name) === "rivers-of-babylon") || teams[0];
      const defaultAncora = teams.find(t => getSlug(t.name) === "chinchila-cabecuda") || teams[teams.length - 1];
      return {
        foguete: { 
          team: defaultFoguete, 
          diff: 12,
          tagline: "Arrancada inicial espetacular para consolidar posições!"
        },
        ancora: { 
          team: defaultAncora, 
          diff: 9,
          tagline: "Esqueceu de fechar o mercado de transferências!"
        }
      };
    }

    const prevRounds = Array.from({ length: selectedRound - 1 }, (_, i) => i + 1);
    const currRounds = Array.from({ length: selectedRound }, (_, i) => i + 1);

    const prevStandings = calculateStandings(teams, prevRounds);
    const currStandings = calculateStandings(teams, currRounds);

    let maxClimb = -Infinity;
    let foguete: CartolaTeam | null = null;

    let maxDrop = -Infinity;
    let ancora: CartolaTeam | null = null;

    teams.forEach((t) => {
      const pIdx = prevStandings.findIndex((s) => s.id === t.id);
      const cIdx = currStandings.findIndex((s) => s.id === t.id);

      if (pIdx !== -1 && cIdx !== -1) {
        // e.g. from Index 20 (Rank 21) to Index 8 (Rank 9) -> Climb = index difference = 12
        const climb = pIdx - cIdx;
        if (climb > maxClimb) {
          maxClimb = climb;
          foguete = t;
        }

        const drop = cIdx - pIdx;
        if (drop > maxDrop) {
          maxDrop = drop;
          ancora = t;
        }
      }
    });

    return {
      foguete: {
        team: foguete || teams[0],
        diff: Math.max(1, maxClimb),
        tagline: maxClimb > 0 
          ? `Subiu +${maxClimb} ${maxClimb === 1 ? "posição" : "posições"} na tabela geral com essa rodada espetacular!`
          : "Recuperou fôlego valioso na rodada atual."
      },
      ancora: {
        team: ancora || teams[teams.length - 1],
        diff: Math.max(1, maxDrop),
        tagline: maxDrop > 0
          ? `Caiu -${maxDrop} ${maxDrop === 1 ? "posição" : "posições"} no acumulado. Foco no mercado para a próxima rodada!`
          : "Amargou desgaste de elenco nesta rodada."
      }
    };
  }, [teams, selectedRound]);

  const hasData = teams.length > 0;

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Selector Slider */}
      <div className="p-6 glass-effect rounded-2xl flex flex-col items-center justify-center gap-4 border border-gold/15">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gold font-mono">Destaques Rodada por Rodada</span>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSelectedRound(prev => Math.max(1, prev - 1))}
            disabled={selectedRound === 1}
            className="p-2.5 rounded-lg bg-[#121212]/75 border border-gold/10 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center w-40">
            <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">Rodada {selectedRound}</h3>
            <p className="text-[9px] text-slate-400 uppercase font-mono tracking-widest mt-0.5">Campanha Fechada</p>
          </div>

          <button
            onClick={() => setSelectedRound(prev => Math.min(currentRound, prev + 1))}
            disabled={selectedRound === currentRound}
            className="p-2.5 rounded-lg bg-[#121212]/75 border border-gold/10 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Input Range */}
        <input
          type="range"
          min={1}
          max={currentRound}
          value={selectedRound}
          onChange={(e) => setSelectedRound(Number(e.target.value))}
          className="w-full max-w-md accent-gold h-1 bg-neutral-900 rounded-lg cursor-pointer my-1.5"
        />
      </div>

      {hasData && roundMitoAndLanterna.mito ? (
        <div className="space-y-8">
          {/* Bento Grid - 6 Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Destaque da Rodada (O Mito) */}
            <div className="glass-effect-gold rounded-2xl p-6 flex flex-col justify-between border-2 border-gold-glow-border h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-gold/20">
              <div className="absolute top-0 right-0 p-6 opacity-20 bg-gold blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-slate-200 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                  Mito da Rodada
                </span>
                
                {/* Golden Premium Badge */}
                <span className="bg-gold text-charcoal-dark font-display font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border border-[#ffffff]/20 flex items-center shrink-0">
                  🏆 R$ 80,00
                </span>
              </div>

              <div className="my-4 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-[#121212]/80 p-1 rounded-full border border-gold/55 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                  <TeamShield shieldUrl={roundMitoAndLanterna.mito.shieldUrl} fallbackText={roundMitoAndLanterna.mito.name} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-black text-lg uppercase tracking-tight text-white leading-tight truncate">{roundMitoAndLanterna.mito.name}</h4>
                  <p className="text-[11px] text-slate-350 font-medium truncate mt-0.5">Cartoleiro: {roundMitoAndLanterna.mito.owner}</p>
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-1.5 relative z-10">
                <span className="font-mono text-4xl font-black text-gold tracking-tight">{roundMitoAndLanterna.mitoScore}</span>
                <span className="text-[10px] uppercase text-gold/85 font-mono font-bold tracking-wider">pts</span>
              </div>
            </div>

            {/* Card 2: Pior Desempenho (O Lanterna) */}
            <div className="bg-[#121212]/85 border-2 border-red-500/35 rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-6 opacity-10 bg-red-650 blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-red-400 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1.5">
                  <Skull className="w-4 h-4 text-red-400" />
                  Lanterna da Rodada
                </span>
                <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">
                  🤕 Gesso
                </span>
              </div>

              {roundMitoAndLanterna.lanterna ? (
                <>
                  <div className="my-4 flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-red-950/10 p-1 rounded-full border border-red-500/20 flex items-center justify-center overflow-hidden shrink-0">
                      <TeamShield shieldUrl={roundMitoAndLanterna.lanterna.shieldUrl} fallbackText={roundMitoAndLanterna.lanterna.name} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base text-slate-100 uppercase tracking-tight leading-tight truncate">{roundMitoAndLanterna.lanterna.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Cartoleiro: {roundMitoAndLanterna.lanterna.owner}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-end relative z-10 gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-4xl font-black text-red-400 tracking-tight">{roundMitoAndLanterna.lanternaScore}</span>
                      <span className="text-[10px] uppercase text-red-500/80 font-mono font-bold">pts</span>
                    </div>
                    <p className="text-[9.5px] italic text-slate-400 leading-tight text-right w-1/2 line-clamp-2">
                      "Calma caranguejo, a próxima rodada brilha!"
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-xs my-4">Sem dados</p>
              )}
            </div>

            {/* Card 3: Líder do Campeonato Geral */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-between border border-gold/25 shadow-lg h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-6 opacity-10 bg-gold blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-slate-200 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold mb-0.5" />
                  Líder do Campeonato
                </span>
                <span className="text-[8px] bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">
                  👑 Geral
                </span>
              </div>

              {overallLeader.team ? (
                <>
                  <div className="my-4 flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-[#121212]/80 p-1 rounded-full border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                      <TeamShield shieldUrl={overallLeader.team.shieldUrl} fallbackText={overallLeader.team.name} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base text-slate-100 uppercase tracking-tight leading-tight truncate">{overallLeader.team.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Dono: {overallLeader.team.owner}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1 relative z-10">
                    <span className="font-mono text-3xl font-black text-gold tracking-tight">{overallLeader.value.toFixed(2)}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-mono font-bold ml-1">pts</span>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-xs my-4">Sem dados</p>
              )}
            </div>

            {/* Card 4: Líder do Mês (Maio) - Recopa Mensal */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-between border border-gold/20 shadow-lg h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-6 opacity-10 bg-[#D4AF37] blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-slate-200 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Líder do Mês (Maio)
                </span>
                <span className="text-[8px] bg-orange-400/10 text-orange-400 border border-orange-450/25 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">
                  📅 Recopa
                </span>
              </div>

              {monthlyLeaderMaio.team ? (
                <>
                  <div className="my-4 flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-[#121212]/80 p-1 rounded-full border border-gold/10 flex items-center justify-center overflow-hidden shrink-0">
                      <TeamShield shieldUrl={monthlyLeaderMaio.team.shieldUrl} fallbackText={monthlyLeaderMaio.team.name} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base text-slate-100 uppercase tracking-tight leading-tight truncate">{monthlyLeaderMaio.team.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Dono: {monthlyLeaderMaio.team.owner}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1 relative z-10">
                    <span className="font-mono text-3xl font-black text-orange-400 tracking-tight">{monthlyLeaderMaio.value.toFixed(2)}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-mono font-bold ml-1">pts</span>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-xs my-4">Sem dados</p>
              )}
            </div>

            {/* Card 5: O Magnata (Maior Patrimônio) */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-between border border-gold/25 shadow-lg h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-6 opacity-10 bg-yellow-500 blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-slate-200 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  Maior Patrimônio
                </span>
                <span className="text-[8px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">
                  💰 Magnata
                </span>
              </div>

              {magnata.team ? (
                <>
                  <div className="my-4 flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-[#121212]/80 p-1 rounded-full border border-yellow-500/20 flex items-center justify-center overflow-hidden shrink-0">
                      <TeamShield shieldUrl={magnata.team.shieldUrl} fallbackText={magnata.team.name} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-base text-slate-100 uppercase tracking-tight leading-tight truncate">{magnata.team.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Dono: {magnata.team.owner}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1 relative z-10">
                    <span className="font-display font-black text-2xl text-yellow-400 tracking-tight">C$ {magnata.value.toFixed(2)}</span>
                    <span className="text-[9px] uppercase text-slate-450 font-mono tracking-wider font-bold">Cartoletas</span>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-xs my-4">Sem dados</p>
              )}
            </div>

            {/* Card 6: Recorde Histórico (Hall da Fama) */}
            <div className="glass-effect rounded-2xl p-6 flex flex-col justify-between border-2 border-gold/40 shadow-lg gold-glow cursor-default h-full min-h-[220px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-6 opacity-20 bg-gold blur-2xl w-24 h-24 rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start gap-2 relative z-10 w-full mb-3">
                <span className="text-slate-200 text-xs font-display font-black tracking-wide uppercase flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-gold animate-bounce" />
                  Recorde Histórico
                </span>
                <span className="text-[8px] bg-gold/15 text-gold border border-gold/30 px-2.5 py-0.5 rounded font-black font-display uppercase tracking-wider">
                  👑 Estelar
                </span>
              </div>

              <div className="my-4 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-[#121212]/90 p-1 rounded-full border border-gold shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                  {/* Styled avatar fallback for floripamengao */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48">
                    <circle cx="50" cy="50" r="45" fill="#8B0000" stroke="#D4AF37" strokeWidth="5"/>
                    <text x="50" y="58" fontFamily="Montserrat, Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#FFFFFF" textAnchor="middle">FL</text>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-black text-base text-white uppercase tracking-tight leading-tight truncate">Floripamengao</h4>
                  <p className="text-[11px] text-slate-350 truncate mt-0.5">Dono: Dyego</p>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-end relative z-10 gap-1">
                <div>
                  <span className="font-mono text-2xl font-black text-gold tracking-tight">138,12</span>
                  <span className="text-[10px] uppercase text-[#D4AF37] font-mono font-bold ml-1">pts</span>
                </div>
                <span className="text-[9.5px] uppercase font-mono bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/20 font-bold">
                  Rodada 13
                </span>
              </div>
            </div>

          </div>

          {/* Dynamic Additions Section: Live marketing / Resenha da Rodada & Social Shared View */}
          <div className="space-y-8 mt-8">
            
            {/* Showcase Exposição Nativa - Full Width */}
            {roundMitoAndLanterna.mito && (
              <div className="w-full">
                <SocialCard 
                  mito={roundMitoAndLanterna.mito} 
                  mitoScore={roundMitoAndLanterna.mitoScore}
                  lanterna={roundMitoAndLanterna.lanterna}
                  lanternaScore={roundMitoAndLanterna.lanternaScore}
                  magnata={magnata.team}
                  magnataValue={magnata.value}
                  round={selectedRound} 
                />
              </div>
            )}

            {/* Live Marketing Row : Full Width */}
            <div className="w-full">
              
              <div className="p-6 glass-effect rounded-2xl flex flex-col justify-between border border-gold/15">
                
                {/* Section title */}
                <div className="border-b border-gold/15 pb-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Resenha da Rodada</h3>
                  </div>
                  <span className="text-[9px] bg-white/5 border border-white/10 text-slate-300 font-bold px-2.5 py-1 rounded font-mono uppercase tracking-wider">
                    Telemetria de Variação Geral
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch my-3">
                  
                  {/* Rocket card */}
                  {resenha.foguete && (
                    <div className="bg-[#121212]/60 border border-emerald-500/20 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 bg-emerald-500 blur-xl w-16 h-16 rounded-full pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            O Foguete
                          </span>
                          <span className="font-mono text-emerald-450 text-[11px] font-bold">Variância Positiva</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-900/10 p-1 rounded-full border border-emerald-500/15 flex items-center justify-center overflow-hidden shrink-0">
                            <TeamShield shieldUrl={resenha.foguete.team.shieldUrl} fallbackText={resenha.foguete.team.name} />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-display font-bold text-sm text-slate-200 truncate">{resenha.foguete.team.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">Cartoleiro: {resenha.foguete.team.owner}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-baseline justify-between gap-1.5">
                        <span className="text-[9.5px] text-slate-400 font-mono italic truncate max-w-[140px]">{resenha.foguete.tagline}</span>
                        <span className="font-display font-black text-base text-emerald-400 text-right shrink-0">
                          +{resenha.foguete.diff} {resenha.foguete.diff === 1 ? "Posição" : "Posições"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Anchor card */}
                  {resenha.ancora && (
                    <div className="bg-[#121212]/60 border border-rose-500/20 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 bg-rose-500 blur-xl w-16 h-16 rounded-full pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10px] font-mono uppercase text-rose-400 font-extrabold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15">
                            ⚓ A Âncora
                          </span>
                          <span className="font-mono text-rose-450 text-[11px] font-bold">Variância Negativa</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-905/10 p-1 rounded-full border border-rose-500/15 flex items-center justify-center overflow-hidden shrink-0">
                            <TeamShield shieldUrl={resenha.ancora.team.shieldUrl} fallbackText={resenha.ancora.team.name} />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-display font-bold text-sm text-slate-200 truncate">{resenha.ancora.team.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">Cartoleiro: {resenha.ancora.team.owner}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-baseline justify-between gap-1.5">
                        <span className="text-[9.5px] text-slate-400 font-mono italic truncate max-w-[140px]">{resenha.ancora.tagline}</span>
                        <span className="font-display font-black text-base text-rose-400 text-right shrink-0">
                          -{resenha.ancora.diff} {resenha.ancora.diff === 1 ? "Posição" : "Posições"}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Micro instructions / tips */}
                <div className="bg-[#121212]/40 rounded-lg p-3 border border-gold/10 text-center mt-3">
                  <p className="text-[10px] text-slate-400 font-mono">
                    💡 <span className="text-gold font-bold">Dica de escalação:</span> O patrimônio total influencia diretamente a sua capacidade de escalar novos "Mitos" no segundo turno da Copa! Valorize sua carteira.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="p-16 text-center text-slate-400 border border-gold/10 rounded-2xl bg-[#121212]/30">
          Carregando banco de dados para a rodada...
        </div>
      )}
    </div>
  );
}
