import axios, { AxiosResponse } from 'axios';
import { TEAM_MEMBERS } from './cartollaApi';

export interface CartolaTeam {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  scores: Record<number, number>; // Round -> Score mapping
  patrimonios?: Record<number, number>; // Round -> Patrimonio mapping
  is_survivor?: boolean; // Whether the team survived the 'Esperneio'
}

export interface CartolaData {
  liga: {
    id: number;
    nome: string;
    slug: string;
    temporada: number;
  };
  times: CartolaTeam[];
  rodadaAtual: number;
  rodadas: any[];
  offlineFallback?: boolean;
  fallbackReason?: string;
  syncedRounds?: number[];
  allSyncedScores?: Record<number, Record<string, number>>;
}

/**
 * Reconstructs realistic historical scores so that:
 * 1. The score of currentRound is exactly latestRoundScore.
 * 2. The sum of all scores 1..currentRound matches pointsCampeonato.
 */
function generateHistoricalScores(
  teamId: string,
  pointsCampeonato: number,
  currentRound: number,
  latestRoundScore: number
): Record<number, number> {
  const scores: Record<number, number> = {};
  
  // Guard values
  const currentVal = typeof latestRoundScore === "number" ? latestRoundScore : 65;
  const totalVal = typeof pointsCampeonato === "number" ? pointsCampeonato : currentVal;
  
  scores[currentRound] = Number(currentVal.toFixed(2));
  
  const N = currentRound - 1;
  const remainingSum = totalVal - currentVal;

  if (N <= 0) {
    return scores;
  }

  // Distribute remainingSum across N rounds
  let accumulated = 0;
  for (let r = 1; r <= N; r++) {
    const remainingRounds = N - r + 1;
    const remainingToDistribute = remainingSum - accumulated;
    const targetAvg = remainingToDistribute / remainingRounds;
    
    // Create random fluctuation +/- 20%
    const maxNoise = Math.min(25, Math.max(5, targetAvg * 0.25));
    // Seed noise with a deterministic factor based on teamId and round to keep consistent sync
    const numericalId = parseInt(teamId.replace(/\D/g, '')) || 1;
    const seed = Math.sin(r + numericalId) * 0.5 + Math.cos(r * 2 - numericalId) * 0.5;
    const noise = seed * maxNoise;
    
    let val = targetAvg + noise;
    val = Math.max(10, Math.min(145, val));
    const roundedVal = Number(val.toFixed(2));
    
    scores[r] = roundedVal;
    accumulated += roundedVal;
  }

  // Adjust the last historical round to absorb any difference
  const difference = Number((remainingSum - accumulated).toFixed(2));
  if (scores[N] !== undefined) {
    scores[N] = Number(Math.max(10, scores[N] + difference).toFixed(2));
  }

  // Set entries for future rounds to 0
  for (let r = currentRound + 1; r <= 38; r++) {
    scores[r] = 0;
  }

  return scores;
}

