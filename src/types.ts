export interface Team {
  name: string;
  group: number; // Group index (0-11 for groups A-L)
  position: number; // Position in group (1-4)
  points: number; // Points earned
  goalDifference: number; // Goal difference
  goalsFor: number; // Goals scored
  qualifyingPosition: number; // Overall qualifying position (1-48)
  originalIndex: number; // Original index for tiebreaking
  owner?: string; // Cartoleiro / Manager name
  thirdRanking?: number; // Optional visual rank for top 3rd placed teams
  shieldUrl?: string; // Shield SVG
  groupRound1?: number; // Score for round 1 of groups
  groupRound2?: number; // Score for round 2 of groups
  groupRound3?: number; // Score for round 3 of groups
  is_survivor?: boolean; // Label for Copa M10
}

export interface Match {
  id: string; // Match ID (e.g., 'M77')
  phase: string; // Phase name (ROUND_OF_16, etc.)
  home: Team | null;
  away: Team | null;
  winner: Team | null;
  loser: Team | null;
  homeScore?: number;
  awayScore?: number;
  penaltyWinnerId?: string; // in case of draw in knockout
}

export interface BracketState {
  round_of_16: Match[];
  quarter_finals: Match[];
  semi_finals: Match[];
  third_place: Match[];
  final: Match[];
}

export interface TournamentCalendarEntry {
  round: number;
  copaM10: {
    phase: string;
    description: string;
    status: "upcoming" | "active" | "completed" | "historical" | "inactive";
    rules?: string;
  };
  copaB10: {
    phase: string;
    description: string;
    status: "upcoming" | "active" | "completed" | "historical" | "inactive";
    rules?: string;
  };
  generalEvent?: string;
}

