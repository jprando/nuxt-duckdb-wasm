import { describe, expect, it } from 'vitest'
import { selectDadosParquet, selectDadosSimples } from '../../app/utils/duckdb.queries'

const ITENS_POR_PAGINA = 50
globalThis.duckDBItensPorPagina = ITENS_POR_PAGINA

describe('selectDadosSimples — paginação e edge cases', () => {
  it('página 1 sempre gera OFFSET 0', () => {
    const sql = selectDadosSimples(1, 10)
    expect(sql).toContain('OFFSET 0')
  })

  it('calcula OFFSET corretamente para páginas intermediárias', () => {
    // Testar várias combinações de página × tamanho
    const casos = [
      { pagina: 1, tamanho: 50, offsetEsperado: 0 },
      { pagina: 2, tamanho: 50, offsetEsperado: 50 },
      { pagina: 3, tamanho: 25, offsetEsperado: 50 },
      { pagina: 10, tamanho: 100, offsetEsperado: 900 },
      { pagina: 100, tamanho: 50, offsetEsperado: 4950 }
    ]

    for (const { pagina, tamanho, offsetEsperado } of casos) {
      const sql = selectDadosSimples(pagina, tamanho)
      expect(sql).toContain(`OFFSET ${offsetEsperado}`)
    }
  })

  it('gera SQL válido com filtro WHERE range % 2 = 0', () => {
    const sql = selectDadosSimples(1, 50)
    expect(sql).toContain('WHERE range % 2 = 0')
  })

  it('inclui coluna random() para variabilidade', () => {
    const sql = selectDadosSimples(1, 50)
    expect(sql).toContain('random()')
  })

  it('usa range(10_000) como fonte de dados', () => {
    const sql = selectDadosSimples(1, 50)
    expect(sql).toContain('range(10_000)')
  })
})

describe('selectDadosParquet — paginação e escaping', () => {
  it('envolve nome do arquivo em aspas simples no FROM', () => {
    const sql = selectDadosParquet('dados.parquet', 1, 50)
    expect(sql).toContain('FROM \'dados.parquet\'')
  })

  it('preserva URL completa quando usada como nome', () => {
    const urlCompleta = 'https://example.com/dados.parquet'
    const sql = selectDadosParquet(urlCompleta, 1, 50)
    expect(sql).toContain(`FROM '${urlCompleta}'`)
  })

  it('calcula OFFSET identicamente ao selectDadosSimples', () => {
    const sql1 = selectDadosSimples(5, 20)
    const sql2 = selectDadosParquet('x.parquet', 5, 20)

    // Ambos devem ter OFFSET 80
    expect(sql1).toContain('OFFSET 80')
    expect(sql2).toContain('OFFSET 80')
  })

  it('nome de arquivo com caracteres especiais é inserido como-está', () => {
    const nomeComEspacos = 'meu arquivo (v2).parquet'
    const sql = selectDadosParquet(nomeComEspacos, 1, 50)
    expect(sql).toContain(`FROM '${nomeComEspacos}'`)
  })

  it('o SQL gerado não contém SELECT explícito (usa FROM shorthand do DuckDB)', () => {
    const sql = selectDadosParquet('teste.parquet', 1, 50)
    // DuckDB suporta "FROM tabela LIMIT x" sem SELECT
    expect(sql).not.toMatch(/^\s*SELECT/)
    expect(sql).toMatch(/FROM/)
  })
})
