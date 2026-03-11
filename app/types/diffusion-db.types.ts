export interface KpisDiffusionDB extends Record<string, unknown> {
  total_imagens: number
  total_usuarios: number
  pct_nsfw: number
  steps_medio: number
  periodo_inicio: string
  periodo_fim: string
}

export type DadosPorDimensao = Record<string, unknown> & { dimensao: string, total: number }
export type DadosPorCategoriaNsfw = Record<string, unknown> & { categoria: string, total: number }
export type DadosPorFaixaSteps = Record<string, unknown> & { faixa_inicio: number, total: number }
export type DadosPorSampler = Record<string, unknown> & { nome_sampler: string, total: number }
export type DadosPorHoraAtividade = Record<string, unknown> & { hora: number, total: number }
