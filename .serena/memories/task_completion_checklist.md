# Checklist de Conclusão de Tarefa

Após concluir qualquer alteração de código, execute estes comandos na ordem:

1. **Formatar**: `pnpm format` — Executa o dprint para formatar todos os arquivos
2. **Lint**: `pnpm lint --fix` — Executa o ESLint com correção automática
3. **Verificar tipos**: `pnpm typecheck` — Executa `nuxt typecheck` para validação TypeScript
4. **Testes**: `pnpm test` — Executa todos os testes Vitest (unitários + componente Nuxt)

## Para alterações de UI
- Executar também `pnpm test:e2e` para testes E2E com Playwright

## Pipeline de CI
O GitHub Actions CI (`ci.yml`) executa a cada push:
- `pnpm lint`
- `pnpm typecheck`

Nota: Testes NÃO são executados no CI atualmente (apenas lint + typecheck).

## Observações Importantes
- O formatador é **dprint**, NÃO Prettier. Nunca instalar ou configurar Prettier.
- A configuração do ESLint estende `@nuxt/eslint` com regras estilísticas (sem trailing commas, 1TBS).
- O Vitest usa duas configurações de projeto: `unit` (ambiente node) e `nuxt` (ambiente browser via Playwright).
