export interface KpisTrensHolandeses extends Record<string, unknown> {
  total_services: number
  total_stations: number
  total_trains: number
  periodo_inicio: string
  periodo_fim: string
}

export type DadosPorTipoServico = Record<string, unknown> & { type: string, total: number }
export type DadosEstacaoMovimentada = Record<string, unknown> & { station_name: string, count: number }
export type DadosPartidaPorHora = Record<string, unknown> & { hora: number, total: number }
export type DadosDuracaoMediaParada = Record<string, unknown> & { station_name: string, avg_stop_seconds: number }
