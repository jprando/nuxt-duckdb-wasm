import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosDuracao,
  DadosGorjeta,
  DadosHora,
  DadosPagamento,
  DadosTarifa,
  KpisTaxiNYC
} from '~/types/taxi-nyc.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'

export const useTaxiNYCAbril2019 = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisTaxiNYC>({
    total_trips: 0,
    avg_duration_min: 0,
    avg_tip: 0,
    total_revenue: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const opcaoTarifa = ref<ConfiguracaoGrafico | null>(null)
  const opcaoPagamento = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDuracao = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoGorjeta = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoHora = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoTarifa = (data: DadosTarifa[]) => {
    opcaoTarifa.value = montarRosca(
      data.map(d => ({ nome: d.tarifa, valor: d.total })),
      'Corridas'
    )
  }

  const configurarGraficoPagamento = (data: DadosPagamento[]) => {
    opcaoPagamento.value = montarRosca(
      data.map(d => ({ nome: d.pagamento, valor: d.total })),
      'Corridas'
    )
  }

  const configurarGraficoDuracao = (data: DadosDuracao[]) => {
    configuracaoGraficoDuracao.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_min}min`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
  }

  const configurarGraficoGorjeta = (data: DadosGorjeta[]) => {
    configuracaoGraficoGorjeta.value = montarGrafico({
      rotulos: data.map(d => `$${d.faixa}`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_TERCIARIA }]
    })
  }

  const configurarGraficoHora = (data: DadosHora[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHora.value = graficoVazio()
      return
    }
    configuracaoGraficoHora.value = montarGrafico({
      tipo: 'area',
      rotulos: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_PRIMARIA }],
      curva: 'monotone',
      pontos: true
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = taxiNYCAbril2019Url
    const nomeArquivo = await registrarParquet(url)

    executar(nycTaxi2019AprKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisTaxiNYC
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(nycTaxi2019AprTarifaConsulta(nomeArquivo)).then(dados => configurarGraficoTarifa(dados as DadosTarifa[]))
    executar(nycTaxi2019AprPagamentoConsulta(nomeArquivo)).then(dados =>
      configurarGraficoPagamento(dados as DadosPagamento[])
    )
    executar(nycTaxi2019AprDuracaoConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDuracao(dados as DadosDuracao[])
    )
    executar(nycTaxi2019AprGorjetaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoGorjeta(dados as DadosGorjeta[])
    )
    executar(nycTaxi2019AprHoraConsulta(nomeArquivo))
      .then(dados => configurarGraficoHora(dados as DadosHora[]))
      .catch(() => {
        configuracaoGraficoHora.value = graficoVazio()
      })
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtDolar = (n: number) => dolarSemCasaDecimal.format(n)
  const fmtDolarDecimal = (n: number) => dolarComDuasCasas.format(n)
  const fmtMin = (n: number) => `${n} min`

  return {
    carregandoKpis,
    erro,
    kpis,
    opcaoTarifa,
    opcaoPagamento,
    configuracaoGraficoDuracao,
    configuracaoGraficoGorjeta,
    configuracaoGraficoHora,
    fmtNumero,
    fmtDolar,
    fmtDolarDecimal,
    fmtMin
  }
}
