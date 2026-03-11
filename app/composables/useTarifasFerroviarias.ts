import type {
  KpisTarifasFerroviarias,
  DadosDistribuicaoTarifa,
  DadosRotaCara,
  DadosEstacaoConectada,
  DadosConexaoChord,
  ParametroTooltipChord
} from '~/types/tarifas-ferroviarias.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: 'axis' as const }
}

export const useTarifasFerroviarias = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(
    () => (colorMode.value === 'dark' ? 'dark' : '')
  )

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisTarifasFerroviarias>({
    total_routes: 0,
    total_stations: 0,
    avg_price: 0,
    min_price: 0,
    max_price: 0
  })

  const opcaoDistribuicaoPreco = ref<Record<string, unknown> | null>(null)
  const opcaoRotasCaras = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoEstacoesConectadas = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoChord = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoDistribuicaoPreco = (data: DadosDistribuicaoTarifa[]) => {
    const labels = data.map(d => `€${d.price_bucket}`)
    const values = data.map(d => d.count)
    opcaoDistribuicaoPreco.value = {
      ...configuracaoGrafico,
      color: [COR_PRIMARIA],
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: values, name: 'Nº de Rotas' }]
    }
  }

  const configurarGraficoRotasCaras = (data: DadosRotaCara[]) => {
    const routes = data.map(d => d.route)
    const prices = data.map(d => d.price)
    opcaoRotasCaras.value = {
      ...configuracaoGrafico,
      grid: { ...configuracaoGrafico.grid, left: 80 },
      color: [COR_TERCIARIA],
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: { type: 'category', data: routes, axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: prices, name: 'Preço' }]
    }
  }

  const configurarGraficoEstacoesConectadas = (data: DadosEstacaoConectada[]) => {
    const stations = data.map(d => d.station)
    const appearances = data.map(d => d.appearances)
    configuracaoGraficoEstacoesConectadas.value = {
      ...configuracaoGrafico,
      color: [COR_SECUNDARIA],
      xAxis: {
        type: 'category',
        data: stations,
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: appearances, name: 'Nº de Conexões' }]
    }
  }

  const configurarGraficoChord = (data: DadosConexaoChord[]) => {
    const nodesSet = new Set<string>()
    data.forEach((d) => {
      nodesSet.add(d.src)
      nodesSet.add(d.dst)
    })
    const nodes = [...nodesSet].map(name => ({ name }))
    configuracaoGraficoChord.value = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p: ParametroTooltipChord) => {
          if (p.dataType === 'edge') {
            return `${p.data.source} ↔ ${p.data.target}<br/>${p.data.value} rotas · €${p.data.preco_medio} médio`
          }
          return p.name
        }
      },
      series: [{
        type: 'chord',
        radius: ['55%', '65%'],
        center: ['50%', '50%'],
        label: { fontSize: 10 },
        nodes,
        edges: data.map(d => ({
          source: d.src,
          target: d.dst,
          value: d.total,
          preco_medio: d.preco_medio
        }))
      }]
    }
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

    executar(railwayFaresPriceDistributionConsulta(nomeArquivo)).then(dados => configurarGraficoDistribuicaoPreco(dados as DadosDistribuicaoTarifa[]))
    executar(railwayFaresMostExpensiveRoutesConsulta(nomeArquivo)).then(dados => configurarGraficoRotasCaras(dados as DadosRotaCara[]))
    executar(railwayFaresBusiestStationsConsulta(nomeArquivo)).then(dados => configurarGraficoEstacoesConectadas(dados as DadosEstacaoConectada[]))
    executar(railwayFaresChordConsulta(nomeArquivo)).then(dados => configurarGraficoChord(dados as DadosConexaoChord[]))
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
    temaGrafico,
    opcaoDistribuicaoPreco,
    opcaoRotasCaras,
    configuracaoGraficoEstacoesConectadas,
    configuracaoGraficoChord,
    fmtNumero,
    fmtPreco
  }
}
