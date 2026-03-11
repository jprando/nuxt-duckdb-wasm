export interface KpisTaxiNYCAbril2019 extends Record<string, unknown> {
  total_trips: number
  avg_duration_min: number
  avg_tip: number
  total_revenue: number
  periodo_inicio: string
  periodo_fim: string
}

export interface DadosTarifa extends Record<string, unknown> {
  tarifa: string
  total: number
}

export interface DadosPagamento extends Record<string, unknown> {
  pagamento: string
  total: number
}

export interface DadosDuracao extends Record<string, unknown> {
  faixa_min: number
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
