import type { CartolaTeam } from '../cartolaService';
import type { GazetaEdition } from './types';
import { CONFIRMED_SEASON_TEAMS, CONFIRMED_SOURCE } from './confirmedSeason2026';
import { buildConfirmedEdition } from './confirmedGazetaBuilder';

export interface ConfirmedRoundScore {
  season: number; round: number; clubId: string; clubName: string;
  score: number; sourceId: string;
}

// Editorial only: this confirmation does not change sporting data.
const APPROVED_SOURCES = Object.freeze({
  [CONFIRMED_SOURCE.id]: Object.freeze({authority:'Planilha oficial corrigida pelo diretor',reference:CONFIRMED_SOURCE.url+' · '+CONFIRMED_SOURCE.modified}),
  'diretor-buske-r30-2026-10-14': Object.freeze({
    authority: 'Responsável pelo Só Camisa 10',
    reference: 'Mensagem do diretor: "ele fez na rodada 30 - 80.58 pontos"',
  }),
});
export const CONFIRMED_ROUND_SCORES: readonly Readonly<ConfirmedRoundScore>[] = Object.freeze([
  Object.freeze({ season: 2026, round: 30, clubId: 'capita-buske', clubName: 'Capitã Buske',
    score: 80.58, sourceId: 'diretor-buske-r30-2026-10-14' }),
  ...CONFIRMED_SEASON_TEAMS.flatMap(team => [28,29,30].map(round => Object.freeze({season:2026,round,clubId:team.id,clubName:team.name,score:team.scores[round],sourceId:CONFIRMED_SOURCE.id}))),
]);

/** An absent score never becomes zero; a real numeric zero remains a score. */
export function isRecordedScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** A verified flag does not approve a fact: identity, round, source and value must match. */
export function validateRoundScoreCandidate(candidate: ConfirmedRoundScore): boolean {
  if (!candidate || !isRecordedScore(candidate.score) ||
      !Number.isInteger(candidate.round) || candidate.round < 1 || candidate.round > 38 ||
      !Object.hasOwn(APPROVED_SOURCES, candidate.sourceId)) return false;
  return CONFIRMED_ROUND_SCORES.some(fact =>
    fact.season === candidate.season && fact.round === candidate.round &&
    fact.clubId === candidate.clubId && fact.clubName === candidate.clubName &&
    fact.score === candidate.score && fact.sourceId === candidate.sourceId);
}

const normalize = (value: string) => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

/** Read-only diagnostics. Never overwrite sports data or certify other clubs. */
export function getGazetaSourceWarning(teams: CartolaTeam[], round: number): string | null {
  for (const fact of CONFIRMED_ROUND_SCORES.filter(item => item.round === round)) {
    const matches = teams.filter(team => team.id === fact.clubId ||
      normalize(team.name || '') === normalize(fact.clubName));
    if (matches.length === 0) continue;
    if (matches.length !== 1 || !isRecordedScore(matches[0].scores?.[round]) ||
        matches[0].scores[round] !== fact.score) {
      return 'Há divergência ou ausência de dados na leitura da rodada. A Gazeta utiliza a edição retificada e conferida com a planilha oficial.';
    }
  }
  return null;
}

/** Every score in the story and WhatsApp comes from the same confirmed fact. */
export function buildVerifiedGazetaEdition(round: number): GazetaEdition | null {
  const facts=CONFIRMED_ROUND_SCORES.filter(fact=>fact.round===round && fact.sourceId===CONFIRMED_SOURCE.id);
  if(facts.length!==50 || !facts.every(validateRoundScoreCandidate))return null;
  return buildConfirmedEdition(round);
}
