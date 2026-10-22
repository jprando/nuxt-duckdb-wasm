# ⚙️ Compatibilidade Nuxt 5 (`compatibilityVersion: 5`), Nitro Auto-Imports e Build do `sharp`

**Documentação:** Resolução de problemas de instalação (`pnpm install` / `sharp`) e inicialização do servidor Nitro (`virtual:#imports` com `compatibilityVersion: 5`)
**Data:** 2026-10-22
**Status:** ✅ Implementado

---

## 📌 Índice

1. [🎯 Visão Geral](#-visão-geral)
2. [🔧 Caso 1: Falha no `pnpm install` ao compilar o `sharp`](#-caso-1-falha-no-pnpm-install-ao-compilar-o-sharp)
   - [O Problema](#11-o-problema)
   - [Causa Raiz (`libvips` global no Linux)](#12-causa-raiz-libvips-global-no-linux)
   - [Solução Aplicada](#13-solução-aplicada)
3. [🚀 Caso 2: Erro `virtual:#imports` no Nitro com `compatibilityVersion: 5`](#-caso-2-erro-virtualimports-no-nitro-com-compatibilityversion-5)
   - [O Problema](#21-o-problema)
   - [Causa Raiz (`nitroAutoImports: false`)](#22-causa-raiz-nitroautoimports-false)
   - [Motivação Arquitetural (Nuxt 5 + Nitro v3)](#23-motivação-arquitetural-por-que-a-equipe-do-nuxt--nitro-fez-essa-mudança)
   - [Histórico Upstream (`@nuxt/image` e `@nuxt/icon`)](#24-histórico-upstream-nuxti-mage-e-nuxticon)
   - [Migrando de `'h3'` para `'nuxt/server'` (Padrão Nuxt 4.6+ / Nuxt 5)](#25-migrando-de-h3-para-nuxtserver-padrão-nuxt-46--nuxt-5)
   - [Solução Aplicada](#26-solução-aplicada)
   - [Ponto de Atenção: `nuxt-monitoring` e `import.meta.dev`](#27-ponto-de-atenção-nuxt-monitoring-e-importmetadev-no-nuxtconfigts)
   - [Checklist Oficial de Compatibilidade Nuxt 5](#28-checklist-oficial-de-compatibilidade-nuxt-5-upgrade-guide)
4. [🛠️ Resumo dos Arquivos Alterados](#️-resumo-dos-arquivos-alterados)
5. [📚 Referências](#-referências)

---

## 🎯 Visão Geral

Este documento registra dois problemas encontrados ao configurar e executar o ambiente de desenvolvimento do projeto **nuxt-duckdb-wasm**, suas causas técnicas profundas e as decisões adotadas para resolvê-los de forma definitiva:

1. **Falha no `pnpm install`** causada pela tentativa do pacote `sharp` de compilar código nativo via `node-gyp` em sistemas Linux que possuem a biblioteca `libvips` instalada globalmente.
2. **Falha no `pnpm run dev` (`RollupError` no Nitro)** causada pela mudança de comportamento do `future.compatibilityVersion: 5` no Nuxt `4.6+`, que desativa os presets de auto-importação do servidor Nitro (`experimental.nitroAutoImports: false`), quebrando módulos e middlewares que dependiam do barril virtual `#imports`.

---

## 🔧 Caso 1: Falha no `pnpm install` ao compilar o `sharp`

### 1.1 O Problema

Ao executar `pnpm install`, a instalação falhava na etapa de pós-instalação do pacote `sharp@0.34.5`:

```text
node_modules/.pnpm/sharp@0.34.5/node_modules/sharp: Running install script, failed in 266ms
.../sharp@0.34.5/node_modules/sharp install$ node install/check.js || npm run build
│ > sharp@0.34.5 build
│ > node install/build.js
│ sharp: Attempting to build from source via node-gyp
│ sharp: See https://sharp.pixelplumbing.com/install#building-from-source
│ sharp: Found node-addon-api
│ sharp: Please add node-gyp to your dependencies
└─ Failed in 267ms at .../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp
 ELIFECYCLE  Command failed with exit code 1.
```

_(Nota adicional: os avisos `WARN Failed to create bin ... arrow2csv.cjs` exibidos pelo `pnpm` devem-se a um detalhe de empacotamento conhecido do `apache-arrow@17.0.0` e são inofensivos para o `@duckdb/duckdb-wasm`)._

### 1.2 Causa Raiz (`libvips` global no Linux)

```text
pnpm install
     ↓
sharp está em onlyBuiltDependencies (pnpm-workspace.yaml)
     ↓
pnpm executa o script de install do sharp: `node install/check.js || npm run build`
     ↓
install/check.js chama `useGlobalLibvips()` (lib/libvips.js)
     ↓
Executa `pkg-config --modversion vips-cpp` no sistema operacional
     ↓
Detecta libvips global instalada no Linux (ex.: 8.18.7 no Arch/CachyOS)
     ↓
check.js retorna `process.exit(1)` para forçar compilação local contra a libvips do sistema
     ↓
Dispara `npm run build` → tenta usar `node-gyp` → ❌ Falha pois node-gyp não está instalado
```

A partir do **`sharp >= 0.33`**, os binários pré-compilados já são baixados automaticamente pelo gerenciador de pacotes através de `optionalDependencies` (`@img/sharp-linux-x64` e `@img/sharp-libvips-linux-x64`). Portanto, o script `install` do `sharp` só serve para cenários onde se deseja compilar o módulo nativo a partir do código-fonte.

### 1.3 Solução Aplicada

Movemos o `sharp` da lista `onlyBuiltDependencies` para `ignoredBuiltDependencies` no arquivo `pnpm-workspace.yaml`:

```yaml
ignoredBuiltDependencies:
  - "@parcel/watcher"
  - "@tailwindcss/oxide"
  - esbuild
  - sharp
  - unrs-resolver
  - vue-demi

onlyBuiltDependencies:
  - dprint
  - nuxt-bun-compile
```

Com isso, o `pnpm` baixa e vincula os binários pré-compilados em `@img/sharp-linux-x64` sem disparar o script de compilação com `node-gyp`.

> 💡 **Alternativa via variável de ambiente:** Caso algum ambiente precise executar o script do `sharp` ignorando a biblioteca global do sistema operacional, pode-se usar `SHARP_IGNORE_GLOBAL_LIBVIPS=1 pnpm install`.

---

## 🚀 Caso 2: Erro `virtual:#imports` no Nitro com `compatibilityVersion: 5`

### 2.1 O Problema

Ao iniciar o servidor de desenvolvimento com `pnpm run dev`, o bundler do Nitro falhava com `RollupError`:

```text
[nitro] ERROR RollupError: .../node_modules/@nuxt/image/dist/runtime/server/utils/image.js (3:9):
"useRuntimeConfig" is not exported by "virtual:#imports", imported by ".../@nuxt/image/dist/runtime/server/utils/image.js".

1: import { createImage } from "../../image.js";
2: import { imageOptions } from "#internal/nuxt-image";
3: import { useRuntimeConfig } from "#imports";
            ^
```

Em seguida, erro semelhante ocorria no `@nuxt/icon@2.2.1`:

```text
[nitro] ERROR RollupError: .../node_modules/@nuxt/icon/dist/runtime/server/api.js (6:38):
"defineCachedEventHandler" is not exported by "virtual:#imports"

6: import { useAppConfig, getRequestURL, defineCachedEventHandler } from "#imports";
```

### 2.2 Causa Raiz (`nitroAutoImports: false`)

1. O projeto utiliza `future: { compatibilityVersion: 5 }` no `nuxt.config.ts`.
2. No `@nuxt/schema` (`4.6+`), a opção `experimental.nitroAutoImports` é resolvida dinamicamente com base na versão de compatibilidade:
   ```js
   nitroAutoImports: {
     $resolve: ;
     ;(async (val, get) => {
       return typeof val === 'boolean'
         ? val
         : await get('future.compatibilityVersion') < 5
     })
   }
   ```
3. Quando `compatibilityVersion >= 5`, `experimental.nitroAutoImports` assume **`false`** por padrão.
4. No `@nuxt/nitro-server`, quando `nitroAutoImports` é `false`, todos os presets padrão de auto-importação do Nitro e do H3 (`useRuntimeConfig`, `defineEventHandler`, `defineCachedEventHandler`, `setResponseHeaders`, etc.) são removidos do módulo virtual `virtual:#imports`:
   ```js
   if (!nuxt.options.experimental.nitroAutoImports && nitroConfig.imports) {
     const presetCount = nitroConfig.imports.presets?.length ?? 0
     nitroConfig.modules = [(nitro) => {
       if (nitro.options.imports) {
         nitro.options.imports.presets.splice(presetCount)
       }
     }, ...nitroConfig.modules || []]
   }
   ```
5. Consequentemente, qualquer módulo ou arquivo em `server/` que ainda faça `import { ... } from '#imports'` ou utilize funções do H3/Nitro sem import explícito falha durante o build do servidor.

### 2.3 Motivação Arquitetural: Por que a equipe do Nuxt + Nitro fez essa mudança?

A desativação dos auto-imports implícitos e do barril `#imports` no servidor faz parte da arquitetura do **Nuxt 5** e **Nitro v3**, trazendo quatro ganhos fundamentais:

| Pilar                                                                | Explicação e Ganho Técnico                                                                                                                                                                                                                                                                                                                               |
| :------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📦 **Fim do Barrel File (`virtual:#imports`) e Melhor Tree-Shaking** | Importar qualquer função de `#imports` no servidor carregava um arquivo virtual centralizado reexportando dezenas de utilitários do Nitro e H3. Com imports granulares (`h3`, `nitropack/runtime`, `nitro/runtime-config`), o bundler faz tree-shaking direto, reduzindo o tamanho do bundle de servidor e acelerando o _cold start_ em Serverless/Edge. |
| 🧭 **Separação Clara entre App (Vue) e Server (Nitro)**              | O uso do mesmo alias `#imports` tanto em `app/` quanto em `server/` gerava ambiguidade constante (tentativas de usar composables Vue no servidor ou utilitários H3 no cliente, além de diferenças de assinatura como `useRuntimeConfig(event)` no servidor vs `useRuntimeConfig()` no cliente).                                                          |
| ⚡ **Performance de Build e TypeScript**                             | Eliminar o scan de AST do `unimport` nos arquivos de servidor reduz o tempo de compilação e permite que o TypeScript resolva tipos diretamente via _package exports_ (`moduleResolution: "bundler"`), sem depender exclusivamente de arquivos `.d.ts` gerados.                                                                                           |
| 🌐 **Portabilidade e Padrões ESM**                                   | Código de servidor escrito com imports explícitos (`import { defineEventHandler } from 'h3'`) é 100% portável entre Nuxt, Nitro standalone e outros meta-frameworks baseados em H3/Nitro.                                                                                                                                                                |

### 2.4 Histórico Upstream (`@nuxt/image` e `@nuxt/icon`)

- **`@nuxt/image`**:
  - **Issue [#2205](https://github.com/nuxt/image/issues/2205)**: _"Missing `#imports` error with `compatibilityVersion: 5`"_ (originada de [nuxt/nuxt#34142](https://github.com/nuxt/nuxt/issues/34142#issuecomment-3791192527)).
  - **PR [#2347](https://github.com/nuxt/image/pull/2347)**: Substituiu `import { useRuntimeConfig } from '#imports'` por `import { useRuntimeConfig } from 'nitropack/runtime'` e `import { createError } from 'h3'` nos arquivos de servidor (`_ipx.legacy.ts` e `image.legacy.ts`).
  - **Release [v2.2.0](https://github.com/nuxt/image/pull/2346)**: Lançada com suporte completo ao `compatibilityVersion: 5`.
- **`@nuxt/icon`**:
  - Nas versões `<= 2.2.1`, o arquivo `dist/runtime/server/api.js` importava `{ useAppConfig, getRequestURL, defineCachedEventHandler } from "#imports"`.
  - Na versão **`v2.5.1`**, o handler de servidor foi refatorado para usar imports explícitos (`from 'h3'`, `'ufo'`, `'#nuxt-icon-server-runtime'`), eliminando o uso de `#imports`.

### 2.5 Migrando de `'h3'` para `'nuxt/server'` (Padrão Nuxt 4.6+ / Nuxt 5)

De acordo com o [Guia Oficial de Upgrade do Nuxt (`Moving to nuxt/server`)](https://nuxt.com/docs/4.x/getting-started/upgrade#moving-to-nuxtserver) e a documentação de [Server Imports](https://nuxt.com/docs/4.x/guide/going-further/server-imports), a partir do **Nuxt 4.6** o código dentro de `server/` deve importar `defineEventHandler` e utilitários a partir de **`nuxt/server`** em vez de importar diretamente do `h3`:

> _"From Nuxt 4.6, server code can import its handler and helpers from `nuxt/server` rather than from `h3`, so the same file runs on Nuxt 4 (`nitropack` v2 and `h3` v1) and on Nuxt 5 (Nitro v3 and `h3` v2)."_
>
> _"Code that imports from `h3` is tied to the server runtime and needs revisiting on Nuxt 5."_

Principais diferenças entre a API legada do `h3` v1 e a superfície padronizada `nuxt/server` (baseada nas Web APIs `Request` / `Response` / `Headers`):

| `h3` v1 (Acoplado ao Nuxt 4 / Nitro v2)                | `nuxt/server` (Compatível com Nuxt 4.6 e Nuxt 5 / Nitro v3) |
| :----------------------------------------------------- | :---------------------------------------------------------- |
| `setResponseHeader` / `setResponseHeaders(event, ...)` | `event.res.headers.set(key, value)`                         |
| `getResponseHeader(event, name)`                       | `event.res.headers.get(name)`                               |
| `event.path`                                           | `event.url.pathname` ou `getRequestURL(event).pathname`     |
| `getMethod(event)`                                     | `event.req.method`                                          |
| `createError({ statusCode, statusMessage })`           | `createError({ status, statusText })`                       |
| `useRuntimeConfig(event)`                              | `useRuntimeConfig()` (sem argumento por request)            |

### 2.6 Solução Aplicada

Em vez de manter a flag paliativa `experimental.nitroAutoImports: true` no `nuxt.config.ts`, alinhamos todo o projeto ao padrão oficial do Nuxt 5:

1. **Atualização do `@nuxt/image`** de `2.0.0` para `^2.2.0` (`2.2.0`) no `package.json`.
2. **Atualização da subdependência `@nuxt/icon`** de `2.2.1` para `2.5.1` no `pnpm-lock.yaml`.
3. **Migração para `nuxt/server` em `server/`**: Atualizado `server/middleware/cross-origin-isolation.ts` para importar `defineEventHandler` de `'nuxt/server'` e definir os headers usando a API padrão `event.res.headers.set()`:
   ```ts
   import { defineEventHandler } from 'nuxt/server'

   export default defineEventHandler((event) => {
     event.res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
     event.res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
   })
   ```

> ⚠️ **Regra para novos arquivos em `server/`:** Com `compatibilityVersion: 5` ativo, todo novo handler, rota ou middleware criado dentro da pasta `server/` **deve** importar explicitamente de `'nuxt/server'` (ou de `'nitropack/runtime'` / `'h3'` apenas para recursos específicos do Nitro como `useStorage` ou `defineCachedEventHandler`). Nunca utilizar `#imports` em `server/`.

### 2.7 Ponto de Atenção: `nuxt-monitoring` e `import.meta.dev` no `nuxt.config.ts`

Ao auditar todos os pacotes em `node_modules`, identificamos que o pacote de terceiros `nuxt-monitoring` (tanto na versão `1.2.0` quanto na `1.3.0`) ainda possui `import { useRuntimeConfig } from "#imports"` dentro de `dist/runtime/server/middleware/metrics.js`.

- **Por que ele não quebra o `pnpm run dev` atualmente?**
  No `nuxt.config.ts`, a configuração está definida como:
  ```ts
  monitoring: {
    metrics: {
      enabled: import.meta.dev,
      path: '/metrics'
    }
  }
  ```
  Como o `nuxt.config.ts` é avaliado pelo Node (`jiti`/`c12`) antes do bundler do Vite, `import.meta.dev` retorna `undefined` em tempo de leitura da configuração, mantendo `metrics.enabled` desativado (`false`).
- **Caso seja necessário ativar `metrics.enabled: true` no futuro:**
  Será preciso aguardar uma versão do `nuxt-monitoring` que migre de `#imports` para `nuxt/server` (ou aplicar `pnpm patch nuxt-monitoring` trocando `#imports` por `nitropack/runtime`).

### 2.8 Checklist Oficial de Compatibilidade Nuxt 5 (`Upgrade Guide`)

Verificação completa do projeto contra as mudanças ativadas por `future.compatibilityVersion: 5` documentadas na seção [Testing Nuxt 5](https://nuxt.com/docs/4.x/getting-started/upgrade#testing-nuxt-5):

| Mudança do `compatibilityVersion: 5`                                     | Situação no Projeto                                                                                                                             |
| :----------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nitro auto-imports off** (`nitroAutoImports: false`)                   | ✅ Resolvido com `@nuxt/image@^2.2.0`, `@nuxt/icon@2.5.1` e uso de `nuxt/server` em `server/`.                                                  |
| **Case-sensitive routing** (`/About` não bate com `about.vue`)           | ✅ Todos os links `to="/pocs-v1/..."` em `app/layouts/dashboard-pocv1.vue` respeitam o camelCase exato dos arquivos em `app/pages/pocs-v1/`.    |
| **TypeScript Configuration Splitting** (`references` no `tsconfig.json`) | ✅ O `tsconfig.json` já utiliza Project References (`tsconfig.app.json`, `tsconfig.server.json`, `tsconfig.shared.json`, `tsconfig.node.json`). |
| **PostCSS defaults off** (`autoprefixer` e `cssnano` desativados)        | ✅ O projeto utiliza `@tailwindcss/vite` (Tailwind CSS v4), sem dependência de PostCSS.                                                         |
| **Vue Options API disabled**                                             | ✅ Todos os componentes utilizam Composition API (`<script setup lang="ts">`).                                                                  |
| **Server-only head composables & Unhead v2**                             | ✅ Nenhum uso de `useServerHead` ou propriedades legadas (`hid`, `vmid`).                                                                       |

---

## 🛠️ Resumo dos Arquivos Alterados

| Arquivo                                       | Alteração Realizada                                                                             |
| :-------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `pnpm-workspace.yaml`                         | Movido `sharp` de `onlyBuiltDependencies` para `ignoredBuiltDependencies`.                      |
| `package.json`                                | Atualizado `@nuxt/image` de `"2.0.0"` para `"^2.2.0"`.                                          |
| `pnpm-lock.yaml`                              | Atualizados `@nuxt/image@2.2.0` e `@nuxt/icon@2.5.1`.                                           |
| `server/middleware/cross-origin-isolation.ts` | Migrado para `import { defineEventHandler } from 'nuxt/server'` e `event.res.headers.set(...)`. |

---

## 📚 Referências

- [Nuxt 4.x Upgrade Guide — Testing Nuxt 5 & Moving to `nuxt/server`](https://nuxt.com/docs/4.x/getting-started/upgrade)
- [Nuxt 4.x Guide — Server Imports (`nuxt/server`)](https://nuxt.com/docs/4.x/guide/going-further/server-imports)
- [Nuxt Issue #34142 — `compatibilityVersion: 5` & Nitro auto-imports](https://github.com/nuxt/nuxt/issues/34142#issuecomment-3791192527)
- [@nuxt/image Issue #2205 — Missing `#imports` error with `compatibilityVersion: 5`](https://github.com/nuxt/image/issues/2205)
- [@nuxt/image PR #2347 — fix: use explicit imports in nitro v2 server runtime](https://github.com/nuxt/image/pull/2347)
- [Documentação do Sharp — Building from source & `SHARP_IGNORE_GLOBAL_LIBVIPS`](https://sharp.pixelplumbing.com/install#building-from-source)
