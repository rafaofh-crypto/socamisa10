export type CompetitionType = 'geral' | 'mensal' | 'copa_b10' | 'copa_m10' | 'rodada';

export type JournalisticEventType =
  | 'MAJOR_UPSET'              // Zebra histórica: time de pior ranking elimina cabeça de chave
  | 'NAIL_BITER'               // Decisão por margem mínima (diferença minúscula)
  | 'BLOWOUT'                  // Atropelo / goleada de pontos
  | 'CROSS_CONTRAST'           // Brilha em uma competição e sofre em outra
  | 'TRIPLE_CROWN_CHASE'       // Disputando múltiplos títulos (ex: Campeão M10 + Líder Geral + B10)
  | 'MONTHLY_LEADERSHIP'       // Liderança / briga pelo título mensal
  | 'GERAL_TITLE_RACE'         // Disputa acirrada pelo troféu da temporada
  | 'ROUND_HIGHEST_SCORE'      // Maior pontuação da rodada (craque/mitada)
  | 'ROUND_LOWEST_SCORE'       // Menor pontuação da rodada
  | 'CLIMBER_OF_THE_ROUND'     // Maior salto de posições na Geral
  | 'CUP_QUALIFICATION'        // Classificação consolidada para a próxima fase
  | 'CUP_ELIMINATION';         // Eliminação de copa

export interface FactualEvidence {
  label: string;
  value: string;
  verified: boolean;
}

export interface JournalisticEvent {
  id: string;
  type: JournalisticEventType;
  primaryClubId: string;
  primaryClubName: string;
  primaryClubOwner: string;
  secondaryClubId?: string;
  secondaryClubName?: string;
  secondaryClubOwner?: string;
  competitions: CompetitionType[];
  round: number;
  importance: number; // 1 to 10
  headlineDraft: string;
  summaryDraft: string;
  facts: FactualEvidence[];
}

export interface ClubSeasonProfile {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  
  // Geral
  totalPoints: number;
  geralRank: number;
  prevGeralRank: number;
  rankDelta: number; // positive = climbed, negative = dropped
  roundScore: number;
  
  // Mensal (Outubro)
  monthPoints: number;
  monthRank: number;
  monthName: string;
  isMonthLeader: boolean;
  
  // Copa B10
  b10Category?: 'ELITE' | 'PLAYOFF' | 'REPESCAGEM';
  b10CutRank?: number;
  b10Phase4Match?: {
    opponentId: string;
    opponentName: string;
    leg1Score: number;
    leg2Score: number;
    aggregateScore: number;
    opponentAggregate: number;
    diff: number;
    isWinner: boolean;
    isUpset: boolean; // venceu time de melhor seed
  };
  b10Status?: 'CLASSIFICADO_OITAVAS' | 'ELIMINADO_FASE4' | 'ELIMINADO_PLAYOFFS' | 'ELIMINADO_REPESCAGEM';
  
  // Copa M10
  m10Status?: 'CAMPEAO_MUNDIAL' | 'VICE_CAMPEAO' | 'TERCEIRO_LUGAR' | 'QUARTO_LUGAR' | 'ELIMINADO' | 'NAO_PARTICIPOU';
  m10Notes?: string;
}

export interface GazetaStory {
  id: string;
  category: 'manchete' | 'copa_b10' | 'copa_m10' | 'mensal' | 'geral' | 'cruzada' | 'destaque';
  badge: string;
  badgeColor: 'gold' | 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
  headline: string;
  subheadline: string;
  lead: string;
  body: string[];
  clubsInvolved: {
    id: string;
    name: string;
    owner: string;
    shieldUrl?: string;
    role?: string;
  }[];
  evidences: FactualEvidence[];
  priority: number;
}

export interface CupMatchReport {
  matchNumber: number;
  homeClub: { id: string; name: string; owner: string; shieldUrl?: string; seedRank?: number; isElite?: boolean };
  awayClub: { id: string; name: string; owner: string; shieldUrl?: string; seedRank?: number; isElite?: boolean };
  homeLeg1: number;
  homeLeg2: number;
  homeAggregate: number;
  awayLeg1: number;
  awayLeg2: number;
  awayAggregate: number;
  winnerId: string;
  winnerName: string;
  diff: number;
  isUpset: boolean;
  status: 'ENCERRADO' | 'EM_ANDAMENTO' | 'PENDENTE';
}

export interface RadarClubDigest {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  roundScore: number;
  geralPoints: number;
  geralRank: number;
  geralRankDelta: number;
  monthPoints: number;
  monthRank: number;
  b10StatusLabel: string;
  m10StatusLabel: string;
  headline: string;
  miniSummary: string;
  highlightTag: string;
}

export interface GazetaEdition {
  editionNumber: number;
  round: number;
  title: string;
  subtitle: string;
  dateStr: string;
  verificationNotice?: string;
  stats: {
    totalClubs: number | null;
    averageRoundScore: number | null;
    highestScore: { clubName: string; score: number } | null;
    lowestScore: { clubName: string; score: number } | null;
    totalMatchesB10Concluded: number | null;
    m10Champion: string;
  };
  headlineStory: GazetaStory;
  featuredStories: GazetaStory[];
  crossStories: GazetaStory[];
  b10Digest: CupMatchReport[];
  monthlyTop5: { rank: number; name: string; owner: string; points: number }[];
  geralTop5: { rank: number; name: string; owner: string; points: number; delta: number }[];
  radarClubs: RadarClubDigest[];
  whatsappText: string;
}

