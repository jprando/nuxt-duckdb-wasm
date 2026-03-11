export interface KpisEletricidadeFinlandia extends Record<string, unknown> {
  total_registros: number
  preco_medio: number
  preco_minimo: number
  preco_maximo: number
  desvio_padrao: number
  periodo_inicio: string
  periodo_fim: string
}

export type DadosPrecoMensal = Record<string, unknown> & {
  mes: number
  preco_medio: number
  preco_max: number
  preco_min: number
}
export type DadosPrecoHorario = Record<string, unknown> & { hora: number, preco_medio: number }
export type DadosPrecoSemanal = Record<string, unknown> & { semana: string, preco_medio: number, preco_max: number }
export type DadosDistribuicaoPreco = Record<string, unknown> & { faixa_inicio: number, total: number }
export type DadosCalendario = Record<string, unknown> & { dia: string, preco_medio: number }
export type ParametroTooltipCalendario = { value: [string, number] }
