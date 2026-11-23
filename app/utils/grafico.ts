import type { ChartData } from '@nuxt/ui'
import type { ConfiguracaoGrafico, FatiaGrafico, SerieGrafico, TipoGrafico } from '~/types/grafico.types'

export const PALETA_GRAFICO = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#14b8a6']
interface OpcoesMontarGrafico {
  tipo?: Exclude<TipoGrafico, 'donut'>
  rotulos: Array<string | number>
  series: SerieGrafico[]
  empilhado?: boolean
  curva?: 'linear' | 'monotone' | 'step'
  pontos?: boolean
  rotuloX?: string
  rotuloY?: string
  legenda?: boolean
  formato?: (valor: number) => string
}
/** Converte rótulos + séries no formato esperado por `UChart` (line, area, bar). */
export const montarGrafico = (opcoes: OpcoesMontarGrafico): ConfiguracaoGrafico => {
  const { tipo = 'bar', rotulos, series } = opcoes
  const data: ChartData[] = rotulos.map((rotulo, i) => {
    const linha: ChartData = { rotulo: String(rotulo) }
    series.forEach((serie, s) => {
      linha[`serie${s}`] = serie.valores[i] ?? 0
    })
    return linha
  })
  return {
    type: tipo,
    data,
    index: 'rotulo',
    categories: series.map((serie, s) => ({
      key: `serie${s}`,
      label: serie.nome,
      color: serie.cor ?? PALETA_GRAFICO[s % PALETA_GRAFICO.length]
    })),
    stacked: opcoes.empilhado,
    curve: opcoes.curva,
    points: opcoes.pontos,
    xLabel: opcoes.rotuloX,
    yLabel: opcoes.rotuloY,
    legend: opcoes.legenda,
    format: opcoes.formato
  }
}
/** Gráfico de rosca (donut): cada fatia é uma linha de `data`. */
export const montarRosca = (fatias: FatiaGrafico[], nomeValor = 'Valor'): ConfiguracaoGrafico => ({
  type: 'donut',
  data: fatias.map(f => ({ rotulo: f.nome, valor: f.valor })),
  index: 'rotulo',
  categories: [{ key: 'valor', label: nomeValor }],
  colors: fatias.map((f, i) => f.cor ?? (PALETA_GRAFICO[i % PALETA_GRAFICO.length] as string))
})
/** Gráfico sem dados: `GraficoCard` exibe a mensagem de dados indisponíveis. */
export const graficoVazio = (): ConfiguracaoGrafico => montarGrafico({ rotulos: [], series: [] })
