import React, { useState, useMemo } from "react";
import { CartolaTeam } from "../services/cartolaService";
import TeamShield from "../components/TeamShield";
import { 
  Newspaper, 
  Flame, 
  Trophy, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Zap, 
  Crown,
  TrendingUp,
  Skull,
  Award,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";

interface GazetaC10Props {
  teams: CartolaTeam[];
  currentRound: number;
}

// Histórias editoriais específicas e precisas para cada rodada a partir da R19
interface RoundEditorialInfo {
  tag: string;
  headline: string;
  subheadline: string;
  leadParagraph: string;
  specialCardTitle: string;
  specialCardBadge: string;
  specialCardText: string;
  specialCardFooterLabel: string;
  specialCardFooterValue: string;
}

const ROUND_EDITORIAL_ARCHIVE: Record<number, RoundEditorialInfo> = {
  28: {
    tag: "COPA B10 • DECISÃO DOS 180 MINUTOS",
    headline: "Mata-Mata de Infarto: Classificação por 0,05 Ponto e Zebras Chocam a Copa B10!",
    subheadline: "A Rodada 28 encerra os Play-offs em clima de drama absoluto e define os 16 classificados para a Elite 32.",
    leadParagraph: "A Rodada 28 consagrou momentos inesquecíveis para a história da liga. O Sovaco da Pantera buscou uma virada inacreditável contra o Gui FiFla e carimbou a vaga pela menor margem já registrada: 0,05 ponto! Ao mesmo tempo, equipes como Delirio Futebol e Festa e lendinhaxx fc consolidaram suas classificações sobre os favoritos, provando que no mata-mata o peso da camisa se decide nos detalhes.",
    specialCardBadge: "O Jogo do Infarto",
    specialCardTitle: "Sovaco da Pantera 149.46 x 149.41 Gui FiFla",
    specialCardText: "O Gui FiFla venceu a Ida por quase 25 pontos de frente. Na Volta, o Sovaco mitou com 95.47 contra 70.57 e garantiu a classificação por meio décimo de ponto no agregado!",
    specialCardFooterLabel: "Confronto #15",
    specialCardFooterValue: "VENCEU POR +0.05 PTS"
  },
  27: {
    tag: "COPA B10 • IDA DOS PLAY-OFFS",
    headline: "Perna de Ida em Chamas: Abedaozinho Amassa com Mais de 100 Pontos e Vantagens se Abrem!",
    subheadline: "Primeiros 90 minutos dos Play-offs colocam favoritos contra a parede e consagram grandes atuações.",
    leadParagraph: "A abertura dos Play-offs de Acesso da Copa B10 foi marcada por muita tensão. O Abedaozinho foi o grande nome da semana ao romper a barreira dos 100 pontos (101.45), abrindo incríveis 54,85 pontos de vantagem sobre o Ribeiro Copeiro. Em outros duelos, equipes como Gui FiFla e Carlao07 também construíram gordas vantagens para a decisão da volta.",
    specialCardBadge: "O Rolo Compressor da Ida",
    specialCardTitle: "Abedaozinho Mete 101.45 Pontos na Abertura",
    specialCardText: "Uma atuação de gala colocou o Abedaozinho com um pé e meio na Fase 4, enquanto o Ribeiro Copeiro 84 se vê obrigado a buscar um milagre na rodada de volta.",
    specialCardFooterLabel: "Confronto #6 (Ida)",
    specialCardFooterValue: "101.45 PTS (LÍDER DA RODADA)"
  },
  26: {
    tag: "COPA B10 & M10 • SEMANA DE SOBREVIVÊNCIA",
    headline: "O Drama do Esperneio na B10 e Oitavas Ferozes na Copa M10!",
    subheadline: "Abedao lidera a rodada com 114 pontos enquanto lanternas lutavam pela vida no torneio.",
    leadParagraph: "A Rodada 26 foi um teste de nervos. No Esperneio da Copa B10, quatro equipes que amargaram as últimas posições no corte foram para o tudo ou nada, com duas sobrevivendo para buscar vaga nos Play-offs. No topo individual, o Abedao voou alto com 114.65 pontos, mostrando que tem time para brigar por grandes coisas na temporada.",
    specialCardBadge: "Guerra pela Sobrevivência",
    specialCardTitle: "O Esperneio da Copa B10 Define Sobreviventes",
    specialCardText: "A repescagem garantiu emoção até os acréscimos para definir quem herdaria as duas últimas credenciais para os Play-offs de Acesso.",
    specialCardFooterLabel: "Fase 2 • Esperneio",
    specialCardFooterValue: "ABEDAO BRILHOU COM 114.65"
  },
  25: {
    tag: "COPA B10 • O GRANDE CORTE",
    headline: "O Corte dos Sonhos: Definidos os 16 Gigantes da Elite e os Ameaçados no Acesso!",
    subheadline: "Rodada 25 dividiu as águas na Copa B10: quem carimbou vaga direta e quem caiu no funil dos Play-offs.",
    leadParagraph: "O momento mais aguardado do segundo semestre aconteceu na Rodada 25. Com uma pontuação avassaladora de 120.24 pontos, o Dois Vizinhos SA liderou o pelotão de frente. Os 16 melhores colocados na rodada garantiram vaga direta na cobiçada Fase 4 (Elite), empurrando do 17º ao 46º para a fornalha dos Play-offs de 180 minutos.",
    specialCardBadge: "Linha de Fogo",
    specialCardTitle: "Os 16 Classificados Diretos para a Elite",
    specialCardText: "Apenas 16 sortudos e competentes conseguiram o passe livre para a Fase 4. O restante dos cartoleiros terá de remar na repescagem e nos play-offs eliminatórios!",
    specialCardFooterLabel: "Fase 1 • Corte B10",
    specialCardFooterValue: "DOIS VIZINHOS LIDEROU (120.24)"
  },
  24: {
    tag: "COPA M10 • DECISÃO DA FASE DE GRUPOS",
    headline: "Fim da Fase de Grupos da M10: Dois Vizinhos Cravou 132 Pontos e Líderes Caem!",
    subheadline: "Terceira e decisiva rodada dos grupos definiu os 32 classificados para o Mata-Mata principal.",
    leadParagraph: "Emoção pura na terceira rodada dos 12 grupos da Copa M10. O Dois Vizinhos SA pulverizou a rodada com impressionantes 132.30 pontos, a segunda maior pontuação do campeonato! Na tabela geral, a disputa pegou fogo: Casquinha EC e Everton UltraMaratonista ficaram separados por inacreditáveis 0,55 ponto no topo!",
    specialCardBadge: "A Batalha dos 0,55 Ponto",
    specialCardTitle: "Liderança Geral em Empate Técnico",
    specialCardText: "Casquinha EC (2052.14 pts) e Everton UltraMaratonista (2051.59 pts) fecharam a rodada colados no milímetro, esquentando a briga pela taça geral.",
    specialCardFooterLabel: "Disputa pelo Título",
    specialCardFooterValue: "DIFERENÇA: 0.55 PONTO"
  },
  23: {
    tag: "LIGA GERAL • TROCA DE GUARDA NO TOPO",
    headline: "Reviravolta Histórica: Furacão K7 Assume a Liderança Geral por 0,27 Ponto!",
    subheadline: "Rodada 23 fica marcada pelo equilíbrio absurdo no topo e mitada de C.R.Pirika.",
    leadParagraph: "O campeonato de pontos corridos viu uma das trocas de liderança mais apertadas de todos os tempos. O FURACÃO K7 FC somou 1934.14 pontos e ultrapassou o Casquinha EC (1933.87) por apenas 0,27 de ponto! Enquanto isso, nos grupos da Copa M10, os times jogaram a vida pela segunda rodada em confrontos de arrepiar.",
    specialCardBadge: "Ultrapassagem no Milímetro",
    specialCardTitle: "Furacão K7 Toma a Liderança por 0,27 pts",
    specialCardText: "Uma única assistência ou desarme mudou o dono do trono na liga. O Casquinha perdeu a ponta mas segue colado no retrovisor.",
    specialCardFooterLabel: "Tabela Geral R23",
    specialCardFooterValue: "FURACÃO NO TOPO (+0.27)"
  },
  22: {
    tag: "COPA M10 • ESTREIA DOS GRUPOS",
    headline: "Começa a Fase de Grupos da M10: 48 Times Entram em Campo e Capita Buske Voa!",
    subheadline: "Após o corte e o esperneio, a bola rolou nos 12 grupos de quatro equipes.",
    leadParagraph: "A Copa M10 finalmente iniciou sua fase de grupos na Rodada 22. O Capita Buske foi o grande destaque da rodada ao fazer 95.11 pontos e sair na frente do seu grupo. A tensão tomou conta de todos os 12 grupos, onde cada gol ou finalização pesava ouro para somar pontos nos três jogos classificatórios.",
    specialCardBadge: "Estreia dos Grupos",
    specialCardTitle: "48 Times na Disputa dos 12 Grupos",
    specialCardText: "Com o Esperneio concluído, os 12 grupos iniciaram suas três rodadas de disputa por pontos para ver quem avança para a chave de 32.",
    specialCardFooterLabel: "Fase de Grupos • Jogo 1",
    specialCardFooterValue: "CAPITA BUSKE DESTAQUE (95.11)"
  },
  21: {
    tag: "COPA M10 • O ESPERNEIO",
    headline: "Tensão e Drama: O Esperneio da M10 Salva os Últimos Dois Sobreviventes!",
    subheadline: "Lenoch 'N' Roll crava 104 pontos enquanto lanternas se despediam do sonho da copa.",
    leadParagraph: "A Rodada 21 foi dedicada exclusivamente ao desespero do Esperneio da Copa M10. As quatro equipes que amargaram o corte na R20 travaram uma batalha frenética para preencher as duas últimas vagas restantes dos grupos. Paralelamente, o Lenoch 'N' Roll mitou na rodada com 104.08 pontos, brilhando no cenário geral da liga.",
    specialCardBadge: "Repescagem Sangrenta",
    specialCardTitle: "O Esperneio Define os Grupos Finais",
    specialCardText: "Quem tropeçou na R20 teve sua última oportunidade de ouro. Apenas dois conseguiram a sobrevida e garantiram presença nos 12 grupos.",
    specialCardFooterLabel: "Fase 2 da Copa M10",
    specialCardFooterValue: "LENOCH MITOU COM 104.08"
  },
  20: {
    tag: "COPA M10 • O CORTE HISTÓRICO",
    headline: "O Primeiro Grande Corte da Temporada: Ribeiro Copeiro Destrói com 124 Pontos!",
    subheadline: "Rodada 20 carimbou os 12 cabeças de chave da Copa M10 e mandou os 4 piores para o Esperneio.",
    leadParagraph: "Uma das rodadas mais decisivas do ano foi a Rodada 20. O corte da Copa M10 premiou os 12 melhores colocados como cabeças de chave oficiais dos Grupos de A a L. O Ribeiro Copeiro 84 F.C foi o dono da festa, metendo incríveis 124.91 pontos e carimbando a cabeça de chave número 1!",
    specialCardBadge: "Corte da Copa M10",
    specialCardTitle: "Definidos os 12 Cabeças de Chave",
    specialCardText: "Ribeiro Copeiro puxou a fila dos cabeças de chave, enquanto a parte inferior da tabela sentiu o peso do fantasma da eliminação precoce.",
    specialCardFooterLabel: "Corte Oficial R20",
    specialCardFooterValue: "RIBEIRO COPEIRO (124.91)"
  },
  19: {
    tag: "LIGA GERAL • FIM DO 1º TURNO",
    headline: "Fortaleza da Ilha Crava Históricos 150 Pontos e Casquinha EC é o Campeão do Turno!",
    subheadline: "Fechamento da 19ª rodada consagra o líder da primeira metade e tem a maior pontuação da era do sistema.",
    leadParagraph: "A Rodada 19 marcou a virada de página na temporada com o encerramento oficial do Primeiro Turno e o início da era do nosso sistema de acompanhamento! O Fortaleza da Ilha protagonizou uma das atuações mais monstruosas do fantasy ao atingir 150.08 pontos na rodada! No acumulado das 19 rodadas, o Casquinha EC faturou o troféu simbólico de Campeão do Turno com 1618.14 pontos!",
    specialCardBadge: "O Campeão do Turno",
    specialCardTitle: "Casquinha EC Fatura o Troféu do 1º Turno",
    specialCardText: "Com regularidade impressionante, o Casquinha EC fechou as primeiras 19 rodadas no topo da tabela, com 14 pontos de frente sobre o Jammes Rodriguez.",
    specialCardFooterLabel: "Campeão do Turno",
    specialCardFooterValue: "CASQUINHA EC (1618.14 PTS)"
  }
};

export default function GazetaC10({ teams = [], currentRound }: GazetaC10Props) {
  // Edition selector: defaults to currentRound, ordered in descending order (R28 down to R19)
  const [selectedRound, setSelectedRound] = useState<number>(() => currentRound || 28);
  const [copied, setCopied] = useState<boolean>(false);

  // Available rounds strictly from R19 to currentRound (Descending: 28, 27, 26... 19)
  const availableRounds = useMemo(() => {
    const list: number[] = [];
    const minRound = 19;
    for (let r = currentRound; r >= minRound; r--) {
      const hasScores = teams.some(t => typeof t.scores?.[r] === "number" && t.scores[r] > 0);
      if (hasScores) {
        list.push(r);
      }
    }
    return list.length > 0 ? list : [currentRound];
  }, [teams, currentRound]);

  // Ensure effectiveRound is strictly valid
  const effectiveRound = availableRounds.includes(selectedRound)
    ? selectedRound
    : availableRounds[0] || currentRound;

  // 1. Overall cumulative standings up to effectiveRound
  const standingsUpToRound = useMemo(() => {
    return [...teams]
      .map(t => {
        let total = 0;
        for (let r = 1; r <= effectiveRound; r++) {
          total += t.scores?.[r] || 0;
        }
        return {
          ...t,
          cumulativePoints: Number(total.toFixed(2)),
          roundScore: Number((t.scores?.[effectiveRound] || 0).toFixed(2))
        };
      })
      .sort((a, b) => b.cumulativePoints - a.cumulativePoints);
  }, [teams, effectiveRound]);

  // 2. Individual performance in THIS SPECIFIC selected round
  const roundPerformances = useMemo(() => {
    return [...teams]
      .map(t => ({
        ...t,
        score: Number((t.scores?.[effectiveRound] || 0).toFixed(2))
      }))
      .sort((a, b) => b.score - a.score);
  }, [teams, effectiveRound]);

  const bestTeamOfRound = roundPerformances[0];
  const secondBestTeam = roundPerformances[1];
  const worstTeamOfRound = roundPerformances[roundPerformances.length - 1];

  const averageRoundScore = useMemo(() => {
    if (roundPerformances.length === 0) return 0;
    const sum = roundPerformances.reduce((acc, curr) => acc + curr.score, 0);
    return Number((sum / roundPerformances.length).toFixed(2));
  }, [roundPerformances]);

  // 3. Monthly Standings corresponding to effectiveRound
  const monthlyData = useMemo(() => {
    let monthName = "Setembro";
    let monthRounds = [26, 27, 28];
    if (effectiveRound <= 25) {
      monthName = "Agosto";
      monthRounds = [22, 23, 24, 25];
    }
    if (effectiveRound <= 21) {
      monthName = "Julho";
      monthRounds = [20, 21];
    }

    const relevantRounds = monthRounds.filter(r => r <= effectiveRound);
    if (relevantRounds.length === 0) return null;

    const rankings = [...teams].map(t => {
      const sum = relevantRounds.reduce((acc, r) => acc + (t.scores?.[r] || 0), 0);
      return {
        name: t.name,
        owner: t.owner,
        shieldUrl: t.shieldUrl,
        points: Number(sum.toFixed(2))
      };
    }).sort((a, b) => b.points - a.points);

    return {
      name: monthName,
      roundsLabel: `R${relevantRounds[0]} a R${relevantRounds[relevantRounds.length - 1]}`,
      top3: rankings.slice(0, 3),
      gapFirstToSecond: rankings[1] ? Number((rankings[0].points - rankings[1].points).toFixed(2)) : 0
    };
  }, [teams, effectiveRound]);

  // Editorial details for this specific round
  const editorial = ROUND_EDITORIAL_ARCHIVE[effectiveRound] || {
    tag: `RODADA ${effectiveRound}`,
    headline: `Giro da Rodada ${effectiveRound}: Craque cravou ${bestTeamOfRound?.score} pontos!`,
    subheadline: `A média da liga na rodada ficou em ${averageRoundScore} pontos.`,
    leadParagraph: `A Rodada ${effectiveRound} movimentou a tabela da Liga Só Camisa 10. Com grandes embates e escolhas estratégicas, o líder buscou defender sua vantagem enquanto os perseguidores aceleraram o passo.`,
    specialCardBadge: `Destaque da Rodada ${effectiveRound}`,
    specialCardTitle: `${bestTeamOfRound?.name} Brilha com ${bestTeamOfRound?.score} pts`,
    specialCardText: `Uma rodada de alto nível colocou ${bestTeamOfRound?.name} no topo da rodada, superando a média geral de ${averageRoundScore} pontos.`,
    specialCardFooterLabel: `Rodada ${effectiveRound}`,
    specialCardFooterValue: `CRAQUE: ${bestTeamOfRound?.score} PTS`
  };

  const leader = standingsUpToRound[0];
  const vice = standingsUpToRound[1];
  const third = standingsUpToRound[2];
  const gapLeaderVice = leader && vice ? Number((leader.cumulativePoints - vice.cumulativePoints).toFixed(2)) : 0;

  // WhatsApp text generation strictly dynamic for effectiveRound
  const generateWhatsAppNews = () => {
    let text = `📰 *GAZETA C10 • EDIÇÃO #${effectiveRound}* 🏆\n`;
    text += `_O Diário Oficial da Liga Só Camisa 10_\n\n`;

    text += `🔥 *${editorial.headline}*\n`;
    text += `${editorial.subheadline}\n\n`;

    text += `👑 *CRAQUE DA R${effectiveRound}:* ${bestTeamOfRound?.name} (${bestTeamOfRound?.score} pts) - Téc: ${bestTeamOfRound?.owner}\n`;
    text += `🧊 *PÉ FRIO DA R${effectiveRound}:* ${worstTeamOfRound?.name} (${worstTeamOfRound?.score} pts)\n`;
    text += `📊 *MÉDIA DA LIGA:* ${averageRoundScore} pts\n\n`;

    text += `🏆 *CLASSIFICAÇÃO GERAL APÓS R${effectiveRound}:*\n`;
    text += `1º ${leader?.name} — ${leader?.cumulativePoints} pts\n`;
    text += `2º ${vice?.name} — ${vice?.cumulativePoints} pts (a ${gapLeaderVice} pts)\n`;
    if (third) text += `3º ${third.name} — ${third.cumulativePoints} pts\n`;
    text += `\n`;

    if (monthlyData) {
      text += `📅 *LÍDER DO MÊS (${monthlyData.name} até R${effectiveRound}):*\n`;
      text += `• 1º ${monthlyData.top3[0]?.name} (${monthlyData.top3[0]?.points} pts)\n`;
      if (monthlyData.top3[1]) {
        text += `• 2º ${monthlyData.top3[1]?.name} (${monthlyData.top3[1]?.points} pts - dif: ${monthlyData.gapFirstToSecond} pts)\n`;
      }
      text += `\n`;
    }

    text += `📲 _Acesse a aba 'Gazeta C10' no app para ver a edição completa!_`;
    return text;
  };

  const handleCopyWhatsApp = async () => {
    try {
      const content = generateWhatsAppNews();
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Falha ao copiar:", e);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Editorial Header / Masthead */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#181a20] to-[#0f1015] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none" />
        
        {/* Newspaper Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#D4AF37]/15 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
              <Newspaper className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase font-black text-[#D4AF37] block">
                O Diário Oficial da Liga Só Camisa 10
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
                Gazeta C10
              </h1>
            </div>
          </div>

          {/* Quick Actions: Edition Badge & WhatsApp Copy */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Edição #{effectiveRound} • Temporada 2026
            </span>

            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              title="Copiar boletim pronto com emojis para o WhatsApp"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copiado p/ WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copiar para WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Historical Archive Selector (Seletor de Edições em Ordem Decrescente) */}
        <div className="bg-black/40 border border-white/10 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-[#D4AF37] font-bold">📂 Arquivo Histórico:</span>
            <span className="text-[11px] text-slate-400">Edições a partir da R19 (Era Digital)</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {availableRounds.map(r => {
              const isActive = r === effectiveRound;
              const isLatest = r === currentRound;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRound(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                      : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  <span>R{r}</span>
                  {isLatest && (
                    <span className={`text-[8px] uppercase px-1 py-0.2 rounded font-black ${
                      isActive ? "bg-black text-[#D4AF37]" : "bg-[#D4AF37]/20 text-[#D4AF37]"
                    }`}>
                      Atual
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MANCHETE PRINCIPAL DE CAPA ESPECÍFICA DA RODADA */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-[#12141a] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500/40 text-red-400 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-black tracking-widest animate-pulse">
            <Flame className="w-3 h-3" /> Manchete de Capa
          </span>
          <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded">
            {editorial.tag}
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight leading-tight mb-3">
            {editorial.headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-4xl mb-6">
            {editorial.leadParagraph}
          </p>

          {/* Micro Highlights Bar Dinâmico */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Craque da R{effectiveRound}</span>
                <span className="text-xs font-mono font-black text-emerald-400 truncate block">
                  {bestTeamOfRound?.name} ({bestTeamOfRound?.score} pts)
                </span>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Líder Geral na R{effectiveRound}</span>
                <span className="text-xs font-mono font-black text-[#D4AF37] truncate block">
                  {leader?.name} ({leader?.cumulativePoints} pts)
                </span>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Média da Rodada</span>
                <span className="text-xs font-mono font-black text-blue-300">
                  {averageRoundScore} pontos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE CARDS EDITORIAL / COLUNAS EXCLUSIVAS DA RODADA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. CARD DE DESTAQUE DO TORNEIO (100% contextual para a rodada selecionada) */}
        <div className="bg-[#121215] border border-[#D4AF37]/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full filter blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25">
                <Zap className="w-3 h-3" /> {editorial.specialCardBadge}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Edição #{effectiveRound}</span>
            </div>

            <h3 className="text-lg font-display font-black text-white uppercase mb-2">
              {editorial.specialCardTitle}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              {editorial.specialCardText}
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[10px]">{editorial.specialCardFooterLabel}</span>
            <span className="text-[#D4AF37] font-black text-[11px]">{editorial.specialCardFooterValue}</span>
          </div>
        </div>

        {/* 2. O CRAQUE DA RODADA SELECIONADA */}
        <div className="bg-[#121215] border border-blue-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <Crown className="w-3 h-3" /> Craque da R{effectiveRound}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Maior Pontuação</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0">
                <TeamShield shieldUrl={bestTeamOfRound?.shieldUrl} fallbackText={bestTeamOfRound?.name} />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-display font-black text-white uppercase truncate">{bestTeamOfRound?.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 truncate">Cartoleiro: {bestTeamOfRound?.owner}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Com uma escalação primorosa, cravou a maior pontuação isolada da Rodada {effectiveRound}: <strong>{bestTeamOfRound?.score} pontos</strong> (ficando {(bestTeamOfRound?.score - averageRoundScore).toFixed(2)} pts acima da média da rodada)!
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[10px]">2º da Rodada: {secondBestTeam?.name} ({secondBestTeam?.score} pts)</span>
            <span className="text-blue-400 font-black text-sm font-mono">{bestTeamOfRound?.score} pts</span>
          </div>
        </div>

        {/* 3. O PÉ FRIO / LANTERNA DA RODADA */}
        <div className="bg-[#121215] border border-cyan-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                <Skull className="w-3 h-3" /> Pé Frio da R{effectiveRound}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Pior Pontuação</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0">
                <TeamShield shieldUrl={worstTeamOfRound?.shieldUrl} fallbackText={worstTeamOfRound?.name} />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-base font-display font-black text-white uppercase truncate">{worstTeamOfRound?.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 truncate">Cartoleiro: {worstTeamOfRound?.owner}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Uma daquelas rodadas para esquecer: zagueiros perdendo SG, atacantes amarelados e pontuação tímida de <strong>{worstTeamOfRound?.score} pontos</strong>. Mas a próxima rodada já é hora da volta por cima!
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[10px]">Média da Liga: {averageRoundScore} pts</span>
            <span className="text-cyan-400 font-black text-sm font-mono">{worstTeamOfRound?.score} pts</span>
          </div>
        </div>

        {/* 4. TERMÔMETRO DA TAÇA (LIGA GERAL EXCLUSIVA NA RODADA) */}
        <div className="bg-[#121215] border border-gold/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full filter blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-gold/15 text-[#D4AF37] border border-gold/25">
                <Trophy className="w-3 h-3" /> Trono Geral após R{effectiveRound}
              </span>
              <span className="text-[9px] font-mono text-slate-500">Tabela Acumulada</span>
            </div>

            <h3 className="text-base font-display font-black text-white uppercase mb-2">
              {leader?.name} Lidera com {gapLeaderVice} Pts de Frente!
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Ao final da Rodada {effectiveRound}, o líder <strong>{leader?.name}</strong> totalizava {leader?.cumulativePoints} pontos, 
              sob a perseguição de <strong>{vice?.name}</strong> ({vice?.cumulativePoints} pts) e <strong>{third?.name}</strong> ({third?.cumulativePoints} pts).
            </p>
          </div>

          <div className="space-y-1.5 bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-mono">
            <div className="flex justify-between items-center text-slate-200">
              <span className="truncate max-w-[170px]">1º {leader?.name}</span>
              <span className="font-bold text-[#D4AF37]">{leader?.cumulativePoints} pts</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="truncate max-w-[170px]">2º {vice?.name}</span>
              <span className="text-slate-300">{vice?.cumulativePoints} pts (-{gapLeaderVice})</span>
            </div>
          </div>
        </div>

        {/* 5. GIRO DO MÊS CORRESPONDENTE À RODADA */}
        {monthlyData && (
          <div className="bg-[#121215] border border-purple-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-purple-500/15 text-purple-400 border border-purple-500/25">
                  <Calendar className="w-3 h-3" /> Mês de {monthlyData.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500">{monthlyData.roundsLabel}</span>
              </div>

              <h3 className="text-base font-display font-black text-white uppercase mb-2">
                Disputa da Premiação Mensal até a R{effectiveRound}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                No recorte do mês de <strong>{monthlyData.name}</strong>, a briga pela premiação mensal tem <strong>{monthlyData.top3[0]?.name}</strong> na frente, com {monthlyData.gapFirstToSecond} pontos sobre o vice.
              </p>
            </div>

            <div className="space-y-1.5 bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-mono">
              {monthlyData.top3.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-300 truncate max-w-[170px]">{idx + 1}º {t.name}</span>
                  <span className="font-bold text-purple-300">{t.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CARD DE CONTEXTO TÁTICO / MOMENTO DA TEMPORADA */}
        <div className="bg-[#121215] border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <TrendingUp className="w-3 h-3" /> Termômetro Tático
              </span>
              <span className="text-[9px] font-mono text-slate-500">Temporada 2026</span>
            </div>

            <h3 className="text-base font-display font-black text-white uppercase mb-2">
              Nível Técnico em Alta na R{effectiveRound}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              A média geral de <strong>{averageRoundScore} pontos</strong> nesta rodada comprova a evolução tática dos cartoleiros desde a entrada em vigor do sistema na R19. Nenhuma vaga é entregue sem disputa até o apito final!
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[10px]">Participantes Ativos</span>
            <span className="text-emerald-400 font-black text-[11px]">50 TIMES 100% AUDITADOS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
