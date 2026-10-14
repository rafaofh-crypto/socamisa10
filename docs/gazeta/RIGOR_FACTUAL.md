> **Atualização posterior:** execução da retificação autorizada pelo diretor; consulte [RETIFICACAO_AUTORIZADA_R30.md](RETIFICACAO_AUTORIZADA_R30.md) e seção 13 do Caderno. As pendências abaixo descrevem o estado anterior à autorização.

# Retificação e proteção factual da Gazeta — 14/10/2026

## Ordem e limites

O diretor autorizou resolver o erro jornalístico, confirmando Capitã Buske R30=**80,58**. Não autorizou alteração de posições ou competições. A intervenção é exclusivamente editorial na branch `codex/gazeta-unica-historico-2026-10-14`; merge e publicação continuam pendentes. Não há promessa de correção definitiva de todos os dados sem suas fontes.

## Causa verificada

- `gazetaEngine.ts` e `gazetaArchive.ts` possuíam matérias com números e posições escritos literalmente, independentemente do resultado observado. `verified: true` era declaração do próprio texto, sem comprovação.
- O motor substituía equipes ausentes por `TEAM_MEMBERS`; `findProfile` fabricava 2.500 pontos, 10ª posição, 95 pontos na rodada e títulos/classificação. Pontuações ausentes viravam zero. Radar tinha números e status fixos, além de agregados substitutos de 220/180.
- O adaptador compartilhado `cartolaService.ts` pode gerar histórico sintético quando a API não envia scores. Foi examinado, **não alterado**. Receber `teams` não comprova origem oficial.
- A proposta Codex do commit `83235a2` congelou uma cópia cuja R30 trazia 117,13 para Buske. Isso conserva um erro em vez de validá-lo. Seus testes comparavam contra essa mesma base; finitude e consistência interna não provam verdade. Essa confiança na fonte foi indevida.
- Não está demonstrado qual leitura atual da aplicação/aba corresponde à informação confirmada pelo diretor. A cópia acessível e a confirmação divergem. Não alterar planilha nem dados esportivos para conciliá-las.

## Correção implementada

1. `editorialVerification.ts`: registro editorial com confirmação expressa do diretor (80,58), temporada, clube, rodada e referência. Validação exige correspondência exata; o candidato 117,13 não passa mesmo com `verified: true`. Zero numérico é separado de ausência e valores não finitos.
2. Manchete, matéria, evidência e WhatsApp vêm do mesmo fato aprovado. Sem alegar segunda maior pontuação, subida na tabela, críticas ou intenção/escalação do cartoleiro.
3. `gazetaEngine.ts`: remove geração de perfis, cálculos editoriais de posições e fatos substitutos; a entrada legada fornece somente edição conferida. Não toca nos motores esportivos.
4. `gazetaArchive.ts` e `publishedGazetaArchive.ts`: só material conferido entra no leitor; objetos conferidos congelados. Rodada futura/sem confirmação não cria notícia automaticamente.
5. `publishedGazetaEditions.ts`: retratos anteriores mantidos para auditoria como `UNVERIFIED_GAZETA_DRAFTS`, sem importação pela interface e sem alteração de seus números. Isso preserva os rascunhos e não os apresenta como resultados homologados.
6. `GazetaEditionView.tsx`: exibe retificação, cobertura em conferência e advertência quando observa divergência. Esconde estatísticas/posições/copas/radar sem confirmação; remove números substitutos e pódio fixo. Mantém identidade visual, uma única Gazeta e cópia WhatsApp com fallback.
7. `types.ts`: estatísticas editoriais pendentes aceitam `null`, nunca precisam de zero fictício.
8. Testes existentes da Gazeta substituídos por testes que reproduzem o erro real, usam a confirmação independente do diretor e não apuram vencedores nem pressupõem 50 números disponíveis.

## Limitação visível e retomada

A cobertura completa R28/R29/R30 fica **em conferência**, não resolvida. Hoje somente a pontuação do Buske possui a confirmação independente necessária neste novo registro. O conceito do jornal da temporada e o arquivo histórico continuam sendo o objetivo; esta proteção não os entrega completos.

Não recolocar os retratos em circulação simplesmente corrigindo uma célula do rascunho. Conferir a fonte efetivamente lida pelo sistema, identidade exata dos 50 clubes e rodada, distinguir valores oficiais de fallback e registrar a conferência. Para cada história: pontuação exige score da rodada; posição/variação exige classificações oficiais daquele momento; confronto/status exige resultado homologado, sem decidir empate a partir de agregados. Homologações são lidas, nunca recalculadas pela Gazeta.

A confirmação de um clube não aprova os outros 49, a média, posições ou resultados de copas. Cada nova informação precisa de referência própria e revisão. Construir textos a partir desses fatos, conservar emoção sem atribuir causas, pensamentos, scouts ou decisões pessoais não documentadas. A edição completa só volta após essa validação. Não há integração de scouts.

IA amiga: preserve o bloqueio, confirme a fonte com o diretor e use os testes de rejeição; não reintroduza matéria literal nem histórico sintético. Gepeto: revisar a linguagem e apresentação da retificação, sem tratar metáfora como permissão para inventar fato. Não existem edições de terceiros para revisar automaticamente.

## Verificações

`npm run lint`, `npm run build`, `node --import tsx src/services/gazeta/test_gazeta_validation.ts`.

A suíte verifica 80,58, rejeição de 117,13, fonte/identidade/temporada/rodada, flags falsas, ausência/zero, duplicidade, quarentena, imutabilidade, WhatsApp, renderização, R31 sem publicação e entrada esportiva intocada. Não certifica os resultados dos outros clubes. Testes de navegador isolados interceptam toda a rede; nenhum servidor de sincronização é iniciado.

Revisar o diff contra main: somente arquivos da Gazeta, seu documento compartilhado e a correção anterior do ErrorBoundary. Nenhum arquivo de competição, score database, importação/sincronização, configuração, App ou dependência deve aparecer. Sem merge, deploy, chamadas de sync ou gravação em planilha.

Verificação concluída nesta revisão: TypeScript e build aprovados; suíte de rejeição factual e 14 casos isolados anteriores aprovados. Chromium local: seis cenários (1280×900 e 390×844; leitura divergente, confirmada e ausente), conferindo 80,58, quarentena, aviso de próxima edição, cópia com permissão negada e erro de cópia, ausência de tela branca e overflow. Rede integralmente interceptada, sem acesso a produção ou sincronização. Imagem mobile inspecionada. Build mantém avisos anteriores de tamanho de bundle/import misto; eles não foram tratados nesta frente.
