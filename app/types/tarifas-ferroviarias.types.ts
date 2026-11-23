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
