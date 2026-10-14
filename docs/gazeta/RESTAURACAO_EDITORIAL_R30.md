# Restauração editorial da Gazeta R30 — proposta para revisão (14/10/2026)

## Autorização e estado

O diretor solicitou execução imediata para recuperar a qualidade jornalística anterior à retificação da R30: consultar Git, restaurar reportagens corretas, substituir completamente a pauta incorreta de Capitã Buske, preservar a retificação esportiva e testar desktop/mobile. Autorização **editorial**, em branch própria, **sem merge na main nem publicação em produção sem aprovação final**.

Base de produção consultada: `9908f297fd98c38054444aaa25f284f5db739d84`. Branch: `codex/gazeta-restauracao-editorial-r30-2026-10-14`. Caderno oficial consultado na versão remota da main. A entrega anterior foi uma correção de segurança que empobreceu os textos; esta intervenção recupera reportagem sem recuperar erro.

## Histórico consultado e critérios

Texto histórico efetivamente consultado: `src/services/gazeta/gazetaArchive.ts` do commit **`62144816e0a9ceafb32063ef64b4ee105ca06cbd`**, anterior à retificação. Comparado também com a versão factual resumida publicada em `9908f2`. Rascunhos do commit `83235a2` permanecem apenas como evidência contestada; não foram importados pela interface.

A nova leitura da planilha oficial fornecida pelo diretor retornou a versão `2026-10-14T18:59:08.861Z`. Conferência: 50 clubes, 1.500 pontuações R1–R30 iguais à cópia oficial corrigida já publicada. Nenhum dado foi gravado ou atualizado nesta intervenção.

Restaurar força editorial não significa reproduzir afirmações falsas. As manchetes corretas foram preservadas; parágrafos combinam trechos/expressões recuperados com ajustes necessários e redação nova. Números e evidências vêm dos registros conferidos. Não declarar restauração literal de uma matéria inteira que precisou de correção.

## Decisões por matéria

| Pauta | Origem anterior | Decisão e conferência |
| --- | --- | --- |
| Capa: drama dos 0,32 / Ninja / tríplice coroa | `6214481`, `manchete-r30` | Manchete original preservada. Recuperadas abertura cinematográfica, tensão dos centésimos e perseguição geral. Pontuações da ida/volta, menor margem entre 16 e Tainha/Furacão conferidos. Retificação fica no aviso próprio; capa volta a contar futebol. |
| Ninja atropela Marixco | `6214481`, `destaque-ninja` | Manchete preservada; narrativa de duas partidas recuperada. Sem "escalação perfeita" nem estado psicológico inventado. Diferença para a média é **26,05**, não 24: 122,33 contra média 96,28. Próximo rival Fernandoguinho, conforme chave existente. |
| Carlao07 / B10 / outubro | `6214481`, `destaque-carlao` | Recuperadas avalanche/atropelo e história cruzada copa–mensal. Manchete corrigida para "mantém"; agregado **265,94**, volta **117,13**, rival **176,26**, margem **89,68**. Maior agregado individual da Fase 4, não recorde de toda a temporada; segunda maior margem, atrás de Tainha 114,50. Carlao já liderava outubro após R29. Removidos capitães/desarmes inventados. |
| Império de Tainha | `6214481`, `cruzada-tainha` | Manchete preservada e três competições reconectadas. M10 119,86 x 117,68; B10 235,09 x 120,59; Geral 2.656,29. Sem afirmar perfeição de todas as rodadas, intenção pessoal ou falas de bastidores. Tríplice coroa como possibilidade. Pirika é o próximo rival. |
| Furacão caça Tainha | `6214481`, `cruzada-furacao` | Manchete preservada; narrativa das duas vitórias e pressão em duas frentes. R30 116,43 (**sexta**, não terceira); agregado 241,07 x 231,69; Geral 2.637,17; distância 19,12. Removida suposta melhor média recente sem definição. |
| Buske / volta por cima | `6214481`, `destaque-capita-buske`; resumo `9908f2`, `cruzada-buske` | **Descartada completamente como reportagem da R30**: pontuação 117,13, segunda maior, subida, críticas e psicologia não sustentadas. O resumo corrigido era verdadeiro, mas insuficiente como pauta relevante. Buske permanece no radar/aviso com **80,58**. Substituição: reportagem inédita Pretinho99 x Sovaco. |
| Odisseia vencedora de Galo | `6214481`, `cruzada-crf-galo`; resumo `9908f2`, `destaque-pirika` | Vitória de Galo e classificação nas oitavas **descartadas**, não restauradas. Nova história: Pirika interrompe a odisseia, conecta título de setembro à B10 e prepara encontro com Tainha. Pirika 229,49 x 200,39, vantagem 29,10. Galo venceu Buske nos playoffs, mas foi eliminado na Fase 4. |
| Resumo de Casquinha | Versão `9908f2`, `cruzada-casquinha` | Retirado da seleção de matérias para recuperar a pauta mais forte de Furacão. Sem apagar o clube ou seu resultado do radar. |

