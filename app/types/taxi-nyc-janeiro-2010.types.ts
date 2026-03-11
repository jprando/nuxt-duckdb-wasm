export interface KpisTaxiNYCJaneiro2010 extends Record<string, unknown> {
  total_trips: number
  avg_duration_min: number
  avg_tip: number
  total_revenue: number
  periodo_inicio: string
  periodo_fim: string
}

export interface DadosVendor extends Record<string, unknown> {
  vendor: string
  total: number
}

export interface DadosPagamento extends Record<string, unknown> {
  pagamento: string
  total: number
}

export interface DadosDistancia extends Record<string, unknown> {
  milhas: number
  total: number
}

export interface DadosGorjeta extends Record<string, unknown> {
  faixa: string
  total: number
}

export interface DadosHora extends Record<string, unknown> {
  hora: number
  total: number
}
