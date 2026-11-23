import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  KpisEstacoesTrem,
  LinhaContagemPorCategoria,
  LinhaContagemPorFaixaLatitude,
  LinhaContagemPorFaixaLongitude,
  LinhaContagemPorPais,
  LinhaContagemPorTipo,
  LinhaTipoPorPais
} from '~/types/estacoes-trem.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, '#f43f5e', '#14b8a6']

export const useEstacoesTrem = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisEstacoesTrem>({
    total_estacoes: 0,
    total_paises: 0,
    total_tipos: 0,
    megaestacoes: 0,
    estacoes_nl: 0,
    estacoes_intercidade: 0
  })

  const configuracaoGraficoPaises = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoTipos = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoCategorias = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoLatitude = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoLongitude = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoTiposPorPais = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoPaises = (data: LinhaContagemPorPais[]) => {
    configuracaoGraficoPaises.value = montarGrafico({
      rotulos: data.map(d => d.country),
      series: [{ nome: 'Estações', valores: data.map(d => d.total), cor: COR_PRIMARIA }]
    })
  }
  const configurarGraficoTipos = (data: LinhaContagemPorTipo[]) => {
    configuracaoGraficoTipos.value = montarRosca(
      data.map(d => ({ nome: d.type, valor: d.total })),
      'Estações'
    )
  }
  const configurarGraficoCategorias = (data: LinhaContagemPorCategoria[]) => {
    configuracaoGraficoCategorias.value = montarRosca(
      data.map(d => ({ nome: d.categoria, valor: d.total })),
      'Estações'
    )
  }
  const configurarGraficoLatitude = (data: LinhaContagemPorFaixaLatitude[]) => {
    configuracaoGraficoLatitude.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_lat}°N`),
      series: [{ nome: 'Estações', valores: data.map(d => d.total), cor: COR_TERCIARIA }]
    })
  }
  const configurarGraficoLongitude = (data: LinhaContagemPorFaixaLongitude[]) => {
    configuracaoGraficoLongitude.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_lng}°–${d.faixa_lng + 2}°L`),
      series: [{ nome: 'Estações', valores: data.map(d => d.total), cor: COR_QUATERNARIA }]
    })
  }
  const configurarGraficoTiposPorPais = (data: LinhaTipoPorPais[]) => {
    const countries = [...new Set(data.map(d => d.country))]
    const types = [...new Set(data.map(d => d.type))]
    const map = new Map<string, Map<string, number>>()
    data.forEach((d) => {
      if (!map.has(d.country)) map.set(d.country, new Map())
      map.get(d.country)!.set(d.type, d.total)
    })
    configuracaoGraficoTiposPorPais.value = montarGrafico({
      rotulos: countries,
      series: types.map((type, i) => ({
        nome: type,
        valores: countries.map(c => map.get(c)?.get(type) ?? 0),
        cor: PALETA[i % PALETA.length]
      })),
      empilhado: true
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = estacoesTremUrl
    const nomeArquivo = await registrarParquet(url)

    executar(estacoesTremKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisEstacoesTrem
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(estacoesTremPaisesConsulta(nomeArquivo)).then(dados =>
      configurarGraficoPaises(dados as LinhaContagemPorPais[])
    )
    executar(estacoesTremTiposConsulta(nomeArquivo)).then(dados =>
      configurarGraficoTipos(dados as LinhaContagemPorTipo[])
    )
    executar(estacoesTremCategoriasConsulta(nomeArquivo)).then(dados =>
      configurarGraficoCategorias(dados as LinhaContagemPorCategoria[])
    )
    executar(estacoesTremLatitudeConsulta(nomeArquivo)).then(dados =>
      configurarGraficoLatitude(dados as LinhaContagemPorFaixaLatitude[])
    )
    executar(estacoesTremLongitudeConsulta(nomeArquivo)).then(dados =>
      configurarGraficoLongitude(dados as LinhaContagemPorFaixaLongitude[])
    )
    executar(estacoesTremTiposPorPaisConsulta(nomeArquivo)).then(dados =>
      configurarGraficoTiposPorPais(dados as LinhaTipoPorPais[])
    )
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)

  return {
    carregandoKpis,
    erro,
    kpis,
    configuracaoGraficoPaises,
    configuracaoGraficoTipos,
    configuracaoGraficoCategorias,
    configuracaoGraficoLatitude,
    configuracaoGraficoLongitude,
    configuracaoGraficoTiposPorPais,
    fmtNumero
  }
}
