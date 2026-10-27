import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getPublishedGazetaEdition, getAvailableGazetaEditions } from './publishedGazetaArchive';
import { CONFIRMED_SEASON_TEAMS } from './confirmedSeason2026';
import { R31_CURATED_EDITION, R31_EDITORIAL_SOURCE } from './r31CuratedEdition';
import { validateRoundScoreCandidate, isRecordedScore, getGazetaSourceWarning } from './editorialVerification';

const e=getPublishedGazetaEdition(31)!;
assert.ok(e); assert.equal(e,R31_CURATED_EDITION); assert.ok(Object.isFrozen(e));
assert.deepEqual(getAvailableGazetaEditions().map(x=>x.round),[32,31,30,29,28]);
assert.equal(getPublishedGazetaEdition(33),null);
const stories=[e.headlineStory,...e.featuredStories,...e.crossStories];
assert.equal(stories.length,7);assert.equal(e.featuredStories.length,6);
assert.equal(new Set(stories.map(s=>s.id)).size,7);
assert.equal(e.editorialNotes?.length,4);assert.ok(e.closingParagraphs?.length);
const norm=(s:string)=>s.replaceAll('*','').replace(/\s+/g,' ').trim();
const original=readFileSync('docs/gazeta/EDICAO_R31_TEXTO_RECEBIDO.md','utf8');
const approved=original.replace('voltaram a se encontrar numa batalha de nervos','agora se encontram numa batalha de nervos')
 .replace('não estava entre os favoritos da classificação geral','não estava entre os primeiros da classificação geral')
 .replace('clube que sobreviveu por quase nada','clube que largou à frente por quase nada');
assert.equal(readFileSync('docs/gazeta/EDICAO_R31_PREVIA.md','utf8').trim(),approved.trim());
const renderedText=norm(JSON.stringify(e));
for(const section of approved.split(/\n## /).slice(1)){
 const paragraphs=section.slice(section.indexOf('\n')+1).split(/\n\s*\n/).map(norm).filter(p=>p&&p!=='---');
 for(const p of paragraphs) assert.ok(renderedText.includes(p),'Parágrafo fornecido ausente: '+p);
}
assert.ok(e.whatsappText.includes('113,61'));assert.ok(e.whatsappText.includes('A guerra pela vaga, não.'));
for(const r of e.radarClubs){
 const t=CONFIRMED_SEASON_TEAMS.find(t=>t.id===r.id)!;
 const source=R31_EDITORIAL_SOURCE.records.find(t=>t.id===r.id)!;
 assert.ok(t&&source);assert.equal(r.roundScore,source.score);
 const total=Object.values(t.scores).reduce((n,v)=>n+Math.round(v*100),0)+Math.round(source.score*100);
 assert.equal(Math.round(r.geralPoints*100),total);
 assert.equal(Math.round(r.monthPoints*100),Math.round(t.scores[29]*100)+Math.round(t.scores[30]*100)+Math.round(source.score*100));
 const candidate={season:2026,round:31,clubId:source.id,clubName:source.name,score:source.score,sourceId:R31_EDITORIAL_SOURCE.id};
 assert.ok(validateRoundScoreCandidate(candidate));
 for(const invalid of [{score:source.score+1},{season:2027},{round:32},{clubId:'desconhecido'},{sourceId:'não-aprovada'}]) assert.equal(validateRoundScoreCandidate({...candidate,...invalid}),false);
}
assert.equal(new Set(e.radarClubs.map(t=>t.id)).size,50);
const ordered=[...e.radarClubs].sort((a,b)=>b.geralPoints-a.geralPoints);
assert.deepEqual(e.geralTop5.map(t=>[t.name,t.points]),ordered.slice(0,5).map(t=>[t.name,t.geralPoints]));
for(let i=0;i<50;i++)assert.equal(ordered[i].geralRank,i+1);
assert.equal(e.b10Digest.length,0);assert.equal(e.b10FirstLegDigest?.length,8);
assert.equal(e.stats.totalMatchesB10Concluded,0);
for(const m of e.b10FirstLegDigest!){
 assert.equal(m.round,31);assert.equal(m.returnRound,32);
 assert.equal(m.homeScore,e.radarClubs.find(t=>t.id===m.homeClub.id)!.roundScore);
 assert.equal(m.awayScore,e.radarClubs.find(t=>t.id===m.awayClub.id)!.roundScore);
 assert.ok(!('winnerId' in m));assert.ok(!('homeLeg2' in m));
}
assert.equal(e.radarClubs.find(t=>t.id==='capita-buske')!.roundScore,64.64);
assert.equal(e.radarClubs.find(t=>t.id==='dedeyy-fc')!.geralRankDelta,5);
assert.equal(isRecordedScore(0),true);assert.equal(isRecordedScore(undefined),false);
const bad=CONFIRMED_SEASON_TEAMS.map(t=>({...t,scores:{...t.scores,31:999}}));
assert.ok(getGazetaSourceWarning(bad,31));assert.ok(getGazetaSourceWarning(bad,30)===null);
const historicHashes=["6340d3f1ae55442174908457a64dbdc4e709456e41ee7f122080b6407b218eaa","d28a6ab9db5c28668c927a47a35d2b82f9ba60095048584084bba7515703b4f7","b5a027db4e744ec8d4459c59ee0afc1205f2461b5aa3fb00c20b0a70ad947436"];
for(const [i,round] of [28,29,30].entries())assert.equal(createHash('sha256').update(JSON.stringify(getPublishedGazetaEdition(round))).digest('hex'),historicHashes[i],'Histórico alterado R'+round);
console.log('✓ R31: sete matérias completas, quatro notas, encerramento, 50 clubes conferidos, oito idas sem classificados, rejeição de dados incorretos, zero/ausência e R28–R30 idênticas.');
