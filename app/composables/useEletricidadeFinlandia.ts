import type {
  DadosCalendario,
  DadosDistribuicaoPreco,
  DadosPrecoHorario,
  DadosPrecoMensal,
  DadosPrecoSemanal,
  KpisEletricidadeFinlandia,
  ParametroTooltipCalendario
} from '~/types/eletricidade-finlandia.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 64 },
  tooltip: { trigger: 'axis' as const }
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const useEletricidadeFinlandia = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(() => colorMode.value === 'dark' ? 'dark' : '')

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

  const configuracaoGraficoMensal = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoHoraria = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoSemanal = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoDistribuicao = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoCalendario = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoMensal = (data: DadosPrecoMensal[]) => {
    const labels = data.map(d => MESES[d.mes - 1])
    configuracaoGraficoMensal.value = {
      ...configuracaoGrafico,
      legend: { top: 4, textStyle: { fontSize: 10 } },
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, name: '€/MWh', nameTextStyle: { fontSize: 10 } },
      series: [
        {
          type: 'bar',
          name: 'Médio',
          data: data.map(d => d.preco_medio),
          itemStyle: { color: COR_PRIMARIA }
        },
        {
          type: 'line',
          name: 'Máximo',
          data: data.map(d => d.preco_max),
          itemStyle: { color: COR_TERCIARIA },
          lineStyle: { width: 2 }
        },
        {
          type: 'line',
          name: 'Mínimo',
          data: data.map(d => d.preco_min),
          itemStyle: { color: COR_SECUNDARIA },
          lineStyle: { width: 2 }
        }
      ]
    }
  }

  const configurarGraficoHoraria = (data: DadosPrecoHorario[]) => {
    configuracaoGraficoHoraria.value = {
      ...configuracaoGrafico,
      color: [COR_QUATERNARIA],
      xAxis: {
        type: 'category',
        data: data.map(d => `${String(d.hora).padStart(2, '0')}h`),
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        name: '€/MWh',
        nameTextStyle: { fontSize: 10 }
      },
      series: [{ type: 'bar', data: data.map(d => d.preco_medio), name: 'Preço Médio' }]
    }
  }

  const configurarGraficoSemanal = (data: DadosPrecoSemanal[]) => {
    configuracaoGraficoSemanal.value = {
      backgroundColor: 'transparent',
      grid: { top: 40, right: 16, bottom: 32, left: 64 },
      legend: { top: 4, textStyle: { fontSize: 10 } },
      tooltip: { trigger: 'axis' as const },
      xAxis: {
        type: 'category',
        data: data.map(d => d.semana),
        axisLabel: { fontSize: 8, rotate: 45, interval: 3 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        name: '€/MWh',
        nameTextStyle: { fontSize: 10 }
      },
      series: [
        {
          type: 'line',
          name: 'Médio',
          data: data.map(d => d.preco_medio),
          smooth: true,
          itemStyle: { color: COR_PRIMARIA },
          lineStyle: { width: 2 },
          areaStyle: { color: `${COR_PRIMARIA}33` }
        },
        {
          type: 'line',
          name: 'Máximo',
          data: data.map(d => d.preco_max),
          smooth: true,
          itemStyle: { color: COR_TERCIARIA },
          lineStyle: { width: 1.5, type: 'dashed' as const }
        }
      ]
    }
  }

  const configurarGraficoDistribuicao = (data: DadosDistribuicaoPreco[]) => {
    configuracaoGraficoDistribuicao.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 56, left: 64 },
      color: [COR_SECUNDARIA],
      xAxis: {
        type: 'category',
        data: data.map(d => `${d.faixa_inicio}–${d.faixa_inicio + 20}`),
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: data.map(d => d.total), name: 'Horas' }]
    }
  }

  const configurarGraficoCalendario = (data: DadosCalendario[]) => {
    const valores = data.map(d => d.preco_medio)
    const minVal = Math.min(...valores)
    const maxVal = Math.max(...valores)
    configuracaoGraficoCalendario.value = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p: ParametroTooltipCalendario) => `${p.value[0]}<br/>€${p.value[1]}/MWh`
      },
      visualMap: {
        min: minVal,
        max: maxVal,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 4,
        itemWidth: 12,
        itemHeight: 120,
        textStyle: { fontSize: 10 },
        inRange: { color: ['#3b82f6', '#f59e0b', '#f43f5e'] }
      },
      calendar: {
        range: '2021',
        top: 56,
        left: 36,
        right: 8,
        bottom: 8,
        cellSize: ['auto', 14],
        itemStyle: { borderWidth: 0.5 },
        dayLabel: { show: true, fontSize: 9, firstDay: 1 },
        monthLabel: { show: true, fontSize: 10 },
        yearLabel: { show: false }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data.map(d => [d.dia, d.preco_medio])
      }]
    }
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
    executar(eletricidadeFinlandiaCalendarioConsulta(nomeArquivo)).then(dados =>
      configurarGraficoCalendario(dados as DadosCalendario[])
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
    temaGrafico,
    configuracaoGraficoMensal,
    configuracaoGraficoHoraria,
    configuracaoGraficoSemanal,
    configuracaoGraficoDistribuicao,
    configuracaoGraficoCalendario,
    fmtNumero,
    fmtEuro
  }
}
