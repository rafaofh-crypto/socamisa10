# Retificação autorizada da R30 — entrega imediata (14/10/2026)

## Autorização e alcance

Após receber a auditoria que comprovou a troca de vencedor, o diretor ordenou: "CODEX, nao posso esperar a ia amiga voltar a funcionar amigo. tenho que fazer essa alteracao agora. faz o que precisa fazer, deixa tudo publicado no diario como estamos fazendo mas nao posso divulgar coisa errada."

A ordem é tratada como autorização de execução imediata da retificação demonstrada e sua disponibilização, com registro e testes. Exceção específica à preservação anterior: corrigir o erro material da R30, seus placares, classificado e cobertura editorial; não reescrever outras etapas nem alterar regulamentos. A IA amiga não precisa voltar para a correção ser executada.

## Resultado aplicado

- Confronto 12 da Fase 4: **C.R.Pirika 229,49 x 200,39 CRF Galo**; Pirika classificado por 29,10, sem desempate. O adversário de Tainha nas oitavas passa a ser Pirika.
- Confronto 2: Camisa Pesada **243,79 x 212,44** Lendinhaxx, vencedor preservado.
- Confronto 15: Chinchila **176,26 x 265,94** Carlao07, vencedor preservado.
- Buske R30 **80,58**, sem alegar segunda maior pontuação ou subida por causa de uma vitória inexistente.
- Outros 13 confrontos da Fase 4 e sete outras duplas de oitavas iguais no teste. Playoffs da B10 e chaveamento/classificação final da M10 iguais. Sem alterar regras, critérios de desempate ou componentes esportivos.

## Arquivos e proteção contra cache antigo

`round29_scores_db.json`, `round30_scores_db.json` e seus arquivos de patrimônio recebem cópias numéricas da fonte corrigida, com 50 identificadores; nenhuma linha foi inventada. Os arquivos históricos existentes R1–R28 conferidos coincidem com a planilha e não foram editados. R2–R9 não estavam versionados; não foram criados nesta intervenção. A sincronização existente permanece responsável por disponibilizar o histórico completo no servidor.

`src/services/r30Retification.ts` reconhece **somente a cópia antiga exata da R30**, comparando os 50 clubes e suas 50 pontuações, por ID canônico ou nome cadastrado exato normalizado. Quando essa impressão corresponde à cópia comprovadamente errada, aplica as oito pontuações corrigidas em cópia dos objetos; não escreve na planilha nem no localStorage, não toca em outras rodadas e não sobrescreve uma versão nova, desconhecida ou parcial.

`App.tsx` aplica essa correção na leitura dos dados, inclusive os dados sincronizados entregues ao painel administrativo. Assim, todas as telas recebem a mesma correção da fonte; não há regra ou vencedor especial implementado dentro do bracket. Um cache antigo idêntico não mantém Galo nas oitavas. Atualizações futuras diferentes não são forçadas a voltar a esta versão.

`cupOfficialRegistry.ts` corrige somente os campos dos confrontos 2, 12 e 15; M10 e playoffs preservados.

## Gazeta restabelecida

`confirmedSeason2026.ts`: cópia editorial conferida de 50 clubes e R1–R30, com URL e versão da fonte, objetos congelados. Origem: arquivo indicado pelo diretor, versão `2026-10-14T18:59:08.861Z`, conferida novamente antes da intervenção.

`confirmedGazetaBuilder.ts`: matérias e evidências construídas a partir dos fatos dessa versão, conferindo os placares do registro editorial contra as pontuações copiadas. Edição R30 com retificação de capa, reportagem Pirika/Galo, Ninja, Carlao07, histórias cruzadas de Buske, Tainha e Casquinha, tabelas, radar dos 50 clubes e WhatsApp. Números dos cards e texto saem dos registros conferidos. Sem causas psicológicas, scouts ou escalações inventadas. Valores ausentes não viram zero.

`editorialVerification.ts` amplia o registro de fatos aprovados à fonte corrigida; `gazetaArchive.ts` disponibiliza R28/R29/R30 conferidas. As edições anteriores continuam identificadas como reconstruções editoriais preparadas agora, não reprodução certificada de boletins originais. R28/R29 não antecipam classificados da R30 nem campeão da R29 antes de ocorrer.

As tabelas editoriais são somas de dados reais pelo mesmo calendário do aplicativo, não rankings esportivos gravados manualmente. Mudanças decorrentes da correção da fonte seguem o cálculo existente. A Gazette só publica as edições preparadas; a chegada da R31 não gera uma notícia nova automaticamente.

Rascunhos anteriores contestados seguem preservados para auditoria fora da interface. A entrada pública legada do motor agora fornece somente edições conferidas, sem inventar perfis ou resultados substitutos. O layout continua uma única Gazeta; mantido fallback de cópia WhatsApp e tratamento de falhas da entrega anterior.

## Validação

- TypeScript e build; testes de confirmação factual e correção do cache antigo, IDs numéricos da API, identidade exata, ausência de mutação, preservação de outras rodadas, dados desconhecidos/incompletos não sobrescritos e cópias persistidas iguais à fonte.
- Os 16 confrontos avaliados nos dois componentes reais da B10; mesmos resultados e apenas uma troca de classificado entre as fontes. Copa M10 renderizada com as duas fontes, bracket e classificação final iguais.
- Chromium em desktop 1280×900 e celular 390×844, seis cenários com rede totalmente interceptada: fonte antiga completa, fonte corrigida e pontuação ausente. Conferidos Gazeta, compartilhamento, falha de clipboard, histórico, ausência de overflow, Pirika classificado na Fase 4 e presente nas oitavas, Galo fora das oitavas. Sem chamadas a servidor ou planilha durante testes.
- Sem dados R31/R32 na fonte fornecida: nenhuma partida posterior foi inventada ou homologada. Se houver resultados oficiais externos dessas etapas ainda não registrados, devem ser informados para revisão de impacto própria.
- Build mantém avisos anteriores de tamanho do bundle/import misto, sem mudança de dependências/configuração para tratá-los.

## Publicação e continuidade

A integração deve ser feita a partir do diff revisado, com checagem da main e acompanhamento do status Vercel. Uma confirmação de deploy não equivale a inspeção visual direta do site: o domínio oficial está bloqueado pelo proxy de rede deste ambiente. Registrar os identificadores efetivos de commit/PR/deploy após concluir, sem prometer acesso que não ocorreu.

IA amiga: consultar este documento, a seção 13 do Caderno e o estado da main antes de qualquer edição. Não reintroduzir a vitória de Galo na Fase 4, os números antigos, o motor de conteúdo substituto ou aplicar esta exceção a outros resultados. Gepeto: preservar a personalidade do jornal e a transparência da retificação. Nenhuma nova regra está autorizada por este registro.
