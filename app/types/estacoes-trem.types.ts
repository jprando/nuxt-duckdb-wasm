export interface KpisEstacoesTrem extends Record<string, unknown> {
  total_estacoes: number
  total_paises: number
  total_tipos: number
  megaestacoes: number
  estacoes_nl: number
  estacoes_intercidade: number
}

export interface LinhaContagemPorPais extends Record<string, unknown> {
  country: string
  total: number
}

export interface LinhaContagemPorTipo extends Record<string, unknown> {
  type: string
  total: number
}

export interface LinhaContagemPorCategoria extends Record<string, unknown> {
  categoria: string
  total: number
}

export interface LinhaContagemPorFaixaLatitude extends Record<string, unknown> {
  faixa_lat: string
  total: number
}

export interface LinhaContagemPorFaixaLongitude extends Record<string, unknown> {
  faixa_lng: number
  total: number
}

export interface LinhaTipoPorPais extends Record<string, unknown> {
  country: string
  type: string
  total: number
}
