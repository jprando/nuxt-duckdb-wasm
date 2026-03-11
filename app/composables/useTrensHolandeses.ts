interface Kpis {
  total_services: number
  total_stations: number
  total_trains: number
  periodo_inicio: string
  periodo_fim: string
}

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, '#f43f5e', '#14b8a6']

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: 'axis' as const }
}

type DadosPorTipoServico = { type: string, total: number }
type DadosEstacaoMovimentada = { station_name: string, count: number }
type DadosPartidaPorHora = { hora: number, total: number }
type DadosDuracaoMediaParada = { station_name: string, avg_stop_seconds: number }

export const useTrensHolandeses = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(() => (colorMode.value === 'dark' ? 'dark' : ''))

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<Kpis>({
    total_services: 0,
    total_stations: 0,
    total_trains: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const opcaoTipo = ref<Record<string, unknown> | null>(null)
  const opcaoEstacoesMovimentadas = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoPartidasPorHora = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoDuracaoMediaParada = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoTipo = (data: DadosPorTipoServico[]) => {
    opcaoTipo.value = {
      backgroundColor: 'transparent',
      color: PALETA,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '42%'],
          data: data.map(d => ({ name: d.type, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: 'bold' } }
        }
      ]
    }
  }

  const configurarGraficoEstacoesMovimentadas = (data: DadosEstacaoMovimentada[]) => {
    const stationLabels = data.map(d => d.station_name)
    const stationValues = data.map(d => d.count)
    opcaoEstacoesMovimentadas.value = {
      ...configuracaoGrafico,
      color: [COR_SECUNDARIA],
      xAxis: { type: 'category', data: stationLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: stationValues, name: 'Eventos' }]
    }
  }

  const configurarGraficoPartidasPorHora = (data: DadosPartidaPorHora[]) => {
    const hourLabels = data.map(d => `${String(d.hora).padStart(2, '0')}h`)
    const hourValues = data.map(d => d.total)
    configuracaoGraficoPartidasPorHora.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: 'category', data: hourLabels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        {
          type: 'line',
          data: hourValues,
          name: 'Partidas',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: { opacity: 0.15 }
        }
      ]
    }
  }

  const configurarGraficoDuracaoMediaParada = (data: DadosDuracaoMediaParada[]) => {
    const stopLabels = data.map(d => d.station_name)
    const stopValues = data.map(d => d.avg_stop_seconds)
    configuracaoGraficoDuracaoMediaParada.value = {
      ...configuracaoGrafico,
      color: [COR_TERCIARIA],
      xAxis: { type: 'category', data: stopLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: '{value}s' } },
      series: [{ type: 'bar', data: stopValues, name: 'Duração Média (s)' }]
    }
  }

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = trensHolandesUrl
    const nomeArquivo = await registrarParquet(url)

    executar(dutchTrainServicesKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        kpis.value = kpisData as unknown as Kpis
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(dutchTrainServicesTypeConsulta(nomeArquivo)).then(data =>
      configurarGraficoTipo(data as DadosPorTipoServico[])
    )
    executar(dutchTrainServicesBusiestStationsConsulta(nomeArquivo)).then(data =>
      configurarGraficoEstacoesMovimentadas(data as DadosEstacaoMovimentada[])
    )
    executar(dutchTrainServicesDeparturesByHourConsulta(nomeArquivo)).then(data =>
      configurarGraficoPartidasPorHora(data as DadosPartidaPorHora[])
    )
    executar(dutchTrainServicesAvgStopDurationConsulta(nomeArquivo)).then(data =>
      configurarGraficoDuracaoMediaParada(data as DadosDuracaoMediaParada[])
    )
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoTipo,
    opcaoEstacoesMovimentadas,
    configuracaoGraficoPartidasPorHora,
    configuracaoGraficoDuracaoMediaParada,
    fmtNumero
  }
}
