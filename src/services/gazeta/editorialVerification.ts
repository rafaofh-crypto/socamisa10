import { R32_CURATED_EDITION, R32_EDITORIAL_SOURCE } from './r32CuratedEdition';
import { R31_CURATED_EDITION, R31_EDITORIAL_SOURCE } from './r31CuratedEdition';
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
  [R32_EDITORIAL_SOURCE.id]: Object.freeze({authority: 'Planilha oficial R32 conferida para a prévia editorial', reference: R32_EDITORIAL_SOURCE.url + ' · ' + R32_EDITORIAL_SOURCE.modified}),
  [R31_EDITORIAL_SOURCE.id]: Object.freeze({authority: 'Planilha oficial R31 conferida para a prévia editorial', reference: R31_EDITORIAL_SOURCE.url + ' · ' + R31_EDITORIAL_SOURCE.modified}),
  [CONFIRMED_SOURCE.id]: Object.freeze({authority:'Planilha oficial corrigida pelo diretor',reference:CONFIRMED_SOURCE.url+' · '+CONFIRMED_SOURCE.modified}),
  'diretor-buske-r30-2026-10-14': Object.freeze({
    authority: 'Responsável pelo Só Camisa 10',
    reference: 'Mensagem do diretor: "ele fez na rodada 30 - 80.58 pontos"',
  }),
});
export const CONFIRMED_ROUND_SCORES: readonly Readonly<ConfirmedRoundScore>[] = Object.freeze([
  ...R32_EDITORIAL_SOURCE.records.map(t => Object.freeze({season: 2026, round: 32, clubId: t.id, clubName: t.name, score: t.score, sourceId: R32_EDITORIAL_SOURCE.id})),
  ...R31_EDITORIAL_SOURCE.records.map(t => Object.freeze({season: 2026, round: 31, clubId: t.id, clubName: t.name, score: t.score, sourceId: R31_EDITORIAL_SOURCE.id})),
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
      if (round === 32) return 'Há divergência ou ausência de dados na leitura da R32. A Gazeta preserva a edição conferida com a planilha oficial.';
      if (round === 31) return 'Há divergência ou ausência de dados na leitura da R31. A Gazeta preserva a edição conferida com a planilha oficial.';
      return 'Há divergência ou ausência de dados na leitura da rodada. A Gazeta utiliza a edição retificada e conferida com a planilha oficial.';
    }
  }
  return null;
}

/** Every score in the story and WhatsApp comes from the same confirmed fact. */
export function buildVerifiedGazetaEdition(round: number): GazetaEdition | null {
  if (round === 32) {
    const source = R32_EDITORIAL_SOURCE;
    const edition = R32_CURATED_EDITION;
    if (source.season !== 2026 || source.round !== 32 || source.records.length !== 50 ||
        new Set(source.records.map(t => t.id)).size !== 50 || edition.radarClubs.length !== 50 ||
        new Set(edition.radarClubs.map(t => t.id)).size !== 50 || edition.b10Digest.length !== 8) return null;
    for (const record of source.records) {
      const previous = R31_CURATED_EDITION.radarClubs.find(t => t.id === record.id);
      const digest = edition.radarClubs.find(t => t.id === record.id);
      if (!previous || !digest || previous.name !== record.name ||
          !validateRoundScoreCandidate({season:2026,round:32,clubId:record.id,clubName:record.name,score:record.score,sourceId:source.id}) ||
          digest.roundScore !== record.score ||
          Math.round(digest.geralPoints * 100) !== Math.round(previous.geralPoints * 100) + Math.round(record.score * 100) ||
          Math.round(digest.monthPoints * 100) !== Math.round(previous.monthPoints * 100) + Math.round(record.score * 100)) return null;
    }
    for (const match of edition.b10Digest) {
      const home31 = R31_EDITORIAL_SOURCE.records.find(t => t.id === match.homeClub.id);
      const away31 = R31_EDITORIAL_SOURCE.records.find(t => t.id === match.awayClub.id);
      const home32 = source.records.find(t => t.id === match.homeClub.id);
      const away32 = source.records.find(t => t.id === match.awayClub.id);
      if (!home31 || !away31 || !home32 || !away32 || match.homeLeg1 !== home31.score || match.awayLeg1 !== away31.score ||
          match.homeLeg2 !== home32.score || match.awayLeg2 !== away32.score ||
          Math.round(match.homeAggregate*100) !== Math.round(match.homeLeg1*100)+Math.round(match.homeLeg2*100) ||
          Math.round(match.awayAggregate*100) !== Math.round(match.awayLeg1*100)+Math.round(match.awayLeg2*100) ||
          match.homeAggregate === match.awayAggregate ||
          match.winnerId !== (match.homeAggregate > match.awayAggregate ? match.homeClub.id : match.awayClub.id)) return null;
    }
    return edition;
  }
  if (round === 31) {
    const source = R31_EDITORIAL_SOURCE;
    const edition = R31_CURATED_EDITION;
    if (source.season !== 2026 || source.round !== 31 || source.records.length !== 50 ||
        new Set(source.records.map(t => t.id)).size !== 50 || edition.radarClubs.length !== 50 || new Set(edition.radarClubs.map(t => t.id)).size !== 50) return null;
    for (const record of source.records) {
      const team = CONFIRMED_SEASON_TEAMS.find(t => t.id === record.id);
      const digest = edition.radarClubs.find(t => t.id === record.id);
      if (!team || !digest || team.name !== record.name || !validateRoundScoreCandidate({season: 2026, round: 31, clubId: record.id, clubName: record.name, score: record.score, sourceId: source.id}) ||
          digest.roundScore !== record.score ||
          Math.round(digest.geralPoints * 100) !== Object.values(team.scores).reduce((n, v) => n + Math.round(v * 100), 0) + Math.round(record.score * 100)) return null;
    }
    return edition;
  }
  const facts=CONFIRMED_ROUND_SCORES.filter(fact=>fact.round===round && fact.sourceId===CONFIRMED_SOURCE.id);
  if(facts.length!==50 || !facts.every(validateRoundScoreCandidate))return null;
  return buildConfirmedEdition(round);
}
