# 📊 Portal da Transparência - Nuxt + DuckDB WASM

Aplicação Nuxt 4 que utiliza **DuckDB WASM** para realizar consultas SQL diretamente no navegador, permitindo análise de dados Parquet sem necessidade de backend.

## 🎯 Visão Geral

Este projeto demonstra como construir um portal da transparência moderno e performático, executando consultas SQL e análise de dados diretamente no lado do cliente usando WebAssembly.

## 🛠 Stack Tecnológico

### Core Framework
- **Nuxt 4.3.1** - Framework Vue com SSR/SSG
- **Vue 3** - Interface reativa
- **TypeScript 5.9.3** - Tipagem estática

### UI & Styling
- **Nuxt UI 4.4.0** - Biblioteca de componentes (baseada em Tailwind CSS)
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **@nuxt/image 2.0.0** - Otimização de imagens
- **@nuxt/hints 1.0.0-alpha.6** - Dicas de desenvolvimento

### Banco de Dados
- **@duckdb/duckdb-wasm 1.32.0** - DuckDB rodando via WebAssembly
- **Suporte a Parquet** - Formato colunar eficiente para análise

### Ferramentas de Desenvolvimento
- **ESLint 9.39.2** - Linting de código
- **dprint 0.51.1** - Formatter rápido
- **pnpm 10.29.1** - Gerenciador de pacotes

### Testes
- **Vitest 4.0.18** - Testes unitários e de componentes
- **Playwright 1.58.2** - Testes E2E
- **@vue/test-utils 2.4.6** - Utilitários para testes Vue

### Node Environment
- **Node 22.22.0+** - Runtime JavaScript
- **NPM 10.9.0+** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
portal-transparencia-nuxt/
├── app/
│   ├── app.vue                    # Layout principal com Header/Footer
│   ├── app.config.ts              # Configurações da aplicação (UI colors, etc)
│   ├── assets/css/main.css        # Tema customizado (cores green, font Public Sans)
│   ├── components/
│   │   ├── AppLogo.vue            # Logo SVG do projeto
│   │   └── TemplateMenu.vue       # Componente de menu
│   ├── composables/
│   │   └── useDuckDb.ts           # Hook principal do DuckDB WASM
│   └── pages/
│       ├── index.vue              # Página principal com tabela de dados
│       └── index.bkp.vue          # Backup da página original (template starter)
│
├── public/
│   ├── favicon.ico                # Ícone do site
│   └── yellow_tripdata_2024-01.parquet  # Dataset de viagens de táxi NYC
│
├── shared/
│   └── utils/
│       └── formatar.ts            # Utilitário de formatação (números pt-BR)
│
├── test/
│   ├── unit/
│   │   └── example.test.ts        # Teste unitário de exemplo
│   └── nuxt/
│       └── component.test.ts      # Teste de componente Nuxt
│
├── tests/
│   └── example.spec.ts            # Teste E2E de exemplo
│
├── .github/workflows/
│   └── ci.yml                     # Pipeline CI/CD (GitHub Actions)
│
├── nuxt.config.ts                 # Configuração do Nuxt
├── vitest.config.ts               # Configuração do Vitest
├── playwright.config.ts           # Configuração do Playwright
├── eslint.config.mjs              # Configuração do ESLint
├── dprint.json                    # Configuração do dprint formatter
├── tsconfig.json                  # Configuração do TypeScript
└── package.json                   # Dependências e scripts
```

## 🔧 Funcionalidades Principais

### 1. Interface de Dados (`app/pages/index.vue`)
- Tabela interativa com paginação
- Dois modos de consulta:
  - **Dados simples**: Consulta SQL gerada (range de 10.000 registros)
  - **Dados Parquet**: Dataset real de viagens de táxi NYC (3M+ registros)
- Paginação com 50 itens por página
- Contador total de registros
- Estados de carregamento (loading)

### 2. DuckDB WASM Integration (`app/composables/useDuckDb.ts`)

**Inicialização:**
- Carrega DuckDB via CDN JSdelivr
- Instância AsyncDuckDB com Worker
- Configura logger e conexão

**Funções disponíveis:**
- `execute(sql)` - Executa consultas SQL
- `queryRemoteParquet(url, sql)` - Consulta arquivos Parquet remotos via HTTP
- `obterDadosSimples(pagina, tamanhoPagina)` - Dados gerados
- `obterDadosParquet(pagina, tamanhoPagina)` - Dataset real

**Features:**
- Range Requests HTTP para ler apenas dados necessários do Parquet
- Sanitização de BigInt para JavaScript Number
- Gerenciamento de estados (inicializando, carregando)

### 3. Layout (`app/app.vue`)
- Header com logo e toggle de tema claro/escuro
- Main content area com `<NuxtPage />`
- Footer com copyright e links
- SEO otimizado (meta tags, Open Graph, Twitter Cards)

### 4. Configurações

**Nuxt Config (`nuxt.config.ts`):**
- Módulos: ESLint, UI, Hints, Image, Scripts, Test Utils
- WASM habilitado no Nitro
- Otimização de dependências (exclui DuckDB)
- Worker format configurado para ES
- Regras de rota: `/` com prerender

**Estilos (`main.css`):**
- Fonte Public Sans
- Paleta de cores green customizada (50-950)
- Integração com @nuxt/ui e Tailwind CSS

**Testes (`vitest.config.ts`):**
- Dois projetos: `unit` (Node) e `nuxt` (ambiente Nuxt + Playwright)
- Cobertura de código habilitada
- Instância de Chromium para testes de navegador

## 📊 Fluxo de Dados

```
Usuário clica no botão
    ↓
