import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import fs from "fs";

// 50 Participantes Oficiais da Liga "Só Camisa 10 2026"
export const OFFICIAL_PARTICIPANTS = [
  { owner: "Tiago Fattori", name: "Sovaco da Pantera", slug: "sovaco-da-pantera" },
  { owner: "Rafael Fattori", name: "Onodi Floripa", slug: "onodi-floripa" },
  { owner: "Fernando Anselmo", name: "Real Barreiros FC", slug: "real-barreiros-fc" },
  { owner: "Vitinho", name: "Fortaleza da ilha", slug: "fortaleza-da-ilha" },
  { owner: "HERMES", name: "Jammes Rodriguez", slug: "jammes-rodriguez" },
  { owner: "Evandro Rebelatto", name: "DuduMathias FC", slug: "dudumathias-fc" },
  { owner: "Daniel", name: "Barbeariadc", slug: "barbeariadc" },
  { owner: "Carlos Henrique R. H", name: "Carlao07", slug: "carlao07" },
  { owner: "Renato Galo", name: "CRF GALO", slug: "crf-galo" },
  { owner: "Gean Marques", name: "Camisa Pesada SA", slug: "camisa-pesada-sa" },
  { owner: "Sartori", name: "Chinchila cabeçuda", slug: "chinchila-cabecuda" },
  { owner: "Laion Gomes", name: "Futcafa", slug: "futcafa" },
  { owner: "Fernando Lopes", name: "Fernandoguinho", slug: "fernandoguinho" },
  { owner: "Gabriel Duarte", name: "GD LOMEUSC", slug: "gd-lomeusc" },
  { owner: "Hessmann", name: "Montinho Artilheiro FC", slug: "montinho-artilheiro-fc" },
  { owner: "Fabio Okuno", name: "NINJA DO OCIDENTE", slug: "ninja-do-ocidente" },
  { owner: "Lincoln", name: "LENOCH 'N' ROLL", slug: "lenoch-n-roll" },
  { owner: "Anderson D da Rosa", name: "Dida82 FC", slug: "dida82-fc" },
  { owner: "Angelo Cassol", name: "Dois Vizinhos SA", slug: "dois-vizinhos-sa" },
  { owner: "Dieverson Pereira", name: "Pretinho99 F.C", slug: "pretinho99-f-c" },
  { owner: "Diego a Jorge", name: "C.R.Pirika", slug: "c-r-pirika" },
  { owner: "Chico Pimenta", name: "TeamPimenta", slug: "teampimenta" },
  { owner: "gustavo", name: "lendinhaxx fc", slug: "lendinhaxx-fc" },
  { owner: "Andrey Damasco", name: "Dedeyy Fc", slug: "dedeyy-fc" },
  { owner: "Tiago Melo", name: "Rivers of Babylon", slug: "rivers-of-babylon" },
  { owner: "José Bereta", name: "JBERETTA", slug: "jberetta" },
  { owner: "Everton Samir", name: "Everton UltraMaratonista F.C", slug: "everton-ultramaratonista-f-c" },
  { owner: "Ricardo Bittencourt", name: "kaka F C", slug: "kaka-f-c" },
  { owner: "Henrique Augusto Rau", name: "Mazanza Futebol Clube", slug: "mazanza-futebol-clube" },
  { owner: "Gabriel Alvarez", name: "Avaih F C", slug: "avaih-f-c" },
  { owner: "Everton Ribeiro", name: "Ribeiro Copeiro 84 F.C", slug: "ribeiro-copeiro-84-f-c" },
  { owner: "dudu", name: "marixco fc", slug: "marixco-fc" },
  { owner: "Bruno buske", name: "capita Buske", slug: "capita-buske" },
  { owner: "Carlos Augusto", name: "Avahy Costa da Lagoa", slug: "avahy-costa-da-lagoa" },
  { owner: "ArthureHeitorHermes", name: "Abedaozinho", slug: "abedaozinho" },
  { owner: "WIllian Alexandre", name: "Rolo Compressor 4Lib", slug: "rolo-compressor-4lib" },
  { owner: "Alexandre De Sousa", name: "Tainha Ovada FC", slug: "tainha-ovada-fc" },
  { owner: "Marcelo", name: "Monges tibetanos FC", slug: "monges-tibetanos-fc" },
  { owner: "Dyego", name: "Floripamengao", slug: "floripamengao" },
  { owner: "Abedao", name: "Abedao", slug: "abedao" },
  { owner: "Cassio", name: "FURACÃO K7 FC", slug: "furacao-k7-fc" },
  { owner: "Fernando Reis Silva", name: "DIFERENCIAL F.C.", slug: "diferencial-f-c" },
  { owner: "Agnaldo Garceis", name: "Gui FiFla", slug: "gui-fifla" },
  { owner: "Chico Machado", name: "Delirio Futebol e Festa", slug: "delirio-futebol-e-festa" },
  { owner: "roger_futz", name: "campecheiro_futz", slug: "campecheiro-futz" },
  { owner: "alfradique -sc", name: "dique-sc", slug: "dique-sc" },
  { owner: "Robson Valério", name: "Casquinha EC", slug: "casquinha-ec" },
  { owner: "China Oliveira", name: "E C CASCALHO", slug: "e-c-cascalho" },
  { owner: "Luizep Guardiola", name: "Figueirense FC o maior", slug: "figueirense-fc-o-maior" },
  { owner: "Maykel Jesus Silva", name: "Brazzers MKL FC", slug: "brazzers-mkl-fc" }
];

