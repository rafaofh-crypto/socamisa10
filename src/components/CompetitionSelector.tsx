import React from "react";
import { Award, Crown, Star } from "lucide-react";
import { motion } from "motion/react";

interface CompetitionSelectorProps {
  activeTab: "copa" | "copa_b10";
  onSelect: (tab: "copa" | "copa_b10") => void;
}

export default function CompetitionSelector({ activeTab, onSelect }: CompetitionSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8" id="competition-selector-container">
      {/* Selector Wrapper */}
      <div className="bg-black/40 p-2 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle decorative background lights */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full filter blur-[50px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-amber-500/5 rounded-full filter blur-[50px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          
          {/* Tab 1: Copa M10 (World Cup Theme) */}
          <button
            id="btn-select-copam10"
            onClick={() => onSelect("copa")}
            className={`relative overflow-hidden p-4 rounded-xl flex items-center justify-between transition-all duration-300 group text-left ${
              activeTab === "copa"
                ? "bg-gradient-to-r from-slate-950 via-[#0b1a3a] to-[#122b51] border-2 border-slate-300 shadow-[0_0_25px_rgba(255,255,255,0.06)]"
                : "bg-black/25 border border-white/5 opacity-60 hover:opacity-90 grayscale-[40%] hover:grayscale-0"
            }`}
          >
            {/* World Cup themed shine accent */}
            {activeTab === "copa" && (
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
            )}
            
            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-lg flex items-center justify-center transition ${
                activeTab === "copa"
                  ? "bg-white/10 text-white border border-slate-400/30"
                  : "bg-white/5 text-slate-400 group-hover:bg-white/10"
              }`}>
                <Award className={`w-6 h-6 ${activeTab === "copa" ? "text-slate-200" : "text-slate-400"}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-display font-black tracking-wider text-white uppercase">
                    Copa M10
                  </h3>
                  <span className="bg-slate-400/15 text-slate-300 border border-slate-400/20 text-[7px] font-mono font-black py-0.5 px-1.5 rounded uppercase tracking-widest">
                    World Cup
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight">
                  Tema Azul Marinho, Branco e Prata
                </p>
              </div>
            </div>

            {/* Silver Trophy Star Details */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[8px] block font-mono text-slate-500 uppercase">Campeonato Principal</span>
                <span className="text-[10px] font-mono text-slate-300 font-extrabold uppercase">R{17}-{38}</span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${
                activeTab === "copa" 
                  ? "bg-slate-300 border-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                  : "bg-transparent border-white/20"
              }`} />
            </div>
          </button>

          {/* Tab 2: Copa B10 (Elite Brasil Theme) */}
          <button
            id="btn-select-copab10"
            onClick={() => onSelect("copa_b10")}
            className={`relative overflow-hidden p-4 rounded-xl flex items-center justify-between transition-all duration-300 group text-left ${
              activeTab === "copa_b10"
                ? "bg-gradient-to-r from-slate-950 via-[#1a1200] to-[#251b03] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.08)]"
                : "bg-black/25 border border-white/5 opacity-60 hover:opacity-90 grayscale-[40%] hover:grayscale-0"
            }`}
          >
            {/* Elite Brasil Gold themed subtle emerald accent */}
            {activeTab === "copa_b10" && (
              <>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent skew-x-12 pointer-events-none" />
                <div className="absolute top-1 left-1.5 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-70" />
                </div>
              </>
            )}
            
            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-lg flex items-center justify-center transition ${
                activeTab === "copa_b10"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/45"
                  : "bg-white/5 text-slate-400 group-hover:bg-white/10"
              }`}>
                <Crown className={`w-6 h-6 ${activeTab === "copa_b10" ? "text-[#D4AF37]" : "text-slate-400"}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-display font-black tracking-wider text-white uppercase">
                    Copa B10
                  </h3>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[7px] font-mono font-black py-0.5 px-1.5 rounded uppercase tracking-widest">
                    Elite Brasil
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight">
                  Tema Charcoal, Rich Gold e Esmeralda
                </p>
              </div>
            </div>

            {/* Gold Crown Trophy details */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[8px] block font-mono text-slate-500 uppercase">Campeonato Especial</span>
                <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold uppercase">Fase Final</span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${
                activeTab === "copa_b10" 
                  ? "bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.7)]" 
                  : "bg-transparent border-white/20"
              }`} />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
