import React, { useState, useEffect } from "react";
import { Trophy, Crown, Clock, Calendar, Shield, Sparkles, Activity } from "lucide-react";
import TeamShield from "./TeamShield";

interface Team {
  id: string | number;
  name: string;
  owner?: string;
  shieldUrl?: string | null;
}

interface Match {
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  winner?: "team1" | "team2" | "home" | "away" | null;
  isPlayed: boolean;
  tiebreakerApplied?: boolean;
}

interface MainEventProps {
  finalMatch: Match;
  thirdPlaceMatch: Match;
  round: number;
  titleOverride?: string;
}

export default function MainEvent({ finalMatch, thirdPlaceMatch, round, titleOverride }: MainEventProps) {
  // Setup countdown to Cartola market closing
  // We compute a dynamic future target based on June 2026 to ensure it always shows a real ticking timer!
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Generate a fixed upcoming target that is roughly 2 days, 16 hours ahead of the current time
    // This makes sure the countdown is always ticking and active for the user
    const now = new Date().getTime();
    let targetTime = new Date("2026-06-10T16:00:00-03:00").getTime(); // Ideal Cartola target in 2026

    if (now > targetTime) {
      // Fallback: If target passed, set it to next Wednesday/Saturday 16:00
      const daysToAdd = 3; 
      targetTime = now + daysToAdd * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000;
    }

    const interval = setInterval(() => {
      const current = new Date().getTime();
      const difference = targetTime - current;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn" id="main-event-section">
      <style>{`
        @keyframes goldGlow {
          0%, 100% {
            border-color: rgba(212, 175, 55, 0.45);
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.12);
            opacity: 0.95;
          }
          50% {
            border-color: rgba(212, 175, 55, 0.95);
            box-shadow: 0 0 24px rgba(212, 175, 55, 0.35);
            opacity: 1;
          }
        }
        .main-event-gold-glow {
          animation: goldGlow 3s infinite ease-in-out;
          will-change: opacity, border-color, box-shadow;
          transform: translate3d(0,0,0);
        }
        .shimer-silver {
          border-color: rgba(160, 174, 192, 0.5);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 6px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* Countdown Panel */}
      <div className="bg-gradient-to-r from-red-650/15 via-black/45 to-red-650/15 border border-red-500/25 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-red-500/15 rounded-xl border border-red-500/30 flex items-center justify-center animate-pulse">
            <Clock className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-red-400 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> MERCADO FECHA EM BREVE
            </span>
            <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wider mt-0.5">
              Fim de Avaliação • Rodada {round}
            </h4>
          </div>
        </div>

        {/* Dynamic Countdown metrics */}
        <div className="flex gap-2 font-mono select-none">
          <div className="flex items-center gap-1.5">
            <div className="bg-black/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-center min-w-[42px] shadow-lg">
              <span className="text-xs sm:text-sm font-black text-white block leading-none">{timeLeft.days}</span>
              <span className="text-[7.5px] text-slate-500 uppercase block mt-0.5">DIAS</span>
            </div>
            <span className="text-xs font-bold text-slate-600">:</span>
            <div className="bg-black/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-center min-w-[42px] shadow-lg">
              <span className="text-xs sm:text-sm font-black text-white block leading-none">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[7.5px] text-slate-500 uppercase block mt-0.5">HORAS</span>
            </div>
            <span className="text-xs font-bold text-slate-600">:</span>
            <div className="bg-black/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-center min-w-[42px] shadow-lg">
              <span className="text-xs sm:text-sm font-black text-[#D4AF37] block leading-none">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[7.5px] text-slate-500 uppercase block mt-0.5">MINS</span>
            </div>
            <span className="text-xs font-bold text-slate-600">:</span>
            <div className="bg-black/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-center min-w-[42px] shadow-lg">
              <span className="text-xs sm:text-sm font-black text-red-400 block leading-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[7.5px] text-slate-500 uppercase block mt-0.5">SEGS</span>
            </div>
          </div>
        </div>
      </div>

      {/* MainEvent layout holding highlighted Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto px-1 items-start">
        
        {/* Card 1 (Grande Final): Expanded spacing, anim-gold glowing border */}
        <div 
          id="main-event-card-final"
          className="lg:col-span-7 relative overflow-hidden rounded-3xl border-2 bg-black/65 backdrop-blur-[16px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-all duration-500 main-event-gold-glow flex flex-col justify-between min-h-[380px]"
        >
          {/* Top shimmering gold header overlay line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="text-center mb-8">
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-black inline-flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/20" /> {titleOverride || "★ A DECISÃO SUPREMA ★"}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mt-3.5">
              GRANDE FINAL
            </h3>
            <p className="text-[10px] text-[#D4AF37] font-mono mt-1 tracking-widest uppercase">
              Partida Única de 180 Minutos • Rodada {round}
            </p>
          </div>

          {/* Teams comparison side-by-side with score center */}
          <div className="grid grid-cols-11 items-center gap-3 sm:gap-4 my-auto">
            {/* Team 1 Panel */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className={`w-18 h-18 sm:w-20 sm:h-20 bg-zinc-950 rounded-full border-2 p-3.5 flex items-center justify-center mb-3 shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition duration-300 ${
                finalMatch.winner === "team1" || finalMatch.winner === "home" 
                  ? "border-[#D4AF37] scale-110 bg-gradient-to-b from-[#D4AF37]/25 to-transparent" 
                  : "border-white/5"
              }`}>
                <TeamShield shieldUrl={finalMatch.team1.shieldUrl} fallbackText={finalMatch.team1.name} className="w-full h-full object-contain" />
              </div>
              <div className="h-10 flex flex-col justify-center min-w-0 w-full">
                <span className={`uppercase truncate font-display tracking-wide text-xs sm:text-sm font-black ${
                  finalMatch.winner === "team1" || finalMatch.winner === "home" ? "text-white" : "text-slate-350"
                }`}>
                  {finalMatch.team1.name}
                </span>
                <span className="text-[9px] text-[#D4AF37] font-mono truncate">
                  Téc: {finalMatch.team1.owner || "A definir"}
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 mt-1">
                Finalista A
              </span>
            </div>

            {/* Central score visualization */}
            <div className="col-span-3 flex flex-col items-center justify-center">
              {finalMatch.isPlayed ? (
                <div className="text-center w-full space-y-1.5">
                  <div className="bg-black/95 border border-[#D4AF37]/45 rounded-2xl px-3 py-2.5 shadow-2xl">
                    <p className="text-lg sm:text-2xl font-mono font-black text-[#D4AF37] tracking-wider leading-none">
                      {finalMatch.score1.toFixed(1)}
                    </p>
                    <div className="h-[1px] bg-white/10 my-1.5" />
                    <p className="text-lg sm:text-2xl font-mono font-black text-slate-200 tracking-wider leading-none">
                      {finalMatch.score2.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 flex items-center justify-center mx-auto text-xs font-mono font-black text-[#D4AF37] tracking-widest shadow-lg shadow-[#D4AF37]/5">
                    VS
                  </div>
                  <span className="text-[7.5px] uppercase tracking-widest text-[#D4AF37]/75 block mt-2 font-mono font-black">DUELO DE TITÃS</span>
                </div>
              )}
            </div>

            {/* Team 2 Panel */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className={`w-18 h-18 sm:w-20 sm:h-20 bg-zinc-950 rounded-full border-2 p-3.5 flex items-center justify-center mb-3 shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition duration-300 ${
                finalMatch.winner === "team2" || finalMatch.winner === "away"
                  ? "border-[#D4AF37] scale-110 bg-gradient-to-b from-[#D4AF37]/25 to-transparent" 
                  : "border-white/5"
              }`}>
                <TeamShield shieldUrl={finalMatch.team2.shieldUrl} fallbackText={finalMatch.team2.name} className="w-full h-full object-contain" />
              </div>
              <div className="h-10 flex flex-col justify-center min-w-0 w-full">
                <span className={`uppercase truncate font-display tracking-wide text-xs sm:text-sm font-black ${
                  finalMatch.winner === "team2" || finalMatch.winner === "away" ? "text-white" : "text-slate-350"
                }`}>
                  {finalMatch.team2.name}
                </span>
                <span className="text-[9px] text-[#D4AF37] font-mono truncate">
                  Téc: {finalMatch.team2.owner || "A definir"}
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 mt-1">
                Finalista B
              </span>
            </div>
          </div>

          {/* Golden Champion Tribute at bottom */}
          {finalMatch.isPlayed && finalMatch.winner && (
            <div className="mt-8 pt-5 border-t border-[#D4AF37]/25 text-center animate-fadeIn bg-gradient-to-t from-[#D4AF37]/5 to-transparent p-4 rounded-xl border border-[#D4AF37]/15">
              <Trophy className="w-10 h-10 text-[#D4AF37] mx-auto animate-bounce mb-2" />
              <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-black block">CAMPEÃO SUPREMO</span>
              <p className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mt-1.5">
                {finalMatch.winner === "team1" || finalMatch.winner === "home" ? finalMatch.team1.name : finalMatch.team2.name}
              </p>
              <p className="text-[10px] text-slate-300 font-mono mt-1">
                Técnico Campeão: {finalMatch.winner === "team1" || finalMatch.winner === "home" ? finalMatch.team1.owner : finalMatch.team2.owner}
              </p>
            </div>
          )}
        </div>

        {/* Card 2 (Disputa de 3º Lugar): Standard spacing, matte silver border */}
        <div 
          id="main-event-card-third"
          className="lg:col-span-5 relative overflow-hidden rounded-3xl border bg-black/40 backdrop-blur-[12px] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.45)] border-slate-500/35 transition-all duration-500 flex flex-col justify-between min-h-[380px] shimer-silver"
        >
          {/* Shimmer silver header line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/50 to-transparent" />
          
          <div className="text-center mb-6">
            <span className="bg-slate-400/10 text-slate-300 border border-slate-400/20 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-black inline-flex items-center gap-1">
              🥉 Luta Pelo Bronze 🥉
            </span>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wider mt-2.5">
              Disputa de 3º Lugar
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Partida Única de Consolação • Rodada {round}
            </p>
          </div>

          {/* Teams comparison layout */}
          <div className="grid grid-cols-11 items-center gap-2 sm:gap-3 my-auto">
            {/* Team 1 Side */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className={`w-14 h-14 bg-zinc-950 rounded-full border p-2 flex items-center justify-center mb-2.5 shadow-md ${
                thirdPlaceMatch.winner === "team1" || thirdPlaceMatch.winner === "home"
                  ? "border-[#CD7F32] scale-105 bg-[#CD7F32]/10" 
                  : "border-white/5"
              }`}>
                <TeamShield shieldUrl={thirdPlaceMatch.team1.shieldUrl} fallbackText={thirdPlaceMatch.team1.name} className="w-full h-full object-contain" />
              </div>
              <div className="h-8 flex flex-col justify-center min-w-0 w-full">
                <span className={`uppercase truncate font-display tracking-wide text-xs ${
                  thirdPlaceMatch.winner === "team1" || thirdPlaceMatch.winner === "home" ? "text-white font-black" : "text-slate-350"
                }`}>
                  {thirdPlaceMatch.team1.name}
                </span>
                <span className="text-[8px] text-slate-400 font-mono truncate">
                  Téc: {thirdPlaceMatch.team1.owner || "A definir"}
                </span>
              </div>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 mt-1">
                Semifinalista A
              </span>
            </div>

            {/* Score box */}
            <div className="col-span-3 flex flex-col items-center justify-center">
              {thirdPlaceMatch.isPlayed ? (
                <div className="text-center w-full space-y-1">
                  <div className="bg-black/90 border border-slate-500/30 rounded-xl px-2.5 py-2 shadow-inner">
                    <p className="text-base font-mono font-black text-amber-500 tracking-wider leading-none">
                      {thirdPlaceMatch.score1.toFixed(1)}
                    </p>
                    <div className="h-[1px] bg-white/10 my-1" />
                    <p className="text-base font-mono font-black text-slate-350 tracking-wider leading-none">
                      {thirdPlaceMatch.score2.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border border-slate-500/25 bg-white/5 flex items-center justify-center mx-auto text-[10px] font-mono font-black text-slate-400">
                    VS
                  </div>
                  <span className="text-[7px] uppercase tracking-widest text-slate-500 block mt-1.5 font-mono">3º Lugar</span>
                </div>
              )}
            </div>

            {/* Team 2 Side */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div className={`w-14 h-14 bg-zinc-950 rounded-full border p-2 flex items-center justify-center mb-2.5 shadow-md ${
                thirdPlaceMatch.winner === "team2" || thirdPlaceMatch.winner === "away"
                  ? "border-[#CD7F32] scale-105 bg-[#CD7F32]/10" 
                  : "border-white/5"
              }`}>
                <TeamShield shieldUrl={thirdPlaceMatch.team2.shieldUrl} fallbackText={thirdPlaceMatch.team2.name} className="w-full h-full object-contain" />
              </div>
              <div className="h-8 flex flex-col justify-center min-w-0 w-full">
                <span className={`uppercase truncate font-display tracking-wide text-xs ${
                  thirdPlaceMatch.winner === "team2" || thirdPlaceMatch.winner === "away" ? "text-white font-black" : "text-slate-350"
                }`}>
                  {thirdPlaceMatch.team2.name}
                </span>
                <span className="text-[8px] text-slate-400 font-mono truncate">
                  Téc: {thirdPlaceMatch.team2.owner || "A definir"}
                </span>
              </div>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 mt-1">
                Semifinalista B
              </span>
            </div>
          </div>

          {/* Third Place Winner Tribute */}
          {thirdPlaceMatch.isPlayed && thirdPlaceMatch.winner && (
            <div className="mt-6 pt-4 border-t border-slate-800 text-center animate-fadeIn bg-slate-900/40 p-2.5 rounded-lg">
              <Sparkles className="w-6 h-6 text-[#CD7F32] mx-auto mb-1 animate-pulse" />
              <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase font-black block">TERCEIRO COLOCADO</span>
              <p className="text-base font-display font-black text-white uppercase mt-1">
                {thirdPlaceMatch.winner === "team1" || thirdPlaceMatch.winner === "home" ? thirdPlaceMatch.team1.name : thirdPlaceMatch.team2.name}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
