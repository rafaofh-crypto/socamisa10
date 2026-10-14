import { CupMatchReport } from './types';

export interface ConfirmedCupData {
  m10: {
    isConcluded: boolean;
    concludedRound: number;
    championId: string;
    championName: string;
    runnerUpId: string;
    runnerUpName: string;
    thirdPlaceId: string;
    thirdPlaceName: string;
    fourthPlaceId: string;
    fourthPlaceName: string;
    finalMatch: {
      team1: string;
      score1: number;
      team2: string;
      score2: number;
      diff: number;
    };
    thirdPlaceMatch: {
      team1: string;
      score1: number;
      team2: string;
      score2: number;
      diff: number;
    };
  };
  b10: {
    cutRound: number;
    repescagemRound: number;
    playoffLeg1Round: number;
    playoffLeg2Round: number;
    phase4Leg1Round: number;
    phase4Leg2Round: number;
    oitavasLeg1Round: number;
    // Fatos homologados da repescagem e playoffs
    playoffHighlights: {
      capitaBuskeMatch: {
        matchId: number;
        winner: string;
        loser: string;
        scoreWinner: number;
        scoreLoser: number;
        note: string;
      };
      casquinhaMatch: {
        matchId: number;
        winner: string;
        loser: string;
        scoreWinner: number;
        scoreLoser: number;
        note: string;
      };
    };
    confirmedMatchesR29R30: CupMatchReport[];
  };
}

