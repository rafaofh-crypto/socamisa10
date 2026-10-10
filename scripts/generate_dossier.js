import fs from "fs";
import path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber
} from "docx";

// Paleta de Cores
const COLOR_PRIMARY = "0F172A";    // Slate 900 (Azul escuro nobre)
const COLOR_SECONDARY = "1E293B";  // Slate 800
const COLOR_GOLD = "B45309";       // Ouro escuro refinado para impressão
const COLOR_GOLD_LIGHT = "FEF3C7"; // Ouro fundo suave
const COLOR_EMERALD = "047857";    // Verde esmeralda
const COLOR_EMERALD_BG = "ECFDF5"; // Verde fundo suave
const COLOR_RED = "B91C1C";        // Vermelho escuro
const COLOR_RED_BG = "FEF2F2";     // Vermelho suave
const COLOR_TEXT = "1E293B";       // Texto padrão
const COLOR_MUTED = "475569";      // Texto secundário
const COLOR_LIGHT_GRAY = "F8FAFC"; // Fundo zebra
const COLOR_BORDER = "CBD5E1";     // Bordas neutras

const FONT_FAMILY = "Calibri";

// Helpers para Formatação
function createHeading1(text, options = {}) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 150 },
    ...options
  });
}

function createHeading2(text, options = {}) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    ...options
  });
}

function createHeading3(text, options = {}) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    ...options
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: FONT_FAMILY,
        size: 22, // 11pt
        color: COLOR_TEXT,
        ...(options.run || {})
      })
    ],
    spacing: { after: 120, line: 276 },
    ...options
  });
}

function createBullet(title, description, color = COLOR_TEXT) {
  return new Paragraph({
    children: [
      new TextRun({
        text: "• " + title + ": ",
        bold: true,
        font: FONT_FAMILY,
        size: 22,
        color: color
      }),
      new TextRun({
        text: description,
        font: FONT_FAMILY,
        size: 22,
        color: COLOR_TEXT
      })
    ],
    spacing: { after: 100, line: 276 },
    indent: { left: 360 }
  });
}

function createCalloutBox(title, text, borderColor = COLOR_GOLD, bgColor = COLOR_GOLD_LIGHT) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    bold: true,
                    font: FONT_FAMILY,
                    size: 20,
                    color: borderColor
                  })
                ],
                spacing: { after: 60 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: text,
                    font: FONT_FAMILY,
                    size: 20,
                    color: COLOR_TEXT
                  })
                ],
                spacing: { after: 0, line: 260 }
              })
            ],
            shading: { fill: bgColor },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
              right: { style: BorderStyle.NONE }
            }
          })
        ]
      })
    ]
  });
}

function createTableHeaderCell(text, widthPercent) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: FONT_FAMILY,
            size: 20,
            color: "FFFFFF"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ],
    shading: { fill: COLOR_PRIMARY },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_PRIMARY }
    },
    width: { size: widthPercent, type: WidthType.PERCENTAGE }
  });
}

function createTableCell(text, options = {}) {
  const isAlt = options.isAlt || false;
  const isBold = options.isBold || false;
  const align = options.align || AlignmentType.LEFT;
  const textColor = options.color || COLOR_TEXT;
  const widthPercent = options.widthPercent || 25;

  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: String(text),
            bold: isBold,
            font: FONT_FAMILY,
            size: 20,
            color: textColor
          })
        ],
        alignment: align
      })
    ],
    shading: { fill: isAlt ? COLOR_LIGHT_GRAY : "FFFFFF" },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 2, color: COLOR_BORDER }
    },
    width: { size: widthPercent, type: WidthType.PERCENTAGE }
  });
}

// 50 Times Oficiais
const OFFICIAL_PARTICIPANTS = [
  { rank: 1, owner: "Tiago Fattori", name: "Sovaco da Pantera", slug: "sovaco-da-pantera" },
  { rank: 2, owner: "Rafael Fattori", name: "Onodi Floripa", slug: "onodi-floripa" },
  { rank: 3, owner: "Fernando Anselmo", name: "Real Barreiros FC", slug: "real-barreiros-fc" },
  { rank: 4, owner: "Vitinho", name: "Fortaleza da ilha", slug: "fortaleza-da-ilha" },
  { rank: 5, owner: "HERMES", name: "Jammes Rodriguez", slug: "jammes-rodriguez" },
  { rank: 6, owner: "Evandro Rebelatto", name: "DuduMathias FC", slug: "dudumathias-fc" },
  { rank: 7, owner: "Daniel", name: "Barbeariadc", slug: "barbeariadc" },
  { rank: 8, owner: "Carlos Henrique R. H", name: "Carlao07", slug: "carlao07" },
  { rank: 9, owner: "Renato Galo", name: "CRF GALO", slug: "crf-galo" },
  { rank: 10, owner: "Gean Marques", name: "Camisa Pesada SA", slug: "camisa-pesada-sa" },
  { rank: 11, owner: "Sartori", name: "Chinchila cabeçuda", slug: "chinchila-cabecuda" },
  { rank: 12, owner: "Laion Gomes", name: "Futcafa", slug: "futcafa" },
  { rank: 13, owner: "Fernando Lopes", name: "Fernandoguinho", slug: "fernandoguinho" },
  { rank: 14, owner: "Gabriel Duarte", name: "GD LOMEUSC", slug: "gd-lomeusc" },
  { rank: 15, owner: "Hessmann", name: "Montinho Artilheiro FC", slug: "montinho-artilheiro-fc" },
  { rank: 16, owner: "Fabio Okuno", name: "NINJA DO OCIDENTE", slug: "ninja-do-ocidente" },
  { rank: 17, owner: "Lincoln", name: "LENOCH 'N' ROLL", slug: "lenoch-n-roll" },
  { rank: 18, owner: "Anderson D da Rosa", name: "Dida82 FC", slug: "dida82-fc" },
  { rank: 19, owner: "Angelo Cassol", name: "Dois Vizinhos SA", slug: "dois-vizinhos-sa" },
  { rank: 20, owner: "Dieverson Pereira", name: "Pretinho99 F.C", slug: "pretinho99-f-c" },
  { rank: 21, owner: "Diego a Jorge", name: "C.R.Pirika", slug: "c-r-pirika" },
  { rank: 22, owner: "Chico Pimenta", name: "TeamPimenta", slug: "teampimenta" },
  { rank: 23, owner: "gustavo", name: "lendinhaxx fc", slug: "lendinhaxx-fc" },
  { rank: 24, owner: "Andrey Damasco", name: "Dedeyy Fc", slug: "dedeyy-fc" },
  { rank: 25, owner: "Tiago Melo", name: "Rivers of Babylon", slug: "rivers-of-babylon" },
  { rank: 26, owner: "José Bereta", name: "JBERETTA", slug: "jberetta" },
  { rank: 27, owner: "Everton Samir", name: "Everton UltraMaratonista F.C", slug: "everton-ultramaratonista-f-c" },
  { rank: 28, owner: "Ricardo Bittencourt", name: "kaka F C", slug: "kaka-f-c" },
  { rank: 29, owner: "Henrique Augusto Rau", name: "Mazanza Futebol Clube", slug: "mazanza-futebol-clube" },
  { rank: 30, owner: "Gabriel Alvarez", name: "Avaih F C", slug: "avaih-f-c" },
  { rank: 31, owner: "Everton Ribeiro", name: "Ribeiro Copeiro 84 F.C", slug: "ribeiro-copeiro-84-f-c" },
  { rank: 32, owner: "dudu", name: "marixco fc", slug: "marixco-fc" },
  { rank: 33, owner: "Bruno buske", name: "capita Buske", slug: "capita-buske" },
  { rank: 34, owner: "Carlos Augusto", name: "Avahy Costa da Lagoa", slug: "avahy-costa-da-lagoa" },
  { rank: 35, owner: "ArthureHeitorHermes", name: "Abedaozinho", slug: "abedaozinho" },
  { rank: 36, owner: "WIllian Alexandre", name: "Rolo Compressor 4Lib", slug: "rolo-compressor-4lib" },
  { rank: 37, owner: "Alexandre De Sousa", name: "Tainha Ovada FC", slug: "tainha-ovada-fc" },
  { rank: 38, owner: "Marcelo", name: "Monges tibetanos FC", slug: "monges-tibetanos-fc" },
  { rank: 39, owner: "Dyego", name: "Floripamengao", slug: "floripamengao" },
  { rank: 40, owner: "Abedao", name: "Abedao", slug: "abedao" },
  { rank: 41, owner: "Cassio", name: "FURACÃO K7 FC", slug: "furacao-k7-fc" },
  { rank: 42, owner: "Fernando Reis Silva", name: "DIFERENCIAL F.C.", slug: "diferencial-f-c" },
  { rank: 43, owner: "Agnaldo Garceis", name: "Gui FiFla", slug: "gui-fifla" },
  { rank: 44, owner: "Chico Machado", name: "Delirio Futebol e Festa", slug: "delirio-futebol-e-festa" },
  { rank: 45, owner: "roger_futz", name: "campecheiro_futz", slug: "campecheiro-futz" },
  { rank: 46, owner: "alfradique -sc", name: "dique-sc", slug: "dique-sc" },
  { rank: 47, owner: "Robson Valério", name: "Casquinha EC", slug: "casquinha-ec" },
  { rank: 48, owner: "China Oliveira", name: "E C CASCALHO", slug: "e-c-cascalho" },
  { rank: 49, owner: "Luizep Guardiola", name: "Figueirense FC o maior", slug: "figueirense-fc-o-maior" },
  { rank: 50, owner: "Maykel Jesus Silva", name: "Brazzers MKL FC", slug: "brazzers-mkl-fc" }
];

