# Caderno de Campo — Só Camisa 10 (C10) ⚽📋

> **Status:** Documento Oficial de Referência e Coordenação da Equipe  
> **Versão de Referência do Repositório (Auditoria):** Commit `f56474e7327aec2e50b01aee04e7a26c642cc5d1`  
> **Última Atualização:** Outubro de 2026  

---

## 1. Identidade e Papel do Caderno de Campo

O **Caderno de Campo** é a fonte central de decisões, alinhamento técnico e coordenação operacional da equipe do Só Camisa 10. Reúne diretrizes permanentes, deliberações homologadas, tarefas ativas, descobertas técnicas, mapeamento de riscos e relatórios de passagem de bola.

### Soberania das Fontes de Verdade
O **Regulamento Oficial da Liga** e os **Resultados Oficialmente Homologados** pelo responsável da competição são soberanos sobre qualquer conteúdo deste documento, sobre interpretações técnicas e sobre inferências extraídas do código da aplicação.

### Papéis e Responsabilidades no Vestiário
- **Responsável / Dono da Liga:** Liderança soberana. Define diretrizes esportivas e regras de negócio, aprova conceitos visuais e de produto, autoriza formalmente a execução e publicação de alterações no repositório.
- **IA Amiga (Implementação e Histórico C10):** Referência técnica no desenvolvimento contínuo e guardiã da memória do código e da lógica acumulada do aplicativo. Responsável por implementar código testado, estável e fiel ao design e regulamento.
- **Gepeto (Direção Criativa e UX):** Direção de arte, arquitetura de informação, experiência do usuário (mobile e desktop), planejamento conceitual e análise crítica de usabilidade.
- **Codex (Engenharia, Auditoria e Testes):** Investigação técnica aprofundada, auditoria estática de código, garantia de qualidade, identificação de riscos estruturais e revisão preventiva.

---

## 2. Pacto de Vestiário e Governança Operacional

O princípio basilar do time é: **Ninguém trabalha isoladamente quando pode aproveitar a inteligência, a experiência ou a especialidade de outro membro da equipe.**

### As Cinco Regras de Colaboração
1. **Consultar antes de atravessar uma responsabilidade:** Quando uma demanda envolver diretamente a especialidade de outro colega, propõe-se formalmente sua participação ou revisão.
2. **Compartilhar contexto e intenção antes de agir:** Evitar suposições tácitas; explicitar o objetivo, os arquivos e o impacto esperado antes de intervir.
3. **Divergências resolvidas com critérios técnicos e foco no produto:** Debates técnicos são pautados por evidências e simplicidade. A decisão final cabe sempre ao responsável.
4. **Revisão cruzada para pontos sensíveis:** Alterações que toquem em pontuações, tabelas, chaveamentos, regras de desempate ou layout principal exigem validação prévia.
5. **Vitórias e aprendizados compartilhados:** Acertos consolidam padrões no Caderno; inconsistências viram salvaguardas preventivas.

### Continuidade Operacional e Limites de Uso
1. **Declaração de capacidade no início da tarefa:** Toda IA deve declarar explicitamente sua disponibilidade e eventuais restrições conhecidas. Caso a cota de uso restante não esteja visível no ambiente, essa condição deve ser expressamente registrada, sem promessas irrealistas de conclusão.
2. **Comunicação de restrição ou bloqueio:** Ao identificar limite de uso ou bloqueio temporário, relatar de imediato o que foi impedido, o que permanece funcional e a previsão oficial de retorno informada pela plataforma (sem estipular horários inventados).
3. **Devolutiva estruturada antes de pausas:** Sempre que uma pausa for necessária ou uma etapa for concluída, emitir o Relatório de Passagem de Bola padronizado.
4. **Passagem de bola clara e sem sobreposição:** A transição de tarefas deve ser feita com escopo delimitado, aguardando confirmação do próximo executor designado.
5. **Vedação de edições concorrentes:** É expressamente proibido que duas instâncias alterem os mesmos arquivos simultaneamente. Na retomada, cada membro deve inspecionar o estado atual do repositório antes de propor ou gravar alterações.

---

## 3. Preservação Permanente do Histórico Homologado de 2026

