import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosDistribuicaoTarifa,
  DadosEstacaoConectada,
  DadosRotaCara,
  KpisTarifasFerroviarias
} from '~/types/tarifas-ferroviarias.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'

export const useTarifasFerroviarias = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisTarifasFerroviarias>({
    total_routes: 0,
    total_stations: 0,
    avg_price: 0,
    min_price: 0,
    max_price: 0
  })

  const opcaoDistribuicaoPreco = ref<ConfiguracaoGrafico | null>(null)
  const opcaoRotasCaras = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoEstacoesConectadas = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoDistribuicaoPreco = (data: DadosDistribuicaoTarifa[]) => {
    opcaoDistribuicaoPreco.value = montarGrafico({
      rotulos: data.map(d => `€${d.price_bucket}`),
      series: [{ nome: 'Nº de Rotas', valores: data.map(d => d.count), cor: COR_PRIMARIA }]
    })
  }
  const configurarGraficoRotasCaras = (data: DadosRotaCara[]) => {
    opcaoRotasCaras.value = montarGrafico({
      rotulos: data.map(d => d.route),
      series: [{ nome: 'Preço', valores: data.map(d => d.price), cor: COR_TERCIARIA }]
    })
  }
  const configurarGraficoEstacoesConectadas = (data: DadosEstacaoConectada[]) => {
    configuracaoGraficoEstacoesConectadas.value = montarGrafico({
      rotulos: data.map(d => d.station),
      series: [{ nome: 'Nº de Conexões', valores: data.map(d => d.appearances), cor: COR_SECUNDARIA }]
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = tarifasFerroviariasUrl
    const nomeArquivo = await registrarParquet(url)

    executar(railwayFaresKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisTarifasFerroviarias
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(railwayFaresPriceDistributionConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDistribuicaoPreco(dados as DadosDistribuicaoTarifa[])
    )
    executar(railwayFaresMostExpensiveRoutesConsulta(nomeArquivo)).then(dados =>
      configurarGraficoRotasCaras(dados as DadosRotaCara[])
    )
    executar(railwayFaresBusiestStationsConsulta(nomeArquivo)).then(dados =>
      configurarGraficoEstacoesConectadas(dados as DadosEstacaoConectada[])
    )
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtPreco = (n: number) => euroSemCasaDecimal.format(n)

  return {
    carregandoKpis,
    erro,
    kpis,
    opcaoDistribuicaoPreco,
    opcaoRotasCaras,
    configuracaoGraficoEstacoesConectadas,
    fmtNumero,
    fmtPreco
  }
}
