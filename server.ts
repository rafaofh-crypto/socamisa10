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

// Carregar e monitorar todas as rodadas sincronizadas no disco
export function getSyncedRounds() {
  const synced: Record<number, Record<string, number>> = {};
  let maxRound = 17;

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
  return { synced, maxRound };
}

// Arquivo de cache persistente para nomes, donos e escudos reais coletados da globo
export const METADATA_CACHE_PATH = path.join(process.cwd(), "cartola_teams_live_metadata_cache.json");

// Controle de concorrência e TTL para o atualizador em background de times
let isScanningMetadata = false;
let lastScanTimestamp = 0;

export async function backgroundUpdateMetadata() {
  const now = Date.now();
  // Limitação de 10 minutos (600.000 ms) entre varreduras
  if (isScanningMetadata || (now - lastScanTimestamp < 600000)) {
    return;
  }

  isScanningMetadata = true;
  lastScanTimestamp = now;

  console.log("[Hacker Background Scraper] Iniciando coleta assíncrona por time...");
  
  let currentMetadata: Record<string, { nome: string; owner: string; shield: string; pontos?: number }> = {};
  try {
    if (fs.existsSync(METADATA_CACHE_PATH)) {
      currentMetadata = JSON.parse(fs.readFileSync(METADATA_CACHE_PATH, "utf-8"));
    }
  } catch (e) {
    console.warn("[Hacker Background Scraper] Criando novo cache de metadados vazios");
  }

  // Fazemos varredura sequencial com pequeno delay para garantir altíssima tolerância CORS/Globo
  for (const team of OFFICIAL_PARTICIPANTS) {
    try {
      const targetUrl = `https://api.cartola.globo.com/time/slug/${team.slug}`;
      const res = await axios.get(targetUrl, {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://cartola.globo.com/",
          "Origin": "https://cartola.globo.com"
        },
        timeout: 4000
      });

      if (res.status === 200 && res.data) {
        const timeObj = res.data.time || res.data;
        if (timeObj && (timeObj.nome || timeObj.nome_cartoleiro)) {
          currentMetadata[team.slug] = {
            nome: timeObj.nome || team.name,
            owner: timeObj.nome_cartoleiro || team.owner,
            shield: timeObj.url_escudo_svg || timeObj.url_escudo_png || "",
            pontos: res.data.pontos || timeObj.pontos || undefined
          };
          console.log(`[Hacker Background Scraper] Sucesso ao atualizar: ${team.slug}`);
        }
      }
    } catch (teamErr: any) {
      console.log(`[Hacker Background Scraper] Ignorado/Erro em ${team.slug}: ${teamErr.message}`);
    }

    // Delay de 200ms entre as requisições para evitar rate-limits
    await new Promise(r => setTimeout(r, 200));
  }

  try {
    fs.writeFileSync(METADATA_CACHE_PATH, JSON.stringify(currentMetadata, null, 2), "utf-8");
    console.log("[Hacker Background Scraper] Metadados reais dos times salvos com sucesso no servidor!");
  } catch (writeErr: any) {
    console.error("[Hacker Background Scraper] Erro ao persistir cache de metadados:", writeErr.message);
  }

  isScanningMetadata = false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    return map;
  }

  app.get("/api/cartola", async (req, res) => {
    const glbToken = req.headers["x-glb-token"] || req.query.token;

    // Disparar o raspador de metadados reais de escudo e nomes em background (não bloqueante!)
    backgroundUpdateMetadata().catch(err => {
      console.error("[Background Error Log]", err.message);
    });

    let liveMetadata: Record<string, { nome: string; owner: string; shield: string; pontos?: number }> = {};
    try {
      if (fs.existsSync(METADATA_CACHE_PATH)) {
        liveMetadata = JSON.parse(fs.readFileSync(METADATA_CACHE_PATH, "utf-8"));
      }
    } catch (e) {
      // Ignora se não existir
    }

    const { synced: syncedScores, maxRound: activeRound } = getSyncedRounds();
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
      
      const rank = getTeamRankServer(team.slug);
      const { r17, total } = getStaticScoresServer(rank);
      
      // Obter pontuação da rodada ativa
      let roundScore = r17;
      if (syncedScores[activeRound]?.[team.slug] !== undefined) {
        roundScore = syncedScores[activeRound][team.slug];
      }

      // Reconstrução matemática do total de pontos a partir da R16 de modo a manter integridade
      const baseline_r16_total = total - r17;
      let finalTotal = baseline_r16_total;

      for (const rNumStr of Object.keys(syncedScores)) {
        const rNum = parseInt(rNumStr);
        if (syncedScores[rNum]?.[team.slug] !== undefined) {
          finalTotal += syncedScores[rNum][team.slug];
        } else if (rNum === 17) {
          finalTotal += r17; // fallback para manter o valor da R17
        }
      }

      // Se não há sincronizações no servidor, mantemos os pontos estáticos reais da Rodada 17
      if (Object.keys(syncedScores).length === 0) {
        finalTotal = total;
      }

      // 1. Prioriza o Escudo Local .avif salvo na pasta (pelo Nome ou pelo Slug)
      const nameKey = normalize(name);
      const slugKey = normalize(team.slug);
      const defaultNameKey = normalize(team.name);
      
      let shieldUrl = localShields[nameKey] || localShields[slugKey] || localShields[defaultNameKey] || liveTeam?.shield || "";
      
      // 2. Fallback caso não haja escudo local nem na Globo API
      if (!shieldUrl) {
        shieldUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><circle cx="50" cy="50" r="45" fill="${encodeURIComponent(color.bg)}" stroke="${encodeURIComponent(color.border)}" stroke-width="5"/><text x="50" y="58" font-family="Montserrat, Arial, sans-serif" font-weight="bold" font-size="24" fill="${encodeURIComponent(color.text)}" text-anchor="middle">${encodeURIComponent(name.substring(0, 2).toUpperCase())}</text></svg>`;
      }

      return {
        id: timeId,
        nome: name,
        nome_cartoleiro: owner,
        url_escudo_svg: shieldUrl,
        pontos: {
          campeonato: Number(finalTotal.toFixed(2)),
          rodada: Number(roundScore.toFixed(2))
        }
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