1. **Imutabilidade do histórico:** Todos os resultados, confrontos, classificados, chaveamentos e pontuações oficialmente homologados da temporada 2026 permanecem estritamente encerrados e imutáveis.
2. **Vedação a efeitos retroativos:** Nenhuma IA está autorizada a recalcular, reabrir, alterar pontuações passadas ou modificar classificados consolidados com efeitos retroativos.
3. **Registro de inconsistências sem correção automática:** Quaisquer eventuais divergências técnicas identificadas no código ou nos bancos de dados históricos devem ser apenas documentadas como apontamentos técnicos neste Caderno, nunca alteradas por iniciativa própria.
4. **Isolamento de melhorias futuras:** Melhorias estruturais, refatorações ou novos módulos devem atuar de forma prospectiva, preservando integralmente o funcionamento e a integridade dos dados históricos.

---

## 4. Decisões Aprovadas — Copa B10 Mobile (Opção C Refinada)

- **Status da Decisão:** Aprovado conceitualmente pelo responsável (consenso técnico firmado entre IA Amiga, Gepeto e Codex).
- **Data da Deliberação:** Outubro de 2026.

### Diretrizes de Produto e UX Aprovadas (Para Aplicação Futura)
- **Visão Mobile Exclusiva:** Apresentação em formato de cartões verticais dedicados (um cartão por confronto), otimizados para telas compactas.
- **Preservação Integral do Desktop:** A visualização em computadores/telas amplas deve ser preservada rigorosamente, sem quebras de layout, regressões visuais ou distorções no bracket consolidado.
- **Hierarquia Visual nos Cartões:**
  - Clubes e escudos em destaque evidente.
  - Placar agregado como informação de maior peso e visibilidade.
  - Pontuações de ida e volta sempre visíveis e transparentes.
  - Situação do confronto claramente identificada (a disputar, em andamento, encerrado, critério de desempate).
- **Navegação por Etapas:** Abas ou seletor de etapas (Oitavas, Quartas, Semifinais, Final), com destaque para a fase em disputa, sem perder o acesso aos confrontos anteriores.
- **Fidelidade ao Regulamento:** Apresentação rigorosa da ordem e composição oficial dos confrontos estabelecida pela liga.
- **Isolamento de Código:** Quando for autorizada a implementação futura, utilizar salvaguardas (componente dedicado ou isolamento de breakpoints bem delimitado) com testes visuais para blindar o ambiente desktop contra efeitos colaterais.

### 4.1. Suspensão Formal da Implementação em Código durante a Rodada em Andamento (Ordem do Responsável)
- **Status:** **Implementação suspensa e revertida integralmente no código.** O conceito visual e o wireframe (RAF 01) permanecem arquivados para momento oportuno.
- **Data da Deliberação:** 11 de Outubro de 2026.
- **Transcrição Expressa da Determinação do Responsável:**
  > *"Quer saber, tô achando tudo uma confusão. Volte essa etapa, deixa apenas a etapa do caderno e vamos deixar essa etapa da melhoria do mobile pra outro momento. Quando você desfizer e deixar só a etapa do caderno, deixe registrado no caderno esse meu desconforto. Se quiser pode transcrever essas minhas palavras pra equipe não ter dúvidas que foi ordem minha... ainda não tô confortável pra fazer uma mudança no avião com ele em voo."*
- **Fundamentação Estratégica e Esportiva:**
  1. A competição está com rodadas eliminatórias decisivas em andamento (jogos de ida e volta sendo disputados).
  2. Qualquer alteração ou teste na camada de apresentação enquanto rodadas estão ativas traz insegurança, risco de percepção errônea dos dados pelos participantes e ruído operacional ("mudar o avião com ele em pleno voo").
  3. Por determinação soberana, todo e qualquer código experimental de mobile foi removido do ambiente de desenvolvimento. O único entregável mantido e atualizado é este Caderno de Campo.

---

## 5. Descobertas Técnicas, Riscos e Auditoria

Base de análise auditada no repositório: **Commit `f56474e7327aec2e50b01aee04e7a26c642cc5d1`**.

