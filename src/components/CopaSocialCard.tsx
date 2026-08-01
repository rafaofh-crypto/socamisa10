import React from "react";
import TeamShield from "./TeamShield";
import { Trophy, Star, Sparkles, ShieldCheck, Award, AlertCircle } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  points: number;
}

interface CopaSocialCardProps {
  subTab: "classification" | "groups" | "bracket";
  cutRound: number;
  standingsAtCut: Participant[];
  finalRankings: any; // FinalRankings | null
  groups: Record<string, any[]>;
  isAwaitingRound20?: boolean;
  esperneioTeams?: any[];
}

export default function CopaSocialCard({
  subTab,
  cutRound,
  standingsAtCut,
  finalRankings,
  groups,
  isAwaitingRound20 = false,
  esperneioTeams = []
}: CopaSocialCardProps) {

  const getTeamInitials = (name: string) => {
    if (!name) return "S10";
    const clean = name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  // Dynamic Font Scaling helper for team names
  const getFontSizeClass = (name: string) => {
    if (name.length > 20) return "text-sm sm:text-base font-bold leading-tight";
    if (name.length > 14) return "text-base sm:text-lg font-extrabold leading-tight";
    return "text-lg sm:text-xl font-black leading-tight";
  };

  // Render PREMIUM PODIUM FOR BRACKET VIEW (The ultimate tournament champions showcase)
  if (subTab === "bracket") {
    if (isAwaitingRound20) {
      return (
        <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl text-center">
          <Trophy className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4 animate-pulse" />
          <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
            Galeria da Glória Eterna
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            A galeria de campeões será aberta assim que a fase final do mata-mata for iniciada, após a consolidação da rodada 20.
          </p>
        </div>
      );
    }

    const hasChampion = Boolean(finalRankings && finalRankings.champion && finalRankings.champion.name);

    if (!hasChampion) {
      return (
        <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
          {/* Aesthetic Overlay glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Header segment */}
          <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                Consagração dos Campeões • Copa M10
              </div>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                Galeria da Glória Eterna
              </h3>
              <p className="text-xs text-slate-400">
                O pódio oficial consagrando os titãs que aniquilarem seus oponentes no chaveamento mata-mata.
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20 tracking-widest uppercase shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                COMPETIÇÃO EM ANDAMENTO
              </span>
            </div>
          </div>

          {/* Notice box */}
          <div className="relative z-10 py-10 px-6 text-center bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-1">
              <Trophy className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h4 className="font-display font-black text-base text-white uppercase tracking-tight">
              Aguardando Definição dos Campeões
            </h4>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              A Copa M10 está em andamento. A Galeria da Glória Eterna será preenchida automaticamente com o Campeão, Vice e Pódio conforme os confrontos forem concluídos.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full uppercase font-bold">
              💡 Dica: Você pode simular os confrontos da chave abaixo para testar os resultados
            </div>
          </div>

          {/* Bottom banner seal */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 font-mono text-[9px] relative z-10">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>PAINEL DOS CAMPEÕES COPA M10 &bull; AGUARDANDO RESULTADOS FINAIS DO MATA-MATA</span>
          </div>
        </div>
      );
    }

    const champ = finalRankings.champion;
    const runner = finalRankings.runner_up;
    const third = finalRankings.third_place || { name: "—", owner: "—" };
    const fourth = finalRankings.fourth_place || { name: "—", owner: "—" };

    const initials = getTeamInitials(champ.name);

    return (
      <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
        {/* Aesthetic Overlay glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header segment */}
        <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider animate-pulse">
              <Trophy className="w-3.5 h-3.5" />
              Consagração dos Campeões • Copa M10
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
              Galeria da Glória Eterna
            </h3>
            <p className="text-xs text-slate-400">
              O pódio oficial consagrando os titãs que aniquilaram seus oponentes no chaveamento mata-mata.
            </p>
          </div>

          <div className="flex items-center">
            <span className="text-[11px] font-mono font-black text-white bg-gradient-to-r from-purple-600 to-[#D4AF37] px-4 py-2 rounded-lg border border-white/10 tracking-widest uppercase shadow-md">
              MATA-MATA ATIVO
            </span>
          </div>
        </div>

        {/* Majestic Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          
          {/* CHAMPION: 1º COLOCADO (Special styling center) */}
          <div className="group md:col-span-2 bg-gradient-to-b from-[#121212]/95 to-purple-950/20 border-2 border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.22)] rounded-2xl p-6 flex flex-col justify-between min-h-[240px] transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#D4AF37]" />
                  CAMPEÃO DOS CAMPEÕES
                </span>
                <Trophy className="w-5 h-5 text-[#D4AF37] animate-bounce" />
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 bg-[#D4AF37]/15 p-2 rounded-full border-2 border-[#D4AF37] shadow-lg flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-lg text-[#D4AF37]">{initials}</span>
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(champ.name)}`}>
                    {champ.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold truncate">Dono: {champ.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">1º LUGAR INVICTO</span>
              <span className="text-[11px] font-mono font-black text-white bg-gradient-to-r from-yellow-500 to-amber-600 px-3.5 py-1.5 rounded-lg border border-white/15 uppercase tracking-wide">
                R$ 300,00 + 🏆
              </span>
            </div>
          </div>

          {/* BRACKET: 2º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-slate-400/25 hover:border-slate-400/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-slate-300 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded">
                  🥈 VICE-CAMPEÃO
                </span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-slate-400/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={runner.shieldUrl} fallbackText={runner.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(runner.name)}`}>
                    {runner.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {runner.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">2º LUGAR</span>
              <span className="text-xs font-mono font-black text-slate-200 bg-slate-400/15 px-2.5 py-1 rounded">
                R$ 150,00
              </span>
            </div>
          </div>

          {/* BRACKET: 3º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-amber-700/25 hover:border-amber-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-amber-600 bg-amber-700/10 border border-amber-700/20 px-2 py-0.5 rounded">
                  🥉 3º COLOCADO
                </span>
                <Award className="w-4 h-4 text-amber-700" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-amber-700/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={third.shieldUrl} fallbackText={third.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(third.name)}`}>
                    {third.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {third.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">3º LUGAR</span>
              <span className="text-xs font-mono font-black text-amber-500 bg-amber-700/15 px-2.5 py-1 rounded">
                R$ 80,00
              </span>
            </div>
          </div>

          {/* BRACKET: 4º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-purple-550/25 hover:border-purple-550/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-purple-400 bg-purple-550/10 border border-purple-550/20 px-2 py-0.5 rounded">
                  🏅 4º COLOCADO
                </span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-purple-550/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={fourth.shieldUrl} fallbackText={fourth.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(fourth.name)}`}>
                    {fourth.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {fourth.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">4º LUGAR</span>
              <span className="text-xs font-mono font-black text-purple-400 bg-purple-550/15 px-2.5 py-1 rounded">
                R$ 50,00
              </span>
            </div>
          </div>

        </div>

        {/* Bottom banner seal */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 font-mono text-[9px] relative z-10">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>PAINEL DOS CAMPEÕES COPA M10 &bull; ATUALIZADO CONFORME O CHAVEAMENTO SIMULADO OU REAL</span>
        </div>
      </div>
    );
  }

  // Render CLASSIFICATION/GROUPS PRE-CUTOFF VIEW (Qualifiers List template)
  const isGroups = subTab === "groups";

  const cabecasDeChave = isAwaitingRound20
    ? Array.from({ length: 12 }, (_, i) => ({
        id: `placeholder-head-${i}`,
        name: "Aguardando Rod 20",
        owner: "—",
        points: 0,
        shieldUrl: ""
      }))
    : standingsAtCut.slice(0, 12);

  const eliminados = isAwaitingRound20
    ? Array.from({ length: 2 }, (_, i) => ({
        id: `placeholder-elim-${i}`,
        name: "Aguardando Rod 20",
        owner: "—",
        points: 0,
        shieldUrl: ""
      }))
    : (standingsAtCut.length >= 50
        ? standingsAtCut.slice(48, 50)
        : standingsAtCut.slice(-2));
  
  return (
    <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header element */}
      <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isGroups ? "Qualificação de Grupos Ativos" : `Fase Classificatória • Corte R${cutRound}`}
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
            {isGroups ? "Sorteio de Grupos & Cabeças de Chave" : "Destaques da Fase Classificatória"}
          </h3>
          <p className="text-xs text-slate-400">
            {isGroups 
              ? "Exibindo os classificados oficiais alocados nos grupos." 
              : `Consolidado dos 12 Cabeças de Chave principais e os times na disputa do Esperneio.`}
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-[11px] font-mono font-black text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 px-4 py-2 rounded-lg tracking-widest uppercase">
            {isGroups ? "12 CABEÇAS DE CHAVE" : "VITRINE DE CORTES"}
          </span>
        </div>
      </div>

      {/* Grid listing Cabeças de Chave */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4.5 h-4.5 text-[#D4AF37]" />
          <h4 className="text-xs font-mono font-black text-[#D4AF37] uppercase tracking-wider">
            👑 OS 12 CABEÇAS DE CHAVE (POTE 1 / TOP 12)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cabecasDeChave.map((team, idx) => {
            return (
              <div 
                key={team.id} 
                className={`rounded-xl p-3.5 border flex items-center gap-3 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 border-[#D4AF37]/20 bg-[#D4AF37]/10`}
              >
                <div className="w-6 text-center shrink-0 font-mono text-xs font-black text-[#D4AF37] flex flex-col items-center">
                  <span>{idx + 1}º</span>
                  <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                </div>

                <div className="w-8 h-8 bg-black/40 p-1 rounded-full border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} />
                </div>

                <div className="min-w-0 flex-1">
                  <h5 className={`uppercase font-display tracking-tight text-white leading-tight ${getFontSizeClass(team.name)}`}>
                    {team.name}
                  </h5>
                  <p className="text-[9.5px] text-slate-400 truncate">Téc: {team.owner}</p>
                  <p className="text-[10px] text-[#D4AF37] font-mono font-black mt-0.5 flex flex-wrap items-center gap-1">
                    <span>{team.points.toFixed(2)} pts</span>
                    <span className="text-[8px] bg-[#D4AF37]/20 px-1 py-0.2 rounded font-sans uppercase font-extrabold tracking-wide">CABEÇA</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section listing the Cutoff Esperneio elements */}
      {!isGroups && (
        <div className="relative z-10 pt-6 border-t border-white/10 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-[#c5a880] animate-pulse" />
              <h4 className="text-xs font-mono font-black text-[#c5a880] uppercase tracking-wider">
                ⚔️ RESULTADO DA RODADA DO ESPERNEIO (RODADA 21)
              </h4>
            </div>
            <span className="text-[10px] font-mono font-black text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30 px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-center">
              VAGAS 47 & 48 CLASSIFICADAS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {((esperneioTeams && esperneioTeams.length > 0) ? esperneioTeams.map(cand => ({
              id: cand.team?.id || cand.team?.name || cand.name,
              name: cand.team?.name || cand.name || "",
              owner: cand.team?.owner || cand.owner || "",
              shieldUrl: cand.team?.shieldUrl || cand.shieldUrl || "",
              score: typeof cand.esperneioScore === "number" ? cand.esperneioScore : (cand.score || 0),
              status: cand.status || (cand.esperneioScore > 55 ? "vencedor" : "eliminado"),
              rankAfter: cand.rankAfter || 47
            })) : [
              { id: "teampimenta", name: "TeamPimenta", owner: "Chico Pimenta", shieldUrl: "/escudos/TeamPimenta.avif", score: 70.65, status: "vencedor", rankAfter: 47 },
              { id: "gui-fifla", name: "Gui FiFla", owner: "Agnaldo Garceis", shieldUrl: "/escudos/Gui FiFla.avif", score: 64.93, status: "vencedor", rankAfter: 48 },
              { id: "onodi-floripa", name: "Onodi Floripa", owner: "Rafael Fattori", shieldUrl: "/escudos/Onodi Floripa.avif", score: 50.86, status: "eliminado", rankAfter: 49 },
              { id: "brazzers-mkl-fc", name: "Brazzers MKL FC", owner: "Maykel Jesus Silva", shieldUrl: "/escudos/Brazzers MKL FC.avif", score: 41.85, status: "eliminado", rankAfter: 50 }
            ]).map((item) => {
              const isWinner = item.status === "vencedor" || item.rankAfter <= 48;
              return (
                <div 
                  key={item.id} 
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isWinner
                      ? "bg-gradient-to-b from-[#c5a880]/20 via-black/80 to-black/95 border-[#c5a880]/40 shadow-[0_0_15px_rgba(197,168,128,0.15)]"
                      : "bg-[#121212]/60 border-white/5 opacity-70 hover:opacity-95"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex-shrink-0 bg-black/60 rounded-full overflow-hidden p-1 border ${isWinner ? "border-[#c5a880]/60" : "border-white/10"} flex items-center justify-center`}>
                      <TeamShield shieldUrl={item.shieldUrl} fallbackText={item.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-white uppercase truncate tracking-wide">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">Téc: {item.owner}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wider">Pontos R21 (Esperneio)</p>
                      <p className={`text-sm font-black font-mono ${isWinner ? "text-[#c5a880]" : "text-slate-400"}`}>
                        {item.score.toFixed(2)} pts
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider ${
                      isWinner
                        ? "bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 shadow-sm"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {isWinner ? `AVANÇOU (VAGA ${item.rankAfter})` : "ELIMINADO"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer stamp bar */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-slate-500 font-mono text-[9px] relative z-10 w-full">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>VITRINE OFICIAL DE CLASSIFICAÇÃO &bull; EXIBINDO OS 12 CABEÇAS DE CHAVE PRINCIPAIS E OS TIMES DA RODADA DO ESPERNEIO</span>
        </div>
      </div>
    </div>
  );
}
