import React, { useState, useEffect } from "react";
import { 
  Settings, RefreshCw, Layout, AlertCircle, Save, Trash2, Search, Sparkles, Check, Info, FileSpreadsheet, AlertTriangle
} from "lucide-react";

interface CartolaTeam {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  scores: Record<number, number>;
}

interface AdminProps {
  currentRound: number;
  syncTimestamp: string;
  source: string;
  isSyncing: boolean;
  onSyncTrigger: () => void;
  syncLogs: string[];
  cutRound: number;
  onCutRoundChange: (val: number) => void;
  theme: string;
  onThemeChange: (val: string) => void;
  teams: CartolaTeam[];
  allSyncedScores?: Record<number, Record<string, number>>;
  
  // Toggles for active championships and simulators
  isM10Enabled: boolean;
  onM10EnabledChange: (val: boolean) => void;
  isB10Enabled: boolean;
  onB10EnabledChange: (val: boolean) => void;
  isSimulatorsEnabled: boolean;
  onSimulatorsEnabledChange: (val: boolean) => void;
}

// Lista Estática Oficial dos 50 Participantes da Liga 2026
const PARTICIPANTS = [
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

export default function Admin({
  currentRound,
  syncTimestamp,
  source,
  isSyncing,
  onSyncTrigger,
  syncLogs,
  cutRound,
  onCutRoundChange,
  theme,
  onThemeChange,
  teams,
  allSyncedScores = {},
  isM10Enabled,
  onM10EnabledChange,
  isB10Enabled,
  onB10EnabledChange,
  isSimulatorsEnabled,
  onSimulatorsEnabledChange
}: AdminProps) {
  // Autenticação Admin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_logged_in") === "true";
  });

  // Rodada selecionada para gerenciamento
  const [selectedRound, setSelectedRound] = useState<number>(() => {
    return currentRound || 17;
  });

  // Estado local para digitação e manipulação de pontuações
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [pasteAreaContent, setPasteAreaContent] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pasteFeedback, setPasteFeedback] = useState<string[]>([]);

  // Estados Google Sheets
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [tabName, setTabName] = useState("");
  const [syncAllRounds, setSyncAllRounds] = useState(true);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsLogs, setSheetsLogs] = useState<string[]>([]);

  useEffect(() => {
    // Carregar configurações de planilha salvas pelo servidor
    fetch("/api/sheets/config")
      .then(res => res.json())
      .then(data => {
        if (data.spreadsheetUrl) setSpreadsheetUrl(data.spreadsheetUrl);
        if (data.tabName) setTabName(data.tabName);
      })
      .catch(err => console.error("Erro ao carregar sheets config", err));
  }, []);

  const handleSheetsSync = async () => {
    setSheetsLoading(true);
    setSheetsLogs([`[${new Date().toLocaleTimeString("pt-BR")}] Conectando ao robô de importação...`]);
    try {
      const response = await fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetUrl,
          tabName,
          selectedRound,
          syncAllRounds
        })
      });

      const result = await response.json();
      if (result.logs) {
        setSheetsLogs(result.logs);
      }

      if (!response.ok) {
        throw new Error(result.message || `Falhou: código HTTP ${response.status}`);
      }

      setStatusMessage({
        type: "success",
        text: result.message || `Parabéns! Sua planilha do Google Sheets foi sincronizada e carregada com sucesso!`
      });
      onSyncTrigger();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Sincronização Google Sheets falhou: ${err.message}`
      });
    } finally {
      setSheetsLoading(false);
    }
  };

  // Carregar dados de pontuações reais persistidos assim que a rodada mudar
  useEffect(() => {
    const scoresForRound = allSyncedScores[selectedRound] || {};
    const initialScores: Record<string, number> = {};

    PARTICIPANTS.forEach((p) => {
      if (scoresForRound[p.slug] !== undefined) {
        initialScores[p.slug] = scoresForRound[p.slug];
      } else {
        // Fallback para exibir pontuação atual na UI se for a rodada corrente, senão 0.0
        const foundTeam = teams.find(t => t.name.toLowerCase() === p.name.toLowerCase() || t.owner.toLowerCase() === p.owner.toLowerCase());
        if (foundTeam && foundTeam.scores && foundTeam.scores[selectedRound] !== undefined) {
          initialScores[p.slug] = foundTeam.scores[selectedRound];
        } else {
          initialScores[p.slug] = selectedRound === 17 ? 60.00 : 0.00;
        }
      }
    });

    setLocalScores(initialScores);
    setPasteFeedback([]);
    setStatusMessage(null);
  }, [selectedRound, allSyncedScores, teams]);

  // Modificação manual na tabela
  const handleScoreChange = (slug: string, value: string) => {
    const num = value === "" ? 0.0 : parseFloat(value.replace(",", "."));
    setLocalScores(prev => ({
      ...prev,
      [slug]: isNaN(num) ? 0.0 : num
    }));
  };

  // Processar e associar texto vindo do Excel/Google Sheets
  const handleSpreadsheetImport = () => {
    if (!pasteAreaContent.trim()) {
      setStatusMessage({ type: "error", text: "A área de texto está vazia. Por favor, copie e cole sua planilha primeiro." });
      return;
    }

    const lines = pasteAreaContent.split("\n");
    const newScores = { ...localScores };
    let matches = 0;
    let unmatchedLines: string[] = [];

    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9]/g, "");    // remove espaços e símbolos
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Dividir dados por tab, ponto-e-vírgula ou vírgula caso seja CSV
      const parts = trimmed.split(/[\t|;,]/).map(p => p.trim()).filter(Boolean);
      
      let valStr = "";
      let nameStr = "";

      if (parts.length >= 2) {
        // Encontra o valor numérico de pontuação (geralmente o último elemento ou um float nítido)
        let foundValIdx = -1;
        for (let i = parts.length - 1; i >= 0; i--) {
          const rawPart = parts[i].replace(",", ".");
          const parsed = parseFloat(rawPart);
          if (!isNaN(parsed) && /^-?\d+(\.\d+)?$/.test(rawPart)) {
            valStr = rawPart;
            foundValIdx = i;
            break;
          }
        }

        if (foundValIdx !== -1) {
          const rest = parts.filter((_, ip) => ip !== foundValIdx);
          nameStr = rest.join(" ");
        }
      } else {
        // Se for linha de texto contínua sem formatação clara, tenta extrair o número ao final
        const regexMatch = trimmed.match(/(.*?)\s+([-+]?\d+[\.,]\d+|[-+]?\d+)$/);
        if (regexMatch) {
          nameStr = regexMatch[1].trim();
          valStr = regexMatch[2].trim().replace(",", ".");
        }
      }

      const scoreVal = parseFloat(valStr);
      if (isNaN(scoreVal)) {
        unmatchedLines.push(`Linha ${idx + 1}: Sem nota encontrada em ("${trimmed}")`);
        return;
      }

      // Procurar time correspondente pelo nome, slug ou dono de forma bem tolerante
      const searchKey = normalize(nameStr);
      if (!searchKey) return;

      const matched = PARTICIPANTS.find(p => {
        const slugKey = normalize(p.slug);
        const nameKey = normalize(p.name);
        const ownerKey = normalize(p.owner);
        return slugKey === searchKey ||
               nameKey === searchKey ||
               ownerKey === searchKey ||
               slugKey.includes(searchKey) ||
               searchKey.includes(slugKey) ||
               nameKey.includes(searchKey) ||
               searchKey.includes(nameKey);
      });

      if (matched) {
        newScores[matched.slug] = Number(scoreVal.toFixed(2));
        matches++;
      } else {
        unmatchedLines.push(`Linha ${idx + 1}: Não mapeado ("${nameStr}" com nota ${scoreVal})`);
      }
    });

    setLocalScores(newScores);
    setPasteFeedback(unmatchedLines);

    if (matches > 0) {
      setPasteAreaContent(""); // Limpa para dar feedback visual
      setStatusMessage({
        type: "success",
        text: `Excelente! Associamos com sucesso ${matches} times da sua planilha. As notas foram carregadas temporariamente na tabela abaixo. Clique no botão "Salvar Notas Permanentes" no pé para consolidar no campeonato!`
      });
    } else {
      setStatusMessage({
        type: "error",
        text: "Infelizmente nenhum time pôde ser detectado. Lembre-se de colar do Excel contendo o Nome do Time/Dono e a Pontuação ao lado."
      });
    }
  };

  // Salvar alterações de forma persistente no servidor
  const handleSaveScores = async () => {
    setSaveLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/sync/rodada/${selectedRound}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manualScores: localScores })
      });

      if (!response.ok) {
        throw new Error(`Servidor rejeitou gravação: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setStatusMessage({
          type: "success",
          text: `Sucesso! Pontuações da Rodada ${selectedRound} salvas e persistidas no servidor com total segurança! Classificação geral atualizada.`
        });
        onSyncTrigger(); // Notifica app principal
      } else {
        throw new Error("Resposta sem êxito do servidor de arquivos.");
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Falha ao persistir no servidor: ${err.message}` });
    } finally {
      setSaveLoading(false);
    }
  };

  // Metodo alternativo automático se a Globo/CORS permitir no dia
  const handleCrawlCartola = async () => {
    setCrawlLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/sync/rodada/${selectedRound}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Erro de resposta HTTP: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        const obtained = result.scores || {};
        const combined = { ...localScores };
        PARTICIPANTS.forEach(p => {
          if (obtained[p.slug] !== undefined) {
            combined[p.slug] = obtained[p.slug];
          }
        });
        setLocalScores(combined);
        setStatusMessage({
          type: "success",
          text: `Varredura automática da Globo processada! Revises as notas obtidas e clique em "Salvar Notas Permanentes" logo abaixo.`
        });
      } else {
        throw new Error("Erro de processo de sincronização direta.");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "Sincronização automática direta bloqueada temporariamente pela Globo (CORS/Rate limit). Por favor, use a Área de Copiar e Colar do Excel abaixo, que é 100% garantida e livre de erros!"
      });
    } finally {
      setCrawlLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "SoCamisa10" && password === "AtualizacaoDadosAPPc10") {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Usuário ou senha inválidos. Tente novamente.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-charcoal-card border border-gold/20 rounded-3xl shadow-2xl backdrop-blur-md text-white animate-fadeIn">
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gold/10 border border-gold/30 text-gold shadow-lg shadow-gold/5">
            <Settings className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-xl font-black font-display uppercase tracking-wider text-white">Central do Administrador</h2>
          <p className="text-xs text-slate-400 leading-normal">
            Área de acesso restrito para gerenciamento de ligas, copas, notas e visibilidade do aplicativo.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">Usuário</label>
            <input
              type="text"
              placeholder="Digite o login..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">Senha</label>
            <input
              type="password"
              placeholder="Digite a senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold"
              required
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-400 font-mono text-center mt-1 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gold hover:bg-gold/90 text-charcoal-dark font-display font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-gold/15 cursor-pointer mt-2"
          >
            Confirmar Acesso
          </button>
        </form>
      </div>
    );
  }

  // Filtragem rápida da tabela
  const filteredParticipants = PARTICIPANTS.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q) || p.slug.includes(q);
  });

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      
      {/* TÍTULO PRINCIPAL E INTRO */}
      <div className="p-6 bg-charcoal-dark/30 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
            <span className="text-[10px] tracking-widest font-mono text-gold font-bold uppercase">Painel Administrativo Simplificado</span>
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-wider text-white">Central de Notas & Lançamentos</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Insira ou modifique as notas calculadas em campo. Você pode copiar e colar do Excel em 1-Clique ou digitar na lista abaixo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase">Gerenciar Rodada:</label>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(parseInt(e.target.value) || 17)}
            className="px-4 py-2 bg-charcoal-dark border border-gold/40 rounded-xl text-gold font-display font-black text-sm outline-none cursor-pointer focus:border-gold"
          >
            {[17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].map((r) => (
              <option key={r} value={r} className="bg-charcoal-dark">Rodada {r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PAINEL DE VISIBILIDADE DE CAMPEONATOS & SIMULADORES */}
      <section className="p-6 bg-charcoal-dark border border-white/5 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <Settings className="w-6 h-6 text-gold" />
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
              Painel de Controle de Recursos & Visibilidade das Abas
            </h3>
            <p className="text-xs text-slate-400">
              Gerencie instantaneamente quais abas de campeonatos e ferramentas de simulação estão visíveis e liberadas para os usuários.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TOGGLE COPA M10 */}
          <div className="p-4 rounded-xl border bg-black/10 border-white/5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-300 font-bold block">Exibir Copa M10</span>
              <p className="text-[10px] text-slate-400 leading-snug">
                Ativa ou oculta a aba da Copa M10 no menu de navegação.
              </p>
            </div>
            <button
              id="btn-toggle-m10"
              onClick={() => onM10EnabledChange(!isM10Enabled)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all duration-250 cursor-pointer ${
                isM10Enabled
                  ? "bg-emerald-500 text-charcoal-dark shadow-lg shadow-emerald-500/10 hover:bg-emerald-400"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              }`}
            >
              {isM10Enabled ? "Ativo" : "Inativo"}
            </button>
          </div>

          {/* TOGGLE COPA B10 */}
          <div className="p-4 rounded-xl border bg-black/10 border-white/5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-300 font-bold block">Exibir Copa B10</span>
              <p className="text-[10px] text-slate-400 leading-snug">
                Ativa ou oculta a aba da Copa B10 no menu de navegação.
              </p>
            </div>
            <button
              id="btn-toggle-b10"
              onClick={() => onB10EnabledChange(!isB10Enabled)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all duration-250 cursor-pointer ${
                isB10Enabled
                  ? "bg-emerald-500 text-charcoal-dark shadow-lg shadow-emerald-500/10 hover:bg-emerald-400"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              }`}
            >
              {isB10Enabled ? "Ativo" : "Inativo"}
            </button>
          </div>

          {/* TOGGLE SIMULADORES */}
          <div className="p-4 rounded-xl border bg-black/10 border-white/5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-300 font-bold block">Simuladores de Copas</span>
              <p className="text-[10px] text-slate-400 leading-snug">
                Bloqueia ou libera a edição de chaves e simulação manual para os usuários.
              </p>
            </div>
            <button
              id="btn-toggle-simulators"
              onClick={() => onSimulatorsEnabledChange(!isSimulatorsEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all duration-250 cursor-pointer ${
                isSimulatorsEnabled
                  ? "bg-emerald-500 text-charcoal-dark shadow-lg shadow-emerald-500/10 hover:bg-emerald-400"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              }`}
            >
              {isSimulatorsEnabled ? "Liberado" : "Bloqueado"}
            </button>
          </div>
        </div>
      </section>

      {/* STATUS & FEEDBACK DYNAMIC ALERTS */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fadeIn ${
          statusMessage.type === "success" 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
            : "bg-red-500/5 border-red-500/20 text-red-400"
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono font-bold uppercase block">Mensagem do Sistema</span>
            <p className="text-xs mt-0.5 text-slate-200 leading-normal">{statusMessage.text}</p>
          </div>
        </div>
      )}

      {/* METODOLOGIA 1: IMPORTAR DA PLANILHA (O VERDADEIRO SALVA-VIDAS) */}
      <section className="p-6 bg-charcoal-dark border border-white/5 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <FileSpreadsheet className="w-6 h-6 text-gold" />
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
              Sincronia Rápida: Copiar e Colar do Excel / Google Sheets
            </h3>
            <p className="text-xs text-slate-400">
              Copie as colunas de times e notas da sua planilha e cole abaixo. O sistema associa os dados automaticamente!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-2">
            <textarea
              value={pasteAreaContent}
              onChange={(e) => setPasteAreaContent(e.target.value)}
              placeholder="Exemplo de conteúdo aceito (basta copiar do seu Excel e colar completo):

