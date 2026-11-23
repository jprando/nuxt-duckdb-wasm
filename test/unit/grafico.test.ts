import { describe, expect, it } from 'vitest'
import { graficoVazio, montarGrafico, montarRosca, PALETA_GRAFICO } from '../../app/utils/grafico'

describe('montarGrafico', () => {
  it('gera uma linha por rótulo com uma chave por série', () => {
    const grafico = montarGrafico({
      rotulos: ['A', 'B'],
      series: [
        { nome: 'Vendas', valores: [1, 2] },
        { nome: 'Custos', valores: [3, 4] }
      ]
    })
    expect(grafico.type).toBe('bar')
    expect(grafico.index).toBe('rotulo')
    expect(grafico.data).toEqual([
      { rotulo: 'A', serie0: 1, serie1: 3 },
      { rotulo: 'B', serie0: 2, serie1: 4 }
    ])
    expect(grafico.categories.map(c => c.label)).toEqual(['Vendas', 'Custos'])
  })
  it('usa a cor da série ou cicla a paleta', () => {
    const grafico = montarGrafico({
      rotulos: ['A'],
      series: [
        { nome: 'x', valores: [1], cor: '#000000' },
        { nome: 'y', valores: [1] }
      ]
    })
    expect(grafico.categories[0]!.color).toBe('#000000')
    expect(grafico.categories[1]!.color).toBe(PALETA_GRAFICO[1])
  })
  it('converte rótulos numéricos em string e preenche 0 quando falta valor', () => {
    const grafico = montarGrafico({ rotulos: [1, 2], series: [{ nome: 'x', valores: [5] }] })
    expect(grafico.data).toEqual([{ rotulo: '1', serie0: 5 }, { rotulo: '2', serie0: 0 }])
  })
  it('repassa tipo, empilhamento, curva e pontos', () => {
    const grafico = montarGrafico({
      tipo: 'area',
      rotulos: [],
      series: [],
      empilhado: true,
      curva: 'monotone',
      pontos: true,
      rotuloY: 'min'
    })
    expect(grafico).toMatchObject({ type: 'area', stacked: true, curve: 'monotone', points: true, yLabel: 'min' })
  })
})
describe('montarRosca', () => {
  it('gera uma linha por fatia e cores na ordem das fatias', () => {
    const grafico = montarRosca([
      { nome: 'A', valor: 10, cor: '#111111' },
      { nome: 'B', valor: 20 }
    ], 'Total')
    expect(grafico.type).toBe('donut')
    expect(grafico.data).toEqual([{ rotulo: 'A', valor: 10 }, { rotulo: 'B', valor: 20 }])
    expect(grafico.categories).toEqual([{ key: 'valor', label: 'Total' }])
    expect(grafico.colors).toEqual(['#111111', PALETA_GRAFICO[1]])
  })
})
describe('graficoVazio', () => {
  it('não tem linhas de dados', () => {
    expect(graficoVazio().data).toEqual([])
  })
})
