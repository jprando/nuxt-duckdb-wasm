# Copilot Instructions — nuxt-duckdb-wasm

Aplicação Nuxt 4 + DuckDB WASM que executa consultas SQL diretamente no navegador sobre arquivos Parquet hospedados no Cloudflare R2.

## Idioma

**Todo código deve usar português brasileiro**: variáveis, funções, constantes, tipos, interfaces, nomes de arquivos e comentários. Preferir nomes longos e descritivos — evitar abreviações.

## Comandos

```bash
pnpm dev            # Servidor dev (http://localhost:3000)
pnpm build          # Build de produção
pnpm preview        # Preview do build de produção
pnpm lint           # ESLint
pnpm typecheck      # TypeScript
pnpm format         # Formatação (dprint)

# Testes
pnpm test              # Todos (Vitest)
pnpm test:unit         # Unitários (test/unit/)
pnpm test:nuxt         # Componentes Nuxt (test/nuxt/)
pnpm test:e2e          # E2E Playwright (tests/)
pnpm test:e2e:ui       # E2E com UI interativa
pnpm test:coverage     # Cobertura de testes
pnpm test:watch        # Watch mode

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

### Arquivos principais

| Arquivo                          | Responsabilidade                                       |
| -------------------------------- | ------------------------------------------------------ |
| `app/utils/duckdb.init.ts`       | Init lazy do DuckDB (chamado pelo primeiro composable) |
| `app/composables/useDuckDb.ts`   | Composable central                                     |
| `app/utils/duckdb.constantes.ts` | Constantes e URLs dos parquets                         |
| `app/consultas/*.consultas.ts`   | Queries por dataset                                    |
| `app/composables/use*.ts`        | Composables por dataset                                |

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

### Geral

- Indentação: 2 espaços (sem tabs)
- Line endings: LF
- Sem trailing whitespace; newline obrigatório no final dos arquivos
- Sem trailing commas
- Max 1 atributo por linha em templates Vue (dprint `maxAttrsPerLine: 1`)
- Formatter: dprint (não Prettier)

### TypeScript e Vue

- `<script setup lang="ts">` obrigatório
- Auto-imports Vue/Nuxt: `ref`, `computed`, `shallowRef`, `onMounted`, `useHead`, `useSeoMeta`, `NuxtLink`, `NuxtPage`, etc. — sem `import` explícito
- Constantes de `app/utils/` e funções de `app/consultas/` são auto-importadas
- Pacotes externos: sempre importar explicitamente
- Evitar `any` — preferir `unknown` ou `Record<string, unknown>`
- `:class` dinâmico (binding Vue) pode permanecer no template quando necessário

### Tipos TypeScript

- **Nunca** criar tipos/interfaces soltos fora dos diretórios contextuais
- Colocar tipos no diretório correto conforme o contexto de uso:
  - `app/types/<contexto>.types.ts` — usado apenas na camada app (componentes, composables, plugins)
  - `server/types/<contexto>.types.ts` — usado apenas na camada server (rotas de API, middleware)
  - `shared/types/<contexto>.types.ts` — usado em ambas as camadas (modelos de domínio, DTOs)
- Usar extensão `.types.ts` para tipos de domínio (nunca `.d.ts` para domínio — `.d.ts` só para ambient/globais)
- Agrupar por bounded context/DDD (ex: `trens-holandeses.types.ts`, `duckdb.types.ts`)
- Exportar tipos com `export` e importar com `import type { ... } from '~/types/<contexto>.types'`
- **Nunca** definir `type` ou `interface` dentro do corpo de funções, composables ou componentes — sempre no nível do módulo ou em arquivo dedicado em `app/types/`
- Augmentations (`.d.ts`) no contexto correspondente: `app/` para PageMeta/AppConfig, `server/` para Nitro/H3, `shared/` para ambos

### Nomes de componentes e páginas Vue

- Arquivos de componente: PascalCase (`AppLogo.vue`, `TemplateMenu.vue`)
- Arquivos de página/rota: kebab-case

### Estilo em componentes Vue

- **Sempre** `<style scoped>` com `@apply` do Tailwind — nunca classes Tailwind inline no `class=`
- Nomes de classe semânticos e específicos ao contexto do domínio (ex: `.cabecalho-dataset-dados`, `.painel-kpi-energia`)
- **Nunca** usar tokens genéricos como `container`, `wrapper`, `box`, `inner`, `outer` — sempre nomear pelo domínio/contexto real (ex: `explorador`, `dataset`, `kpi`, `sidebar`)
- Classes simples de utilitário único (`w-full`) podem ser mantidas inline quando não têm semântica própria
- Referência ao CSS base via `@reference "../assets/css/main.css"` ou `@reference "tailwindcss"`
- Classes idênticas repetidas em 10+ arquivos → candidatas para `app/assets/css/main.css`

### Composables

- Exportar diretamente: `export const useDuckDb = () => {}`
- `ref` para valores reativos; `shallowRef` para objetos grandes (instância DuckDB)
- Retornar objeto com métodos e estado reativo
- Usar `import.meta.client` para código client-only
- `try/catch/finally` para operações assíncronas — sempre definir `estahCarregando.value = false` no `finally`
- `console.error("descrição:", error)` para logs de erro
- Valores de fallback: `quantidade?.total ?? 0`

### DuckDB WASM

- Versão: 1.32.0
- Sanitizar BigInt: `typeof value === "bigint" ? Number(value) : value` (via `sanitizeRow`)
- Sempre fechar conexões no `finally`: `await conn.close()`
- `registerFileURL` e warmup foram removidos — usar `registrarParquet(url)` que faz cache em Cache API/OPFS
- Queries usam o nome do arquivo Parquet registrado, não a URL direta

### Testes

- Unitários: `test/unit/*.test.ts` — environment `node`
- Componentes: `test/nuxt/*.test.ts` — environment `nuxt` com `@nuxt/test-utils/runtime` e `mountSuspended`
- E2E: `tests/*.spec.ts` — Playwright com `@nuxt/test-utils/playwright`
- `describe()` para agrupamento; `it()` ou `test()` para casos individuais

### Nuxt UI

- Componentes auto-importados: `UButton`, `UCard`, `UTable`, `UPagination`, etc.
- Props em kebab-case: `:ui="{ body: 'p-0!' }"`
- Ícones via Iconify: `icon="i-lucide-rocket"`, `icon="i-simple-icons-github"`

### Organização de arquivos

```
app/              # Páginas, componentes, composables, utils
app/types/        # Tipos de domínio usados na camada app
server/           # Rotas de API, middleware server-side
server/types/     # Tipos usados apenas no server
shared/           # Utilitários compartilhados app/server
shared/types/     # Tipos compartilhados entre app e server
test/unit/        # Testes unitários
test/nuxt/        # Testes de componente
tests/            # Testes E2E
public/           # Assets estáticos
```

## Cloudflare R2

- Bucket: `teste-nuxt-duckdb-wasm`
- Base pública: `https://pub-1407a0cd06da4125aec80dc262085591.r2.dev`
- Upload: `wrangler r2 object put teste-nuxt-duckdb-wasm/arquivo.parquet --file=local.parquet --remote`
- **Sempre** usar `--remote` (sem a flag usa emulador local)

### Parquets disponíveis

| Arquivo                  | Tamanho | Descrição                                                                                   | Constante                  |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------- | -------------------------- |
| stations                 | 4.8 KB  | Estações de trem                                                                            | —                          |
| shakespeare              | ~1 MB   | Obras de Shakespeare                                                                        | —                          |
| tariffs                  | 196 KB  | Tarifas ferroviárias                                                                        | —                          |
| train_services           | ~1.8 MB | Serviços de trem                                                                            | —                          |
| yellow_2024-01           | 2 MB    | Táxi NYC Jan/2024                                                                           | —                          |
| ontime                   | 14 MB   | Pontualidade de voos                                                                        | —                          |
| taxi_2019_04             | 47 MB   | Táxi NYC Abr/2019                                                                           | —                          |
| yellow_2010-01           | 110 MB  | Táxi NYC Jan/2010                                                                           | —                          |
| electricity_finland_2021 | 57 KB   | Eletricidade Finlândia (7.9k rows; cols: time, price)                                       | `eletricidadeFinlandiaUrl` |
| diffusiondb_meta         | 14 MB   | DiffusionDB (2M rows; cols: user_name, image_nsfw, step, sampler, timestamp, width, height) | `diffusionDBUrl`           |
| prices_sample            | 526 B   | Preços de ações (9 rows; cols: ticker, when, price)                                         | `precosAcoesUrl`           |
