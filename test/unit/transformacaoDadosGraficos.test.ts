import { describe, expect, it } from 'vitest'

/**
 * Testa a lógica de transformação de dados dos composables,
 * extraindo e reproduzindo as funções puras de configuração de gráficos.
 *
 * Essas funções vivem dentro dos composables mas são lógica pura —
 * transformam arrays de dados em objetos de configuração ECharts.
 */

const PALETA = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#14b8a6']
const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// ─── Lógica extraída de useEstacoesTrem ─────────────────────────────────────

function construirMapaTiposPorPais(data: Array<{ country: string, type: string, total: number }>) {
  const countries = [...new Set(data.map(d => d.country))]
  const types = [...new Set(data.map(d => d.type))]

  const map = new Map<string, Map<string, number>>()
  data.forEach((d) => {
    if (!map.has(d.country)) map.set(d.country, new Map())
    map.get(d.country)!.set(d.type, d.total)
  })

  const series = types.map((type, i) => ({
    name: type,
    type: 'bar',
    stack: 'total',
    data: countries.map(c => map.get(c)?.get(type) ?? 0),
    itemStyle: { color: PALETA[i % PALETA.length] }
  }))

  return { countries, types, series }
}

// ─── Lógica extraída de usePontualidadeVoos ─────────────────────────────────

function calcularRadarIndicadores(data: Array<{ atraso_medio?: number, distancia_media?: number }>) {
  const maxAtraso = Math.ceil(Math.max(...data.map(d => d.atraso_medio ?? 0), 10) / 50) * 50
  const maxDist = Math.ceil(Math.max(...data.map(d => d.distancia_media ?? 0), 500) / 500) * 500
  return { maxAtraso, maxDist }
}

function calcularTaxaCancelamentoInvertida(pctCancelado: number) {
  return Math.max(0, 100 - pctCancelado * 20)
}

function mapearDiaSemana(dayofweek: number) {
  return DIAS_SEMANA[dayofweek - 1] ?? `D${dayofweek}`
}

function mapearMes(month: number) {
  return MESES[month - 1] ?? `M${month}`
}

// ─── Testes ─────────────────────────────────────────────────────────────────

describe('construirMapaTiposPorPais — Map de Maps com paleta cíclica', () => {
  it('constrói series stacked corretamente para dados simples', () => {
    const dados = [
      { country: 'NL', type: 'intercity', total: 50 },
      { country: 'NL', type: 'local', total: 30 },
      { country: 'DE', type: 'intercity', total: 40 },
      { country: 'DE', type: 'local', total: 20 }
    ]

    const { countries, types, series } = construirMapaTiposPorPais(dados)

    expect(countries).toEqual(['NL', 'DE'])
    expect(types).toEqual(['intercity', 'local'])
    expect(series).toHaveLength(2)

    // Série "intercity": [NL=50, DE=40]
    expect(series[0].name).toBe('intercity')
    expect(series[0].data).toEqual([50, 40])
    expect(series[0].stack).toBe('total')

    // Série "local": [NL=30, DE=20]
    expect(series[1].name).toBe('local')
    expect(series[1].data).toEqual([30, 20])
  })

  it('preenche com 0 quando país não possui determinado tipo', () => {
    const dados = [
      { country: 'NL', type: 'mega', total: 5 },
      { country: 'DE', type: 'local', total: 15 }
    ]

    const { series } = construirMapaTiposPorPais(dados)

    // Série "mega": [NL=5, DE=0 (não existe)]
    expect(series[0].data).toEqual([5, 0])
    // Série "local": [NL=0 (não existe), DE=15]
    expect(series[1].data).toEqual([0, 15])
  })

  it('cicla cores da paleta quando há mais tipos que cores', () => {
    const tipos = Array.from({ length: 8 }, (_, i) => `tipo_${i}`)
    const dados = tipos.map(type => ({ country: 'X', type, total: 1 }))

    const { series } = construirMapaTiposPorPais(dados)

    expect(series).toHaveLength(8)
    // Os tipos 6 e 7 devem reutilizar as cores 0 e 1 da paleta
    expect(series[6].itemStyle.color).toBe(PALETA[0]) // 6 % 6 = 0
    expect(series[7].itemStyle.color).toBe(PALETA[1]) // 7 % 6 = 1
  })

  it('preserva ordem de inserção dos países', () => {
    const dados = [
      { country: 'BE', type: 'a', total: 1 },
      { country: 'NL', type: 'a', total: 2 },
      { country: 'DE', type: 'a', total: 3 }
    ]

    const { countries } = construirMapaTiposPorPais(dados)
    expect(countries).toEqual(['BE', 'NL', 'DE']) // mesma ordem dos dados
  })

  it('retorna arrays vazios para dados vazios', () => {
    const { countries, types, series } = construirMapaTiposPorPais([])
    expect(countries).toEqual([])
    expect(types).toEqual([])
    expect(series).toEqual([])
  })
})

