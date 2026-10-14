import type { CartolaTeam } from '../cartolaService';
import type { GazetaEdition } from './types';

export interface ConfirmedRoundScore {
  season: number; round: number; clubId: string; clubName: string;
  score: number; sourceId: string;
}

// Editorial only: this confirmation does not change sporting data.
const APPROVED_SOURCES = Object.freeze({
  'diretor-buske-r30-2026-10-14': Object.freeze({
    authority: 'Responsável pelo Só Camisa 10',
    reference: 'Mensagem do diretor: "ele fez na rodada 30 - 80.58 pontos"',
  }),
});
export const CONFIRMED_ROUND_SCORES: readonly Readonly<ConfirmedRoundScore>[] = Object.freeze([
  Object.freeze({ season: 2026, round: 30, clubId: 'capita-buske', clubName: 'Capitã Buske',
    score: 80.58, sourceId: 'diretor-buske-r30-2026-10-14' }),
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
      return 'Há divergência ou ausência de dados na leitura da rodada. A Gazeta mantém apenas informações confirmadas; as tabelas da competição não foram alteradas.';
    }
  }
  return null;
}

/** Every score in the story and WhatsApp comes from the same confirmed fact. */
export function buildVerifiedGazetaEdition(round: number): GazetaEdition | null {
  const fact = CONFIRMED_ROUND_SCORES.find(item => item.round === round);
  if (!fact || !validateRoundScoreCandidate(fact)) return null;
  const scoreText = fact.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const source = APPROVED_SOURCES[fact.sourceId as keyof typeof APPROVED_SOURCES];
  const headline = `${fact.clubName} marca ${scoreText} pontos na R${fact.round}: a batalha continua!`;
  const lead = `A temporada segue em campo: ${fact.clubName} somou ${scoreText} pontos na Rodada ${fact.round}. Essa é a pontuação confirmada pelo responsável do Só Camisa 10.`;
  return {
    editionNumber: round, round, title: `Gazeta C10 · R${round}`,
    subtitle: 'Liberdade narrativa, rigor factual.', dateStr: '14 de Outubro de 2026',
    verificationNotice: `Edição em conferência: a matéria de ${fact.clubName} foi retificada para ${scoreText} pontos. A afirmação de segunda maior pontuação foi retirada. Outras matérias, radar e tabelas editoriais aguardam conferência das fontes. Os resultados das competições permanecem preservados.`,
    stats: { totalClubs: null, averageRoundScore: null, highestScore: null, lowestScore: null,
      totalMatchesB10Concluded: null, m10Champion: '' },
    headlineStory: {
      id: `pontuacao-${fact.clubId}-r${round}`, category: 'manchete',
      badge: 'PONTUAÇÃO CONFIRMADA', badgeColor: 'gold', headline,
      subheadline: 'Informação confirmada pelo responsável da liga.', lead,
      body: ['A batalha segue: o resultado da rodada é um capítulo da temporada, que a Gazeta acompanha com emoção e respeito aos fatos.'],
      clubsInvolved: [{ id: fact.clubId, name: fact.clubName, owner: '', shieldUrl: '/escudos/capita Buske.avif' }],
      evidences: [{ label: `Pontuação R${round} · ${source.authority}`, value: `${scoreText} pontos`, verified: true }],
      priority: 100,
    },
    featuredStories: [], crossStories: [], b10Digest: [], monthlyTop5: [], geralTop5: [], radarClubs: [],
    whatsappText: `⚽📰 *GAZETA SÓ CAMISA 10 — R${round}*\n*EDIÇÃO EM CONFERÊNCIA*\n\n*${headline}*\n${lead}\n\nRetificação editorial: a informação de segunda maior pontuação foi retirada. A cobertura completa aguarda conferência das fontes. Nenhum resultado ou classificação foi alterado.`,
  };
}
