# Nuxt + DuckDB WASM

Aplicacao Nuxt 4 que utiliza **DuckDB WASM** para realizar consultas SQL diretamente no navegador, permitindo analise de dados Parquet sem necessidade de backend.

## Visao Geral

Este projeto demonstra como executar consultas SQL e analise de dados diretamente no lado do cliente usando WebAssembly. A aplicacao roda em modo **SPA** (`ssr: false`) com **Cross-Origin Isolation** habilitado para suporte a SharedArrayBuffer.

## Stack Tecnologico

### Core Framework

- **Nuxt 4.3.1** - Framework Vue com compatibilityVersion 5
- **Vue 3** - Interface reativa
- **TypeScript 5.9.3** - Tipagem estatica

### UI & Styling

- **Nuxt UI 4.4.0** - Biblioteca de componentes (baseada em Tailwind CSS)
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **@nuxt/image 2.0.0** - Otimizacao de imagens
- **@nuxt/hints 1.0.0-alpha.6** - Dicas de desenvolvimento

### Banco de Dados

- **@duckdb/duckdb-wasm 1.33.1-dev19.0** - DuckDB rodando via WebAssembly
- Carregado via **jsdelivr CDN** (nao e bundled, ultrapassa o limite de 25MB do Cloudflare)
- **Suporte a Parquet** - Formato colunar eficiente para analise

### Ferramentas de Desenvolvimento

- **ESLint 9.39.2** - Linting de codigo
- **dprint 0.51.1** - Formatter rapido
- **pnpm 10.29.1** - Gerenciador de pacotes

### Testes

- **Vitest 4.0.18** - Testes unitarios e de componentes
- **Playwright 1.58.2** - Testes E2E
- **@vue/test-utils 2.4.6** - Utilitarios para testes Vue

### Node Environment

- **Node 24.13.0+** - Runtime JavaScript
- **NPM 11.9.0+** - Gerenciador de pacotes

## Estrutura do Projeto

```
projeto/
├── app/
│   ├── app.vue                    # Layout principal com Header/Footer
│   ├── app.config.ts              # Configuracoes da aplicacao (UI colors, etc)
│   ├── assets/css/main.css        # Tema customizado (cores green, font Public Sans)
│   ├── components/
│   │   ├── AppLogo.vue            # Logo SVG do projeto
│   │   └── TemplateMenu.vue       # Componente de menu
│   ├── composables/
│   │   └── useDuckDb.ts           # Composable principal do DuckDB WASM
│   ├── utils/
│   │   ├── duckdb.init.ts         # Inicializacao DuckDB (CDN, Worker, blob URL)
│   │   ├── duckdb.selects.ts      # Builders de queries SQL
│   │   ├── duckdb.constantes.ts   # Constantes e definicoes de datasets
│   │   └── duckdb.sanitizeRow.ts  # Sanitizacao de BigInt para Number
│   └── pages/
│       └── index.vue              # Pagina principal com tabela de dados
│
├── server/
│   └── middleware/
│       └── cross-origin-isolation.ts  # Headers COOP/COEP para SharedArrayBuffer
│
├── public/
│   ├── favicon.ico                # Icone do site
│   ├── _headers                   # Headers Cloudflare (COOP/COEP)
│   └── yellow_tripdata_2024-01.parquet  # Dataset de viagens de taxi NYC
│
├── shared/
│   └── utils/
│       └── formatar.ts            # Utilitario de formatacao (numeros pt-BR)
│
├── test/
│   ├── unit/
│   │   └── example.test.ts        # Teste unitario de exemplo
│   └── nuxt/
│       └── component.test.ts      # Teste de componente Nuxt
│
├── tests/
│   └── example.spec.ts            # Teste E2E de exemplo
│
├── .github/workflows/
│   └── ci.yml                     # Pipeline CI/CD (GitHub Actions)
│
├── nuxt.config.ts                 # Configuracao do Nuxt
├── vitest.config.ts               # Configuracao do Vitest
├── playwright.config.ts           # Configuracao do Playwright
├── eslint.config.mjs              # Configuracao do ESLint
├── dprint.json                    # Configuracao do dprint formatter
├── tsconfig.json                  # Configuracao do TypeScript
└── package.json                   # Dependencias e scripts
```

## Funcionalidades Principais

### 1. Interface de Dados (`app/pages/index.vue`)

