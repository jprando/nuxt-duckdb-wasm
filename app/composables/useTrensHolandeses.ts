import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosDuracaoMediaParada,
  DadosEstacaoMovimentada,
  DadosPartidaPorHora,
  DadosPorTipoServico,
  KpisTrensHolandeses
} from '~/types/trens-holandeses.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'

export const useTrensHolandeses = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisTrensHolandeses>({
    total_services: 0,
    total_stations: 0,
    total_trains: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const opcaoTipo = ref<ConfiguracaoGrafico | null>(null)
  const opcaoEstacoesMovimentadas = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoPartidasPorHora = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDuracaoMediaParada = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoTipo = (data: DadosPorTipoServico[]) => {
    opcaoTipo.value = montarRosca(
      data.map(d => ({ nome: d.type, valor: d.total })),
      'Eventos'
    )
  }

  const configurarGraficoEstacoesMovimentadas = (data: DadosEstacaoMovimentada[]) => {
    opcaoEstacoesMovimentadas.value = montarGrafico({
      rotulos: data.map(d => d.station_name),
      series: [{ nome: 'Eventos', valores: data.map(d => d.count), cor: COR_SECUNDARIA }]
    })
  }

  const configurarGraficoPartidasPorHora = (data: DadosPartidaPorHora[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoPartidasPorHora.value = graficoVazio()
      return
    }
    configuracaoGraficoPartidasPorHora.value = montarGrafico({
      tipo: 'area',
      rotulos: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
      series: [{ nome: 'Partidas', valores: data.map(d => d.total), cor: COR_PRIMARIA }],
      curva: 'monotone',
      pontos: true
    })
  }

  const configurarGraficoDuracaoMediaParada = (data: DadosDuracaoMediaParada[]) => {
    configuracaoGraficoDuracaoMediaParada.value = montarGrafico({
      rotulos: data.map(d => d.station_name),
      series: [{ nome: 'Duração Média (s)', valores: data.map(d => d.avg_stop_seconds), cor: COR_TERCIARIA }],
      rotuloY: 's'
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = trensHolandesUrl
    const nomeArquivo = await registrarParquet(url)

    executar(dutchTrainServicesKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisTrensHolandeses
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(dutchTrainServicesTypeConsulta(nomeArquivo)).then(dados =>
      configurarGraficoTipo(dados as DadosPorTipoServico[])
    )
    executar(dutchTrainServicesBusiestStationsConsulta(nomeArquivo)).then(dados =>
      configurarGraficoEstacoesMovimentadas(dados as DadosEstacaoMovimentada[])
    )
    executar(dutchTrainServicesDeparturesByHourConsulta(nomeArquivo)).then(dados =>
      configurarGraficoPartidasPorHora(dados as DadosPartidaPorHora[])
    )
    executar(dutchTrainServicesAvgStopDurationConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDuracaoMediaParada(dados as DadosDuracaoMediaParada[])
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
    opcaoTipo,
    opcaoEstacoesMovimentadas,
    configuracaoGraficoPartidasPorHora,
    configuracaoGraficoDuracaoMediaParada,
    fmtNumero
  }
}
