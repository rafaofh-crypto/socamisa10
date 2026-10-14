import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import GazetaEditionView from '../../components/GazetaEditionView';
import ErrorBoundary from '../../components/ErrorBoundary';
import { getPublishedGazetaEdition, getAvailableGazetaEditions, getLatestGazetaEditionRound } from './publishedGazetaArchive';
import { buildGazetaEdition } from './gazetaEngine';
import { getEditionStories } from './gazetaArchive';
import { CONFIRMED_ROUND_SCORES, validateRoundScoreCandidate, isRecordedScore, getGazetaSourceWarning } from './editorialVerification';
import { UNVERIFIED_GAZETA_DRAFTS } from './publishedGazetaEditions';

const fact = CONFIRMED_ROUND_SCORES[0];
assert.equal(fact.score, 80.58, 'Referência independente: confirmação expressa do diretor');
assert.ok(validateRoundScoreCandidate(fact));
for (const changed of [
  {score:117.13, verified:true}, {round:29}, {round:31}, {season:2025},
  {clubId:'crf-galo'}, {clubName:'Outro clube'}, {sourceId:'fonte-nao-aprovada'},
  {sourceId:'__proto__'}, {score:NaN}, {score:Infinity}, {score:undefined},
  {score:'80.58'}, {score:0},
]) assert.equal(validateRoundScoreCandidate({...fact,...changed} as any),false, JSON.stringify(changed));
assert.ok(isRecordedScore(0), 'Zero real é numérico, não ausência');
assert.ok(isRecordedScore(-1));
for (const value of [undefined,null,'0',NaN,Infinity]) assert.ok(!isRecordedScore(value));

// Reproduce the real reported defect, rather than checking against the same bad source.
const rejected = UNVERIFIED_GAZETA_DRAFTS[30].radarClubs.find(c => c.id === fact.clubId)!;
assert.equal(rejected.roundScore,117.13);
assert.ok(!validateRoundScoreCandidate({...fact,score:rejected.roundScore}));
const r30 = getPublishedGazetaEdition(30)!;
assert.ok(r30);
const narrative = JSON.stringify(r30);
assert.ok(narrative.includes('80,58'));
for (const unsupported of ['117,13','117.13','2ª maior','2º Lugar','cala críticos',
  'sobe na tabela','capitães e desarmes','escalação perfeita','2656.29','122.33']) {
  assert.ok(!narrative.includes(unsupported),unsupported);
}
assert.equal(r30.stats.highestScore,null);
assert.equal(r30.stats.averageRoundScore,null);
for (const section of [r30.geralTop5,r30.monthlyTop5,r30.radarClubs,r30.b10Digest,r30.crossStories]) assert.equal(section.length,0);
assert.ok(r30.whatsappText.includes('80,58'));
assert.ok(r30.verificationNotice?.includes('em conferência'));
assert.ok(Object.isFrozen(r30.headlineStory));
assert.throws(() => {r30.headlineStory.headline='alteração';},TypeError);
assert.equal(JSON.stringify(getPublishedGazetaEdition(30)),narrative);
assert.deepEqual(getAvailableGazetaEditions(31).map(e=>e.round),[30]);
assert.equal(getLatestGazetaEditionRound(31),30);
for (const round of [28,29,31,NaN,0,39,30.5]) {
  assert.equal(getPublishedGazetaEdition(round),null);
  assert.throws(()=>buildGazetaEdition([],round),/conferência/);
  assert.throws(()=>getEditionStories(round,[],[]),/conferência/);
}

const makeTeam = (score: unknown) => ({id:fact.clubId,name:fact.clubName,owner:'',shieldUrl:'',scores:{30:score}} as any);
const good = [makeTeam(80.58)];
const wrong = [makeTeam(117.13)];
const before = JSON.stringify(wrong);
assert.equal(getGazetaSourceWarning(good,30),null);
assert.ok(getGazetaSourceWarning(wrong,30));
assert.ok(getGazetaSourceWarning([makeTeam(undefined)],30));
assert.ok(getGazetaSourceWarning([makeTeam(0)],30));
assert.ok(getGazetaSourceWarning([...good,...good],30),'Duplicidade de identidade não é ignorada');
assert.equal(getGazetaSourceWarning([],30),null,'A confirmação do diretor independe de cache esportivo');
assert.equal(getGazetaSourceWarning([{...makeTeam(117.13),id:'outro',name:'Capitã Buske Junior'}],30),null,'Sem aproximações de identidade');
assert.equal(buildGazetaEdition(wrong,30),r30);
const html = renderToStaticMarkup(React.createElement(GazetaEditionView,{teams:wrong,currentRound:31}));
assert.ok(html.includes('80,58'));
assert.ok(html.includes('Há divergência'));
assert.ok(html.includes('A edição da R31 está em preparação'));
for (const unwanted of ['117,13','117.13','2656.29','257.24','100% HOMOLOGADOS',
  '16 VAGAS HOMOLOGADAS','Geral: #','Edição #29','Edição #28','Boletim Clássico']) assert.ok(!html.includes(unwanted),unwanted);
assert.equal(JSON.stringify(wrong),before,'Entrada esportiva intocada');
assert.equal(JSON.stringify(getPublishedGazetaEdition(30)),narrative);
const boundary = renderToStaticMarkup(React.createElement(ErrorBoundary,null,React.createElement('span',null,'conteúdo')));
assert.ok(boundary.includes('conteúdo'));
console.log('✓ Buske 80,58, rejeição de 117,13/verified:true, fonte e identidade exatas, pendência/zero, quarentena, WhatsApp, SSR e não mutação aprovados.');
