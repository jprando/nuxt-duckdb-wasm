export interface KpisShakespeare extends Record<string, unknown> {
  total_lines: number
  total_plays: number
  total_speakers: number
  avg_words_per_line: number
}

export type DadosPorPeca = Record<string, unknown> & { peca: string, total: number }
export type DadosPorPersonagem = Record<string, unknown> & { personagem: string, total: number }
export type DadosPorAto = Record<string, unknown> & { ato: string, total: number }
export type DadosPorElenco = Record<string, unknown> & { peca: string, personagens: number }
export type DadosPorComprimento = Record<string, unknown> & { faixa: number, total: number }