### Descobertas Técnicas
- **Componente Central das Oitavas:** `src/components/B10FinalBracket.tsx` gerencia os confrontos eliminatórios da Copa B10, concentrando exibição, cálculo de agregados e progressão de chaves.
- **Acoplamento de Regras e Interface:** O componente atual mescla regras de negócio e desempate diretamente em sua estrutura visual JSX.
- **Proposta Técnica Futura (Não autorizada para implementação imediata):** Desacoplar a lógica de desempate e progressão para módulo utilitário próprio (`bracketRules.ts` ou equivalente), reduzindo acoplamento e facilitando testes unitários, mantendo a camada de apresentação focada em renderização.
- **Apontamento sobre Critérios de Chaveamento (R22–R24):** A auditoria identificou divergências conceituais entre anotações textuais do regulamento e a lógica de ordenação/cruzamento descrita em trechos de código do commit auditado. Registra-se que essa constatação técnica não implica nem comprova alteração de classificados oficiais, mantendo-se a soberania dos resultados homologados.

### Riscos Estruturais Mapeados (Pendentes de Validação Contínua)
1. **Regressão no Desktop ao introduzir Mobile:** O uso de breakpoints genéricos pode desalinhar o chaveamento tradicional em telas médias e grandes. Mitigação: Desenvolvimento isolado e testes visuais em ambas as resoluções.
2. **Ambiguidade Semântica (0x0 vs. Jogo Não Realizado):** Risco de pontuação zerada ser interpretada ou renderizada como jogo pendente (ou vice-versa). Mitigação: Padronização de tipos de estado (`pending`, `live`, `finished`).
3. **Recálculos em Cascata:** Funções dinâmicas que recalculam fases anteriores ao renderizar fases posteriores. Mitigação: Blindagem das fases já concluídas contra reprocessamento.

### Pendências Funcionais e de UX para Definição do Responsável
1. **Formato da Final (R37):** Definição expressa se a decisão será em jogo único ou em partidas de ida e volta.
2. **Disputa de 3º Lugar:** Confirmação se haverá confronto e representação visual de disputa pelo terceiro lugar na Copa B10.
3. **Estados Visuais de Partida:** Especificação de design para cartões quando o jogo de volta estiver em andamento enquanto a ida já foi concluída.

---

## 6. Quadro de Tarefas e Modelo de Passagem de Bola

### Quadro de Tarefas Ativas

| ID | Tarefa | Responsável | Status | Arquivos Reservados |
| :--- | :--- | :--- | :--- | :--- |
| **T01** | Oficialização do Caderno de Campo (`docs/CADERNO_DE_CAMPO.md`) | IA Amiga | Concluído | `docs/CADERNO_DE_CAMPO.md` |
| **T02** | Planejamento da Arquitetura da Opção C Mobile Copa B10 | Equipe C10 | Concluído (Arquivado) | Nenhum |
| **T03** | Implementação de Código Mobile Copa B10 | IA Amiga | **Cancelada / Revertida por Ordem Soberana** | Nenhum |

---

### 📋 Relatório de Passagem de Bola — Só Camisa 10

- **Disponibilidade:** Sem restrições conhecidas (operando normalmente no AI Studio).
- **Cota restante:** Ativa (não visível diretamente no ambiente).
- **Previsão de retorno:** N/A (em atividade contínua).
- **Passagem recomendada:** Responsável e alinhamento com Gepeto / Codex para ciência do encerramento da frente de código mobile neste momento.
- **Executor Atual:** IA Amiga.
- **Tarefa Ativa:** T01 — Oficialização e Manutenção do Caderno de Campo.
- **Arquivos Envolvidos / Reservados:** Exclusivamente `/docs/CADERNO_DE_CAMPO.md`. (Nenhum arquivo de código `.ts` ou `.tsx` está reservado ou modificado).
- **Concluído nesta etapa:**
  1. Reversão imediata e integral de qualquer código referente à Copa B10 Mobile (`B10MobileBracket.tsx` excluído; `B10FinalBracket.tsx` restaurado ao estado original idêntico ao commit de auditoria).
  2. Compilação e verificação do applet concluídas com êxito (zero erros, estabilidade total garantida).
  3. Transcrição expressa e registro no Caderno de Campo da ordem soberana do responsável: paralisação de qualquer intervenção no código durante a disputa de rodadas ("não fazer mudança no avião com ele em voo").
  4. Arquivamento do conceito visual RAF 01 para momento oportuno fora do calor das rodadas decisivas.
  5. Preservação incondicional de 100% dos dados, tabelas e histórico da temporada 2026.
