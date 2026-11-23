import type { ChartData } from '@nuxt/ui'

export type TipoGrafico = 'line' | 'area' | 'bar' | 'donut'
export interface CategoriaGrafico {
  key: string
  label: string
  color?: string
}
/** Props do componente UChart, prontas para v-bind. */
export interface ConfiguracaoGrafico {
  type: TipoGrafico
  data: ChartData[]
  index: string
  categories: CategoriaGrafico[]
  colors?: string[]
  stacked?: boolean
  curve?: 'linear' | 'monotone' | 'step'
  points?: boolean
  xLabel?: string
  yLabel?: string
  legend?: boolean
  format?: (valor: number) => string
}
export interface SerieGrafico {
  nome: string
  valores: number[]
  cor?: string
}
export interface FatiaGrafico {
  nome: string
  valor: number
  cor?: string
}
