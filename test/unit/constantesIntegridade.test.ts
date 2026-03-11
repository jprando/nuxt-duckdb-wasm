import { describe, expect, it } from 'vitest'
import {
  datasetsParquet,
  listaParquets,
  nomeUrlParquetsR2,
  taxiNYCAbril2019Parquet,
  taxiNYCAbril2019Url,
  taxiNYCLocalParquet,
  taxiNYCLocalUrl
} from '../../app/utils/duckdb.constantes'

const R2_BASE = 'https://pub-1407a0cd06da4125aec80dc262085591.r2.dev'

describe('integridade referencial entre constantes', () => {
  it('URLs exportadas individualmente correspondem ao padrão r2BaseUrl + nomeParquet', () => {
    // Verificar que cada URL é construída corretamente
    for (const { nome, url } of nomeUrlParquetsR2) {
      expect(url).toBe(`${R2_BASE}/${nome}`)
    }
  })

  it('cada dataset (exceto dados simples) referencia uma URL presente em nomeUrlParquetsR2', () => {
    const urlsValidas = new Set(nomeUrlParquetsR2.map(item => item.url))

    for (const dataset of datasetsParquet) {
      if (dataset.url === '') continue // dados simples (gerado em memória)
      expect(urlsValidas.has(dataset.url)).toBe(true)
    }
  })

  it('nomes de parquets exportados individualmente existem em listaParquets', () => {
    expect(listaParquets).toContain(taxiNYCLocalParquet)
    expect(listaParquets).toContain(taxiNYCAbril2019Parquet)
  })

  it('URLs exportadas individualmente batem com as geradas por listaParquets', () => {
    expect(taxiNYCLocalUrl).toBe(`${R2_BASE}/${taxiNYCLocalParquet}`)
    expect(taxiNYCAbril2019Url).toBe(`${R2_BASE}/${taxiNYCAbril2019Parquet}`)
  })

  it('nomes de parquets são únicos (sem duplicatas)', () => {
    const nomeUnicos = new Set(listaParquets)
    expect(nomeUnicos.size).toBe(listaParquets.length)
  })

  it('URLs de datasets são únicas (exceto a vazia)', () => {
    const urlsComValor = datasetsParquet.filter(d => d.url !== '').map(d => d.url)
    const urlsUnicas = new Set(urlsComValor)
    expect(urlsUnicas.size).toBe(urlsComValor.length)
  })

  it('todos os grupos de datasets são strings não-vazias', () => {
    const grupos = [...new Set(datasetsParquet.map(d => d.grupo))]
    for (const grupo of grupos) {
      expect(grupo.length).toBeGreaterThan(0)
    }
  })

  it('nomeUrlParquetsR2 mantém a mesma ordem que listaParquets', () => {
    for (let i = 0; i < listaParquets.length; i++) {
      expect(nomeUrlParquetsR2[i].nome).toBe(listaParquets[i])
    }
  })
})
