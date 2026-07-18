import React, { useMemo } from "react";
import { Trophy, RefreshCw, Star, Info } from "lucide-react";
import { FullBracket, FinalRankings } from "../services/knockout";
import TeamShield from "./TeamShield";

interface BracketProps {
  bracket: FullBracket | null;
  finalRankings: FinalRankings | null;
  manualScores: Record<string, { home: number; away: number }>;
  onMatchScoreChange: (matchCode: string, isHome: boolean, val: string) => void;
  onSimulateCompleteBracket: () => void;
  isSimulatorsEnabled?: boolean;
}

export default function BracketVisualization({
  bracket,
  finalRankings,
  manualScores,
  onMatchScoreChange,
  onSimulateCompleteBracket,
  isSimulatorsEnabled = false
}: BracketProps) {

  if (!bracket) {
    return (
      <div className="p-12 text-center bg-charcoal-dark/40 border border-gold/10 rounded-2xl text-slate-400 font-display">
        Nenhuma chave de mata-mata gerada ainda. Finalize e confirme a fase de grupos primeiro.
      </div>
    );
  }

  const renderTeamRow = (match: any, teamKey: "home" | "away", matchCode: string) => {
    const team = match[teamKey];
    if (!team) {
      return (
        <div className="flex justify-between items-center py-1 select-none text-[10.5px] text-slate-500 font-mono italic">
          <span>Aguardando adversário</span>
          <span className="text-[9px] bg-white/5 px-1.5 py-0.2 rounded">TBD</span>
        </div>
      );
    }

    const isWinner = match.winner?.name === team.name;
    const isLoser = match.winner && match.winner.name !== team.name;
    
    // Class names according to premium requirements
    let textClass = "font-semibold text-slate-355";
    let scoreTextClass = "text-gold";
    let textStyle: React.CSSProperties = {};
    let scoreStyle: React.CSSProperties = {};
    
    if (isWinner) {
      textClass = "font-black text-white flex items-center gap-1 text-[12px] uppercase tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]";
      scoreTextClass = "text-[#ff6b35]"; // pontuação em laranja vibrante
    } else if (isLoser) {
      textClass = "text-slate-300 font-normal select-none";
      textStyle = {
        opacity: 0.65,
        textDecoration: "line-through",
        textDecorationColor: "rgba(255, 255, 255, 0.4)"
      };
      scoreTextClass = "text-slate-400 font-normal";
      scoreStyle = {
        opacity: 0.65,
        textDecoration: "line-through",
        textDecorationColor: "rgba(255, 255, 255, 0.4)"
      };
    }

    const inputScoreValue = manualScores[matchCode]?.[teamKey] ?? "";

    return (
      <div className="flex justify-between items-center py-1.5 transition-all text-xs">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 flex items-center justify-center p-0.5 rounded bg-black/10 transition overflow-hidden flex-shrink-0"
            style={isLoser ? { filter: "grayscale(80%) opacity(0.5)" } : {}}
          >
            <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} />
          </div>
          <span 
            className={`${textClass} truncate max-w-[130px]`}
            style={textStyle}
          >
            {team.name}
          </span>
          {isWinner && <Star className="w-3 h-3 text-gold fill-gold animate-bounce" />}
        </div>
        
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={inputScoreValue}
          disabled={!isSimulatorsEnabled}
          onChange={(e) => onMatchScoreChange(matchCode, teamKey === "home", e.target.value)}
          className={`w-14 text-center py-1 rounded bg-[#0a0a0a]/90 border border-slate-800 font-mono text-[11px] font-bold ${scoreTextClass} focus:outline-none focus:border-gold/50 disabled:opacity-50 disabled:cursor-not-allowed`}
          style={scoreStyle}
        />
      </div>
    );
  };

  const renderSymmetricMatchCard = (phaseName: string, matchCode: string, cardTheme: "left" | "right") => {
    const phaseMatches = bracket[phaseName] || {};
    const m = phaseMatches[matchCode];

    if (!m) {
      return (
        <div className="bg-charcoal-dark/30 border border-slate-850 p-2.5 text-center rounded-xl text-[10px] text-slate-500 font-mono">
          TBD ({matchCode})
        </div>
      );
    }

    const hasPlayed = m.winner !== null;
    const borderClass = hasPlayed 
      ? "border-gold/40 hover:border-gold/60 shadow-[0_0_15px_rgba(212,175,55,0.06)] focus-within:ring-1 focus-within:ring-gold/30" 
      : "border-slate-800 hover:border-slate-700";

    const bgClass = hasPlayed ? "bg-charcoal-dark/95" : "bg-charcoal-dark/70";

    // Trace dependency connections
    const dependencyMap: Record<string, string> = {
      'M49': 'M81', 'M50': 'M81', 'M51': 'M83', 'M52': 'M83',
      'M53': 'M85', 'M54': 'M85', 'M55': 'M87', 'M56': 'M87',
      'M81': 'M90', 'M83': 'M90', 'M85': 'M92', 'M87': 'M92',
      'M90': 'M98', 'M92': 'M98', 'M98': 'M101',
      
      'M57': 'M89', 'M58': 'M89', 'M59': 'M91', 'M60': 'M91',
      'M61': 'M93', 'M62': 'M93', 'M63': 'M95', 'M64': 'M95',
      'M89': 'M94', 'M91': 'M94', 'M93': 'M96', 'M95': 'M96',
      'M94': 'M100', 'M96': 'M100', 'M100': 'M101'
    };
    const nextCode = dependencyMap[matchCode];

    return (
      <div className={`border rounded-xl p-3 shadow-md transition-all duration-300 ${borderClass} ${bgClass} group w-full relative`}>
        {/* Connector Line Extensions (Subtle visual lines) */}
        {nextCode && (
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-[1.5px] bg-gold/15 group-hover:bg-gold/40 transition-colors pointer-events-none hidden md:block
              ${cardTheme === 'left' ? '-right-3.5 border-r border-t border-gold/20' : '-left-3.5 border-l border-t border-gold/20'}`}
          />
        )}

        <div className="flex justify-between items-center mb-1 pb-1 border-b border-white/5">
          <span className="font-mono text-[9px] font-bold text-slate-400">
            {matchCode} &bull; {m.description.split(" - ")[0]}
          </span>
          <div className="flex items-center gap-1">
            {nextCode && (
              <span className="text-[8px] bg-gold/5 text-gold border border-gold/15 px-1 py-0.2 rounded font-mono font-bold tracking-tight uppercase">
                {cardTheme === "left" ? `➜ ${nextCode}` : `${nextCode} ↵`}
              </span>
            )}
            {m.winner && (
              <span className="text-[7px] bg-green-500/10 text-green-400 px-1 py-0.2 rounded font-black font-mono uppercase tracking-wider">
                OK
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          {renderTeamRow(m, "home", matchCode)}
          {renderTeamRow(m, "away", matchCode)}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6 text-white" id="white-label-copa-bracket-tree">
      
      {/* ACTION TOPBAR */}
      <div className="p-5 glass-effect rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-gold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Estrutura de Chaveamento Mirelhada
          </h4>
          <p className="text-xs text-slate-450 mt-0.5">
            {isSimulatorsEnabled 
              ? "Modifique os placares nos inputs de texto para propagação imediata ou simule todos os placares abaixo."
              : "As simulações manuais de copa estão bloqueadas pelo administrador."}
          </p>
        </div>
        {isSimulatorsEnabled && (
          <button
            onClick={onSimulateCompleteBracket}
            className="px-4 py-2.5 bg-gold hover:bg-gold/90 text-charcoal-dark text-xs uppercase font-extrabold rounded-lg tracking-wider flex items-center gap-2 cursor-pointer transition shadow hover:shadow-gold/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simular Chave da Copa</span>
          </button>
        )}
      </div>

      {/* PORTAL INFO ACCENT */}
      {isSimulatorsEnabled && (
        <div className="bg-[#121212]/40 border border-slate-800 rounded-xl p-3 flex gap-2.5 items-start text-xs text-slate-400 max-w-sm ml-auto">
          <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <p>Gere os vencedores automaticamente ou defina-os manualmente. Os classificados avançam para o centro direto ao título!</p>
        </div>
      )}

      {/* HORIZONTAL MIRRORED BRACKET CONTAINER */}
      <div className="overflow-x-auto py-6 rounded-2xl bg-charcoal-dark/25 p-4 border border-white/5 select-none my-6">
        <div className="flex justify-between items-center space-x-6 min-w-[2100px]">
          
          {/* ==================== LADO ESQUERDO (LADO 1 DA CHAVE) ==================== */}
          
          {/* COLUNA 1: ROUND OF 32 (8 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64 space-y-1">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-[#D4AF37]">1/16 de Final (R24) - Lado A</span>
            </div>
            {renderSymmetricMatchCard("round_of_32", "M49", "left")}
            {renderSymmetricMatchCard("round_of_32", "M50", "left")}
            {renderSymmetricMatchCard("round_of_32", "M51", "left")}
            {renderSymmetricMatchCard("round_of_32", "M52", "left")}
            {renderSymmetricMatchCard("round_of_32", "M53", "left")}
            {renderSymmetricMatchCard("round_of_32", "M54", "left")}
            {renderSymmetricMatchCard("round_of_32", "M55", "left")}
            {renderSymmetricMatchCard("round_of_32", "M56", "left")}
          </div>

          {/* COLUNA 2: ROUND OF 16 / OITAVAS (4 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Oitavas de Final (R25) - Lado A</span>
            </div>
            {renderSymmetricMatchCard("round_of_16", "M81", "left")}
            {renderSymmetricMatchCard("round_of_16", "M83", "left")}
            {renderSymmetricMatchCard("round_of_16", "M85", "left")}
            {renderSymmetricMatchCard("round_of_16", "M87", "left")}
          </div>

          {/* COLUNA 3: QUARTAS (2 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Quartas de Final (R26) - Lado A</span>
            </div>
            {renderSymmetricMatchCard("quarterfinals", "M90", "left")}
            {renderSymmetricMatchCard("quarterfinals", "M92", "left")}
          </div>

          {/* COLUNA 4: SEMIFINAL (1 confronto) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Semifinal (R27) - Lado A</span>
            </div>
            {renderSymmetricMatchCard("semifinals", "M98", "left")}
          </div>

          {/* ==================== CONVERGÊNCIA CENTRAL: GRANDE FINAL & DISPUTA 3º ==================== */}
          <div className="flex flex-col justify-center items-center h-[1050px] w-[320px] space-y-8 flex-shrink-0 bg-gold/5 rounded-2xl border border-gold/15 p-5 self-center relative shadow-inner">
            <div className="absolute top-6 font-display font-black text-xs text-gold tracking-widest uppercase flex items-center gap-1.5">
              <Trophy className="w-5 h-5 animate-pulse" />
              <span>COPA SÓ CAMISA 10 APEX</span>
            </div>

            {/* GRAND FINALS CARD */}
            <div className="space-y-4 w-full">
              <div className="text-center flex flex-col items-center">
                <span className="text-[11px] font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/25">🏆 A GRANDE FINAL (R28)</span>
              </div>
              {renderSymmetricMatchCard("final", "M101", "left")}
            </div>

            {/* DISPUTA 3º LUGAR */}
            <div className="space-y-4 w-full border-t border-gold/10 pt-6">
              <div className="text-center">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">🥉 DISPUTA DE 3º LUGAR (R28)</span>
              </div>
              {renderSymmetricMatchCard("third_place", "M102", "left")}
            </div>

            {/* ILLUSTRATIVE CUP */}
            <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity pt-4">
              <Trophy className="w-16 h-16 text-gold fill-gold/20 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-bounce" />
              <span className="text-[9px] text-gold/60 uppercase font-mono font-black tracking-widest mt-2">TAÇA DA COPA 2026</span>
            </div>

            {/* DISPLAY PODIUM ONCE COMPLETED */}
            {finalRankings && (
              <div className="w-full text-center bg-black/60 p-4 rounded-xl border border-gold/30 flex flex-col items-center shadow-xl animate-fade-in">
                <Trophy className="w-7 h-7 text-gold fill-gold mb-1.5" />
                <span className="text-[9px] text-slate-400 uppercase font-mono font-black tracking-widest">Campeão</span>
                <p className="text-sm font-display font-black text-white line-clamp-1 truncate w-full">{finalRankings.champion.name}</p>
              </div>
            )}
          </div>

          {/* ==================== LADO DIREITO (LADO 2 DA CHAVE - ESPELHADO) ==================== */}

          {/* COLUNA 5: SEMIFINAL (1 confronto) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Semifinal (R27) - Lado B</span>
            </div>
            {renderSymmetricMatchCard("semifinals", "M100", "right")}
          </div>

          {/* COLUNA 6: QUARTAS (2 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Quartas de Final (R26) - Lado B</span>
            </div>
            {renderSymmetricMatchCard("quarterfinals", "M94", "right")}
            {renderSymmetricMatchCard("quarterfinals", "M96", "right")}
          </div>

          {/* COLUNA 7: ROUND OF 16 / OITAVAS (4 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-slate-400">Oitavas de Final (R25) - Lado B</span>
            </div>
            {renderSymmetricMatchCard("round_of_16", "M89", "right")}
            {renderSymmetricMatchCard("round_of_16", "M91", "right")}
            {renderSymmetricMatchCard("round_of_16", "M93", "right")}
            {renderSymmetricMatchCard("round_of_16", "M95", "right")}
          </div>

          {/* COLUNA 8: ROUND OF 32 (8 confrontos) */}
          <div className="flex flex-col justify-around h-[1050px] w-64 space-y-1">
            <div className="text-center pb-2 border-b border-white/5">
              <span className="text-[10px] tracking-wider uppercase font-mono font-extrabold text-[#D4AF37]">1/16 de Final (R24) - Lado B</span>
            </div>
            {renderSymmetricMatchCard("round_of_32", "M57", "right")}
            {renderSymmetricMatchCard("round_of_32", "M58", "right")}
            {renderSymmetricMatchCard("round_of_32", "M59", "right")}
            {renderSymmetricMatchCard("round_of_32", "M60", "right")}
            {renderSymmetricMatchCard("round_of_32", "M61", "right")}
            {renderSymmetricMatchCard("round_of_32", "M62", "right")}
            {renderSymmetricMatchCard("round_of_32", "M63", "right")}
            {renderSymmetricMatchCard("round_of_32", "M64", "right")}
          </div>

        </div>
      </div>
    </section>
  );
}
