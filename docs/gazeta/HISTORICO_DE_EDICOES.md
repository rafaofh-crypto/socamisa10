> **Atualização posterior:** execução da retificação autorizada pelo diretor; consulte [RETIFICACAO_AUTORIZADA_R30.md](RETIFICACAO_AUTORIZADA_R30.md) e seção 13 do Caderno. As pendências abaixo descrevem o estado anterior à autorização.

> **RETIFICAÇÃO — 14/10/2026:** a origem descrita nesta entrega foi contestada pelo diretor: Buske R30=80,58, não 117,13. As afirmações numéricas abaixo não constituem conferência oficial. Os retratos R28/R29/R30 foram colocados em quarentena editorial e saíram do catálogo do leitor; seus objetos permanecem como rascunhos de auditoria. Consulte [RIGOR_FACTUAL.md](RIGOR_FACTUAL.md) e seção 10 do Caderno. Esta entrega substitui a proposta do commit 83235a2, ainda não publicada.

# Gazeta única e histórico editorial — entrega Codex, 14/10/2026

## Autorização e escopo

O diretor pediu ao Codex revisar a entrega da IA amiga e concluir a retirada do Boletim Clássico, mantendo apenas a Gazeta e preservando a edição R30 para as próximas rodadas. Base revisada: `62144816e0a9ceafb32063ef64b4ee105ca06cbd`. A página principal dessa base já não oferecia o modo clássico; o histórico ainda era regenerado com os dados atuais.

Esta entrega é uma proposta revisável em branch própria. Não autoriza nem executa merge/publicação. As correções editoriais listadas abaixo ficam explícitas para aprovação do diretor; a versão anterior continua disponível no commit de referência. Nenhum resultado esportivo foi modificado.

## Como o histórico funciona

- `publishedGazetaEditions.ts` contém retratos completos das R28, R29 e R30: matérias, radar, tabelas, estatísticas e WhatsApp. Não contém um motor esportivo nem substitui as classificações oficiais.
- `publishedGazetaArchive.ts` fornece e congela os objetos editoriais. O leitor não usa pontuações vivas para reconstruir uma edição antiga.
- `GazetaEditionView.tsx` abre a última edição preparada e mantém as anteriores no seletor. Cache esportivo antigo não esconde o jornal já preparado.
- Uma nova rodada sem edição preparada gera aviso de preparação; não anuncia homologação, novos confrontos ou cobertura em tempo real por inferência.
- A R30 permanece igual na navegação, na busca e no WhatsApp mesmo quando chegar a R31.
- Novas edições precisam de dados conferidos, revisão editorial e entrada explícita no arquivo; não são produzidas/publicadas automaticamente pela passagem da rodada.

## Origem dos retratos

Leitura da fonte configurada `1wGw0eOvoqS-Iv_qSqzpRBSPA815SqHFiEu2TMk0O_Lk`, versão retornada pelo Drive com modificação `2026-10-14T13:38:38.292Z`, contendo pontuações numéricas dos 50 clubes nas R1–R30 e Fernandoguinho R21=29,80 (correção do diretor).

Identidades e escudos vieram do cadastro existente; confrontos e vencedores vieram do registro editorial de copas da IA amiga, mantido inalterado. A conferência das pernas e dos agregados ocorreu sobre cópia isolada da fonte, sem substituir resultados homologados.

As R28/R29 são retratos editoriais preparados nesta entrega, não provas do texto originalmente publicado naquelas datas. As datas do catálogo foram herdadas da curadoria existente. O retrato R30 conserva a estrutura e a manchete apreciadas pelo diretor, com ajustes factuais explícitos. Não confundir preservação de uma edição a partir desta revisão com recuperação de um boletim antigo nunca armazenado.

## Ajustes editoriais propostos

- Carlao07: maior agregado individual **da Fase 4**, sem afirmar recorde de toda a temporada; margem de 83,22 é a segunda maior, atrás dos 114,50 de Tainha. Já liderava outubro após R29, portanto mantém a liderança.
- Ninja: diferença correta para a média R30, 26,05 acima de 96,28; desempenho não atribuído a uma escalação individual apurada.
- FURACÃO: 116,43 é a sexta maior pontuação da R30, não a terceira. Removida afirmação de melhor média recente sem definição/evidência.
- R29: 148,81 é a maior pontuação daquela rodada, não do ano; retirados scouts inventados, capitão dobrando pontuação, desempenho individual de jogadores e probabilidade de 99% de classificação.
- Capitã Buske: preservado o desempenho de 117,13 e o playoff reconhecido; retiradas atribuições de críticas e comportamento psicológico.
- Radar: textos especiais da R30 não vazam para R28/R29; Casquinha recebe posição/pontos do retrato, sem repetir a posição da R29 como se fosse a R30. Não atribuir repescagem aos demais clubes por falta de registro.
- Edições R28/R29 não apresentam resultados concluídos da Fase 4 nem campeão M10 antes da R29.

Metáforas esportivas e personalidade do jornal foram preservadas. Scouts não foram integrados como dados, tabela ou analogias.

## Resiliência e verificação

O `ErrorBoundary` recebeu declarações compatíveis com a tipagem existente para corrigir erros de TypeScript e mantém comportamento React. A mensagem de falha não promete ausência de perda nem exibe detalhes técnicos ao cartoleiro.

A cópia WhatsApp tenta o fallback também quando `navigator.clipboard` existe, mas rejeita a permissão; remove o textarea ao terminar, restaura foco e não anuncia sucesso se a cópia falhar.

Comandos de verificação:

```sh
npm run lint
npm run build
node --import tsx src/services/gazeta/test_gazeta_archive.ts
node docs/gazeta/validacao/verificar.mjs
```

A suíte antiga `test_gazeta_validation.ts` depende de arquivos R29/R30 ausentes da base GitHub. Foi executada com arquivos de uma cópia da fonte em diretório isolado, sem adicioná-los aos dados oficiais. Não afirmar que ela roda sem esses pré-requisitos.

O teste novo verifica os 50 clubes, os 16 registros da B10, imutabilidade, datas/etapas sem vazamento futuro, R31 sem publicação automática e renderização sem dependência das entradas vivas. A comparação deve confirmar ausência de mudanças em copas, rankings, calendários, importação, sincronização, dados esportivos, `App.tsx`, dependências e configurações.

Conferência local no Chromium realizada em 1280×900 e 390×844, com todas as requisições interceptadas (sem contato com produção, servidor ou planilha). Passaram seleção R28/R29/R30, permanência da R30 com entrada R31 fictícia, ausência de modo clássico, busca/filtros, cópia com clipboard bloqueado, mensagem quando o fallback recusa a cópia, remoção do textarea e ausência de rolagem horizontal da página. Imagens inspecionadas; ajuste pontual na quebra do título mobile, mantendo a identidade visual da IA amiga.

O build alerta para bundle principal acima de 500 kB e import estático/dinâmico de `cartolaService`; não foi feita refatoração do aplicativo para resolver esses avisos nesta frente.

## Passagem para a IA amiga

Consultar seção 9 do Caderno. A inteligência editorial futura continua precisando de fontes reconhecidas, confirmação e revisão por edição. Não usar as frases genéricas/fallbacks restantes do motor como certificação esportiva. A interface entregue lê somente retratos preparados; o motor permanece uma ferramenta editorial de preparação, não árbitro nem publicador automático.
