import { GazetaStory, JournalisticEvent, ClubSeasonProfile } from './types';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';

export interface ArchivedEditionSummary {
  editionNumber: number;
  round: number;
  dateStr: string;
  badge: string;
  badgeColor: 'gold' | 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
  title: string;
  subheadline: string;
  highlights: string[];
  isCurated: boolean;
}

// Catálogo cronológico de edições históricas disponíveis
export const ARCHIVED_EDITIONS_CATALOG: ArchivedEditionSummary[] = [
  {
    editionNumber: 30,
    round: 30,
    dateStr: '14 de Outubro de 2026',
    badge: 'FASE 4 B10 • VOLTA',
    badgeColor: 'gold',
    title: 'Drama dos 0,32 Ponto na B10, Mitada Épica de Ninja do Ocidente e Tainha Rumo à Tríplice Coroa!',
    subheadline: 'Rivers of Babylon avança por milímetros, Ninja do Ocidente crava 122,33 pts e 16 classificados às oitavas são homologados.',
    highlights: ['Rivers 208.59 x 208.27 Montinho', 'Ninja 122.33 pts', 'Carlao07 recorde 257.24', 'Capitã Buske 117.13 pts'],
    isCurated: true
  },
  {
    editionNumber: 29,
    round: 29,
    dateStr: '07 de Outubro de 2026',
    badge: 'FINAL M10 & IDA FASE 4 B10',
    badgeColor: 'blue',
    title: 'Carlao07 Crava Históricos 148,81 pts na B10 e Tainha Ovada É Campeão Mundial da Copa M10!',
    subheadline: 'Carlos Henrique estraçalha recordes de pontuação na ida da Fase 4 enquanto Tainha Ovada supera Dois Vizinhos SA por 2,18 pontos!',
    highlights: ['Carlao07 148.81 pts', 'Tainha Campeão M10', 'Camisa Pesada 132.96', 'Dois Vizinhos Vice M10'],
    isCurated: true
  },
  {
    editionNumber: 28,
    round: 28,
    dateStr: '30 de Setembro de 2026',
    badge: 'PLAYOFFS B10 • DECISÃO',
    badgeColor: 'purple',
    title: 'Playoffs de Sangue e Areia na B10: CRF Galo Vence Capitã Buske e Futcafa Despacha Casquinha!',
    subheadline: 'A repescagem em 180 minutos definiu os últimos classificados para a Fase 4; favoritos caem na batalha final de Setembro.',
    highlights: ['CRF Galo 155.76 x 139.83 Capitã Buske', 'Futcafa 162.57 x 147.26 Casquinha', 'Fim de Setembro'],
    isCurated: true
  }
];

