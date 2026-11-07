import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getPublishedGazetaEdition,getAvailableGazetaEditions} from './publishedGazetaArchive';
import {R33_EDITORIAL_SOURCE,R33_CURATED_EDITION} from './r33CuratedEdition';
import {R32_CURATED_EDITION} from './r32CuratedEdition';
import {validateRoundScoreCandidate,getGazetaSourceWarning,isRecordedScore} from './editorialVerification';
const e=getPublishedGazetaEdition(33)!;assert.ok(e);assert.equal(e,R33_CURATED_EDITION);assert.ok(Object.isFrozen(e));
assert.deepEqual(getAvailableGazetaEditions().map(t=>t.round),[34,33,32,31,30,29,28]);assert.equal(getPublishedGazetaEdition(35),null);
const stories=[e.headlineStory,...e.featuredStories,...e.crossStories];assert.equal(stories.length,7);assert.equal(e.featuredStories.length,6);assert.equal(new Set(stories.map(t=>t.id)).size,7);assert.equal(e.editorialNotes?.length,6);
const original=readFileSync('docs/gazeta/EDICAO_R33_TEXTO_RECEBIDO.md','utf8');const expected=original.replace('Depois de escapar por margens apertadas nas fases anteriores, clube abre','Depois de escapar por margem apertada na Fase 4, clube abre').replace('Apenas 1,30 ponto separa líder e vice da Geral.','Na ida da B10, apenas 1,30 ponto separa líder e vice da Geral.');
assert.equal(readFileSync('docs/gazeta/EDICAO_R33_PREVIA.md','utf8').trim(),expected.trim());
const norm=(s:string)=>s.replaceAll('*','').replace(/\s+/g,' ').trim();const text=norm(JSON.stringify(e));
for(const section of expected.split(/\n## /).slice(1))for(const p of section.slice(section.indexOf('\n')+1).split(/\n\s*\n/).map(norm).filter(p=>p&&p!=='---'))for(const part of p.split(' - '))assert.ok(text.includes(part),'Parágrafo recebido ausente: '+part);
assert.equal(e.radarClubs.length,50);assert.equal(new Set(e.radarClubs.map(t=>t.id)).size,50);
for(const r of e.radarClubs){const s=R33_EDITORIAL_SOURCE.records.find(t=>t.id===r.id)!;const prev=R32_CURATED_EDITION.radarClubs.find(t=>t.id===r.id)!;assert.ok(s&&prev);assert.equal(r.roundScore,s.score);assert.equal(Math.round(r.geralPoints*100),Math.round(prev.geralPoints*100)+Math.round(s.score*100));assert.equal(Math.round(r.monthPoints*100),Math.round(prev.monthPoints*100)+Math.round(s.score*100));assert.equal(r.geralRankDelta,prev.geralRank-r.geralRank);
 const fact={season:2026,round:33,clubId:s.id,clubName:s.name,score:s.score,sourceId:R33_EDITORIAL_SOURCE.id};assert.ok(validateRoundScoreCandidate(fact));for(const bad of[{score:s.score+1},{round:34},{season:2027},{sourceId:'não-conferida'},{clubId:'outro'}])assert.equal(validateRoundScoreCandidate({...fact,...bad}),false);
}
for(const field of ['geralPoints','monthPoints'] as const){const order=[...e.radarClubs].sort((a,b)=>b[field]-a[field]);for(const[i,t]of order.entries())assert.equal(field==='geralPoints'?t.geralRank:t.monthRank,i+1);}
assert.equal(e.monthlyTop5[0].name,'Everton UltraMaratonista F.C');assert.equal(e.monthlyTop5[0].points,527.45);assert.equal(e.monthlyTop5[1].points,522.23);assert.equal(e.stats.highestScore?.score,129.62);
assert.equal(e.b10Digest.length,0);assert.equal(e.stats.totalMatchesB10Concluded,0);assert.equal(e.b10FirstLegDigest?.length,4);
const pairs=[['carlao07','pretinho99-f-c'],['everton-ultramaratonista-f-c','dida82-fc'],['camisa-pesada-sa','ninja-do-ocidente'],['furacao-k7-fc','tainha-ovada-fc']];assert.deepEqual(e.b10FirstLegDigest!.map(m=>[m.homeClub.id,m.awayClub.id]),pairs);
const winners=new Set(R32_CURATED_EDITION.b10Digest.map(m=>m.winnerId));const active=new Set<string>();for(const m of e.b10FirstLegDigest!){assert.equal(m.round,33);assert.equal(m.returnRound,34);assert.ok(!('winnerId'in m)&&!('homeLeg2'in m));for(const id of[m.homeClub.id,m.awayClub.id]){assert.ok(winners.has(id));active.add(id);}assert.equal(m.homeScore,e.radarClubs.find(t=>t.id===m.homeClub.id)!.roundScore);assert.equal(m.awayScore,e.radarClubs.find(t=>t.id===m.awayClub.id)!.roundScore);}
assert.equal(active.size,8);assert.equal(e.radarClubs.filter(t=>t.b10StatusLabel==='Quartas · volta pendente').length,8);assert.equal(e.radarClubs.filter(t=>t.roundScore>=100).length,11);assert.ok(e.radarClubs.filter(t=>t.roundScore>=100).every(t=>!active.has(t.id)));
assert.equal(e.radarClubs.find(t=>t.id==='capita-buske')!.roundScore,117.15);assert.ok(e.whatsappText.includes('117,15'));assert.ok(e.whatsappText.includes('Nenhuma classificação está definida.'));assert.equal(isRecordedScore(undefined),false);assert.equal(isRecordedScore(0),true);
assert.ok(getGazetaSourceWarning(e.radarClubs.map(t=>({...t,scores:{33:999}}))as any,33));
const hashes=["6340d3f1ae55442174908457a64dbdc4e709456e41ee7f122080b6407b218eaa","d28a6ab9db5c28668c927a47a35d2b82f9ba60095048584084bba7515703b4f7","b5a027db4e744ec8d4459c59ee0afc1205f2461b5aa3fb00c20b0a70ad947436","3a1a453505a382a5c2f69648516110887b631877e888702d48e04e3c2d57cf04","f268b162c3452176b34f3e4fec0fbf24689811d2353a3174a4025e444a9fc8a1"];for(const[i,round]of[28,29,30,31,32].entries())assert.equal(createHash('sha256').update(JSON.stringify(getPublishedGazetaEdition(round))).digest('hex'),hashes[i],'Edição histórica alterada R'+round);
console.log('✓ R33: texto completo com dois ajustes, 50 clubes/somas/posições, outubro apurado, quatro idas sem classificados, 11 centenários fora das quartas, rejeição factual e R28–R32 idênticas.');
