# Memória do Projeto: nuxt-duckdb-wasm

## 👤 Preferências de Usuário (Gemini)

**SEMPRE usar `gemini-2.5-pro`** quando interagir com Gemini CLI

- Este é o melhor modelo disponível para respostas práticas e diretas
- Abordagem: interagir com o Gemini como um "melhor amigo" para **pensar juntos** sobre respostas
- Fazer perguntas de seguimento para refinar análises
- Combinar insights do Gemini com análise do contexto do projeto

⚠️ Modelos que NÃO funcionam (retornam 404):

- gemini-3.1-pro
- gemini-3-flash
- gemini-3.5-pro
- gemini-3.5-sonnet

---

## Ferramentas disponíveis

- **pnpm dev** → servidor em http://localhost:3000 (geralmente já rodando)
- **DuckDB CLI** → `duckdb` instalado; usar para inspecionar/gerar parquets
- **wrangler** → CLI Cloudflare instalado e logado; sempre usar `--remote` (sem flag = emulador local); gerencia R2, Workers, D1, KV
- **MCP chrome-devtools** → acesso ao Chrome: console, screenshots, network, evaluate_script
- **MCP playwright** → automação de browser; CLI `pnpm playwright` também disponível

## Cloudflare R2

- Bucket: `teste-nuxt-duckdb-wasm`
- Base pública: `https://pub-1407a0cd06da4125aec80dc262085591.r2.dev`
- Upload: `wrangler r2 object put BUCKET/arquivo.parquet --file=local.parquet --remote`

## Arquitetura DuckDB-WASM

- Init em `app/utils/duckdb.init.ts` (lazy, chamado pelo primeiro composable)
- Composable central: `app/composables/useDuckDb.ts`
- Constantes e URLs: `app/utils/duckdb.constantes.ts`
- Queries por dataset: `app/utils/*.consultas.ts`
- Composables por dataset: `app/composables/use*.ts`

## Padrão de acesso R2

- `registerFileURL` e warmup foram REMOVIDOS (commit `feat(warmup): removido`)
- `nomeUrlParquetsR2` importado em `duckdb.init.ts` mas não usado (dead code, não remover sem pedir)
- Composables usam a URL completa do R2: `const url = estacoesTremUrl` (ex: `https://pub-.../stations.parquet`)
- Queries por dataset em `app/consultas/*.consultas.ts`; composables em `app/composables/use*.ts`

## Parquets no R2 (11 total)

- stations: 4.8KB | shakespeare: ~1MB | tariffs: 196KB | train_services: ~1.8MB
- yellow_2024-01: 2MB | ontime: 14MB | taxi_2019_04: 47MB | yellow_2010-01: 110MB
- electricity_finland_2021: 57KB (7,9k rows; cols: time, price; ZSTD) → `eletricidadeFinlandiaUrl`
- diffusiondb_meta: 14MB (2M rows; cols usadas: user_name,image_nsfw,step,sampler,timestamp,width,height; ZSTD) → `diffusionDBUrl`
- prices_sample: 526B (9 rows; cols: ticker,when,price) → `precosAcoesUrl`

## Convenções

- Variáveis em português brasileiro (camelCase)
- Comentários em português
- Auto-imports Nuxt: `ref`, `computed`, `shallowRef`, `onMounted` etc. (sem import explícito)
- Constantes de utils também são auto-importadas entre arquivos do projeto

## Estilo em componentes Vue

- **SEMPRE** usar `<style scoped>` + `@apply` para definir classes de tags HTML/componentes
- Nunca escrever classes Tailwind inline no atributo `class=` do template
- Nome da classe deve ser semântico e **específico ao contexto** (ex: `.cabecalho-dataset-dados`, `.painel-principal`, `.titulo-dashboard`)
- **NUNCA usar tokens genéricos** como `formulario`, `container`, `wrapper`, `box`, `inner`, `outer` — sempre nomear pelo domínio/contexto real (ex: `explorador`, `dataset`, `kpi`, `sidebar`)
- `:class` dinâmico (binding Vue) pode permanecer no template quando necessário
- Classes simples de utilitário único (`w-full`, `block-5`) podem ser mantidas inline quando não têm semântica própria
