import type { ConfiguracaoGrafico } from '~/types/grafico.types'
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

// grid: { top: 16, right: 24, bottom: 8, left: 8 },

export const useShakespeare = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisShakespeare>({
    total_lines: 0,
    total_plays: 0,
    total_speakers: 0,
    avg_words_per_line: 0
  })

  const opcaoPecas = ref<ConfiguracaoGrafico | null>(null)
  const opcaoPersonagens = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoAto = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoElenco = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoComprimento = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoPecas = (data: DadosPorPeca[]) => {
    opcaoPecas.value = montarGrafico({
      rotulos: data.map(d => d.peca),
      series: [{ nome: 'Linhas', valores: data.map(d => d.total), cor: COR_PRIMARIA }]
    })
  }
  const configurarGraficoPersonagens = (data: DadosPorPersonagem[]) => {
    opcaoPersonagens.value = montarGrafico({
      rotulos: data.map(d => d.personagem),
      series: [{ nome: 'Falas', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
  }
  const configurarGraficoAto = (data: DadosPorAto[]) => {
    configuracaoGraficoAto.value = montarGrafico({
      rotulos: data.map(d => `Ato ${d.ato}`),
      series: [{ nome: 'Linhas', valores: data.map(d => d.total), cor: COR_TERCIARIA }]
    })
  }
  const configurarGraficoElenco = (data: DadosPorElenco[]) => {
    configuracaoGraficoElenco.value = montarGrafico({
      rotulos: data.map(d => d.peca),
      series: [{ nome: 'Personagens', valores: data.map(d => d.personagens), cor: COR_QUATERNARIA }]
    })
  }
  const configurarGraficoComprimento = (data: DadosPorComprimento[]) => {
    configuracaoGraficoComprimento.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa}–${d.faixa + 19}`),
      series: [{ nome: 'Linhas', valores: data.map(d => d.total), cor: PALETA[4] }]
    })
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
    opcaoPecas,
    opcaoPersonagens,
    configuracaoGraficoAto,
    configuracaoGraficoElenco,
    configuracaoGraficoComprimento,
    fmtNumero,
    fmtDecimal
  }
}
