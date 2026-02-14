# Estilo de Código e Convenções

## Idioma
- **Comentários e nomes de variáveis**: português (brasileiro) preferencial
  - ex: `estahCarregando`, `obterDadosParquet`, `quantidadeTotalRegistros`
- **Nomes de componentes**: PascalCase em inglês ou português
- **Textos/labels na UI**: português

## Formatação (dprint, NÃO Prettier)
- 2 espaços de indentação (sem tabs)
- Finais de linha LF
- Sem trailing commas (`commaDangle: "never"`)
- Estilo de chaves 1TBS
- Máximo 1 atributo por linha em templates Vue
- Linha final em branco obrigatória

## TypeScript
- Tipagem estrita, evitar `any` (preferir `unknown` ou tipos específicos)
- `lang="ts"` em todas as tags `<script>` do Vue
- Usar Composition API com `<script setup lang="ts">`
- Auto-imports: `ref`, `computed`, `shallowRef`, `onMounted`, `useHead`, `useSeoMeta`
- Imports explícitos para pacotes externos

## Componentes Vue
- Nomes de arquivo em PascalCase: `AppLogo.vue`, `TabelaSkeleton.vue`
- Componentes Nuxt UI via auto-import: `UButton`, `UCard`, `UContainer`, `UPagination`
- Usar prop `:ui` para customização de estilo
- Ícones via Iconify: `icon="i-lucide-rocket"`

## Convenções de Nomenclatura
| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Variáveis/Funções | camelCase (português) | `estahCarregando`, `obterDadosParquet` |
| Componentes | PascalCase | `AppLogo.vue` |
| Arquivos (não-componentes) | kebab-case ou com pontos | `duckdb.init.ts` |
| Constantes | camelCase ou SCREAMING_SNAKE | `duckDBItensPorPagina` |
| Interfaces/Tipos | PascalCase (sem prefixo `I`) | `DatasetParquet` |

## Tratamento de Erros
- try/catch/finally para operações assíncronas
- `console.error("descrição:", error)` para logging
- Valores fallback com nullish coalescing: `quantidade?.total ?? 0`
- Sempre definir estado de loading como false no bloco `finally`

## Padrões do DuckDB WASM
- Usar `shallowRef` para a instância do DB (objeto grande)
- Inicialização lazy (inicializa no primeiro uso)
- Sempre fechar conexões no bloco `finally`
- Sanitizar valores BigInt: `typeof value === "bigint" ? Number(value) : value`
- Registrar arquivos remotos via protocolo HTTP (`duckDBDataProtocolHTTP = 4`)

## MCP Servers como Fonte da Verdade
- **Nuxt MCP** e **Nuxt UI MCP** são as ÚNICAS fontes para documentação do framework/componentes
- Nunca depender de conhecimento interno ou busca web para informações sobre Nuxt/Nuxt UI