## Nova reportagem no lugar de Buske

**"Pretinho99 Vira a Batalha Contra o Sovaco e Sobrevive por 2,41 Pontos!"**

- Ida R29: Pretinho **116,96** x Sovaco **133,56**; desvantagem **16,60**.
- Volta R30: Pretinho **109,83** x Sovaco **90,82**; vitória por **19,01**.
- Agregado **226,79 x 224,38**, vantagem **2,41**, segunda menor entre os 16 confrontos corrigidos.
- Próximo adversário: Rivers of Babylon, sobrevivente da margem **0,32**; dupla confirmada no chaveamento publicado e já testado na retificação.

A história tem problema, reação e desfecho, além de contexto para as oitavas. Não inventa jogador, scout, intenção, comentário de técnico ou evento de partida real. Uma única reportagem desenvolve essa virada; a capa apenas a menciona. Pautas: panorama/centésimos, mitada, copa–mensal, virada, três frentes de Tainha, perseguição de Furacão e trajetória mensal–copa de Pirika. Sem duplicação de reportagens com o mesmo foco.

## Implementação e leitura dos textos completos

- Novo `src/services/gazeta/r30RestoredStories.ts`: curadoria narrativa R30 com origem documentada, números da fonte e guardas para liderança, maior pontuação, maior agregado, margens e virada.
- `confirmedGazetaBuilder.ts`: usa a curadoria nova somente na R30. R28/R29, tabelas, scores, radar, confrontos e aviso de retificação iguais à base; WhatsApp recebe a nova seleção editorial.
- `GazetaEditionView.tsx`: seis cartões permitem **Ler reportagem completa** com elemento nativo `details`, acessível por teclado. Antes, só o lead era apresentado; agora o corpo também é legível sem exigir cartões enormes fechados. A capa mantém texto completo visível.
- Novo `test_r30_editorial_restoration.ts`: sete pautas únicas, corpo e linha fina distintos, substituição de Buske, virada com dados independentes, fatos retificados, WhatsApp e renderização dos parágrafos completos.
- `REVISAO_EDITORIAL_R30_ANTES_DEPOIS.md`: três versões completas (histórico 6214481, edição resumida publicada 9908f2 e proposta restaurada), incluindo manchetes, linhas finas, leads, todos os parágrafos, evidências e WhatsApp proposto. Textos anteriores estão marcados como históricos e não publicáveis.
- Este relatório e seção 14 do Caderno: autorização, origem, decisões e passagem.

## Segurança e validação

Nenhuma alteração em App, proteção de cache, motores esportivos, registros de copas, planilha, scores, patrimônios, critérios, confrontos ou dados homologados. Pirika 229,49 x 200,39 Galo, Pirika x Tainha e Buske 80,58 permanecem válidos. Comparação automatizada prova todos os campos não editoriais R30 idênticos e edições R28/R29 integralmente idênticas à base publicada.

TypeScript, build, suíte factual existente, suíte de cache e novo teste editorial executados. Nova leitura oficial confrontada com as 1.500 pontuações. Navegador local em 1280×900 e 390×844, com rede totalmente interceptada: abertura de texto completo, história Pretinho, histórico, WhatsApp com fallback, erro de cópia, ausência de overflow/tela branca e retificação B10 preservada. Avaliação visual compara capturas da versão anterior com a proposta. Sem testar/declarar produção alterada; nenhum merge/publicação autorizado por esta entrega.

O build mantém avisos conhecidos de tamanho do bundle e import estático/dinâmico; não foram feitas mudanças estruturais/dependências para tratá-los.

## Mensagem à IA amiga

**Esta restauração editorial foi solicitada e autorizada pelo diretor. Preserve as reportagens completas, as manchetes recuperadas e a diversidade de pautas; não volte a substituí-las por textos genéricos ou apenas tabelas. Não restaure dados contestados, vitória do Galo na Fase 4, Buske com 117,13, scouts/causas inventadas ou preenchimentos fictícios. Consulte a versão mais recente do Caderno, a main e esta branch antes de editar. A retificação esportiva permanece soberana. A proposta ainda depende da revisão final do diretor para merge/publicação.**
