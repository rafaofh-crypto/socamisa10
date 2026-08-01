import React from "react";
import { Trophy, Star, Calendar, Sparkles, Settings, Award, Crown, BookOpen } from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "rodada" | "mensal" | "copa" | "copa_b10" | "calendario" | "regras" | "admin";
  setActiveTab: (tab: "dashboard" | "rodada" | "mensal" | "copa" | "copa_b10" | "calendario" | "regras" | "admin") => void;
  currentRound: number;
  isM10Enabled?: boolean;
  isB10Enabled?: boolean;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  currentRound,
  isM10Enabled = true,
  isB10Enabled = true
}: HeaderProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Trophy },
    { id: "rodada", label: "Destaques", icon: Star },
    { id: "mensal", label: "Mensal", icon: Calendar },
    ...(isM10Enabled ? [{ id: "copa" as const, label: "Copa M10", icon: Award }] : []),
    ...(isB10Enabled ? [{ id: "copa_b10" as const, label: "Copa B10", icon: Crown }] : []),
    { id: "calendario", label: "Calendário", icon: Calendar },
    { id: "regras", label: "Regras", icon: BookOpen },
    { id: "admin", label: "Admin", icon: Settings }
  ] as const;

  return (
    <header className="relative z-10 p-5 border-b border-gold/15 bg-charcoal-dark/80 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shadow-lg shadow-gold/5">
            <span className="font-display font-black text-lg text-gold leading-none tracking-tighter">10</span>
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-wider text-white uppercase flex items-center gap-1.5 leading-none">
              <span>Só Camisa 10</span>
              <span className="text-gold">2026</span>
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-1">SaaS de Gestão e Ligas Fantasy</p>
          </div>
        </div>

        {/* Navigation links (5 Tabs) */}
        <nav className="flex bg-charcoal-dark/95 border border-gold/10 p-1 rounded-xl scrollbar-none overflow-x-auto max-w-full notranslate" translate="no">
          {navItems.map((tab) => {
            const TabIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer uppercase tracking-wider shrink-0 ${
                  active 
                    ? "bg-gold text-charcoal-dark font-display font-black active-glow shadow-md shadow-gold/10" 
                    : "text-slate-400 hover:text-white hover:bg-gold/5"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="notranslate whitespace-nowrap" translate="no">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
