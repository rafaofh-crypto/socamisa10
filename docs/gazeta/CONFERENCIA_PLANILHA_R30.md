# Conferência da planilha corrigida — R30 (14/10/2026)

Fonte indicada novamente pelo diretor: https://docs.google.com/spreadsheets/d/1wGw0eOvoqS-Iv_qSqzpRBSPA815SqHFiEu2TMk0O_Lk/edit?usp=sharing

O diretor informou que encontrou o problema e corrigiu a tabela. Nova leitura do conector: versão modificada em `2026-10-14T18:59:08.861Z`. A ferramenta disponibilizou a representação textual de um arquivo Excel; não expôs nome da aba nem formatação original das células. Não afirmar conferência de formato nativo da célula nem atualização do cache de produção.

## Constatações de leitura

- Capitã Buske: **80,58** na coluna de pontuação da R30; patrimônio separado **137,51**.
- 50 identificadores únicos, iguais aos da cópia anterior; 50 pontuações R30 e 50 patrimônios R30 numéricos e finitos.
- 1.500 pontuações R1–R30 numéricas e finitas. Isso valida a leitura/completude, não homologa resultados ou ausência de outros erros humanos.
- Fernandoguinho R21 continua **29,80**.
- As R1–R29 coincidem com a cópia anterior. Oito valores R30 diferem; os outros 42 permanecem iguais.

## Diferenças para a cópia anterior

| Clube (identificador) | Cópia anterior | Fonte corrigida |
| --- | ---: | ---: |
| c-r-pirika | 110,83 | 117,03 |
| camisa-pesada-sa | 104,13 | 110,83 |
| campecheiro-futz | 80,58 | 104,13 |
| capita-buske | 117,13 | 80,58 |
| carlao07 | 108,43 | 117,13 |
| casquinha-ec | 94,39 | 108,43 |
| chinchila-cabecuda | 92,15 | 94,39 |
| crf-galo | 117,03 | 92,15 |

O conjunto observado é compatível com associação deslocada dos valores entre linhas nesse trecho. A leitura não comprova qual operação de edição causou o problema.

## Impacto editorial ainda pendente

O registro **editorial** `src/services/gazeta/cupOfficialRegistry.ts` conserva cinco pontuações de volta divergentes: Camisa Pesada (confronto 2), C.R.Pirika e CRF Galo (12), Chinchila e Carlao07 (15). Foram comparadas somente as pontuações de ida/volta, sem calcular agregados, vencedores, classificados ou novas posições. Todas as pernas da R29 coincidem com a fonte corrigida.

A planilha corrigida resolve a divergência de leitura do Buske. Ela não atualiza automaticamente os textos literais da Gazeta, seus retratos preparados nem o registro editorial das copas. A proteção da branch permanece: somente fatos confirmados entram na edição; não liberar a cobertura histórica completa simplesmente porque os valores agora são numéricos.

Resultados homologados continuam soberanos. A equipe precisa distinguir retificação de uma narrativa incorreta de qualquer efeito em resultado esportivo. Obter a referência dos resultados já homologados para redigir corretamente as matérias; não usar o registro editorial da IA como autoridade esportiva nem deduzir vencedor a partir desta comparação.

## Trabalho e limites

Nenhuma planilha, dado esportivo, cálculo, posição, confronto, vencedor, critério ou publicação foi modificado. Nenhuma sincronização foi executada. Nesta continuidade foram atualizados apenas documentos da branch de revisão. A pontuação editorial já protegida do Buske coincide agora com a leitura da fonte corrigida.

IA amiga: consultar este documento e a seção 11 do Caderno antes de retomar. Não sobrepor edição de arquivos. Gepeto: manter linguagem emocionante, retirando afirmações numéricas/posicionais sem referência. Próxima entrega completa da Gazeta depende da reconciliação editorial com os registros oficiais homologados, preservando integralmente o campeonato.
