import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosDistancia,
  DadosHora,
  DadosPassageiros,
  DadosValor,
  DadosVendor,
  KpisTaxiNYCLocal
} from '~/types/taxi-nyc.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

export const useTaxiNYCLocal = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisTaxiNYCLocal>({
    total_trips: 0,
    avg_distance: 0,
    avg_amount: 0,
    total_revenue: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const configuracaoGraficoVendor = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoPassageiros = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDistancia = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoValor = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoHora = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoVendor = (data: DadosVendor[]) => {
    configuracaoGraficoVendor.value = montarRosca(
      data.map(d => ({ nome: d.vendor, valor: d.total })),
      'Corridas'
    )
  }

  const configurarGraficoPassageiros = (data: DadosPassageiros[]) => {
    configuracaoGraficoPassageiros.value = montarGrafico({
      rotulos: data.map(d => `${d.passageiros} pax`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
  }

  const configurarGraficoDistancia = (data: DadosDistancia[]) => {
    configuracaoGraficoDistancia.value = montarGrafico({
      rotulos: data.map(d => `${d.milhas}mi`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_TERCIARIA }]
    })
  }

  const configurarGraficoValor = (data: DadosValor[]) => {
    configuracaoGraficoValor.value = montarGrafico({
      rotulos: data.map(d => `$${d.faixa}`),
      series: [{ nome: 'Corridas', valores: data.map(d => d.total), cor: COR_QUATERNARIA }]
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

    const url = taxiNYCLocalUrl
    const nomeArquivo = await registrarParquet(url)

    executar(localNYCTaxiKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisTaxiNYCLocal
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(localNYCTaxiVendorConsulta(nomeArquivo)).then(dados => configurarGraficoVendor(dados as DadosVendor[]))
    executar(localNYCTaxiPassageirosConsulta(nomeArquivo)).then(dados =>
      configurarGraficoPassageiros(dados as DadosPassageiros[])
    )
    executar(localNYCTaxiDistanciaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDistancia(dados as DadosDistancia[])
    )
    executar(localNYCTaxiValorConsulta(nomeArquivo)).then(dados => configurarGraficoValor(dados as DadosValor[]))
    executar(localNYCTaxiHoraConsulta(nomeArquivo))
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

  return {
    carregandoKpis,
    erro,
    kpis,
    configuracaoGraficoVendor,
    configuracaoGraficoPassageiros,
    configuracaoGraficoDistancia,
    configuracaoGraficoValor,
    configuracaoGraficoHora,
    fmtNumero,
    fmtDolar,
    fmtDolarDecimal
  }
}