async function generateDossier() {
  console.log("Iniciando geração do Dossiê Oficial Só Camisa 10...");

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 22,
            color: COLOR_TEXT
          }
        }
      },
      paragraphStyles: [
        {
          id: HeadingLevel.HEADING_1,
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: FONT_FAMILY,
            size: 32, // 16pt
            bold: true,
            color: COLOR_PRIMARY
          },
          paragraph: {
            spacing: { before: 360, after: 140 }
          }
        },
        {
          id: HeadingLevel.HEADING_2,
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: FONT_FAMILY,
            size: 26, // 13pt
            bold: true,
            color: COLOR_GOLD
          },
          paragraph: {
            spacing: { before: 240, after: 100 }
          }
        },
        {
          id: HeadingLevel.HEADING_3,
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: FONT_FAMILY,
            size: 22, // 11pt
            bold: true,
            color: COLOR_SECONDARY
          },
          paragraph: {
            spacing: { before: 180, after: 80 }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "DOSSIÊ OFICIAL DO SISTEMA • LIGA SÓ CAMISA 10 (TEMPORADA 2026)",
                    font: FONT_FAMILY,
                    size: 16,
                    color: COLOR_MUTED
                  })
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 }
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Liga Só Camisa 10 2026  |  Documento de Homologação  |  Página ",
                    font: FONT_FAMILY,
                    size: 16,
                    color: COLOR_MUTED
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 16,
                    color: COLOR_MUTED,
                    bold: true
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children: [
          // ==================== CAPA DO DOSSIÊ ====================
          new Paragraph({
            children: [
              new TextRun({
                text: "LIGA SÓ CAMISA 10 • TEMPORADA 2026",
                font: FONT_FAMILY,
                size: 24,
                bold: true,
                color: COLOR_GOLD
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "DOSSIÊ TÉCNICO, REGULAMENTAR E OPERACIONAL",
                font: FONT_FAMILY,
                size: 44, // 22pt
                bold: true,
                color: COLOR_PRIMARY
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Relatório Completo de Arquitetura de Software, Gestão de Dados, Regulamento das Copas, Premiações e o Fenômeno da Gazeta C10",
                font: FONT_FAMILY,
                size: 24,
                italics: true,
                color: COLOR_MUTED
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          createCalloutBox(
            "Certificação e Homologação da Liga",
            "Este documento oficializa o funcionamento integral da plataforma SaaS desenvolvida para a Liga Só Camisa 10. Ele detalha a superação dos bloqueios da API oficial do Cartola FC, o início do desenvolvimento retroativo a partir da Rodada 18, a lógica minuciosa das Copas (Copa M10 e Copa B10), a mecânica da premiação financeira e o guia técnico de todas as abas e recursos do sistema.",
            COLOR_GOLD,
            COLOR_GOLD_LIGHT
          ),

          new Paragraph({ spacing: { after: 200 } }),

          // Tabela de Metadados do Documento
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Propriedade", 35),
                  createTableHeaderCell("Informação Homologada", 65)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Organização Oficial", { isBold: true }),
                  createTableCell("Comissão Organizadora Só Camisa 10 2026")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Total de Participantes", { isBold: true, isAlt: true }),
                  createTableCell("50 Clubes e Cartoleiros de Elite (Inscrições Blindadas)", { isAlt: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Ambiente e Rastreabilidade", { isBold: true }),
                  createTableCell("AI Studio Cloud Run Engine / Node.js Express / Vite React SPA")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Status Atual de Rodadas", { isBold: true, isAlt: true }),
                  createTableCell("28 Rodadas Consolidadas em Disco (Previsão de 38 Rodadas)", { isAlt: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("Data do Relatório", { isBold: true }),
                  createTableCell("Temporada 2026 (Atualizado e Válido para a R28/R29)")
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 400 } }),

          // ==================== 1. SUMÁRIO EXECUTIVO ====================
          createHeading1("1. SUMÁRIO EXECUTIVO E VISÃO GERAL"),
          createParagraph(
            "A Liga Só Camisa 10 representa um dos ecossistemas de maior prestígio e competitividade do Cartola FC no Brasil. Com 50 cartoleiros rigorosamente selecionados, o campeonato foi estruturado para premiar não apenas a estabilidade ao longo das 38 rodadas do Brasileirão, mas também a emoção eliminatória, a resiliência em confrontos de ida e volta, e a resenha esportiva semanal entre amigos."
          ),
          createParagraph(
            "Para suportar uma estrutura desse porte — com múltiplos torneios paralelos, disputas de turnos, copas inspiradas na Copa do Mundo e na Copa do Brasil, premiações por mês e destaques individuais —, desenvolveu-se uma plataforma web personalizada com alta fidelidade visual, geração de artes gráficas automatizadas para redes sociais e um jornal satírico próprio: a aclamada Gazeta C10."
          ),
          createParagraph(
            "Este dossiê registra detalhadamente todas as decisões de produto e engenharia, as dificuldades enfrentadas, as regras consolidadas e as lições aprendidas."
          ),

          // ==================== 2. O QUE DEU CERTO VS. O QUE NÃO DEU CERTO ====================
          createHeading1("2. O QUE DEU CERTO E O QUE NÃO DEU CERTO (A SAGA DA API DA GLOBO)"),
          createParagraph(
            "Todo grande projeto de tecnologia é marcado por hipóteses iniciais que se mostram inviáveis no mundo real e por pivots arquiteturais que salvam a operação. Abaixo está o raio-x transparente do que falhou e do que obteve êxito absoluto:"
          ),

          createHeading2("2.1. O que NÃO Deu Certo: O Fracasso da API Oficial do Cartola FC"),
          createParagraph(
            "No planejamento original da plataforma, o objetivo era consumir de forma 100% automatizada e direta a API oficial do Cartola FC disponibilizada pelo Grupo Globo (api.cartolafc.globo.com). No entanto, dezenas de barreiras técnicas e de segurança tornaram esse caminho inviável:"
          ),
          createBullet(
            "Bloqueio Severo de CORS no Navegador",
            "Os servidores da Globo aplicam políticas de Cross-Origin Resource Sharing extremamente restritivas. Nenhuma aplicação web externa rodando em navegadores modernos consegue realizar requisições diretas de clientes sem ser imediatamente bloqueada pelo browser."
          ),
          createBullet(
            "Autenticação Proprietária e Instável (GLBID)",
            "Para acessar dados detalhados de ligas privadas, a Globo exige cookies de autenticação de sessão (GLBID e tokens OAuth de usuário logado na Conta Globo). Esses tokens expiram em poucas horas, exigem captchas interativos e sofrem renovações de segurança frequentes, quebrando qualquer robô ou script em segundo plano."
          ),
          createBullet(
            "Ausência de Endpoints Rodada a Rodada para Ligas Privadas",
            "A API da Globo não oferece um endpoint histórico consolidado onde se possa consultar, de uma só vez, a pontuação de cada um dos 50 times na rodada 1, rodada 2, rodada 3, etc. A API apenas entrega as parciais da rodada em andamento e o somatório geral acumulado. Qualquer recálculo ou auditoria de fases passadas ficaria refém de adivinhações."
          ),
          createBullet(
            "Rate Limiting Implacável e Bloqueio de IP por WAF/Cloudflare",
            "Quando tentamos contornar o problema através de proxies reversos e servidores intermediários, os IPs dos servidores de nuvem passaram a receber respostas HTTP 429 (Too Many Requests) e desafios automáticos do Cloudflare/Akamai, gerando páginas de erro 403 e derrubando a sincronização exatamente nos momentos de pico (fechamento de mercado e pós-jogos)."
          ),
          createBullet(
            "Atrasos e Reprocessamentos Voláteis da Globo",
            "Mesmo quando requisições pontuais funcionavam, a Globo costuma alterar scouts de assistências e cartões até 48 horas após as partidas. Ficar conectado diretamente à API gerava dados parciais que mudavam de forma imprevisível e geravam desconfiança entre os competidores da liga."
          ),

          createHeading2("2.2. O que DEU Certo: A Nova Arquitetura Vencedora"),
          createParagraph(
            "Diante dos bloqueios intransponíveis da Globo, abandonamos a dependência da API ao vivo e pivotamos para um motor de dados híbrido e autônomo, desenhado para tolerância a falhas e velocidade extrema:"
          ),
          createBullet(
            "Pipeline ETL com Google Sheets como Fonte Mestra",
            "Os administradores da liga já mantinham uma planilha oficial no Google Sheets com pontuações e patrimônios conferidos manualmente. Construímos um pipeline ETL (Extract, Transform, Load) que baixa o arquivo em formato CSV via endpoint seguro do Google, processa cabeçalhos complexos de rodadas duplas e valida os dados em menos de 2 segundos."
          ),
          createBullet(
            "Bancos de Dados Locais em JSON por Rodada",
            "Cada rodada sincronizada é salva em arquivos JSON dedicados no disco do servidor (round1_scores_db.json até round28_scores_db.json, acompanhados de round*_patrimonio_db.json). Isso garante persistência estática imutável, tempos de resposta inferiores a 10 milissegundos e auditoria transparente."
          ),
          createBullet(
            "Algoritmo de Normalização e Correspondência Inteligente",
            "Para evitar que divergências de digitação quebrassem o sistema (ex: acentos, letras maiúsculas, variações de apelidos), desenvolvemos um algoritmo de fuzzy match e normalização NFD que reconhece os times por slug canônico, nome oficial do time ou nome do cartoleiro, associando 100% dos 50 clubes automaticamente."
          ),
          createBullet(
            "Resiliência com Triplo Fallback e Modo Offline",
            "Se o Google Sheets estiver fora do ar ou sem internet, o sistema não cai. Ele consulta o cache em memória do Node.js, recorre aos arquivos JSON no disco ou, no cliente, utiliza o LocalStorage do navegador. O usuário nunca se depara com tela em branco."
          ),
          createBullet(
            "Automação Completa dos Chaveamentos das Copas",
            "O sorteio de grupos da Copa M10, o chaveamento da Copa B10, a computação dos confrontos de 180 minutos e a aplicação dos critérios de desempate deixaram de ser feitos no papel e passaram a ser gerados matematicamente pelo motor knockout.ts, eliminando polêmicas."
          ),
          createBullet(
            "Geração de Cards Sociais em Alta Resolução (Chassi Card)",
            "A possibilidade de exportar imagens em um clique com os destaques da rodada, os pódios mensais e os chaveamentos transformou a comunicação da liga no WhatsApp e Instagram."
          ),

          // ==================== 3. O DESAFIO DO CAMPEONATO ANDANDO ====================
          createHeading1("3. O DESAFIO DO CAMPEONATO ANDANDO (INÍCIO NA RODADA 18)"),
          createParagraph(
            "Outro fator crítico na história deste sistema é que a sua engenharia de software não começou na pré-temporada. Quando a primeira linha de código foi escrita, o Campeonato Brasileiro de 2026 já estava em plena 18ª rodada!"
          ),
          createParagraph(
            "Isso impôs desafios complexos de compatibilidade e retroatividade:"
          ),
          createBullet(
            "Mineração e Reconstrução Histórica das Rodadas 1 a 17",
            "Foi necessário minerar todos os relatórios arquivados, planilhas dispersas e históricos para reconstruir, com precisão centesimal, as pontuações e a evolução do patrimônio de cada um dos 50 participantes desde a Rodada 1 até a Rodada 17."
          ),
          createBullet(
            "Integridade Matemática Estrita",
            "A soma das pontuações retroativas geradas para as rodadas 1 a 18 precisava bater exatamente com o acumulado oficial registrado pelos cartoleiros. Qualquer erro de 0,1 ponto desvirtuaria a tabela e invalidaria o retrospecto do 1º Turno."
          ),
          createBullet(
            "Homologação dos Campeões Mensais Anteriores",
            "Os meses de Janeiro, Fevereiro, Março, Abril, Maio e Junho já haviam sido disputados na vida real. O sistema precisou reconhecer retroativamente os vencedores desses meses no módulo de Recopa Mensal para que o histórico do ano ficasse 100% completo e fidedigno."
          ),
          createBullet(
            "Transição Suave para a Copa M10",
            "Com o sistema entrando em operação estável na virada do turno (Rodadas 18 e 19), os participantes puderam acompanhar a emocionante Rodada de Corte (Rodada 20) e a Rodada do Esperneio (Rodada 21) já com o chaveamento automático plenamente funcional!"
          ),

          // ==================== 4. ARQUITETURA DO SISTEMA ====================
          createHeading1("4. ARQUITETURA DO SISTEMA E FLUXO DE DADOS"),
          createParagraph(
            "O sistema opera sob uma arquitetura moderna full-stack, orientada a micro-serviços integrados em monorepo, priorizando renderização rápida, imutabilidade de dados e portabilidade:"
          ),
          createBullet(
            "Frontend (Client)",
            "Construído em React 18 com TypeScript, empacotado pelo Vite. Utiliza Tailwind CSS com design dark premium, Lucide Icons para iconografia esportiva e Framer Motion / Motion React para transições de tela e animações de chaveamento."
          ),
          createBullet(
            "Backend (Server)",
            "Desenvolvido em Node.js com Express (server.ts), executando tanto a API REST de consulta quanto o servidor de desenvolvimento e proxies de sincronização. Comunica-se com o sistema de arquivos local para leitura e escrita dos bancos JSON."
          ),
          createBullet(
            "Motor de Persistência",
            "Base de dados desacoplada em arquivos JSON estáticos (round{N}_scores_db.json e round{N}_patrimonio_db.json). Essa escolha garante que mesmo se o servidor for reiniciado ou migrado de container, os dados consolidados permanecem intocados."
          ),
          createBullet(
            "Motor de Sorteio e Bracket (tournamentData.ts / knockout.ts)",
            "Implementação de algoritmos clássicos de chaveamento (incluindo Fisher-Yates para cruzamento de potes), cálculo agregado de 180 minutos (ida e volta) e regras de avanço automático de vencedores de confrontos."
          ),
          createBullet(
            "Geração Gráfica de Cards (socialGenerator.ts)",
            "Canvas e utilitários que desenham sobre o chassi oficial da liga (CHASSI_CARD_DESTAQUES_DA_RODADA.png) e exportam imagens em formato PNG/JPEG com proporções otimizadas para Stories do Instagram e mensagens de WhatsApp."
          ),

                    // ==================== 5. O PAPEL DO GITHUB E DA VERCEL ====================
          createHeading1("5. O PAPEL DO GITHUB E DA VERCEL NA INFRAESTRUTURA"),
          createParagraph(
            "Para manter a plataforma da Liga Só Camisa 10 no ar com 99,9% de disponibilidade, alta velocidade e custo de infraestrutura praticamente nulo, o sistema foi desenhado separando com clareza o armazenamento do código e a sua distribuição para os usuários finais. Essa arquitetura moderna é sustentada por dois pilares fundamentais: o GitHub e a Vercel."
          ),

          createHeading2("5.1. O Papel do GitHub: O Cofre Seguro e o Controle de Versão"),
          createParagraph(
            "O GitHub atua como a certidão de nascimento, a fortaleza e o centro de governança técnica de todo o projeto:"
          ),
          createBullet(
            "Repositório Central na Nuvem",
            "Nenhuma linha de código, lógica de pontuação, fórmula de desempate ou imagem de escudo fica dependente do computador pessoal de um único desenvolvedor ou administrador. Todo o ecossistema está salvo e replicado nos servidores seguros do GitHub."
          ),
          createBullet(
            "Linha do Tempo e Controle de Versão (Git)",
            "Cada melhoria, nova regra implementada ou correção de scout gera um registro histórico imutável (commit). Caso qualquer falha ou comportamento inesperado ocorra durante uma rodada, a equipe de engenharia pode acionar um rollback imediato, restaurando o sistema para uma versão estável anterior em questão de segundos."
          ),
          createBullet(
            "Gatilho Contínuo de Deploy (CI/CD via Webhooks)",
            "O GitHub está integrado diretamente à infraestrutura da Vercel por meio de webhooks automatizados. Assim que o código é atualizado na branch principal (main), o GitHub notifica a Vercel instantaneamente para iniciar a publicação sem qualquer intervenção humana."
          ),

          createHeading2("5.2. O Papel da Vercel: A Hospedagem Global, Edge Network e Zero Downtime"),
          createParagraph(
            "A Vercel é a plataforma de nuvem que transforma os arquivos de código-fonte em um aplicativo web rápido, robusto e acessível no celular e no computador de qualquer um dos 50 participantes:"
          ),
          createBullet(
            "Compilação e Deploy Automatizado (Build & Deploy)",
            "Ao receber a notificação do GitHub, a Vercel executa os scripts de compilação (npm run build), otimiza os pacotes do React 18 e Vite, gera os arquivos estáticos minificados e realiza o deploy em produção em aproximadamente 30 a 60 segundos."
          ),
          createBullet(
            "Zero Downtime (Disponibilidade Contínua)",
            "A troca entre a versão anterior e a nova versão no ar é instantânea e invisível para quem está navegando. Os participantes da liga nunca encontram a mensagem de site fora do ar para manutenção."
          ),
          createBullet(
            "Edge Network Global e Servidores no Brasil",
            "A Vercel distribui a aplicação em centenas de pontos de presença (CDNs) espalhados pelo mundo, com servidores locais no Brasil (região de São Paulo). Isso significa que, nos domingos à noite — momento em que todos os 50 cartoleiros acessam a plataforma ao mesmo tempo para conferir os resultados —, as páginas carregam em milissegundos."
          ),
          createBullet(
            "Certificados SSL/HTTPS e Segurança Automática",
            "Toda a comunicação é criptografada automaticamente de ponta a ponta com certificados de segurança SSL renovados sem custo, garantindo total privacidade e autenticidade para os acessos."
          ),
          createBullet(
            "Compatibilidade com o Sincronizador Serverless",
            "A plataforma foi otimizada para o modelo serverless da Vercel, suportando tanto o modo de servidor Node.js quanto o modo de sincronização direta no navegador via CORS com o Google Sheets, garantindo funcionamento ininterrupto mesmo sem servidores dedicados caros."
          ),

          createHeading2("5.3. O Ciclo Operacional Integrado: Do Código ao Cartoleiro"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Etapa do Fluxo", 25),
                  createTableHeaderCell("Plataforma Responsável", 30),
                  createTableHeaderCell("Ação Executada no Sistema", 45)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("1. Armazenamento & Versão", { isBold: true }),
                  createTableCell("GitHub (Repositório)"),
                  createTableCell("Guarda o código, audita commits e protege a integridade do projeto.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2. Gatilho de Integração", { isBold: true, isAlt: true }),
                  createTableCell("GitHub Webhooks", { isAlt: true }),
                  createTableCell("Avisa a Vercel em tempo real sobre atualizações na branch main.", { isAlt: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("3. Compilação e Build", { isBold: true }),
                  createTableCell("Vercel Build Engine"),
                  createTableCell("Baixa dependências, roda Vite/TypeScript e valida a integridade do build.")
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("4. Distribuição Global", { isBold: true, isAlt: true }),
                  createTableCell("Vercel Edge Network (CDN)", { isAlt: true }),
                  createTableCell("Replica a aplicação em servidores rápidos com cache inteligente e SSL.", { isAlt: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("5. Acesso do Usuário", { isBold: true }),
                  createTableCell("Navegadores (Mobile/Desktop)"),
                  createTableCell("Os 50 cartoleiros acessam tabelas, copas e a Gazeta C10 em alta velocidade.")
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // ==================== 6. O LIVRO DE REGRAS ====================
          createHeading1("6. O LIVRO DE REGRAS DA LIGA SÓ CAMISA 10 (A CONSTITUIÇÃO)"),
          createParagraph(
            "A transparência é a chave para a longevidade da Liga Só Camisa 10. Para que não haja dúvidas ou litígios na resenha, todas as regras foram compiladas no livro de regras oficial da plataforma:"
          ),
          createBullet(
            "Artigo 1º - A Lei Soberana do Cartola FC",
            "A pontuação computada e oficializada pelo aplicativo oficial do Cartola FC é a única e absoluta verdade jurídica da liga. Scouts questionáveis, assistências duvidosas ou decisões polêmicas de arbitragem de scouts não são passíveis de alteração pela comissão. O que a Globo computar está sacramentado."
          ),
          createBullet(
            "Artigo 2º - Fechamento do Mercado",
            "A escalação de cada equipe deve ser confirmada exclusivamente antes do prazo de fechamento estipulado pelo Cartola FC para cada rodada. O sistema não aceita ajustes manuais pós-fechamento."
          ),
          createBullet(
            "Artigo 3º - Partidas Adiantadas, Atrasadas ou Canceladas",
            "Em caso de jogos adiados pela CBF fora do período oficial da rodada no Cartola FC, segue-se estritamente o critério adotado pela plataforma do Cartola: caso o jogo não pontue para a rodada no app oficial, não pontuará na Liga Só Camisa 10."
          ),
          createBullet(
            "Artigo 4º - Prazos de Consolidação de Scouts",
            "A homologação dos resultados ocorre assim que a Globo encerra a apuração da rodada. Reprocessamentos pontuais de scouts que alterem pontuações antes da abertura do mercado seguinte são refletidos no sistema."
          ),
          createBullet(
            "Artigo 5º - A Rodada 38 e a Blindagem de Dados",
            "Na Rodada 38, o sistema entra em modo de gala final. O painel administrativo desabilita a edição e sincronização de dados históricos, congelando o banco de dados para a posteridade e gerando o Pódio Oficial de Campeões."
          ),

          // ==================== 7. AS COPAS E COMPETIÇÕES DA LIGA ====================
          createHeading1("7. AS COPAS E COMPETIÇÕES DA LIGA (LÓGICA MINUCIOSA)"),
          createParagraph(
            "A Liga Só Camisa 10 não se resume a uma única tabela. Ela abriga quatro frentes simultâneas de disputa, cada uma com mecânica tática e emocional própria:"
          ),

          createHeading2("6.1. Campeonato Geral Acumulado e Disputa de Turnos (38 Rodadas)"),
          createParagraph(
            "O Campeonato Geral é a prova definitiva de consistência. Disputado ao longo das 38 rodadas do Brasileirão por todos os 50 clubes, ele coroa o melhor cartoleiro do ano com base na soma simples de todos os pontos conquistados."
          ),
          createParagraph(
            "Além do título geral acumulado, a competição é fatiada em dois turnos independentes:"
          ),
          createBullet(
            "1º Turno (Rodadas 01 a 19)",
            "Consagra os 3 melhores cartoleiros da primeira metade do campeonato, premiando quem arrancou bem na temporada."
          ),
          createBullet(
            "2º Turno (Rodadas 20 a 38)",
            "Zera a pontuação e inicia uma nova corrida independente para premiar os 3 melhores da segunda metade, permitindo que times que começaram mal reajam e disputem uma premiação expressiva."
          ),

          createHeading2("6.2. Copa M10: O Mundial em Jogo Único (Estilo Copa do Mundo)"),
          createParagraph(
            "A Copa M10 reproduz a atmosfera de um torneio mundial de seleções: tiro curto, alta adrenalina e partidas únicas eliminatórias onde qualquer tropeço é fatal."
          ),
          createBullet(
            "Fase 1: Rodada de Corte (Rodada 20)",
            "Os 50 participantes competem até a Rodada 20. Os 46 melhores no ranking avançam diretamente. Os 12 primeiros colocados gerais tornam-se cabeças de chave protegidos (Grupos A a L). Os times que ficarem entre a 47ª e a 50ª colocação caem na zona de perigo extremo: o Limbo."
          ),
          createBullet(
            "Fase 2: Rodada do Esperneio (Rodada 21)",
            "Disputa dramática de jogo único exclusiva entre os 4 times do Limbo. Os 2 maiores pontuadores da Rodada 21 garantem a sobrevivência e assumem as vagas 47 e 48 da copa. Os 2 piores são sumariamente eliminados das competições mata-mata da temporada."
          ),
          createBullet(
            "Fase 3: Fase de Grupos (Rodadas 22, 23 e 24)",
            "48 equipes divididas em 12 grupos de 4 times (A a L). Cada grupo conta com 1 cabeça de chave e 3 times sorteados pelo algoritmo. São 3 rodadas de confrontos diretos dentro dos grupos. Classificam-se os 1º e 2º colocados de cada grupo (24 times) + os 8 melhores terceiros colocados gerais, totalizando 32 classificados."
          ),
          createBullet(
            "Fase 4: Round of 32 / Dezesseis-avos de Final (Rodada 25)",
            "Início do mata-mata seco em jogo único. 16 confrontos eliminatórios diretos."
          ),
          createBullet(
            "Fase 5: Oitavas de Final (Rodada 26)",
            "Os 16 classificados duelam em partida única."
          ),
          createBullet(
            "Fase 6: Quartas de Final (Rodada 27)",
            "Os 8 sobreviventes batalham por uma vaga entre os quatro melhores."
          ),
          createBullet(
            "Fase 7: Semifinais (Rodada 28)",
            "Duelo entre os 4 semifinalistas valendo a tão sonhada vaga na grande decisão."
          ),
          createBullet(
            "Fase 8: Grande Final e Disputa de 3º Lugar (Rodada 29)",
            "A grande decisão da Copa M10 e a disputa do 3º lugar ocorrem simultaneamente em partida única de gala na Rodada 29, consagrando o Campeão do Mundo Só Camisa 10."
          ),

          createHeading2("6.3. Copa B10: Guerra de 180 Minutos (Agregado de Elite / Copa do Brasil)"),
          createParagraph(
            "Se a Copa M10 é tiro curto, a Copa B10 é o ápice da estratégia, profundidade e resiliência: mata-mata jogado em confrontos de IDA E VOLTA (180 minutos com placar agregado), espelhando o formato dos maiores torneios continentais e da Copa do Brasil."
          ),
          createBullet(
            "Fase 1: Rodada de Corte de Elite (Rodada 25)",
            "Na Rodada 25, a tabela geral divide os 50 clubes em três prateleiras hierárquicas: Elite (1º ao 16º colocado - garantem vaga direta na Fase 4 sem passar pelos play-offs); Acesso (17º ao 46º colocado - 30 clubes que vão para os play-offs preliminares); e Esperneio (47º ao 50º colocado - lanternas que vão para a repescagem)."
          ),
          createBullet(
            "Fase 2: Esperneio da B10 (Rodada 26)",
            "Partida única entre os 4 piores colocados do corte. Apenas os 2 maiores pontuadores da R26 sobrevivem e completam as 32 vagas dos Play-offs do Acesso; os outros 2 são eliminados."
          ),
          createBullet(
            "Fase 3: Play-offs do Acesso (Rodadas 27 e 28 - Ida e Volta)",
            "16 duelos diretos de 180 minutos somando os pontos da R27 e R28. Os 16 vencedores no agregado conquistam o acesso à Fase 4."
          ),
          createBullet(
            "Fase 4: 16 avos de Final (Rodadas 29 e 30 - Ida e Volta)",
            "O confronto mais esperado: os 16 clubes que estavam descansando na prateleira de Elite enfrentam os 16 classificados dos Play-offs em 180 minutos agregados."
          ),
          createBullet(
            "Fase 5: Oitavas de Final (Rodadas 31 e 32 - Ida e Volta)",
            "180 minutos agregados entre os 16 melhores."
          ),
          createBullet(
            "Fase 6: Quartas de Final (Rodadas 33 e 34 - Ida e Volta)",
            "180 minutos agregados definindo o G4 da Copa B10."
          ),
          createBullet(
            "Fase 7: Semifinais (Rodadas 35 e 36 - Ida e Volta)",
            "180 minutos agregados definindo os dois grandes finalistas."
          ),
          createBullet(
            "Fase 8: Grande Final e Disputa de 3º Lugar (Rodada 37 - Jogo Único)",
            "Para encerrar em clima de decisão épica antes do encerramento final do Brasileirão na R38, a Grande Final e o 3º lugar da Copa B10 são disputados em JOGO ÚNICO na Rodada 37!"
          ),

          createHeading3("Critérios Rígidos de Desempate na Copa B10:"),
          createParagraph(
            "Caso dois times terminem um confronto de 180 minutos empatados rigorosamente na casa dos centésimos de ponto, aplicam-se os seguintes critérios sucessivos:"
          ),
          createBullet(
            "1º Critério",
            "Melhor Semente de Categoria no Corte (Rank de Divisão: Elite > Acesso > Esperneio)."
          ),
          createBullet(
            "2º Critério",
            "Maior Pontuação individual na Rodada de Corte (Rodada 25)."
          ),
          createBullet(
            "3º Critério",
            "Melhor posição na Classificação Geral Acumulada do campeonato."
          ),
          createParagraph(
            "Nota da Arbitragem: O critério de gol qualificado fora de casa não existe na Copa B10. Vale estritamente a pontuação matemática pura do Cartola FC."
          ),

          createHeading2("6.4. Recopa Mensal (Campeonatos Civis)"),
          createParagraph(
            "A cada mês civil (Janeiro a Dezembro), as rodadas que ocorrem dentro do período formam uma mini-tabela independente. Isso mantém a liga aquecida do primeiro ao último dia do ano, permitindo que um cartoleiro que teve um mês ruim possa recomeçar do zero no mês seguinte e brigar pela premiação mensal."
          ),

          createHeading2("6.5. Destaques da Rodada & Mito da Semana"),
          createParagraph(
            "Toda rodada tem seus heróis e seus vilões. O sistema monitora instantaneamente o maior pontuador da rodada (o 'Mito', premiado financeiramente), o menor pontuador (o 'Lanterna' ou 'Pé Frio'), o magnata com maior patrimônio em cartoletas (C$), e quem mais valorizou ou desvalorizou no mercado."
          ),

          // ==================== 8. PREMIAÇÕES EM DINHEIRO ====================
          createHeading1("8. QUADRO OFICIAL E CONSOLIDADO DE PREMIAÇÕES EM DINHEIRO (R$)"),
          createParagraph(
            "A Liga Só Camisa 10 conta com uma das premiações financeiras mais bem distribuídas de todo o cenário fantasy nacional. Nenhum participante fica sem chance de beliscar um prêmio ao longo do ano. Abaixo está a tabela oficial completa dos valores pagos aos vencedores:"
          ),

          createHeading2("7.1. Campeonato Geral Acumulado (Top 10 Final - 38 Rodadas)"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Posição Final", 30),
                  createTableHeaderCell("Título Honorário", 40),
                  createTableHeaderCell("Valor do Prêmio (R$)", 30)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("1º Lugar", { isBold: true }),
                  createTableCell("Campeão Geral da Temporada"),
                  createTableCell("R$ 280,00", { isBold: true, color: COLOR_GOLD, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2º Lugar", { isBold: true, isAlt: true }),
                  createTableCell("Vice-Campeão Geral", { isAlt: true }),
                  createTableCell("R$ 200,00", { isBold: true, isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("3º Lugar", { isBold: true }),
                  createTableCell("Medalha de Bronze Geral"),
                  createTableCell("R$ 180,00", { isBold: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("4º Lugar", { isBold: true, isAlt: true }),
                  createTableCell("4º Colocado Geral", { isAlt: true }),
                  createTableCell("R$ 160,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("5º Lugar", { isBold: true }),
                  createTableCell("5º Colocado Geral"),
                  createTableCell("R$ 120,00", { align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("6º Lugar", { isBold: true, isAlt: true }),
                  createTableCell("6º Colocado Geral", { isAlt: true }),
                  createTableCell("R$ 75,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("7º Lugar", { isBold: true }),
                  createTableCell("7º Colocado Geral"),
                  createTableCell("R$ 60,00", { align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("8º Lugar", { isBold: true, isAlt: true }),
                  createTableCell("8º Colocado Geral", { isAlt: true }),
                  createTableCell("R$ 40,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("9º Lugar", { isBold: true }),
                  createTableCell("9º Colocado Geral"),
                  createTableCell("R$ 40,00", { align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("10º Lugar", { isBold: true, isAlt: true }),
                  createTableCell("10º Colocado Geral (Fechamento do Top 10)", { isAlt: true }),
                  createTableCell("R$ 40,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("TOTAL GERAL", { isBold: true }),
                  createTableCell("10 Clubes Premiados", { isBold: true }),
                  createTableCell("R$ 1.195,00", { isBold: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          createHeading2("7.2. Retrospecto de Turnos (1º Turno [R1-R19] e 2º Turno [R20-R38])"),
          createParagraph(
            "Cada um dos dois turnos do campeonato distribui uma premiação independente para o seu respectivo pódio:"
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Posição no Turno", 35),
                  createTableHeaderCell("Prêmio 1º Turno (R$)", 32),
                  createTableHeaderCell("Prêmio 2º Turno (R$)", 33)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("1º Lugar (Campeão do Turno)", { isBold: true }),
                  createTableCell("R$ 160,00", { isBold: true, color: COLOR_GOLD, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 160,00", { isBold: true, color: COLOR_GOLD, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2º Lugar (Vice-Campeão do Turno)", { isBold: true, isAlt: true }),
                  createTableCell("R$ 110,00", { isAlt: true, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 110,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("3º Lugar (Bronze do Turno)", { isBold: true }),
                  createTableCell("R$ 90,00", { align: AlignmentType.RIGHT }),
                  createTableCell("R$ 90,00", { align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("SUBTOTAL POR TURNO", { isBold: true, isAlt: true }),
                  createTableCell("R$ 360,00", { isBold: true, isAlt: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 360,00", { isBold: true, isAlt: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("TOTAL COMBINADO DOS TURNOS", { isBold: true }),
                  createTableCell("6 Pódios Premiados", { isBold: true }),
                  createTableCell("R$ 720,00", { isBold: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          createHeading2("7.3. Copas Eliminatórias: Copa M10 e Copa B10"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Posição na Copa", 35),
                  createTableHeaderCell("Copa M10 (Mundo)", 32),
                  createTableHeaderCell("Copa B10 (Elite 180 Min)", 33)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("1º Lugar (Campeão da Copa)", { isBold: true }),
                  createTableCell("R$ 300,00 + Troféu 🏆", { isBold: true, color: COLOR_GOLD, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 300,00 + Troféu 🏆", { isBold: true, color: COLOR_GOLD, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("2º Lugar (Vice-Campeão da Copa)", { isBold: true, isAlt: true }),
                  createTableCell("R$ 150,00", { isAlt: true, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 150,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("3º Lugar (Vencedor da Decisão de 3º)", { isBold: true }),
                  createTableCell("R$ 80,00", { align: AlignmentType.RIGHT }),
                  createTableCell("R$ 80,00", { align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("4º Lugar (Semifinalista Derrotado)", { isBold: true, isAlt: true }),
                  createTableCell("R$ 50,00", { isAlt: true, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 50,00", { isAlt: true, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("TOTAL POR COPA", { isBold: true }),
                  createTableCell("R$ 580,00", { isBold: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT }),
                  createTableCell("R$ 580,00", { isBold: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell("TOTAL COMBINADO DAS COPAS", { isBold: true, isAlt: true }),
                  createTableCell("M10 + B10 Integradas", { isBold: true, isAlt: true }),
                  createTableCell("R$ 1.160,00", { isBold: true, isAlt: true, color: COLOR_EMERALD, align: AlignmentType.RIGHT })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          createHeading2("7.4. Recopa Mensal e Destaques da Rodada"),
          createBullet(
            "Premiação Mensal (Cada Mês Civil)",
            "1º Lugar do Mês: R$ 130,00 | 2º Lugar do Mês: R$ 90,00 | 3º Lugar do Mês: R$ 70,00 (Total distribuído por mês: R$ 290,00)."
          ),
          createBullet(
            "Destaque da Rodada (Mito da Semana)",
            "O maior pontuador isolado de cada rodada individual recebe R$ 80,00 em dinheiro!"
          ),
          createBullet(
            "Consagração do Hall da Fama (Glória Eterna na R38)",
            "No Gala da Rodada 38, os campeões máximos são imortalizados: Campeão Geral (R$ 500,00 + Troféu Especial), Campeão da Copa M10 (R$ 300,00 + Troféu) e Campeão da Copa B10 (R$ 300,00 + Troféu)."
          ),

          // ==================== 9. GUIA DE TODAS AS ABAS ====================
          createHeading1("9. GUIA COMPLETO DE CADA ABA E MÓDULO DO SISTEMA"),
          createParagraph(
            "A interface da aplicação foi projetada com arquitetura modular de abas, permitindo navegação rápida entre dados consolidados, chaveamentos e conteúdos editoriais. A seguir, detalhamos o que cada aba faz:"
          ),

          createHeading2("Aba 1: Dashboard (Visão Geral e Classificação Geral)"),
          createParagraph(
            "A Dashboard é a página inicial e coração financeiro da plataforma. Ela apresenta a tabela geral com os 50 participantes, permitindo alternar instantaneamente entre três visões:"
          ),
          createBullet("Geral Acumulado", "Ranking de todas as 38 rodadas com somatório total de pontos."),
          createBullet("1º Turno", "Filtragem estrita das rodadas 01 a 19, exibindo os medalhistas da primeira metade."),
          createBullet("2º Turno", "Filtragem das rodadas 20 a 38, demonstrando a recuperação dos clubes."),
          createParagraph(
            "Além da tabela de classificação com escudos em alta definição e busca por nome de time ou cartoleiro, a Dashboard inclui o 'DashboardSocialCard' — um exportador que gera o banner oficial das premiações ativas do campeonato em formato quadrado ou stories para redes sociais."
          ),

          createHeading2("Aba 2: Copa B10 (Guerra de 180 Minutos)"),
          createParagraph(
            "Módulo dedicado à mais técnica das competições. Oferece visualização segmentada por abas internas:"
          ),
          createBullet("Chaveamento Geral", "A árvore visual completa demonstrando o caminho de cada equipe até a Grande Final na R37."),
          createBullet("Fase 1: Corte de Elite (R25)", "Exibição dos 16 clubes que foram direto para a Elite, os 30 do Acesso e os 4 do Esperneio."),
          createBullet("Fase 2: Esperneio (R26)", "O confronto de repescagem entre os 4 piores para definir quem vai para os play-offs."),
          createBullet("Fase 3: Play-offs do Acesso (R27/R28)", "Os 16 duelos agregados de 180 minutos com cálculo automático de placar de ida e volta."),
          createBullet("Vitrine Premiada de Elite", "Pódio reservado aos campeões da Copa B10."),
          createBullet("Card Social B10", "Gerador de card para compartilhamento dos confrontos e classificados no WhatsApp."),

          createHeading2("Aba 3: Copa M10 / Mata-Mata (O Mundial em Jogo Único)"),
          createParagraph(
            "Módulo focado na Copa M10 estilo Copa do Mundo. Apresenta:"
          ),
          createBullet("Os 12 Grupos (A a L)", "Tabelas de 4 times por grupo com pontuação nas rodadas 22, 23 e 24, indicando claramente classificados e eliminados."),
          createBullet("O Limbo da Rodada 21", "Destaque histórico para quem sobreviveu ao Esperneio da R21."),
          createBullet("Playoff Bracket", "Estrutura interativa do Round of 32 (R25), Oitavas (R26), Quartas (R27), Semifinais (R28) e Super Final (R29)."),
          createBullet("Termômetro de Favoritismo", "Comparativo de pontuações médias para apimentar a rivalidade."),

          createHeading2("Aba 4: Mensal (Recopa Mensal)"),
          createParagraph(
            "Módulo onde o cartoleiro escolhe o mês desejado através de um seletor visual (Janeiro a Dezembro). O sistema carrega exclusivamente as rodadas disputadas no mês civil selecionado, monta a classificação do mês, calcula a oscilação de posições (subiu, desceu ou manteve) e apresenta o Pódio dos 3 premiados do mês com exportador em imagem ('MonthlySocialCard')."
          ),

          createHeading2("Aba 5: Destaques da Rodada"),
          createParagraph(
            "O templo da resenha e das estatísticas individuais. Apresenta um Bento Grid com 6 cards premium:"
          ),
          createBullet("Mito da Rodada", "O maior pontuador isolado (com o selo de campeão e prêmio de R$ 80,00)."),
          createBullet("Lanterna / Pé Frio", "O cartoleiro que teve a menor pontuação da semana."),
          createBullet("Magnata do Patrimônio", "O time com a maior quantidade de cartoletas (C$) acumuladas."),
          createBullet("Maior Valorização", "O cartoleiro que mais ganhou patrimônio na rodada."),
          createBullet("Maior Desvalorização", "Quem mais perdeu cartoletas."),
          createBullet("Médias da Liga", "A média geral de pontuação e estatísticas coletivas."),
          createParagraph(
            "Inclui ainda o gerador oficial 'Chassi Card Destaques da Rodada', que renderiza as fotos e escudos sobre a arte original da liga e faz download instantâneo."
          ),

          createHeading2("Aba 6: Gazeta C10 (O Jornal Oficial da Liga)"),
          createParagraph(
            "O veículo de imprensa oficial da Liga Só Camisa 10. Apresenta manchetes satíricas, reportagens completas sobre as rodadas, análise dos mitos e micos, resumos de decisões das copas e o botão 'Copiar Resenha para WhatsApp', gerando o texto perfeito para viralizar no grupo dos amigos."
          ),

          createHeading2("Aba 7: Livro de Regras (O Livro Sagrado)"),
          createParagraph(
            "Compêndio jurídico e ético da liga em formato sanfonado (acordeão). Contém o texto integral dos 5 artigos fundamentais, o regulamento das duas copas, a nota da comissão arbitral sobre a anulação do gol qualificado e as regras do Pódio de Gala da Rodada 38."
          ),

          createHeading2("Aba 8: Painel Administrativo (Admin)"),
          createParagraph(
            "Painel de controle exclusivo dos organizadores. Suas ferramentas incluem:"
          ),
          createBullet("Sincronização em 1 Clique com o Google Sheets", "Dispara o pipeline ETL com terminal em tempo real exibindo linhas lidas, colunas mapeadas e confirmação de sucesso."),
          createBullet("Editor de Configuração da Planilha", "Permite alterar a URL da planilha mestra ou a aba de leitura caso seja necessário."),
          createBullet("Status dos Bancos de Dados em Disco", "Mostra quais rodadas possuem arquivos JSON gravados e se há inconsistências."),
          createBullet("Editor de Notas Permanentes da Rodada", "Permite que o administrador escreva crônicas personalizadas para serem incorporadas diretamente à Gazeta C10."),

          // ==================== 10. A GAZETA C10 ====================
          createHeading1("10. A GAZETA C10: O CORAÇÃO DA RESENHA E A ALMA DA LIGA"),
          createParagraph(
            "Em qualquer liga de Cartola FC, números sem narrativa tornam-se frios. A Gazeta C10 nasceu para resolver isso: ela é o coração pulsante da Liga Só Camisa 10, combinando o rigor do jornalismo esportivo com a descontração e o veneno saudável da resenha entre amigos."
          ),
          createParagraph(
            "O que torna a Gazeta C10 um fenômeno na liga:"
          ),
          createBullet(
            "Manchetes Impactantes e Humor Ácido",
            "A cada rodada, o jornal destaca as situações mais emblemáticas com manchetes marcantes. Exemplo real: na Rodada 28, a manchete principal foi 'Mata-Mata de Infarto na Copa B10: Sovaco da Pantera Garante Classificação por 0,05 Ponto sobre o Gui FiFla e C.R.Pirika Conquista o Mês de Setembro!'."
          ),
          createBullet(
            "Editoriais Específicos para Cada Rodada Histórica",
            "A redação da Gazeta mantém crônicas arquivadas desde o primeiro turno. Momentos marcantes como a histórica pontuação do Ribeiro Copeiro 84 na Rodada 20 (cravando 124.91 pontos e garantindo a cabeça de chave nº 1) e o drama do Esperneio na Rodada 21 estão registrados para sempre."
          ),
          createBullet(
            "Integração Direta com o WhatsApp",
            "A funcionalidade 'Copiar para WhatsApp' formata todo o relatório da rodada com negritos (*texto*), emojis temáticos (👑 Craque, 🧊 Pé Frio, 💰 Magnata, 🏆 Top 3) e envia diretamente para o grupo, gerando debates instantâneos antes mesmo da abertura do mercado seguinte."
          ),

          // ==================== 11. LISTA DOS 50 CLUBES ====================
          createHeading1("11. RELAÇÃO OFICIAL DOS 50 CLUBES E CARTOLEIROS PARTICIPANTES"),
          createParagraph(
            "Abaixo está a relação oficial completa dos 50 clubes participantes da Liga Só Camisa 10 (Temporada 2026), com seus respectivos donos e identificadores do sistema:"
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell("Nº", 10),
                  createTableHeaderCell("Nome do Time", 45),
                  createTableHeaderCell("Cartoleiro / Dono", 45)
                ]
              }),
              ...OFFICIAL_PARTICIPANTS.map((p, idx) => {
                const isAlt = idx % 2 === 1;
                return new TableRow({
                  children: [
                    createTableCell(String(p.rank), { isAlt, align: AlignmentType.CENTER, widthPercent: 10 }),
                    createTableCell(p.name, { isBold: true, isAlt, widthPercent: 45 }),
                    createTableCell(p.owner, { isAlt, widthPercent: 45 })
                  ]
                });
              })
            ]
          }),

          new Paragraph({ spacing: { after: 300 } }),

          // ==================== 12. CONCLUSÃO ====================
          createHeading1("12. CONCLUSÃO, LIÇÕES APRENDIDAS E LEGADO"),
          createParagraph(
            "A temporada 2026 da Liga Só Camisa 10 marca um divisor de águas na gestão de ligas de fantasy game no Brasil. O que começou como uma necessidade prática — superar os bloqueios da API oficial da Globo e organizar um campeonato que já estava em sua 18ª rodada — transformou-se em um sistema de classe internacional."
          ),
          createParagraph(
            "A combinação entre um pipeline ETL rápido, persistência local e segura em JSON, visualização moderna de mata-matas com regras oficiais sofisticadas e o charme cultural inigualável da Gazeta C10 garantiu que a liga atingisse 100% de confiabilidade matemática e engajamento comunitário total."
          ),
          createParagraph(
            "Este dossiê permanece como o registro histórico, técnico e jurídico oficial da Liga Só Camisa 10, atestando a solidez e a seriedade de cada disputa e de cada prêmio distribuído."
          ),

          new Paragraph({ spacing: { after: 300 } }),

          createCalloutBox(
            "Homologação Final da Comissão",
            "Dossiê homologado e assinado digitalmente pela Comissão Organizadora e Engenharia da Liga Só Camisa 10. Temporada 2026.",
            COLOR_PRIMARY,
            COLOR_LIGHT_GRAY
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);

  const outputPathApp = path.join(process.cwd(), "DOSSIE_SISTEMA_SO_CAMISA_10.docx");
  fs.writeFileSync(outputPathApp, buffer);

  console.log(`Dossiê gerado com sucesso!`);
  console.log(`- Arquivo raiz: ${outputPathApp} (${buffer.length} bytes)`);
  
}

generateDossier().catch(err => {
  console.error("Erro fatal ao gerar Dossiê:", err);
  process.exit(1);
});
