# 📚 Documentação do Projeto

Guia técnico e arquitetura do projeto **nuxt-duckdb-wasm**.

## 📂 Estrutura

```
docs/
├── README.md                              (este arquivo)
└── componentes/
    └── lazy-loading-componentes.md        📄 Guia de lazy loading
```

## 📖 Conteúdo

### 🎯 Componentes

#### [Lazy Loading de Componentes](./componentes/lazy-loading-componentes.md)
> 🚀 Otimização de bundle através de `defineAsyncComponent`

**Tópicos Cobertos:**
- 🎯 Problema: Bundle de 666 KB
- 💡 Solução: Code splitting com lazy loading
- 🛠️ Implementação passo a passo
- 📊 Resultados: -50% no LCP
- 🔄 Como reutilizar em novos componentes

**Bom para:**
- ✅ Entender por que componentes pesados precisam de lazy loading
- ✅ Implementar novo componente pesado
- ✅ Otimizar bundle em geral
- ✅ Melhorar Core Web Vitals

---

## 🚀 Quick Start

### Se você está...

**...implementando um novo componente pesado (> 100KB)**
→ Leia: [Lazy Loading de Componentes](./componentes/lazy-loading-componentes.md#🔄-como-usar-em-novos-componentes)

**...investigando por que o bundle é grande**
→ Leia: [O Problema](./componentes/lazy-loading-componentes.md#-o-problema)

**...querendo melhorar Core Web Vitals**
→ Leia: [Resultados Alcançados](./componentes/lazy-loading-componentes.md#-resultados-alcançados)

**...contribuindo ao projeto**
→ Leia tudo em: [Lazy Loading de Componentes](./componentes/lazy-loading-componentes.md)

---

## 📝 Convenções

Todos os documentos nesta pasta seguem:

- ✅ **Português Brasileiro** como idioma principal
- ✅ **Emojis** para melhor visualização
- ✅ **Estrutura Clara** com índices e referências
- ✅ **Exemplos Práticos** de código

---

## 🔗 Referências do Projeto

### Arquivos Principais
- `CLAUDE.md` - Instruções para agentes IA
- `nuxt.config.ts` - Configuração principal
- `app/utils/lazy-components.ts` - Componentes lazy
- `app/components/view/pocs-v1/` - Páginas de exemplo

### Commits Relevantes
- `6b47ddc` - perf(bundle): lazy load ECharts components

---

## 🤝 Contribuição

Ao adicionar nova documentação:

1. Crie em `docs/topico/arquivo.md`
2. Use estrutura similar a `lazy-loading-componentes.md`
3. Atualize este README
4. Use emojis apropriados

---

**Last Updated:** 2025-02-24
**Next Review:** 2025-03-24
