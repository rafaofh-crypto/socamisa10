import { Team, TournamentCalendarEntry } from "./types";
import { CartolaTeam } from "./services/cartollaApi";

// ==================== CALENDAR MOTOR ==================== //
/**
 * Retorna o calendário oficial unificado das Copas M10 e B10
 * com status dinâmicos baseados na rodada atual de análise.
 */
export function getTournamentCalendar(currentRound: number): TournamentCalendarEntry[] {
  const calendarTemplate = [
    {
      round: 19,
      generalEvent: "Final do Turno (Histórico)",
      copaM10: {
        phase: "Histórico",
        description: "Fim do Primeiro Turno - Preparação para o Início da Copa M10",
        rules: "Resultado e classificação geral consolidados."
      },
      copaB10: {
        phase: "Histórico",
        description: "Fim do Primeiro Turno - Preparação para o Planejamento",
        rules: "Resultado e classificação geral consolidados."
      }
    },
    {
      round: 20,
      copaM10: {
        phase: "Fase 1 (Corte)",
        description: "Fase de Corte (Jogo Único) - 50 times reduzem para 46 classificados diretos + 4 no limbo.",
        rules: "Os 46 melhores avançam diretamente. Times do 47º ao 50º lugar vão para o Limbo da Rodada do Esperneio. Os 12 primeiros garantem cabeças de chave permanentes."
      },
      copaB10: {
        phase: "Inativa / Planejamento",
        description: "Aguardando Fase de Corte oficial na Rodada 25",
        rules: "O ranking acumulado serve de preparação de sementes para o funil principal."
      }
    },
    {
      round: 21,
      copaM10: {
        phase: "Rodada do Esperneio",
        description: "Rodada do Esperneio (Jogo Único) - Os 4 times do limbo competem diretamente por 2 vagas.",
        rules: "Disputa exclusiva entre 47º e 50º colocados. Os 2 melhores asseguram as vagas 47 e 48 do chaveamento e se tornam 'Sobreviventes do Esperneio', travados no ranking final."
      },
      copaB10: {
        phase: "Inativa / Planejamento",
        description: "Aguardando Fase de Corte oficial na Rodada 25",
        rules: "Preparação das sementes de acesso."
      }
    },
    {
      round: 22,
      copaM10: {
        phase: "Fase 2: Grupos (Rodada 1)",
        description: "Fase de Grupos - Rodada Inicial (12 grupos de 4 times).",
        rules: "Grupos de A a L. Confrontos diretos computados em pontos corridos de 3 rodadas."
      },
      copaB10: {
        phase: "Inativa",
        description: "Aguardando início na Rodada 25",
        rules: "Preparação de sementes."
      }
    },
    {
      round: 23,
      copaM10: {
        phase: "Fase 2: Grupos (Rodada 2)",
        description: "Fase de Grupos - Rodada Intermediária.",
        rules: "Segunda rodada dos confrontos de grupos."
      },
      copaB10: {
        phase: "Inativa",
        description: "Aguardando início na Rodada 25",
        rules: "Preparação de sementes."
      }
    },
    {
      round: 24,
      copaM10: {
        phase: "Fase 2: Grupos (Rodada 3)",
        description: "Fase de Grupos - Decisão e Classificação Final.",
        rules: "Definição dos classificados (1º e 2º lugares de cada grupo + 8 melhores 3º colocados para o Round of 32)."
      },
      copaB10: {
        phase: "Inativa",
        description: "Aguardando início na Rodada 25",
        rules: "Preparação de sementes."
      }
    },
    {
      round: 25,
      copaM10: {
        phase: "Round of 32",
        description: "Mata-mata Principal - Jogo Único.",
        rules: "Os 32 melhores classificados da Fase de Grupos se enfrentam em confrontos eliminatórios de jogo único."
      },
      copaB10: {
        phase: "Fase 1 (Corte)",
        description: "Corte (Jogo Único) - Mapeamento para Elite, Acesso e Repescagem.",
        rules: "Do 1º ao 16º avançam à Fase 4 (Elite direto). Do 17º ao 46º avançam ao Play-offs (Fase 3). Do 47º ao 50º vão para a Repescagem (Fase 2)."
      }
    },
    {
      round: 26,
      copaM10: {
        phase: "Oitavas de Final",
        description: "Mata-mata - Oitavas (Jogo Único).",
        rules: "Os 16 vencedores duelam em partida única."
      },
      copaB10: {
        phase: "Rodada do Esperneio",
        description: "Esperneio (Jogo Único) - Repescagem preliminar de sobrevivência.",
        rules: "Os 4 times da repescagem jogam em rodada única; apenas os melhores continuam na copa B10."
      }
    },
    {
      round: 27,
      copaM10: {
        phase: "Quartas de Final",
        description: "Mata-mata - Quartas (Jogo Único).",
        rules: "Os 8 vencedores duelam em partida única para o G4."
      },
      copaB10: {
        phase: "Fase 2 (Repescagem) - Ida",
        description: "Repescagem do Acesso - Jogo de Ida.",
        rules: "Confrontos de ida para os times em recuperação."
      }
    },
    {
      round: 28,
      copaM10: {
        phase: "Semifinal",
        description: "Mata-mata - Semifinais (Jogo Único).",
        rules: "Penúltima etapa definindo os postulantes ao título do Mundo."
      },
      copaB10: {
        phase: "Fase 2 (Repescagem) - Volta",
        description: "Repescagem do Acesso - Jogo de Volta (Acumulado de 2 Rodadas).",
        rules: "Soma das notas das Rodadas 27 e 28. O vencedor agregado sobrevive no certame."
      }
    },
    {
      round: 29,
      copaM10: {
        phase: "Super Final & 3º Lugar",
        description: "Grande Final Mundial & Decisão do 3º Lugar (Jogo Único).",
        rules: "Os dois gigantes finalistas se enfrentam na rodada de gala da Copa M10. Decisão simultânea do 3º lugar."
      },
      copaB10: {
        phase: "Fase 3 (Play-offs)",
        description: "Play-offs do Acesso (Jogo Único).",
        rules: "Confrontos de morte súbita definindo os guerreiros que avançam à Fase 4."
      }
    },
    {
      round: 30,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída com Sucesso",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 4 (Round of 32)",
        description: "Mata-mata Central B10 - Jogo Único.",
        rules: "Chaveamento principal de 32 clubes em partida de caráter eliminatório único."
      }
    },
    {
      round: 31,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 5 (Oitavas de Final) - Ida",
        description: "Fases de Elite - Oitavas de Final (Ida).",
        rules: "Início do modelo híbrido ida e volta com vantagem regulamentar."
      }
    },
    {
      round: 32,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 5 (Oitavas de Final) - Volta",
        description: "Fases de Elite - Oitavas de Final (Volta).",
        rules: "Decisão das vagas nas quartas no modelo híbrido."
      }
    },
    {
      round: 33,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 6 (Quartas de Final) - Ida",
        description: "Fases de Elite - Quartas de Final (Ida).",
        rules: "Início dos embates das quartas no modelo híbrido."
      }
    },
    {
      round: 34,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 6 (Quartas de Final) - Volta",
        description: "Fases de Elite - Quartas de Final (Volta).",
        rules: "Preenchimento do quadro de semifinalistas."
      }
    },
    {
      round: 35,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 7 (Semifinal) - Ida",
        description: "Fases de Elite - Semifinais (Ida).",
        rules: "Ida das semifinais."
      }
    },
    {
      round: 36,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Fase 7 (Semifinal) - Volta",
        description: "Fases de Elite - Semifinais (Volta).",
        rules: "Decisão de quem avança para a Supercopa Brasil."
      }
    },
    {
      round: 37,
      copaM10: {
        phase: "Finalizada",
        description: "Copa M10 Concluída",
        rules: "Campeão consagrado."
      },
      copaB10: {
        phase: "Super Final & 3º Lugar",
        description: "Decisão do Título B10 & 3º Lugar (Jogo Único).",
        rules: "Decisão da coroa nacional em partida única."
      }
    },
    {
      round: 38,
      generalEvent: "Gala de Encerramento e Entrega de Prêmios",
      copaM10: {
        phase: "Bloqueio de Copas",
        description: "Copa M10 Encerrada - Foco no Gala do Ranking Geral",
        rules: "Bloqueio completo de Copas. Rodada sem novos jogos das competições mata-mata."
      },
      copaB10: {
        phase: "Bloqueio de Copas",
        description: "Copa B10 Encerrada - Foco no Gala do Ranking Geral",
        rules: "Bloqueio completo de Copas. Visualização dos campeões gerais e premiações."
      }
    }
  ];

  return calendarTemplate.map((item) => {
    // Determine dynamic status
    let statusM10: "upcoming" | "active" | "completed" | "historical" | "inactive" = "upcoming";
    let statusB10: "upcoming" | "active" | "completed" | "historical" | "inactive" = "upcoming";

    // Dynamic assignments for Copa M10
    if (item.round === 19) {
      statusM10 = "historical";
    } else if (item.copaM10.phase === "Inativa" || item.copaM10.phase === "Inativa / Planejamento") {
      statusM10 = "inactive";
    } else if (item.round < currentRound) {
      statusM10 = "completed";
    } else if (item.round === currentRound) {
      statusM10 = "active";
    } else {
      statusM10 = "upcoming";
    }

    // Dynamic assignments for Copa B10
    if (item.round === 19) {
      statusB10 = "historical";
    } else if (item.copaB10.phase === "Inativa" || item.copaB10.phase === "Inativa / Planejamento") {
      statusB10 = "inactive";
    } else if (item.round < currentRound) {
      statusB10 = "completed";
    } else if (item.round === currentRound) {
      statusB10 = "active";
    } else {
      statusB10 = "upcoming";
    }

    return {
      round: item.round,
      generalEvent: item.generalEvent,
      copaM10: {
        ...item.copaM10,
        status: statusM10
      },
      copaB10: {
        ...item.copaB10,
        status: statusB10
      }
    };
  });
}

// ==================== CONFIGURATION CONSTANTS ==================== //
export const GROUP_COUNT = 12;
export const TEAMS_PER_GROUP = 4;
export const TOTAL_TEAMS = GROUP_COUNT * TEAMS_PER_GROUP; // 48
export const MAX_QUALIFYING = 4;
export const DIRECT_QUALIFYING_POSITIONS = [1, 2];
export const THIRD_PLACE_POSITION = 3;
export const BEST_THIRD_COUNT = 8;

export const PHASES = {
  ROUND_OF_16: 'round_of_16',
  QUARTER_FINALS: 'quarter_finals',
  SEMI_FINALS: 'semi_finals',
  THIRD_PLACE: 'third_place',
  FINAL: 'final'
};

export const ALLOWED_POSITIONS = [1, 2, 3, 4];
export const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('');

