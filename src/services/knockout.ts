import { Team } from "../types";
import { 
  GROUP_LETTERS,
  generateGroups as originalGenerateGroups,
  processCuttingRound as originalProcessCuttingRound,
  buildFullBracket as originalBuildFullBracket,
  propagateWinnerToNextMatch as originalPropagateWinnerToNextMatch,
  processMatchResults as originalProcessMatchResults,
  determineFinalRankings as originalDetermineFinalRankings,
  generateBracketReport as originalGenerateBracketReport,
  CuttingRoundResult as TCuttingRoundResult,
  BracketMatch as TBracketMatch,
  FullBracket as TFullBracket,
  FinalRankings as TFinalRankings
} from "../tournamentData";
import { CartolaTeam } from "./cartollaApi";

// Export the central types for knockout
export type BracketMatch = TBracketMatch;
export type FullBracket = TFullBracket;
export type FinalRankings = TFinalRankings;
export type CuttingRoundResult = TCuttingRoundResult;

export const GROUPS_LIST = GROUP_LETTERS;

/**
 * Delegated Group Generation
 */
export function generateGroups(
  topHeads: any[],
  remaining36: any[]
): Record<string, Team[]> {
  return originalGenerateGroups(topHeads, remaining36);
}

/**
 * Delegated Cutting Round Processor
 */
export function processCuttingRound(
  round_number: number,
  allParticipants: CartolaTeam[],
  isSimulatorsEnabled: boolean = false,
  currentRound: number = 38
): CuttingRoundResult {
  return originalProcessCuttingRound(round_number, allParticipants, isSimulatorsEnabled, currentRound);
}

/**
 * Delegated Bracket Build
 */
export function buildFullBracket(
  groupResults: Record<string, { first?: Team; second?: Team; third?: Team; fourth?: Team }>,
  thirdPlacedAllocations: Record<string, Team> = {}
): FullBracket {
  return originalBuildFullBracket(groupResults, thirdPlacedAllocations);
}

/**
 * Delegated Bracket Winner Propagation
 */
export function propagateWinnerToNextMatch(
  bracket: FullBracket,
  currentPhase: string,
  matchCode: string,
  winner: Team,
  nextPhase: string
): void {
  originalPropagateWinnerToNextMatch(bracket, currentPhase, matchCode, winner, nextPhase);
}

/**
 * Delegated Match Result Calculator
 */
export function processMatchResults(
  bracket: FullBracket,
  phase: string,
  scoresByRound: Record<string, Record<number, number>> | any,
  tiebreakers: any = {}
): any {
  return originalProcessMatchResults(bracket, phase, scoresByRound, tiebreakers);
}

/**
 * Delegated Final Rankings Determinator
 */
export function determineFinalRankings(bracket: FullBracket): FinalRankings {
  return originalDetermineFinalRankings(bracket);
}

/**
 * Delegated Bracket Simulation ASCII/Markdown Report Generator
 */
export function generateBracketReport(bracket: FullBracket, rankings: FinalRankings | null = null): string {
  return originalGenerateBracketReport(bracket, rankings);
}
