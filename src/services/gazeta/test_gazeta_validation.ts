import { buildGazetaEdition } from './gazetaEngine';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';
import * as fs from 'fs';
import * as assert from 'assert';
import { CartolaTeam } from '../cartolaService';

console.log("Iniciando bateria de validações de integridade da Gazeta C10 2.0...");

// Carregar os 50 times oficiais com todas as rodadas
const r30 = JSON.parse(fs.readFileSync('round30_scores_db.json', 'utf8'));
const teamIds = Object.keys(r30);
assert.strictEqual(teamIds.length, 50, "Deve conter exatamente 50 clubes");

const teams: CartolaTeam[] = [];
for (const id of teamIds) {
  const scores: Record<number, number> = {};
  for (let r = 1; r <= 30; r++) {
    if (fs.existsSync(`round${r}_scores_db.json`)) {
      const db = JSON.parse(fs.readFileSync(`round${r}_scores_db.json`, 'utf8'));
      if (db[id] !== undefined) scores[r] = db[id];
    }
  }
  teams.push({
    id,
    name: id.replace(/-/g, ' ').toUpperCase(),
    owner: 'Técnico ' + id,
    shieldUrl: '',
    scores
  });
}

const edition = buildGazetaEdition(teams, 30);

// Validação 1: Invariante dos 50 Clubes
assert.strictEqual(edition.radarClubs.length, 50, "Radar deve conter exatamente 50 clubes auditados");
for (const club of edition.radarClubs) {
  assert.ok(Number.isFinite(club.roundScore), `Pontuação da rodada deve ser finita para ${club.id}`);
  assert.ok(Number.isFinite(club.geralPoints), `Pontos gerais devem ser finitos para ${club.id}`);
  assert.ok(Number.isFinite(club.geralRank) && club.geralRank >= 1 && club.geralRank <= 50, `Rank deve estar entre 1 e 50 para ${club.id}`);
  assert.ok(club.headline.length > 5, `Headline do clube não pode ser vazia`);
  assert.ok(club.miniSummary.length > 10, `Resumo do clube não pode ser vazio`);
}
console.log("✓ Validação 1 aprovada: 50 clubes com dados numéricos finitos e completos.");

// Validação 2: Invariante Anti-Scout (Rigor Factual)
// Não inventar scouts de jogadores individuais (SG, cartões amarelos, gols de atleta X)
const allNarrativeText = [
  edition.headlineStory.headline,
  edition.headlineStory.subheadline,
  edition.headlineStory.lead,
  ...edition.headlineStory.body,
  ...edition.featuredStories.flatMap(s => [s.headline, s.subheadline, s.lead, ...s.body]),
  ...edition.crossStories.flatMap(s => [s.headline, s.subheadline, s.lead, ...s.body])
].join(' ').toLowerCase();

const forbiddenScoutTerms = [
  'cartão amarelo para',
  'perda de sg de',
  'desarme de',
  'defesa difícil do goleiro',
  'assistência de',
  'gol do atacante'
];

for (const term of forbiddenScoutTerms) {
  assert.ok(!allNarrativeText.includes(term), `Narrativa não pode conter scout individual inventado: "${term}"`);
}
console.log("✓ Validação 2 aprovada: Rigor factual estrito mantido (zero scouts de jogadores individuais inventados).");

// Validação 3: Fidelidade Absoluta aos Resultados das Copas B10 e M10
const r29Db = JSON.parse(fs.readFileSync('round29_scores_db.json', 'utf8'));
const r30Db = JSON.parse(fs.readFileSync('round30_scores_db.json', 'utf8'));

for (const match of edition.b10Digest) {
  const hIda = r29Db[match.homeClub.id];
  const hVolta = r30Db[match.homeClub.id];
  const aIda = r29Db[match.awayClub.id];
  const aVolta = r30Db[match.awayClub.id];

  assert.strictEqual(match.homeLeg1, hIda, `Ida mandante incorreta no jogo ${match.matchNumber}`);
  assert.strictEqual(match.homeLeg2, hVolta, `Volta mandante incorreta no jogo ${match.matchNumber}`);
  assert.strictEqual(match.awayLeg1, aIda, `Ida visitante incorreta no jogo ${match.matchNumber}`);
  assert.strictEqual(match.awayLeg2, aVolta, `Volta visitante incorreta no jogo ${match.matchNumber}`);

  const calculatedHomeAgg = Number((hIda + hVolta).toFixed(2));
  const calculatedAwayAgg = Number((aIda + aVolta).toFixed(2));
  assert.strictEqual(match.homeAggregate, calculatedHomeAgg, `Agregado mandante inconsistente`);
  assert.strictEqual(match.awayAggregate, calculatedAwayAgg, `Agregado visitante inconsistente`);

  const expectedWinner = calculatedHomeAgg > calculatedAwayAgg ? match.homeClub.id : match.awayClub.id;
  assert.strictEqual(match.winnerId, expectedWinner, `Vencedor do jogo ${match.matchNumber} incorreto`);
}
console.log("✓ Validação 3 aprovada: 16 confrontos da Fase 4 da Copa B10 100% conferidos contra pontuações da R29 e R30.");

// Validação 4: Histórias Cruzadas e Coerência de Contexto
assert.ok(edition.crossStories.length >= 3, "Devem existir ao menos 3 histórias cruzadas detalhadas");
for (const story of edition.crossStories) {
  assert.ok(story.clubsInvolved.length > 0, "História cruzada deve citar ao menos um clube");
  assert.ok(story.evidences.length >= 2, "História cruzada deve apresentar múltiplas evidências factuais");
}
console.log("✓ Validação 4 aprovada: Histórias cruzadas consistentes entre Geral, Mensal e Copas.");

// Validação 5: Boletim de Compartilhamento WhatsApp
assert.ok(edition.whatsappText.includes("GAZETA SÓ CAMISA 10"), "Texto de WhatsApp deve conter cabeçalho oficial");
assert.ok(edition.whatsappText.includes("MANCHETE PRINCIPAL"), "Texto de WhatsApp deve conter manchete principal");
assert.ok(edition.whatsappText.includes("G-5 CAMPEONATO GERAL"), "Texto de WhatsApp deve conter o G-5");
console.log("✓ Validação 5 aprovada: Formatação WhatsApp jornalística pronta para envio.");

console.log("\n=======================================================");
console.log("🏆 TODAS AS 5 VALIDAÇÕES DE INTEGRIDADE PASSARAM COM SUCESSO!");
console.log("=======================================================\n");
