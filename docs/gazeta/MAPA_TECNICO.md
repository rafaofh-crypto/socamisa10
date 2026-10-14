# Mapa técnico e fontes da Gazeta

Base: `3532b5a1aae62320c6162da29c27564f3bb46dec`, consultada em 14/10/2026. A versão publicada e dados em cache não foram certificados por esta entrega.

## Caminho atual

`useCartolaData` → `App.tsx` → `GazetaC10.tsx`, com `teams` e `currentRound`. A página importa o tipo de `cartolaService.ts`, o calendário `MONTH_TO_ROUNDS` de `cartollaApi.ts`, `TeamShield` e ícones. Não recebe resultados estruturados das copas, retratos oficiais anteriores ou confirmação explícita de homologação.

| Responsabilidade na Gazeta | Local | Limitação |
| --- | --- | --- |
| Matérias cadastradas R19–R29 | `ROUND_EDITORIAL_ARCHIVE`, linhas 40–162 | R30 não possui matéria específica nessa versão. |
| Seleção de rodada | `availableRounds` / `effectiveRound`, linhas 170–185 | Uma pontuação positiva habilita edição; não comprova apuração completa. |
| Geral | `standingsUpToRound`, linhas 188–202 | Soma local; ausência vira zero; não é arquivo homologado. |
| Desempenhos e média | `roundPerformances`, linhas 205–222 | Sem informações dos atletas escalados. |
| Mensal | `monthlyData`, linhas 225–262 | Fechamento pelo calendário alcançado, não confirmação oficial. |
| Redação genérica | `editorial`, linhas 265–275 | Prioriza maior pontuação sem descobrir acontecimentos da temporada. |
| WhatsApp | `generateWhatsAppNews`, linhas 283–322 | Montado dinamicamente, não enviado automaticamente. |
| Apresentação e cópia | JSX / `handleCopyWhatsApp` | Textos fixos e valores atuais combinados. |

## Fontes disponíveis, sem atribuir homologação automática

| Área | Arquivos existentes | O que pode orientar futura observação |
| --- | --- | --- |
| Pontuações | `cartolaService.ts`, `server.ts`, planilha configurada e JSONs | Valores, registros importados, origem e disponibilidade; validar caminho ativo. |
| Geral e Turnos | `Dashboard.tsx`, `rankings.ts` | Classificações calculadas; primeiro turno R1–R19, segundo R20–R38. |
| Mensal | `Mensal.tsx`, `MONTH_TO_ROUNDS` | Recorte e classificação local; aprovação do resultado continua necessária. |
| M10 | `MataMata.tsx`, `knockout.ts`, `tournamentData.ts` | Chaveamento calculado, entradas manuais e simulação; distinguir origem. |
| B10 | `CopaB10.tsx`, `B10RoundOf32.tsx`, `B10FinalBracket.tsx` | Confrontos e progressão dentro dos componentes. Não copiar o motor para a Gazeta. |
| Destaques | `Destaques.tsx` | Desempenhos e comparação de posições; frases e fallbacks não são evidências. |
| Calendários | `tournamentData.ts`, `MONTH_TO_ROUNDS` | Etapas previstas não comprovam conclusão. |

As páginas calculam parte das classificações separadamente; podem ordenar empates de modo diferente. `allSyncedScores` preserva registros importados, mas não comprova por si só homologação. O servidor e a leitura direta podem preencher ausências com zero. Existem contingências e geração de histórico auxiliar.

## Fronteira da futura integração

Não existe hoje um contrato pronto e comum de resultados oficiais para todas as competições. Primeiro identificar com a IA amiga e o responsável qual resultado é reconhecido e como será fornecido à observação. Começar com cópias revisadas ou retratos fornecidos, sem modificar serviços esportivos. Não importar componentes só para obter seus cálculos.

A fonte configurada em `sheets_config.json` é a planilha com ID `1wGw0eOvoqS-Iv_qSqzpRBSPA815SqHFiEu2TMk0O_Lk`. Na auditoria anterior trouxe 50 clubes até R30. Conferência R21 posterior retornou `29.80` para Fernandoguinho; correção realizada pelo diretor, não pelo Codex. Isso não certifica cache ou produção.
