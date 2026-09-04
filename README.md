# Só Camisa 10

Sistema de gestão e acompanhamento de torneios de Fantasy Game (Cartola FC) da Liga Só Camisa 10. Contempla chaveamento de mata-mata, Copa M10, Copa B10, Recopa Mensal, Fase de Grupos, Play-offs, Rankings Gerais e Painel Administrativo de sincronização.

## 🚀 Tecnologias

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend:** Node.js, Express, TypeScript (tsx/esbuild)
- **Integração:** Google Sheets ETL & API Cartola FC
- **Build Tool:** Vite 6

## 📦 Como Executar

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou bun

### Instalação

```bash
npm install
```

### Desenvolvimento

Para iniciar o servidor com sincronização e suporte à API:

```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:3000`.

### Build de Produção

```bash
npm run build
```

Para iniciar a versão compilada de produção:

```bash
npm start
```

### Verificação de Tipos / Lint

```bash
npm run lint
```

## 📋 Funcionalidades

- **Dashboard:** Visão geral da rodada atual, classificação e histórico.
- **Copa M10:** Fase de grupos, repescagem e chaveamento eliminatório (1/16 até a Final).
- **Copa B10:** Sistema multicamadas (Termômetro da Repescagem, Play-offs, Elite 32 e Chaveamento Final).
- **Mata-Mata:** Árvore de confrontos interativa com contraste aprimorado e indicação de classificados.
- **Recopa Mensal:** Acompanhamento dos melhores desempenhos e patrimônio mês a mês.
- **Painel Admin:** Controle de rodadas ativas, simulações manuais e sincronização com Google Sheets.
