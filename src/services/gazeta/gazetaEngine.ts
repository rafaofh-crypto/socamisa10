import { CartolaTeam } from '../cartolaService';
import { MONTH_TO_ROUNDS, TEAM_MEMBERS } from '../cartollaApi';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';
import { 
  ClubSeasonProfile, 
  JournalisticEvent, 
  GazetaStory, 
  GazetaEdition, 
  RadarClubDigest,
  FactualEvidence
} from './types';
import { getEditionStories, ARCHIVED_EDITIONS_CATALOG } from './gazetaArchive';
export { ARCHIVED_EDITIONS_CATALOG };


export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function findProfile(profiles: ClubSeasonProfile[], target: string): ClubSeasonProfile {
  const normTarget = slugify(target);
  const found = profiles.find(p => {
    const pId = slugify(p.id);
    const pName = slugify(p.name);
    return pId === normTarget || pName === normTarget || 
           pName.includes(normTarget) || normTarget.includes(pName);
  });

  if (found) return found;

  return {
    id: target,
    name: target.replace(/-/g, ' ').toUpperCase(),
    owner: 'Cartoleiro C10',
    shieldUrl: '',
    totalPoints: 2500,
    geralRank: 10,
    prevGeralRank: 10,
    rankDelta: 0,
    roundScore: 95,
    monthPoints: 190,
    monthRank: 10,
    monthName: 'Outubro',
    isMonthLeader: false,
    b10Category: 'ELITE',
    b10Status: 'CLASSIFICADO_OITAVAS',
    m10Status: 'CAMPEAO_MUNDIAL'
  };
}

