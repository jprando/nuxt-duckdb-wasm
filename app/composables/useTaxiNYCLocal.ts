interface Kpis {
  total_trips: number
  avg_distance: number
  avg_amount: number
  total_revenue: number
  periodo_inicio: string
  periodo_fim: string
}

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, '#f43f5e', '#14b8a6']

const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: 'axis' as const }
}

export const useTaxiNYCLocal = () => {
  const { executar, init, registrarParquet } = useDuckDb()
  const colorMode = useColorMode()

  const temaGrafico = computed(() => colorMode.value === 'dark' ? 'dark' : '')

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true)
  const erro = ref<string | null>(null)

  const kpis = ref<Kpis>({
    total_trips: 0,
    avg_distance: 0,
    avg_amount: 0,
    total_revenue: 0,
    periodo_inicio: '',
    periodo_fim: ''
  })

  const configuracaoGraficoVendor = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoPassageiros = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoDistancia = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoValor = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoHora = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoVendor = (data: any[]) => {
    configuracaoGraficoVendor.value = {
      backgroundColor: 'transparent',
      color: PALETA,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '42%'],
          data: (data as any[]).map(d => ({ name: d.vendor, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: 'bold' } }
        }
      ]
    }
  }

  const configurarGraficoPassageiros = (data: any[]) => {
    const paxLabels = (data as any[]).map(d => `${d.passageiros} pax`)
    const paxValues = (data as any[]).map(d => d.total)
    configuracaoGraficoPassageiros.value = {
      ...configuracaoGrafico,
      color: [COR_SECUNDARIA],
      xAxis: { type: 'category', data: paxLabels, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: paxValues, name: 'Corridas', barMaxWidth: 48 }]
    }
  }

  const configurarGraficoDistancia = (data: any[]) => {
    const distLabels = (data as any[]).map(d => `${d.milhas}mi`)
    const distValues = (data as any[]).map(d => d.total)
    configuracaoGraficoDistancia.value = {
      ...configuracaoGrafico,
      color: [COR_TERCIARIA],
      xAxis: { type: 'category', data: distLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: distValues, name: 'Corridas' }]
    }
  }

  const configurarGraficoValor = (data: any[]) => {
    const valorLabels = (data as any[]).map(d => `$${d.faixa}`)
    const valorValues = (data as any[]).map(d => d.total)
    configuracaoGraficoValor.value = {
      ...configuracaoGrafico,
      color: [COR_QUATERNARIA],
      xAxis: { type: 'category', data: valorLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: valorValues, name: 'Corridas' }]
    }
  }

  const configurarGraficoHora = (data: any[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHora.value = {}
      return
    }
    const horaLabels = (data as any[]).map(d => `${String(d.hora).padStart(2, '0')}h`)
    const horaValues = (data as any[]).map(d => d.total)
    configuracaoGraficoHora.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: 'category', data: horaLabels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        {
          type: 'line',
          data: horaValues,
          name: 'Corridas',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: { opacity: 0.15 }
        }
      ]
    }
  }

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true
    erro.value = null

    const url = taxiNYCLocalUrl
    const nomeArquivo = await registrarParquet(url)

    executar(localNYCTaxiKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        kpis.value = kpisData as Kpis
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`
        console.error(e)
      })
      .finally(() => {
        carregandoKpis.value = false
      })

    executar(localNYCTaxiVendorConsulta(nomeArquivo)).then(configurarGraficoVendor)
    executar(localNYCTaxiPassageirosConsulta(nomeArquivo)).then(configurarGraficoPassageiros)
    executar(localNYCTaxiDistanciaConsulta(nomeArquivo)).then(configurarGraficoDistancia)
    executar(localNYCTaxiValorConsulta(nomeArquivo)).then(configurarGraficoValor)
    executar(localNYCTaxiHoraConsulta(nomeArquivo))
      .then(configurarGraficoHora)
      .catch(() => {
        configuracaoGraficoHora.value = {}
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
    temaGrafico,
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
