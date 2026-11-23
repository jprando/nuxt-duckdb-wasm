import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  KpisPontualidadeVoos,
  LinhaAtrasoPorDiaSemana,
  LinhaAtrasoPorHoraPartida,
  LinhaContagemMensal,
  LinhaContagemPorAeroportoOrigem,
  LinhaContagemPorCompanhia,
  LinhaContagemPorFaixaAtraso,
  LinhaContagemPorGrupoDistancia,
  LinhaContagemPorStatus,
  LinhaTaxaCancelamentoPorCompanhia
} from '~/types/pontualidade-voos.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const DIST_LABELS = [
  '<250mi',
  '250-499',
  '500-749',
  '750-999',
  '1000-1249',
  '1250-1499',
  '1500-1749',
  '1750-1999',
  '2000-2249',
  '2250-2499',
  '2500+mi'
]

export const usePontualidadeVoos = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisPontualidadeVoos>({
    total_voos: 0,
    distancia_media: 0,
    atraso_medio_partida: 0,
    atraso_medio_chegada: 0,
    taxa_cancelamento: 0,
    pct_pontuais: 0
  })

  const opcaoCompanhias = ref<ConfiguracaoGrafico | null>(null)
  const opcaoStatus = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDiaSemana = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoMensal = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoAtrasoPartida = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDistancia = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoAeroportos = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoCancelamentos = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoHoraPartida = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoCompanhias = (data: LinhaContagemPorCompanhia[]) => {
    opcaoCompanhias.value = montarGrafico({
      rotulos: data.map(d => d.carrier),
      series: [{ nome: 'Voos', valores: data.map(d => d.total), cor: COR_PRIMARIA }]
    })
  }
  const configurarGraficoStatus = (data: LinhaContagemPorStatus[]) => {
    const cores = [COR_SECUNDARIA, COR_TERCIARIA, '#f43f5e', COR_QUATERNARIA]
    opcaoStatus.value = montarRosca(
      data.map((d, i) => ({ nome: d.status, valor: d.total, cor: cores[i % cores.length] })),
      'Voos'
    )
  }
  const configurarGraficoDiaSemana = (data: LinhaAtrasoPorDiaSemana[]) => {
    configuracaoGraficoDiaSemana.value = montarGrafico({
      rotulos: data.map(d => DIAS_SEMANA[d.dayofweek - 1] ?? `D${d.dayofweek}`),
      series: [{ nome: 'Atraso Médio (min)', valores: data.map(d => d.atraso_medio ?? 0), cor: COR_TERCIARIA }],
      rotuloY: 'min'
    })
  }
  const configurarGraficoMensal = (data: LinhaContagemMensal[]) => {
    configuracaoGraficoMensal.value = montarGrafico({
      tipo: 'area',
      rotulos: data.map(d => MESES[d.month - 1] ?? `M${d.month}`),
      series: [{ nome: 'Voos', valores: data.map(d => d.total), cor: COR_PRIMARIA }],
      curva: 'monotone',
      pontos: true
    })
  }
  const configurarGraficoAtrasoPartida = (data: LinhaContagemPorFaixaAtraso[]) => {
    configuracaoGraficoAtrasoPartida.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_min}min`),
      series: [{ nome: 'Voos', valores: data.map(d => d.total), cor: '#f43f5e' }]
    })
  }
  const configurarGraficoDistancia = (data: LinhaContagemPorGrupoDistancia[]) => {
    configuracaoGraficoDistancia.value = montarGrafico({
      rotulos: data.map(d => DIST_LABELS[d.distancegroup - 1] ?? `G${d.distancegroup}`),
      series: [{ nome: 'Voos', valores: data.map(d => d.total), cor: COR_QUATERNARIA }]
    })
  }
  const configurarGraficoAeroportos = (data: LinhaContagemPorAeroportoOrigem[]) => {
    configuracaoGraficoAeroportos.value = montarGrafico({
      rotulos: data.map(d => d.origin),
      series: [{ nome: 'Voos', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
  }
  const configurarGraficoCancelamentos = (data: LinhaTaxaCancelamentoPorCompanhia[]) => {
    configuracaoGraficoCancelamentos.value = montarGrafico({
      rotulos: data.map(d => d.carrier),
      series: [{ nome: 'Taxa Cancelamento (%)', valores: data.map(d => d.taxa_cancelamento), cor: '#f43f5e' }],
      rotuloY: '%'
    })
  }
  const configurarGraficoHoraPartida = (data: LinhaAtrasoPorHoraPartida[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHoraPartida.value = graficoVazio()
      return
    }
    configuracaoGraficoHoraPartida.value = montarGrafico({
      tipo: 'area',
      rotulos: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
      series: [{ nome: 'Atraso Médio (min)', valores: data.map(d => d.atraso_medio ?? 0), cor: COR_PRIMARIA }],
      curva: 'monotone',
      pontos: true,
      rotuloY: 'min'
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = pontualidadeVoosUrl
    const nomeArquivo = await registrarParquet(url)

    executar(ontimeKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisPontualidadeVoos
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(ontimeCompanhiasConsulta(nomeArquivo)).then(dados =>
      configurarGraficoCompanhias(dados as LinhaContagemPorCompanhia[])
    )
    executar(ontimeStatusConsulta(nomeArquivo)).then(dados =>
      configurarGraficoStatus(dados as LinhaContagemPorStatus[])
    )
    executar(ontimeDiaSemanaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDiaSemana(dados as LinhaAtrasoPorDiaSemana[])
    )
    executar(ontimeMensalConsulta(nomeArquivo)).then(dados => configurarGraficoMensal(dados as LinhaContagemMensal[]))
    executar(ontimeAtrasoPartidaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoAtrasoPartida(dados as LinhaContagemPorFaixaAtraso[])
    )
    executar(ontimeDistanciaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDistancia(dados as LinhaContagemPorGrupoDistancia[])
    )
    executar(ontimeAeroportosConsulta(nomeArquivo)).then(dados =>
      configurarGraficoAeroportos(dados as LinhaContagemPorAeroportoOrigem[])
    )
    executar(ontimeCancelamentosConsulta(nomeArquivo)).then(dados =>
      configurarGraficoCancelamentos(dados as LinhaTaxaCancelamentoPorCompanhia[])
    )
    executar(ontimeHoraPartidaConsulta(nomeArquivo))
      .then(dados => configurarGraficoHoraPartida(dados as LinhaAtrasoPorHoraPartida[]))
      .catch(() => {
        configuracaoGraficoHoraPartida.value = graficoVazio()
      })
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtMin = (n: number) => `${n} min`
  const fmtPct = (n: number) => `${n.toFixed(1)}%`
  const fmtMi = (n: number) => `${numeroSemCasaDecimal.format(n)} mi`

  return {
    carregandoKpis,
    erro,
    kpis,
    opcaoCompanhias,
    opcaoStatus,
    configuracaoGraficoDiaSemana,
    configuracaoGraficoMensal,
    configuracaoGraficoAtrasoPartida,
    configuracaoGraficoDistancia,
    configuracaoGraficoAeroportos,
    configuracaoGraficoCancelamentos,
    configuracaoGraficoHoraPartida,
    fmtNumero,
    fmtMin,
    fmtPct,
    fmtMi
  }
}
