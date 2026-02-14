# Visão Geral do Projeto

## Propósito
**nuxt-duckdb-wasm** é uma aplicação web que roda o DuckDB (banco de dados analítico SQL) inteiramente no navegador via WebAssembly. Permite que os usuários consultem datasets Parquet (locais e remotos) com SQL, exibindo resultados paginados em uma tabela.

## Stack Tecnológica
- **Framework**: Nuxt 4 (Vue 3) com SSR desabilitado (modo SPA)
- **Biblioteca de UI**: Nuxt UI 4 (baseado em Tailwind CSS 4)
- **Banco de dados**: DuckDB WASM (roda no navegador, sem banco no backend)
- **Linguagem**: TypeScript (estrito)
- **Gerenciador de pacotes**: pnpm 10
- **Node**: 24+
- **Formatador**: dprint (NÃO é Prettier)
- **Linter**: ESLint via @nuxt/eslint
- **Testes unitários/componente**: Vitest 4 + @nuxt/test-utils + @vitest/browser-playwright
- **Testes E2E**: Playwright
- **CI**: GitHub Actions (lint + typecheck a cada push)

## Decisões Arquiteturais Importantes
- **Somente SPA** (`ssr: false`) — DuckDB WASM requer execução no client-side
- **Cabeçalhos Cross-Origin Isolation** necessários para SharedArrayBuffer (usado pelas threads do DuckDB WASM)
  - Definidos tanto em `nuxt.config.ts` (nitro routeRules) quanto em `server/middleware/cross-origin-isolation.ts`
- **Sem API backend** — todo o processamento de dados acontece no client-side via DuckDB WASM
- **Arquivos Parquet** servidos da pasta public/ ou buscados de URLs remotas (CDN, HuggingFace, etc.)
- **Bundle COI do DuckDB desabilitado** devido a bug upstream (extensões não compiladas com shared memory)

## Fluxo de Dados
1. Usuário seleciona um dataset no dropdown (definido em `duckdb.constantes.ts`)
2. O composable `useDuckDb()` inicializa o DuckDB WASM no primeiro uso (lazy init)
3. Consultas SQL são construídas via funções auxiliares em `duckdb.selects.ts`
4. Resultados são sanitizados (BigInt → Number) e exibidos em uma tabela paginada
5. A paginação suporta navegação por teclado com debounce