// ==================== MATCH MATRICES ==================== //
export const R16_MATCH_MATRIX = {
  M77: { home: 'A', away: 'C' },
  M80: { home: 'D', away: 'F' },
  M82: { home: 'G', away: 'I' },
  M87: { home: 'J', away: 'L' }
};

export const THIRD_PLACE_MATRIX = {
  M77: { groups: ['A', 'B', 'C', 'D'] },
  M80: { groups: ['E', 'F', 'G', 'H'] },
  M82: { groups: ['I', 'J', 'K', 'L'] },
  M87: { groups: ['A', 'B', 'C', 'D'] }
};

/**
 * Prints all values of the constants to the console and returns them as a structured string for display.
 */
export function logConstants(): string {
  const logLines: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logLines.push(msg);
  };

  log("=== CONFIGURATION CONSTANTS ===");
  log(`GROUP_COUNT: ${GROUP_COUNT}`);
  log(`TEAMS_PER_GROUP: ${TEAMS_PER_GROUP}`);
  log(`TOTAL_TEAMS: ${TOTAL_TEAMS}`);
  log(`MAX_QUALIFYING: ${MAX_QUALIFYING}`);
  log(`DIRECT_QUALIFYING_POSITIONS: [${DIRECT_QUALIFYING_POSITIONS.join(", ")}]`);
  log(`THIRD_PLACE_POSITION: ${THIRD_PLACE_POSITION}`);
  log(`BEST_THIRD_COUNT: ${BEST_THIRD_COUNT}`);
  log("\n=== PHASES ===");
  log(JSON.stringify(PHASES, null, 2));
  log("\n=== ALLOWED_POSITIONS ===");
  log(`[${ALLOWED_POSITIONS.join(", ")}]`);
  log("\n=== GROUP_LETTERS ===");
  log(`[${GROUP_LETTERS.join(", ")}]`);
  log("\n=== R16_MATCH_MATRIX ===");
  log(JSON.stringify(R16_MATCH_MATRIX, null, 2));
  log("\n=== THIRD_PLACE_MATRIX ===");
  log(JSON.stringify(THIRD_PLACE_MATRIX, null, 2));
  log("=================================");

  return logLines.join("\n");
}

/**
 * Exemplar Team object conforming to the typedef.
 */
export const exampleTeam: Team = {
  name: "Só Camisa 10 FC",
  group: 0, // Grupo A (índice 0)
  position: 1, // 1º lugar no grupo
  points: 9, // Ganhou os 3 jogos
  goalDifference: 6, // Saldo de gols
  goalsFor: 8, // Gols marcados
  qualifyingPosition: 1, // Qualificação geral do torneio
  originalIndex: 0 // Índice original de cadastro
};

/**
 * Validates whether an object is a Team conforming to the specs.
 * Checks for presence and correct typing of all properties.
 */
export function validateTeam(obj: any): {
  isValid: boolean;
  fields: { [key in keyof Team]: { present: boolean; type: string; valid: boolean } };
} {
  const fieldsSpec: { [key in keyof Team]: "string" | "number" } = {
    name: "string",
    group: "number",
    position: "number",
    points: "number",
    goalDifference: "number",
    goalsFor: "number",
    qualifyingPosition: "number",
    originalIndex: "number"
  };

  const fields: any = {};
  let isValid = true;

  for (const key in fieldsSpec) {
    const expectedType = fieldsSpec[key as keyof Team];
    const val = obj?.[key];
    const present = val !== undefined && val !== null;
    const currentType = typeof val;
    const typeValid = present && currentType === expectedType;

    // Additional range constraints if applicable
    let rangeValid = true;
    if (key === "group") {
      rangeValid = val >= 0 && val < GROUP_COUNT;
    } else if (key === "position") {
      rangeValid = ALLOWED_POSITIONS.includes(val);
    }

    const fieldValid = present && typeValid && rangeValid;
    if (!fieldValid) {
      isValid = false;
    }

    fields[key] = {
      present,
      type: currentType,
      valid: fieldValid
    };
  }

  return {
    isValid,
    fields: fields as any
  };
}

// Default team names to kick off
export const DEFAULT_TEAM_NAMES: string[][] = [
  ["Flamenguinho", "Vasquinho", "Tricolor FC", "Alvinegro"],                      // Grupo A
  ["Palmeirinha", "Santos FC Jr", "São Paulo de Guará", "Corinthians da Colina"],  // Grupo B
  ["Boca da Barra", "River FC", "Peñarol da Vila", "Nacional da Várzea"],          // Grupo C
  ["Barcelona do Asfalto", "Real Madri de Quebrada", "Bayern da Arena", "Milan do Morro"], // Grupo D
  ["Borussia do Vale", "PSG da Cohab", "Chelsea do Campo", "Arsenal da Favela"],   // Grupo E
  ["Estrela Vermelha", "Juventus da Baixada", "Ajax do Subúrbio", "Porto da Serra"], // Grupo F
  ["Benfica da Laje", "Sporting da Zona", "Inter de Limoeiro", "Roma de Jardim"],   // Grupo G
  ["Atlético da Sul", "Cruzeirinho da Norte", "Grêmio do Bosque", "Inter da Praia"], // Grupo H
  ["Bahia de Todos", "Vitória da Ribeira", "Santa Cruz do Alto", "Sport de Recife"], // Grupo I
  ["Paysandu da Mata", "Remo de Ver-o-Peso", "Goiás da Campina", "Vila Nova do Setor"], // Grupo J
  ["Coritiba da Neve", "Athletico da Arena", "Londrina do Café", "Paraná da Vila"],// Grupo K
  ["Avaí da Ressaca", "Figueirense de Coqueiros", "Chapecoense do Oeste", "Criciúma do Carvão"] // Grupo L
];

export interface ValidationStats {
  totalTeams: number;
  groupsComplete: number;
  duplicatePositions: string[];
  qualifyingPositionGaps: number[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: ValidationStats;
}

/**
 * Valida um array de 48 times contra as regras PRD.
 * Retorna objeto com status, erros detalhados, warnings e estatísticas.
 * @param {Team[]} teams - Array de até 48 times
 * @returns {ValidationResult}
 */
export function validateTeams(teams: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stats: ValidationStats = {
    totalTeams: Array.isArray(teams) ? teams.length : 0,
    groupsComplete: 0,
    duplicatePositions: [],
    qualifyingPositionGaps: []
  };

  // ===== VALIDAÇÃO 1: Total de Times =====
  if (!Array.isArray(teams)) {
    return {
      valid: false,
      errors: ['Input deve ser um array'],
      warnings: [],
      stats
    };
  }

  if (teams.length !== TOTAL_TEAMS) {
    errors.push(
      `❌ TOTAL_TEAMS inválido: esperado ${TOTAL_TEAMS}, recebido ${teams.length}`
    );
    return { valid: false, errors, warnings, stats };
  }

  // ===== VALIDAÇÃO 2: Estrutura Individual de Cada Time =====
  const requiredTeamFields: (keyof Team)[] = ['name', 'group', 'position', 'points', 'goalDifference', 'goalsFor', 'qualifyingPosition', 'originalIndex'];
  const teamFieldErrors: string[] = [];

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];

    // Verifica se é um objeto válido
    if (!team || typeof team !== 'object') {
      teamFieldErrors.push(`Time #${i}: não é um objeto válido`);
      continue;
    }

    // Verifica campos obrigatórios
    for (const field of requiredTeamFields) {
      if (!(field in team)) {
        teamFieldErrors.push(`Time #${i} ("${team.name || 'DESCONHECIDO'}"): falta campo obrigatório "${field}"`);
      }
    }

    // Validações de tipo
    if (typeof team.name !== 'string' || team.name.trim() === '') {
      teamFieldErrors.push(`Time #${i}: "name" deve ser string não-vazia`);
    }

    if (!Number.isInteger(team.group) || team.group < 0 || team.group >= GROUP_COUNT) {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "group" deve estar entre 0-${GROUP_COUNT - 1}, recebido ${team.group}`
      );
    }

    if (!ALLOWED_POSITIONS.includes(team.position)) {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "position" inválida ${team.position}. Deve ser um de ${ALLOWED_POSITIONS.join(', ')}`
      );
    }

    if (typeof team.points !== 'number' || team.points < 0) {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "points" deve ser número ≥ 0, recebido ${team.points}`
      );
    }

    if (typeof team.goalDifference !== 'number') {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "goalDifference" deve ser número, recebido ${team.goalDifference}`
      );
    }

    if (typeof team.goalsFor !== 'number' || team.goalsFor < 0) {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "goalsFor" deve ser número ≥ 0, recebido ${team.goalsFor}`
      );
    }

    if (!Number.isInteger(team.qualifyingPosition) || team.qualifyingPosition < 1 || team.qualifyingPosition > 48) {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "qualifyingPosition" deve estar entre 1-48, recebido ${team.qualifyingPosition}`
      );
    }

    if (typeof team.originalIndex !== 'number') {
      teamFieldErrors.push(
        `Time #${i} ("${team.name || 'DESCONHECIDO'}"): "originalIndex" deve ser número, recebido ${team.originalIndex}`
      );
    }
  }

  if (teamFieldErrors.length > 0) {
    errors.push(...teamFieldErrors);
    return { valid: false, errors, warnings, stats };
  }

  // ===== VALIDAÇÃO 3: Composição de Grupos =====
  const groupMap = new Map<number, Team[]>();
  for (let g = 0; g < GROUP_COUNT; g++) {
    groupMap.set(g, []);
  }

  for (const team of teams) {
    groupMap.get(team.group)!.push(team);
  }

  // Cada grupo deve ter exatamente 4 times
  for (let g = 0; g < GROUP_COUNT; g++) {
    const groupTeams = groupMap.get(g) || [];
    const groupLetter = GROUP_LETTERS[g];

    if (groupTeams.length !== TEAMS_PER_GROUP) {
      errors.push(
        `❌ Grupo ${groupLetter}: tem ${groupTeams.length} times, esperado ${TEAMS_PER_GROUP}`
      );
    } else {
      stats.groupsComplete++;
    }

    // Verifica nomes duplicados dentro do grupo
    const teamNames = groupTeams.map(t => t.name);
    const uniqueNames = new Set(teamNames);
    if (uniqueNames.size !== teamNames.length) {
      const dupes = teamNames.filter((name, idx) => teamNames.indexOf(name) !== idx);
      errors.push(
        `❌ Grupo ${groupLetter}: contém nomes duplicados: ${dupes.join(', ')}`
      );
    }

    // Verifica duplicação de posições dentro do grupo
    const positions = groupTeams.map(t => t.position);
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
      warnings.push(
        `⚠️ Grupo ${groupLetter}: mais de um time na mesma posição. Ordem: ${positions.join(', ')}`
      );
      stats.duplicatePositions.push(groupLetter);
    }
  }

  // ===== VALIDAÇÃO 4: Unicidade de qualifyingPosition =====
  const qpSet = new Set<number>();
  const qpDuplicates: string[] = [];

  for (const team of teams) {
    if (qpSet.has(team.qualifyingPosition)) {
      qpDuplicates.push(`Time "${team.name}" (grupo ${GROUP_LETTERS[team.group]}, posição ${team.position})`);
    }
    qpSet.add(team.qualifyingPosition);
  }

  if (qpDuplicates.length > 0) {
    errors.push(
      `❌ Duplicação de qualifyingPosition encontrada:\n   ${qpDuplicates.join('\n   ')}`
    );
  }

  // ===== VALIDAÇÃO 5: Continuidade de qualifyingPosition =====
  const gaps: number[] = [];
  for (let i = 0; i < TOTAL_TEAMS; i++) {
    const expected = i + 1;
    if (!qpSet.has(expected)) {
      gaps.push(expected);
    }
  }
  if (gaps.length > 0) {
    warnings.push(
      `⚠️ Gaps detectados em qualifyingPosition: ${gaps.join(', ')} estão faltando`
    );
  }

  // ===== RESULTADO FINAL =====
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalTeams: stats.totalTeams,
      groupsComplete: stats.groupsComplete,
      duplicatePositions: stats.duplicatePositions,
      qualifyingPositionGaps: gaps
    }
  };
}