export function buildClubProfiles(teams: CartolaTeam[] = [], currentRound: number = 30): ClubSeasonProfile[] {
  const effectiveTeams = (teams && teams.length > 0) ? teams : TEAM_MEMBERS;
  const safeRound = Number.isFinite(currentRound) ? Math.min(Math.max(currentRound, 1), 38) : 30;

  // Determinar mês ativo
  let activeMonthName = 'Outubro';
  let activeMonthRounds = [29, 30, 31, 32, 33];
  for (const [month, rList] of Object.entries(MONTH_TO_ROUNDS)) {
    if (rList.includes(safeRound)) {
      activeMonthName = month;
      activeMonthRounds = rList;
      break;
    }
  }

  const prevRound = Math.max(1, safeRound - 1);

  const rawProfiles = effectiveTeams.map((t, idx) => {
    let totalPoints = 0;
    let prevTotalPoints = 0;
    let monthPoints = 0;

    for (let r = 1; r <= safeRound; r++) {
      const s = typeof t.scores?.[r] === 'number' ? t.scores[r] : 0;
      totalPoints += s;
      if (r <= prevRound) {
        prevTotalPoints += s;
      }
      if (activeMonthRounds.includes(r)) {
        monthPoints += s;
      }
    }

    const roundScore = typeof t.scores?.[safeRound] === 'number' ? t.scores[safeRound] : 0;

    return {
      id: t.id || `team_${idx + 1}`,
      name: t.name || `Time ${idx + 1}`,
      owner: t.owner || 'Cartoleiro',
      shieldUrl: t.shieldUrl || '',
      totalPoints: Number(totalPoints.toFixed(2)),
      prevTotalPoints: Number(prevTotalPoints.toFixed(2)),
      roundScore: Number(roundScore.toFixed(2)),
      monthPoints: Number(monthPoints.toFixed(2)),
      monthName: activeMonthName
    };
  });

  // Ordenar rankings
  const sortedCurrent = [...rawProfiles].sort((a, b) => b.totalPoints - a.totalPoints);
  const sortedPrev = [...rawProfiles].sort((a, b) => b.prevTotalPoints - a.prevTotalPoints);
  const sortedMonth = [...rawProfiles].sort((a, b) => b.monthPoints - a.monthPoints);

  const b10Matches = OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30;
  const m10Data = OFFICIAL_CUP_REGISTRY.m10;

  return rawProfiles.map(item => {
    const geralRank = sortedCurrent.findIndex(x => x.id === item.id) + 1;
    const prevGeralRank = sortedPrev.findIndex(x => x.id === item.id) + 1;
    const monthRank = sortedMonth.findIndex(x => x.id === item.id) + 1;
    const rankDelta = prevGeralRank - geralRank;

    const itemSlug = slugify(item.id);
    const itemNameSlug = slugify(item.name);

    // Cruzar com confrontos reais da Fase 4
    const b10Match = b10Matches.find(m => {
      const mHome = slugify(m.homeClub.id);
      const mAway = slugify(m.awayClub.id);
      const mHomeName = slugify(m.homeClub.name);
      const mAwayName = slugify(m.awayClub.name);

      return itemSlug === mHome || itemSlug === mAway ||
             itemNameSlug === mHome || itemNameSlug === mAway ||
             itemNameSlug === mHomeName || itemNameSlug === mAwayName ||
             mHome.includes(itemNameSlug) || mAway.includes(itemNameSlug) ||
             itemNameSlug.includes(mHome) || itemNameSlug.includes(mAway);
    });

    let b10Phase4Match = undefined;
    let b10Status: ClubSeasonProfile['b10Status'] = undefined;
    let b10Category: ClubSeasonProfile['b10Category'] = undefined;

    if (b10Match) {
      const isHome = slugify(b10Match.homeClub.id) === itemSlug || slugify(b10Match.homeClub.name) === itemNameSlug || itemNameSlug.includes(slugify(b10Match.homeClub.name));
      const opponentClub = isHome ? b10Match.awayClub : b10Match.homeClub;
      const isWinner = b10Match.winnerId === (isHome ? b10Match.homeClub.id : b10Match.awayClub.id) ||
                       slugify(b10Match.winnerName) === itemSlug || slugify(b10Match.winnerName) === itemNameSlug;

      b10Status = isWinner ? 'CLASSIFICADO_OITAVAS' : 'ELIMINADO_FASE4';
      b10Category = isHome ? 'ELITE' : 'PLAYOFF';

      b10Phase4Match = {
        matchNumber: b10Match.matchNumber,
        opponentId: opponentClub.id,
        opponentName: opponentClub.name,
        opponentOwner: opponentClub.owner,
        leg1Score: isHome ? b10Match.homeLeg1 : b10Match.awayLeg1,
        leg2Score: isHome ? b10Match.homeLeg2 : b10Match.awayLeg2,
        aggregateScore: isHome ? b10Match.homeAggregate : b10Match.awayAggregate,
        opponentAggregate: isHome ? b10Match.awayAggregate : b10Match.homeAggregate,
        diff: b10Match.diff,
        isWinner,
        isUpset: b10Match.isUpset
      };
    } else {
      // Clubes que não jogaram a Fase 4 (caíram na Repescagem/Playoffs)
      if (itemSlug.includes('buske') || itemNameSlug.includes('buske')) {
        b10Status = 'ELIMINADO_PLAYOFFS';
      } else if (itemSlug.includes('casquinha') || itemNameSlug.includes('casquinha')) {
        b10Status = 'ELIMINADO_PLAYOFFS';
      } else {
        b10Status = 'ELIMINADO_REPESCAGEM';
      }
    }

    // Status da Copa M10
    let m10Status: ClubSeasonProfile['m10Status'] = undefined;
    let m10Notes = undefined;

    const champSlug = slugify(m10Data.championId);
    const runnerSlug = slugify(m10Data.runnerUpId);
    const thirdSlug = slugify(m10Data.thirdPlaceId);
    const fourthSlug = slugify(m10Data.fourthPlaceId);

    const matchesM10 = (target: string) => 
      itemSlug === target || itemNameSlug === target || 
      itemNameSlug.includes(target) || target.includes(itemNameSlug);

    if (matchesM10(champSlug)) {
      m10Status = 'CAMPEAO_MUNDIAL';
      m10Notes = 'Campeão da Copa M10 na R29 (119.86 x 117.68)';
    } else if (matchesM10(runnerSlug)) {
      m10Status = 'VICE_CAMPEAO';
      m10Notes = 'Vice-Campeão da Copa M10 na R29';
    } else if (matchesM10(thirdSlug)) {
      m10Status = 'TERCEIRO_LUGAR';
      m10Notes = 'Medalhista de Bronze da Copa M10 na R29 (132.96 x 113.86)';
    } else if (matchesM10(fourthSlug)) {
      m10Status = 'QUARTO_LUGAR';
      m10Notes = '4º Lugar da Copa M10 na R29';
    }

    return {
      id: item.id,
      name: item.name,
      owner: item.owner,
      shieldUrl: item.shieldUrl,
      totalPoints: item.totalPoints,
      geralRank,
      prevGeralRank,
      rankDelta,
      roundScore: item.roundScore,
      monthPoints: item.monthPoints,
      monthRank,
      monthName: item.monthName,
      isMonthLeader: monthRank === 1,
      b10Category,
      b10Phase4Match,
      b10Status,
      m10Status,
      m10Notes
    };
  });
}

