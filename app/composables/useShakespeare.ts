import type {
  DadosPorAto,
  DadosPorComprimento,
  DadosPorElenco,
  DadosPorPeca,
  DadosPorPersonagem,
  KpisShakespeare
} from '~/types/shakespeare.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'
const PALETA = [
  COR_PRIMARIA,
  COR_SECUNDARIA,
  COR_TERCIARIA,
  COR_QUATERNARIA,
  '#f43f5e',
  '#14b8a6'
]

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 16, right: 24, bottom: 8, left: 8 },
  tooltip: { trigger: 'axis' as const }
}
// grid: { top: 16, right: 24, bottom: 8, left: 8 },

export const useShakespeare = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(() => colorMode.value === 'dark' ? 'dark' : '')

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisShakespeare>({
    total_lines: 0,
    total_plays: 0,
    total_speakers: 0,
    avg_words_per_line: 0
  })

  const opcaoPecas = ref<Record<string, unknown> | null>(null)
  const opcaoPersonagens = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoAto = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoElenco = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoComprimento = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoPecas = (data: DadosPorPeca[]) => {
    const pecas = data.map(d => d.peca).reverse()
    const totais = data.map(d => d.total).reverse()
    opcaoPecas.value = {
      ...configuracaoGrafico,
      color: [COR_PRIMARIA],
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: { type: 'category', data: pecas, axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: totais, name: 'Linhas' }]
    }
  }

  const configurarGraficoPersonagens = (data: DadosPorPersonagem[]) => {
    const personagens = data.map(d => d.personagem).reverse()
    const totais = data.map(d => d.total).reverse()
    opcaoPersonagens.value = {
      backgroundColor: 'transparent',
      color: [COR_SECUNDARIA],
      tooltip: { trigger: 'axis' },
      grid: {
        top: 16,
        right: 24,
        bottom: 8,
        left: 8
      },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'category',
        data: personagens,
        axisLabel: { fontSize: 10 }
      },
      series: [{ type: 'bar', data: totais, name: 'Falas' }]
    }
  }

  const configurarGraficoAto = (data: DadosPorAto[]) => {
    const atos = data.map(d => `Ato ${d.ato}`)
    const totais = data.map(d => d.total)
    configuracaoGraficoAto.value = {
      backgroundColor: 'transparent',
      color: [COR_TERCIARIA],
      tooltip: { trigger: 'axis' },
      grid: {
        top: 16,
        right: 16,
        bottom: 32,
        left: 56
      },
      xAxis: {
        type: 'category',
        data: atos,
        axisLabel: { fontSize: 11 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: totais, name: 'Linhas' }]
    }
  }

  const configurarGraficoElenco = (data: DadosPorElenco[]) => {
    const pecas = data.map(d => d.peca).reverse()
    const totais = data.map(d => d.personagens).reverse()
    configuracaoGraficoElenco.value = {
      backgroundColor: 'transparent',
      color: [COR_QUATERNARIA],
      tooltip: { trigger: 'axis' },
      grid: {
        top: 16,
        right: 24,
        bottom: 8,
        left: 8
      },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'category',
        data: pecas,
        axisLabel: { fontSize: 10 }
      },
      series: [{ type: 'bar', data: totais, name: 'Personagens' }]
    }
  }

  const configurarGraficoComprimento = (data: DadosPorComprimento[]) => {
    const labels = data.map(d => `${d.faixa}–${d.faixa + 19}`)
    const totais = data.map(d => d.total)
    configuracaoGraficoComprimento.value = {
      backgroundColor: 'transparent',
      color: [PALETA[4]],
      tooltip: { trigger: 'axis' },
      grid: {
        top: 16,
        right: 16,
        bottom: 48,
        left: 56
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { fontSize: 9, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: totais, name: 'Linhas' }]
    }
  }

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = shakespeareUrl
    const nomeArquivo = await registrarParquet(url)

    executar(shakespeareKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        if (kpisData) kpis.value = kpisData as KpisShakespeare
      }).catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(shakespearePecasConsulta(nomeArquivo)).then(dados => configurarGraficoPecas(dados as DadosPorPeca[]))
    executar(shakespearePersonagensConsulta(nomeArquivo)).then(dados =>
      configurarGraficoPersonagens(dados as DadosPorPersonagem[])
    )
    executar(shakespeareAtoConsulta(nomeArquivo)).then(dados => configurarGraficoAto(dados as DadosPorAto[]))
    executar(shakespeareElencoConsulta(nomeArquivo)).then(dados => configurarGraficoElenco(dados as DadosPorElenco[]))
    executar(shakespeareComprimentoConsulta(nomeArquivo)).then(dados =>
      configurarGraficoComprimento(dados as DadosPorComprimento[])
    )
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtDecimal = (n: number) =>
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(n)

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoPecas,
    opcaoPersonagens,
    configuracaoGraficoAto,
    configuracaoGraficoElenco,
    configuracaoGraficoComprimento,
    fmtNumero,
    fmtDecimal
  }
}