- Tabela interativa com paginacao responsiva
- Seletor de dataset com **12 datasets** organizados em 7 grupos:
  - **Local**: Dados gerados em memoria + Parquet local (NYC Taxi)
  - **Taxi (NYC)**: Abr/2019, Jan/2010
  - **Ferroviario**: Servicos de trem, tarifas, estacoes (Holanda)
  - **Outros**: Corpus de Shakespeare, dados de voos
  - **Redes Sociais**: Posts HackerNews
  - **Financeiro**: Precos de acoes
  - **Energia**: Eletricidade Finlandia
- Paginacao com 50 itens por pagina e sibling count responsivo (0-9 botoes conforme largura da tela)
- Tempo de execucao da query (ms ou segundos)
- Skeleton loading durante carregamento
- Contador total de registros formatado em pt-BR

### 2. DuckDB WASM Integration

**Composable (`app/composables/useDuckDb.ts`):**

- Orquestra inicializacao, queries e estados de carregamento
- Loading state com debounce de 400ms (evita flicker)

**Inicializacao (`app/utils/duckdb.init.ts`):**

- Carrega DuckDB via CDN jsdelivr (dynamic import)
- Cria Worker via blob URL para compatibilidade com Cross-Origin Isolation
- Pthread worker baixado via fetch e convertido em blob URL
- Detecta versao e tipo de bundle (mvp/eh)

**Funcoes disponveis:**

- `execute(sql)` - Executa consultas SQL
- `registrarArquivoRemoto(url)` - Registra URL no HTTP FS do DuckDB
- `obterDadosSimples(pagina, tamanhoPagina)` - Dados gerados (range de 10.000)
- `obterDadosParquet(pagina, tamanhoPagina, url)` - Consulta datasets Parquet

**Queries (`app/utils/duckdb.selects.ts`):**

- SQL builders com LIMIT/OFFSET para paginacao

**Sanitizacao (`app/utils/duckdb.sanitizeRow.ts`):**

- Converte BigInt para Number (compatibilidade JavaScript)

### 3. Cross-Origin Isolation

- Headers COOP/COEP configurados em 3 camadas:
  - `server/middleware/cross-origin-isolation.ts` (dev)
  - `nuxt.config.ts` via nitro routeRules
  - `public/_headers` (Cloudflare Pages)
- Necessario para SharedArrayBuffer (DuckDB multi-threading)

### 4. Layout (`app/app.vue`)

- Header com logo e toggle de tema claro/escuro
- Exibe versao do DuckDB WASM (ex: "DuckDB WASM v1.33.1 (mvp)")
- Footer com copyright e link para GitHub
- SEO otimizado (meta tags, Open Graph, Twitter Cards)

### 5. Configuracoes

**Nuxt Config (`nuxt.config.ts`):**

- `ssr: false` - Modo SPA (client-side only)
- Modulos: ESLint, UI, Hints, Image, Scripts, Test Utils
- WASM habilitado no Nitro
- DuckDB excluido do Vite optimizeDeps (carregado via CDN)
- Worker format configurado para ES

**Estilos (`main.css`):**

- Fonte Public Sans
- Paleta de cores green customizada (50-950)
- Integracao com @nuxt/ui e Tailwind CSS

## Fluxo de Dados

```
Usuario seleciona dataset e clica "carregar"
    |
useDuckDb.obterDadosParquet() / obterDadosSimples()
    |
Init DuckDB (se nao inicializado)
    |
Registrar URL do arquivo Parquet no HTTP FS do DuckDB
    |
Executar SQL com LIMIT/OFFSET
    |
DuckDB faz Range Request HTTP (le apenas dados necessarios)
    |
Sanitizar resultados (BigInt -> Number)
    |
Exibir na tabela com paginacao
```

## Design System

### Cores (Custom Green)