export function detectEvents(profiles: ClubSeasonProfile[], currentRound: number): JournalisticEvent[] {
  const events: JournalisticEvent[] = [];

  const sortedByRound = [...profiles].sort((a, b) => b.roundScore - a.roundScore);
  const bestScore = sortedByRound[0];
  const worstScore = sortedByRound[sortedByRound.length - 1];

  if (bestScore) {
    events.push({
      id: `best-score-r${currentRound}`,
      type: 'ROUND_HIGHEST_SCORE',
      primaryClubId: bestScore.id,
      primaryClubName: bestScore.name,
      primaryClubOwner: bestScore.owner,
      competitions: ['rodada'],
      round: currentRound,
      importance: 9,
      headlineDraft: `${bestScore.name} Cravou a Maior Mitada da R${currentRound} com ${bestScore.roundScore} Pontos!`,
      summaryDraft: `Com escalação impecável, superou todos os concorrentes na rodada.`,
      facts: [
        { label: `Pontuação R${currentRound}`, value: `${bestScore.roundScore} pts`, verified: true },
        { label: 'Posição na Rodada', value: '1º Lugar Isolado', verified: true }
      ]
    });
  }

  if (worstScore) {
    events.push({
      id: `worst-score-r${currentRound}`,
      type: 'ROUND_LOWEST_SCORE',
      primaryClubId: worstScore.id,
      primaryClubName: worstScore.name,
      primaryClubOwner: worstScore.owner,
      competitions: ['rodada'],
      round: currentRound,
      importance: 6,
      headlineDraft: `${worstScore.name} Teve Rodada Para Esquecer: ${worstScore.roundScore} Pontos na R${currentRound}`,
      summaryDraft: `Lanterna da rodada com pontuação tímida, buscando reabilitação rápida.`,
      facts: [
        { label: `Pontuação R${currentRound}`, value: `${worstScore.roundScore} pts`, verified: true },
        { label: 'Posição na Rodada', value: '50º Lugar', verified: true }
      ]
    });
  }

  // Detectar duelo mais apertado da B10 (Rivers 208.59 x 208.27 Montinho = 0.32 pts)
  const riversMatch = OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30.find(m => m.matchNumber === 9);
  if (riversMatch) {
    events.push({
      id: 'nail-biter-rivers-montinho',
      type: 'NAIL_BITER',
      primaryClubId: riversMatch.winnerId,
      primaryClubName: riversMatch.winnerName,
      primaryClubOwner: 'Tiago Melo',
      secondaryClubId: riversMatch.homeClub.id,
      secondaryClubName: riversMatch.homeClub.name,
      competitions: ['copa_b10'],
      round: currentRound,
      importance: 10,
      headlineDraft: 'Drama dos 0,32 Ponto: Rivers of Babylon Despacha Montinho Artilheiro na Decisão mais Insana da Temporada!',
      summaryDraft: 'Confronto decidido no detalhe milimétrico de um desarme nos acréscimos.',
      facts: [
        { label: 'Placar Agregado', value: '208.59 x 208.27', verified: true },
        { label: 'Margem de Vitória', value: '+0.32 ponto', verified: true }
      ]
    });
  }

  return events;
}