describe('calcularRadarIndicadores — arredondamento para cima dos eixos', () => {
  it('arredonda maxAtraso para múltiplo de 50 acima do maior valor', () => {
    const { maxAtraso } = calcularRadarIndicadores([
      { atraso_medio: 12 },
      { atraso_medio: 47 }
    ])
    expect(maxAtraso).toBe(50) // ceil(47/50)*50 = 50
  })

  it('arredonda maxDist para múltiplo de 500 acima do maior valor', () => {
    const { maxDist } = calcularRadarIndicadores([
      { distancia_media: 800 },
      { distancia_media: 1200 }
    ])
    expect(maxDist).toBe(1500) // ceil(1200/500)*500 = 1500
  })

  it('usa mínimo de 10 para atraso e 500 para distância quando dados são pequenos', () => {
    const { maxAtraso, maxDist } = calcularRadarIndicadores([
      { atraso_medio: 2, distancia_media: 100 }
    ])
    expect(maxAtraso).toBe(50) // ceil(max(2,10)/50)*50 = 50
    expect(maxDist).toBe(500) // ceil(max(100,500)/500)*500 = 500
  })

  it('lida com valores undefined nos dados (usa fallback 0)', () => {
    const { maxAtraso, maxDist } = calcularRadarIndicadores([
      { atraso_medio: undefined, distancia_media: undefined }
    ])
    expect(maxAtraso).toBe(50) // ceil(max(0,10)/50)*50
    expect(maxDist).toBe(500) // ceil(max(0,500)/500)*500
  })

  it('calcula corretamente para valores grandes', () => {
    const { maxAtraso, maxDist } = calcularRadarIndicadores([
      { atraso_medio: 310, distancia_media: 3200 }
    ])
    expect(maxAtraso).toBe(350) // ceil(310/50)*50
    expect(maxDist).toBe(3500) // ceil(3200/500)*500
  })

  it('lida com dados vazios', () => {
    const { maxAtraso, maxDist } = calcularRadarIndicadores([])
    // Math.max(...[], 10) = 10; Math.max(...[], 500) = 500
    // -Infinity é menor que 10/500, então usa os mínimos
    expect(maxAtraso).toBe(50)
    expect(maxDist).toBe(500)
  })
})

describe('calcularTaxaCancelamentoInvertida — escala invertida 0-100', () => {
  it('retorna 100 quando nenhum voo é cancelado (pctCancelado = 0)', () => {
    expect(calcularTaxaCancelamentoInvertida(0)).toBe(100)
  })

  it('retorna 0 quando pctCancelado = 5 (5 * 20 = 100)', () => {
    expect(calcularTaxaCancelamentoInvertida(5)).toBe(0)
  })

  it('aplica Math.max(0, ...) para evitar valores negativos', () => {
    expect(calcularTaxaCancelamentoInvertida(10)).toBe(0) // 100 - 200 clamped a 0
  })

  it('calcula valor intermediário corretamente', () => {
    expect(calcularTaxaCancelamentoInvertida(2.5)).toBe(50) // 100 - 50
  })
})

describe('mapearDiaSemana — fallback para índice fora de range', () => {
  it('mapeia dias 1-7 para Seg-Dom', () => {
    expect(mapearDiaSemana(1)).toBe('Seg')
    expect(mapearDiaSemana(4)).toBe('Qui')
    expect(mapearDiaSemana(7)).toBe('Dom')
  })

  it('retorna fallback D{n} para dia 0', () => {
    expect(mapearDiaSemana(0)).toBe('D0')
  })

  it('retorna fallback D{n} para dia 8', () => {
    expect(mapearDiaSemana(8)).toBe('D8')
  })

  it('retorna fallback para valor negativo', () => {
    expect(mapearDiaSemana(-1)).toBe('D-1')
  })
})

describe('mapearMes — fallback para índice fora de range', () => {
  it('mapeia meses 1-12 corretamente', () => {
    expect(mapearMes(1)).toBe('Jan')
    expect(mapearMes(6)).toBe('Jun')
    expect(mapearMes(12)).toBe('Dez')
  })

  it('retorna fallback M{n} para mês 0', () => {
    expect(mapearMes(0)).toBe('M0')
  })

  it('retorna fallback M{n} para mês 13', () => {
    expect(mapearMes(13)).toBe('M13')
  })
})