- **50-100**: Fundos claros
- **400**: Cor principal (#00dc82)
- **500-600**: Acoes e hover states
- **900-950**: Textos e elementos escuros

### Componentes Nuxt UI Utilizados

- `UContainer` - Layout responsivo
- `UCard` - Cards com header/body/footer
- `UButton` - Botoes com variants e loading state
- `UPagination` - Paginacao com navegacao e sibling count responsivo
- `USelectMenu` - Seletor de dataset com agrupamento
- `USkeleton` - Skeleton loading
- `UHeader`, `UMain`, `UFooter` - Layout structure
- `UColorModeButton` - Toggle tema claro/escuro
- `USeparator` - Separadores visuais

## Scripts Disponiveis

```bash
# Desenvolvimento
pnpm dev                    # Servidor de desenvolvimento (http://localhost:3000)
pnpm build                  # Build para producao
pnpm preview                # Preview do build de producao

# Qualidade de Codigo
pnpm lint                   # Verificar codigo com ESLint
pnpm typecheck              # Verificar tipos TypeScript
pnpm format                 # Format codigo com dprint

# Testes
pnpm test                   # Todos os testes
pnpm test:unit              # Testes unitarios
pnpm test:nuxt              # Testes de componentes
pnpm test:e2e               # Testes E2E com Playwright
pnpm test:e2e:ui            # Testes E2E com interface visual
pnpm test:coverage          # Cobertura de codigo
pnpm test:watch             # Testes em modo watch

# DuckDB
pnpm duckdb:ui              # Interface DuckDB local
```

## Observabilidade e Metricas

O projeto utiliza o modulo [**nuxt-monitoring**](https://github.com/NZ-WEB/nuxt-monitoring) para expor metricas de servidor no formato **Prometheus** (OpenMetrics), prontas para scraping por ferramentas como Prometheus + Grafana, Datadog, ou qualquer sistema compativel.

### Endpoint `/metrics`

Acessivel em `http://localhost:3000/metrics` durante o desenvolvimento. Retorna metricas em texto puro no formato Prometheus exposition format.

#### Categorias de Metricas Expostas

**CPU e Processo**

| Metrica                            | Tipo    | Descricao                                |
| ---------------------------------- | ------- | ---------------------------------------- |
| `process_cpu_user_seconds_total`   | counter | Tempo total de CPU em modo usuario       |
| `process_cpu_system_seconds_total` | counter | Tempo total de CPU em modo sistema       |
| `process_cpu_seconds_total`        | counter | Tempo total de CPU (usuario + sistema)   |
| `process_start_time_seconds`       | gauge   | Timestamp de inicio do processo          |
| `process_resident_memory_bytes`    | gauge   | Memoria residente (RAM fisica utilizada) |
| `process_virtual_memory_bytes`     | gauge   | Memoria virtual total alocada            |
| `process_heap_bytes`               | gauge   | Tamanho total do heap do processo        |
| `process_open_fds`                 | gauge   | Descritores de arquivo abertos           |
| `process_max_fds`                  | gauge   | Limite maximo de descritores de arquivo  |

**Event Loop do Node.js**

| Metrica                               | Tipo  | Descricao                         |
| ------------------------------------- | ----- | --------------------------------- |
| `nodejs_eventloop_lag_seconds`        | gauge | Lag atual do event loop           |
| `nodejs_eventloop_lag_min_seconds`    | gauge | Minimo de delay registrado        |
| `nodejs_eventloop_lag_max_seconds`    | gauge | Maximo de delay registrado        |
| `nodejs_eventloop_lag_mean_seconds`   | gauge | Media dos delays registrados      |
| `nodejs_eventloop_lag_stddev_seconds` | gauge | Desvio padrao dos delays          |
| `nodejs_eventloop_lag_p50_seconds`    | gauge | Percentil 50 (mediana) dos delays |
| `nodejs_eventloop_lag_p90_seconds`    | gauge | Percentil 90 dos delays           |
| `nodejs_eventloop_lag_p99_seconds`    | gauge | Percentil 99 dos delays           |

**Handles e Recursos Ativos (libuv)**

| Metrica                         | Tipo  | Descricao                                              |
| ------------------------------- | ----- | ------------------------------------------------------ |
| `nodejs_active_resources{type}` | gauge | Recursos ativos por tipo (MessagePort, PipeWrap, etc.) |
| `nodejs_active_resources_total` | gauge | Total de recursos ativos                               |
| `nodejs_active_handles{type}`   | gauge | Handles libuv ativos por tipo (Server, Socket, etc.)   |
| `nodejs_active_handles_total`   | gauge | Total de handles ativos                                |
| `nodejs_active_requests_total`  | gauge | Total de requisicoes libuv ativas                      |

**Heap Memory (Node.js)**

| Metrica                                         | Tipo  | Descricao                                                                      |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------ |
| `nodejs_heap_size_total_bytes`                  | gauge | Tamanho total do heap V8                                                       |
| `nodejs_heap_size_used_bytes`                   | gauge | Heap V8 utilizado                                                              |
| `nodejs_external_memory_bytes`                  | gauge | Memoria externa ao heap V8                                                     |
| `nodejs_heap_space_size_total_bytes{space}`     | gauge | Tamanho total por espaco de heap (new, old, code, large_object, trusted, etc.) |
| `nodejs_heap_space_size_used_bytes{space}`      | gauge | Bytes usados por espaco de heap                                                |
| `nodejs_heap_space_size_available_bytes{space}` | gauge | Bytes disponiveis por espaco de heap                                           |

**Garbage Collection**

| Metrica                            | Tipo      | Descricao                                                         |
| ---------------------------------- | --------- | ----------------------------------------------------------------- |
| `nodejs_gc_duration_seconds{kind}` | histogram | Duracao do GC por tipo: `major`, `minor`, `incremental`, `weakcb` |

**Informacoes do Runtime**

| Metrica                                          | Tipo  | Descricao                     |
| ------------------------------------------------ | ----- | ----------------------------- |
| `nodejs_version_info{version,major,minor,patch}` | gauge | Versao do Node.js em execucao |

**Metricas HTTP (requisicoes ao servidor Nitro)**

| Metrica                                                   | Tipo    | Descricao                                   |
| --------------------------------------------------------- | ------- | ------------------------------------------- |
| `http_request_total{method,route,status_code}`            | counter | Total de requisicoes HTTP por rota e status |
| `http_request_duration_seconds{method,route,status_code}` | gauge   | Duracao das requisicoes HTTP em segundos    |
| `http_active_requests`                                    | gauge   | Requisicoes HTTP em andamento no momento    |

### Exemplo de uso com curl

```bash
curl http://localhost:3000/metrics
```

### Integracao com Prometheus

Para coletar as metricas com Prometheus, adicione ao `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "nuxt-duckdb-wasm"
    static_configs:
      - targets: ["localhost:3000"]
    metrics_path: "/metrics"
    scrape_interval: 15s
```

### Referencias

- [nuxt-monitoring no GitHub](https://github.com/NZ-WEB/nuxt-monitoring)
- [nuxt-monitoring no npm](https://www.npmjs.com/package/nuxt-monitoring)
- [Prometheus Exposition Format](https://prometheus.io/docs/instrumenting/exposition_formats/)

## CI/CD Pipeline (`.github/workflows/ci.yml`)

**Trigger:** Push em qualquer branch

**Steps:**

1. Checkout do codigo
2. Instalacao do pnpm
3. Instalacao do Node
4. Install dependencies (com cache)
5. Run lint
6. Run typecheck

## Deploy

O deploy e feito no **Cloudflare Pages**. O arquivo WASM do DuckDB ultrapassa o limite de 25MB por arquivo do Cloudflare, por isso e carregado via **jsdelivr CDN**.

Cross-Origin Isolation (COOP/COEP) e necessario e configurado tanto no server middleware quanto no `public/_headers` para garantir que SharedArrayBuffer funcione corretamente.

## Arquitetura

- **Zero-backend**: DuckDB roda no navegador via WebAssembly
- **SPA mode**: SSR desabilitado, toda logica e client-side
- **Range Requests**: DuckDB le apenas os dados necessarios dos arquivos Parquet via HTTP
- **CDN strategy**: DuckDB WASM carregado via jsdelivr (contorna limite de 25MB do Cloudflare)
- **COI compliance**: Cross-Origin Isolation para multi-threading via SharedArrayBuffer
- **Blob URL workers**: Workers de CDN externo convertidos em blob URL para compatibilidade com COI

## Dataset de Exemplo

**Arquivo local:** `public/yellow_tripdata_2024-01.parquet`

- Fonte: NYC Taxi & Limousine Commission
- Conteudo: Viagens de taxi amarelo em janeiro de 2024
- Tamanho: ~3 milhoes de registros

Alem do dataset local, a aplicacao suporta **10 datasets remotos** de diversas fontes (DuckDB blobs, Hugging Face, GitHub, duckdb.org).

## Recursos

- [Nuxt Documentation](https://nuxt.com)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [DuckDB WASM Documentation](https://duckdb.org/docs/api/wasm/overview)
- [Parquet File Format](https://parquet.apache.org/)