/**
 * Gera relatório visual da validação para exibição na UI.
 * @param {ValidationResult} validationResult - Resultado de validateTeams()
 * @returns {string} Relatório formatado
 */
export function generateValidationReport(validationResult: ValidationResult): string {
  const { valid, errors, warnings, stats } = validationResult;

  let report = `╔════════════════════════════════════════════════════════════════╗
║                   VALIDAÇÃO DE TIMES                          ║
╚════════════════════════════════════════════════════════════════╝

📊 ESTATÍSTICAS:
   • Total de Times: ${stats.totalTeams}/${TOTAL_TEAMS}
   • Grupos Completos: ${stats.groupsComplete}/${GROUP_COUNT}
   • Gaps em qualifyingPosition: ${stats.qualifyingPositionGaps.length === 0 ? 'Nenhum' : stats.qualifyingPositionGaps.join(', ')}

STATUS GERAL: ${valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}\n`;

  if (errors.length > 0) {
    report += `\n🔴 ERROS (${errors.length}):\n`;
    errors.forEach((err, idx) => {
      report += `   ${idx + 1}. ${err}\n`;
    });
  }

  if (warnings.length > 0) {
    report += `\n⚠️  AVISOS (${warnings.length}):\n`;
    warnings.forEach((warn, idx) => {
      report += `   ${idx + 1}. ${warn}\n`;
    });
  }

  report += `\n╚════════════════════════════════════════════════════════════════╝`;

  return report;
}

/**
 * Função helper para criar um array de teste com 48 times válidos.
 * Útil para testes unitários.
 * @returns {Team[]}
 */
export function generateMockTeams(): Team[] {
  const teams: Team[] = [];
  let qp = 1;

  for (let g = 0; g < GROUP_COUNT; g++) {
    for (let p = 1; p <= TEAMS_PER_GROUP; p++) {
      teams.push({
        name: `Team_G${GROUP_LETTERS[g]}_P${p}`,
        group: g,
        position: p,
        points: Math.floor(Math.random() * 10),
        goalDifference: Math.floor(Math.random() * 20) - 10,
        goalsFor: Math.floor(Math.random() * 15),
        qualifyingPosition: qp,
        originalIndex: qp - 1
      });
      qp++;
    }
  }

  return teams;
}

// ==================== ETAPA 3: ORDENAÇÃO DE GRUPO ====================

/**
 * Ordena 4 times de um grupo segundo critérios de desempate PRD.
 * Retorna array ordenado: [1º, 2º, 3º, 4º]
 * 
 * Critérios de desempate (em ordem):
 * 1. Pontuação total acumulada nas 3 rodadas
 * 2. Posição na fase classificatória (rodada de corte)
 * 3. Ranking geral do Cartola FC
 */
export function sortGroupTeams(
  groupTeams: Team[],
  qualifyingPositions: Record<string, number> = {},
  cartolaRankings: Record<string, number> = {}
): Team[] {
  // Validação de entrada
  if (!Array.isArray(groupTeams) || groupTeams.length !== TEAMS_PER_GROUP) {
    throw new Error(
      `sortGroupTeams: esperado 4 times, recebido ${groupTeams.length}`
    );
  }

  // Cria cópia para não modificar array original
  const sorted = [...groupTeams].sort((a, b) => {
    // Critério 1: Pontuação total (maior primeiro)
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // Critério 2: Posição na rodada de corte (menor número = melhor posição)
    const aPosQualify = qualifyingPositions[a.name] !== undefined ? qualifyingPositions[a.name] : (a.qualifyingPosition || Infinity);
    const bPosQualify = qualifyingPositions[b.name] !== undefined ? qualifyingPositions[b.name] : (b.qualifyingPosition || Infinity);
    if (aPosQualify !== bPosQualify) {
      return aPosQualify - bPosQualify;
    }

    // Critério 3: Ranking geral do Cartola FC (menor número = melhor posição)
    const aRankCartola = cartolaRankings[a.name] !== undefined ? cartolaRankings[a.name] : (a.originalIndex + 1);
    const bRankCartola = cartolaRankings[b.name] !== undefined ? cartolaRankings[b.name] : (b.originalIndex + 1);
    if (aRankCartola !== bRankCartola) {
      return aRankCartola - bRankCartola;
    }

    // Critério 4 (fallback): originalIndex (ordem de entrada)
    return a.originalIndex - b.originalIndex;
  });

  return sorted;
}

// ==================== SELEÇÃO DOS 8 MELHORES 3ºs ====================

/**
 * Seleciona os 8 melhores times que ficaram em 3º lugar na fase de grupos.
 * Retorna um array com exatamente 8 times ordenados do 1º ao 8º melhor.
 */
export function getBestThirdPlaced(
  allTeams: Team[],
  qualifyingPositions: Record<string, number> = {},
  cartolaRankings: Record<string, number> = {}
): Team[] {
  // Validação
  if (!Array.isArray(allTeams) || allTeams.length !== TOTAL_TEAMS) {
    throw new Error(
      `getBestThirdPlaced: esperado ${TOTAL_TEAMS} times, recebido ${allTeams.length}`
    );
  }

  interface ThirdPlacedEntry {
    team: Team;
    groupLetter: string;
    groupIndex: number;
    positionInGroup: number;
  }

  const thirdPlacedTeams: ThirdPlacedEntry[] = [];

  // Passo 1: Extrair 3º colocado de cada grupo
  for (let g = 0; g < GROUP_COUNT; g++) {
    const groupTeams = allTeams.filter(t => t.group === g);
    
    if (groupTeams.length !== TEAMS_PER_GROUP) {
      throw new Error(
        `Group ${GROUP_LETTERS[g]}: esperado 4 times, encontrado ${groupTeams.length}`
      );
    }

    // Ordena o grupo
    const sorted = sortGroupTeams(groupTeams, qualifyingPositions, cartolaRankings);
    
    // O 3º colocado nos grupos ordenados é o índice 2 (0-based)
    thirdPlacedTeams.push({
      team: sorted[2],
      groupLetter: GROUP_LETTERS[g],
      groupIndex: g,
      positionInGroup: 3
    });
  }

  // Passo 2: Ordena os 12 terceiros colocados pelos mesmos critérios
  thirdPlacedTeams.sort((a, b) => {
    const teamA = a.team;
    const teamB = b.team;

    // Critério 1: Pontuação total (maior primeiro)
    if (teamB.points !== teamA.points) {
      return teamB.points - teamA.points;
    }

    // Critério 2: Posição na rodada de corte
    const aPosQualify = qualifyingPositions[teamA.name] !== undefined ? qualifyingPositions[teamA.name] : (teamA.qualifyingPosition || Infinity);
    const bPosQualify = qualifyingPositions[teamB.name] !== undefined ? qualifyingPositions[teamB.name] : (teamB.qualifyingPosition || Infinity);
    if (aPosQualify !== bPosQualify) {
      return aPosQualify - bPosQualify;
    }

    // Critério 3: Ranking geral do Cartola FC
    const aRankCartola = cartolaRankings[teamA.name] !== undefined ? cartolaRankings[teamA.name] : (teamA.originalIndex + 1);
    const bRankCartola = cartolaRankings[teamB.name] !== undefined ? cartolaRankings[teamB.name] : (teamB.originalIndex + 1);
    if (aRankCartola !== bRankCartola) {
      return aRankCartola - bRankCartola;
    }

    // Critério 4 (fallback)
    return teamA.originalIndex - teamB.originalIndex;
  });

  // Passo 3: Retorna apenas os 8 melhores
  const bestEight = thirdPlacedTeams.slice(0, BEST_THIRD_COUNT);

  if (bestEight.length < BEST_THIRD_COUNT) {
    console.warn(
      `⚠️ Apenas ${bestEight.length} terceiros colocados encontrados (esperado ${BEST_THIRD_COUNT})`
    );
  }

  return bestEight.map((item, idx) => ({ 
    ...item.team, 
    thirdRanking: idx + 1 
  }));
}

// ==================== RELATÓRIO DE CLASSIFICAÇÃO ====================

/**
 * Gera relatório formatado da fase de grupos com todas as posições.
 * Exibe cada grupo com seus 4 times ordenados e destaca os 8 melhores 3ºs.
 */
export function generateGroupPhaseReport(
  allTeams: Team[],
  qualifyingPositions: Record<string, number> = {},
  cartolaRankings: Record<string, number> = {}
): string {
  let report = `╔════════════════════════════════════════════════════════════════╗
║              CLASSIFICAÇÃO - FASE DE GRUPOS                   ║
║         (Round of 32 / 3 Rodadas por Grupo)                  ║
╚════════════════════════════════════════════════════════════════╝\n`;

  // Exibe cada grupo
  for (let g = 0; g < GROUP_COUNT; g++) {
    const groupTeams = allTeams.filter(t => t.group === g);
    const sorted = sortGroupTeams(groupTeams, qualifyingPositions, cartolaRankings);
    const groupLetter = GROUP_LETTERS[g];

    report += `\n📊 GRUPO ${groupLetter}:\n`;
    report += `${'─'.repeat(60)}\n`;

    sorted.forEach((team, idx) => {
      const position = idx + 1;
      const status = position <= 2 ? '✅ AVANÇA' : position === 3 ? '⏳ TERCEIRO' : '❌ ELIMINADO';
      const qualifyPos = qualifyingPositions[team.name] !== undefined ? qualifyingPositions[team.name] : (team.qualifyingPosition || '—');
      const cartolaRank = cartolaRankings[team.name] !== undefined ? cartolaRankings[team.name] : (team.originalIndex + 1);

      report += `${position}. ${team.name.padEnd(30)} │ ${String(team.points).padStart(5)} pts │ QP: ${String(qualifyPos).padStart(2)} │ Cart: ${String(cartolaRank).padStart(3)} │ ${status}\n`;
    });
  }

  // Exibe os 8 melhores terceiros colocados
  report += `\n${'═'.repeat(60)}\n`;
  report += `🏆 OS 8 MELHORES 3ºs COLOCADOS (AVANÇAM):\n`;
  report += `${'─'.repeat(60)}\n`;

  const bestThird = getBestThirdPlaced(allTeams, qualifyingPositions, cartolaRankings);
  bestThird.forEach((team, idx) => {
    const ranking = idx + 1;
    const qualifyPos = qualifyingPositions[team.name] !== undefined ? qualifyingPositions[team.name] : (team.qualifyingPosition || '—');
    
    report += `${ranking}. ${team.name.padEnd(30)} │ ${String(team.points).padStart(5)} pts │ Grupo: ${GROUP_LETTERS[team.group]} │ QP: ${String(qualifyPos).padStart(2)}\n`;
  });

  report += `\n${'═'.repeat(60)}\n`;
  report += `📈 RESUMO:\n`;
  report += `   • Total de times que avançam: 32 (24 de 1º/2º + 8 de 3º)\n`;
  report += `   • Total de times eliminados: 16 (4ºs colocados + 4 terceiros)\n`;
  report += `\n╚════════════════════════════════════════════════════════════════╝\n`;

  return report;
}

