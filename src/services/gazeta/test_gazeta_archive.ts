import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import GazetaEditionView from '../../components/GazetaEditionView';
import ErrorBoundary from '../../components/ErrorBoundary';
import { getPublishedGazetaEdition, getAvailableGazetaEditions, getLatestGazetaEditionRound } from './publishedGazetaArchive';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';

const r30 = getPublishedGazetaEdition(30)!;
assert.equal(r30.radarClubs.length, 50);
assert.equal(new Set(r30.radarClubs.map(c => c.id)).size, 50);
assert.equal(r30.b10Digest.length, 16);
assert.deepEqual(r30.b10Digest, OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30);
assert.equal(r30.stats.highestScore.score, 122.33);
assert.equal(r30.monthlyTop5[0].points, 257.24);
assert.equal(r30.geralTop5[0].points, 2656.29);
assert.equal(r30.radarClubs.find(c => c.id === 'capita-buske')!.roundScore, 117.13);
assert.equal(r30.radarClubs.find(c => c.id === 'casquinha-ec')!.geralPoints, 2587.41);

const previousText = JSON.stringify(r30);
assert.ok(Object.isFrozen(r30));
assert.ok(Object.isFrozen(r30.radarClubs[0]));
assert.throws(() => { r30.headlineStory.headline = 'alteração indevida'; }, TypeError);
assert.equal(JSON.stringify(getPublishedGazetaEdition(30)), previousText);
assert.equal(getPublishedGazetaEdition(31), null);
assert.deepEqual(getAvailableGazetaEditions(31).map(e => e.round), [30, 29, 28]);
assert.equal(getLatestGazetaEditionRound(31), 30);
assert.equal(getLatestGazetaEditionRound(29), 30, 'Cache anterior não esconde edição preparada');
assert.equal(getLatestGazetaEditionRound(27), 30);
assert.equal(getLatestGazetaEditionRound(Number.NaN), 30);

const r28 = getPublishedGazetaEdition(28)!;
const r29 = getPublishedGazetaEdition(29)!;
assert.equal(r28.b10Digest.length, 0, 'R28 não pode anunciar a conclusão da R30');
assert.equal(r29.b10Digest.length, 0, 'R29 ainda é a ida');
assert.equal(r28.stats.m10Champion, '', 'Não anunciar campeão da R29 na R28');
assert.ok(r29.stats.m10Champion);
assert.ok(r28.whatsappText.includes('Setembro'));
assert.ok(!r28.whatsappText.includes('CLASSIFICADOS ÀS OITAVAS'));
assert.ok(r30.whatsappText.includes('Outubro'));
assert.ok(r30.featuredStories.find(s => s.id === 'destaque-carlao')!.body.join(' ').includes('segunda maior'));
const narrative = [r28, r29, r30].flatMap(e => [e.headlineStory, ...e.featuredStories, ...e.crossStories])
  .flatMap(s => [s.headline, s.subheadline, s.lead, ...s.body]).join(' ').toLowerCase();
for (const unsupported of ['capitão dobrando', 'estratégia agressiva de capitães e desarmes',
  'cada jogador escalado performou', 'garantiu 99%', '148,81 pontos no jogo de ida dos 16 avos da copa b10 diante da chinchila cabeçuda — disparada a maior pontuação']) {
  assert.ok(!narrative.includes(unsupported), unsupported);
}

// Future or missing live data cannot change an archived edition's screen.
const futureTeams = [{ id: 'ficticio', name: 'CLUBE NÃO PUBLICADO', owner: '', shieldUrl: '', scores: { 30: 9999, 31: 9999 } }];
const before = JSON.stringify(futureTeams);
const initial = renderToStaticMarkup(React.createElement(GazetaEditionView, { teams: [], currentRound: 30 }));
const after = renderToStaticMarkup(React.createElement(GazetaEditionView, { teams: futureTeams, currentRound: 31 }));
assert.ok(initial.includes(r30.headlineStory.headline));
assert.ok(after.includes(r30.headlineStory.headline));
assert.ok(after.includes('A edição da R31 está em preparação'));
assert.ok(!after.includes('CLUBE NÃO PUBLICADO'));
assert.ok(!after.includes('Boletim Clássico'));
assert.ok(!after.includes('Gazeta 2.0'));
assert.equal(JSON.stringify(futureTeams), before);
assert.equal(JSON.stringify(getPublishedGazetaEdition(30)), previousText);
const boundary = renderToStaticMarkup(React.createElement(ErrorBoundary, null, React.createElement('span', null, 'conteúdo preservado')));
assert.ok(boundary.includes('conteúdo preservado'));
console.log('Histórico R28–R30, imutabilidade, transição R31, conteúdo e renderização verificados.');
