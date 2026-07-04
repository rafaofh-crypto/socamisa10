import axios, { AxiosResponse } from 'axios';
import { TEAM_MEMBERS, getShieldUrlForTeam } from './cartollaApi';

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
      const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><circle cx="50" cy="50" r="45" fill="%23D4AF37" stroke="%23121212" stroke-width="5"/><text x="50" y="58" font-family="Montserrat, sans-serif" font-weight="bold" font-size="22" fill="%23FFFFFF" text-anchor="middle">${encodeURIComponent(rawNome.substring(0, 2).toUpperCase())}</text></svg>`;
      const shieldUrl = getShieldUrlForTeam(rawNome, rawShield || fallbackSvg);

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

async function fetchSheetsConfig(): Promise<{ spreadsheetUrl: string; tabName: string }> {
  // First, check localStorage for a custom client-saved config
  const localUrl = localStorage.getItem("customSpreadsheetUrl") || localStorage.getItem("isM10Enabled_temp_sheetUrl"); // support admin page custom inputs
  const localTab = localStorage.getItem("customTabName");
  if (localUrl) {
    return { spreadsheetUrl: localUrl, tabName: localTab || "" };
  }

  // Next, try `/api/sheets/config`
  try {
    const res = await axios.get("/api/sheets/config", { timeout: 3000 });
    if (res.data && res.data.spreadsheetUrl) {
      return res.data;
    }
  } catch (err) {
    console.warn("[ETL] Falha ao ler /api/sheets/config, tentando /sheets_config.json estático...", err);
  }

  // Next, try `/sheets_config.json` static file
  try {
    const res = await axios.get("/sheets_config.json", { timeout: 3000 });
    if (res.data && res.data.spreadsheetUrl) {
      return res.data;
    }
  } catch (err) {
    console.warn("[ETL] Falha ao ler /sheets_config.json, usando padrão estático.", err);
  }

  // Default fallback URL
  return {
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1wGw0eOvoqS-Iv_qSqzpRBSPA815SqHFiEu2TMk0O_Lk/edit",
    tabName: ""
  };
}

export async function syncCartolaDataFromGoogleSheetsDirectly(
  spreadsheetUrl: string,
  tabName: string,
  onProgress?: (msg: string) => void
): Promise<CartolaData> {
  onProgress?.("Conectando diretamente à planilha do Google...");
  
  let spreadsheetId = spreadsheetUrl.trim();
  if (spreadsheetUrl.includes("docs.google.com/spreadsheets")) {
    const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      spreadsheetId = match[1];
    }
  }

  let exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
  if (tabName) {
    exportUrl += `&sheet=${encodeURIComponent(tabName)}`;
  }

  onProgress?.("Baixando dados da planilha via CORS...");
  const response = await axios.get(exportUrl, {
    timeout: 15000
  });

  if (response.status !== 200 || !response.data) {
    throw new Error(`Resposta do Google Sheets inválida: Status ${response.status}`);
  }

  const csvText = response.data;
  onProgress?.("Planilha importada! Analisando estrutura...");

  // Parser local de CSV
  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let entry = "";
    let insideQuote = false;

    const firstLine = text.split('\n')[0] || '';
    const semicolons = (firstLine.match(/;/g) || []).length;
    const commas = (firstLine.match(/,/g) || []).length;
    const delimiter = semicolons > commas ? ';' : ',';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === delimiter && !insideQuote) {
        row.push(entry.trim());
        entry = "";
      } else if ((char === '\n' || char === '\r') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(entry.trim());
        lines.push(row);
        row = [];
        entry = "";
      } else {
        entry += char;
      }
    }
    if (row.length > 0 || entry !== "") {
      row.push(entry.trim());
      lines.push(row);
    }
    return lines.filter(r => r.length > 0 && r.some(c => c.trim() !== ""));
  };

  const rows = parseCSV(csvText);
  if (rows.length < 3) {
    throw new Error("Formato de planilha inválido. Deve ter ao menos 3 linhas (cabeçalhos e dados).");
  }

  const row0 = rows[0];
  const row1 = rows[1];

  // Mapear colunas de rodadas e tipos
  const columnMapping: { colIdx: number; round: number; type: "score" | "patrimonio" }[] = [];
  let currentRoundName = "";

  for (let colIdx = 1; colIdx < row1.length; colIdx++) {
    const r0Val = row0[colIdx] ? row0[colIdx].trim() : "";
    if (r0Val) {
      currentRoundName = r0Val;
    }

    if (currentRoundName) {
      const rMatch = currentRoundName.match(/RODADA\s*(\d+)/i);
      if (rMatch) {
         const roundNumber = parseInt(rMatch[1]);
         const typeVal = row1[colIdx] ? row1[colIdx].trim().toLowerCase() : "";
         
         if (typeVal.includes("pont") || typeVal.includes("nota") || typeVal.includes("score") || typeVal.includes("pts")) {
           columnMapping.push({ colIdx, round: roundNumber, type: "score" });
         } else if (typeVal.includes("patr") || typeVal.includes("cart") || typeVal.includes("val")) {
           columnMapping.push({ colIdx, round: roundNumber, type: "patrimonio" });
         }
      }
    }
  }

  if (columnMapping.length === 0) {
    throw new Error("Não foi possível mapear nenhuma coluna de rodada (ex: 'RODADA 01' e 'Pontuação').");
  }

  // Encontrar a rodada máxima mapeada
  const mappedRounds = Array.from(new Set(columnMapping.map(c => c.round))).sort((a,b) => a-b);
  const maxActiveRound = mappedRounds.length > 0 ? mappedRounds[mappedRounds.length - 1] : 17;

  onProgress?.(`Estrutura mapeada! Encontradas rodadas de 1 a ${maxActiveRound}. Mapeando times...`);

  const syncedScores: Record<number, Record<string, number>> = {};
  const syncedPatries: Record<number, Record<string, number>> = {};

  const normalizeLocal = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const findTeamInMembers = (nameRaw: string) => {
    const searchKey = normalizeLocal(nameRaw);
    if (!searchKey) return null;

    let found = TEAM_MEMBERS.find(p => normalizeLocal(p.name) === searchKey);
    if (found) return found;

    found = TEAM_MEMBERS.find(p => normalizeLocal(p.owner) === searchKey);
    if (found) return found;

    found = TEAM_MEMBERS.find(p => {
      const nK = normalizeLocal(p.name);
      return nK.includes(searchKey) || searchKey.includes(nK);
    });

    return found || null;
  };

  let matchedCount = 0;
  const teamRecords: Record<string, { scores: Record<number, number>; patrimonios: Record<number, number> }> = {};

  // Inicializar registros para todos os times
  TEAM_MEMBERS.forEach(t => {
    teamRecords[t.id] = {
      scores: {},
      patrimonios: {}
    };
    // Preencher rodadas default com 0
    for (let r = 1; r <= 38; r++) {
      teamRecords[t.id].scores[r] = 0;
      teamRecords[t.id].patrimonios[r] = 100.00;
    }
  });

  for (let ri = 2; ri < rows.length; ri++) {
    const teamNameRaw = rows[ri][0];
    if (!teamNameRaw) continue;

    const matchedTeam = findTeamInMembers(teamNameRaw);
    if (!matchedTeam) {
      console.warn(`Time da planilha "${teamNameRaw}" não correspondido.`);
      continue;
    }

    matchedCount++;
    const record = teamRecords[matchedTeam.id];

    columnMapping.forEach(({ colIdx, round, type }) => {
      const valRaw = rows[ri][colIdx];
      if (valRaw !== undefined && valRaw.trim() !== "") {
        const val = parseFloat(valRaw.replace(",", "."));
        if (!isNaN(val)) {
          if (type === "score") {
            record.scores[round] = Number(val.toFixed(2));
            if (!syncedScores[round]) syncedScores[round] = {};
            const teamSlug = matchedTeam.name.toLowerCase().trim().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            syncedScores[round][teamSlug] = Number(val.toFixed(2));
          } else {
            record.patrimonios[round] = Number(val.toFixed(2));
            if (!syncedPatries[round]) syncedPatries[round] = {};
            const teamSlug = matchedTeam.name.toLowerCase().trim().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            syncedPatries[round][teamSlug] = Number(val.toFixed(2));
          }
        }
      }
    });
  }

  // Reconstituir patrimônios acumulados/propagar último valor
  TEAM_MEMBERS.forEach(t => {
    const record = teamRecords[t.id];
    let lastKnownPatr = 100.00;
    for (let r = 1; r <= 38; r++) {
      if (record.patrimonios[r] !== undefined && record.patrimonios[r] !== 100.00) {
        lastKnownPatr = record.patrimonios[r];
      } else {
        record.patrimonios[r] = lastKnownPatr;
      }
    }
  });

  onProgress?.(`Mapeamento direto bem sucedido! Associados ${matchedCount} de ${TEAM_MEMBERS.length} times.`);

  const updatedTimes: CartolaTeam[] = TEAM_MEMBERS.map(t => {
    const record = teamRecords[t.id];
    
    // Obter pontuação da rodada ativa
    const roundScore = record.scores[maxActiveRound] || 0;

    // Calcular total do campeonato até a rodada ativa
    let totalScore = 0;
    for (let r = 1; r <= maxActiveRound; r++) {
      totalScore += record.scores[r] || 0;
    }

    return {
      ...t,
      scores: record.scores,
      patrimonios: record.patrimonios,
      pontos: {
        campeonato: Number(totalScore.toFixed(2)),
        rodada: Number(roundScore.toFixed(2))
      }
    } as any;
  });

  return {
    liga: {
      id: 169382,
      nome: "Só Camisa 10 2026",
      slug: "so-camisa-10-2026",
      temporada: 2026
    },
    times: updatedTimes,
    rodadaAtual: maxActiveRound,
    rodadas: [],
    offlineFallback: false,
    fallbackReason: `Planilha Google Sincronizada via Cliente (Rodada ${maxActiveRound})`,
    syncedRounds: mappedRounds,
    allSyncedScores: syncedScores
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
    console.info('[ETL] Servidor indisponível ou em modo offline, tentando sincronizar diretamente com o Google Sheets...', errorMsg);
    onProgress?.(`Conectando diretamente à planilha do Google...`);
    
    try {
      const config = await fetchSheetsConfig();
      if (config.spreadsheetUrl) {
        const directData = await syncCartolaDataFromGoogleSheetsDirectly(config.spreadsheetUrl, config.tabName, onProgress);
        
        localStorage.setItem('cartolaData', JSON.stringify(directData));
        localStorage.setItem('cartolaDataTimestamp', new Date().toISOString());
        localStorage.setItem('cartolaDataSource', 'DIRECT_SHEETS');
        
        return directData;
      }
    } catch (sheetError: any) {
      console.error('[ETL] Falha ao sincronizar diretamente com o Google Sheets, recorrendo a dados locais:', sheetError.message);
      onProgress?.(`[Sincronização] Falha na planilha direta: ${sheetError.message}. Carregando contingência estática local...`);
    }

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