- **Pendente para a próxima etapa:** Nenhuma alteração de código. O sistema segue estável acompanhando o andamento normal da temporada.
- **Decisões / Dúvidas pendentes:** Nenhuma dúvida pendente. Decisão soberana cumprida integralmente.
- **Autorizações e restrições ativas:** Nenhuma publicação, branch ou commit de código autorizado. Apenas o arquivo `docs/CADERNO_DE_CAMPO.md` mantido para registro e coordenação.

## 7. Preparação autorizada da Gazeta C10 — 14/10/2026

### 7.1. Autorização atual do diretor

O diretor do Só Camisa 10 autorizou expressamente o **Codex** a executar melhorias seguras, isoladas e reversíveis de preparação da Gazeta: documentação técnica/editorial, mapa de fontes, limitações, contrato conceitual, plano de testes e casos de validação isolados. Autorizou atualizar este registro oficial e trabalhar em branch própria, sem solicitar aprovação individual para cada uma dessas tarefas.

Essa autorização **não inclui** alterações de funcionamento esportivo, textos atualmente publicados, edições históricas, componentes do aplicativo, importação/sincronização, pontuações, patrimônio, rankings, desempates, confrontos, regras ou resultados. Não autoriza merge na `main` ou publicação em produção. Esta seção complementa os registros anteriores; não libera a frente mobile suspensa na seção 4.1.

O arquivo oficial foi confirmado na árvore da `main`: `docs/CADERNO_DE_CAMPO.md`. O nome “Diário de Campo” utilizado na solicitação refere-se a este registro; não foi criado um segundo Diário. Base remota da entrega: `3532b5a1aae62320c6162da29c27564f3bb46dec`. Branch de preparação: `codex/gazeta-preparacao-2026-10-14`.

### 7.2. Decisões editoriais vigentes

- A Gazeta deve ser o jornal da temporada, acompanhando os 50 clubes e todas as competições. A rodada inicia a notícia; a temporada fornece o contexto.
- Identificar trajetórias, rivalidades demonstráveis, reviravoltas, eliminações, classificações e histórias cruzadas. Clubes fora das copas continuam elegíveis para pautas.
- Linguagem emocionante, criativa e esportiva: batalha, duelo, atropelo, apagou as luzes e sobreviveu por um fio são metáforas bem-vindas, proporcionais ao fato.
- **Liberdade narrativa, rigor factual:** não inventar acontecimentos, causas, escalações, scouts individuais, comportamento ou estado psicológico dos participantes.
- **Integração de scouts e suas pontuações expressamente descartada**, incluindo tabelas e analogias. Não permanece no plano.
- A Gazeta observa resultados oficiais; nunca determina vencedores ou recalcula competições.
- Edições históricas devem ser preservadas. Eventuais correções dependem de aprovação editorial e registro rastreável.

### 7.3. Trabalho realizado e orientação à IA amiga

| Arquivo criado/modificado | Trabalho e motivo | Segurança / uso na retomada |
| --- | --- | --- |
| `docs/CADERNO_DE_CAMPO.md` | Acrescentada somente esta seção: autorização, decisões e passagem. | Conteúdo anterior preservado; não tratar registros antigos de estabilidade como nova certificação. |
| `docs/gazeta/README.md` | Índice e instruções do pacote. | Sem ligação ao produto; ponto de entrada para a IA amiga. |
| `docs/gazeta/DIRETRIZES_EDITORIAIS.md` | Consolidação das decisões atuais. | Não muda redação publicada; consultar antes de propor modelos. |
| `docs/gazeta/MAPA_TECNICO.md` | Responsabilidades, dependências e fontes. | Leitura de código referenciada à base; validar novamente ao retomar. |
| `docs/gazeta/PENDENCIAS.md` | Inventário de problemas e limites. | Nenhuma correção aplicada; separar histórico, texto dinâmico e regras. |
| `docs/gazeta/CONTRATO_DE_OBSERVACAO.md` | Proposta de contrato e invariantes editoriais. | Documento conceitual, sem API ou integração; precisa de revisão conjunta. |
| `docs/gazeta/PLANO_DE_TESTES.md` | Critérios de isolamento, regressão e sequência futura. | Plano não autoriza implementação; não iniciar servidor com autosync. |
| `docs/gazeta/validacao/casos.json` | Dez registros e quatro histórias cruzadas fictícias. | IDs fictícios, nenhuma pontuação de clubes oficiais; não publicar como temporada. |
| `docs/gazeta/validacao/verificar.mjs` | Verificador manual dos casos e imutabilidade. | Só lê JSON local; sem rede, escrita, imports do app ou cálculo de resultados. Não é módulo de produção. |

