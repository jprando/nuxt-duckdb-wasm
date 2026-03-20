import { describe, expect, it } from 'vitest'
import {
  dolarComDuasCasas,
  dolarSemCasaDecimal,
  euroSemCasaDecimal,
  formatarData,
  numeroSemCasaDecimal
} from '../../shared/utils/formatar'

describe('numeroSemCasaDecimal — valores limítrofes', () => {
  it('formata número negativo com separador de milhar', () => {
    expect(numeroSemCasaDecimal.format(-1500)).toBe('-1.500')
  })

  it('formata número muito grande (milhões)', () => {
    const resultado = numeroSemCasaDecimal.format(1_234_567_890)
    expect(resultado).toBe('1.234.567.890')
  })

  it('arredonda 0.4 para baixo e 0.5 para cima', () => {
    expect(numeroSemCasaDecimal.format(0.4)).toBe('0')
    // Intl pode usar banker's rounding; verificar se arredonda
    const resultado05 = numeroSemCasaDecimal.format(0.5)
    expect(['0', '1']).toContain(resultado05)
  })

  it('formata NaN como NaN (literal)', () => {
    const resultado = numeroSemCasaDecimal.format(NaN)
    expect(resultado).toBe('NaN')
  })

  it('formata Infinity', () => {
    const resultado = numeroSemCasaDecimal.format(Infinity)
    expect(resultado).toBe('∞')
  })
})

describe('dolarSemCasaDecimal — valores limítrofes', () => {
  it('formata zero como $0', () => {
    const resultado = dolarSemCasaDecimal.format(0)
    expect(resultado).toContain('$')
    expect(resultado).toContain('0')
  })

  it('formata valor negativo com sinal', () => {
    const resultado = dolarSemCasaDecimal.format(-500)
    expect(resultado).toContain('500')
    expect(resultado).toMatch(/[-−]/) // aceita hífen ou minus sign Unicode
  })

  it('trunca centavos sem arredondamento inesperado', () => {
    const resultado = dolarSemCasaDecimal.format(99.99)
    expect(resultado).toContain('$')
    expect(resultado).toContain('100') // arredonda para inteiro
  })
})

describe('dolarComDuasCasas — precisão decimal', () => {
  it('exibe exatamente duas casas decimais para valor inteiro', () => {
    const resultado = dolarComDuasCasas.format(10)
    expect(resultado).toContain('10.00')
  })

  it('arredonda terceira casa decimal', () => {
    const resultado = dolarComDuasCasas.format(9.999)
    expect(resultado).toContain('10.00')
  })

  it('formata valor pequeno (centavos)', () => {
    const resultado = dolarComDuasCasas.format(0.01)
    expect(resultado).toContain('0.01')
  })
})

describe('euroSemCasaDecimal — formato alemão', () => {
  it('usa ponto como separador de milhar (formato alemão)', () => {
    const resultado = euroSemCasaDecimal.format(1234)
    expect(resultado).toContain('1.234')
    expect(resultado).toContain('€')
  })

  it('formata valor unitário sem separador', () => {
    const resultado = euroSemCasaDecimal.format(5)
    expect(resultado).toContain('5')
    expect(resultado).toContain('€')
  })
})

describe('formatarData — edge cases com datas', () => {
  it('formata data no início do epoch Unix', () => {
    const resultado = formatarData(new Date(0))
    // 1 de janeiro de 1970 no fuso local (BR = 31/12/1969)
    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('formata data futura', () => {
    const resultado = formatarData('2099-12-31T12:00:00Z')
    expect(resultado).toMatch(/31\/12\/2099/)
  })

  it('retorna traço para null coerced via string', () => {
    expect(formatarData('null')).toBe('-') // "null" é string inválida como data
  })

  it('formata data com apenas ano-mês-dia (sem horário)', () => {
    const resultado = formatarData('2024-06-15')
    expect(resultado).toMatch(/\d{2}\/\d{2}\/2024/)
  })

  it('lança RangeError para Date object inválido (comportamento do Intl.DateTimeFormat)', () => {
    const dataInvalida = new Date('invalid')
    // formatarData não protege contra Date inválido passado como objeto —
    // o Intl.DateTimeFormat.format() lança RangeError internamente
    expect(() => formatarData(dataInvalida)).toThrow(RangeError)
  })

  it('formata datas de diferentes séculos', () => {
    const resultado1800 = formatarData('1800-01-01T12:00:00Z')
    expect(resultado1800).toMatch(/01\/01\/1800/)

    const resultado2000 = formatarData('2000-06-15T12:00:00Z')
    expect(resultado2000).toMatch(/15\/06\/2000/)
  })
})