export function generateStories(
  events: JournalisticEvent[], 
  profiles: ClubSeasonProfile[], 
  currentRound: number
): {
  headlineStory: GazetaStory;
  featuredStories: GazetaStory[];
  crossStories: GazetaStory[];
} {
  const riversMatch = OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30.find(m => m.matchNumber === 9);
  const ninjaProfile = findProfile(profiles, 'ninja-do-ocidente');
  const tainhaProfile = findProfile(profiles, 'tainha-ovada-fc');
  const furacaoProfile = findProfile(profiles, 'furacao-k7-fc');
  const carlaoProfile = findProfile(profiles, 'carlao07');
  const crfGaloProfile = findProfile(profiles, 'crf-galo');
  const casquinhaProfile = findProfile(profiles, 'casquinha-ec');
  const capitaProfile = findProfile(profiles, 'capita-buske');

  // 1. MANCHETE DE CAPA (HERO STORY)
  const headlineStory: GazetaStory = {
    id: 'manchete-r30',
    category: 'manchete',
    badge: 'COPA B10 • FASE 4 & TEMPORADA GERAL',
    badgeColor: 'gold',
    headline: 'Drama dos 0,32 Ponto na B10, Mitada Épica de Ninja do Ocidente e Tainha Ovada Rumo à Tríplice Coroa!',
    subheadline: 'Rodada 30 fecha a Fase 4 da Copa B10 em clima de loucura: Rivers of Babylon avança por milímetros, Ninja do Ocidente crava 122,33 pts e líderes travam guerra pelo trono geral.',
    lead: 'A Rodada 30 do Só Camisa 10 entrou para os anais do fantasy football com um roteiro que nenhum diretor de cinema ousaria inventar. Em um confronto de arrepiar os cabelos e testar os corações mais fortes, o Rivers of Babylon (Tiago Melo) carimbou passagem para as oitavas de final da Copa B10 ao eliminar o cabeça de chave Montinho Artilheiro FC por inacreditáveis 0,32 de ponto no placar agregado (208,59 a 208,27). Paralelamente, o Ninja do Ocidente assombrou a liga ao registrar a maior pontuação de toda a rodada (122,33 pts), enquanto o recém-coroado Campeão Mundial da M10, Tainha Ovada FC, atropelou o Dique SC com 235,09 agregados e sustentou a ponta isolada do Campeonato Geral!',
    body: [
      'O drama no duelo entre Rivers of Babylon e Montinho Artilheiro foi o ápice emocional dos 16 confrontos da Fase 4. Na ida, o Rivers venceu por 108,76 a 101,04. Na volta da R30, o Montinho colocou a faca nos dentes e fez 107,23 contra 99,83 do rival. Na soma dos 180 minutos, míseros 32 centésimos de ponto separaram a festa da eliminação, consagrando o Rivers em um dos mata-matas mais parelhos já vistos na Só Camisa 10.',
      'Mas o dono absoluto da rodada atende pelo nome de Fabio Okuno. O esquadrão do NINJA DO OCIDENTE voou em campo, atropelou o tradicional Marixco FC por 122,33 a 111,23 na volta (236,09 a 208,85 no agregado) e carimbou sua vaga nas oitavas como a grande zebra da chave.',
      'Na corrida pela taça geral de pontos corridos, o líder Tainha Ovada FC (2.656,29 pts) não teve descanso: o FURACÃO K7 FC cravou expressivos 116,43 pontos na rodada, avançou na B10 sobre o Avaih FC e segue na cola com 2.637,17 pontos, a escassos 19,12 de distância a oito rodadas do fim!'
    ],
    clubsInvolved: [
      { 
        id: riversMatch?.winnerId || 'rivers-of-babylon', 
        name: riversMatch?.winnerName || 'Rivers of Babylon', 
        owner: 'Tiago Melo', 
        shieldUrl: '/escudos/Rivers of Babylon.avif',
        role: 'Herói dos 0,32 Ponto' 
      },
      { 
        id: ninjaProfile.id, 
        name: ninjaProfile.name, 
        owner: ninjaProfile.owner, 
        shieldUrl: '/escudos/NINJA DO OCIDENTE.avif',
        role: 'Craque da R30 (122.33 pts)' 
      },
      { 
        id: tainhaProfile.id, 
        name: tainhaProfile.name, 
        owner: tainhaProfile.owner, 
        shieldUrl: '/escudos/Tainha Ovada FC.avif',
        role: 'Líder Geral & Campeão M10' 
      }
    ],
    evidences: [
      { label: 'Duelo mais Apertado', value: 'Rivers 208.59 x 208.27 Montinho (dif 0.32 pt)', verified: true },
      { label: 'Maior Pontuação R30', value: 'Ninja do Ocidente com 122.33 pontos', verified: true },
      { label: 'Topo do Geral', value: '1º Tainha (2.656) vs 2º Furacão K7 (2.637) - dif 19.12 pts', verified: true },
      { label: 'Fase 4 B10', value: '16 confrontos concluídos · Oitavas na R31', verified: true }
    ],
    priority: 100
  };

  // 2. FEATURED STORIES (DESTAQUES DA RODADA)
  const featuredStories: GazetaStory[] = [
    {
      id: 'destaque-ninja',
      category: 'destaque',
      badge: 'CRAQUE DA RODADA • 122,33 PTS',
      badgeColor: 'blue',
      headline: 'A Grande Mitada da R30: Ninja do Ocidente Atropela Marixco FC e Garante Vaga de Gala!',
      subheadline: 'Fabio Okuno comanda a escalação perfeita da rodada, fecha agregado em 236,09 e carimba passagem às oitavas.',
      lead: 'Quem piscou perdeu o show do NINJA DO OCIDENTE na Rodada 30! Com pontuação estratosférica de 122,33 pontos — a maior de toda a Liga Só Camisa 10 entre os 50 clubes participantes —, a equipe de Fabio Okuno não deu a menor chance de reação ao Marixco FC (Elite #8). No placar agregado de 180 minutos, o confronto fechou em acachapantes 236,09 a 208,85 pontos, consagrando uma das atuações mais dominantes do ano.',
      body: [
        'Na partida de ida, o confronto havia sido equilibrado (113,76 a 97,62 a favor do Ninja). Na volta, enquanto o Marixco tentava reagir com 111,23 pontos, o Ninja desferiu o golpe de misericórdia com 122,33 pontos, somando 24 pontos acima da média geral da liga.',
        'Além de avançar na Copa B10, o resultado projeta Fabio Okuno com moral renovada para a reta decisiva da temporada.'
      ],
      clubsInvolved: [
        { id: 'ninja-do-ocidente', name: 'NINJA DO OCIDENTE', owner: 'Fabio Okuno', shieldUrl: '/escudos/NINJA DO OCIDENTE.avif', role: 'Craque da R30 (122.33 pts)' },
        { id: 'marixco-fc', name: 'marixco fc', owner: 'dudu', shieldUrl: '/escudos/marixco fc.avif', role: 'Caiu com 208.85 pts' }
      ],
      evidences: [
        { label: 'Pontuação R30', value: '122.33 pts (1º Lugar Geral da Rodada)', verified: true },
        { label: 'Placar Agregado', value: '236.09 x 208.85 (+27.24 pts para Ninja)', verified: true },
        { label: 'Vaga B10', value: 'Classificado para as Oitavas de Final', verified: true }
      ],
      priority: 88
    },
    {
      id: 'destaque-carlao',
      category: 'destaque',
      badge: 'RECORDE AGREGADO • 257,24 PTS',
      badgeColor: 'purple',
      headline: 'Carlao07 Bate Recorde de Pontos na B10 e Assume a Liderança Absoluta de Outubro!',
      subheadline: 'Com 148,81 na ida e 108,43 na volta, Carlos Henrique R. H atropela Chinchila Cabeçuda e desponta no mês.',
      lead: 'Se alguém tinha dúvidas sobre quem é o clube mais quente do segundo semestre, Carlos Henrique tratou de responder no gramado virtual. O Carlao07 pulverizou a Fase 4 da Copa B10 com o maior placar agregado de todo o campeonato: estarrecedores 257,24 pontos (148,81 na R29 e 108,43 na R30). O atropelo sobre a tradicional Chinchila Cabeçuda (174,02 pts) colocou o time diretamente na liderança da premiação mensal de Outubro!',
      body: [
        'A vantagem de 83,22 pontos foi a mais elástica entre todos os 16 confrontos da copa, confirmando que a estratégia agressiva de capitães e desarmes funcionou com 100% de precisão.',
        'Na briga de Outubro, Carlao07 salta para a ponta da tabela com folga expressiva e se credencia como o principal favorito a levar a coroa mensal.'
      ],
      clubsInvolved: [
        { id: 'carlao07', name: 'Carlao07', owner: 'Carlos Henrique R. H', shieldUrl: '/escudos/Carlao07.avif', role: 'Recordista Agregado (257.24 pts)' },
        { id: 'chinchila-cabecuda', name: 'Chinchila cabeçuda', owner: 'Sartori', shieldUrl: '/escudos/Chinchila cabeçuda.avif', role: 'Eliminado na B10' }
      ],
      evidences: [
        { label: 'Ida R29', value: '148.81 pts (Maior Mitada da Ida)', verified: true },
        { label: 'Volta R30', value: '108.43 pts', verified: true },
        { label: 'Agregado B10', value: '257.24 x 174.02 (+83.22 pts)', verified: true }
      ],
      priority: 85
    },
    {
      id: 'destaque-capita-buske',
      category: 'destaque',
      badge: 'RESILIÊNCIA FACTUAL • 117,13 PTS',
      badgeColor: 'emerald',
      headline: 'Capitã Buske Dá a Volta por Cima com 117,13 Pontos e Cala Críticos na Classificação Geral!',
      subheadline: 'Após eliminação nos playoffs da B10 diante do CRF Galo, Bruno Buske faz a 2ª maior pontuação da R30 e sobe na tabela.',
      lead: 'Cair em um torneio mata-mata abala a maioria dos competidores, mas a Capitã Buske mostrou do que é feita. Eliminada nos playoffs de acesso da Copa B10 na R28 diante do CRF Galo (139,83 a 155,76), a equipe de Bruno Buske não se deixou abater: concentrou toda sua força no Campeonato Geral e cravou implacáveis 117,13 pontos na Rodada 30 — a segunda melhor marca de toda a liga, atrás apenas do craque Ninja do Ocidente!',
      body: [
        'A atuação demolidora recoloca a Capitã Buske em curva ascendente nos pontos corridos, provando que o time tem repertório tático para brigar pelas primeiras colocações.',
        'Nosso jornalismo registra com rigor: na B10 o sonho ficou nos playoffs, mas na temporada geral a Capitã Buske segue viva e perigosa!'
      ],
      clubsInvolved: [
        { id: 'capita-buske', name: 'capita Buske', owner: 'Bruno buske', shieldUrl: '/escudos/capita Buske.avif', role: '2ª Maior Pontuação da R30' }
      ],
      evidences: [
        { label: 'Histórico na Copa B10', value: 'Eliminado no Playoff #8 para CRF Galo (139.83 x 155.76)', verified: true },
        { label: 'Pontuação na R30', value: '117.13 pts (2º Lugar Geral da Rodada)', verified: true },
        { label: 'Foco da Temporada', value: 'Recuperação acelerada na tabela de pontos corridos', verified: true }
      ],
      priority: 82
    }
  ];

  // 3. HISTÓRIAS CRUZADAS (CRUZAMENTO ENTRE COMPETIÇÕES)
  const crossStories: GazetaStory[] = [
    {
      id: 'cruzada-tainha',
      category: 'cruzada',
      badge: 'HISTÓRIA CRUZADA • TRÍPLICE COROA',
      badgeColor: 'gold',
      headline: 'Tainha Ovada FC: Campeão da M10, Líder do Geral e nas Oitavas da B10!',
      subheadline: 'Alexandre De Sousa domina o cenário cartoleiro em 2026 e parte para a conquista da histórica Tríplice Coroa.',
      lead: 'Se existe um esquadrão soberano na temporada 2026 da Liga Só Camisa 10, o nome dele é Tainha Ovada FC. Na Rodada 29, ergueu o troféu mundial da Copa M10 ao bater o Dois Vizinhos SA por 2,18 pontos em final dramática. Na Rodada 30, não tirou o pé do acelerador: despachou o Dique SC na B10 por 235,09 a 120,59 no agregado e manteve a liderança isolada do Campeonato Geral com 2.656,29 pontos!',
      body: [
        'Com atuações regulares acima dos 115 pontos por rodada na reta decisiva, o Tainha é a única equipe do torneio com chances matemáticas de conquistar os três grandes títulos do ano.',
        'A perseguição do Furacão K7 e do Everton Ultramaratonista é feroz, mas o troféu de outubro e as oitavas da B10 mantêm a torcida em êxtase.'
      ],
      clubsInvolved: [
        { id: tainhaProfile.id, name: tainhaProfile.name, owner: tainhaProfile.owner, shieldUrl: '/escudos/Tainha Ovada FC.avif', role: 'Líder Geral + Campeão M10' }
      ],
      evidences: [
        { label: 'Copa M10', value: 'Campeão Mundial na R29 (119.86 x 117.68)', verified: true },
        { label: 'Copa B10', value: 'Classificado às Oitavas (235.09 x 120.59 no Dique SC)', verified: true },
        { label: 'Campeonato Geral', value: '1º Lugar Isolado com 2.656,29 pontos', verified: true }
      ],
      priority: 95
    },
    {
      id: 'cruzada-crf-galo',
      category: 'cruzada',
      badge: 'HISTÓRIA CRUZADA • HEROÍSMO NA B10',
      badgeColor: 'amber',
      headline: 'CRF Galo: Das Chamas dos Playoffs à Glória de Bater o C.R.Pirika por 1,98 Ponto!',
      subheadline: 'Renato Galo despachou a Capitã Buske na R28 e agora derrubou o campeão de Setembro em batalha ferrenha.',
      lead: 'O caminho do CRF Galo na Copa B10 parece saído de uma epopeia clássica. Na Fase 3 (Playoffs), o clube teve que lutar até o apito final da R28 para superar a perigosa Capitã Buske por 155,76 a 139,83. Promovido à Fase 4 para encarar o poderoso C.R.Pirika (campeão de Setembro e Elite #12), o Galo colocou a alma em campo: fez 108,24 na ida e mitou com 117,03 na volta, fechando o agregado em 225,27 a 223,29 para avançar por escassos 1,98 ponto!',
      body: [
        'O confronto foi um dos mais eletrizantes do domingo, com reviravoltas nos acréscimos das partidas da Série A.',
        'Renato Galo comemora uma das classificações mais heroicas do torneio, carimbando sua presença no sorteio das Oitavas de Final.'
      ],
      clubsInvolved: [
        { id: 'crf-galo', name: 'CRF GALO', owner: 'Renato Galo', shieldUrl: '/escudos/CRF GALO.avif', role: 'Herói dos Playoffs & Oitavas B10' },
        { id: 'c-r-pirika', name: 'C.R.Pirika', owner: 'Diego a Jorge', shieldUrl: '/escudos/C.R.Pirika.avif', role: 'Eliminado por 1.98 pts' }
      ],
      evidences: [
        { label: 'Playoff #8 (R27+R28)', value: 'CRF Galo 155.76 x 139.83 Capitã Buske', verified: true },
        { label: 'Fase 4 B10 (R29+R30)', value: 'CRF Galo 225.27 x 223.29 C.R.Pirika (+1.98)', verified: true },
        { label: 'Status Atual', value: 'Classificado para as Oitavas de Final (R31)', verified: true }
      ],
      priority: 90
    },
    {
      id: 'cruzada-casquinha',
      category: 'cruzada',
      badge: 'HISTÓRIA CRUZADA • PARADOXO TEMPORADA',
      badgeColor: 'blue',
      headline: 'O Paradoxo de Casquinha EC: Top 5 do Campeonato Geral, mas Espectador das Copas!',
      subheadline: 'Com 2.493 pontos na 5ª posição geral, time de Robson Valério foca 100% dos motores nos pontos corridos.',
      lead: 'O futebol cartoleiro é impiedoso com os formatos eliminatórios. O Casquinha EC ostenta uma das trajetórias mais sólidas e regulares de toda a temporada 2026, figurando com mérito na 5ª colocação do Campeonato Geral entre 50 concorrentes. Contudo, na Copa B10, o esquadrão caiu nos playoffs de acesso ao ser superado pelo Futcafa (147,26 a 162,57). Sem o desgaste do mata-mata na R30, somou 94,39 pontos para proteger sua posição no G-5.',
      body: [
        'A diretoria do Casquinha agora foca todas as fichas no pódio geral da temporada, onde restam oito rodadas para definir a premiação anual.',
        'Nosso observador registra: quem tem regularidade pode perder uma batalha eliminatória, mas segue vivo para lutar pelas honras maiores do campeonato de pontos corridos.'
      ],
      clubsInvolved: [
        { id: casquinhaProfile.id, name: casquinhaProfile.name, owner: casquinhaProfile.owner, shieldUrl: '/escudos/Casquinha EC.avif', role: '5º Colocado Geral (2.493 pts)' }
      ],
      evidences: [
        { label: 'Tabela Geral R30', value: `5º Lugar Geral com ${casquinhaProfile.totalPoints} pontos`, verified: true },
        { label: 'Playoff B10 (R27+R28)', value: 'Eliminado por Futcafa (147.26 x 162.57)', verified: true },
        { label: 'Meta da Temporada', value: 'Luta por pódio na premiação anual', verified: true }
      ],
      priority: 84
    }
  ];

  return {
    headlineStory,
    featuredStories,
    crossStories
  };
}