export const OFFICIAL_CUP_REGISTRY: ConfirmedCupData = {
  m10: {
    isConcluded: true,
    concludedRound: 29,
    championId: 'tainha-ovada-fc',
    championName: 'Tainha Ovada FC',
    runnerUpId: 'dois-vizinhos-sa',
    runnerUpName: 'Dois Vizinhos SA',
    thirdPlaceId: 'camisa-pesada-sa',
    thirdPlaceName: 'Camisa Pesada SA',
    fourthPlaceId: 'monges-tibetanos-fc',
    fourthPlaceName: 'Monges Tibetanos FC',
    finalMatch: {
      team1: 'Tainha Ovada FC',
      score1: 119.86,
      team2: 'Dois Vizinhos SA',
      score2: 117.68,
      diff: 2.18
    },
    thirdPlaceMatch: {
      team1: 'Camisa Pesada SA',
      score1: 132.96,
      team2: 'Monges Tibetanos FC',
      score2: 113.86,
      diff: 19.10
    }
  },
  b10: {
    cutRound: 25,
    repescagemRound: 26,
    playoffLeg1Round: 27,
    playoffLeg2Round: 28,
    phase4Leg1Round: 29,
    phase4Leg2Round: 30,
    oitavasLeg1Round: 31,
    playoffHighlights: {
      capitaBuskeMatch: {
        matchId: 8,
        winner: 'CRF GALO',
        loser: 'Capitã Buske',
        scoreWinner: 155.76,
        scoreLoser: 139.83,
        note: 'Capitã Buske caiu nos Playoffs (R27+R28) para o CRF Galo por 155.76 x 139.83. Não disputou a Fase 4.'
      },
      casquinhaMatch: {
        matchId: 12,
        winner: 'Futcafa',
        loser: 'Casquinha EC',
        scoreWinner: 162.57,
        scoreLoser: 147.26,
        note: 'Casquinha EC caiu nos Playoffs (R27+R28) para o Futcafa por 162.57 x 147.26. Não disputou a Fase 4.'
      }
    },
    // OS 16 CONFRONTOS REAIS DA FASE 4 (16 AVOS) COMPUTADOS RIGOROSAMENTE PELO MOTOR DO TORNEIO
    confirmedMatchesR29R30: [
      {
        matchNumber: 1,
        homeClub: { id: 'dois-vizinhos-sa', name: 'Dois Vizinhos SA', owner: 'Angelo Cassol', seedRank: 1, isElite: true },
        awayClub: { id: 'delirio-futebol-e-festa', name: 'Delirio Futebol e Festa', owner: 'Chico Machado', seedRank: 47, isElite: false },
        homeLeg1: 117.68,
        homeLeg2: 77.48,
        homeAggregate: 195.16,
        awayLeg1: 96.45,
        awayLeg2: 82.38,
        awayAggregate: 178.83,
        winnerId: 'dois-vizinhos-sa',
        winnerName: 'Dois Vizinhos SA',
        diff: 16.33,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 2,
        homeClub: { id: 'camisa-pesada-sa', name: 'Camisa Pesada SA', owner: 'Gean Marques', seedRank: 2, isElite: true },
        awayClub: { id: 'lendinhaxx-fc', name: 'lendinhaxx fc', owner: 'gustavo', seedRank: 45, isElite: false },
        homeLeg1: 132.96,
        homeLeg2: 110.83,
        homeAggregate: 243.79,
        awayLeg1: 95.56,
        awayLeg2: 116.88,
        awayAggregate: 212.44,
        winnerId: 'camisa-pesada-sa',
        winnerName: 'Camisa Pesada SA',
        diff: 31.35,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 3,
        homeClub: { id: 'rolo-compressor-4lib', name: 'Rolo Compressor 4Lib', owner: 'WIllian Alexandre', seedRank: 3, isElite: true },
        awayClub: { id: 'abedaozinho', name: 'Abedaozinho', owner: 'ArthureHeitorHermes', seedRank: 43, isElite: false },
        homeLeg1: 106.16,
        homeLeg2: 115.23,
        homeAggregate: 221.39,
        awayLeg1: 104.26,
        awayLeg2: 110.93,
        awayAggregate: 215.19,
        winnerId: 'rolo-compressor-4lib',
        winnerName: 'Rolo Compressor 4Lib',
        diff: 6.20,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 4,
        homeClub: { id: 'diferencial-f-c', name: 'DIFERENCIAL F.C.', owner: 'Fernando Reis Silva', seedRank: 4, isElite: true },
        awayClub: { id: 'futcafa', name: 'Futcafa', owner: 'Laion Gomes', seedRank: 37, isElite: false },
        homeLeg1: 99.06,
        homeLeg2: 90.39,
        homeAggregate: 189.45,
        awayLeg1: 123.36,
        awayLeg2: 94.78,
        awayAggregate: 218.14,
        winnerId: 'futcafa',
        winnerName: 'Futcafa',
        diff: 28.69,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 5,
        homeClub: { id: 'dida82-fc', name: 'Dida82 FC', owner: 'Anderson D da Rosa', seedRank: 5, isElite: true },
        awayClub: { id: 'onodi-floripa', name: 'Onodi Floripa', owner: 'Rafael Fattori', seedRank: 36, isElite: false },
        homeLeg1: 110.46,
        homeLeg2: 114.63,
        homeAggregate: 225.09,
        awayLeg1: 110.15,
        awayLeg2: 77.61,
        awayAggregate: 187.76,
        winnerId: 'dida82-fc',
        winnerName: 'Dida82 FC',
        diff: 37.33,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 6,
        homeClub: { id: 'tainha-ovada-fc', name: 'Tainha Ovada FC', owner: 'Alexandre De Sousa', seedRank: 6, isElite: true },
        awayClub: { id: 'dique-sc', name: 'dique-sc', owner: 'alfradique -sc', seedRank: 33, isElite: false },
        homeLeg1: 119.86,
        homeLeg2: 115.23,
        homeAggregate: 235.09,
        awayLeg1: 55.61,
        awayLeg2: 64.98,
        awayAggregate: 120.59,
        winnerId: 'tainha-ovada-fc',
        winnerName: 'Tainha Ovada FC',
        diff: 114.50,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 7,
        homeClub: { id: 'pretinho99-f-c', name: 'Pretinho99 F.C', owner: 'Dieverson Pereira', seedRank: 7, isElite: true },
        awayClub: { id: 'sovaco-da-pantera', name: 'Sovaco da Pantera', owner: 'Tiago Fattori', seedRank: 31, isElite: false },
        homeLeg1: 116.96,
        homeLeg2: 109.83,
        homeAggregate: 226.79,
        awayLeg1: 133.56,
        awayLeg2: 90.82,
        awayAggregate: 224.38,
        winnerId: 'pretinho99-f-c',
        winnerName: 'Pretinho99 F.C',
        diff: 2.41,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 8,
        homeClub: { id: 'marixco-fc', name: 'marixco fc', owner: 'dudu', seedRank: 8, isElite: true },
        awayClub: { id: 'ninja-do-ocidente', name: 'NINJA DO OCIDENTE', owner: 'Fabio Okuno', seedRank: 30, isElite: false },
        homeLeg1: 97.62,
        homeLeg2: 111.23,
        homeAggregate: 208.85,
        awayLeg1: 113.76,
        awayLeg2: 122.33,
        awayAggregate: 236.09,
        winnerId: 'ninja-do-ocidente',
        winnerName: 'NINJA DO OCIDENTE',
        diff: 27.24,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 9,
        homeClub: { id: 'montinho-artilheiro-fc', name: 'Montinho Artilheiro FC', owner: 'Hessmann', seedRank: 9, isElite: true },
        awayClub: { id: 'rivers-of-babylon', name: 'Rivers of Babylon', owner: 'Tiago Melo', seedRank: 27, isElite: false },
        homeLeg1: 101.04,
        homeLeg2: 107.23,
        homeAggregate: 208.27,
        awayLeg1: 108.76,
        awayLeg2: 99.83,
        awayAggregate: 208.59,
        winnerId: 'rivers-of-babylon',
        winnerName: 'Rivers of Babylon',
        diff: 0.32,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 10,
        homeClub: { id: 'dedeyy-fc', name: 'Dedeyy Fc', owner: 'Andrey Damasco', seedRank: 10, isElite: true },
        awayClub: { id: 'fernandoguinho', name: 'Fernandoguinho', owner: 'Fernando Lopes', seedRank: 26, isElite: false },
        homeLeg1: 93.22,
        homeLeg2: 73.43,
        homeAggregate: 166.65,
        awayLeg1: 115.43,
        awayLeg2: 93.39,
        awayAggregate: 208.82,
        winnerId: 'fernandoguinho',
        winnerName: 'Fernandoguinho',
        diff: 42.17,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 11,
        homeClub: { id: 'jberetta', name: 'JBERETTA', owner: 'José Bereta', seedRank: 11, isElite: true },
        awayClub: { id: 'jammes-rodriguez', name: 'Jammes Rodriguez', owner: 'HERMES', seedRank: 25, isElite: false },
        homeLeg1: 99.09,
        homeLeg2: 85.23,
        homeAggregate: 184.32,
        awayLeg1: 125.81,
        awayLeg2: 112.93,
        awayAggregate: 238.74,
        winnerId: 'jammes-rodriguez',
        winnerName: 'Jammes Rodriguez',
        diff: 54.42,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 12,
        homeClub: { id: 'c-r-pirika', name: 'C.R.Pirika', owner: 'Diego a Jorge', seedRank: 12, isElite: true },
        awayClub: { id: 'crf-galo', name: 'CRF GALO', owner: 'Renato Galo', seedRank: 24, isElite: false },
        homeLeg1: 112.46,
        homeLeg2: 117.03,
        homeAggregate: 229.49,
        awayLeg1: 108.24,
        awayLeg2: 92.15,
        awayAggregate: 200.39,
        winnerId: 'c-r-pirika',
        winnerName: 'C.R.Pirika',
        diff: 29.10,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 13,
        homeClub: { id: 'everton-ultramaratonista-f-c', name: 'Everton UltraMaratonista F.C', owner: 'Everton Samir', seedRank: 13, isElite: true },
        awayClub: { id: 'kaka-f-c', name: 'kaka F C', owner: 'Ricardo Bittencourt', seedRank: 23, isElite: false },
        homeLeg1: 125.66,
        homeLeg2: 113.23,
        homeAggregate: 238.89,
        awayLeg1: 94.36,
        awayLeg2: 97.33,
        awayAggregate: 191.69,
        winnerId: 'everton-ultramaratonista-f-c',
        winnerName: 'Everton UltraMaratonista F.C',
        diff: 47.20,
        isUpset: false,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 14,
        homeClub: { id: 'avaih-f-c', name: 'Avaih F C', owner: 'Gabriel Alvarez', seedRank: 14, isElite: true },
        awayClub: { id: 'furacao-k7-fc', name: 'FURACÃO K7 FC', owner: 'Cassio', seedRank: 21, isElite: false },
        homeLeg1: 117.16,
        homeLeg2: 114.53,
        homeAggregate: 231.69,
        awayLeg1: 124.64,
        awayLeg2: 116.43,
        awayAggregate: 241.07,
        winnerId: 'furacao-k7-fc',
        winnerName: 'FURACÃO K7 FC',
        diff: 9.38,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 15,
        homeClub: { id: 'chinchila-cabecuda', name: 'Chinchila cabeçuda', owner: 'Sartori', seedRank: 15, isElite: true },
        awayClub: { id: 'carlao07', name: 'Carlao07', owner: 'Carlos Henrique R. H', seedRank: 19, isElite: false },
        homeLeg1: 81.87,
        homeLeg2: 94.39,
        homeAggregate: 176.26,
        awayLeg1: 148.81,
        awayLeg2: 117.13,
        awayAggregate: 265.94,
        winnerId: 'carlao07',
        winnerName: 'Carlao07',
        diff: 89.68,
        isUpset: true,
        status: 'ENCERRADO'
      },
      {
        matchNumber: 16,
        homeClub: { id: 'monges-tibetanos-fc', name: 'Monges tibetanos FC', owner: 'Marcelo', seedRank: 16, isElite: true },
        awayClub: { id: 'dudumathias-fc', name: 'DuduMathias FC', owner: 'Evandro Rebelatto', seedRank: 17, isElite: false },
        homeLeg1: 113.86,
        homeLeg2: 87.90,
        homeAggregate: 201.76,
        awayLeg1: 98.70,
        awayLeg2: 116.53,
        awayAggregate: 215.23,
        winnerId: 'dudumathias-fc',
        winnerName: 'DuduMathias FC',
        diff: 13.47,
        isUpset: true,
        status: 'ENCERRADO'
      }
    ]
  }
};

