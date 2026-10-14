# Preparação da Gazeta C10

Entrega autorizada pelo diretor em 14/10/2026. Base remota: `3532b5a1aae62320c6162da29c27564f3bb46dec`. O registro oficial é [Caderno de Campo](../CADERNO_DE_CAMPO.md), seção 7. Não há um Diário paralelo.

## Comece aqui

1. [Diretrizes editoriais](DIRETRIZES_EDITORIAIS.md): decisões vigentes.
2. [Mapa técnico e fontes](MAPA_TECNICO.md): o que existe e suas fronteiras.
3. [Pendências](PENDENCIAS.md): problemas relatados, sem correção no aplicativo.
4. [Contrato de observação](CONTRATO_DE_OBSERVACAO.md): proposta para revisão, não integração pronta.
5. [Plano de testes e evolução](PLANO_DE_TESTES.md): critérios para futuras autorizações.
6. [Casos fictícios](validacao/casos.json) e [verificador isolado](validacao/verificar.mjs).

## O que esta entrega faz

Organiza conhecimento, registra autorização e verifica casos fictícios de consistência do contrato. Não altera `src/`, servidor, configurações, dependências, dados esportivos, textos publicados ou edições antigas. O verificador é material de apoio, não módulo do produto. Não inicia o servidor nem executa sincronização.

Execute manualmente, na raiz do repositório:

```sh
node docs/gazeta/validacao/verificar.mjs
```

Não há dependência nova ou integração com build, CI, `package.json` ou aplicativo. Os casos não representam clubes ou resultados de 2026.

## Passagem para a IA amiga

Leia a autorização no Caderno; confira o estado atual do repositório; valide as fontes reconhecidas de cada competição e revise o contrato antes de programar. Nenhuma etapa futura está autorizada automaticamente. Scouts e analogias de pontuação foram descartados.

Para revisar a entrega, comparar com a base remota acima. Para reverter, remover apenas os arquivos desta pasta e a seção 7 acrescentada ao Caderno, após coordenação; nunca restaurar o Caderno inteiro sobre registros posteriores da equipe.