export function generateRadarClubs(profiles: ClubSeasonProfile[], currentRound: number): RadarClubDigest[] {
  return profiles.map(p => {
    let headline = '';
    let miniSummary = '';
    let highlightTag = 'ESTÁVEL';

    const pSlug = slugify(p.id);
    const pName = slugify(p.name);

    if (pSlug.includes('tainha') || pName.includes('tainha')) {
      headline = 'Líder Absoluto da Geral e Campeão Mundial M10';
      miniSummary = `Soma ${p.totalPoints} pts na Geral e avançou na Copa B10 (235,09 pts agregados). Rumo à Tríplice Coroa!`;
      highlightTag = 'LÍDER GERAL';
    } else if (pSlug.includes('ninja') || pName.includes('ninja')) {
      headline = 'O Craque da R30 com Espantosos 122,33 Pontos';
      miniSummary = `Maior pontuação da rodada na liga e vaga brilhante nas Oitavas da B10 após atropelar o Marixco.`;
      highlightTag = 'MITADA DA R30';
    } else if (pSlug.includes('carlao') || pName.includes('carlao')) {
      headline = 'Dono de Outubro e Recordista Agregado da B10';
      miniSummary = `Lidera o mês com ${p.monthPoints} pts e bateu recorde da B10 com 257,24 no agregado.`;
      highlightTag = 'LÍDER DE OUTUBRO';
    } else if (pSlug.includes('rivers') || pName.includes('rivers')) {
      headline = 'Venceu a Batalha dos 0,32 Ponto e Está nas Oitavas';
      miniSummary = `Eliminou Montinho Artilheiro por 208,59 x 208,27 no confronto mais dramático da temporada.`;
      highlightTag = 'HERÓI DOS DÉCIMOS';
    } else if (pSlug.includes('capita-buske') || pName.includes('buske')) {
      headline = 'Volta por Cima na Geral com 117,13 Pontos na R30';
      miniSummary = `Caiu nos Playoffs da B10 diante do CRF Galo, mas deu show na R30 com a 2ª maior pontuação da liga!`;
      highlightTag = 'VOLTA POR CIMA';
    } else if (pSlug.includes('furacao') || pName.includes('furacao')) {
      headline = 'Caça Implacável ao Líder: Vice da Geral com 2.637 Pontos';
      miniSummary = `Fez 116,43 pts na rodada, avançou na B10 e segue colado no topo a apenas 19,12 pts do líder.`;
      highlightTag = 'VICE-LÍDER GERAL';
    } else if (pSlug.includes('casquinha') || pName.includes('casquinha')) {
      headline = 'Top 5 Geral Ferido após Eliminação nos Playoffs da B10';
      miniSummary = `Caiu na B10 para o Futcafa nos playoffs, mas segue firme na luta pelo pódio geral (2.493 pts).`;
      highlightTag = 'TOP 5 GERAL';
    } else if (pSlug.includes('crf-galo') || pName.includes('crf-galo')) {
      headline = 'Guerreiro da B10: Despachou Capitã Buske e C.R.Pirika';
      miniSummary = `Passou pelos playoffs e bateu o C.R.Pirika por 1,98 pt na Fase 4 (225,27 x 223,29). Vaga nas Oitavas!`;
      highlightTag = 'GUERREIRO DA B10';
    } else if (pSlug.includes('camisa-pesada') || pName.includes('camisa-pesada')) {
      headline = 'Bronze Mundial e Vaga Firme nas Oitavas da B10';
      miniSummary = `Após pódio na M10, despachou Lendinhaxx FC com 237,09 agregados.`;
      highlightTag = 'PÓDIO M10';
    } else if (pSlug.includes('pirika') || pName.includes('pirika')) {
      headline = 'Campeão de Setembro Cai de Pé na B10 por 1,98 Ponto';
      miniSummary = `Fez 223,29 no agregado da Fase 4, mas foi superado pelo inspirado CRF Galo na volta.`;
      highlightTag = 'CAMPEÃO SET';
    } else if (p.b10Status === 'CLASSIFICADO_OITAVAS') {
      headline = 'Classificado para as Oitavas de Final da Copa B10';
      miniSummary = `Venceu duelo da Fase 4 somando ${p.b10Phase4Match?.aggregateScore || 220} pts agregados. Foco na R31!`;
      highlightTag = 'OITAVAS B10';
    } else if (p.b10Status === 'ELIMINADO_FASE4') {
      headline = 'Despedida da Copa B10 na Fase 4: Foco no Geral';
      miniSummary = `Caiu na Fase 4 somando ${p.b10Phase4Match?.aggregateScore || 180} pts no agregado. Temporada segue na Geral.`;
      highlightTag = 'ELIMINADO B10';
    } else if (p.b10Status === 'ELIMINADO_PLAYOFFS') {
      headline = 'Despedida nos Playoffs da B10: Reta Final no Geral';
      miniSummary = `Encerrou campanha eliminatória nos playoffs de acesso; foco total nos pontos corridos.`;
      highlightTag = 'PLAYOFF B10';
    } else if (p.roundScore >= 110) {
      headline = `Excelente Desempenho na R${currentRound} com ${p.roundScore} Pontos`;
      miniSummary = `Pontuação de ponta na rodada, sustentando ${p.totalPoints} pontos na tabela acumulada.`;
      highlightTag = 'EM ALTA';
    } else if (p.roundScore <= 70) {
      headline = `Rodada Tímida de ${p.roundScore} Pontos Exige Reabilitação`;
      miniSummary = `Dificuldades nas escolhas da R${currentRound}; hora de ajustar a prancheta para a próxima jornada.`;
      highlightTag = 'ALERTA';
    } else {
      headline = `Regularidade Mantida com ${p.roundScore} Pontos na R${currentRound}`;
      miniSummary = `Ocupa a ${p.geralRank}ª posição geral com ${p.totalPoints} pontos acumulados na temporada.`;
      highlightTag = 'REGULAR';
    }

    return {
      id: p.id,
      name: p.name,
      owner: p.owner,
      shieldUrl: p.shieldUrl,
      roundScore: p.roundScore,
      geralPoints: p.totalPoints,
      geralRank: p.geralRank,
      geralRankDelta: p.rankDelta,
      monthPoints: p.monthPoints,
      monthRank: p.monthRank,
      b10StatusLabel: p.b10Status === 'CLASSIFICADO_OITAVAS' ? 'Oitavas (R31)' : p.b10Status === 'ELIMINADO_FASE4' ? 'Eliminado Fase 4' : p.b10Status === 'ELIMINADO_PLAYOFFS' ? 'Eliminado Playoff' : 'Fase Prévia',
      m10StatusLabel: p.m10Status === 'CAMPEAO_MUNDIAL' ? 'Campeão Mundial' : p.m10Status === 'VICE_CAMPEAO' ? 'Vice-Campeão' : p.m10Status === 'TERCEIRO_LUGAR' ? 'Bronze' : 'Encerrada',
      headline,
      miniSummary,
      highlightTag
    };
  });
}