Verificações da entrega: casos válidos/inválidos com resultados esperados, preservação de entradas, TypeScript sem emissão, links locais, diff limitado à documentação e ausência de imports do pacote no aplicativo. O registro de verificações descreve a preparação, não certifica homologação ou estabilidade de produção. Nenhuma dependência, configuração, serviço ou arquivo em `src/` foi alterado.

### 7.4. Achados relatados, não corrigidos

- Dependência de matérias cadastradas R19–R29 e textos genéricos; ausência de visão integrada das competições.
- A Gazeta não recebe resultados estruturados das copas nem sinal suficiente de homologação.
- Afirmações sem evidência em Gazeta e Destaques: causa atribuída a scouts, esquecimento do mercado, desgaste de elenco e conclusões táticas não demonstradas. Metáforas esportivas não são proibidas.
- Textos históricos são combinados com dados atuais; alterar modelos pode mudar edições anteriores. Preservação futura de edições publicadas continua necessária.
- **R21:** diretor corrigiu a pontuação de Fernandoguinho FC para **29,80**. O Codex confirmou a nova leitura da fonte em 14/10/2026, sem a data anteriormente retornada, e compatibilidade com o parser. **A correção não foi feita pelo Codex.** Cache/servidor e tipo interno da célula não foram certificados. Esta preparação não modificou dados ou classificações.
- As pendências esportivas anteriores continuam apenas relatadas; não foram usadas como oportunidade de manutenção.

### 7.5. Caminho futuro — direções, não autorizações automáticas

1. Organizar a base técnica e editorial (pacote desta entrega).
2. Validar fontes oficiais de cada competição com a IA amiga e o responsável.
3. Desenvolver mecanismos de observação dos acontecimentos da temporada.
4. Conectar histórias de um mesmo clube entre competições.
5. Definir critérios de seleção e prioridade das notícias.
6. Desenvolver redação jornalística com personalidade.
7. Implantar revisão editorial e preservação das edições.
8. Testar isoladamente antes de qualquer integração ao aplicativo oficial.

O isolamento acompanha todas as etapas. As etapas de implementação exigem autorização posterior; o contrato e os verificadores fictícios não significam inteligência jornalística instalada.

### 7.6. Mensagem expressa à IA amiga

> A IA amiga deve considerar o trabalho de preparação realizado pelo Codex como uma intervenção autorizada pelo diretor. As decisões editoriais registradas refletem a orientação atual do projeto. Antes de propor novas implementações, deve consultar os documentos preparados, verificar o estado atual do repositório e considerar as pendências e limitações identificadas. Nenhuma alteração futura está automaticamente autorizada por este registro.

### 7.7. Passagem de trabalho

- **Executor:** Codex. **Disponibilidade:** sem bloqueio conhecido; cota restante não visível. Sem previsão de bloqueio informada.
- **Concluído:** preparação documental e material de validação isolado; aplicativo e textos publicados preservados.
- **Pendências:** IA amiga validar fontes reconhecidas, sinais de homologação e IDs; Gepeto revisar critérios de pauta; responsável aprovar passos futuros.
- **Arquivos desta frente:** somente este Caderno e `docs/gazeta/`; nenhuma reserva de componentes ou serviços esportivos. Na retomada, combinar executor único para o Caderno.
- **Restrição:** nenhuma integração, refatoração executável do app, limpeza publicada, merge ou publicação autorizados.
- **Revisão/reversão:** entrega em branch própria; remover o pacote e somente esta seção se houver ordem de reversão, preservando registros posteriores. Conferir a `main` antes de eventual integração.
