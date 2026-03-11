import type {
  KpisPontualidadeVoos,
  LinhaContagemPorCompanhia,
  LinhaContagemPorStatus,
  LinhaAtrasoPorDiaSemana,
  LinhaContagemMensal,
  LinhaContagemPorFaixaAtraso,
  LinhaContagemPorGrupoDistancia,
  LinhaContagemPorAeroportoOrigem,
  LinhaTaxaCancelamentoPorCompanhia,
  LinhaAtrasoPorHoraPartida,
  LinhaRadarCompanhia,
  LinhaSankeyCompanhiaStatus,
  ParametroTooltipSankey
} from '~/types/pontualidade-voos.types'

const COR_PRIMARIA = '#3b82f6'
const COR_SECUNDARIA = '#10b981'
const COR_TERCIARIA = '#f59e0b'
const COR_QUATERNARIA = '#8b5cf6'
const configuracaoGrafico = {
  backgroundColor: 'transparent',
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: 'axis' as const }
}

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
  const colorMode = useColorMode()

  const temaGrafico = computed(() => colorMode.value === 'dark' ? 'dark' : '')

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

  const opcaoCompanhias = ref<Record<string, unknown> | null>(null)
  const opcaoStatus = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoDiaSemana = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoMensal = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoAtrasoPartida = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoDistancia = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoAeroportos = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoCancelamentos = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoHoraPartida = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoRadar = ref<Record<string, unknown> | null>(null)
  const configuracaoGraficoSankey = ref<Record<string, unknown> | null>(null)

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoCompanhias = (data: LinhaContagemPorCompanhia[]) => {
    const labels = data.map(d => d.carrier)
    const values = data.map(d => d.total)
    opcaoCompanhias.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 32,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 32, bottom: 8, left: 40 },
        outerBoundsContain: 'axisLabel'
      },
      color: [COR_PRIMARIA],
      tooltip: { trigger: 'axis' as const },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'category',
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: 'bold' }
      },
      series: [{ type: 'bar', data: [...values].reverse(), name: 'Voos' }]
    }
  }

  const configurarGraficoStatus = (data: LinhaContagemPorStatus[]) => {
    opcaoStatus.value = {
      backgroundColor: 'transparent',
      color: [COR_SECUNDARIA, COR_TERCIARIA, '#f43f5e', COR_QUATERNARIA],
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, type: 'scroll', textStyle: { fontSize: 10 } },
      series: [
        {
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '42%'],
          data: data.map(d => ({ name: d.status, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: 'bold' } }
        }
      ]
    }
  }

  const configurarGraficoDiaSemana = (data: LinhaAtrasoPorDiaSemana[]) => {
    const labels = data.map(d => DIAS_SEMANA[d.dayofweek - 1] ?? `D${d.dayofweek}`)
    const atrasos = data.map(d => d.atraso_medio ?? 0)
    configuracaoGraficoDiaSemana.value = {
      ...configuracaoGrafico,
      color: [COR_TERCIARIA],
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, name: 'min', nameTextStyle: { fontSize: 10 } },
      series: [{ type: 'bar', data: atrasos, name: 'Atraso Médio (min)' }]
    }
  }

  const configurarGraficoMensal = (data: LinhaContagemMensal[]) => {
    const labels = data.map(d => MESES[d.month - 1] ?? `M${d.month}`)
    const totais = data.map(d => d.total)
    configuracaoGraficoMensal.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 40, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: 'category', data: labels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [
        {
          type: 'line',
          data: totais,
          name: 'Voos',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: { opacity: 0.15 }
        }
      ]
    }
  }

  const configurarGraficoAtrasoPartida = (data: LinhaContagemPorFaixaAtraso[]) => {
    const labels = data.map(d => `${d.faixa_min}min`)
    const values = data.map(d => d.total)
    configuracaoGraficoAtrasoPartida.value = {
      ...configuracaoGrafico,
      color: ['#f43f5e'],
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 9, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: values, name: 'Voos' }]
    }
  }

  const configurarGraficoDistancia = (data: LinhaContagemPorGrupoDistancia[]) => {
    const labels = data.map(d => DIST_LABELS[d.distancegroup - 1] ?? `G${d.distancegroup}`)
    const values = data.map(d => d.total)
    configuracaoGraficoDistancia.value = {
      ...configuracaoGrafico,
      color: [COR_QUATERNARIA],
      xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 9, rotate: 30 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: values, name: 'Voos' }]
    }
  }

  const configurarGraficoAeroportos = (data: LinhaContagemPorAeroportoOrigem[]) => {
    const labels = data.map(d => d.origin)
    const values = data.map(d => d.total)
    configuracaoGraficoAeroportos.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 32,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 32, bottom: 8, left: 40 },
        outerBoundsContain: 'axisLabel'
      },
      color: [COR_SECUNDARIA],
      tooltip: { trigger: 'axis' as const },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'category',
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: 'bold' }
      },
      series: [{ type: 'bar', data: [...values].reverse(), name: 'Voos' }]
    }
  }

  const configurarGraficoCancelamentos = (data: LinhaTaxaCancelamentoPorCompanhia[]) => {
    const labels = data.map(d => d.carrier)
    const values = data.map(d => d.taxa_cancelamento)
    configuracaoGraficoCancelamentos.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 48,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 48, bottom: 8, left: 40 },
        outerBoundsContain: 'axisLabel'
      },
      color: ['#f43f5e'],
      tooltip: { trigger: 'axis' as const },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 }, name: '%', nameTextStyle: { fontSize: 10 } },
      yAxis: {
        type: 'category',
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: 'bold' }
      },
      series: [{ type: 'bar', data: [...values].reverse(), name: 'Taxa Cancelamento (%)' }]
    }
  }

  const configurarGraficoHoraPartida = (data: LinhaAtrasoPorHoraPartida[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHoraPartida.value = {}
      return
    }
    const labels = data.map(d => `${String(d.hora).padStart(2, '0')}h`)
    const atrasos = data.map(d => d.atraso_medio ?? 0)
    configuracaoGraficoHoraPartida.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: 'category', data: labels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, name: 'min', nameTextStyle: { fontSize: 10 } },
      series: [
        {
          type: 'line',
          data: atrasos,
          name: 'Atraso Médio (min)',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: { opacity: 0.15 }
        }
      ]
    }
  }

  const configurarGraficoRadar = (data: LinhaRadarCompanhia[]) => {
    const maxAtraso = Math.ceil(Math.max(...data.map(d => d.atraso_medio ?? 0), 10) / 50) * 50
    const maxDist = Math.ceil(Math.max(...data.map(d => d.distancia_media ?? 0), 500) / 500) * 500
    configuracaoGraficoRadar.value = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 0,
        type: 'scroll',
        textStyle: { fontSize: 10 }
      },
      radar: {
        indicator: [
          { name: 'Pontualidade (%)', max: 100 },
          { name: 'Dist. Média (mi)', max: maxDist },
          { name: 'Atraso Médio (min)', max: maxAtraso },
          { name: 'Taxa Cancelamento\n(inversa)', max: 100 }
        ],
        radius: '60%',
        center: ['50%', '46%'],
        axisName: { fontSize: 10 }
      },
      series: [{
        type: 'radar',
        data: data.map(d => ({
          name: d.carrier,
          value: [
            d.pct_pontual ?? 0,
            d.distancia_media ?? 0,
            d.atraso_medio ?? 0,
            // taxa cancelamento invertida: 100 = nunca cancela, 0 = sempre cancela
            Math.max(0, 100 - (d.pct_cancelado ?? 0) * 20)
          ]
        }))
      }]
    }
  }

  const configurarGraficoSankey = (data: LinhaSankeyCompanhiaStatus[]) => {
    const companhias = [...new Set(data.map(d => d.companhia))]
    const statuses = [...new Set(data.map(d => d.status))]
    const COR_SANKEY_STATUS: Record<string, string> = {
      'Pontual': COR_SECUNDARIA,
      'Atrasado (>15min)': COR_TERCIARIA,
      'Cancelado': '#f43f5e',
      'Desviado': COR_QUATERNARIA
    }
    configuracaoGraficoSankey.value = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (p: ParametroTooltipSankey) => {
          if (p.dataType === 'edge') {
            return `${p.data.source} → ${p.data.target}<br/>${
              new Intl.NumberFormat('pt-BR').format(p.data.value ?? 0)
            } voos`
          }
          return p.name ?? ''
        }
      },
      series: [{
        type: 'sankey',
        top: 8,
        bottom: 8,
        left: 8,
        right: 90,
        nodeWidth: 12,
        nodeGap: 10,
        label: { fontSize: 10 },
        lineStyle: { opacity: 0.35, curveness: 0.5 },
        nodes: [
          ...companhias.map(c => ({ name: c, itemStyle: { color: COR_PRIMARIA } })),
          ...statuses.map(s => ({ name: s, itemStyle: { color: COR_SANKEY_STATUS[s] ?? '#94a3b8' } }))
        ],
        edges: data.map(d => ({
          source: d.companhia,
          target: d.status,
          value: d.total
        }))
      }]
    }
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
        configuracaoGraficoHoraPartida.value = {}
      })
    executar(ontimeRadarCompanhiasConsulta(nomeArquivo)).then(dados =>
      configurarGraficoRadar(dados as LinhaRadarCompanhia[])
    )
    executar(ontimeSankeyConsulta(nomeArquivo)).then(dados =>
      configurarGraficoSankey(dados as LinhaSankeyCompanhiaStatus[])
    )
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
    temaGrafico,
    opcaoCompanhias,
    opcaoStatus,
    configuracaoGraficoDiaSemana,
    configuracaoGraficoMensal,
    configuracaoGraficoAtrasoPartida,
    configuracaoGraficoDistancia,
    configuracaoGraficoAeroportos,
    configuracaoGraficoCancelamentos,
    configuracaoGraficoHoraPartida,
    configuracaoGraficoRadar,
    configuracaoGraficoSankey,
    fmtNumero,
    fmtMin,
    fmtPct,
    fmtMi
  }
}