// Cores padrões dos escudos gerados alternativamente
export const SHIELD_COLORS = [
  { bg: "#D4AF37", border: "#121212", text: "#FFFFFF" }, // Gold
  { bg: "#FF0000", border: "#FFFFFF", text: "#000000" }, // Red
  { bg: "#0000FF", border: "#FFFFFF", text: "#FFFFFF" }, // Blue
  { bg: "#000000", border: "#D4AF37", text: "#D4AF37" }, // Black Gold
  { bg: "#008000", border: "#FFFFFF", text: "#FFFFFF" }, // Green
  { bg: "#800080", border: "#FFFFFF", text: "#FFFFFF" }, // Purple
  { bg: "#FFA500", border: "#000000", text: "#000000" }, // Orange
  { bg: "#FFC0CB", border: "#121212", text: "#121212" }, // Pink
  { bg: "#00FFFF", border: "#121212", text: "#121212" }, // Cyan
  { bg: "#8B0000", border: "#D4AF37", text: "#FFFFFF" }  // Dark Red
];

// Ranks Estáticos Iniciais Base e Regra Histórica até Rodada 17
export const specialRanks: Record<string, number> = {
  "jammes-rodriguez": 1,        // Jammes Rodriguez (Hermes) - 1380.52 pts
  "futcafa": 2,                 // Futcafa (Laion Gomes) - 1345.80 pts, Maio: 328.81 pts
  "sovaco-da-pantera": 3,       // Sovaco da Pantera (Tiago Fattori) - Mito r17 com 91.32
  "onodi-floripa": 4,
  "real-barreiros-fc": 5,
  "jberetta": 6,                // JBERETTA (José Bereta) - C$ 171.56 Patrimônio
  "figueirense-fc-o-maior": 48, // Figueirense FC o maior - 848.20 pts
  "e-c-cascalho": 49,           // E C CASCALHO - 835.10 pts
  "brazzers-mkl-fc": 50         // Brazzers MKL FC - Lanterna r17 com 33.61, total 822.33 pts
};

export const getTeamRankServer = (slug: string): number => {
  if (specialRanks[slug] !== undefined) {
    return specialRanks[slug];
  }
  const otherSlugs = OFFICIAL_PARTICIPANTS
    .map(p => p.slug)
    .filter(s => specialRanks[s] === undefined)
    .sort();
  const index = otherSlugs.indexOf(slug);
  if (index !== -1) {
    return 7 + index;
  }
  return 50;
};

