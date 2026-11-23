import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosPorCategoriaNsfw,
  DadosPorDimensao,
  DadosPorFaixaSteps,
  DadosPorHoraAtividade,
  DadosPorSampler,
  KpisDiffusionDB
} from '~/types/diffusion-db.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

const PALETA_NSFW = ['#10b981', '#f59e0b', '#f97316', '#f43f5e']

export const useDiffusionDB = () => {
  const { executar, init, registrarParquet } = useDuckDb()

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

  const configuracaoGraficoDimensoes = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoNsfw = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoSteps = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoSampler = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoAtividade = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoDimensoes = (data: DadosPorDimensao[]) => {
    configuracaoGraficoDimensoes.value = montarGrafico({
      rotulos: data.map(d => d.dimensao),
      series: [{ nome: 'Imagens', valores: data.map(d => d.total), cor: COR_PRIMARIA }]
    })
  }
  const configurarGraficoNsfw = (data: DadosPorCategoriaNsfw[]) => {
    configuracaoGraficoNsfw.value = montarRosca(
      data.map((d, i) => ({ nome: d.categoria, valor: d.total, cor: PALETA_NSFW[i % PALETA_NSFW.length] })),
      'Imagens'
    )
  }
  const configurarGraficoSteps = (data: DadosPorFaixaSteps[]) => {
    configuracaoGraficoSteps.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_inicio}–${d.faixa_inicio + 9}`),
      series: [{ nome: 'Imagens', valores: data.map(d => d.total), cor: COR_TERCIARIA }]
    })
  }
  const configurarGraficoSampler = (data: DadosPorSampler[]) => {
    configuracaoGraficoSampler.value = montarGrafico({
      rotulos: data.map(d => d.nome_sampler),
      series: [{ nome: 'Imagens', valores: data.map(d => d.total), cor: COR_QUATERNARIA }]
    })
  }
  const configurarGraficoAtividadeHoraria = (data: DadosPorHoraAtividade[]) => {
    configuracaoGraficoAtividade.value = montarGrafico({
      rotulos: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
      series: [{ nome: 'Imagens', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
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

    executar(diffusionDBDimensoesConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDimensoes(dados as DadosPorDimensao[])
    )
    executar(diffusionDBNsfwConsulta(nomeArquivo)).then(dados =>
      configurarGraficoNsfw(dados as DadosPorCategoriaNsfw[])
    )
    executar(diffusionDBStepsConsulta(nomeArquivo)).then(dados => configurarGraficoSteps(dados as DadosPorFaixaSteps[]))
    executar(diffusionDBSamplerConsulta(nomeArquivo)).then(dados =>
      configurarGraficoSampler(dados as DadosPorSampler[])
    )
    executar(diffusionDBAtividadeHorariaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoAtividadeHoraria(dados as DadosPorHoraAtividade[])
    )
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