useDuckDb.obterDadosParquet()
    ↓
Init DuckDB (se não inicializado)
    ↓
Registrar URL do arquivo Parquet no DuckDB
    ↓
Executar SQL com LIMIT/OFFSET
    ↓
DuckDB faz Range Request HTTP
    ↓
Processar e sanitizar resultados
    ↓
Retornar registros + total
    ↓
Exibir na tabela com paginação
```

## 🎨 Design System

### Cores (Custom Green)
- **50-100**: Fundos claros
- **400**: Cor principal (#00dc82)
- **500-600**: Ações e hover states
- **900-950**: Textos e elementos escuros

### Componentes Nuxt UI Utilizados
- `UContainer` - Layout responsivo
- `UCard` - Cards com header/body/footer
- `UButton` - Botões com variants
- `UPagination` - Paginação com navegação
- `UHeader`, `UMain`, `UFooter` - Layout structure
- `UColorModeButton` - Toggle tema claro/escuro
- `USeparator` - Separadores visuais

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Servidor de desenvolvimento (http://localhost:3000)
pnpm build                  # Build para produção
pnpm preview                # Preview do build de produção

# Qualidade de Código
pnpm lint                   # Verificar código com ESLint
pnpm typecheck              # Verificar tipos TypeScript
pnpm format                 # Format código com dprint

# Testes
pnpm test                   # Todos os testes
pnpm test:unit              # Testes unitários
pnpm test:nuxt              # Testes de componentes
pnpm test:e2e               # Testes E2E com Playwright
pnpm test:e2e:ui            # Testes E2E com interface visual
pnpm test:coverage          # Cobertura de código
pnpm test:watch             # Testes em modo watch

# DuckDB
pnpm duckdb:ui              # Interface DuckDB local
```

## 🔐 CI/CD Pipeline (`.github/workflows/ci.yml`)

**Trigger:** Push em qualquer branch

**Steps:**
1. Checkout do código
2. Instalação do pnpm
3. Instalação do Node 22
4. Install dependencies (com cache)
5. Run lint
6. Run typecheck

## 💡 Destacado

### Arquitetura Client-Side
- Sem necessidade de backend
- DuckDB roda no navegador via WebAssembly
- Análise de dados Parquet com Range Requests
- Performance otimizada

### Internacionalização
- Configuração pt-BR para formatação de números
- Meta tags com idioma ptBR

### Desenvolvimento
- Auto-imports do Nuxt
- Hot Module Replacement
- TypeScript full-stack
- Linting e formatting consistentes

## 📈 Dataset de Exemplo

**Arquivo:** `public/yellow_tripdata_2024-01.parquet`
- Fonte: NYC Taxi & Limousine Commission
- Conteúdo: Viagens de táxi amarelo em janeiro de 2024
- Tamanho: ~3 milhões de registros
- Colunas típicas: `passenger_count`, `trip_distance`, `tip_amount`, etc.

### Outros Datasets Disponíveis

Serviços de Trem (Holanda):
https://blobs.duckdb.org/train_services.parquet

Dados de Táxi (NYC):
https://blobs.duckdb.org/data/taxi_2019_04.parquet
https://blobs.duckdb.org/data/yellow_tripdata_2010-01.parquet

Corpus de Shakespeare:
https://blobs.duckdb.org/data/shakespeare.parquet

Dados de Voos (On-time):
https://blobs.duckdb.org/data/ontime.parquet

Tarifas Ferroviárias:
https://blobs.duckdb.org/tariffs.parquet

Estações de Trem:
https://blobs.duckdb.org/stations.parquet

## 🎯 Próximos Passos Potenciais

- Adicionar filtros e ordenação na tabela
- Implementar mais colunas do dataset Parquet
- Adicionar gráficos de visualização
- Suporte a múltiplos datasets
- Exportação de resultados (CSV, Excel)
- Autenticação e controle de acesso
- Deploy automático (Vercel, Netlify)

## 🚀 Deploy

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=starter&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fstarter&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fstarter-dark.png&demo-url=https%3A%2F%2Fstarter-template.nuxt.dev%2F&demo-title=Nuxt%20Starter%20Template&demo-description=A%20minimal%20template%20to%20get%20started%20with%20Nuxt%20UI.)

Veja a [documentação de deployment do Nuxt](https://nuxt.com/docs/getting-started/deployment) para mais opções.

## 📚 Recursos

- [Nuxt Documentation](https://nuxt.com)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [DuckDB WASM Documentation](https://duckdb.org/docs/api/wasm/overview)
- [Parquet File Format](https://parquet.apache.org/)