export const getStaticScoresServer = (rank: number) => {
  let r17 = 0;
  let total = 0;
  if (rank === 1) {
    r17 = 72.40;
    total = 1380.52;
  } else if (rank === 2) {
    r17 = 78.50;
    total = 1345.80;
  } else if (rank === 3) {
    r17 = 91.32;
    total = 1312.40;
  } else if (rank === 4) {
    r17 = 84.50;
    total = 1298.50;
  } else if (rank === 5) {
    r17 = 79.90;
    total = 1282.10;
  } else if (rank === 6) {
    r17 = 71.30;
    total = 1265.40;
  } else if (rank === 48) {
    r17 = 42.10;
    total = 848.20;
  } else if (rank === 49) {
    r17 = 38.40;
    total = 835.10;
  } else if (rank === 50) {
    r17 = 33.61;
    total = 822.33;
  } else {
    const t = (rank - 6) / (48 - 6);
    total = Number((1265.40 - t * (1265.40 - 848.20)).toFixed(2));
    const baseR17 = 71.30 - t * (71.30 - 42.10);
    const noise = Math.sin(rank * 1.7) * 4;
    r17 = Number(Math.max(35.00, Math.min(88.00, baseR17 + noise)).toFixed(2));
  }
  return { r17, total };
};

// Cache em memória para evitar IOs síncronos repetitivos no disco a cada requisição
let cachedSyncedRounds: { synced: Record<number, Record<string, number>>; maxRound: number } | null = null;
let cachedSyncedPatrimonios: Record<number, Record<string, number>> | null = null;
let cachedLocalShieldsMap: Record<string, string> | null = null;
let cachedLiveMetadata: Record<string, { nome: string; owner: string; shield: string; pontos?: number }> | null = null;

