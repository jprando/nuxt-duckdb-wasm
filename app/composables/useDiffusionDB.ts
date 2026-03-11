import type {
  KpisDiffusionDB,
  DadosPorDimensao,
  DadosPorCategoriaNsfw,
  DadosPorFaixaSteps,
  DadosPorSampler,
  DadosPorHoraAtividade
} from '~/types/diffusion-db.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

const PALETA_NSFW = ['#10b981', '#f59e0b', '#f97316', '#f43f5e']

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 72 },
  tooltip: { trigger: 'axis' as const }
}

export const useDiffusionDB = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(() => colorMode.value === 'dark' ? 'dark' : '')

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisDiffusionDB>({
    total_imagens: 0,
    total_usuarios: 0,
    pct_nsfw: 0,
    steps_medio: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const configuracaoGraficoDimensoes = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoNsfw = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoSteps = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoSampler = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoAtividade = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoDimensoes = (data: DadosPorDimensao[]) => {
    const labels = data.map(d => d.dimensao).reverse()
    const values = data.map(d => d.total).reverse()
    configuracaoGraficoDimensoes.value = {
      ...configuracaoGrafico,
      color: [COR_PRIMARIA],
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: { type: 'category', data: labels, axisLabel: { fontSize: 10, fontWeight: 'bold' } },
      series: [{ type: 'bar', data: values, name: 'Imagens' }]
    }
  }

  const configurarGraficoNsfw = (data: DadosPorCategoriaNsfw[]) => {
    configuracaoGraficoNsfw.value = {
      backgroundColor: 'transparent',
      color: PALETA_NSFW,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, type: 'scroll', textStyle: { fontSize: 10 } },
      series: [
        {
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '42%'],
          data: data.map(d => ({ name: d.categoria, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: 'bold' } }
        }
      ]
    }
  }

  const configurarGraficoSteps = (data: DadosPorFaixaSteps[]) => {
    configuracaoGraficoSteps.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 56 },
      color: [COR_TERCIARIA],
      xAxis: {
        type: 'category',
        data: data.map(d => `${d.faixa_inicio}–${d.faixa_inicio + 9}`),
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: data.map(d => d.total), name: 'Imagens' }]
    }
  }

  const configurarGraficoSampler = (data: DadosPorSampler[]) => {
    const labels = data.map(d => d.nome_sampler).reverse()
    const values = data.map(d => d.total).reverse()
    configuracaoGraficoSampler.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 8, left: 72 },
      color: [COR_QUATERNARIA],
      tooltip: { trigger: 'axis' as const },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: { type: 'category', data: labels, axisLabel: { fontSize: 10, fontWeight: 'bold' } },
      series: [{ type: 'bar', data: values, name: 'Imagens' }]
    }
  }

  const configurarGraficoAtividadeHoraria = (data: DadosPorHoraAtividade[]) => {
    configuracaoGraficoAtividade.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 72 },
      color: [COR_SECUNDARIA],
      xAxis: {
        type: 'category',
        data: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
        axisLabel: { fontSize: 10 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: data.map(d => d.total), name: 'Imagens' }]
    }
  }

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = diffusionDBUrl
    const nomeArquivo = await registrarParquet(url)

    executar(diffusionDBKpisConsulta(nomeArquivo))
      .then(([row]) => {
        if (row) kpis.value = row as KpisDiffusionDB
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(diffusionDBDimensoesConsulta(nomeArquivo)).then(dados => configurarGraficoDimensoes(dados as DadosPorDimensao[]))
    executar(diffusionDBNsfwConsulta(nomeArquivo)).then(dados => configurarGraficoNsfw(dados as DadosPorCategoriaNsfw[]))
    executar(diffusionDBStepsConsulta(nomeArquivo)).then(dados => configurarGraficoSteps(dados as DadosPorFaixaSteps[]))
    executar(diffusionDBSamplerConsulta(nomeArquivo)).then(dados => configurarGraficoSampler(dados as DadosPorSampler[]))
    executar(diffusionDBAtividadeHorariaConsulta(nomeArquivo)).then(dados => configurarGraficoAtividadeHoraria(dados as DadosPorHoraAtividade[]))
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtDecimal = (n: number) =>
    new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)
  const fmtData = (s: string) => s ? s.slice(0, 10) : '—'

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    configuracaoGraficoDimensoes,
    configuracaoGraficoNsfw,
    configuracaoGraficoSteps,
    configuracaoGraficoSampler,
    configuracaoGraficoAtividade,
    fmtNumero,
    fmtDecimal,
    fmtData
  }
}
