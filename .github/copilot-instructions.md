# Copilot Instructions — nuxt-duckdb-wasm

Aplicação Nuxt 4 + DuckDB WASM que executa consultas SQL diretamente no navegador sobre arquivos Parquet hospedados no Cloudflare R2.

## Idioma

**Todo código deve usar português brasileiro**: variáveis, funções, constantes, nomes de arquivos e comentários. Preferir nomes longos e descritivos — evitar abreviações.

## Comandos

```bash
pnpm dev            # Servidor dev (http://localhost:3000)
pnpm build          # Build de produção
pnpm lint           # ESLint
pnpm typecheck      # TypeScript
pnpm format         # Formatação (dprint)

# Testes
pnpm test           # Todos (Vitest)
pnpm test:unit      # Unitários (test/unit/)
pnpm test:nuxt      # Componentes Nuxt (test/nuxt/)
pnpm test:e2e       # E2E Playwright (tests/)

# Arquivo único
pnpm vitest run test/unit/exemplo.test.ts
pnpm playwright test tests/exemplo.spec.ts

# Validação pós-mudança
pnpm lint && pnpm typecheck && pnpm format
```

## Arquitetura

### Modelo client-only com DuckDB WASM

- `ssr: false` — toda lógica é client-side (SPA)
- DuckDB WASM é carregado via CDN (jsdelivr) por exceder o limite de 25MB do Cloudflare Pages
- Cross-Origin Isolation (COOP/COEP) habilitado para SharedArrayBuffer em 3 camadas: server middleware, nitro routeRules e `public/_headers`
- Workers de CDN externo são convertidos em blob URL para compatibilidade com COI

### Fluxo de dados por dataset

Cada dataset segue um padrão em 3 camadas:

1. **`app/consultas/<dataset>.consultas.ts`** — funções puras que retornam strings SQL parametrizadas pelo nome do arquivo Parquet
2. **`app/composables/use<Dataset>.ts`** — composable que orquestra o carregamento: registra o Parquet, executa as consultas, gerencia estado reativo (`ref`/`shallowRef`) e formata dados para a UI
3. **`app/pages/<rota>.vue`** — página que consome o composable e renderiza os componentes

O composable central `useDuckDb.ts` fornece `executar(sql)` e `registrarParquet(url)` usados por todos os composables de dataset.

### Inicialização DuckDB (`app/utils/duckdb.init.ts`)

- Import dinâmico de `@duckdb/duckdb-wasm` (não bundled — excluído do Vite optimizeDeps)
- Worker criado via blob URL com `importScripts` para contornar restrições de COI
- Pthread worker baixado via fetch e convertido em blob URL
- Instância global compartilhada via `shallowRef`

### Constantes e URLs (`app/utils/duckdb.constantes.ts`)

- Base pública R2: `https://pub-1407a0cd06da4125aec80dc262085591.r2.dev`
- Cada Parquet tem uma constante de URL exportada (ex: `eletricidadeFinlandiaUrl`)
- Todas são auto-importadas via Nuxt

### Componentes de gráficos

Componentes `Grafico*` são **excluídos do auto-import** no `nuxt.config.ts` para evitar bundle de ~300KB do ECharts. Importados explicitamente via `defineAsyncComponent` em `app/utils/lazy-components.ts`.

## Convenções de código

### TypeScript e Vue

- `<script setup lang="ts">` obrigatório
- Auto-imports Vue/Nuxt: `ref`, `computed`, `shallowRef`, `onMounted`, `useHead`, etc. — sem `import` explícito
- Constantes de `app/utils/` e funções de `app/consultas/` são auto-importadas
- Pacotes externos: sempre importar explicitamente
- Evitar `any` — preferir `unknown` ou `Record<string, unknown>`

### Estilo em componentes Vue

- **Sempre** `<style scoped>` com `@apply` do Tailwind — nunca classes Tailwind inline no `class=`
- Nomes de classe semânticos e específicos ao contexto do domínio (ex: `.cabecalho-dataset-dados`, `.painel-kpi-energia`)
- Nunca usar tokens genéricos como `container`, `wrapper`, `box`, `inner`, `outer`
- Referência ao CSS base via `@reference "../assets/css/main.css"` ou `@reference "tailwindcss"`

### Composables

- Exportar diretamente: `export const useDuckDb = () => {}`
- `ref` para valores reativos; `shallowRef` para objetos grandes (instância DuckDB)
- Retornar objeto com métodos e estado reativo
- Usar `import.meta.client` para código client-only
- `try/catch/finally` para operações assíncronas — sempre definir `estahCarregando.value = false` no `finally`

### DuckDB WASM

- Sanitizar BigInt: `typeof value === "bigint" ? Number(value) : value` (via `sanitizeRow`)
- Sempre fechar conexões no `finally`: `await conn.close()`
- `registerFileURL` e warmup foram removidos — usar `registrarParquet(url)` que faz cache em Cache API/OPFS
- Queries usam o nome do arquivo Parquet registrado, não a URL direta

### Formatação

- Indentação: 2 espaços, sem tabs
- Sem trailing commas (regra ESLint `commaDangle: "never"`)
- Max 1 atributo por linha em templates Vue (dprint `maxAttrsPerLine: 1`)
- Formatter: dprint (não Prettier)

### Testes

- Unitários: `test/unit/*.test.ts` — environment `node`
- Componentes: `test/nuxt/*.test.ts` — environment `nuxt` com `@vitest/browser-playwright`
- E2E: `tests/*.spec.ts` — Playwright direto
- `describe()` para agrupamento; `it()` ou `test()` para casos individuais

### Nuxt UI

- Componentes auto-importados: `UButton`, `UCard`, `UTable`, `UPagination`, etc.
- Ícones via Iconify: `icon="i-lucide-rocket"`, `icon="i-simple-icons-github"`

## Cloudflare R2

- Bucket: `teste-nuxt-duckdb-wasm`
- Upload: `wrangler r2 object put teste-nuxt-duckdb-wasm/arquivo.parquet --file=local.parquet --remote`
- **Sempre** usar `--remote` (sem a flag usa emulador local)
