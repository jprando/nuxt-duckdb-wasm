# Estrutura da Codebase

```
nuxt-duckdb-wasm/
├── app/                          # Código da aplicação (diretório app do Nuxt)
│   ├── app.vue                   # Layout raiz: cabeçalho, rodapé, info do DuckDB
│   ├── assets/css/main.css       # CSS global (Tailwind)
│   ├── components/
│   │   ├── AppLogo.vue           # Componente de logo SVG
│   │   ├── TabelaSkeleton.vue    # Skeleton de carregamento da tabela de dados
│   │   └── TemplateMenu.vue      # Menu de navegação/template
│   ├── composables/
│   │   └── useDuckDb.ts          # Composable principal: init DuckDB, execute, helpers de consulta
│   ├── pages/
│   │   └── index.vue             # Página principal: seletor de datasets, tabela paginada, nav por teclado
│   └── utils/
│       ├── duckdb.constantes.ts  # Constantes, interface DatasetParquet, lista de datasets
│       ├── duckdb.init.ts        # Lógica de inicialização do DuckDB WASM (seleção de bundle, setup do worker)
│       ├── duckdb.sanitizeRow.ts # Sanitização BigInt → Number nos resultados das consultas
│       └── duckdb.selects.ts     # Construtores de consultas SQL (dados simples, dados parquet)
├── shared/                       # Utilitários compartilhados (app + server)
│   └── utils/
│       ├── formatar.ts           # Formatação de números (locale brasileiro, moeda)
│       └── log.ts                # Utilitário de log para dev (infoDev)
├── server/
│   └── middleware/
│       └── cross-origin-isolation.ts  # Cabeçalhos COOP/COEP para SharedArrayBuffer
├── public/
│   ├── yellow_tripdata_2024-01.parquet  # Arquivo Parquet local de exemplo (NYC Taxi)
│   └── _headers                  # Configuração de headers estáticos
├── test/
│   ├── unit/example.test.ts      # Testes unitários (Vitest, ambiente node)
│   └── nuxt/component.test.ts    # Testes de componente (Vitest, ambiente nuxt + browser)
├── tests/
│   └── example.spec.ts           # Testes E2E (Playwright)
├── nuxt.config.ts                # Configuração do Nuxt
├── vitest.config.ts              # Configuração multi-projeto do Vitest (unit + nuxt)
├── playwright.config.ts          # Configuração do Playwright para E2E
├── dprint.json                   # Configuração do formatador dprint
├── eslint.config.mjs             # Configuração do ESLint (via @nuxt/eslint)
├── AGENTS.md                     # Diretrizes para agentes de IA (convenções, comandos)
└── .github/workflows/ci.yml     # CI: lint + typecheck
```

## Arquivos-Chave para Tarefas Comuns

| Tarefa | Arquivos |
|--------|----------|
| Adicionar novo dataset | `app/utils/duckdb.constantes.ts` (adicionar ao array `datasetsParquet`) |
| Modificar consultas SQL | `app/utils/duckdb.selects.ts` |
| Alterar inicialização do DuckDB | `app/utils/duckdb.init.ts` |
| Editar composable principal | `app/composables/useDuckDb.ts` |
| Modificar UI/layout | `app/app.vue`, `app/pages/index.vue` |
| Adicionar componente | `app/components/` (NomePascalCase.vue) |
| Adicionar utilitário compartilhado | `shared/utils/` |
| Adicionar middleware do servidor | `server/middleware/` |
