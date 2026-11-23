import type { ConfiguracaoGrafico } from '~/types/grafico.types'
import type {
  DadosDistribuicaoPreco,
  DadosPrecoHorario,
  DadosPrecoMensal,
  DadosPrecoSemanal,
  KpisEletricidadeFinlandia
} from '~/types/eletricidade-finlandia.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const useEletricidadeFinlandia = () => {
  const { executar, init, registrarParquet } = useDuckDb()

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<KpisEletricidadeFinlandia>({
    total_registros: 0,
    preco_medio: 0,
    preco_minimo: 0,
    preco_maximo: 0,
    desvio_padrao: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const configuracaoGraficoMensal = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoHoraria = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoSemanal = ref<ConfiguracaoGrafico | null>(null)
  const configuracaoGraficoDistribuicao = ref<ConfiguracaoGrafico | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────
  const configurarGraficoMensal = (data: DadosPrecoMensal[]) => {
    configuracaoGraficoMensal.value = montarGrafico({
      tipo: 'line',
      rotulos: data.map(d => MESES[d.mes - 1] ?? ''),
      series: [
        { nome: 'Médio', valores: data.map(d => d.preco_medio), cor: COR_PRIMARIA },
        { nome: 'Máximo', valores: data.map(d => d.preco_max), cor: COR_TERCIARIA }
      ],
      curva: 'monotone',
      rotuloY: '€/MWh'
    })
  }
  const configurarGraficoHoraria = (data: DadosPrecoHorario[]) => {
    configuracaoGraficoHoraria.value = montarGrafico({
      rotulos: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
      series: [{ nome: 'Preço Médio', valores: data.map(d => d.preco_medio), cor: COR_QUATERNARIA }],
      rotuloY: '€/MWh'
    })
  }
  const configurarGraficoSemanal = (data: DadosPrecoSemanal[]) => {
    configuracaoGraficoSemanal.value = montarGrafico({
      tipo: 'line',
      rotulos: data.map(d => d.semana),
      series: [
        { nome: 'Médio', valores: data.map(d => d.preco_medio), cor: COR_PRIMARIA },
        { nome: 'Máximo', valores: data.map(d => d.preco_max), cor: COR_TERCIARIA }
      ],
      curva: 'monotone',
      rotuloY: '€/MWh'
    })
  }
  const configurarGraficoDistribuicao = (data: DadosDistribuicaoPreco[]) => {
    configuracaoGraficoDistribuicao.value = montarGrafico({
      rotulos: data.map(d => `${d.faixa_inicio}–${d.faixa_inicio + 20}`),
      series: [{ nome: 'Horas', valores: data.map(d => d.total), cor: COR_SECUNDARIA }]
    })
  }
  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = eletricidadeFinlandiaUrl
    const nomeArquivo = await registrarParquet(url)

    executar(eletricidadeFinlandiaKpisConsulta(nomeArquivo))
      .then(([row]) => {
        if (row) kpis.value = row as KpisEletricidadeFinlandia
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(eletricidadeFinlandiaMensalConsulta(nomeArquivo)).then(dados =>
      configurarGraficoMensal(dados as DadosPrecoMensal[])
    )
    executar(eletricidadeFinlandiaHorariaConsulta(nomeArquivo)).then(dados =>
      configurarGraficoHoraria(dados as DadosPrecoHorario[])
    )
    executar(eletricidadeFinlandiaSemanaisConsulta(nomeArquivo)).then(dados =>
      configurarGraficoSemanal(dados as DadosPrecoSemanal[])
    )
    executar(eletricidadeFinlandiaDistribuicaoConsulta(nomeArquivo)).then(dados =>
      configurarGraficoDistribuicao(dados as DadosDistribuicaoPreco[])
    )
  }

  onMounted(async () => {
    await init()
    carregarDados()
  })

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n)
  const fmtEuro = (n: number) =>
    new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  return {
    carregandoKpis,
    erro,
    kpis,
    configuracaoGraficoMensal,
    configuracaoGraficoHoraria,
    configuracaoGraficoSemanal,
    configuracaoGraficoDistribuicao,
    fmtNumero,
    fmtEuro
  }
}
