interface Kpis {
  total_registros: number
  preco_medio: number
  preco_minimo: number
  preco_maximo: number
  desvio_padrao: number
  periodo_inicio: string
  periodo_fim: string
}

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

  const kpis = ref<Kpis>({
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

  const configurarGraficoMensal = (data: any[]) => {
    const rows = data as any[]
    const labels = rows.map(d => MESES[(d.mes as number) - 1])
    configuracaoGraficoMensal.value = {
      ...configuracaoGrafico,
      legend: { top: 4, textStyle: { fontSize: 10 } },
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, name: '€/MWh', nameTextStyle: { fontSize: 10 } },
      series: [
        {
          type: 'bar',
          name: 'Médio',
          data: rows.map(d => d.preco_medio),
          itemStyle: { color: COR_PRIMARIA }
        },
        {
          type: 'line',
          name: 'Máximo',
          data: rows.map(d => d.preco_max),
          itemStyle: { color: COR_TERCIARIA },
          lineStyle: { width: 2 }
        },
        {
          type: 'line',
          name: 'Mínimo',
          data: rows.map(d => d.preco_min),
          itemStyle: { color: COR_SECUNDARIA },
          lineStyle: { width: 2 }
        }
      ]
    }
  }

  const configurarGraficoHoraria = (data: any[]) => {
    const rows = data as any[]
    configuracaoGraficoHoraria.value = {
      ...configuracaoGrafico,
      color: [COR_QUATERNARIA],
      xAxis: {
        type: 'category',
        data: rows.map(d => `${String(d.hora as number).padStart(2, '0')}h`),
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        name: '€/MWh',
        nameTextStyle: { fontSize: 10 }
      },
      series: [{ type: 'bar', data: rows.map(d => d.preco_medio), name: 'Preço Médio' }]
    }
  }

  const configurarGraficoSemanal = (data: any[]) => {
    const rows = data as any[]
    configuracaoGraficoSemanal.value = {
      backgroundColor: 'transparent',
      grid: { top: 40, right: 16, bottom: 32, left: 64 },
      legend: { top: 4, textStyle: { fontSize: 10 } },
      tooltip: { trigger: 'axis' as const },
      xAxis: {
        type: 'category',
        data: rows.map(d => d.semana),
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
          data: rows.map(d => d.preco_medio),
          smooth: true,
          itemStyle: { color: COR_PRIMARIA },
          lineStyle: { width: 2 },
          areaStyle: { color: `${COR_PRIMARIA}33` }
        },
        {
          type: 'line',
          name: 'Máximo',
          data: rows.map(d => d.preco_max),
          smooth: true,
          itemStyle: { color: COR_TERCIARIA },
          lineStyle: { width: 1.5, type: 'dashed' as const }
        }
      ]
    }
  }

  const configurarGraficoDistribuicao = (data: any[]) => {
    const rows = data as any[]
    configuracaoGraficoDistribuicao.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 56, left: 64 },
      color: [COR_SECUNDARIA],
      xAxis: {
        type: 'category',
        data: rows.map(d => `${d.faixa_inicio}–${(d.faixa_inicio as number) + 20}`),
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: rows.map(d => d.total), name: 'Horas' }]
    }
  }

  const configurarGraficoCalendario = (data: any[]) => {
    const rows = data as { dia: string, preco_medio: number }[]
    const valores = rows.map(d => d.preco_medio)
    const minVal = Math.min(...valores)
    const maxVal = Math.max(...valores)
    configuracaoGraficoCalendario.value = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.value[0]}<br/>€${p.value[1]}/MWh`
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
        data: rows.map(d => [d.dia, d.preco_medio])
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
        kpis.value = row as Kpis
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(eletricidadeFinlandiaMensalConsulta(nomeArquivo)).then(configurarGraficoMensal)
    executar(eletricidadeFinlandiaHorariaConsulta(nomeArquivo)).then(configurarGraficoHoraria)
    executar(eletricidadeFinlandiaSemanaisConsulta(nomeArquivo)).then(configurarGraficoSemanal)
    executar(eletricidadeFinlandiaDistribuicaoConsulta(nomeArquivo)).then(configurarGraficoDistribuicao)
    executar(eletricidadeFinlandiaCalendarioConsulta(nomeArquivo)).then(configurarGraficoCalendario)
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
