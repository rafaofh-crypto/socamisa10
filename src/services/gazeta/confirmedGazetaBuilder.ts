import { getRestoredR30Stories } from './r30RestoredStories';
import type { CartolaTeam } from '../cartolaService';
import { MONTH_TO_ROUNDS } from '../cartollaApi';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';
import { CONFIRMED_SEASON_TEAMS } from './confirmedSeason2026';
import type { GazetaEdition, GazetaStory, RadarClubDigest } from './types';

const pts = (score: number) => score.toLocaleString('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:2});
const sum = (team: CartolaTeam, rounds: number[]) => rounds.reduce((n,r)=>n+Math.round(team.scores[r]*100),0)/100;
const club = (id: string) => {
  const found=CONFIRMED_SEASON_TEAMS.find(t=>t.id===id);
  if(!found)throw new Error(`Clube sem evidência: ${id}`);
  return {id:found.id,name:found.name,owner:found.owner,shieldUrl:found.shieldUrl};
};
function story(id:string,category:GazetaStory['category'],headline:string,lead:string,ids:string[],facts:[string,string][],body:string[]=[]):GazetaStory {
  return {id,category,badge:category==='manchete'?'JORNAL DA TEMPORADA':'HISTÓRIA DA TEMPORADA',badgeColor:category==='cruzada'?'amber':'gold',headline,subheadline:lead,lead,body,clubsInvolved:ids.map(club),evidences:facts.map(([label,value])=>({label,value,verified:true})),priority:100};
}
export function buildConfirmedEdition(round:number):GazetaEdition|null {
  if(![28,29,30].includes(round))return null;
  if(CONFIRMED_SEASON_TEAMS.length!==50||new Set(CONFIRMED_SEASON_TEAMS.map(t=>t.id)).size!==50)throw new Error('Fonte incompleta');
  for(const t of CONFIRMED_SEASON_TEAMS)for(let r=1;r<=round;r++)if(typeof t.scores[r]!=='number'||!Number.isFinite(t.scores[r]))throw new Error('Pontuação pendente não é zero');
  const rounds=Array.from({length:round},(_,i)=>i+1);
  const previous=rounds.slice(0,-1);
  const monthEntry=Object.entries(MONTH_TO_ROUNDS).find(([,rs])=>rs.includes(round));
  if(!monthEntry)throw new Error('Mês não registrado');
  const [monthName,monthRounds]=monthEntry;
  const profiles=CONFIRMED_SEASON_TEAMS.map(t=>({...t,roundScore:t.scores[round],total:sum(t,rounds),prev:sum(t,previous),month:sum(t,monthRounds.filter(r=>r<=round))}));
  const general=[...profiles].sort((a,b)=>b.total-a.total);
  const previousGeneral=[...profiles].sort((a,b)=>b.prev-a.prev);
  const monthly=[...profiles].sort((a,b)=>b.month-a.month);
  const scoreOrder=[...profiles].sort((a,b)=>b.roundScore-a.roundScore);
  const b10Digest=round===30?OFFICIAL_CUP_REGISTRY.b10.confirmedMatchesR29R30:[];
  for(const match of b10Digest){
    const h=profiles.find(t=>t.id===match.homeClub.id),a=profiles.find(t=>t.id===match.awayClub.id);
    if(!h||!a||h.scores[29]!==match.homeLeg1||h.scores[30]!==match.homeLeg2||a.scores[29]!==match.awayLeg1||a.scores[30]!==match.awayLeg2||
      Math.round((match.homeLeg1+match.homeLeg2)*100)!==Math.round(match.homeAggregate*100)||Math.round((match.awayLeg1+match.awayLeg2)*100)!==Math.round(match.awayAggregate*100))throw new Error('Registro editorial diverge da fonte confirmada');
    if(match.homeAggregate===match.awayAggregate)throw new Error('Empate requer registro homologado específico');
    if(match.winnerId!==(match.homeAggregate>match.awayAggregate?match.homeClub.id:match.awayClub.id))throw new Error('Classificado editorial inconsistente');
  }
  const galo=OFFICIAL_CUP_REGISTRY.b10.playoffHighlights.capitaBuskeMatch;
  const casquinha=OFFICIAL_CUP_REGISTRY.b10.playoffHighlights.casquinhaMatch;
  const best=scoreOrder[0];
  const featuredStories:GazetaStory[]=[];
  const crossStories:GazetaStory[]=[];
  let headlineStory:GazetaStory;
  if(round===30){
    const restored = getRestoredR30Stories({profiles,general,monthly,b10Digest});
    headlineStory = restored.headlineStory;
    featuredStories.push(...restored.featuredStories);
    crossStories.push(...restored.crossStories);
  }else if(round===29){
    const final=OFFICIAL_CUP_REGISTRY.m10.finalMatch;
    headlineStory=story('manchete-r29','manchete','Tainha levanta a taça da M10; Carlao07 lidera o show da R29!',
      `Tainha Ovada venceu Dois Vizinhos por ${pts(final.score1)} a ${pts(final.score2)} na decisão da M10. Na pontuação da rodada, ${best.name} liderou com ${pts(best.roundScore)}.`,['tainha-ovada-fc','dois-vizinhos-sa',best.id],[['Final M10',`${pts(final.score1)} x ${pts(final.score2)}`],['Maior pontuação R29',`${best.name}: ${pts(best.roundScore)}`]]);
  }else{
    headlineStory=story('manchete-r28','manchete','Playoffs de sangue e areia: Galo e Futcafa conquistam acesso à Fase 4!',
      `CRF Galo superou Capitã Buske por ${pts(galo.scoreWinner)} a ${pts(galo.scoreLoser)}. Futcafa venceu Casquinha por ${pts(casquinha.scoreWinner)} a ${pts(casquinha.scoreLoser)}.`,['crf-galo','capita-buske','futcafa','casquinha-ec'],[['Galo x Buske',`${pts(galo.scoreWinner)} x ${pts(galo.scoreLoser)}`],['Futcafa x Casquinha',`${pts(casquinha.scoreWinner)} x ${pts(casquinha.scoreLoser)}`]]);
  }
  const radarClubs:RadarClubDigest[]=profiles.map(t=>{
    const match=b10Digest.find(m=>m.homeClub.id===t.id||m.awayClub.id===t.id);
    const isWinner=match?.winnerId===t.id;
    let b10StatusLabel=match?(isWinner?'Oitavas B10':'Eliminado na Fase 4'):'Sem status confirmado nesta edição';
    if(['capita-buske','casquinha-ec'].includes(t.id))b10StatusLabel='Eliminado nos Playoffs';
    const geralRank=general.findIndex(x=>x.id===t.id)+1;
    const m10StatusLabel=round>=29&&t.id===OFFICIAL_CUP_REGISTRY.m10.championId?'Campeão M10':'';
    return {id:t.id,name:t.name,owner:t.owner,shieldUrl:t.shieldUrl,roundScore:t.roundScore,geralPoints:t.total,geralRank,geralRankDelta:previousGeneral.findIndex(x=>x.id===t.id)+1-geralRank,monthPoints:t.month,monthRank:monthly.findIndex(x=>x.id===t.id)+1,b10StatusLabel,m10StatusLabel,
      headline:`${t.name}: ${pts(t.roundScore)} pontos na R${round}`,miniSummary:match?`${b10StatusLabel}. Confronto com ${match.homeClub.id===t.id?match.awayClub.name:match.homeClub.name}: ${pts(match.homeAggregate)} x ${pts(match.awayAggregate)} (${match.homeClub.name} x ${match.awayClub.name}).`:`Soma ${pts(t.total)} pontos na Geral e ${pts(t.month)} em ${monthName}. ${m10StatusLabel}`,highlightTag:m10StatusLabel|| (match?b10StatusLabel:'TEMPORADA')};
  });
  const edition:GazetaEdition={editionNumber:round,round,title:`Gazeta C10 · R${round}`,subtitle:'O jornal da temporada · Liberdade narrativa, rigor factual.',dateStr:round===30?'14 de Outubro de 2026':round===29?'07 de Outubro de 2026':'30 de Setembro de 2026',
    verificationNotice:round===30?'Retificação autorizada: a planilha da R30 foi corrigida pelo responsável da liga. C.R.Pirika venceu CRF Galo por 229,49 a 200,39 e enfrentará Tainha nas oitavas. Capitã Buske marcou 80,58. Esta edição substitui a cobertura feita com os valores anteriores.':undefined,
    stats:{totalClubs:50,averageRoundScore:Math.round(profiles.reduce((n,t)=>n+Math.round(t.roundScore*100),0)/50)/100,highestScore:{clubName:best.name,score:best.roundScore},lowestScore:{clubName:scoreOrder[49].name,score:scoreOrder[49].roundScore},totalMatchesB10Concluded:b10Digest.length,m10Champion:round>=29?OFFICIAL_CUP_REGISTRY.m10.championName:''},
    headlineStory,featuredStories,crossStories,b10Digest,
    geralTop5:general.slice(0,5).map((t,i)=>({rank:i+1,name:t.name,owner:t.owner,points:t.total,delta:previousGeneral.findIndex(x=>x.id===t.id)-i})),monthlyTop5:monthly.slice(0,5).map((t,i)=>({rank:i+1,name:t.name,owner:t.owner,points:t.month})),radarClubs,whatsappText:''};
  edition.whatsappText=`⚽📰 *GAZETA SÓ CAMISA 10 — R${round}*\n\n*${headlineStory.headline}*\n${headlineStory.lead}\n\n${[...featuredStories,...crossStories].map(s=>`• *${s.headline}*\n${s.lead}`).join('\n\n')}\n\n🏆 *GERAL APÓS R${round}:*\n${edition.geralTop5.map(t=>`${t.rank}º ${t.name} — ${pts(t.points)} pts`).join('\n')}\n\n📅 *${monthName}:*\n${edition.monthlyTop5.slice(0,3).map(t=>`${t.rank}º ${t.name} — ${pts(t.points)} pts`).join('\n')}${round===30?'\n\nRetificação autorizada: Pirika classificado, Buske 80,58.':''}`;
  return edition;
}
