import React, { useState, useMemo } from 'react';
import { CartolaTeam } from '../services/cartolaService';
import { buildGazetaEdition } from '../services/gazeta/gazetaEngine';
import { ARCHIVED_EDITIONS_CATALOG } from '../services/gazeta/gazetaArchive';
import { GazetaStory, CupMatchReport, RadarClubDigest } from '../services/gazeta/types';
import TeamShield from './TeamShield';
import { 
  Newspaper, 
  Trophy, 
  Flame, 
  Sparkles, 
  Check, 
  Calendar, 
  Crown, 
  Search, 
  ShieldCheck, 
  Share2, 
  Zap, 
  RotateCcw,
  BookOpen,
  History,
  ChevronRight
} from 'lucide-react';

interface GazetaEditionViewProps {
  teams: CartolaTeam[];
  currentRound: number;
}

export const GazetaEditionView: React.FC<GazetaEditionViewProps> = ({ teams = [], currentRound = 30 }) => {
  const safeCurrentRound = Number.isFinite(currentRound) ? currentRound : 30;

  // Selected round defaults to safeCurrentRound, capped between 1 and 38
  const [selectedRound, setSelectedRound] = useState<number>(() => Math.min(Math.max(safeCurrentRound, 1), 38));
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'OITAVAS' | 'ELIMINADOS' | 'TOP10'>('ALL');

  // Compute all available editions for the archive selector (R30, R29, R28, and any newer round like R31)
  const availableEditions = useMemo(() => {
    const list = [...ARCHIVED_EDITIONS_CATALOG];
    if (safeCurrentRound > 30 && !list.some(e => e.round === safeCurrentRound)) {
      list.unshift({
        editionNumber: safeCurrentRound,
        round: safeCurrentRound,
        dateStr: 'Outubro de 2026',
        badge: `RODADA ${safeCurrentRound} • ATUAL`,
        badgeColor: 'gold',
        title: `Oitavas de Final da B10 e a Corrida pelo Trono Geral`,
        subheadline: `Cobertura atualizada em tempo real da Rodada ${safeCurrentRound}.`,
        highlights: [`Rodada ${safeCurrentRound}`, 'Oitavas B10', 'Disputa do Mês'],
        isCurated: false
      });
    }
    return list.sort((a, b) => b.round - a.round);
  }, [safeCurrentRound]);

  // Build the complete edition dynamically with safety
  const edition = useMemo(() => {
    try {
      return buildGazetaEdition(teams, selectedRound);
    } catch (e) {
      console.error("Falha ao montar edição da Gazeta com times recebidos:", e);
      try {
        return buildGazetaEdition([], selectedRound);
      } catch (err2) {
        console.error("Falha crítica ao montar edição da Gazeta:", err2);
        return null;
      }
    }
  }, [teams, selectedRound]);

  const handleCopyWhatsApp = async () => {
    if (!edition?.whatsappText) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(edition.whatsappText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = edition.whatsappText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      console.warn("Falha ao copiar boletim para área de transferência:", e);
    }
  };

  // Filter radar clubs
  const filteredClubs = useMemo(() => {
    if (!edition?.radarClubs || !Array.isArray(edition.radarClubs)) return [];
    return edition.radarClubs.filter(club => {
      const nameStr = (club.name || '').toLowerCase();
      const ownerStr = (club.owner || '').toLowerCase();
      const term = (searchTerm || '').toLowerCase();

      const matchesSearch = nameStr.includes(term) || ownerStr.includes(term);
      if (!matchesSearch) return false;

      const statusLabel = club.b10StatusLabel || '';
      if (selectedFilter === 'OITAVAS') {
        return statusLabel.includes('Oitavas');
      }
      if (selectedFilter === 'ELIMINADOS') {
        return statusLabel.includes('Eliminado') || statusLabel.includes('Playoff');
      }
      if (selectedFilter === 'TOP10') {
        return (club.geralRank || 99) <= 10;
      }
      return true;
    });
  }, [edition?.radarClubs, searchTerm, selectedFilter]);

  const renderBadge = (badge: string, color: GazetaStory['badgeColor']) => {
    const colorClasses = {
      gold: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
      emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      red: 'bg-red-500/15 text-red-400 border-red-500/30'
    }[color || 'gold'] || 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30';

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-black border ${colorClasses}`}>
        <Sparkles className="w-3 h-3" />
        {badge}
      </span>
    );
  };

  if (!edition || !edition.headlineStory) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121216] p-12 text-center space-y-4 max-w-2xl mx-auto my-8">
        <Newspaper className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
        <h3 className="text-xl font-bold font-display uppercase text-white">Consolidando Edição #{selectedRound}...</h3>
        <p className="text-xs text-slate-400 font-mono">Processando estatísticas da Rodada {selectedRound} e cruzando resultados oficiais.</p>
        <button
          onClick={() => setSelectedRound(30)}
          className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-all cursor-pointer"
        >
          Voltar para Edição Canônica #30
        </button>
      </div>
    );
  }

  const currentArchiveItem = availableEditions.find(e => e.round === selectedRound);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. SELETOR DE HISTÓRICO DE EDIÇÕES (ARQUIVO OFICIAL) */}
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#14141a] via-[#101014] to-[#14141a] p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <History className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-display uppercase text-white tracking-wider">
                  Arquivo de Edições da Gazeta
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  HISTÓRICO PRESERVADO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Navegue pelas edições anteriores e nunca perca as crônicas de cada rodada
              </p>
            </div>
          </div>

          {/* LISTA DE EDIÇÕES SELECIONÁVEIS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {availableEditions.map(ed => {
              const isSelected = selectedRound === ed.round;
              return (
                <button
                  key={ed.round}
                  onClick={() => setSelectedRound(ed.round)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/25 scale-102 border border-[#D4AF37]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#D4AF37]'}`} />
                  <span>Edição #{ed.round}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-black/30 text-black' : 'bg-black/40 text-slate-400'
                  }`}>
                    {ed.round === 30 ? 'Fase 4 B10' : ed.round === 29 ? 'Final M10' : ed.round === 28 ? 'Playoffs' : `R${ed.round}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTA DA EDIÇÃO ATUALMENTE EXIBIDA */}
        {currentArchiveItem && (
          <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              <strong>Edição #{selectedRound}:</strong> {currentArchiveItem.title}
            </span>
            <span className="text-slate-500">{currentArchiveItem.dateStr}</span>
          </div>
        )}
      </div>

      {/* 2. MASTHEAD DO JORNAL */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-[#0e0e12] via-[#14141a] to-[#0a0a0d] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                EDIÇÃO #{selectedRound} • JORNAL DA TEMPORADA
              </span>
              <span className="text-slate-500 text-xs font-mono">• {edition.dateStr}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white flex items-center gap-3">
              <Newspaper className="w-8 h-8 sm:w-11 h-11 text-[#D4AF37]" />
              Gazeta <span className="text-[#D4AF37]">Só Camisa 10</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-sans">
              O Jornal Oficial da Temporada · Cobertura Factual dos 50 Clubes, Copas B10/M10 e Disputas Mensais
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Boletim Copiado!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Copiar Edição p/ WhatsApp
                </>
              )}
            </button>
          </div>
        </div>

        {/* TERMÔMETRO RÁPIDO DA RODADA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Maior Mitada R{selectedRound}</span>
            <div className="text-sm sm:text-base font-black text-blue-400 truncate font-display">
              {edition.stats?.highestScore?.clubName || 'Craque da Rodada'}
            </div>
            <span className="text-xs font-mono text-slate-300 font-bold">{edition.stats?.highestScore?.score || 0} pts</span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Líder do Geral</span>
            <div className="text-sm sm:text-base font-black text-[#D4AF37] truncate font-display">
              {edition.geralTop5?.[0]?.name || 'Tainha Ovada FC'}
            </div>
            <span className="text-xs font-mono text-slate-300 font-bold">{edition.geralTop5?.[0]?.points || 2656.29} pts</span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Líder do Mês</span>
            <div className="text-sm sm:text-base font-black text-purple-400 truncate font-display">
              {edition.monthlyTop5?.[0]?.name || 'Carlao07'}
            </div>
            <span className="text-xs font-mono text-slate-300 font-bold">{edition.monthlyTop5?.[0]?.points || 257.24} pts</span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">Copa B10</span>
            <div className="text-sm sm:text-base font-black text-emerald-400 truncate font-display">
              {selectedRound >= 30 ? '16 VAGAS HOMOLOGADAS' : 'FASE ELIMINATÓRIA'}
            </div>
            <span className="text-xs font-mono text-slate-300 font-bold">{selectedRound >= 30 ? 'Oitavas na R31' : `Rodada ${selectedRound}`}</span>
          </div>
        </div>
      </div>

      {/* 3. A GRANDE MANCHETE DA CAPA (HERO STORY) */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-[#111116] p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {renderBadge(edition.headlineStory.badge, edition.headlineStory.badgeColor)}
            <span className="text-slate-500 text-xs font-mono uppercase font-bold tracking-widest">
              Reportagem Especial de Capa • Edição #{selectedRound}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
            {edition.headlineStory.headline}
          </h2>

          <p className="text-base sm:text-xl font-sans text-slate-300 font-medium leading-relaxed border-l-4 border-[#D4AF37] pl-4 py-1">
            {edition.headlineStory.subheadline}
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {edition.headlineStory.lead}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(edition.headlineStory.body || []).map((p, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {p}
              </div>
            ))}
          </div>

          {/* CLUBES ENVOLVIDOS NA MANCHETE */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Protagonistas:</span>
              {(edition.headlineStory.clubsInvolved || []).map(club => (
                <div key={club.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10">
                  <TeamShield shieldUrl={club.shieldUrl} fallbackText={club.name} className="w-5 h-5" />
                  <span className="text-xs font-bold text-white uppercase">{club.name}</span>
                  {club.role && <span className="text-[10px] font-mono text-[#D4AF37]">({club.role})</span>}
                </div>
              ))}
            </div>

            {/* EVIDÊNCIAS FACTUAIS CONFERIDAS */}
            <div className="flex flex-wrap gap-2">
              {(edition.headlineStory.evidences || []).map((ev, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <strong>{ev.label}:</strong> {ev.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. HISTÓRIAS CRUZADAS: O MESMO CLUBE EM DUAS FRENTES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Histórias Cruzadas da Temporada
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              O mesmo clube observado em diferentes competições: glórias, paradoxos e reviravoltas.
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            INTEGRAÇÃO MULTI-TORNEIO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(edition.crossStories || []).map(story => (
            <div key={story.id} className="rounded-3xl border border-white/10 bg-[#121216] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {renderBadge(story.badge, story.badgeColor)}
                </div>

                <h4 className="text-base sm:text-lg font-black font-display uppercase text-white leading-snug group-hover:text-[#D4AF37] transition-colors">
                  {story.headline}
                </h4>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {story.lead}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                {(story.evidences || []).map((ev, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400 truncate max-w-[150px]">{ev.label}</span>
                    <span className="text-[#D4AF37] font-bold">{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DESTAQUES DA RODADA (REPORTAGENS ESPECIAIS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" />
              Grandes Reportagens da Edição #{selectedRound}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              As atuações memoráveis, recordes e duelos de alto impacto apurados com rigor jornalístico.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(edition.featuredStories || []).map(story => (
            <div key={story.id} className="rounded-3xl border border-white/10 bg-[#121216] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden hover:border-blue-500/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {renderBadge(story.badge, story.badgeColor)}
                </div>

                <h4 className="text-base sm:text-lg font-black font-display uppercase text-white leading-snug">
                  {story.headline}
                </h4>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {story.subheadline}
                </p>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {story.lead}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                {(story.evidences || []).map((ev, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">{ev.label}</span>
                    <span className="text-emerald-400 font-bold">{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. GIRO DAS COPAS: B10 FASE 4 & M10 MUNDIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABELA DOS 16 CONFRONTOS B10 */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#121216] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-black text-[#D4AF37] block">
                FASE 4 • 16 AVOS DE FINAL (180 MINUTOS)
              </span>
              <h3 className="text-lg font-black font-display uppercase text-white">
                Copa B10 · Os 16 Confrontos Homologados pelo Motor do Torneio
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              100% HOMOLOGADOS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {(edition.b10Digest || []).map(match => (
              <div 
                key={match.matchNumber}
                className={`p-3.5 rounded-2xl border text-xs font-mono transition-all ${
                  match.isUpset 
                    ? 'bg-amber-950/20 border-amber-500/30' 
                    : 'bg-black/40 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-[10px] text-slate-400">
                  <span>Confronto #{match.matchNumber}</span>
                  {(match.diff ?? 0) <= 0.5 ? (
                    <span className="text-red-400 font-black uppercase flex items-center gap-1 animate-pulse">
                      🔥 Drama (+{(match.diff ?? 0).toFixed(2)})
                    </span>
                  ) : match.isUpset ? (
                    <span className="text-amber-400 font-black uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Zebra (+{(match.diff ?? 0).toFixed(2)})
                    </span>
                  ) : (
                    <span className="text-slate-500">Dif: {(match.diff ?? 0).toFixed(2)} pts</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className={`flex justify-between items-center ${match.winnerId === match.homeClub?.id ? 'text-white font-bold' : 'text-slate-400'}`}>
                    <span className="truncate max-w-[140px]">{match.homeClub?.name || 'Clube Casa'}</span>
                    <span>{match.homeAggregate} <span className="text-[9px] text-slate-500">({match.homeLeg1}+{match.homeLeg2})</span></span>
                  </div>
                  <div className={`flex justify-between items-center ${match.winnerId === match.awayClub?.id ? 'text-white font-bold' : 'text-slate-400'}`}>
                    <span className="truncate max-w-[140px]">{match.awayClub?.name || 'Clube Visitante'}</span>
                    <span>{match.awayAggregate} <span className="text-[9px] text-slate-500">({match.awayLeg1}+{match.awayLeg2})</span></span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Classificado às Oitavas:</span>
                  <span className="text-[#D4AF37] font-black uppercase truncate max-w-[150px]">
                    ✓ {match.winnerName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PÓDIO M10 E TEMPORADA GERAL TOP 5 */}
        <div className="space-y-6">
          {/* M10 MUNDIAL */}
          <div className="rounded-3xl border border-white/10 bg-[#121216] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase font-black text-blue-400 block">
              COPA M10 • MUNDIAL ENCERRADO NA R29
            </span>
            <h3 className="text-lg font-black font-display uppercase text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Pódio Mundial Homologado
            </h3>

            <div className="space-y-2 text-xs font-mono pt-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="font-bold text-amber-300">🥇 Campeão: Tainha Ovada FC</span>
                <span className="text-[10px] text-amber-400 font-mono">+2.18 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-between">
                <span className="text-slate-300">🥈 Vice: Dois Vizinhos SA</span>
                <span className="text-[10px] text-slate-400 font-mono">117.68 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-900/20 border border-amber-700/20 flex items-center justify-between">
                <span className="text-amber-200">🥉 3º Lugar: Camisa Pesada SA</span>
                <span className="text-[10px] text-amber-300 font-mono">132.96 pts</span>
              </div>
            </div>
          </div>

          {/* TOP 5 GERAL */}
          <div className="rounded-3xl border border-white/10 bg-[#121216] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase font-black text-[#D4AF37] block">
              CAMPEONATO GERAL APÓS R{selectedRound}
            </span>
            <h3 className="text-lg font-black font-display uppercase text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              Pelotão de Frente (G-5)
            </h3>

            <div className="space-y-1.5 text-xs font-mono pt-2">
              {(edition.geralTop5 || []).map(t => (
                <div key={t.rank} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-300 truncate max-w-[160px]">
                    <strong className="text-[#D4AF37]">{t.rank}º</strong> {t.name}
                  </span>
                  <span className="font-bold text-white">{t.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. RADAR EDITORIAL DOS 50 CLUBES (PESQUISÁVEL) */}
      <div className="rounded-3xl border border-white/10 bg-[#121216] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-[#D4AF37]" />
              Radar Editorial dos 50 Clubes
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              O status factual e a manchete individual de cada participante apurados sem dados fictícios.
            </p>
          </div>

          {/* FILTROS E BUSCA */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar clube ou cartoleiro..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedFilter === 'ALL' ? 'bg-[#D4AF37] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Todos (50)
              </button>
              <button
                onClick={() => setSelectedFilter('OITAVAS')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedFilter === 'OITAVAS' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Oitavas B10
              </button>
              <button
                onClick={() => setSelectedFilter('ELIMINADOS')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedFilter === 'ELIMINADOS' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Eliminados
              </button>
              <button
                onClick={() => setSelectedFilter('TOP10')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedFilter === 'TOP10' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Top 10 Geral
              </button>
            </div>
          </div>
        </div>

        {/* LISTAGEM DOS CARDS DOS 50 CLUBES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map(club => (
            <div key={club.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-slate-300 border border-white/5">
                    {club.highlightTag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Geral: #{club.geralRank}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <TeamShield shieldUrl={club.shieldUrl} fallbackText={club.name} className="w-8 h-8 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-black font-display uppercase text-white truncate">{club.name}</h5>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{club.owner}</p>
                  </div>
                </div>

                <h6 className="text-xs font-bold text-[#D4AF37] leading-tight mb-1">
                  {club.headline}
                </h6>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {club.miniSummary}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase">R{selectedRound}</span>
                  <span className="font-bold text-white">{club.roundScore} pts</span>
                </div>
                <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase">Geral</span>
                  <span className="font-bold text-[#D4AF37]">{club.geralPoints}</span>
                </div>
                <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase">Copa B10</span>
                  <span className={`font-bold truncate block ${club.b10StatusLabel.includes('Oitavas') ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {club.b10StatusLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GazetaEditionView;
