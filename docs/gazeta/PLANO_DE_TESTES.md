# Plano de testes e evolução

## Verificações desta preparação

- Apenas `docs/CADERNO_DE_CAMPO.md` e arquivos de `docs/gazeta/` diferem da base remota.
- Conteúdo anterior do Caderno preservado; registro oficial acrescido de seção 7.
- Verificador manual lê somente o JSON fictício vizinho; sem rede, imports do aplicativo ou escrita.
- Nenhum arquivo do pacote importado por `src/`; nenhum ajuste em dependências, build ou configurações.
- Links locais existentes e diff sem erros de whitespace.
- Verificação TypeScript: `npm run lint` (`tsc --noEmit`). Não iniciar `npm run dev` ou `npm start`: servidor pode sincronizar no boot.
- Casos fictícios aprovados e reprovados como previsto; teste de integridade confirma que a validação não modifica suas entradas.

Essas verificações comprovam isolamento documental e dos exemplos, não certificam a saúde de produção nem resolvem os riscos esportivos existentes. Não é necessário rebuild do produto para esta entrega sem mudanças executáveis do aplicativo.

## Futuras regressões, apenas após autorização

| Caso | Expectativa |
| --- | --- |
| Ausência, zero, negativo, entrada inválida | Informação correta ou afirmação suspensa; sem preenchimento inventado. |
| Ida disponível e volta pendente | Apenas acompanhamento parcial; nenhum classificado criado. |
| Dados completos sem homologação | Não anunciar consequência definitiva. |
| Resultado confirmado recebido | Relato corresponde exatamente ao registro reconhecido. |
| Igualdade / desempate | Não decidir vencedor; receber resultado oficial. |
| Liderança mantida / posições inalteradas | Não inventar mudança ou queda. |
| Histórias cruzadas | Mesmo ID, período compatível, evidência independente por competição. |
| Clube eliminado de uma copa | Continua considerado em outras competições. |
| Rivalidade / favoritismo / recorde | Critério explícito e histórico suficiente. |
| Rodada tranquila | Acompanhamento sem drama obrigatório. |
| Metáforas | Personalidade preservada sem acontecimentos ou causas inventados. |
| Edição publicada / WhatsApp | Mesma edição; fontes novas não reescrevem o publicado. |
| Imutabilidade | Nenhum objeto, resultado ou dado esportivo modificado. |

Testar em cópias isoladas ou cenários fictícios identificados, nunca diretamente no sistema oficial. Futuras extrações de arquivo editorial e WhatsApp exigem comparação literal antes/depois e avaliação visual.

## Sequência planejada — não autorização automática

1. Organizar a base técnica e editorial (esta entrega).
2. Validar fontes oficiais com IA amiga e responsável.
3. Desenvolver observação de acontecimentos da temporada.
4. Conectar histórias de um clube entre competições.
5. Definir seleção e prioridade das notícias.
6. Redigir com personalidade e rigor factual.
7. Implantar revisão editorial e preservação de edições.
8. Testar isoladamente antes de integrar ao aplicativo oficial.

O isolamento deve acompanhar todas as etapas. Não liberar etapas 3–8 pelo simples fato de existirem neste plano.

## Coordenação

Codex prepara e revisa contratos/verificações; IA amiga valida fontes e conduz integração futura autorizada; Gepeto revisa pauta e linguagem; responsável aprova escopo, execução e publicação. Um executor por arquivo, versão de referência comum e passagem explícita. Não criar uma suíte ou alterar `package.json` sem autorização específica.