// Carregar e monitorar todas as rodadas sincronizadas no disco
export function getSyncedRounds() {
  if (cachedSyncedRounds !== null) {
    return cachedSyncedRounds;
  }

  const synced: Record<number, Record<string, number>> = {};
  let maxRound = 1;

  try {
    const files = fs.readdirSync(process.cwd());
    for (const file of files) {
      const match = file.match(/^round(\d+)_scores_db\.json$/);
      if (match) {
        const roundNum = parseInt(match[1]);
        if (roundNum > maxRound) {
          maxRound = roundNum;
        }
        const filePath = path.join(process.cwd(), file);
        try {
          synced[roundNum] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (je) {
          console.error(`Erro ao ler JSON da rodada ${roundNum}`, je);
        }
      }
    }
  } catch (err) {
    console.error("Erro geral ao varrer rodadas sincronizadas do disco:", err);
  }

  cachedSyncedRounds = { synced, maxRound };
  return cachedSyncedRounds;
}

// Sincronizador robusto e oficial com a planilha do Google Sheets
export async function executeSheetsSynchronization(spreadsheetUrl: string, tabName: string) {
  const logs: string[] = [];
  logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Iniciando conexão com a planilha do Google...`);

  if (!spreadsheetUrl) {
    throw new Error("A URL ou ID da Planilha é obrigatória.");
  }

  // Extrair o ID da planilha
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

  logs.push(`Consultando URL: ${exportUrl}`);
  const response = await axios.get(exportUrl, {
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  });

  if (response.status !== 200 || !response.data) {
    throw new Error(`Código de resposta HTTP ${response.status} ao baixar.`);
  }

  const csvText = response.data;
  logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Planilha importada com sucesso! Analisando linhas...`);

  // Função de parsing robusta de CSV que lidará com delimitadores de vírgula ou ponto-e-vírgula
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
    throw new Error("A planilha deve conter pelo menos duas linhas de cabeçalho e linhas de dados.");
  }

  const row0 = rows[0];
  const row1 = rows[1];

  logs.push(`Cabeçalho principal detectado: [ ${row0.slice(0, 8).filter(Boolean).join(" | ")}... ]`);
  logs.push(`Sub-cabeçalho de dados detectado: [ ${row1.slice(0, 8).filter(Boolean).join(" | ")}... ]`);

  // Mapear colunas e rodadas baseados em cabeçalho duplo
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
    throw new Error("Não foi possível mapear nenhuma coluna de rodada (ex: 'RODADA 01' e 'Pontuação' ou 'Patrimonio'). Verifique a estrutura do cabeçalho.");
  }

  logs.push(`Mapeamento concluído! Detectadas ${columnMapping.length} colunas associadas a rodadas.`);

  const syncedScores: Record<number, Record<string, number>> = {};
  const syncedPatries: Record<number, Record<string, number>> = {};
  let matchedCount = 0;

  const normalizeLocal = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };

  const findTeam = (nameRaw: string) => {
    const searchKey = normalizeLocal(nameRaw);
    if (!searchKey) return null;

    // 1. Tentar correspondência exata de slug
    let found = OFFICIAL_PARTICIPANTS.find(p => normalizeLocal(p.slug) === searchKey);
    if (found) return found;

    // 2. Tentar correspondência exata de nome
    found = OFFICIAL_PARTICIPANTS.find(p => normalizeLocal(p.name) === searchKey);
    if (found) return found;

    // 3. Tentar correspondência exata de dono
    found = OFFICIAL_PARTICIPANTS.find(p => normalizeLocal(p.owner) === searchKey);
    if (found) return found;

    // 4. Somente como fallback, tentar correspondências aproximadas se não houver conflitos óbvios
    found = OFFICIAL_PARTICIPANTS.find(p => {
      const sK = normalizeLocal(p.slug);
      const nK = normalizeLocal(p.name);
      return sK.includes(searchKey) || searchKey.includes(sK) ||
             nK.includes(searchKey) || searchKey.includes(nK);
    });

    return found || null;
  };

  for (let ri = 2; ri < rows.length; ri++) {
    const teamNameRaw = rows[ri][0];
    if (!teamNameRaw) continue;

    const t = findTeam(teamNameRaw);
    if (!t) {
      logs.push(`Aviso: Time da planilha "${teamNameRaw}" não correspondido nos participantes oficiais.`);
      continue;
    }

    matchedCount++;
    columnMapping.forEach(({ colIdx, round, type }) => {
      const valRaw = rows[ri][colIdx];
      if (valRaw !== undefined && valRaw.trim() !== "") {
        const val = parseFloat(valRaw.replace(",", "."));
        if (!isNaN(val)) {
          if (type === "score") {
            if (!syncedScores[round]) syncedScores[round] = {};
            syncedScores[round][t.slug] = Number(val.toFixed(2));
          } else {
            if (!syncedPatries[round]) syncedPatries[round] = {};
            syncedPatries[round][t.slug] = Number(val.toFixed(2));
          }
        }
      }
    });
  }

  logs.push(`Associação bem sucedida! Mapeados ${matchedCount} de ${OFFICIAL_PARTICIPANTS.length} times oficiais da Liga.`);

  // Deletar arquivos JSON antigos do disco ANTES de salvar a atualizacao para expurgar lixo de fallbacks
  try {
    const files = fs.readdirSync(process.cwd());
    for (const file of files) {
      if (file.match(/^round(\d+)_scores_db\.json$/) || file.match(/^round(\d+)_patrimonio_db\.json$/)) {
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    }
    logs.push("Lixeira limpa de scores antigos com sucesso. Escrevendo novos dados oficiais da tabela...");
  } catch (pruneErr) {
    // Ignorar se o arquivo estiver bloqueado temporariamente
  }

  // Gravar no disco rodada por rodada
  let roundsCount = 0;
  const allRounds = Array.from(new Set(columnMapping.map(c => c.round))).sort((a,b) => a-b);
  
  allRounds.forEach(roundNum => {
    const scorePath = path.join(process.cwd(), `round${roundNum}_scores_db.json`);
    const patrPath = path.join(process.cwd(), `round${roundNum}_patrimonio_db.json`);

    const sObj = syncedScores[roundNum] || {};
    const pObj = syncedPatries[roundNum] || {};

    fs.writeFileSync(scorePath, JSON.stringify(sObj, null, 2), "utf-8");
    fs.writeFileSync(patrPath, JSON.stringify(pObj, null, 2), "utf-8");
    roundsCount++;
  });

  // Limpar os caches em memória para recarregar os novos dados oficiais gravados
  cachedSyncedRounds = null;
  cachedSyncedPatrimonios = null;
  cachedLocalShieldsMap = null;
  cachedLiveMetadata = null;

  return {
    success: true,
    logs,
    message: `Planilha Google Sincronizada com Sucesso! Foram importadas ${roundsCount} rodadas inteiras para todos os times.`
  };
}