async function fetchCartolaDataWithRetry(
  url: string,
  retries: number = 3,
  baseDelay: number = 1000,
  extraHeaders: Record<string, string> = {}
): Promise<AxiosResponse> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...extraHeaders
        },
        timeout: 15000
      });
      if (response.status === 200) {
        return response;
      }
    } catch (error: any) {
      console.warn(`[ETL] Tentativa ${attempt + 1}/${retries} falhou:`, error.message);
      if (attempt === retries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
}

export function validarRespostaCartola(data: any): boolean {
  if (!data) {
    throw new Error('Resposta nula ou vazia');
  }
  const times = data.times || (data.ligas && data.ligas[0]?.times);
  if (!times || !Array.isArray(times)) {
    throw new Error('Resposta inválida: sem lista de times (times ou ligas[0].times)');
  }
  return true;
}

export function processarDadosCartola(data: any): CartolaData {
  if (!validarRespostaCartola(data)) {
    throw new Error('Validação falhou');
  }

  let rawLiga = data.liga || (data.ligas && data.ligas[0]);
  if (!rawLiga) {
    rawLiga = {
      id: 169382,
      nome: "Só Camisa 10 2026",
      slug: "so-camisa-10-2026",
      temporada: 2026
    };
  }

  const times = data.times || rawLiga.times || [];
  const rodadaAtual = data.rodada_atual || rawLiga.rodada_atual || 17;

  return {
    liga: {
      id: rawLiga.liga_id || rawLiga.id || 169382,
      nome: rawLiga.nome || "Só Camisa 10 2026",
      slug: rawLiga.slug || "so-camisa-10-2026",
      temporada: rawLiga.temporada || 2026
    },
    times: times.map((item: any, idx: number) => {
      // Handle nested time details
      const timeObj = item.time || item;
      const timeId = String(timeObj.time_id || timeObj.id || `real_${idx + 1}`);
      const rawNome = timeObj.nome_time || timeObj.nome || `Time ${timeId}`;
      const rawOwner = timeObj.nome_cartoleiro || timeObj.nome_cartola || "Cartoleiro Sem Nome";
      const rawShield = timeObj.escudo_time || timeObj.url_escudo_svg || timeObj.url_escudo_png || "";

      // Handle scores safely in various possible schema structures from Cartola FC
      let pontosCampeonato = 1100;
      let ultimaPontuacao = 65;

      if (item.pontos && typeof item.pontos === 'object') {
        pontosCampeonato = Number(item.pontos.campeonato ?? 1100);
        ultimaPontuacao = Number(item.pontos.rodada ?? 65);
      } else {
        pontosCampeonato = Number(item.pontos_campeonato ?? item.pontos ?? 1100);
        ultimaPontuacao = Number(item.ultima_pontuacao ?? 65);
      }

      const generatedScores = generateHistoricalScores(timeId, pontosCampeonato, rodadaAtual, ultimaPontuacao);

      // Make sure we have a valid SVG or render fallback shape
      let shieldUrl = rawShield;
      if (!shieldUrl) {
        // SVG Fallback Shield
        shieldUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><circle cx="50" cy="50" r="45" fill="%23D4AF37" stroke="%23121212" stroke-width="5"/><text x="50" y="58" font-family="Montserrat, sans-serif" font-weight="bold" font-size="22" fill="%23FFFFFF" text-anchor="middle">${encodeURIComponent(rawNome.substring(0, 2).toUpperCase())}</text></svg>`;
      }

      return {
        id: timeId,
        name: rawNome,
        owner: rawOwner,
        shieldUrl: shieldUrl,
        scores: item.scores || generatedScores,
        patrimonios: item.patrimonios || {}
      };
    }),
    rodadaAtual: rodadaAtual,
    rodadas: data.rodadas || rawLiga?.rodadas || [],
    offlineFallback: !!data.offlineFallback,
    fallbackReason: data.fallbackReason,
    syncedRounds: data.synced_rounds || [],
    allSyncedScores: data.all_synced_scores || {}
  };
}

export async function syncCartolaData(onProgress?: (msg: string) => void, token?: string): Promise<CartolaData> {
  const leagueSlug = localStorage.getItem('cartolaLeagueSlug') || 'so-camisa-10-2026';
  
  const proxyUrl = '/api/cartola';

  const extraHeaders: Record<string, string> = {};
  extraHeaders['x-league-slug'] = leagueSlug;
  if (token) {
    extraHeaders['x-glb-token'] = token;
  }

  try {
    onProgress?.('Acessando o banco de dados e dados da Planilha (/api/cartola)...');
    console.log('[ETL] Iniciando sincronização via servidor...');
    const response = await fetchCartolaDataWithRetry(proxyUrl, 3, 500, extraHeaders);
    
    onProgress?.('Dados recebidos com sucesso! Atualizando painel...');
    const dadosProcessados = processarDadosCartola(response.data);
    
    // Save in localStorage
    localStorage.setItem('cartolaData', JSON.stringify(dadosProcessados));
    localStorage.setItem('cartolaDataTimestamp', new Date().toISOString());
    localStorage.setItem('cartolaDataSource', 'API');
    
    return dadosProcessados;
  } catch (proxyError: any) {
    const errorMsg = proxyError.response?.data?.message || proxyError.response?.data?.mensagem || proxyError.message || "Falha na conexão";
    console.info('[ETL] Servidor indisponível ou em modo offline, carregando contingência local...', errorMsg);
    onProgress?.(`[Sincronização] Falhou: ${errorMsg}. Carregando contingência estática local...`);
    
    console.log('[ETL] Utilizando os dados offline locais integrados ao SaaS.');
    
    // Fallback robusto de alta fidelidade
    const mockResult: CartolaData = {
      liga: {
        id: 11223,
        nome: "Só Camisa 10 2026",
        slug: "so-camisa-10-2026",
        temporada: 2026
      },
      times: TEAM_MEMBERS,
      rodadaAtual: 17,
      rodadas: []
    };

    localStorage.setItem('cartolaData', JSON.stringify(mockResult));
    localStorage.setItem('cartolaDataTimestamp', new Date().toISOString());
    localStorage.setItem('cartolaDataSource', 'FALLBACK');
    
    return mockResult;
  }
}
