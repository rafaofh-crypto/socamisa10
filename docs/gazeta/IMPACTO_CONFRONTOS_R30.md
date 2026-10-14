# Impacto das correções R30 em confrontos — 14/10/2026

## Direção e conclusão

Após corrigir a fonte, o diretor pediu: "mas se esse vacilo alterou algum resultado de confronto eu preciso muito saber e ate mesmo corrigir". Esta ordem autoriza investigar o impacto e preparar a retificação para decisão; não se deve transformar automaticamente o achado em mudança de resultado homologado ou publicação.

**Uma troca de vencedor calculado entre os 16 confrontos da Fase 4 da B10: C.R.Pirika x CRF Galo (#12).** Nenhum empate/desempate está envolvido. Dois outros confrontos mudam de placar, mantendo o vencedor. Playoffs da B10 e Copa M10 permanecem iguais neste teste.

## Evidência do confronto 12

| Clube | Ida R29 (igual nas duas fontes) | Volta R30 anterior | Volta R30 corrigida | Agregado anterior | Agregado corrigido |
| --- | ---: | ---: | ---: | ---: | ---: |
| C.R.Pirika | 112,46 | 110,83 | 117,03 | 223,29 | **229,49** |
| CRF Galo | 108,24 | 117,03 | 92,15 | 225,27 | **200,39** |

A cópia anterior calculava CRF Galo vencedor por 1,98. A fonte corrigida calcula C.R.Pirika vencedor por **29,10**. Isso não é alteração de critério: é correção das entradas numéricas.

O componente de fase final associa o vencedor do confronto 12 ao vencedor do confronto 6, Tainha Ovada. Assim, a composição calculada das oitavas troca **Tainha x CRF Galo** por **Tainha x C.R.Pirika**. As outras sete duplas calculadas permanecem iguais. Não foram fornecidos dados das R31/R32, portanto não se apuraram partidas posteriores nem efeitos em etapas já jogadas.

## Outros placares afetados, sem troca de vencedor

| Confronto | Anterior | Fonte corrigida | Vencedor nas duas leituras |
| --- | --- | --- | --- |
| #2 Camisa Pesada x Lendinhaxx | 237,09 x 212,44 | 243,79 x 212,44 | Camisa Pesada |
| #15 Chinchila x Carlao07 | 174,02 x 257,24 | 176,26 x 265,94 | Carlao07 |

Os outros 13 confrontos da Fase 4 conservam placar e vencedor neste teste. Oito pontuações R30 foram corrigidas no arquivo; três clubes afetados não participaram desta fase. R1–R29 e os cruzamentos de entrada da Fase 4 não mudaram.

## Como foi verificado

- Fonte anterior: cópia efetivamente usada na preparação anterior, versão 14/10/2026 13:38:38 UTC.
- Fonte corrigida: arquivo indicado pelo diretor, versão retornada em 14/10/2026 18:59:08 UTC; pontuações extraídas por identificador e cabeçalhos de rodada/pontuação, separadas de patrimônio.
- Executados os componentes reais `CopaB10.tsx`, `B10RoundOf32.tsx` e `B10FinalBracket.tsx` em renderização React isolada, com as duas cópias de dados reais. Simuladores desativados, rodada 30. A instrumentação para capturar resultados ocorreu apenas em memória/artefatos de trabalho; nenhum arquivo esportivo foi editado.
- Confirmada identidade dos quatro arquivos esportivos examinados (incluindo `MataMata.tsx`) com os arquivos remotos atuais de main.
- Os dois componentes da B10 concordaram nos 16 resultados, sem empates. Verificados cruzamentos iniciais e playoffs idênticos, sete duplas de oitavas idênticas e mudança somente na dupla 7. As entradas permaneceram intocadas.
- Executado `MataMata.tsx` da M10 com corte R20 e R30 atual: chaveamento completo e classificação final idênticos nas duas leituras; seus confrontos terminam na R29.
- Não foram auditadas posições de Campeonato Geral/Mensal nesta etapa; não houve gravação, sincronização, homologação ou publicação.

## Limite de comprovação em produção

O texto da Gazeta e seu registro editorial na main ainda documentam Galo como vencedor com as pontuações antigas. Isso comprova o erro da cobertura editorial, não por si só o registro oficial de homologação do campeonato.

Tentativas de leitura do site e endpoint de dados pelo navegador de pesquisa falharam por indisponibilidade de acesso da ferramenta. Não afirmar que os componentes atualmente publicados já leram a planilha corrigida, que seu cache está atualizado, ou qual placar foi oficialmente comunicado aos clubes.

O código apura partidas a partir dos dados que recebe; com os corrigidos, ambos os componentes testados apontam Pirika. Não há necessidade demonstrada de mudar regra/cálculo/desempate para este caso. Confirmar implantação/cache e o registro homologado antes de aplicar qualquer intervenção esportiva. Não iniciar o servidor local: sua inicialização pode acionar sincronização.

## Proposta concreta para decisão do responsável

1. Validar e formalizar o confronto 12 com **C.R.Pirika 229,49 x 200,39 CRF Galo**, se o diretor decidir retificar o resultado homologado por erro material da fonte.
2. Validar o ingresso de C.R.Pirika na dupla com Tainha, verificando antes se R31/R32 ou etapas posteriores já foram disputadas e oficialmente encerradas; não propagar correção em cascata automaticamente.
3. Confirmar que a aplicação lê a fonte corrigida e deixa de usar cache antigo. Não mudar a fórmula dos componentes nem critérios de desempate para compensar erro de dados.
4. Após decisão esportiva, corrigir os registros e matérias editoriais correspondentes, incluindo placares dos confrontos 2 e 15, manchetes/radar/WhatsApp e histórias derivadas do erro. Preservar registro da retificação e sua autorização.
5. Conferir leitura, os 16 confrontos, a dupla afetada e qualquer fase posterior realmente disputada, além de desktop/mobile, antes de publicar.

Esta proposta não foi aplicada ao campeonato. A antiga diretriz de imutabilidade não deve impedir que o diretor conheça um erro material; a decisão de abrir exceção e retificar pertence a ele. Documento e Caderno constituem preparação, não homologação.