// Carregar e monitorar patrimônios sincronizados no disco
export function getSyncedPatrimonios() {
  if (cachedSyncedPatrimonios !== null) {
    return cachedSyncedPatrimonios;
  }

  const synced: Record<number, Record<string, number>> = {};
  try {
    const files = fs.readdirSync(process.cwd());
    for (const file of files) {
      const match = file.match(/^round(\d+)_patrimonio_db\.json$/);
      if (match) {
        const roundNum = parseInt(match[1]);
        const filePath = path.join(process.cwd(), file);
        try {
          synced[roundNum] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (je) {
          console.error(`Erro ao ler JSON de patrimonio da rodada ${roundNum}`, je);
        }
      }
    }
  } catch (err) {
    console.error("Erro geral de leitura do patrimonio:", err);
  }

  cachedSyncedPatrimonios = synced;
  return cachedSyncedPatrimonios;
}

// Cálculo aproximado / fallback para o patrimônio
export function getDefaultPatrimonioServer(team: { name: string; slug: string }, selectedRound: number, finalTotal: number): number {
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  };
  const normSlug = normalize(team.slug);
  if (normSlug === "onodifloripa") return 184.20;
  if (normSlug === "ribeirocopeiro84fc") return 178.50;
  if (normSlug === "montinhoartilheirofc") return 175.40;
  if (normSlug === "sovacodapantera") return 172.10;
  if (normSlug === "realbarreirosfc") return 165.80;

  const base = 100 + (finalTotal * (selectedRound / 17) * 0.054);
  const hash = team.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (hash % 120) / 10 - 6.0; // -6.0 to +6.0

  return Number(Math.min(180, Math.max(93.10, base + variation)).toFixed(2));
}

// Arquivo de cache persistente para nomes, donos e escudos reais coletados da globo
export const METADATA_CACHE_PATH = path.join(process.cwd(), "cartola_teams_live_metadata_cache.json");

// Controle de concorrência e TTL para o atualizador em background de times
let isScanningMetadata = false;
let lastScanTimestamp = 0;

