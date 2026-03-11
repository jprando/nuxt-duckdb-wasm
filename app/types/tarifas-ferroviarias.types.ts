export interface KpisTarifasFerroviarias extends Record<string, unknown> {
  total_routes: number
  total_stations: number
  avg_price: number
  min_price: number
  max_price: number
}

export type DadosDistribuicaoTarifa = Record<string, unknown> & { count: number, price_bucket: number }
export type DadosRotaCara = Record<string, unknown> & { route: string, price: number }
export type DadosEstacaoConectada = Record<string, unknown> & { station: string, appearances: number }
export type DadosConexaoChord = Record<string, unknown> & {
  src: string
  dst: string
  total: number
  preco_medio: number
}
export type ParametroTooltipChord = {
  dataType: string
  data: { source?: string, target?: string, value?: number, preco_medio?: number }
  name?: string
  value?: number
}
