import type { CartolaTeam } from '../cartolaService';
import type { CupMatchReport, GazetaStory } from './types';
import { OFFICIAL_CUP_REGISTRY } from './cupOfficialRegistry';
import { CONFIRMED_SEASON_TEAMS } from './confirmedSeason2026';
import { MONTH_TO_ROUNDS } from '../cartollaApi';

type Profile = CartolaTeam & { roundScore: number; total: number; prev: number; month: number };
interface Context { profiles: Profile[]; general: Profile[]; monthly: Profile[]; b10Digest: CupMatchReport[]; }
const pts = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const delta = (a: number,b: number) => (Math.round(a*100)-Math.round(b*100))/100;

/** Curadoria recuperada do commit 6214481. Somente textos; números vêm da fonte conferida. */
export function getRestoredR30Stories({ profiles, general, monthly, b10Digest }: Context) {
  const team = (id: string) => {
    const found = profiles.find(t => t.id === id);
    if (!found) throw new Error(`Pauta sem clube conferido: ${id}`);
    return found;
  };
  const match = (n: number) => {
    const found = b10Digest.find(m => m.matchNumber === n);
    if (!found) throw new Error(`Pauta sem confronto conferido: ${n}`);
    return found;
  };
  const protagonist = (id: string,role?: string) => {
    const t = team(id);
    return { id:t.id,name:t.name,owner:t.owner,shieldUrl:t.shieldUrl,role };
  };
  const make = (id: string,category: GazetaStory['category'],badge:string,badgeColor:GazetaStory['badgeColor'],headline:string,subheadline:string,lead:string,body:string[],ids:string[],facts:[string,string][]):GazetaStory => ({
    id,category,badge,badgeColor,headline,subheadline,lead,body,clubsInvolved:ids.map(id=>protagonist(id)),evidences:facts.map(([label,value])=>({label,value,verified:true})),priority:100,
  });
  const rivers = match(9), ninja = match(8), carlao = match(15), tainha = match(6), furacao = match(14), pirika = match(12), pretinho = match(7);
  const leader=team('tainha-ovada-fc'), hunter=team('furacao-k7-fc');
  const scores=[...profiles].sort((a,b)=>b.roundScore-a.roundScore);
  const average=Math.round(profiles.reduce((n,t)=>n+Math.round(t.roundScore*100),0)/profiles.length)/100;
  const september=MONTH_TO_ROUNDS['Setembro'];
  if(!september)throw new Error('Setembro sem referência');
  const septemberOrder=CONFIRMED_SEASON_TEAMS.map(t=>({id:t.id,points:september.reduce((n,r)=>n+Math.round(t.scores[r]*100),0)/100})).sort((a,b)=>b.points-a.points);
  // The narrative's leadership and superlatives must be proved, not inferred from a headline.
  if(general[0].id!==leader.id||general[1].id!==hunter.id||scores[0].id!=='ninja-do-ocidente'||monthly[0].id!=='carlao07'||septemberOrder[0].id!=='c-r-pirika')throw new Error('Contexto da reportagem diverge da fonte');
  if(b10Digest.some(m=>m.diff<rivers.diff)||b10Digest.some(m=>Math.max(m.homeAggregate,m.awayAggregate)>carlao.awayAggregate))throw new Error('Superlativo editorial não comprovado');
  const previousOctober=[...profiles].sort((a,b)=>b.scores[29]-a.scores[29]);
  if(previousOctober[0].id!=='carlao07')throw new Error('Carlao não mantinha a liderança');
  const gap=delta(leader.total,hunter.total), carlaoMonth=team('carlao07').month;
  const final=OFFICIAL_CUP_REGISTRY.m10.finalMatch;

  const headlineStory=make('manchete-r30','manchete','COPA B10 • FASE 4 & TEMPORADA GERAL','gold',
    'Drama dos 0,32 Ponto na B10, Mitada Épica de Ninja do Ocidente e Tainha Ovada Rumo à Tríplice Coroa!',
    `Rivers of Babylon avança por milímetros, Ninja do Ocidente crava ${pts(team('ninja-do-ocidente').roundScore)} pontos e a perseguição ao líder continua: Tainha e Furacão separados por ${pts(gap)}.`,
    `A Rodada 30 do Só Camisa 10 entrou para os anais do fantasy football com um roteiro que nenhum diretor de cinema ousaria inventar. Em um confronto de arrepiar os cabelos e testar os corações mais fortes, o Rivers of Babylon carimbou passagem para as oitavas da Copa B10 ao eliminar o Montinho Artilheiro por inacreditáveis ${pts(rivers.diff)} ponto no agregado (${pts(rivers.awayAggregate)} a ${pts(rivers.homeAggregate)}). Paralelamente, o Ninja do Ocidente assombrou a liga com a maior pontuação da rodada (${pts(team('ninja-do-ocidente').roundScore)}), enquanto o campeão da M10, Tainha Ovada, atropelou o Dique e sustentou a ponta do Campeonato Geral!`,
    [
      `O drama entre Rivers e Montinho foi decidido nos centésimos. Na ida, o Rivers venceu por ${pts(rivers.awayLeg1)} a ${pts(rivers.homeLeg1)}. Na volta, o Montinho colocou a faca nos dentes e fez ${pts(rivers.homeLeg2)} contra ${pts(rivers.awayLeg2)}. A reação quase virou a história: faltaram ${pts(rivers.diff)} ponto para igualar o agregado. Foi o confronto mais apertado entre os 16 da Fase 4.`,
      `O dono da rodada atende pelo nome de Fabio Okuno. Seu Ninja venceu o Marixco na volta por ${pts(ninja.awayLeg2)} a ${pts(ninja.homeLeg2)}, fechou ${pts(ninja.awayAggregate)} a ${pts(ninja.homeAggregate)} no agregado e derrubou o cabeça de chave #8. Do outro lado da edição, Pretinho99 virou seu duelo e Pirika confirmou o passaporte para enfrentar Tainha.`,
      `Na corrida pela taça geral, o líder Tainha (${pts(leader.total)} pontos) não teve descanso: o Furacão K7 cravou ${pts(hunter.roundScore)} na rodada, avançou sobre Avaih e segue na cola com ${pts(hunter.total)}. São ${pts(gap)} pontos de distância a oito rodadas do fim. A batalha pelo trono continua aberta!`,
    ], ['rivers-of-babylon','ninja-do-ocidente','tainha-ovada-fc'],
    [['Duelo mais apertado',`${pts(rivers.awayAggregate)} x ${pts(rivers.homeAggregate)} · diferença ${pts(rivers.diff)}`],['Craque da R30',`${pts(team('ninja-do-ocidente').roundScore)} pontos`],['Distância na Geral',`${pts(gap)} pontos`]]);

  const ninjaStory=make('destaque-ninja','destaque',`CRAQUE DA RODADA • ${pts(ninja.awayLeg2)} PTS`,'blue',
    'A Grande Mitada da R30: Ninja do Ocidente Atropela Marixco FC e Garante Vaga de Gala!',
    `Fabio Okuno fecha ${pts(ninja.awayAggregate)} no agregado, derruba o cabeça de chave #8 e assina a maior pontuação entre os 50 clubes.`,
    `Quem piscou perdeu o show do NINJA DO OCIDENTE na Rodada 30! Com pontuação estratosférica de ${pts(ninja.awayLeg2)} pontos, a equipe de Fabio Okuno não deixou o Marixco transformar a volta em virada. O adversário também passou dos 100, mas o Ninja respondeu com a maior marca de toda a liga. Na soma de ida e volta, o confronto fechou em ${pts(ninja.awayAggregate)} a ${pts(ninja.homeAggregate)}: vaga de gala nas oitavas.`,
    [
      `A vantagem começou na ida: ${pts(ninja.awayLeg1)} a ${pts(ninja.homeLeg1)} para o Ninja. Na volta, o Marixco fez ${pts(ninja.homeLeg2)} e aumentou sua pontuação em relação ao primeiro jogo. Era uma resposta de peso; diante dos ${pts(ninja.awayLeg2)} de Fabio, porém, a diferença no agregado terminou em ${pts(ninja.diff)}.`,
      `O tamanho da mitada também aparece fora do mata-mata. A média dos 50 clubes na R30 foi ${pts(average)}; o Ninja ficou ${pts(delta(ninja.awayLeg2,average))} pontos acima dela. O craque da rodada agora encontra Fernandoguinho nas oitavas. A próxima batalha já tem nome — o show da R30 já tem dono.`,
    ], ['ninja-do-ocidente','marixco-fc'], [['R30 · maior entre 50',pts(ninja.awayLeg2)],['Agregado',`${pts(ninja.awayAggregate)} x ${pts(ninja.homeAggregate)}`],['Acima da média',pts(delta(ninja.awayLeg2,average))]]);

  const carlaoStory=make('destaque-carlao','mensal',`MAIOR AGREGADO DA FASE 4 • ${pts(carlao.awayAggregate)}`,'purple',
    'Carlao07 Pulveriza a Fase 4 da B10 e Mantém a Liderança Absoluta de Outubro!',
    `Com ${pts(carlao.awayLeg1)} na ida e ${pts(carlao.awayLeg2)} na volta, Carlos Henrique atropela Chinchila e transforma a mitada em duas frentes de disputa.`,
    `Uma avalanche na ida, outra atuação de peso na volta. O Carlao07 não deixou a primeira mitada virar uma lembrança isolada: somou ${pts(carlao.awayLeg1)} na R29 e ${pts(carlao.awayLeg2)} na R30 para fechar os impressionantes ${pts(carlao.awayAggregate)} pontos, o maior agregado individual entre os 32 clubes da Fase 4. A Chinchila Cabeçuda encerrou o confronto com ${pts(carlao.homeAggregate)}. O passaporte para as oitavas veio com a força de um atropelo.`,
    [
      `A margem final foi ${pts(carlao.diff)} pontos. É a segunda maior entre os 16 confrontos: apenas Tainha, que abriu ${pts(tainha.diff)} contra Dique, venceu por diferença superior. O maior agregado foi de Carlao; a maior margem, de Tainha. Duas formas de dominar a rodada, cada uma com seu protagonista.`,
      `E a mesma pontuação conta outra história. Outubro começou na R29, com Carlao já na liderança, e os ${pts(carlao.awayLeg2)} da R30 mantiveram o clube na ponta com ${pts(carlaoMonth)}. Enquanto carimbava a vaga na B10, Carlos Henrique defendia o trono mensal. Nas oitavas, o próximo capítulo será contra Dois Vizinhos SA, vice da M10: o caminho segue pesado.`,
    ], ['carlao07','chinchila-cabecuda'],[['Ida R29',pts(carlao.awayLeg1)],['Volta R30',pts(carlao.awayLeg2)],['B10 / outubro',`${pts(carlao.awayAggregate)} pontos`]]);

  const deficit=delta(pretinho.awayLeg1,pretinho.homeLeg1),returnMargin=delta(pretinho.homeLeg2,pretinho.awayLeg2);
  if(deficit<=0||returnMargin<=0||pretinho.winnerId!=='pretinho99-f-c')throw new Error('Virada não comprovada');
  const pretinhoStory=make('destaque-pretinho','destaque','VIRADA NA VOLTA • VAGA POR 2,41','emerald',
    'Pretinho99 Vira a Batalha Contra o Sovaco e Sobrevive por 2,41 Pontos!',
    `Depois de perder a ida por ${pts(deficit)}, Pretinho99 responde na R30 e arranca a vaga em um duelo que terminou nos centésimos.`,
    `O Sovaco da Pantera saiu da ida com ${pts(pretinho.awayLeg1)} pontos contra ${pts(pretinho.homeLeg1)} do Pretinho99. A vantagem de ${pts(deficit)} colocava uma pergunta na mesa: haveria reação suficiente na volta? Houve. Na R30, Pretinho cravou ${pts(pretinho.homeLeg2)}, o Sovaco fez ${pts(pretinho.awayLeg2)} e a história virou. No agregado, ${pts(pretinho.homeAggregate)} a ${pts(pretinho.awayAggregate)}: Pretinho sobreviveu por ${pts(pretinho.diff)}.`,
    [
      `A conta da virada mostra o tamanho da tensão. Pretinho venceu a volta por ${pts(returnMargin)} pontos; precisava recuperar os ${pts(deficit)} perdidos na ida. A sobra foi exatamente ${pts(pretinho.diff)}. Não bastava melhorar: era preciso ganhar por margem suficiente. O clube conseguiu e manteve a campanha viva.`,
      `Entre os 16 confrontos, somente o duelo Rivers x Montinho terminou com diferença menor. Pretinho e Sovaco protagonizaram a segunda decisão mais apertada da Fase 4. Para quem avançou, o próximo adversário é Rivers of Babylon — justamente o sobrevivente dos 0,32 ponto. Duas vagas arrancadas no limite vão se encontrar nas oitavas.`,
    ],['pretinho99-f-c','sovaco-da-pantera'],[['Ida · Pretinho x Sovaco',`${pts(pretinho.homeLeg1)} x ${pts(pretinho.awayLeg1)}`],['Volta · Pretinho x Sovaco',`${pts(pretinho.homeLeg2)} x ${pts(pretinho.awayLeg2)}`],['Agregado',`${pts(pretinho.homeAggregate)} x ${pts(pretinho.awayAggregate)}`]]);
  // Margins 0.32 and 2.41 establish the rarity claimed in the new article.
  if([...b10Digest].sort((a,b)=>a.diff-b.diff)[1].matchNumber!==7)throw new Error('Segunda menor margem não comprovada');

  const tainhaStory=make('cruzada-tainha','cruzada','M10 & GERAL & B10','gold',
    'O Império de Tainha Ovada FC: Campeão do Mundo, Líder do Geral e Oitavas na B10!',
    'Alexandre De Sousa mantém três frentes conectadas: uma taça conquistada, a liderança geral e a campanha viva na B10.',
    `Se alguém tem motivos de sobra para comemorar, esse alguém é o comandante do Tainha Ovada FC. Na R29, ergueu a taça da M10 ao derrotar Dois Vizinhos por ${pts(final.score1)} a ${pts(final.score2)}. Na R30, fechou a B10 contra Dique com ${pts(tainha.homeAggregate)} a ${pts(tainha.awayAggregate)} e permaneceu na liderança isolada da Geral, com ${pts(leader.total)} pontos. A tríplice coroa continua como possibilidade, não como conquista antecipada.`,
    [
      `A passagem na B10 foi a mais larga da Fase 4: ${pts(tainha.diff)} pontos de vantagem. A taça da M10 já está definida; as outras disputas seguem abertas. Tainha atravessa a rodada com um título nas mãos e dois caminhos ainda em campo. É esse encontro entre competições que dá tamanho à sua temporada.`,
      `O caminho adiante tem obstáculos concretos: C.R.Pirika, classificado sobre o Galo, será o rival nas oitavas; na Geral, Furacão está ${pts(gap)} pontos atrás. O império de Alexandre continua de pé, mas o cerco tem nome, placar e adversário. Haverá alguém capaz de frear essa caminhada?`,
    ],['tainha-ovada-fc'],[['M10 · final',`${pts(final.score1)} x ${pts(final.score2)}`],['B10 · agregado',`${pts(tainha.homeAggregate)} x ${pts(tainha.awayAggregate)}`],['Geral · líder',pts(leader.total)]]);

  const furacaoStory=make('cruzada-furacao','cruzada',`O CAÇADOR DA LIGA • ${pts(gap)} DA PONTA`,'red',
    'Furacão K7 FC Cola no Líder Geral e Avança na B10 em Noite Eletrizante!',
    `Cassio crava ${pts(hunter.roundScore)} pontos, supera Avaih e mantém a perseguição ao Tainha em duas frentes.`,
    `Enquanto os holofotes se voltam para o Tainha Ovada, o FURACÃO K7 FC continua na caça. Com ${pts(hunter.roundScore)} pontos na R30, Cassio superou o Avaih no agregado por ${pts(furacao.awayAggregate)} a ${pts(furacao.homeAggregate)} e carimbou a vaga nas oitavas da B10. Na Geral, segue em segundo com ${pts(hunter.total)}, a ${pts(gap)} da liderança. A pressão continua dos dois lados.`,
    [
      `O duelo da B10 teve duas vitórias do Furacão: ${pts(furacao.awayLeg1)} a ${pts(furacao.homeLeg1)} na ida e ${pts(furacao.awayLeg2)} a ${pts(furacao.homeLeg2)} na volta. Nenhuma margem passou de dez pontos, mas somadas deram os ${pts(furacao.diff)} que separaram a classificação da eliminação. Foi um avanço construído jogo a jogo.`,
      `Na rodada, ${pts(hunter.roundScore)} foi a ${scores.findIndex(t=>t.id===hunter.id)+1}ª maior pontuação da liga. Nas oitavas, o Furacão encontrará Futcafa. Na Geral, ainda há oito rodadas para buscar Tainha. O caçador ganhou mais um capítulo na copa; a perseguição ao troféu da temporada continua.`,
    ],['furacao-k7-fc','avaih-f-c'],[['R30',pts(hunter.roundScore)],['B10',`${pts(furacao.awayAggregate)} x ${pts(furacao.homeAggregate)}`],['Distância da liderança',pts(gap)]]);

  const playoff=OFFICIAL_CUP_REGISTRY.b10.playoffHighlights.capitaBuskeMatch;
  const pirikaStory=make('cruzada-pirika','cruzada','CAMPEÃO DE SETEMBRO • VIVO NA B10','amber',
    'Pirika Interrompe a Odisseia do Galo e Leva a Coroa de Setembro à Batalha Contra Tainha!',
    `O campeão mensal fecha ${pts(pirika.homeAggregate)} contra ${pts(pirika.awayAggregate)} do CRF Galo e transforma a próxima fase em encontro de campeões.`,
    `A odisseia do CRF Galo parou na Fase 4. O clube de Renato havia vencido Capitã Buske nos playoffs por ${pts(playoff.scoreWinner)} a ${pts(playoff.scoreLoser)}, mas encontrou outro desfecho diante do C.R.Pirika. Com ${pts(pirika.homeLeg1)} na ida e ${pts(pirika.homeLeg2)} na volta, Pirika fechou ${pts(pirika.homeAggregate)} contra ${pts(pirika.awayAggregate)}. A vantagem foi ${pts(pirika.diff)}: vaga confirmada para o campeão de setembro.`,
    [
      `O Galo fez ${pts(pirika.awayLeg1)} no primeiro jogo e ${pts(pirika.awayLeg2)} no segundo. Pirika venceu as duas partidas e levou sua história mensal para dentro do mata-mata: havia terminado setembro na ponta com ${pts(septemberOrder[0].points)} pontos, agora segue entre os 16 sobreviventes da B10.`,
      `Nas oitavas, a coroa de setembro encontrará a taça da M10: Pirika enfrentará Tainha Ovada. A reportagem não antecipa o resultado desse duelo; reconhece o tamanho de seus personagens. De um lado, o campeão mensal. Do outro, o campeão da M10 e líder da Geral. A próxima batalha promete.`,
    ],['c-r-pirika','crf-galo'],[['Setembro · campeão',pts(septemberOrder[0].points)],['Fase 4 · Pirika x Galo',`${pts(pirika.homeAggregate)} x ${pts(pirika.awayAggregate)}`],['Oitavas','C.R.Pirika x Tainha Ovada FC']]);

  return {headlineStory,featuredStories:[ninjaStory,carlaoStory,pretinhoStory],crossStories:[tainhaStory,furacaoStory,pirikaStory]};
}
