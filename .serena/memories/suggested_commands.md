# Comandos Úteis

## Desenvolvimento
```bash
pnpm dev                    # Inicia o servidor de desenvolvimento em http://localhost:3000
pnpm build                  # Build para produção
pnpm preview                # Pré-visualiza o build de produção
```

## Qualidade de Código
```bash
pnpm lint                   # Executa o ESLint
pnpm lint --fix             # Corrige problemas do ESLint automaticamente
pnpm typecheck              # Executa verificação de tipos TypeScript (nuxt typecheck)
pnpm format                 # Formata código com dprint
```

## Testes
```bash
pnpm test                   # Executa todos os testes Vitest (unitários + componente Nuxt)
pnpm test:unit              # Executa apenas testes unitários (ambiente node)
pnpm test:nuxt              # Executa testes de componente Nuxt (browser via Playwright)
pnpm test:e2e               # Executa testes E2E com Playwright
pnpm test:e2e:ui            # Executa testes E2E com interface gráfica do Playwright
pnpm test:coverage          # Gera relatório de cobertura (provider V8)
pnpm test:watch             # Modo watch para testes
```

## Executar Teste Único
```bash
pnpm vitest run test/unit/example.test.ts       # Teste unitário específico
pnpm vitest run test/nuxt/component.test.ts     # Teste de componente específico
pnpm playwright test tests/example.spec.ts      # Teste E2E específico
```

## DuckDB CLI (análise local)
```bash
pnpm duckdb:ui              # Inicia o DuckDB CLI com servidor de UI
```

## Utilitários do Sistema (Linux)
```bash
git status / git diff / git log   # Operações Git
ls / find / grep                  # Navegação no sistema de arquivos
```

## Após Fazer Alterações (checklist)
```bash
pnpm format                 # 1. Formatar código
pnpm lint --fix             # 2. Corrigir problemas de lint
pnpm typecheck              # 3. Verificar tipos
pnpm test                   # 4. Executar testes
```
