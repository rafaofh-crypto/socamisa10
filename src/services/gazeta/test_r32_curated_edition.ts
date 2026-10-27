import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getPublishedGazetaEdition, getAvailableGazetaEditions } from './publishedGazetaArchive';
import { R32_CURATED_EDITION, R32_EDITORIAL_SOURCE } from './r32CuratedEdition';
import { R31_CURATED_EDITION, R31_EDITORIAL_SOURCE } from './r31CuratedEdition';
import { validateRoundScoreCandidate, getGazetaSourceWarning } from './editorialVerification';
const e=getPublishedGazetaEdition(32)!;
assert.ok(e);assert.equal(e,R32_CURATED_EDITION);assert.ok(Object.isFrozen(e));
assert.deepEqual(getAvailableGazetaEditions().map(t=>t.round),[32,31,30,29,28]);assert.equal(getPublishedGazetaEdition(33),null);
const stories=[e.headlineStory,...e.featuredStories,...e.crossStories];assert.equal(stories.length,7);assert.equal(e.featuredStories.length,6);assert.equal(new Set(stories.map(s=>s.id)).size,7);
assert.equal(e.editorialNotes?.length,5);
const norm=(s:string)=>s.replaceAll('*','').replace(/\s+/g,' ').trim();
const original=readFileSync('docs/gazeta/EDICAO_R32_TEXTO_RECEBIDO.md','utf8');
const expected=original.replace('Depois de duas classificações no limite, o clube impõe','Depois de sobreviver no limite na fase anterior, o clube impõe');
assert.equal(readFileSync('docs/gazeta/EDICAO_R32_PREVIA.md','utf8').trim(),expected.trim());
const text=norm(JSON.stringify(e));
for(const section of expected.split(/\n## /).slice(1))for(const paragraph of section.slice(section.indexOf('\n')+1).split(/\n\s*\n/).map(norm).filter(p=>p&&p!=='---')){
 // Newlines in the four-match list are JSON escapes; every bullet is checked individually.
 for(const part of paragraph.split(' - '))assert.ok(text.includes(part),'Texto fornecido ausente: '+part);
}
assert.equal(e.radarClubs.length,50);assert.equal(new Set(e.radarClubs.map(t=>t.id)).size,50);
for(const r of e.radarClubs){const source=R32_EDITORIAL_SOURCE.records.find(t=>t.id===r.id)!;const prev=R31_CURATED_EDITION.radarClubs.find(t=>t.id===r.id)!;assert.ok(source&&prev);assert.equal(source.name,r.name);assert.equal(source.score,r.roundScore);assert.equal(Math.round(r.geralPoints*100),Math.round(prev.geralPoints*100)+Math.round(source.score*100));assert.equal(Math.round(r.monthPoints*100),Math.round(prev.monthPoints*100)+Math.round(source.score*100));assert.equal(r.geralRankDelta,prev.geralRank-r.geralRank);
 const candidate={season:2026,round:32,clubId:source.id,clubName:source.name,score:source.score,sourceId:R32_EDITORIAL_SOURCE.id};assert.ok(validateRoundScoreCandidate(candidate));for(const invalid of[{score:source.score+1},{season:2027},{round:33},{clubId:'desconhecido'},{sourceId:'não-aprovada'}])assert.equal(validateRoundScoreCandidate({...candidate,...invalid}),false);}
const ranked=[...e.radarClubs].sort((a,b)=>b.geralPoints-a.geralPoints);for(let i=0;i<50;i++)assert.equal(ranked[i].geralRank,i+1);assert.deepEqual(e.geralTop5.map(t=>[t.name,t.points]),ranked.slice(0,5).map(t=>[t.name,t.geralPoints]));
assert.equal(e.stats.totalMatchesB10Concluded,8);assert.equal(e.b10Digest.length,8);const ids=new Set<string>();
for(const m of e.b10Digest){for(const id of[m.homeClub.id,m.awayClub.id]){assert.ok(!ids.has(id));ids.add(id);}assert.equal(m.status,'ENCERRADO');assert.equal(Math.round(m.homeAggregate*100),Math.round(m.homeLeg1*100)+Math.round(m.homeLeg2*100));assert.equal(Math.round(m.awayAggregate*100),Math.round(m.awayLeg1*100)+Math.round(m.awayLeg2*100));assert.equal(m.homeLeg1,R31_EDITORIAL_SOURCE.records.find(t=>t.id===m.homeClub.id)!.score);assert.equal(m.awayLeg1,R31_EDITORIAL_SOURCE.records.find(t=>t.id===m.awayClub.id)!.score);assert.equal(m.homeLeg2,R32_EDITORIAL_SOURCE.records.find(t=>t.id===m.homeClub.id)!.score);assert.equal(m.awayLeg2,R32_EDITORIAL_SOURCE.records.find(t=>t.id===m.awayClub.id)!.score);assert.equal(m.winnerId,m.homeAggregate>m.awayAggregate?m.homeClub.id:m.awayClub.id);assert.equal(e.radarClubs.find(t=>t.id===m.winnerId)!.b10StatusLabel,'Classificado às Quartas');}
assert.equal(e.radarClubs.filter(t=>t.b10StatusLabel==='Classificado às Quartas').length,8);assert.equal(e.radarClubs.filter(t=>t.b10StatusLabel==='Eliminado nas Oitavas').length,8);
assert.equal(e.b10Digest.find(m=>m.homeClub.id==='pretinho99-f-c')!.homeAggregate,197.25);
const pairs=['Carlao07 × Pretinho99','Everton × Dida82','Camisa Pesada × Ninja do Ocidente','Furacão K7 × Tainha Ovada'];for(const p of pairs){assert.ok(e.closingParagraphs!.some(t=>t.includes(p)));assert.ok(e.whatsappText.includes(p));}
const historicalHashes=["6340d3f1ae55442174908457a64dbdc4e709456e41ee7f122080b6407b218eaa","d28a6ab9db5c28668c927a47a35d2b82f9ba60095048584084bba7515703b4f7","b5a027db4e744ec8d4459c59ee0afc1205f2461b5aa3fb00c20b0a70ad947436","3a1a453505a382a5c2f69648516110887b631877e888702d48e04e3c2d57cf04"];for(const [i,round] of[28,29,30,31].entries())assert.equal(createHash('sha256').update(JSON.stringify(getPublishedGazetaEdition(round))).digest('hex'),historicalHashes[i],'Histórico alterado R'+round);
assert.ok(getGazetaSourceWarning(e.radarClubs.map(t=>({...t,scores:{32:999}})) as any,32));
console.log('✓ R32: texto completo preservado com um ajuste, 50 clubes/somas/posições, oito agregados e classificados, quartas, rejeição factual e R28–R31 idênticas.');