Sovaco da Pantera   82.15
Onodi Floripa       74.50
Fernando Anselmo   Real Barreiros FC   66.90"
              rows={5}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold leading-relaxed"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">
                Suporta quebras de linha e separadores tradicionais de Excel.
              </span>
              <button
                type="button"
                onClick={handleSpreadsheetImport}
                className="px-5 py-2.5 bg-gold text-charcoal-dark hover:bg-gold/90 rounded-xl transition font-display font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Identificar Dados do Excel
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-xs space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">✓ Vantagens do Copiar/Colar</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-350 leading-relaxed text-[11px]">
                <li>Livre de bloqueios por segurança ou instabilidade da Globo.</li>
                <li>Assegura dados perfeitos exatamente como você computou.</li>
                <li>Evita o desgaste de preencher 50 caixas de texto uma a uma.</li>
              </ul>
            </div>
            
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCrawlCartola}
                disabled={crawlLoading}
                className="text-xs font-mono font-bold text-sky-400 hover:text-sky-305 underline uppercase cursor-pointer disabled:opacity-45"
              >
                {crawlLoading ? "Consultando..." : "Sincronizar da Globo (Auto)"}
              </button>
              <span className="text-[9px] text-[#A0A0A0] uppercase font-mono italic">Método Secundário</span>
            </div>
          </div>
        </div>

        {/* LOGS DE IMPORTAÇÃO PARCIAL DE PLANILHA */}
        {pasteFeedback.length > 0 && (
          <div className="p-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl space-y-1.5 text-[10px] leading-normal font-mono text-slate-350">
            <div className="text-yellow-400 font-extrabold flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-3.5 h-3.5" /> Alguns times não puderam ser associados automaticamente:
            </div>
            <div className="max-h-24 overflow-y-auto space-y-0.5">
              {pasteFeedback.map((fb, fi) => (
                <div key={fi}>&gt; {fb}</div>
              ))}
            </div>
            <span className="block text-[8.5px] text-slate-500 italic mt-1 leading-normal">
              Dica: Você pode preencher as notas desses times específicos manualmente na tabela abaixo sem problemas!
            </span>
          </div>
        )}
      </section>

      {/* METODOLOGIA 1B: GOOGLE SHEETS AUTOMÁTICO (INTEGRAÇÃO COMPLETA) */}
      <section className="p-6 bg-charcoal-dark border border-white/5 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                Sincronização Automatizada via Planilha Google Sheets
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                On-line
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Conecte o painel diretamente à sua planilha do Google Sheets pública. O sistema buscará as pontuações e variações de patrimônio automaticamente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                Link ou ID da Planilha Google Sheets (Acesso: Qualquer pessoa com o link pode ler)
              </label>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0b]/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                  Nome da Aba/Tab (Opcional, ex: Rodada {selectedRound})
                </label>
                <input
                  type="text"
                  placeholder="Deixe em branco para aba padrão"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0b]/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-350 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={syncAllRounds}
                    onChange={(e) => setSyncAllRounds(e.target.checked)}
                    className="rounded border-white/10 bg-black/45 text-emerald-500 focus:ring-emerald-505 w-4 h-4 cursor-pointer"
                  />
                  <span>Sincronizar Todas as Rodadas Relatadas</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSheetsSync}
                disabled={sheetsLoading || !spreadsheetUrl}
                className="px-5 py-2.5 bg-emerald-500 text-charcoal-dark hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 rounded-xl transition font-display font-black text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
              >
                {sheetsLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Sincronizando com Robô...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sincronizar Google Sheets
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-xs space-y-3">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-emerald-400 font-bold block mb-1.5">
                ℹ Instruções para Compartilhamento
              </span>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-[10.5px] leading-relaxed">
                <li>No Google Sheets, clique em <strong className="text-white font-semibold">Compartilhar</strong> (superior direito).</li>
                <li>Mude o acesso geral para <strong className="text-white font-semibold">Qualquer pessoa com o link pode ler (Leitor)</strong>.</li>
                <li>Sua planilha precisa conter uma coluna para identificar os times (ex. <code className="text-emerald-400 font-mono">Time</code> ou <code className="text-emerald-400 font-mono">Nome</code>).</li>
                <li>Ele busca as colunas como <code className="text-emerald-400 font-mono">Pontos</code> (para scores) e <code className="text-emerald-400 font-mono">Patrimônio</code> (para cartoletas).</li>
              </ul>
            </div>

            {sheetsLogs.length > 0 && (
              <div className="p-2.5 bg-black/35 rounded-lg border border-white/5 font-mono text-[9px] text-slate-350 max-h-32 overflow-y-auto space-y-1">
                <span className="text-[8px] text-emerald-500 uppercase font-bold tracking-widest block">Histórico de Conexão:</span>
                {sheetsLogs.map((log, li) => (
                  <div key={li} className="truncate">{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* METODOLOGIA 2: TABELA GERAL MANUAL COM FILTRO */}
      <section className="bg-charcoal-dark border border-white/5 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
              Tabela de Conferência e Edição Direta (Rodada {selectedRound})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ajuste qualquer nota diretamente ou utilize-a para tirar dúvidas de dados mapeados.
            </p>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por time ou dono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0a0a0b]/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* GRID DA TABELA */}
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121213] uppercase font-mono text-[9px] text-slate-400 border-b border-white/5">
              <tr>
                <th className="py-2.5 px-4"># Nº</th>
                <th className="py-2.5 px-4">Clube Associado</th>
                <th className="py-2.5 px-4 text-center w-40">Nota da R{selectedRound}</th>
                <th className="py-2.5 px-4 text-slate-405">Copa Ativa (Simulada)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((p, idx) => {
                  const val = localScores[p.slug] !== undefined ? localScores[p.slug] : "";
                  // Localizar escudo do time
                  const matchingTeam = teams.find(t => t.name.toLowerCase() === p.name.toLowerCase());
                  const shield = matchingTeam?.shieldUrl || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2500/svg" viewBox="0 0 100 100" width="36" height="36"><circle cx="50" cy="50" r="45" fill="%23D4AF37"/><text x="50" y="58" font-family="Arial" font-weight="bold" font-size="20" fill="%23FFFFFF" text-anchor="middle">${encodeURIComponent(p.name.substring(0,2).toUpperCase())}</text></svg>`;

                  return (
                    <tr key={p.slug} className="hover:bg-white/2 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={shield} 
                            alt={p.name} 
                            className="w-7 h-7 rounded-full border border-white/5 bg-slate-800 object-contain shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-100 text-[12px] block">{p.name}</span>
                            <span className="text-[10px] text-slate-450 block font-mono">Dono: {p.owner} • <code className="text-gray-500">{p.slug}</code></span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input
                          type="number"
                          step="0.01"
                          value={val}
                          onChange={(e) => handleScoreChange(p.slug, e.target.value)}
                          className="w-28 px-2 py-1.5 rounded bg-black/45 border border-white/10 text-center font-mono font-bold text-gold focus:outline-none focus:border-gold text-xs"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        {idx < 25 ? (
                          <span className="text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded">Copa M10 Principal</span>
                        ) : (
                          <span className="text-red-400 font-mono text-[9px] bg-red-400/10 px-1.5 py-0.5 rounded">Copa B10 Repescagem</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                    Nenhum time localizado com a pesquisa "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CONTROLES EXTRA DE CONFIGURAÇÃO DE COPAS */}
        <div className="p-4 bg-black/20 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Definições da Copa</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-300">Rodada de Corte:</span>
              <input
                type="number"
                min={1}
                max={38}
                value={cutRound}
                onChange={(e) => onCutRoundChange(Math.max(1, Math.min(38, parseInt(e.target.value) || 20)))}
                className="w-16 px-1.5 py-1 rounded bg-black border border-gold/30 text-center font-mono font-black text-gold text-xs"
              />
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              A rodada limite na qual os piores 25 times são redirecionados para a Copa B10.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Temas Dinâmicos (SaaS)</span>
            <div className="flex gap-1.5 mt-1.5">
              {[
                { id: "gold", color: "#ff6b35" },
                { id: "emerald", color: "#10B981" },
                { id: "ruby", color: "#EF4444" },
                { id: "neon", color: "#D946EF" }
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onThemeChange(th.id)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${theme === th.id ? "border-white" : "border-transparent"}`}
                  style={{ backgroundColor: th.color }}
                  title={`Tema: ${th.id}`}
                />
              ))}
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              Selecione o esquema de cores para o painel geral do sócio.
            </p>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={handleSaveScores}
              disabled={saveLoading || crawlLoading}
              className="w-full py-3 bg-gold hover:bg-gold/90 text-charcoal-dark font-display font-black text-xs uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/15"
            >
              {saveLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saveLoading ? "Salvando..." : `Salvar Notas Permanentes (R${selectedRound})`}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
