# Pendências e achados — sem correções no aplicativo

Base de código: `3532b5a1aae62320c6162da29c27564f3bb46dec`. Linhas são referências dessa versão, não garantias para revisões futuras.

## Conteúdo factual não sustentado

| Arquivo / linha | Achado | Tratamento futuro sujeito a aprovação |
| --- | --- | --- |
| `src/pages/GazetaC10.tsx:114` | R23 atribui liderança a uma assistência ou desarme. | Revisão histórica explícita; não reescrever silenciosamente. |
| `src/pages/GazetaC10.tsx:565` | Pior pontuação atribuída a perda de SG e cartões de atletas. | Redação baseada no resultado, mantendo personalidade esportiva. |
| `src/pages/GazetaC10.tsx:533` | Avaliação de escalação não apurada. | Separar desempenho observado de conclusão sobre composição do time. |
| `src/pages/GazetaC10.tsx:674` | Média de uma rodada declarada prova de evolução tática. | Exigir comparação temporal ou mudar redação, após aprovação. |
| `src/pages/GazetaC10.tsx:680` | Garantia fixa de auditoria integral dos 50 clubes. | Não anunciar verificação não demonstrada. |
| `src/pages/Destaques.tsx:216` | Esquecimento do mercado atribuído ao participante no fallback da R1. | Fora da limpeza inicial da Gazeta; coordenação separada. |
| `src/pages/Destaques.tsx:266` | Desgaste de elenco usado como causa sem evidência. | Coordenação separada; preservar lógica existente. |

Metáforas esportivas não estão incluídas como problemas apenas por serem emocionantes. Nenhum desses trechos foi alterado nesta entrega.

## Limitações arquiteturais

- Matérias cadastradas e fallback genérico; ausência de visão integrada das competições.
- R30 sem cobertura estruturada da B10 na versão auditada.
- Histórico mistura redação fixa com valores atuais; mudar texto genérico ou entradas pode mudar edições antigas.
- Boletim WhatsApp não é uma cópia preservada de uma edição publicada.
- Falta de evidência explícita de homologação e de separação confiável entre ausência e zero.
- Comparações históricas a partir de dados atuais não garantem o retrato realmente publicado no passado.
- `Destaques.tsx` força mínimo de uma posição em alguns retornos; não importar essas saídas como fato jornalístico.

## R21 — registro de responsabilidade

O diretor corrigiu Fernandoguinho FC para **29,80**. O Codex confirmou nova leitura da fonte em 14/10/2026: `29.80`, sem a data antes retornada, menor valor entre os 50 clubes na R21. O parser atual converte essa representação corretamente. **O Codex não efetuou a correção.** Tipo interno da célula, sincronização do servidor e cache de usuários não foram certificados. Nenhum resultado ou classificação foi recalculado ou substituído por esta entrega.

## Decisões ainda necessárias

1. IA amiga e responsável: fontes reconhecidas de cada competição e sinais de homologação.
2. Identificadores estáveis dos clubes e vínculo entre fontes.
3. Âmbito e completude necessários para trajetórias, recordes e rivalidades.
4. Política de preservação, publicação, correção e aprovação editorial.
5. Critérios de pauta, proporcionalidade e diversidade, revisados pelo Gepeto.
6. Momento seguro e autorização específica para futuras integrações.

Riscos esportivos encontrados anteriormente continuam apenas relatados; este pacote não corrige desempates, importação ou homologação. A tabela de scouts foi descartada, não permanece pendente de implementação.