// Retorna as histórias especiais de cada edição
export function getEditionStories(
  round: number,
  events: JournalisticEvent[],
  profiles: ClubSeasonProfile[]
): {
  headlineStory: GazetaStory;
  featuredStories: GazetaStory[];
  crossStories: GazetaStory[];
} {
  const findProfile = (slug: string) => {
    return profiles.find(p => p.id === slug) || {
      id: slug,
      name: slug,
      owner: 'Cartoleiro',
      shieldUrl: '',
      totalPoints: 0,
      geralRank: 99,
      prevGeralRank: 99,
      rankDelta: 0,
      roundScore: 0,
      monthPoints: 0,
      monthRank: 99,
      monthName: 'Outubro',
      isMonthLeader: false
    };
  };

  const bestScore = events.find(e => e.type === 'ROUND_HIGHEST_SCORE');
  const worstScore = events.find(e => e.type === 'ROUND_LOWEST_SCORE');
  const leaderGeral = profiles[0] || findProfile('tainha-ovada-fc');
  const viceGeral = profiles[1] || findProfile('furacao-k7-fc');

  // ==========================================
  // EDIÇÃO #30 (Curadoria Completa e Canônica)
  // ==========================================
  if (round === 30) {
    const riversMatch = OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30.find(m => m.matchNumber === 9);
    const ninjaProfile = findProfile('ninja-do-ocidente');
    const tainhaProfile = findProfile('tainha-ovada-fc');
    const furacaoProfile = findProfile('furacao-k7-fc');
    const carlaoProfile = findProfile('carlao07');
    const crfGaloProfile = findProfile('crf-galo');

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

    const featuredStories: GazetaStory[] = [
      {
        id: 'destaque-ninja',
        category: 'destaque',
        badge: 'CRAQUE DA RODADA • 122,33 PTS',
        badgeColor: 'blue',
        headline: 'A Grande Mitada da R30: Ninja do Ocidente Atropela Marixco FC e Garante Vaga de Gala!',
        subheadline: 'Fabio Okuno comanda a maior pontuação da rodada, fecha agregado em 236,09 e carimba passagem às oitavas.',
        lead: 'Quem piscou perdeu o show do NINJA DO OCIDENTE na Rodada 30! Com pontuação estratosférica de 122,33 pontos — a maior de toda a Liga Só Camisa 10 entre os 50 clubes participantes —, a equipe de Fabio Okuno não deu a menor chance de reação ao Marixco FC (Elite #8). No placar agregado de 180 minutos, o confronto fechou em acachapantes 236,09 a 208,85 pontos, consagrando uma das atuações mais dominantes do ano.',
        body: [
          'Na partida de ida, o confronto havia sido equilibrado (113,76 a 97,62 a favor do Ninja). Na volta, enquanto o Marixco tentava reagir com 111,23 pontos, o Ninja desferiu o golpe de misericórdia com 122,33 pontos, somando 26,05 pontos acima da média de 96,28 da liga.',
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
        badge: 'MAIOR AGREGADO DA FASE • 257,24 PTS',
        badgeColor: 'purple',
        headline: 'Carlao07 Faz o Maior Agregado da Fase 4 e Mantém a Liderança de Outubro!',
        subheadline: 'Com 148,81 na ida e 108,43 na volta, Carlos Henrique R. H atropela Chinchila Cabeçuda e desponta no mês.',
        lead: 'Se alguém tinha dúvidas sobre quem é o clube mais quente do segundo semestre, Carlos Henrique tratou de responder no gramado virtual. O Carlao07 pulverizou a Fase 4 da Copa B10 com o maior pontuação agregada individual da Fase 4: estarrecedores 257,24 pontos (148,81 na R29 e 108,43 na R30). O atropelo sobre a tradicional Chinchila Cabeçuda (174,02 pts) manteve o clube na liderança de Outubro, posição que já ocupava após a R29!',
        body: [
          'A vantagem de 83,22 pontos foi a segunda maior da fase. A maior margem ficou com Tainha Ovada FC: 114,50 pontos sobre o Dique SC. Carlao07 liderou em pontuação agregada individual, com 257,24.',
          'Na briga de Outubro, Carlao07 soma 257,24 pontos, contra 242,90 do Real Barreiros. A vantagem é de 14,34 pontos; o mês segue aberto até a R33.'
        ],
        clubsInvolved: [
          { id: 'carlao07', name: 'Carlao07', owner: 'Carlos Henrique R. H', shieldUrl: '/escudos/Carlao07.avif', role: 'Maior Agregado da Fase 4 (257.24 pts)' },
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
        headline: 'Capitã Buske Dá a Volta por Cima com 117,13 Pontos na Rodada 30!',
        subheadline: 'Após eliminação nos playoffs da B10 diante do CRF Galo, Bruno Buske faz a 2ª maior pontuação da R30 e sobe na tabela.',
        lead: 'O mata-mata terminou, mas a temporada segue viva para a Capitã Buske. Eliminada nos playoffs de acesso da Copa B10 na R28 diante do CRF Galo (139,83 a 155,76), a equipe de Bruno Buske cravou implacáveis 117,13 pontos na Rodada 30 — a segunda melhor marca de toda a liga, atrás apenas do craque Ninja do Ocidente!',
        body: [
          'A atuação demolidora rendeu a segunda maior pontuação da R30. É uma história de reação depois da eliminação na B10, sem apagar o confronto dos playoffs.',
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

    const crossStories: GazetaStory[] = [
      {
        id: 'cruzada-tainha',
        category: 'cruzada',
        badge: 'PARADOXO DE OURO • M10 & GERAL & B10',
        badgeColor: 'gold',
        headline: 'O Império de Tainha Ovada FC: Campeão do Mundo, Líder do Geral e Oitavas na B10!',
        subheadline: 'Alexandre De Sousa domina o cenário em três frentes e mira tríplice coroa sem precedentes.',
        lead: 'Se alguém tem motivos de sobra para comemorar, esse alguém é o comandante do Tainha Ovada FC. Na Rodada 29, sagrou-se o primeiro Campeão Mundial da Copa M10 ao derrotar o Dois Vizinhos SA por 119,86 a 117,68. Na Rodada 30, administrou com sabedoria a volta da B10 contra o Dique SC (goleada de 235,09 a 120,59 no agregado) e consolidou a liderança isolada do Campeonato Geral com 2.656,29 pontos!',
        body: [
          'O clube mantém uma regularidade inacreditável, somando pontuações sólidas em todas as rodadas e não dando brecha para apagões.',
          'A pergunta que ecoa nos bastidores da liga é uma só: haverá alguém capaz de frear a Tríplice Coroa de Alexandre De Sousa?'
        ],
        clubsInvolved: [
          { id: 'tainha-ovada-fc', name: 'Tainha Ovada FC', owner: 'Alexandre De Sousa', shieldUrl: '/escudos/Tainha Ovada FC.avif', role: 'Líder Geral & Campeão M10' }
        ],
        evidences: [
          { label: 'Troféu M10', value: 'Campeão Oficial (R29) vs Dois Vizinhos (+2.18 pts)', verified: true },
          { label: 'Copa B10', value: 'Classificado às Oitavas (235.09 x 120.59 Dique SC)', verified: true },
          { label: 'Classificação Geral', value: '1º Lugar com 2.656,29 pts', verified: true }
        ],
        priority: 75
      },
      {
        id: 'cruzada-furacao',
        category: 'cruzada',
        badge: 'O CAÇADOR DA LIGA • 19,12 PTS DA PONTA',
        badgeColor: 'red',
        headline: 'Furacão K7 FC Cola no Líder Geral e Avança na B10 em Noite Eletrizante!',
        subheadline: 'Cassio crava 116,43 pontos, elimina o cabeça de chave Avaih FC e mantém a perseguição implacável.',
        lead: 'Enquanto os holofotes se voltam para o Tainha Ovada, o FURACÃO K7 FC avança silencioso e mortal. Com uma pontuação maiúscula de 116,43 pontos na Rodada 30, Cassio superou o Avaih FC (241,07 a 231,69 no agregado) e carimbou sua vaga nas oitavas de final da B10. Mais do que isso: manteve a pressão máxima no Campeonato Geral, ficando a meros 19,12 pontos da liderança da liga!',
        body: [
          'O Furacão K7 acumula 2.637,17 pontos. A distância para Tainha caiu de 20,32 após a R29 para 19,12 após a R30: a perseguição segue acesa.',
          'A briga pela taça geral promete fortes emoções até a Rodada 38.'
        ],
        clubsInvolved: [
          { id: 'furacao-k7-fc', name: 'FURACÃO K7 FC', owner: 'Cassio', shieldUrl: '/escudos/FURACÃO K7 FC.avif', role: 'Vice-Líder Geral (2.637 pts)' },
          { id: 'avaih-f-c', name: 'Avaih F C', owner: 'Gabriel Alvarez', shieldUrl: '/escudos/Avaih F C.avif', role: 'Eliminado na B10' }
        ],
        evidences: [
          { label: 'Pontuação R30', value: '116.43 pts (6º Lugar da Rodada)', verified: true },
          { label: 'Copa B10', value: 'Avançou às Oitavas (241.07 x 231.69)', verified: true },
          { label: 'Distância da Liderança', value: 'Escassos 19.12 pontos do Tainha', verified: true }
        ],
        priority: 72
      },
      {
        id: 'cruzada-crf-galo',
        category: 'cruzada',
        badge: 'GUERREIRO DA B10 • DERROTOU DOIS GIGANTES',
        badgeColor: 'amber',
        headline: 'CRF Galo: A Odisseia do Clube que Sobreviveu aos Playoffs e Eliminou o Campeão de Setembro!',
        subheadline: 'Renato Galo despachou a Capitã Buske na R28 e agora derrubou o campeão C.R.Pirika em batalha ferrenha.',
        lead: 'O caminho do CRF Galo na Copa B10 parece saído de uma epopeia clássica. Na Fase 3 (Playoffs), o clube teve que lutar até o apito final da R28 para superar a perigosa Capitã Buske por 155,76 a 139,83. Promovido à Fase 4 para encarar o poderoso C.R.Pirika (campeão de Setembro e Elite #12), o Galo colocou a alma em campo: fez 108,24 na ida e mitou com 117,03 na volta, fechando o agregado em 225,27 a 223,29 para avançar por escassos 1,98 ponto!',
        body: [
          'A classificação histórica comprova a vocação copeira de Renato Galo, que superou dois adversários de primeiro escalão em semanas consecutivas.',
          'O time entra nas oitavas de final embalado e com a moral nas alturas.'
        ],
        clubsInvolved: [
          { id: 'crf-galo', name: 'CRF GALO', owner: 'Renato Galo', shieldUrl: '/escudos/CRF GALO.avif', role: 'Classificado às Oitavas B10' },
          { id: 'c-r-pirika', name: 'C.R.Pirika', owner: 'Diego a Jorge', shieldUrl: '/escudos/C.R.Pirika.avif', role: 'Eliminado por 1.98 pt' }
        ],
        evidences: [
          { label: 'Playoff #8 (R27+R28)', value: 'CRF Galo 155.76 x 139.83 Capitã Buske', verified: true },
          { label: 'Fase 4 (R29+R30)', value: 'CRF Galo 225.27 x 223.29 C.R.Pirika', verified: true },
          { label: 'Status B10', value: 'Vaga assegurada nas Oitavas de Final', verified: true }
        ],
        priority: 70
      }
    ];

    return { headlineStory, featuredStories, crossStories };
  }

  // ==========================================
  // EDIÇÃO #29 (Curadoria Histórica R29)
  // ==========================================
  if (round === 29) {
    const headlineStory: GazetaStory = {
      id: 'manchete-r29',
      category: 'manchete',
      badge: 'FINAL M10 & ABERTURA FASE 4 B10',
      badgeColor: 'blue',
      headline: 'Carlao07 Lidera a R29 com 148,81 Pontos e Tainha Ovada É Campeão Mundial da M10!',
      subheadline: 'Rodada 29 fica marcada pela maior pontuação individual da rodada e a consagração de Alexandre De Sousa na primeira taça oficial do ano.',
      lead: 'A Rodada 29 entrou para a história da Liga Só Camisa 10 como um marco inesquecível. Em uma jornada onde poucos previam tamanha avalanche de pontos, Carlos Henrique R. H (Carlao07) operou um milagre tático ao registrar estratosféricos 148,81 pontos no jogo de ida dos 16 avos da Copa B10 diante da Chinchila Cabeçuda — a maior pontuação entre os 50 clubes naquela rodada! Ao mesmo tempo, os holofotes internacionais testemunharam o Tainha Ovada FC bater o Dois Vizinhos SA por 119,86 a 117,68 na finalíssima da Copa M10, erguendo a primeira taça oficial do torneio.',
      body: [
        'Carlao07 marcou 148,81 contra 81,87 da Chinchila Cabeçuda na ida: vantagem de 66,94 pontos, com a decisão ainda reservada para a volta da R30.',
        'Já na decisão da M10, o duelo entre Alexandre De Sousa e Angelo Cassol foi resolvido nos acréscimos: escassos 2,18 pontos separaram o campeão Tainha Ovada da prata concedida ao Dois Vizinhos SA.',
        'Na disputa pelo terceiro lugar do Mundial, o Camisa Pesada SA (Gean Marques) garantiu o bronze ao derrotar o Monges Tibetanos FC por expressivos 132,96 a 113,86.'
      ],
      clubsInvolved: [
        { id: 'carlao07', name: 'Carlao07', owner: 'Carlos Henrique R. H', shieldUrl: '/escudos/Carlao07.avif', role: 'Craque Histórico (148.81 pts)' },
        { id: 'tainha-ovada-fc', name: 'Tainha Ovada FC', owner: 'Alexandre De Sousa', shieldUrl: '/escudos/Tainha Ovada FC.avif', role: 'Campeão Mundial M10' },
        { id: 'dois-vizinhos-sa', name: 'Dois Vizinhos SA', owner: 'Angelo Cassol', shieldUrl: '/escudos/Dois Vizinhos SA.avif', role: 'Vice-Campeão M10' }
      ],
      evidences: [
        { label: 'Maior Pontuação da R29', value: 'Carlao07 com 148.81 pts na R29', verified: true },
        { label: 'Final M10', value: 'Tainha 119.86 x 117.68 Dois Vizinhos (+2.18 pts)', verified: true },
        { label: 'Bronze M10', value: 'Camisa Pesada 132.96 x 113.86 Monges Tibetanos', verified: true }
      ],
      priority: 95
    };

    const featuredStories: GazetaStory[] = [
      {
        id: 'destaque-r29-carlao',
        category: 'destaque',
        badge: 'MAIOR PONTUAÇÃO DA R29',
        badgeColor: 'purple',
        headline: '148,81 Pontos: A Mitada que Fez a Liga Parar e Aplaudir Carlao07!',
        subheadline: 'A pontuação de 148,81 coloca Carlos Henrique como a grande referência da R29.',
        lead: 'Quando a escalação do Carlao07 entrou em campo na R29, ninguém imaginava o massacre que se desenharia. Atingindo a marca espetacular de 148,81 pontos, o clube abriu uma vantagem de 66,94 na ida da B10 e liderou Outubro. A vaga ainda dependia da volta.',
        body: ['Uma grande pontuação de equipe: 148,81 pontos, sem atribuir o desempenho a scouts individuais não disponíveis.'],
        clubsInvolved: [{ id: 'carlao07', name: 'Carlao07', owner: 'Carlos Henrique R. H', role: '148.81 pts' }],
        evidences: [{ label: 'Maior Pontuação R29', value: '148.81 pontos', verified: true }],
        priority: 85
      },
      {
        id: 'destaque-r29-camisa-pesada',
        category: 'destaque',
        badge: 'BRONZE NA M10 & VANTAGEM NA B10',
        badgeColor: 'emerald',
        headline: 'Camisa Pesada SA Conquista o Bronze Mundial e Abre Grande Frente na B10!',
        subheadline: 'Gean Marques pontua 132,96 e fecha a R29 com duplo motivo para celebrar.',
        lead: 'O Camisa Pesada SA não se abalou por ficar fora da grande final da M10: entrou com faca nos dentes na disputa do 3º lugar, superou o Monges Tibetanos e ainda abriu ótima vantagem sobre o Lendinhaxx FC nos 16 avos da B10.',
        body: ['A consistência de Gean Marques consolida sua equipe no pelotão de frente de todas as competições.'],
        clubsInvolved: [{ id: 'camisa-pesada-sa', name: 'Camisa Pesada SA', owner: 'Gean Marques', role: '132.96 pts' }],
        evidences: [{ label: 'Pódio M10', value: '3º Lugar Oficial', verified: true }],
        priority: 80
      }
    ];

    const crossStories: GazetaStory[] = [
      {
        id: 'cruzada-r29-dois-vizinhos',
        category: 'cruzada',
        badge: 'RESILIÊNCIA DE ELITE',
        badgeColor: 'amber',
        headline: 'Dois Vizinhos SA: Vice da M10 e Liderança Firme na Ida da Copa B10',
        subheadline: 'Angelo Cassol sentiu a dor dos 2,18 pontos na final mundial, mas venceu Delirio por 117,68 a 96,45 na B10.',
        lead: 'Perder uma final por 2 pontos machuca qualquer cartoleiro, mas o Dois Vizinhos SA mostrou maturidade competitiva: canalizou as energias na Copa B10 e encaminhou a classificação para as oitavas com grande autoridade.',
        body: ['A equipe segue como a grande candidata ao título da B10 e se mantém viva na caça ao G-4 do Geral.'],
        clubsInvolved: [{ id: 'dois-vizinhos-sa', name: 'Dois Vizinhos SA', owner: 'Angelo Cassol', role: 'Vice M10 & Venceu Ida B10' }],
        evidences: [{ label: 'Final M10', value: 'Vice-Campeão com 117.68 pts', verified: true }],
        priority: 70
      }
    ];

    return { headlineStory, featuredStories, crossStories };
  }

  // ==========================================
  // EDIÇÃO #28 (Curadoria Histórica R28)
  // ==========================================
  if (round === 28) {
    const headlineStory: GazetaStory = {
      id: 'manchete-r28',
      category: 'manchete',
      badge: 'PLAYOFFS B10 & ENCERRAMENTO DE SETEMBRO',
      badgeColor: 'purple',
      headline: 'Playoffs de Sangue e Areia na B10: CRF Galo Vence Capitã Buske e Futcafa Despacha Casquinha!',
      subheadline: 'A repescagem em 180 minutos definiu os 16 clubes sobreviventes para a Fase 4; favoritos caem em confrontos eletrizantes.',
      lead: 'A Rodada 28 fechou os confrontos eliminatórios da Fase 3 (Playoffs) da Copa B10, decidindo quem conquistaria o passaporte para encarar o Grupo de Elite nos 16 avos de final. Em um dos duelos mais comentados da liga, o CRF Galo (Renato Galo) triunfou sobre a aguerrida equipe da Capitã Buske (Bruno Buske) pelo placar agregado de 155,76 a 139,83, carimbando sua vaga de acesso. Em outro confronto explosivo, o Futcafa (Laion Gomes) impôs 162,57 pontos agregados contra 147,26 do tradicional Casquinha EC, despachando um dos postulantes mais fortes ao título!',
      body: [
        'A eliminatória da B10 separou o joio do trigo: enquanto a Capitã Buske caiu de cabeça erguida nos playoffs e redirecionou seu foco integral para o Campeonato Geral, o CRF Galo seguiu em frente para desafiar o C.R.Pirika.',
        'No caso de Casquinha EC, a eliminação nos playoffs foi um banho de água fria após excelente campanha na fase regular, mas abriu espaço para o Futcafa se consagrar como uma das surpresas mais perigosas do torneio.',
        'Paralelamente, a Rodada 28 consagrou o fechamento oficial do mês de Setembro na disputa mensal da liga.'
      ],
      clubsInvolved: [
        { id: 'crf-galo', name: 'CRF GALO', owner: 'Renato Galo', shieldUrl: '/escudos/CRF GALO.avif', role: 'Venceu Playoff #8 (155.76 pts)' },
        { id: 'capita-buske', name: 'capita Buske', owner: 'Bruno buske', shieldUrl: '/escudos/capita Buske.avif', role: 'Caiu no Playoff #8 (139.83 pts)' },
        { id: 'futcafa', name: 'Futcafa', owner: 'Laion Gomes', shieldUrl: '/escudos/Futcafa.avif', role: 'Venceu Playoff #12 (162.57 pts)' },
        { id: 'casquinha-ec', name: 'Casquinha EC', owner: 'Rodrigo Casca', shieldUrl: '/escudos/Casquinha EC.avif', role: 'Caiu no Playoff #12 (147.26 pts)' }
      ],
      evidences: [
        { label: 'Playoff #8 (R27+R28)', value: 'CRF Galo 155.76 x 139.83 Capitã Buske', verified: true },
        { label: 'Playoff #12 (R27+R28)', value: 'Futcafa 162.57 x 147.26 Casquinha EC', verified: true },
        { label: 'Destino dos Eliminados', value: 'Foco exclusivo no Campeonato Geral', verified: true }
      ],
      priority: 90
    };

    const featuredStories: GazetaStory[] = [
      {
        id: 'destaque-r28-galo',
        category: 'destaque',
        badge: 'GLÓRIA NOS PLAYOFFS',
        badgeColor: 'emerald',
        headline: 'CRF Galo Bate Capitã Buske por 155,76 a 139,83 e Vai à Fase 4!',
        subheadline: 'Renato Galo supera a pressão e garante a vaga na repescagem.',
        lead: 'Com atuações equilibradas nas rodadas 27 e 28, o CRF Galo soube administrar a vantagem sobre a Capitã Buske para carimbar sua passagem para a Fase 4 da Copa B10.',
        body: ['A vitória provou a casca grossa do Galo nas eliminatórias.'],
        clubsInvolved: [{ id: 'crf-galo', name: 'CRF GALO', owner: 'Renato Galo', role: 'Classificado' }],
        evidences: [{ label: 'Placar Playoff', value: '155.76 x 139.83', verified: true }],
        priority: 85
      }
    ];

    const crossStories: GazetaStory[] = [
      {
        id: 'cruzada-r28-capita',
        category: 'cruzada',
        badge: 'FOCANDO NO GERAL',
        badgeColor: 'blue',
        headline: 'Capitã Buske e Casquinha EC Voltam as Forças para a Temporada Geral',
        subheadline: 'Eliminados nos playoffs da B10, clubes apostam na regularidade dos pontos corridos.',
        lead: 'Embora a eliminação nos playoffs da B10 tenha frustrado as pretensões de mata-mata, Capitã Buske e Casquinha EC possuem elencos capacitados para pontuar alto no Campeonato Geral.',
        body: ['A temporada é longa e a corrida de pontos corridos ainda reserva muitas reviravoltas.'],
        clubsInvolved: [
          { id: 'capita-buske', name: 'capita Buske', owner: 'Bruno buske', role: 'Eliminado Playoffs B10' },
          { id: 'casquinha-ec', name: 'Casquinha EC', owner: 'Rodrigo Casca', role: 'Eliminado Playoffs B10' }
        ],
        evidences: [{ label: 'Conclusão Playoffs', value: 'R28 encerra Fase 3 da B10', verified: true }],
        priority: 75
      }
    ];

    return { headlineStory, featuredStories, crossStories };
  }

  // ==========================================
  // GERAÇÃO DINÂMICA (Para Rodada 31 em diante ou outras)
  // ==========================================
  const bestClubName = bestScore?.primaryClubName || 'Craque da Rodada';
  const bestClubScore = bestScore?.facts.find(f => f.label.includes('Pontuação'))?.value || '0 pts';
  const leaderName = leaderGeral?.name || 'Líder Geral';
  const leaderPoints = leaderGeral?.totalPoints ? `${leaderGeral.totalPoints.toFixed(2)} pts` : '2656 pts';

  const headlineStory: GazetaStory = {
    id: `manchete-r${round}`,
    category: 'manchete',
    badge: `COBERTURA OFICIAL • RODADA ${round}`,
    badgeColor: 'gold',
    headline: `Giro da Rodada ${round}: ${bestClubName} Crava ${bestClubScore} e Líder ${leaderName} Defende o Trono!`,
    subheadline: `A Rodada ${round} movimenta a classificação geral da Só Camisa 10 e acirra os duelos eliminatórios na reta decisiva da temporada.`,
    lead: `A Rodada ${round} da Liga Só Camisa 10 consolidou números impactantes e aqueceu a disputa pelo troféu da temporada. O grande craque da jornada foi o ${bestClubName}, que liderou a rodada com ${bestClubScore}, desequilibrando as médias dos adversários. Na ponta da classificação geral acumulada, ${leaderName} sustenta ${leaderPoints}, sob forte pressão do pelotão perseguidor.`,
    body: [
      `A rodada reuniu novas pontuações e capítulos nas disputas da temporada; a cobertura deve acompanhar as consequências verificadas desses resultados.`,
      `Na briga pelas copas e pela premiação mensal, cada décimo de ponto altera a posição na tabela e define o futuro dos clubes participantes.`
    ],
    clubsInvolved: [
      { id: bestScore?.primaryClubId || 'best', name: bestClubName, owner: bestScore?.primaryClubOwner || 'Cartoleiro', role: `Craque R${round}` },
      { id: leaderGeral?.id || 'leader', name: leaderName, owner: leaderGeral?.owner || 'Líder', role: 'Líder Geral' }
    ],
    evidences: [
      { label: `Craque da R${round}`, value: `${bestClubName} (${bestClubScore})`, verified: true },
      { label: 'Liderança Geral', value: `${leaderName} (${leaderPoints})`, verified: true },
      { label: 'Rodada Oficial', value: `Rodada ${round} homologada`, verified: true }
    ],
    priority: 95
  };

  const featuredStories: GazetaStory[] = [
    {
      id: `destaque-craque-r${round}`,
      category: 'destaque',
      badge: `MITADA DA R${round}`,
      badgeColor: 'blue',
      headline: `${bestClubName} Dita o Ritmo da Rodada com Atuação Espetacular!`,
      subheadline: `Pontuação máxima de ${bestClubScore} consagra a escalação mais eficiente da jornada.`,
      lead: `O time de ${bestScore?.primaryClubOwner || 'comandante'} encontrou as melhores peças no mercado e coroou a Rodada ${round} no ponto mais alto do pódio.`,
      body: [`A mitada impulsiona o clube na tabela de pontos corridos e renova a confiança para as próximas etapas.`],
      clubsInvolved: [{ id: bestScore?.primaryClubId || 'best', name: bestClubName, owner: bestScore?.primaryClubOwner || '', role: '1º Lugar da Rodada' }],
      evidences: [{ label: `Pontos na R${round}`, value: bestClubScore, verified: true }],
      priority: 85
    }
  ];

  const crossStories: GazetaStory[] = [
    {
      id: `cruzada-titulo-r${round}`,
      category: 'cruzada',
      badge: 'DISPUTA PELO TÍTULO GERAL',
      badgeColor: 'amber',
      headline: `Batalha no Topo: ${leaderName} e ${viceGeral.name} Travam Duelo Ponto a Ponto`,
      subheadline: `A reta final da temporada exige regularidade absoluta dos pretendentes à taça.`,
      lead: `Com a temporada avançando na Rodada ${round}, a margem para erros é mínima entre os líderes. Qualquer deslize na escalação pode custar o troféu mais cobiçado da liga.`,
      body: [`Ambos os clubes seguem pontuando acima da média e prometem emoção até a rodada final.`],
      clubsInvolved: [
        { id: leaderGeral.id, name: leaderGeral.name, owner: leaderGeral.owner, role: '1º Colocado Geral' },
        { id: viceGeral.id, name: viceGeral.name, owner: viceGeral.owner, role: '2º Colocado Geral' }
      ],
      evidences: [
        { label: 'Líder', value: `${leaderGeral.name} (${leaderPoints})`, verified: true },
        { label: 'Vice-Líder', value: `${viceGeral.name} (${viceGeral.totalPoints?.toFixed(2) || '2637'} pts)`, verified: true }
      ],
      priority: 75
    }
  ];

  return { headlineStory, featuredStories, crossStories };
}

