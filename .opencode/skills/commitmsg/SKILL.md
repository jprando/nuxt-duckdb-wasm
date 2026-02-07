---
name: commitmsg
description: Analisa alterações em stage (git) e cria mensagem de commit condizente
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: git
---

## O que eu faço
- Analisa arquivos em stage usando `git diff --cached --stat`
- Lê o diff detalhado com `git diff --cached`
- Gera mensagem de commit que descreve as alterações de forma clara e concisa
- Segue as convenções de commits do projeto (conventional commits se aplicável)

## Quando usar
Use quando você precisa criar uma mensagem de commit para alterações já preparadas em stage.

## Como funciona
1. Primeiro, verifico quais arquivos estão em stage com `git diff --cached --stat`
2. Se houver arquivos em stage, leio o diff detalhado com `git diff --cached`
3. Analiso as mudanças para entender:
   - Tipo de alteração (feature, fix, refactor, docs, test, chore, etc.)
   - Escopo da mudança (componentes, páginas, utilitários, etc.)
   - Descrição clara do que foi modificado
4. Gero uma mensagem de commit seguindo o formato:
   ```
   <tipo>(<escopo>): <descrição breve>
   ```
5. Se houver múltiplos arquivos com alterações não relacionadas, sugiro commits separados

## Exemplos de mensagens geradas
- `feat(components): adicionar botão de exportar dados`
- `fix(api): corrigir erro ao buscar usuários`
- `docs(readme): atualizar instruções de instalação`
- `refactor(utils): simplificar função de formatação`

## Observações
- Sempre analise os diffs completos antes de gerar a mensagem
- Use português nas mensagens de commit (ou conforme as convenções do projeto)
- Se não houver arquivos em stage, informe o usuário
- Se houver muitos arquivos não relacionados, sugira commits separados