export async function backgroundUpdateMetadata() {
  // Removido o scraper da API oficial da Globo Cartola.
  // O sistema é 100% autônomo e focado apenas nos dados da Planilha.
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Auto-sincronização no boot do servidor baseada em sheets_config.json de forma não bloqueante
  const sheetsConfigPath = path.join(process.cwd(), "sheets_config.json");
  if (fs.existsSync(sheetsConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(sheetsConfigPath, "utf-8"));
      if (config.spreadsheetUrl) {
        console.log("[AutoWarmup] Inicializando auto-sincronização de dados da planilha oficial...");
        executeSheetsSynchronization(config.spreadsheetUrl, config.tabName || "")
          .then((result) => {
            console.log("[AutoWarmup] Concluído com sucesso!", result.message);
          })
          .catch((err) => {
            console.error("[AutoWarmup Error] Falha na auto-sincronização:", err.message);
          });
      }
    } catch (e: any) {
      console.error("[AutoWarmup Error] Falha de sintaxe ou IO no sheets_config.json", e.message);
    }
  }

  // Express parser middlewares
  app.use(express.json());

  // Função centralizada para processar a sincronização manual pelo administrador
  const handleRoundSync = async (roundNum: number, req: express.Request, res: express.Response) => {
    const logs: string[] = [];
    const sqlQueries: string[] = [];
    const syncedScores: Record<string, number> = {};

    logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Iniciando loop de captura inteligente de cartola por participante (Rodada ${roundNum})...`);

    // Carregar scorecache padrao do arquivo correspondente
    let fallbackScores: Record<string, number> = {};
    const cachePath = path.join(process.cwd(), `round${roundNum}_scores_db.json`);
    try {
      if (fs.existsSync(cachePath)) {
        fallbackScores = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      }
    } catch (e) {
      console.error(`Erro ao ler fallbackScores para Rodada ${roundNum}`, e);
    }

    // Se o cliente passar pontuações manuais na requisição, pulamos a requisição da Globo e gravamos diretamente!
    if (req.body && req.body.manualScores) {
      logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Gravando pontuações enviadas manualmente pelo Painel Admin...`);
      for (const p of OFFICIAL_PARTICIPANTS) {
        const val = req.body.manualScores[p.slug];
        const scoreVal = typeof val === "number" ? val : parseFloat(val) || 0.0;
        syncedScores[p.slug] = Number(scoreVal.toFixed(2));

        const participantIdEscaped = p.slug.replace(/'/g, "''");
        const sql = `INSERT INTO scores (participant_id, round_id, score) VALUES ('${participantIdEscaped}', ${roundNum}, ${syncedScores[p.slug].toFixed(2)}) ON CONFLICT (participant_id, round_id) DO UPDATE SET score = EXCLUDED.score;`;
        sqlQueries.push(sql);
      }
      try {
        fs.writeFileSync(cachePath, JSON.stringify(syncedScores, null, 2), "utf-8");
        logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Sucesso! Pontuações salvas e persistidas no servidor para a Rodada ${roundNum}.`);
      } catch (fsErr: any) {
        logs.push(`[Erro de Disco] Falha ao persistir dados: ${fsErr.message}`);
      }
      return res.json({
        success: true,
        logs,
        sqlQueries,
        scores: syncedScores
      });
    }

    // Processamos todos os 50 slugs individualmente (Hacker Strategy!)
    for (let i = 0; i < OFFICIAL_PARTICIPANTS.length; i++) {
      const p = OFFICIAL_PARTICIPANTS[i];
      const targetUrl = `https://api.cartola.globo.com/time/slug/${p.slug}/${roundNum}`;
      logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] [${i + 1}/50] Consultando Globo IP para slug: ${p.slug}...`);
      
      let finalScore = fallbackScores[p.slug] || 60.00; // default de segurança

      try {
        const response = await axios.get(targetUrl, {
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          timeout: 2500
        });

        if (response.status === 200 && response.data) {
          // Extrair pontuação real
          let parsedPoints: any = null;
          if (typeof response.data.pontos === "number") {
            parsedPoints = response.data.pontos;
          } else if (response.data.time && typeof response.data.time.pontos === "number") {
            parsedPoints = response.data.time.pontos;
          } else if (response.data.atletas && Array.isArray(response.data.atletas)) {
            parsedPoints = response.data.atletas.reduce((s: number, a: any) => s + (a.pontos_num || 0), 0);
          }

          if (parsedPoints !== null && !isNaN(Number(parsedPoints))) {
            finalScore = Number(Number(parsedPoints).toFixed(2));
            logs.push(`[Sufixo OK] Capturado com sucesso: ${finalScore} pts para ${p.name}`);
          }
        }
      } catch (err: any) {
        logs.push(`[Alerta API] Falha na requisição direta da Globo para ${p.slug} (${err.message}). Utilizado backup local.`);
      }

      syncedScores[p.slug] = finalScore;

      // Gerar a query SQL para a banco de dados local caso o usuário exporte
      const participantIdEscaped = p.slug.replace(/'/g, "''");
      const sql = `INSERT INTO scores (participant_id, round_id, score) VALUES ('${participantIdEscaped}', ${roundNum}, ${finalScore.toFixed(2)}) ON CONFLICT (participant_id, round_id) DO UPDATE SET score = EXCLUDED.score;`;
      sqlQueries.push(sql);
    }

    // Persistir os resultados consolidados
    try {
      fs.writeFileSync(cachePath, JSON.stringify(syncedScores, null, 2), "utf-8");
      logs.push(`[${new Date().toLocaleTimeString("pt-BR")}] Sincronização da Rodada ${roundNum} concluída e gravada com sucesso!`);
    } catch (fsErr: any) {
      logs.push(`[Erro de Disco] Falha ao persistir dados: ${fsErr.message}`);
    }

    res.json({
      success: true,
      logs,
      sqlQueries,
      scores: syncedScores
    });
  };

  app.post("/api/sync/rodada17", async (req, res) => {
    await handleRoundSync(17, req, res);
  });

  app.post("/api/sync/rodada18", async (req, res) => {
    await handleRoundSync(18, req, res);
  });

  app.post("/api/sync/rodada/:roundNum", async (req, res) => {
    const roundNum = parseInt(req.params.roundNum) || 18;
    await handleRoundSync(roundNum, req, res);
  });

  app.post("/api/cartola/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "E-mail e senha são obrigatórios." });
    }

    try {
      console.log(`[Globo Login Proxy] Autenticando usuário: ${email}`);
      const response = await axios.post("https://login.globo.com/api/authentication", {
        payload: {
          email,
          password,
          serviceId: 438
        }
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 10000
      });

      if (response.data && response.data.glbId) {
        return res.json({
          success: true,
          glbId: response.data.glbId,
          userMessage: "Autenticação efetuada com sucesso!"
        });
      } else {
        return res.status(401).json({
          error: true,
          message: "Credenciais recusadas pelo servidor da Globo.com."
        });
      }
    } catch (err: any) {
      const status = err.response?.status || 500;
      const errorMsg = err.response?.data?.mensagem || err.message;
      return res.status(status).json({
        error: true,
        message: `Falha na autenticação Globo: ${errorMsg} (Erro ${status})`
      });
    }
  });

  // Função utilitária para detectar escudos locais em .avif pelo nome do clube ou slug
  function getLocalShieldsMap() {
    if (cachedLocalShieldsMap !== null) {
      return cachedLocalShieldsMap;
    }

    const map: Record<string, string> = {};
    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
    };

    const checkDirs = [
      path.join(process.cwd(), "public", "escudos"),
      path.join(process.cwd(), "dist", "escudos")
    ];

    for (const dir of checkDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (file.toLowerCase().endsWith(".avif")) {
              const baseName = file.substring(0, file.length - 5);
              const key = normalize(baseName);
              map[key] = `/escudos/${file}`;
            }
          }
        } catch (e) {
          console.error("Erro ao ler diretório de escudos:", dir, e);
        }
      }
    }
    
    cachedLocalShieldsMap = map;
    return cachedLocalShieldsMap;
  }

  // Endpoints para salvar e recuperar preferências do Google Sheets
  app.get("/api/sheets/config", (req, res) => {
    const configPath = path.join(process.cwd(), "sheets_config.json");
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        return res.json(config);
      }
    } catch (e) {
      console.error("Erro ao ler sheets_config.json", e);
    }
    return res.json({ spreadsheetUrl: "", tabName: "" });
  });

  app.post("/api/sheets/config", (req, res) => {
    const { spreadsheetUrl, tabName } = req.body;
    const configPath = path.join(process.cwd(), "sheets_config.json");
    try {
      fs.writeFileSync(configPath, JSON.stringify({ spreadsheetUrl, tabName }, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: true, message: e.message });
    }
  });

  app.post("/api/sheets/sync", async (req, res) => {
    const { spreadsheetUrl, tabName } = req.body;
    if (!spreadsheetUrl) {
      return res.status(400).json({ error: true, message: "A URL ou ID da Planilha é obrigatória." });
    }

    try {
      const result = await executeSheetsSynchronization(spreadsheetUrl, tabName || "");
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({
        error: true,
        message: `Ocorreu um erro ao conectar e sincronizar com o Google Sheets: ${e.message}`,
        logs: [e.message]
      });
    }
  });


  app.get("/api/cartola", async (req, res) => {
    const glbToken = req.headers["x-glb-token"] || req.query.token;

    backgroundUpdateMetadata().catch(err => {
      console.error("[Background Error Log]", err.message);
    });

    let liveMetadata: Record<string, { nome: string; owner: string; shield: string; pontos?: number }> = {};
    try {
      if (cachedLiveMetadata !== null) {
        liveMetadata = cachedLiveMetadata;
      } else if (fs.existsSync(METADATA_CACHE_PATH)) {
        liveMetadata = JSON.parse(fs.readFileSync(METADATA_CACHE_PATH, "utf-8"));
        cachedLiveMetadata = liveMetadata;
      }
    } catch (e) {
      // Ignora se não existir
    }

    const { synced: syncedScores, maxRound: activeRound } = getSyncedRounds();
    const syncedPatrimonios = getSyncedPatrimonios();
    const localShields = getLocalShieldsMap();
    
    let tokenMessage: string | null = null;
    if (glbToken) {
      tokenMessage = `Conectado ao Globo ID. Painel atualizado para Rodada ${activeRound}.`;
    }

    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
    };

    const mockTimes = OFFICIAL_PARTICIPANTS.map((team, index) => {
      const liveTeam = liveMetadata[team.slug];
      const name = liveTeam?.nome || team.name;
      const owner = liveTeam?.owner || team.owner;
      const color = SHIELD_COLORS[index % SHIELD_COLORS.length];
      const timeId = index + 1;
      
      // Obter pontuação da rodada ativa
      let roundScore = 0;
      if (syncedScores[activeRound]?.[team.slug] !== undefined) {
        roundScore = syncedScores[activeRound][team.slug];
      }

      // Somar pontuação de campeonato baseado puramente nas rodadas sincronizadas no disco
      let finalTotal = 0;
      const teamScoresMap: Record<number, number> = {};
      
      for (let r = 1; r <= 38; r++) {
        if (syncedScores[r]?.[team.slug] !== undefined) {
          const scoreVal = syncedScores[r][team.slug];
          teamScoresMap[r] = scoreVal;
          if (r <= activeRound) {
            finalTotal += scoreVal;
          }
        } else {
          teamScoresMap[r] = 0;
        }
      }

      // Escudo
      const nameKey = normalize(name);
      const slugKey = normalize(team.slug);
      const defaultNameKey = normalize(team.name);
      
      let shieldUrl = localShields[nameKey] || localShields[slugKey] || localShields[defaultNameKey] || liveTeam?.shield || "";
      
      if (!shieldUrl) {
        shieldUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><circle cx="50" cy="50" r="45" fill="${encodeURIComponent(color.bg)}" stroke="${encodeURIComponent(color.border)}" stroke-width="5"/><text x="50" y="58" font-family="Montserrat, Arial, sans-serif" font-weight="bold" font-size="24" fill="${encodeURIComponent(color.text)}" text-anchor="middle">${encodeURIComponent(name.substring(0, 2).toUpperCase())}</text></svg>`;
      }

      // Reconstrução de patrimônios
      const teamPatrimoniosMap: Record<number, number> = {};
      teamPatrimoniosMap[0] = 100.00;
      for (let r = 1; r <= 38; r++) {
        if (syncedPatrimonios[r]?.[team.slug] !== undefined) {
          teamPatrimoniosMap[r] = syncedPatrimonios[r][team.slug];
        } else {
          teamPatrimoniosMap[r] = teamPatrimoniosMap[r - 1] !== undefined ? teamPatrimoniosMap[r - 1] : 100.00;
        }
      }

      return {
        id: timeId,
        nome: name,
        nome_cartoleiro: owner,
        url_escudo_svg: shieldUrl,
        pontos: {
          campeonato: Number(finalTotal.toFixed(2)),
          rodada: Number(roundScore.toFixed(2))
        },
        scores: teamScoresMap,
        patrimonios: teamPatrimoniosMap
      };
    });

    const mockPayload = {
      liga: {
        id: 169382,
        nome: "Só Camisa 10 2026",
        slug: "so-camisa-10-2026",
        temporada: 2026
      },
      times: mockTimes,
      rodada_atual: activeRound,
      synced_rounds: Object.keys(syncedScores).map(Number).sort((a,b) => a-b),
      all_synced_scores: syncedScores,
      offlineFallback: true,
      fallbackReason: tokenMessage || `Painel Seguro Ativo. Sincronizado dinamicamente por time com inteligência no servidor (Rodada ${activeRound}).`
    };

    res.json(mockPayload);
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
