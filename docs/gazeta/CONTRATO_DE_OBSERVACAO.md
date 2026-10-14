# Contrato conceitual de observação — proposta v0

**Proposta para revisão conjunta; não API implementada ou regra oficial.** Nenhum componente ou serviço esportivo usa este contrato.

## Responsabilidades

1. **Retrato recebido:** resultado ou situação reconhecida de uma competição em um momento. Campos: versão, temporada, rodada/momento, competição, participantes por ID, origem e situação de confirmação. Classificação e vencedores são recebidos, não calculados aqui.
2. **Evidência:** referência da fonte e versão, momento de obtenção, âmbito/completude e valores observados. Separar parcial, confirmado e não verificável.
3. **Acontecimento:** interpretação objetiva apoiada por evidências antes/depois. IDs do acontecimento, clubes, competição, momento e afirmações permitidas. Não contém fórmula de desempate ou mecanismo para determinar vencedores.
4. **Pauta:** um ou mais acontecimentos ligados por clube e período; consequência, trajetória, margem e diversidade orientam avaliação editorial. Rivalidade exige histórico documentado, não hostilidade presumida.
5. **Edição:** pautas, texto, boletim WhatsApp, evidências, versão editorial e aprovação. Publicação preserva o conteúdo; correção cria versão rastreável autorizada.

## Invariantes propostas

- IDs únicos no retrato e identidade consistente entre competições.
- Valor ausente representado por `null` e disponibilidade explícita; zero é valor real, não pendência.
- Valor numérico finito; não converter datas ou texto malformado em pontuação.
- Resultado definitivo exige origem reconhecida e confirmação; calendário alcançado não basta.
- Marcadores virtuais não são participantes classificados oficialmente.
- Se informação falta, suspender a afirmação afetada; não preencher com dados gerados.
- Uma história cruzada preserva as fontes de cada competição e não redefine resultados.
- Recorde exige âmbito e histórico completo para esse âmbito; empate não vira recorde isolado.
- Edição publicada não é regenerada automaticamente quando as fontes mudam.
- Nenhuma dependência de scouts, tabela de valores ou analogias.
- A observação não grava dados esportivos, não chama sincronização e não substitui fontes oficiais.

## Casos de apoio

`validacao/casos.json` usa uma **representação reduzida e fictícia**, apenas para demonstrar disponibilidade, confirmação, identidade e histórias cruzadas. Não é o esquema definitivo e não calcula classificados, rankings, pautas ou textos do aplicativo.

O verificador não certifica dados reais ou homologação: confere coerência dos metadados fictícios recebidos. Fonte reconhecida e homologação são decisões externas ao verificador.

## Pendência antes de implementação

Validar com a IA amiga onde os resultados reconhecidos serão obtidos. Não pressupor um serviço compartilhado inexistente. Ajustar o contrato com exemplos reais revisados antes de criar código de produção. A fronteira com cálculos esportivos continua proibida nesta autorização.
