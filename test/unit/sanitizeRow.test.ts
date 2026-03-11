import { describe, expect, it } from 'vitest'
import { sanitizeRow } from '../../app/utils/duckdb.sanitizeRow'

describe('sanitizeRow', () => {
  it('converte BigInt para Number', () => {
    const entrada = { total: BigInt(42), nome: 'teste' }
    const resultado = sanitizeRow(entrada)

    expect(resultado.total).toBe(42)
    expect(typeof resultado.total).toBe('number')
  })

  it('mantém valores que não são BigInt inalterados', () => {
    const entrada = { texto: 'abc', numero: 3.14, ativo: true, vazio: null }
    const resultado = sanitizeRow(entrada)

    expect(resultado).toEqual({
      texto: 'abc',
      numero: 3.14,
      ativo: true,
      vazio: null
    })
  })

  it('retorna objeto vazio para entrada vazia', () => {
    const resultado = sanitizeRow({})
    expect(resultado).toEqual({})
  })

  it('converte múltiplos BigInts na mesma linha', () => {
    const entrada = {
      coluna_a: BigInt(100),
      coluna_b: BigInt(999_999_999),
      coluna_c: 'texto'
    }
    const resultado = sanitizeRow(entrada)

    expect(resultado.coluna_a).toBe(100)
    expect(resultado.coluna_b).toBe(999_999_999)
    expect(resultado.coluna_c).toBe('texto')
  })
})
