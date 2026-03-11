export interface KpisTaxiNYCLocal extends Record<string, unknown> {
  total_trips: number
  avg_distance: number
  avg_amount: number
  total_revenue: number
  periodo_inicio: string
  periodo_fim: string
}

export interface DadosVendor extends Record<string, unknown> {
  vendor: string
  total: number
}

export interface DadosPassageiros extends Record<string, unknown> {
  passageiros: number
  total: number
}

export interface DadosDistancia extends Record<string, unknown> {
  milhas: number
  total: number
}

export interface DadosValor extends Record<string, unknown> {
  faixa: string
  total: number
}

export interface DadosHora extends Record<string, unknown> {
  hora: number
  total: number
}
