# Agent Guidelines

This file contains guidelines for AI agents working on this Nuxt 4 + DuckDB WASM project.

## Build, Lint, and Test Commands

### Development
```bash
pnpm dev                    # Start dev server on http://localhost:3000
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Code Quality
```bash
pnpm lint                   # Run ESLint (fix with --fix)
pnpm typecheck              # Run TypeScript type checking
pnpm format                 # Format code with dprint
```

### Testing
```bash
pnpm test                   # Run all tests
pnpm test:unit              # Run unit tests only
pnpm test:nuxt              # Run Nuxt component tests
pnpm test:e2e               # Run Playwright E2E tests
pnpm test:e2e:ui            # Run E2E tests with UI
pnpm test:coverage          # Generate coverage report
pnpm test:watch             # Watch mode for unit tests
```

### Run Single Test
```bash
# Unit test
pnpm vitest run test/unit/example.test.ts

# Component test
pnpm vitest run test/nuxt/component.test.ts

# E2E test
pnpm playwright test tests/example.spec.ts

# Run specific test file with vitest
pnpm vitest --run test/unit/example.test.ts
```

## Code Style Guidelines

### Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line endings**: LF (Unix)
- **Trailing whitespace**: None
- **Final newline**: Required at end of files
- **Comma dangle**: No trailing commas
- **Brace style**: 1TBS (one true brace style)
- **Max attributes per line**: 1 in Vue templates

### TypeScript
- Use `lang="ts"` in Vue `<script>` tags
- Explicit imports for non-Nuxt packages (e.g., `import { something } from "external"`)
- Auto-imports from Vue and Nuxt: `ref`, `computed`, `shallowRef`, `onMounted`, etc.
- Type assertions with `as Type` when needed
- Use `Record<string, unknown>` for generic object types
- Avoid `any`; prefer `unknown` or specific types

### Vue Components
- Use Composition API with `<script setup lang="ts">`
- PascalCase for component files: `AppLogo.vue`, `TemplateMenu.vue`
- Template indentation: 2 spaces per level
- Props and emits defined inline in setup when possible
- Use `class` and `style` bindings, not `class=""` strings for dynamic values

### Naming Conventions
- **Variables/Functions**: camelCase (Portuguese preferred, e.g., `estahInicializando`, `obterDadosParquet`)
- **Components**: PascalCase
- **Files**: kebab-case (except components: PascalCase)
- **Constants**: SCREAMING_SNAKE_CASE or camelCase
- **Interfaces/Types**: PascalCase with `I` prefix NOT required

### Imports
- Auto-imported (no import needed): `ref`, `computed`, `onMounted`, `shallowRef`, `useHead`, `useSeoMeta`, `NuxtLink`, `NuxtPage`
- Import Nuxt UI components explicitly: `import { UButton, UCard } from "#ui"`
- Import external packages: `import * as duckdb from "@duckdb/duckdb-wasm"`
- Shared utils: `import { numeroSemCasaDecimal } from "~/shared/utils/formatar"`

### Error Handling
- Use try/catch/finally for async operations
- Log errors with `console.error("description:", error)`
- Provide fallback values: `quantidadeTotal: quantidade?.total ?? 0`
- Set loading states appropriately: `estahCarregando.value = false` in finally block
- Never expose secrets or sensitive data in logs

### Nuxt UI Components
- Use Nuxt UI components from auto-import: `UButton`, `UCard`, `UContainer`, `UPagination`, etc.
- Props use kebab-case in templates: `:ui="{ body: 'p-0!' }"`
- Slots: `#header`, `#footer`, `#default` for template parts
- Use `:ui` prop for style customization
- Icons via Iconify: `icon="i-lucide-rocket"`, `icon="i-simple-icons-github"`

### Composables
- Export composable functions directly: `export const useDuckDb = () => {}`
- Use `ref` for reactive values, `shallowRef` for large objects
- Return object with methods and reactive state
- Initialize state in composable, not in components
- Use `import.meta.client` checks for client-only code

### Testing
- **Unit tests**: `test/unit/*.test.ts` - Pure TypeScript functions
- **Component tests**: `test/nuxt/*.test.ts` - Use `@nuxt/test-utils/runtime` with `mountSuspended`
- **E2E tests**: `tests/*.spec.ts` - Use `@nuxt/test-utils/playwright` with `goto` and `expect`
- Describe tests with `describe("description", () => {})`
- Use `it` or `test` for individual tests
- Expectations with `expect().toBe()`, `expect().toHaveTitle()`, etc.

### Comments
- Use Portuguese for comments and descriptions
- Keep comments concise and meaningful
- No inline comments at end of lines
- Use block comments for file headers or major sections

### File Organization
- `app/` - Application code (pages, components, composables)
- `shared/` - Shared utilities across app/server
- `test/unit/` - Unit tests
- `test/nuxt/` - Nuxt component tests
- `tests/` - E2E tests
- `public/` - Static assets (including Parquet files)
- Use `.bkp` suffix for backup files, don't commit production files as `.bkp`

### DuckDB WASM Specific
- DuckDB version: 1.32.0
- WASM URL from CDN: `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${VERSION}/dist/duckdb-eh.wasm`
- Worker URL: `@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url`
- Use `AsyncDuckDB` class
- Register remote Parquet files: `db.registerFileURL(name, url, protocol, overwrite)`
- Sanitize BigInt values: `typeof value === "bigint" ? Number(value) : value`
- Always close connections: `await conn.close()` in finally blocks

### After Making Changes
```bash
pnpm lint              # Check for linting issues
pnpm typecheck         # Verify TypeScript types
pnpm test              # Run all tests
pnpm format            # Format code before committing
```