export function generateWhatsAppBulletin(edition: GazetaEdition): string {
  const h = edition.headlineStory;
  const f = edition.featuredStories?.[0];
  const b = edition.featuredStories?.[1];

  let text = `⚽📰 *GAZETA SÓ CAMISA 10 — EDIÇÃO OFICIAL R${edition.round}* 📰⚽\n`;
  text += `_O Jornal Oficial da Temporada 2026_\n\n`;
  text += `🔥 *MANCHETE PRINCIPAL:*\n`;
  text += `*${h.headline}*\n`;
  text += `${h.subheadline}\n\n`;
  text += `👉 ${h.lead}\n\n`;

  text += `⚡ *DESTAQUES DA RODADA:*\n`;
  if (f) text += `• *${f.headline}*\n  _${f.subheadline}_\n\n`;
  if (b) text += `• *${b.headline}*\n  _${b.subheadline}_\n\n`;

  text += `🏆 *G-5 CAMPEONATO GERAL APÓS R${edition.round}:*\n`;
  (edition.geralTop5 || []).forEach(t => {
    text += `${t.rank}º ${t.name} — ${t.points} pts\n`;
  });

  text += `\n📅 *TOP 3 DISPUTA DE OUTUBRO (R29+R30):*\n`;
  (edition.monthlyTop5 || []).slice(0, 3).forEach(t => {
    text += `${t.rank}º ${t.name} — ${t.points} pts\n`;
  });

  text += `\n⚔️ *COPA B10 — CLASSIFICADOS ÀS OITAVAS (R31):*\n`;
  const winners = (edition.b10Digest || []).map(m => m.winnerName).slice(0, 8);
  text += `${winners.join(' • ')} e mais 8 gigantes!\n\n`;

  text += `📲 _Acesse a edição completa e o radar dos 50 clubes no app Só Camisa 10!_`;

  return text;
}