// ==================== VALIDAÇÃO DE GRUPOS ====================

/**
 * Valida a integridade da fase de grupos antes de prosseguir.
 * Verifica: 48 times, 12 grupos com 4 times cada, sem duplicatas.
 */
export function validateGroupPhase(allTeams: Team[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (allTeams.length !== TOTAL_TEAMS) {
    errors.push(`❌ Total de times: esperado ${TOTAL_TEAMS}, encontrado ${allTeams.length}`);
    return { valid: false, errors };
  }

  const groupMap = new Map<number, Team[]>();
  for (let g = 0; g < GROUP_COUNT; g++) {
    groupMap.set(g, []);
  }

  for (const team of allTeams) {
    if (team.group < 0 || team.group >= GROUP_COUNT) {
      errors.push(`❌ Time "${team.name}": grupo inválido ${team.group}`);
    } else {
      const gList = groupMap.get(team.group);
      if (gList) {
        gList.push(team);
      }
    }
  }

  for (let g = 0; g < GROUP_COUNT; g++) {
    const list = groupMap.get(g);
    const count = list ? list.length : 0;
    if (count !== TEAMS_PER_GROUP) {
      errors.push(
        `❌ Grupo ${GROUP_LETTERS[g]}: ${count} times (esperado ${TEAMS_PER_GROUP})`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// ==================== TESTE DE EXEMPLO ====================

/**
 * Função para testar a ordenação com dados mock.
 * Simula uma rodada de grupo com pontuações variadas.
 */
export function testGroupSorting(): Team[] {
  // Cria 4 times do mesmo grupo com pontuações diferentes
  const testGroup: Team[] = [
    {
      name: 'Team Alpha',
      group: 0,
      position: 1,
      points: 15,
      goalDifference: 5,
      goalsFor: 20,
      qualifyingPosition: 1,
      originalIndex: 0
    },
    {
      name: 'Team Beta',
      group: 0,
      position: 2,
      points: 14,
      goalDifference: 3,
      goalsFor: 18,
      qualifyingPosition: 5,
      originalIndex: 1
    },
    {
      name: 'Team Gamma',
      group: 0,
      position: 3,
      points: 14, // EMPATE com Beta
      goalDifference: 2,
      goalsFor: 17,
      qualifyingPosition: 10, // Pior na rodada de corte
      originalIndex: 2
    },
    {
      name: 'Team Delta',
      group: 0,
      position: 4,
      points: 10,
      goalDifference: -8,
      goalsFor: 12,
      qualifyingPosition: 50,
      originalIndex: 3
    }
  ];

  const qualifyPos = {
    'Team Alpha': 1,
    'Team Beta': 5,
    'Team Gamma': 10,
    'Team Delta': 50
  };

  const cartolaRank = {
    'Team Alpha': 50,
    'Team Beta': 100,
    'Team Gamma': 200,
    'Team Delta': 500
  };

  const sorted = sortGroupTeams(testGroup, qualifyPos, cartolaRank);

  console.log('=== TESTE DE ORDENAÇÃO DE GRUPO ===');
  console.log('Antes:', testGroup.map(t => `${t.name} (${t.points} pts)`).join(' → '));
  console.log('Depois:', sorted.map((t, i) => `${i + 1}. ${t.name} (${t.points} pts)`).join(' → '));
  console.log('Desempate: Beta vence Gamma por melhor posição na rodada de corte (5 < 10)');

  return sorted;
}

// ==================== ETAPA 4: ALOCAÇÃO DINÂMICA DOS 3ºs ====================

export interface ThirdPlaceMatchConfig {
  thirdRanking: number;
  side: number;
  compatibleGroups: string[];
  forbiddenGroups: string[];
  description: string;
}

export const THIRD_PLACE_ALLOCATION_MATRIX: Record<string, ThirdPlaceMatchConfig> = {
  M49: {
    thirdRanking: 1,
    side: 1,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '1º melhor 3º (M49: 1A vs melhor3(1))'
  },
  M50: {
    thirdRanking: 2,
    side: 1,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '2º melhor 3º (M50: 1B vs melhor3(2))'
  },
  M51: {
    thirdRanking: 3,
    side: 1,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '3º melhor 3º (M51: 1C vs melhor3(3))'
  },
  M52: {
    thirdRanking: 4,
    side: 1,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '4º melhor 3º (M52: 1D vs melhor3(4))'
  },
  M57: {
    thirdRanking: 5,
    side: 2,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '5º melhor 3º (M57: 1I vs melhor3(5))'
  },
  M58: {
    thirdRanking: 6,
    side: 2,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '6º melhor 3º (M58: 1J vs melhor3(6))'
  },
  M59: {
    thirdRanking: 7,
    side: 2,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '7º melhor 3º (M59: 1K vs melhor3(7))'
  },
  M60: {
    thirdRanking: 8,
    side: 2,
    compatibleGroups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    forbiddenGroups: [],
    description: '8º melhor 3º (M60: 1L vs melhor3(8))'
  }
};

/**
 * Verifica se um terceiro colocado (por grupo de origem) pode ser alocado em um jogo.
 */
export function isThirdPlacedCompatible(
  thirdPlacedTeam: Team,
  matchConfig: { compatibleGroups: string[]; forbiddenGroups: string[] }
): { compatible: boolean; reason: string } {
  const teamGroupLetter = GROUP_LETTERS[thirdPlacedTeam.group];

  // Verifica se o grupo está na lista de compatível
  if (matchConfig.compatibleGroups.length > 0 && 
      !matchConfig.compatibleGroups.includes(teamGroupLetter)) {
    return {
      compatible: false,
      reason: `Grupo ${teamGroupLetter} não está em ${matchConfig.compatibleGroups.join(', ')}`
    };
  }

  // Verifica se o grupo está na lista de proibido
  if (matchConfig.forbiddenGroups.includes(teamGroupLetter)) {
    return {
      compatible: false,
      reason: `Grupo ${teamGroupLetter} está na lista de proibidos para este jogo`
    };
  }

  return {
    compatible: true,
    reason: `Grupo ${teamGroupLetter} é compatível com este jogo`
  };
}

export interface AllocationResult {
  allocations: Record<string, Team>;
  conflicts: Array<{
    thirdPlacedTeam: Team;
    ranking: number;
    groupLetter: string;
    attemptedMatches: string[];
    reason: string;
  }>;
  isValid: boolean;
}

/**
 * Aloca dinamicamente os 8 melhores terceiros colocados nos 8 jogos que recebem terceiros.
 * Usa um algoritmo greedy com fallback em cascata.
 */
export function allocateThirdPlacedTeams(
  bestThirdPlaced: Team[],
  allocationMatrix: Record<string, ThirdPlaceMatchConfig> = THIRD_PLACE_ALLOCATION_MATRIX
): AllocationResult {
  if (bestThirdPlaced.length !== BEST_THIRD_COUNT) {
    throw new Error(
      `allocateThirdPlacedTeams: esperado ${BEST_THIRD_COUNT} terceiros, recebido ${bestThirdPlaced.length}`
    );
  }

  const allocations: Record<string, Team> = {};
  const usedMatches = new Set<string>();
  const conflicts: Array<{
    thirdPlacedTeam: Team;
    ranking: number;
    groupLetter: string;
    attemptedMatches: string[];
    reason: string;
  }> = [];

  // Ordena os jogos por ranking do terceiro
  const matchOrderByRanking = [
    'M49', 'M50', 'M51', 'M52', 'M57', 'M58', 'M59', 'M60'
  ];

  // Para cada terceiro colocado, tenta alocá-lo
  for (let i = 0; i < bestThirdPlaced.length; i++) {
    const thirdTeam = bestThirdPlaced[i];
    const targetMatchCode = matchOrderByRanking[i];
    const targetMatchConfig = allocationMatrix[targetMatchCode];

    // Tenta alocar no jogo idealmente destinado
    const validation = isThirdPlacedCompatible(thirdTeam, targetMatchConfig);

    if (validation.compatible) {
      // Alocação bem-sucedida
      allocations[targetMatchCode] = thirdTeam;
      usedMatches.add(targetMatchCode);
    } else {
      // Compatibilidade falhou — tenta fallback em cascata
      let fallbackFound = false;
      const attemptedMatches = [targetMatchCode];

      for (const fallbackMatchCode of matchOrderByRanking) {
        if (usedMatches.has(fallbackMatchCode) || fallbackMatchCode === targetMatchCode) {
          continue;
        }

        const fallbackConfig = allocationMatrix[fallbackMatchCode];
        const fallbackValidation = isThirdPlacedCompatible(thirdTeam, fallbackConfig);

        if (fallbackValidation.compatible) {
          // Fallback encontrado
          allocations[fallbackMatchCode] = thirdTeam;
          usedMatches.add(fallbackMatchCode);
          fallbackFound = true;
          break;
        }
        attemptedMatches.push(fallbackMatchCode);
      }

      if (!fallbackFound) {
        // Sem solução automática — registra conflito
        conflicts.push({
          thirdPlacedTeam: thirdTeam,
          ranking: i + 1,
          groupLetter: GROUP_LETTERS[thirdTeam.group],
          attemptedMatches,
          reason: `Nenhum jogo compatível encontrado para grupo ${GROUP_LETTERS[thirdTeam.group]}`
        });
      }
    }
  }

  return {
    allocations,
    conflicts,
    isValid: conflicts.length === 0
  };
}

/**
 * Valida a alocação completa:
 * - Todos os 8 jogos têm um terceiro alocado?
 * - Nenhum terceiro está em 2 jogos?
 * - Nenhum terceiro enfrenta seu próprio grupo?
 */
export function validateThirdPlaceAllocation(
  allocationResult: AllocationResult,
  matchesMetadata: any = {}
): { valid: boolean; errors: string[]; warnings: string[] } {
  const { allocations, conflicts, isValid } = allocationResult;
  const errors: string[] = [];
  const warnings: string[] = [];

  // Erro 1: Conflitos não resolvidos
  if (!isValid) {
    conflicts.forEach(conflict => {
      errors.push(
        `❌ ${conflict.thirdPlacedTeam.name} (${conflict.ranking}º melhor 3º, Grupo ${conflict.groupLetter}): sem jogo compatível`
      );
    });
  }

  // Validação 2: Todos os 8 jogos têm alocação?
  const matchCodes = ['M49', 'M50', 'M51', 'M52', 'M57', 'M58', 'M59', 'M60'];
  const missingMatches = matchCodes.filter(code => !allocations[code]);
  if (missingMatches.length > 0) {
    errors.push(
      `❌ Jogos sem alocação de terceiros: ${missingMatches.join(', ')}`
    );
  }

  // Validação 3: Duplicação de times
  const allocatedTeamIds = new Set<number>();
  for (const team of Object.values(allocations)) {
    if (allocatedTeamIds.has(team.qualifyingPosition)) {
      errors.push(
        `❌ Time ${team.name} foi alocado em mais de um jogo!`
      );
    }
    allocatedTeamIds.add(team.qualifyingPosition);
  }

  // Validação 4: Nenhum terceiro enfrenta seu grupo de origem
  for (const [matchCode, thirdTeam] of Object.entries(allocations)) {
    const groupLetter = GROUP_LETTERS[thirdTeam.group];
    const matchConfig = THIRD_PLACE_ALLOCATION_MATRIX[matchCode as keyof typeof THIRD_PLACE_ALLOCATION_MATRIX];

    if (matchConfig && matchConfig.forbiddenGroups.includes(groupLetter)) {
      warnings.push(
        `⚠️ ${thirdTeam.name} (Grupo ${groupLetter}) foi alocado em ${matchCode}, mas seu grupo está na lista de proibidos`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Gera relatório formatado da alocação de terceiros colocados.
 */
export function generateThirdPlaceAllocationReport(allocationResult: AllocationResult): string {
  const { allocations, conflicts, isValid } = allocationResult;

  let report = `╔════════════════════════════════════════════════════════════════╗
║        ALOCAÇÃO DOS 8 MELHORES 3ºs COLOCADOS                  ║
║              (Round of 16 - Compatibilidade)                  ║
╚════════════════════════════════════════════════════════════════╝

STATUS GERAL: ${isValid ? '✅ VÁLIDO' : '❌ CONFLITOS DETECTADOS'}

`;

  // Exibe cada jogo com seu terceiro alocado
  const matchOrder = ['M49', 'M50', 'M51', 'M52', 'M57', 'M58', 'M59', 'M60'];
  report += `📋 ALOCAÇÕES:\n${'─'.repeat(60)}\n`;

  matchOrder.forEach((matchCode, idx) => {
    const thirdTeam = allocations[matchCode];
    const matchConfig = THIRD_PLACE_ALLOCATION_MATRIX[matchCode as keyof typeof THIRD_PLACE_ALLOCATION_MATRIX];
    const ranking = idx + 1;

    if (thirdTeam) {
      const groupLetter = GROUP_LETTERS[thirdTeam.group];
      const sideLabel = matchConfig.side === 1 ? 'Lado 1' : 'Lado 2';
      report += `${ranking}. ${matchCode} (${sideLabel}): ${thirdTeam.name.padEnd(30)} │ Grupo ${groupLetter}\n`;
    } else {
      report += `${ranking}. ${matchCode}: ⚠️ SEM ALOCAÇÃO\n`;
    }
  });

  // Exibe conflitos, se houver
  if (conflicts.length > 0) {
    report += `\n🔴 CONFLITOS NÃO RESOLVIDOS (${conflicts.length}):\n${'─'.repeat(60)}\n`;
    conflicts.forEach((conflict, idx) => {
      report += `${idx + 1}. ${conflict.thirdPlacedTeam.name} (${conflict.ranking}º melhor, Grupo ${conflict.groupLetter})\n`;
      report += `   ❌ Não é compatível com: ${conflict.attemptedMatches.join(', ')}\n`;
      report += `   💡 ${conflict.reason}\n\n`;
    });
  }

  report += `╚════════════════════════════════════════════════════════════════╝`;

  return report;
}

/**
 * Teste integrado: gera 48 times, ordena grupos, seleciona 8 melhores 3ºs e aloca na chave.
 * Exibe relatório completo.
 */
export function testCompleteThirdPlaceFlow(): {
  teams: Team[];
  bestThird: Team[];
  allocations: Record<string, Team>;
  isValid: boolean;
} | undefined {
  console.log('=== TESTE INTEGRADO: ETAPA 1 A 4 ===\n');

  // Gera 48 times
  const mockTeams = generateMockTeams();
  console.log(`✅ ${mockTeams.length} times gerados`);

  // Valida times
  const validation = validateTeams(mockTeams);
  if (!validation.valid) {
    console.error('❌ Times inválidos:', validation.errors);
    return;
  }
  console.log('✅ Validação de times bem-sucedida');

  // Seleciona 8 melhores 3ºs
  const bestThird = getBestThirdPlaced(mockTeams);
  console.log(`✅ ${bestThird.length} melhores 3ºs selecionados`);

  // Aloca na chave
  const allocationResult = allocateThirdPlacedTeams(bestThird);
  const allocationValidation = validateThirdPlaceAllocation(allocationResult);

  if (!allocationValidation.valid) {
    console.error('❌ Alocação inválida:', allocationValidation.errors);
  } else {
    console.log('✅ Alocação bem-sucedida');
  }

  // Exibe relatório
  const allocationReport = generateThirdPlaceAllocationReport(allocationResult);
  console.log(allocationReport);

  return {
    teams: mockTeams,
    bestThird,
    allocations: allocationResult.allocations,
    isValid: allocationValidation.valid
  };
}


// ==================== ETAPA 5: GERAÇÃO E PROPAGAÇÃO DA CHAVE COMPLETA ====================

export interface BracketMatch {
  code: string;
  phase: string;
  side: number;
  description: string;
  dependsOn: string[];
  isDisputeMatch?: boolean;
  home: Team | null;
  away: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  winner: Team | null;
  loser: Team | null;
  roundNumber?: number | null;
}

export type FullBracket = Record<string, Record<string, BracketMatch>>;

export const FULL_BRACKET_STRUCTURE = {
  // LADO 1 DA CHAVE
  round_of_32_side1: [
    { code: 'M49', phase: 'round_of_32', side: 1, description: '1A vs melhor3(1)' },
    { code: 'M50', phase: 'round_of_32', side: 1, description: '1B vs melhor3(2)' },
    { code: 'M51', phase: 'round_of_32', side: 1, description: '1C vs melhor3(3)' },
    { code: 'M52', phase: 'round_of_32', side: 1, description: '1D vs melhor3(4)' },
    { code: 'M53', phase: 'round_of_32', side: 1, description: '1E vs 2L' },
    { code: 'M54', phase: 'round_of_32', side: 1, description: '1F vs 2K' },
    { code: 'M55', phase: 'round_of_32', side: 1, description: '2G vs 2J' },
    { code: 'M56', phase: 'round_of_32', side: 1, description: '2H vs 2I' }
  ],
  round_of_16_side1: [
    { code: 'M81', phase: 'round_of_16', side: 1, description: 'Vencedor M49 vs Vencedor M50', dependsOn: ['M49', 'M50'] },
    { code: 'M83', phase: 'round_of_16', side: 1, description: 'Vencedor M51 vs Vencedor M52', dependsOn: ['M51', 'M52'] },
    { code: 'M85', phase: 'round_of_16', side: 1, description: 'Vencedor M53 vs Vencedor M54', dependsOn: ['M53', 'M54'] },
    { code: 'M87', phase: 'round_of_16', side: 1, description: 'Vencedor M55 vs Vencedor M56', dependsOn: ['M55', 'M56'] }
  ],
  quarterfinals_side1: [
    { code: 'M90', phase: 'quarterfinals', side: 1, description: 'Vencedor M81 vs Vencedor M83', dependsOn: ['M81', 'M83'] },
    { code: 'M92', phase: 'quarterfinals', side: 1, description: 'Vencedor M85 vs Vencedor M87', dependsOn: ['M85', 'M87'] }
  ],
  semifinals_side1: [
    { code: 'M98', phase: 'semifinals', side: 1, description: 'Vencedor M90 vs Vencedor M92', dependsOn: ['M90', 'M92'] }
  ],
  
  // LADO 2 DA CHAVE (ESPELHADO)
  round_of_32_side2: [
    { code: 'M57', phase: 'round_of_32', side: 2, description: '1I vs melhor3(5)' },
    { code: 'M58', phase: 'round_of_32', side: 2, description: '1J vs melhor3(6)' },
    { code: 'M59', phase: 'round_of_32', side: 2, description: '1K vs melhor3(7)' },
    { code: 'M60', phase: 'round_of_32', side: 2, description: '1L vs melhor3(8)' },
    { code: 'M61', phase: 'round_of_32', side: 2, description: '1G vs 2F' },
    { code: 'M62', phase: 'round_of_32', side: 2, description: '1H vs 2E' },
    { code: 'M63', phase: 'round_of_32', side: 2, description: '2A vs 2D' },
    { code: 'M64', phase: 'round_of_32', side: 2, description: '2B vs 2C' }
  ],
  round_of_16_side2: [
    { code: 'M89', phase: 'round_of_16', side: 2, description: 'Vencedor M57 vs Vencedor M58', dependsOn: ['M57', 'M58'] },
    { code: 'M91', phase: 'round_of_16', side: 2, description: 'Vencedor M59 vs Vencedor M60', dependsOn: ['M59', 'M60'] },
    { code: 'M93', phase: 'round_of_16', side: 2, description: 'Vencedor M61 vs Vencedor M62', dependsOn: ['M61', 'M62'] },
    { code: 'M95', phase: 'round_of_16', side: 2, description: 'Vencedor M63 vs Vencedor M64', dependsOn: ['M63', 'M64'] }
  ],
  quarterfinals_side2: [
    { code: 'M94', phase: 'quarterfinals', side: 2, description: 'Vencedor M89 vs Vencedor M91', dependsOn: ['M89', 'M91'] },
    { code: 'M96', phase: 'quarterfinals', side: 2, description: 'Vencedor M93 vs Vencedor M95', dependsOn: ['M93', 'M95'] }
  ],
  semifinals_side2: [
    { code: 'M100', phase: 'semifinals', side: 2, description: 'Vencedor M94 vs Vencedor M96', dependsOn: ['M94', 'M96'] }
  ],

  // FINAIS
  finals: [
    { code: 'M101', phase: 'final', side: 0, description: 'Final - Vencedor M98 vs Vencedor M100', dependsOn: ['M98', 'M100'] }
  ],
  
  third_place: [
    { code: 'M102', phase: 'third_place', side: 0, description: 'Disputa do 3º - Perdedor M98 vs Perdedor M100', dependsOn: ['M98', 'M100'], isDisputeMatch: true }
  ]
};

/**
 * Constrói a estrutura completa da chave com base nos times qualificados.
 */
export function buildFullBracket(
  groupResults: Record<string, { first?: Team; second?: Team; third?: Team; fourth?: Team }>,
  thirdPlacedAllocations: Record<string, Team> = {}
): FullBracket {
  const bracket: FullBracket = {};

  // Inicializa todas as fases
  const allMatches: any[] = [];
  for (const phase of Object.keys(FULL_BRACKET_STRUCTURE)) {
    const matches = FULL_BRACKET_STRUCTURE[phase as keyof typeof FULL_BRACKET_STRUCTURE];
    if (Array.isArray(matches)) {
      allMatches.push(...matches);
    }
  }

  // Cria estrutura de matches com dados iniciais
  for (const matchTemplate of allMatches) {
    const match: BracketMatch = {
      code: matchTemplate.code,
      phase: matchTemplate.phase,
      side: matchTemplate.side,
      description: matchTemplate.description,
      dependsOn: matchTemplate.dependsOn || [],
      isDisputeMatch: matchTemplate.isDisputeMatch || false,
      home: null,
      away: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      loser: null,
      roundNumber: null
    };

    // Inicializa chave da fase se não existir
    if (!bracket[matchTemplate.phase]) {
      bracket[matchTemplate.phase] = {};
    }

    bracket[matchTemplate.phase][matchTemplate.code] = match;
  }

  // ===== ALOCAÇÃO INICIAL DE TIMES =====

  // Round of 32 - Lado 1
  bracket.round_of_32.M49.home = groupResults.group_A?.first || null;
  bracket.round_of_32.M49.away = thirdPlacedAllocations.M49 || null;

  bracket.round_of_32.M50.home = groupResults.group_B?.first || null;
  bracket.round_of_32.M50.away = thirdPlacedAllocations.M50 || null;

  bracket.round_of_32.M51.home = groupResults.group_C?.first || null;
  bracket.round_of_32.M51.away = thirdPlacedAllocations.M51 || null;

  bracket.round_of_32.M52.home = groupResults.group_D?.first || null;
  bracket.round_of_32.M52.away = thirdPlacedAllocations.M52 || null;

  bracket.round_of_32.M53.home = groupResults.group_E?.first || null;
  bracket.round_of_32.M53.away = groupResults.group_L?.second || null;

  bracket.round_of_32.M54.home = groupResults.group_F?.first || null;
  bracket.round_of_32.M54.away = groupResults.group_K?.second || null;

  bracket.round_of_32.M55.home = groupResults.group_G?.second || null;
  bracket.round_of_32.M55.away = groupResults.group_J?.second || null;

  bracket.round_of_32.M56.home = groupResults.group_H?.second || null;
  bracket.round_of_32.M56.away = groupResults.group_I?.second || null;

  // Round of 32 - Lado 2
  bracket.round_of_32.M57.home = groupResults.group_I?.first || null;
  bracket.round_of_32.M57.away = thirdPlacedAllocations.M57 || null;

  bracket.round_of_32.M58.home = groupResults.group_J?.first || null;
  bracket.round_of_32.M58.away = thirdPlacedAllocations.M58 || null;

  bracket.round_of_32.M59.home = groupResults.group_K?.first || null;
  bracket.round_of_32.M59.away = thirdPlacedAllocations.M59 || null;

  bracket.round_of_32.M60.home = groupResults.group_L?.first || null;
  bracket.round_of_32.M60.away = thirdPlacedAllocations.M60 || null;

  bracket.round_of_32.M61.home = groupResults.group_G?.first || null;
  bracket.round_of_32.M61.away = groupResults.group_F?.second || null;

  bracket.round_of_32.M62.home = groupResults.group_H?.first || null;
  bracket.round_of_32.M62.away = groupResults.group_E?.second || null;

  bracket.round_of_32.M63.home = groupResults.group_A?.second || null;
  bracket.round_of_32.M63.away = groupResults.group_D?.second || null;

  bracket.round_of_32.M64.home = groupResults.group_B?.second || null;
  bracket.round_of_32.M64.away = groupResults.group_C?.second || null;

  return bracket;
}

/**
 * Retorna a próxima fase dada a fase atual e o lado da chave.
 */
export function getNextPhaseInBracket(currentPhase: string, side: number): string | null {
  if (currentPhase === 'round_of_32') return 'round_of_16';
  if (currentPhase === 'round_of_16') return 'quarterfinals';
  if (currentPhase === 'quarterfinals') return 'semifinals';
  if (currentPhase === 'semifinals') return 'final';
  return null;
}

/**
 * Propaga o vencedor de um jogo para o próximo jogo que o aguarda.
 */
export function propagateWinnerToNextMatch(
  bracket: FullBracket,
  currentPhase: string,
  matchCode: string,
  winner: Team,
  nextPhase: string
): void {
  // Mapeia matches que dependem deste resultado
  const dependencyMap: Record<string, string> = {
    // Round of 32 (Side 1) → Round of 16 (Side 1)
    'M49': 'M81',
    'M50': 'M81',
    'M51': 'M83',
    'M52': 'M83',
    'M53': 'M85',
    'M54': 'M85',
    'M55': 'M87',
    'M56': 'M87',

    // Round of 32 (Side 2) → Round of 16 (Side 2)
    'M57': 'M89',
    'M58': 'M89',
    'M59': 'M91',
    'M60': 'M91',
    'M61': 'M93',
    'M62': 'M93',
    'M63': 'M95',
    'M64': 'M95',

    // Round of 16 (Side 1) → Quarterfinals (Side 1)
    'M81': 'M90',
    'M83': 'M90',
    'M85': 'M92',
    'M87': 'M92',

    // Round of 16 (Side 2) → Quarterfinals (Side 2)
    'M89': 'M94',
    'M91': 'M94',
    'M93': 'M96',
    'M95': 'M96',

    // Quarterfinals → Semifinals
    'M90': 'M98',
    'M92': 'M98',
    'M94': 'M100',
    'M96': 'M100',
    
    // Semifinals → Final
    'M98': 'M101',  // Vencedor M98 → home em M101
    'M100': 'M101', // Vencedor M100 → away em M101
  };

  const nextMatchCode = dependencyMap[matchCode];
  if (!nextMatchCode) return;

  // Busca o próximo jogo
  let nextMatch = null;
  if (bracket[nextPhase] && bracket[nextPhase][nextMatchCode]) {
    nextMatch = bracket[nextPhase][nextMatchCode];
  }

  if (!nextMatch) return;

  // Aloca winner na posição correta (home ou away)
  const dependsOnList = nextMatch.dependsOn || [];
  if (dependsOnList[0] === matchCode) {
    nextMatch.home = winner;
  } else if (dependsOnList[1] === matchCode) {
    nextMatch.away = winner;
  } else {
    if (!nextMatch.home) {
      nextMatch.home = winner;
    } else {
      nextMatch.away = winner;
    }
  }
}

/**
 * Processa os resultados de uma fase e propaga os vencedores para a próxima.
 * Usa como critério de desempate a pontuação da rodada + desempates secundários.
 */
export function processMatchResults(
  bracket: FullBracket,
  phase: string,
  scoresByMatchCode: Record<string, { home: number; away: number }> = {},
  tiebreakers: Record<number, { groupPoints?: number; qualifyingPos?: number; cartolaRank?: number }> = {}
): { bracket: FullBracket; processedCount: number; errors: string[] } {
  const errors: string[] = [];
  let processedCount = 0;

  if (!bracket[phase]) {
    errors.push(`❌ Fase ${phase} não encontrada no bracket`);
    return { bracket, processedCount: 0, errors };
  }

  // Processa cada jogo da fase
  for (const [matchCode, match] of Object.entries(bracket[phase])) {
    if (!scoresByMatchCode[matchCode]) {
      continue;  // Jogo ainda não tem resultado
    }

    const scores = scoresByMatchCode[matchCode];
    const homeTeam = match.home;
    const awayTeam = match.away;

    if (!homeTeam || !awayTeam) {
      errors.push(`⚠️ ${matchCode}: Times não definidos (home: ${homeTeam?.name || 'NULL'}, away: ${awayTeam?.name || 'NULL'})`);
      continue;
    }

    // Determina vencedor
    let winner: Team;
    let loser: Team;

    if (scores.home > scores.away) {
      winner = homeTeam;
      loser = awayTeam;
    } else if (scores.away > scores.home) {
      winner = awayTeam;
      loser = homeTeam;
    } else {
      // Desempate
      const homeBreaker = tiebreakers[homeTeam.qualifyingPosition] || {};
      const awayBreaker = tiebreakers[awayTeam.qualifyingPosition] || {};

      // Critério 1: Pontuação acumulada na fase de grupos
      if ((homeBreaker.groupPoints || 0) > (awayBreaker.groupPoints || 0)) {
        winner = homeTeam;
        loser = awayTeam;
      } else if ((awayBreaker.groupPoints || 0) > (homeBreaker.groupPoints || 0)) {
        winner = awayTeam;
        loser = homeTeam;
      } else {
        // Critério 2: Posição na fase classificatória
        if ((homeBreaker.qualifyingPos || Infinity) < (awayBreaker.qualifyingPos || Infinity)) {
          winner = homeTeam;
          loser = awayTeam;
        } else if ((awayBreaker.qualifyingPos || Infinity) < (homeBreaker.qualifyingPos || Infinity)) {
          winner = awayTeam;
          loser = homeTeam;
        } else {
          // Critério 3: Ranking geral do Cartola FC
          if ((homeBreaker.cartolaRank || Infinity) < (awayBreaker.cartolaRank || Infinity)) {
            winner = homeTeam;
            loser = awayTeam;
          } else {
            winner = awayTeam;
            loser = homeTeam;
          }
        }
      }
    }

    // Registra resultado
    match.homeScore = scores.home;
    match.awayScore = scores.away;
    match.winner = winner;
    match.loser = loser;
    processedCount++;

    // Propaga para próxima fase
    const nextPhase = getNextPhaseInBracket(phase, match.side);
    if (nextPhase) {
      propagateWinnerToNextMatch(bracket, phase, matchCode, winner, nextPhase);
    }

    // Caso especial: Semifinais - propagam perdedores para M102 (Disputa 3º lugar)
    if (phase === 'semifinals') {
      const disputeMatch = bracket.third_place?.M102;
      if (disputeMatch) {
         if (matchCode === 'M98') {
           disputeMatch.home = loser;
         } else if (matchCode === 'M100') {
           disputeMatch.away = loser;
         }
      }
    }
  }

  return { bracket, processedCount, errors };
}

export interface FinalRankings {
  champion: Team;
  runner_up: Team;
  third_place: Team | null;
  fourth_place: Team | null;
  fifth_place: Team | null;
  rankings: Team[];
}

/**
 * Define a classificação final (1º, 2º, 3º, 4º, 5º lugar) com base nos resultados da chave.
 */
export function determineFinalRankings(bracket: FullBracket): FinalRankings {
  // Valida dados disponíveis
  if (!bracket.final || !bracket.final.M101) {
    throw new Error('Final (M101) não foi disputada ou não tem resultado');
  }

  const finalMatch = bracket.final.M101;
  if (!finalMatch.winner || !finalMatch.loser) {
    throw new Error('Final ainda não tem resultado definido');
  }

  const champion = finalMatch.winner;
  const runner_up = finalMatch.loser;

  // 3º e 4º lugar: Disputa do 3º
  let third_place: Team | null = null;
  let fourth_place: Team | null = null;
  if (bracket.third_place && bracket.third_place.M102) {
    const disputeMatch = bracket.third_place.M102;
    if (disputeMatch.winner && disputeMatch.loser) {
      third_place = disputeMatch.winner;
      fourth_place = disputeMatch.loser;
    }
  }

  // 5º lugar: Perdedor na semifinal do campeão
  let fifth_place: Team | null = null;
  const championInM98 = bracket.semifinals.M98?.home?.qualifyingPosition === champion.qualifyingPosition ||
                        bracket.semifinals.M98?.away?.qualifyingPosition === champion.qualifyingPosition;
  if (championInM98) {
    fifth_place = bracket.semifinals.M98?.loser || null;
  } else {
    fifth_place = bracket.semifinals.M100?.loser || null;
  }

  return {
    champion,
    runner_up,
    third_place,
    fourth_place,
    fifth_place,
    rankings: [champion, runner_up, third_place, fourth_place, fifth_place].filter((t): t is Team => t !== null)
  };
}

/**
 * Helper para formatar uma linha de jogo.
 */
function formatBracketMatchLine(code: string, match: BracketMatch | undefined): string {
  if (!match) return '';
  
  const homeScore = match.homeScore !== null ? match.homeScore : '—';
  const awayScore = match.awayScore !== null ? match.awayScore : '—';
  const winner = match.winner ? `[${match.winner.name.substring(0, 15)}]` : '';
  
  return `${code.padEnd(6)}: ${(match.home?.name || 'TBD').padEnd(20)} ${homeScore} x ${awayScore} ${(match.away?.name || 'TBD').padEnd(20)} ${winner}\n`;
}

/**
 * Gera relatório formatado da chave completa com todos os resultados.
 */
export function generateBracketReport(bracket: FullBracket, rankings: FinalRankings | null = null): string {
  let report = `╔════════════════════════════════════════════════════════════════╗
║              CHAVE COMPLETA - MATA-MATA                       ║
║           Só Camisa 10 Cup 2026 - Round of 32 a Final        ║
╚════════════════════════════════════════════════════════════════╝

`;

  // LADO 1
  report += `\n🔵 LADO 1 DA CHAVE\n${'═'.repeat(60)}\n`;
  
  report += `\nRound of 32:\n${'─'.repeat(60)}\n`;
  const r32Lado1 = ['M49', 'M50', 'M51', 'M52', 'M53', 'M54', 'M55', 'M56'];
  for (const code of r32Lado1) {
    const match = bracket.round_of_32[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nRound of 16:\n${'─'.repeat(60)}\n`;
  const r16Lado1 = ['M81', 'M83', 'M85', 'M87'];
  for (const code of r16Lado1) {
    const match = bracket.round_of_16[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nQuarterfinals:\n${'─'.repeat(60)}\n`;
  const qfLado1 = ['M90', 'M92'];
  for (const code of qfLado1) {
    const match = bracket.quarterfinals[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nSemifinals:\n${'─'.repeat(60)}\n`;
  const match98 = bracket.semifinals.M98;
  report += formatBracketMatchLine('M98', match98);

  // LADO 2
  report += `\n\n🔴 LADO 2 DA CHAVE\n${'═'.repeat(60)}\n`;
  
  report += `\nRound of 32:\n${'─'.repeat(60)}\n`;
  const r32Lado2 = ['M57', 'M58', 'M59', 'M60', 'M61', 'M62', 'M63', 'M64'];
  for (const code of r32Lado2) {
    const match = bracket.round_of_32[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nRound of 16:\n${'─'.repeat(60)}\n`;
  const r16Lado2 = ['M89', 'M91', 'M93', 'M95'];
  for (const code of r16Lado2) {
    const match = bracket.round_of_16[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nQuarterfinals:\n${'─'.repeat(60)}\n`;
  const qfLado2 = ['M94', 'M96'];
  for (const code of qfLado2) {
    const match = bracket.quarterfinals[code];
    report += formatBracketMatchLine(code, match);
  }

  report += `\nSemifinals:\n${'─'.repeat(60)}\n`;
  const match100 = bracket.semifinals.M100;
  report += formatBracketMatchLine('M100', match100);

  // FINAIS
  report += `\n\n🏆 FINAIS\n${'═'.repeat(60)}\n`;
  const finalMatch = bracket.final.M101;
  report += formatBracketMatchLine('M101', finalMatch);

  const disputeMatch = bracket.third_place?.M102;
  if (disputeMatch) {
    report += `\n`;
    report += formatBracketMatchLine('M102', disputeMatch);
  }

  // CLASSIFICAÇÃO FINAL
  if (rankings && rankings.champion) {
    report += `\n\n${'═'.repeat(60)}\n`;
    report += `🥇 CLASSIFICAÇÃO FINAL\n${'═'.repeat(60)}\n`;
    report += `1º lugar: ${rankings.champion.name} (Grupo ${GROUP_LETTERS[rankings.champion.group]})\n`;
    report += `2º lugar: ${rankings.runner_up.name} (Grupo ${GROUP_LETTERS[rankings.runner_up.group]})\n`;
    if (rankings.third_place) report += `3º lugar: ${rankings.third_place.name} (Grupo ${GROUP_LETTERS[rankings.third_place.group]})\n`;
    if (rankings.fourth_place) report += `4º lugar: ${rankings.fourth_place.name} (Grupo ${GROUP_LETTERS[rankings.fourth_place.group]})\n`;
    if (rankings.fifth_place) report += `5º lugar: ${rankings.fifth_place.name} (Grupo ${GROUP_LETTERS[rankings.fifth_place.group]})\n`;
  }

  report += `\n╚════════════════════════════════════════════════════════════════╝\n`;

  return report;
}

/**
 * Teste end-to-end: Etapas 1-5 completas.
 * Gera times, grupos, 8 melhores 3ºs, monta chave, simula resultados.
 */
export function testFullTournamentFlow(): {
  allTeams: Team[];
  groupResults: any;
  bestThird: Team[];
  bracket: FullBracket;
  rankings: FinalRankings;
} | undefined {
  console.log('=== TESTE INTEGRADO: ETAPAS 1-5 (TORNEIO COMPLETO) ===\n');

  // 1. Gera 48 times
  const allTeams = generateMockTeams();
  console.log(`✅ ${allTeams.length} times gerados`);

  // 2. Valida times
  const validation = validateTeams(allTeams);
  if (!validation.valid) {
    console.error('❌ Validação falhou:', validation.errors);
    return;
  }
  console.log('✅ Validação bem-sucedida');

  // 3. Ordena grupos e seleciona 8 melhores 3ºs
  const groupResults: Record<string, { first: Team; second: Team; third: Team; fourth: Team }> = {};
  for (let g = 0; g < GROUP_COUNT; g++) {
    const groupTeams = allTeams.filter(t => t.group === g);
    const sorted = sortGroupTeams(groupTeams);
    groupResults[`group_${GROUP_LETTERS[g]}`] = {
      first: sorted[0],
      second: sorted[1],
      third: sorted[2],
      fourth: sorted[3]
    };
  }
  console.log('✅ Grupos ordenados');

  const bestThird = getBestThirdPlaced(allTeams);
  console.log(`✅ ${bestThird.length} melhores 3ºs selecionados`);

  // 4. Aloca 8 melhores 3ºs
  const allocationResult = allocateThirdPlacedTeams(bestThird);
  if (!allocationResult.isValid) {
    console.warn('⚠️ Conflitos na alocação de terceiros');
  } else {
    console.log('✅ Alocação bem-sucedida');
  }

  // 5. Monta chave completa
  const bracket = buildFullBracket(groupResults, allocationResult.allocations);
  console.log('✅ Chave montada');

  // 6. Simula resultados (pontuações aleatórias)
  const scoresByMatch: Record<string, { home: number; away: number }> = {};
  const tiebreakers: Record<number, { groupPoints: number; qualifyingPos: number; cartolaRank: number }> = {};

  // Popula tiebreakers
  for (const team of allTeams) {
    tiebreakers[team.qualifyingPosition] = {
      groupPoints: Math.floor(Math.random() * 40),
      qualifyingPos: team.qualifyingPosition,
      cartolaRank: team.originalIndex
    };
  }

  // Simula pontuações para R32
  const r32Matches = ['M49', 'M50', 'M51', 'M52', 'M53', 'M54', 'M55', 'M56', 'M57', 'M58', 'M59', 'M60', 'M61', 'M62', 'M63', 'M64'];
  for (const code of r32Matches) {
    scoresByMatch[code] = {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    };
  }

  // Processa Round of 32
  const r32Result = processMatchResults(bracket, 'round_of_32', scoresByMatch, tiebreakers);
  if (r32Result.errors.length === 0) {
    console.log(`✅ Round of 32 processado (${r32Result.processedCount} jogos)`);
  }

  // Simula e processa Round of 16
  const r16Matches = ['M81', 'M83', 'M85', 'M87', 'M89', 'M91', 'M93', 'M95'];
  const r16Scores: Record<string, { home: number; away: number }> = {};
  for (const code of r16Matches) {
    r16Scores[code] = {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    };
  }
  const r16Result = processMatchResults(bracket, 'round_of_16', r16Scores, tiebreakers);
  console.log(`✅ Round of 16 processado (${r16Result.processedCount} jogos)`);

  // Simula e processa Quarterfinals
  const qfMatches = ['M90', 'M92', 'M94', 'M96'];
  const qfScores: Record<string, { home: number; away: number }> = {};
  for (const code of qfMatches) {
    qfScores[code] = {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    };
  }
  const qfResult = processMatchResults(bracket, 'quarterfinals', qfScores, tiebreakers);
  console.log(`✅ Quarterfinals processadas (${qfResult.processedCount} jogos)`);

  // Simula e processa Semifinals
  const sfMatches = ['M98', 'M100'];
  const sfScores: Record<string, { home: number; away: number }> = {};
  for (const code of sfMatches) {
    sfScores[code] = {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    };
  }
  const sfResult = processMatchResults(bracket, 'semifinals', sfScores, tiebreakers);
  console.log(`✅ Semifinals processadas (${sfResult.processedCount} jogos)`);

  // Simula Final
  const finalScores = {
    'M101': {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    }
  };
  const finalResult = processMatchResults(bracket, 'final', finalScores, tiebreakers);
  console.log(`✅ Final processada`);

  // Simula Disputa do 3º
  const disputeScores = {
    'M102': {
      home: Math.floor(Math.random() * 100),
      away: Math.floor(Math.random() * 100)
    }
  };
  const disputeResult = processMatchResults(bracket, 'third_place', disputeScores, tiebreakers);
  console.log(`✅ Disputa do 3º lugar processada`);

  // Determina classificação final
  const rankings = determineFinalRankings(bracket);
  console.log('✅ Classificação final determinada');

  // Exibe relatório
  const report = generateBracketReport(bracket, rankings);
  console.log(report);

  return {
    allTeams,
    groupResults,
    bestThird,
    bracket,
    rankings
  };
}

/**
 * ETAPA 5: GERAÇÃO E PROPAGAÇÃO DA CHAVE COMPLETA / CORTE
 * Processa a rodada de corte filtrando e sorteando os times para os grupos.
 */
export interface CuttingRoundResult {
  advancing: CartolaTeam[];
  eliminated: CartolaTeam[];
  groups: Record<string, Team[]>;
  esperneioTeams?: Array<{
    team: CartolaTeam;
    roundScore: number;
    esperneioScore: number;
    rankBefore: number;
    rankAfter: number;
    status: "vencedor" | "eliminado";
  }>;
  allRanked?: Array<{
    id: string;
    name: string;
    owner: string;
    shieldUrl?: string;
    points: number;
    esperneioScore?: number;
    rank: number;
    status: "seeded" | "direct" | "esperneio_win" | "esperneio_lost";
  }>;
}

/**
 * Gera os 12 grupos da Copa Mata-Mata.
 * Aloca 1 cabeça de chave para cada grupo A-L e distribui os 36 restantes.
 * 
 * @param topHeads Array com 12 cabeças ordenadas (1º melhor -> A, 2º -> B, etc)
 * @param remaining36 Array com os 36 restantes embaralhados (Fisher-Yates) Ex: [{team, rank, originalIndex}] ou correspondente
 * @returns Um registro associando a letra do grupo (A-L) a uma lista com 4 times.
 */
export function generateGroups(
  topHeads: any[],
  remaining36: any[]
): Record<string, Team[]> {
  const groups: Record<string, Team[]> = {};
  
  // Inicializar grupos A-L
  GROUP_LETTERS.forEach(l => {
    groups[l] = [];
  });

  const createTeamObject = (entry: any, groupIdx: number, position: number): Team => {
    const name = entry?.team?.name || entry?.name || "";
    const owner = entry?.team?.owner || entry?.owner || "";
    const originalIndex = typeof entry?.originalIndex === 'number' 
      ? entry.originalIndex 
      : (typeof entry?.team?.originalIndex === 'number' ? entry.team.originalIndex : 0);
    const qualifyingPosition = typeof entry?.rank === 'number' 
      ? entry.rank 
      : (typeof entry?.qualifyingPosition === 'number' ? entry.qualifyingPosition : position);
    const shieldUrl = entry?.team?.shieldUrl || entry?.shieldUrl || "";

    return {
      name,
      owner,
      group: groupIdx,
      position,
      points: 0,
      goalDifference: 0,
      goalsFor: 0,
      qualifyingPosition,
      originalIndex,
      shieldUrl,
      groupRound1: 0,
      groupRound2: 0,
      groupRound3: 0
    };
  };

  // Aloca 1 cabeça em cada grupo (0 -> A, 1 -> B, etc)
  topHeads.forEach((entry, idx) => {
    if (idx < GROUP_LETTERS.length) {
      const letter = GROUP_LETTERS[idx];
      groups[letter].push(createTeamObject(entry, idx, 1));
    }
  });

  // Distribui os 36 restantes sequencialmente (3 por grupo)
  remaining36.forEach((entry, idx) => {
    const groupIdx = idx % GROUP_LETTERS.length;
    const letter = GROUP_LETTERS[groupIdx];
    const position = groups[letter].length + 1;
    groups[letter].push(createTeamObject(entry, groupIdx, position));
  });

  return groups;
}

export function processCuttingRound(
  round_number: number,
  allParticipants: CartolaTeam[]
): CuttingRoundResult {
  // 1. Extrai pontuação de cada um dos 50 times naquela rodada de corte (Fase 1)
  const scoredTeams = allParticipants.map((t, idx) => {
    const roundScore = t.scores[round_number] || 0;
    
    // Calcular a pontuação acumulada até a rodada de corte para o ranking oficial
    let cumulativeScore = 0;
    for (let r = 1; r <= round_number; r++) {
      cumulativeScore += t.scores[r] || 0;
    }

    return {
      team: t,
      roundScore,
      cumulativeScore,
      originalIndex: idx
    };
  });

  // Ordenar por acumulado desc (Classificação até R20), depois pontuação da rodada desc, depois originalIndex asc
  scoredTeams.sort((a, b) => {
    if (b.cumulativeScore !== a.cumulativeScore) {
      return b.cumulativeScore - a.cumulativeScore;
    }
    if (b.roundScore !== a.roundScore) {
      return b.roundScore - a.roundScore;
    }
    return a.originalIndex - b.originalIndex;
  });

  // Grava o rank pós-corte inicial (1-50)
  const rankedEntriesBeforeEsperneio = scoredTeams.map((entry, idx) => {
    return {
      ...entry,
      rankBefore: idx + 1
    };
  });

  // 1. DEFINIÇÃO DO LIMBO: Identificar os times que ficaram do 47º ao 50º lugar (índices 46, 47, 48, 49)
  const directAdvancingEntries = rankedEntriesBeforeEsperneio.slice(0, 46); // 1º ao 46º lugar avançam diretamente
  const esperneioCandidates = rankedEntriesBeforeEsperneio.slice(46, 50); // 47º ao 50º lugar no limbo

  // 2. RODADA DO ESPERNEIO: rodada extra exclusiva para esses 4 times (R_corte + 1)
  const esperneioScored = esperneioCandidates.map(c => {
    const rExtraScore = c.team.scores[round_number + 1] || 0;
    
    // Calcular pontuação acumulada incluindo a rodada extra
    const cumulativeScorePlusExtra = c.cumulativeScore + rExtraScore;

    return {
      ...c,
      esperneioScore: rExtraScore,
      cumulativeScorePlusExtra
    };
  });

  // Ordenar candidatos do esperneio por: pontuação da rodada do esperneio DESC, depois acumulado até corte DESC, depois originalIndex ASC
  esperneioScored.sort((a, b) => {
    if (b.esperneioScore !== a.esperneioScore) {
      return b.esperneioScore - a.esperneioScore;
    }
    if (b.cumulativeScore !== a.cumulativeScore) {
      return b.cumulativeScore - a.cumulativeScore;
    }
    return a.originalIndex - b.originalIndex;
  });

  // Os 2 melhores do Esperneio avançam obrigatoriamente nas posições 47 e 48 da classificação geral da Copa M10
  const esperneioSurvivors = esperneioScored.slice(0, 2).map((entry, idx) => {
    return {
      ...entry,
      rankAfter: 47 + idx, // vaga 47 e vaga 48
      status: "vencedor" as const
    };
  });

  // Os 2 piores do Esperneio são cortados (posições 49 e 50)
  const esperneioEliminated = esperneioScored.slice(2, 4).map((entry, idx) => {
    return {
      ...entry,
      rankAfter: 49 + idx, // posições 49 e 50
      status: "eliminado" as const
    };
  });

  // 3. TRAVA DE CLASSIFICAÇÃO (SEEDING LOCK) & PROTEÇÃO DE CABEÇAS DE CHAVE:
  // Os classificados diretos (1 a 46) mantêm seu rank pós-corte original (sementes protegidas)
  // Os sobreviventes do Esperneio entram exclusivamente nas posições 47 e 48
  const finalAdvancingEntries = [
    ...directAdvancingEntries.map((e, idx) => ({ ...e, rankAfter: idx + 1 })),
    ...esperneioSurvivors
  ];

  const advancing = finalAdvancingEntries.map(e => ({
    ...e.team,
    qualifyingPosition: e.rankAfter, // posição travada final (1-48)
    is_survivor: e.rankAfter === 47 || e.rankAfter === 48
  }));

  const eliminated = esperneioEliminated.map(e => ({
    ...e.team,
    qualifyingPosition: e.rankAfter,
    is_survivor: false
  }));

  // 4. PROTEÇÃO DOS CABEÇAS DE CHAVE: Os 12 primeiros da Fase 1 viram cabeças de chave intocáveis (ranks 1 a 12)
  const heads = finalAdvancingEntries.slice(0, 12);
  const remaining = finalAdvancingEntries.slice(12, 48);

  // 5. Os 36 restantes são sorteados aleatoriamente com Fisher-Yates
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };

  const shuffledRemaining = shuffle(remaining);

  // Inicializar e gerar os grupos A-L usando o novo método centralizado generateGroups
  const groups = generateGroups(heads, shuffledRemaining);

  // Estruturar dados do Esperneio para visualização
  const esperneioTeams = [
    ...esperneioSurvivors,
    ...esperneioEliminated
  ].map(e => ({
    team: e.team,
    roundScore: e.roundScore,
    esperneioScore: e.esperneioScore,
    rankBefore: e.rankBefore,
    rankAfter: e.rankAfter,
    status: e.status
  }));

  // Montar tabela consolidada de classificação final (1 a 50) para visualização impecável
  const allRanked = [
    ...directAdvancingEntries.map((e, idx) => ({
      id: e.team.id,
      name: e.team.name,
      owner: e.team.owner,
      shieldUrl: e.team.shieldUrl,
      points: e.cumulativeScore,
      rank: idx + 1,
      status: (idx < 12 ? "seeded" : "direct") as "seeded" | "direct",
      is_survivor: false
    })),
    ...esperneioSurvivors.map(e => ({
      id: e.team.id,
      name: e.team.name,
      owner: e.team.owner,
      shieldUrl: e.team.shieldUrl,
      points: e.cumulativeScore,
      esperneioScore: e.esperneioScore,
      rank: e.rankAfter,
      status: "esperneio_win" as const,
      is_survivor: true
    })),
    ...esperneioEliminated.map(e => ({
      id: e.team.id,
      name: e.team.name,
      owner: e.team.owner,
      shieldUrl: e.team.shieldUrl,
      points: e.cumulativeScore,
      esperneioScore: e.esperneioScore,
      rank: e.rankAfter,
      status: "esperneio_lost" as const,
      is_survivor: false
    }))
  ].sort((a, b) => a.rank - b.rank);

  return {
    advancing,
    eliminated,
    groups,
    esperneioTeams,
    allRanked
  };
}


