import { describe, expect, it } from 'vitest'
import { sanitizeRow } from '../../app/utils/duckdb.sanitizeRow'

describe('sanitizeRow — edge cases e precisão', () => {
  it('preserva precisão ao converter BigInt dentro do range seguro de Number', () => {
    const maxSeguro = BigInt(Number.MAX_SAFE_INTEGER)
    const resultado = sanitizeRow({ valor: maxSeguro })

    expect(resultado.valor).toBe(Number.MAX_SAFE_INTEGER)
    expect(Number.isSafeInteger(resultado.valor)).toBe(true)
  })

  it('converte BigInt acima do MAX_SAFE_INTEGER (perde precisão silenciosamente)', () => {
    const acimaSafe = BigInt(Number.MAX_SAFE_INTEGER) + 1n
    const resultado = sanitizeRow({ valor: acimaSafe })

    // Number(2^53 + 1) === 2^53 em float64 — perde o último bit
    expect(typeof resultado.valor).toBe('number')
    expect(Number.isSafeInteger(resultado.valor)).toBe(false)
  })

  it('converte BigInt negativo corretamente', () => {
    const resultado = sanitizeRow({ saldo: BigInt(-999) })
    expect(resultado.saldo).toBe(-999)
  })

  it('converte BigInt zero', () => {
    const resultado = sanitizeRow({ contagem: 0n })
    expect(resultado.contagem).toBe(0)
    expect(typeof resultado.contagem).toBe('number')
  })

  it('preserva undefined como valor de propriedade', () => {
    const resultado = sanitizeRow({ chave: undefined })
    expect(resultado.chave).toBeUndefined()
    expect('chave' in resultado).toBe(true)
  })

  it('preserva objetos aninhados sem modificar recursivamente', () => {
    const aninhado = { interno: BigInt(42) }
    const resultado = sanitizeRow({ dados: aninhado })

    // sanitizeRow não é recursivo — o BigInt dentro do objeto aninhado NÃO é convertido
    expect((resultado.dados as Record<string, unknown>).interno).toBe(BigInt(42))
  })

  it('preserva arrays como valores', () => {
    const resultado = sanitizeRow({ lista: [1, 2, 3] })
    expect(resultado.lista).toEqual([1, 2, 3])
  })

  it('não modifica o objeto original (cria novo objeto)', () => {
    const original = { a: BigInt(10), b: 'texto' }
    const resultado = sanitizeRow(original)

    expect(resultado).not.toBe(original)
    expect(original.a).toBe(BigInt(10)) // original intacto
    expect(resultado.a).toBe(10)
  })

  it('processa linha com muitas colunas eficientemente', () => {
    const linhaGrande: Record<string, unknown> = {}
    for (let i = 0; i < 100; i++) {
      linhaGrande[`coluna_${i}`] = i % 2 === 0 ? BigInt(i) : `valor_${i}`
    }

    const resultado = sanitizeRow(linhaGrande)

    expect(Object.keys(resultado)).toHaveLength(100)
    expect(resultado.coluna_0).toBe(0)
    expect(resultado.coluna_1).toBe('valor_1')
    expect(resultado.coluna_98).toBe(98)
    expect(typeof resultado.coluna_98).toBe('number')
  })

  it('lida com valores especiais de Number (NaN, Infinity)', () => {
    const resultado = sanitizeRow({
      nan: NaN,
      infinito: Infinity,
      negInfinito: -Infinity
    })

    expect(resultado.nan).toBeNaN()
    expect(resultado.infinito).toBe(Infinity)
    expect(resultado.negInfinito).toBe(-Infinity)
  })
})
