# CLAUDE.md — nuxt-duckdb-wasm

Guia para agentes de IA trabalhando neste projeto Nuxt 4 + DuckDB WASM.

---

## Comandos Essenciais

```bash
pnpm dev          # Servidor dev em http://localhost:3000 (geralmente já rodando)
pnpm build        # Build de produção
pnpm preview      # Preview do build de produção
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm format       # Formatação com dprint
```

### Testes

```bash
pnpm test              # Todos os testes
pnpm test:unit         # Testes unitários (test/unit/)
pnpm test:nuxt         # Testes de componente Nuxt (test/nuxt/)
pnpm test:e2e          # Testes E2E com Playwright (tests/)
pnpm test:e2e:ui       # E2E com UI
pnpm test:coverage     # Cobertura
pnpm test:watch        # Watch mode

# Arquivo único
pnpm vitest run test/unit/example.test.ts
pnpm playwright test tests/example.spec.ts
```

### Após Fazer Alterações

```bash
pnpm lint && pnpm typecheck && pnpm format
```

---

## Arquitetura DuckDB-WASM

| Arquivo                          | Responsabilidade                                       |
| -------------------------------- | ------------------------------------------------------ |
| `app/utils/duckdb.init.ts`       | Init lazy do DuckDB (chamado pelo primeiro composable) |
| `app/composables/useDuckDb.ts`   | Composable central                                     |
| `app/utils/duckdb.constantes.ts` | Constantes e URLs dos parquets                         |
| `app/utils/*.consultas.ts`       | Queries por dataset                                    |
| `app/composables/use*.ts`        | Composables por dataset                                |

### Padrão de Acesso R2

- `registerFileURL` e warmup foram **REMOVIDOS** — não usar
- Composables usam a URL completa do R2 diretamente: `const url = estacoesTremUrl`
- Queries por dataset em `app/utils/*.consultas.ts`; composables em `app/composables/use*.ts`

---

## Cloudflare R2

- **Bucket**: `teste-nuxt-duckdb-wasm`
- **Base pública**: `https://pub-1407a0cd06da4125aec80dc262085591.r2.dev`
- **Upload**: `wrangler r2 object put BUCKET/arquivo.parquet --file=local.parquet --remote`
- **IMPORTANTE**: sempre usar `--remote` (sem a flag = emulador local)

### Parquets Disponíveis

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

---

## Ferramentas de Desenvolvimento

### Chrome DevTools (MCP)

O MCP **chrome-devtools** (`mcp__chrome-devtools__*`) está disponível para interagir com o Chrome.
Use para: console do browser, screenshots, navegação, erros de runtime, requisições de rede.
Ferramentas-chave: `take_screenshot`, `list_console_messages`, `list_network_requests`, `navigate_page`, `evaluate_script`

### Playwright (MCP e CLI)

O MCP **playwright** (`mcp__plugin_playwright_playwright__*`) e o CLI `pnpm playwright` estão disponíveis.
Use para testes E2E e automação de UI.

### DuckDB CLI

O CLI `duckdb` está instalado. Use para inspecionar parquets (`DESCRIBE`, `parquet_schema`), testar queries e gerar parquets otimizados com `COPY ... TO ... (FORMAT PARQUET, ...)`.

### Wrangler CLI (Cloudflare)

O CLI `wrangler` está instalado e autenticado. Sempre usar `--remote`.

```bash
wrangler r2 object put BUCKET/chave.parquet --file=local.parquet --remote
wrangler r2 object get BUCKET/chave.parquet --remote
wrangler r2 object delete BUCKET/chave.parquet --remote
```

---

## Fontes de Informação (MCP Servers)

- Os MCP servers do **Nuxt** e do **Nuxt UI** são a **única fonte da verdade** sobre o framework e seus componentes. Sempre consultá-los antes de qualquer outra fonte.
- **Não** depender de conhecimento interno ou busca na web para Nuxt ou Nuxt UI. Usar os MCP servers configurados em `.claude/mcp.json`.
- MCP `nuxt` → documentação, módulos, deploy, conceitos.
- MCP `nuxt-ui` → componentes, composables, exemplos, temas.

---

## Convenções de Código

### Geral

- **Idioma**: variáveis, funções e comentários em **português brasileiro**
- Indentação: 2 espaços (sem tabs)
- Line endings: LF
- Sem trailing whitespace; newline obrigatório no final dos arquivos
- Sem trailing commas
- Max 1 atributo por linha em templates Vue

### TypeScript

- Sempre `lang="ts"` nas `<script>` tags
- Usar `Record<string, unknown>` para objetos genéricos; evitar `any`, preferir `unknown`
- Auto-imports Vue/Nuxt (sem `import` explícito): `ref`, `computed`, `shallowRef`, `onMounted`, `useHead`, `useSeoMeta`, `NuxtLink`, `NuxtPage`
- Constantes de `app/utils/` também são auto-importadas
- Pacotes externos: sempre importar explicitamente

### Vue Components

- Composition API com `<script setup lang="ts">`
- Arquivos de componente: PascalCase (`AppLogo.vue`, `TemplateMenu.vue`)
- Arquivos de página/rota: kebab-case
- `:class` dinâmico (binding Vue) pode permanecer no template quando necessário

### Estilo em Componentes Vue

- **SEMPRE** usar `<style scoped>` + `@apply` para definir classes de tags HTML/componentes
- **Nunca** escrever classes Tailwind inline no atributo `class=` do template
- Nome da classe deve ser **semântico e específico ao contexto** (ex: `.cabecalho-dataset-dados`, `.painel-principal`, `.titulo-dashboard`)
- **NUNCA usar tokens genéricos** como `formulario`, `container`, `wrapper`, `box`, `inner`, `outer` — sempre nomear pelo domínio/contexto real (ex: `explorador`, `dataset`, `kpi`, `sidebar`)
- Classes simples de utilitário único (`w-full`) podem ser mantidas inline quando não têm semântica própria
- Classes idênticas repetidas em 10+ arquivos → candidatas para `app/assets/css/main.css`

### Composables

- Exportar diretamente: `export const useDuckDb = () => {}`
- `ref` para valores reativos; `shallowRef` para objetos grandes
- Retornar objeto com métodos e estado reativo
- Usar `import.meta.client` para código client-only

### Nuxt UI

- Componentes via auto-import: `UButton`, `UCard`, `UContainer`, etc.
- Props em kebab-case: `:ui="{ body: 'p-0!' }"`
- Ícones via Iconify: `icon="i-lucide-rocket"`, `icon="i-simple-icons-github"`

### Tratamento de Erros

- `try/catch/finally` para operações assíncronas
- `console.error("descrição:", error)` para logs
- Valores de fallback: `quantidade?.total ?? 0`
- Sempre definir `estahCarregando.value = false` no `finally`

### DuckDB WASM

- Versão: 1.32.0
- Sanitizar BigInt: `typeof value === "bigint" ? Number(value) : value`
- Sempre fechar conexões: `await conn.close()` no `finally`

### Testes

- Unitários: `test/unit/*.test.ts`
- Componentes: `test/nuxt/*.test.ts` com `@nuxt/test-utils/runtime` e `mountSuspended`
- E2E: `tests/*.spec.ts` com `@nuxt/test-utils/playwright`
- `describe()` para agrupamento; `it()` ou `test()` para casos individuais

### Organização de Arquivos

```
app/              # Páginas, componentes, composables, utils
shared/           # Utilitários compartilhados app/server
test/unit/        # Testes unitários
test/nuxt/        # Testes de componente
tests/            # Testes E2E
public/           # Assets estáticos
```