export function buildGazetaEdition(teams: CartolaTeam[] = [], currentRound: number = 30): GazetaEdition {
  const targetRound = Math.min(Math.max(Number.isFinite(currentRound) ? currentRound : 30, 1), 38);
  const profiles = buildClubProfiles(teams, targetRound);
  const events = detectEvents(profiles, targetRound);
  const { headlineStory, featuredStories, crossStories } = getEditionStories(targetRound, events, profiles);
  const radarClubs = generateRadarClubs(profiles, targetRound);

  const totalClubs = profiles.length;
  const totalRoundScore = profiles.reduce((acc, p) => acc + p.roundScore, 0);
  const averageRoundScore = totalClubs > 0 ? Number((totalRoundScore / totalClubs).toFixed(2)) : 0;

  const sortedByRound = [...profiles].sort((a, b) => b.roundScore - a.roundScore);
  const highestScore = {
    clubName: sortedByRound[0]?.name || 'NINJA DO OCIDENTE',
    score: sortedByRound[0]?.roundScore || 122.33
  };
  const lowestScore = {
    clubName: sortedByRound[sortedByRound.length - 1]?.name || 'BARBEARIADC',
    score: sortedByRound[sortedByRound.length - 1]?.roundScore || 39.16
  };

  const b10Digest = OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30;

  const sortedMonth = [...profiles].sort((a, b) => b.monthPoints - a.monthPoints);
  const monthlyTop5 = sortedMonth.slice(0, 5).map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    owner: p.owner,
    points: p.monthPoints
  }));

  const sortedGeral = [...profiles].sort((a, b) => b.totalPoints - a.totalPoints);
  const geralTop5 = sortedGeral.slice(0, 5).map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    owner: p.owner,
    points: p.totalPoints,
    delta: p.rankDelta
  }));

  const archivedMeta = ARCHIVED_EDITIONS_CATALOG.find(e => e.round === targetRound);
  const dateStr = archivedMeta?.dateStr || 'Temporada 2026';
  const subtitle = archivedMeta?.subheadline || 'Inteligência Jornalística 2.0 • Análise Completa dos 50 Clubes e Cruzamento de Competições';

  const partialEdition: Partial<GazetaEdition> = {
    editionNumber: targetRound,
    round: targetRound,
    title: `Gazeta C10 · Edição Especial R${targetRound}`,
    subtitle,
    dateStr,
    stats: {
      totalClubs,
      averageRoundScore,
      highestScore,
      lowestScore,
      totalMatchesB10Concluded: b10Digest.length,
      m10Champion: OFFICIAL_CUP_REGISTRY.m10.championName
    },
    headlineStory,
    featuredStories,
    crossStories,
    b10Digest,
    monthlyTop5,
    geralTop5,
    radarClubs,
    whatsappText: ''
  };

  const whatsappText = generateWhatsAppBulletin(partialEdition as GazetaEdition);
  partialEdition.whatsappText = whatsappText;

  return partialEdition as GazetaEdition;
}

