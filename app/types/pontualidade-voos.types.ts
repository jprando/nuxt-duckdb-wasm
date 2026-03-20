export interface KpisPontualidadeVoos extends Record<string, unknown> {
  total_voos: number
  distancia_media: number
  atraso_medio_partida: number
  atraso_medio_chegada: number
  taxa_cancelamento: number
  pct_pontuais: number
}

export interface LinhaContagemPorCompanhia extends Record<string, unknown> {
  carrier: string
  total: number
}

export interface LinhaContagemPorStatus extends Record<string, unknown> {
  status: string
  total: number
}

export interface LinhaAtrasoPorDiaSemana extends Record<string, unknown> {
  dayofweek: number
  atraso_medio: number | null
}

export interface LinhaContagemMensal extends Record<string, unknown> {
  month: number
  total: number
}

export interface LinhaContagemPorFaixaAtraso extends Record<string, unknown> {
  faixa_min: number
  total: number
}

export interface LinhaContagemPorGrupoDistancia extends Record<string, unknown> {
  distancegroup: number
  total: number
}

export interface LinhaContagemPorAeroportoOrigem extends Record<string, unknown> {
  origin: string
  total: number
}

export interface LinhaTaxaCancelamentoPorCompanhia extends Record<string, unknown> {
  carrier: string
  taxa_cancelamento: number
}

export interface LinhaAtrasoPorHoraPartida extends Record<string, unknown> {
  hora: number
  atraso_medio: number | null
}

export interface LinhaRadarCompanhia extends Record<string, unknown> {
  carrier: string
  atraso_medio: number | null
  distancia_media: number | null
  pct_cancelado: number | null
  pct_pontual: number | null
}

export interface LinhaSankeyCompanhiaStatus extends Record<string, unknown> {
  companhia: string
  status: string
  total: number
}

export interface ParametroTooltipSankey {
  dataType: string
  data: { source?: string, target?: string, value?: number }
  name?: string
  value?: number
}
