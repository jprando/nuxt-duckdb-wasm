interface Kpis {
  total_voos: number;
  distancia_media: number;
  atraso_medio_partida: number;
  atraso_medio_chegada: number;
  taxa_cancelamento: number;
  pct_pontuais: number;
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";
const COR_QUATERNARIA = "#8b5cf6";
const configuracaoGrafico = {
  backgroundColor: "transparent",
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: "axis" as const },
};

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIST_LABELS = [
  "<250mi",
  "250-499",
  "500-749",
  "750-999",
  "1000-1249",
  "1250-1499",
  "1500-1749",
  "1750-1999",
  "2000-2249",
  "2250-2499",
  "2500+mi",
];

export const usePontualidadeVoos = () => {
  const { executar, init, registrarParquet } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_voos: 0,
    distancia_media: 0,
    atraso_medio_partida: 0,
    atraso_medio_chegada: 0,
    taxa_cancelamento: 0,
    pct_pontuais: 0,
  });

  const opcaoCompanhias = ref<Record<string, unknown> | null>(null);
  const opcaoStatus = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoDiaSemana = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoMensal = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoAtrasoPartida = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoDistancia = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoAeroportos = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoCancelamentos = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoHoraPartida = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoRadar = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoSankey = ref<Record<string, unknown> | null>(null);

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoCompanhias = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => d.carrier);
    const values = rows.map(d => d.total);
    opcaoCompanhias.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 32,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 32, bottom: 8, left: 40 },
        outerBoundsContain: "axisLabel",
      },
      color: [COR_PRIMARIA],
      tooltip: { trigger: "axis" as const },
      xAxis: { type: "value", axisLabel: { fontSize: 10 } },
      yAxis: {
        type: "category",
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: "bold" },
      },
      series: [{ type: "bar", data: [...values].reverse(), name: "Voos" }],
    };
  };

  const configurarGraficoStatus = (data: any[]) => {
    opcaoStatus.value = {
      backgroundColor: "transparent",
      color: [COR_SECUNDARIA, COR_TERCIARIA, "#f43f5e", COR_QUATERNARIA],
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 0, type: "scroll", textStyle: { fontSize: 10 } },
      series: [
        {
          type: "pie",
          radius: ["42%", "70%"],
          center: ["50%", "42%"],
          data: (data as any[]).map(d => ({ name: d.status, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: "bold" } },
        },
      ],
    };
  };

  const configurarGraficoDiaSemana = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => DIAS_SEMANA[(d.dayofweek as number) - 1] ?? `D${d.dayofweek}`);
    const atrasos = rows.map(d => d.atraso_medio ?? 0);
    configuracaoGraficoDiaSemana.value = {
      ...configuracaoGrafico,
      color: [COR_TERCIARIA],
      xAxis: { type: "category", data: labels, axisLabel: { fontSize: 11 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 }, name: "min", nameTextStyle: { fontSize: 10 } },
      series: [{ type: "bar", data: atrasos, name: "Atraso Médio (min)" }],
    };
  };

  const configurarGraficoMensal = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => MESES[(d.month as number) - 1] ?? `M${d.month}`);
    const totais = rows.map(d => d.total);
    configuracaoGraficoMensal.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 40, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: "category", data: labels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [
        {
          type: "line",
          data: totais,
          name: "Voos",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          areaStyle: { opacity: 0.15 },
        },
      ],
    };
  };

  const configurarGraficoAtrasoPartida = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => `${d.faixa_min}min`);
    const values = rows.map(d => d.total);
    configuracaoGraficoAtrasoPartida.value = {
      ...configuracaoGrafico,
      color: ["#f43f5e"],
      xAxis: { type: "category", data: labels, axisLabel: { fontSize: 9, rotate: 45 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: values, name: "Voos" }],
    };
  };

  const configurarGraficoDistancia = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => DIST_LABELS[(d.distancegroup as number) - 1] ?? `G${d.distancegroup}`);
    const values = rows.map(d => d.total);
    configuracaoGraficoDistancia.value = {
      ...configuracaoGrafico,
      color: [COR_QUATERNARIA],
      xAxis: { type: "category", data: labels, axisLabel: { fontSize: 9, rotate: 30 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: values, name: "Voos" }],
    };
  };

  const configurarGraficoAeroportos = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => d.origin);
    const values = rows.map(d => d.total);
    configuracaoGraficoAeroportos.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 32,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 32, bottom: 8, left: 40 },
        outerBoundsContain: "axisLabel",
      },
      color: [COR_SECUNDARIA],
      tooltip: { trigger: "axis" as const },
      xAxis: { type: "value", axisLabel: { fontSize: 10 } },
      yAxis: {
        type: "category",
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: "bold" },
      },
      series: [{ type: "bar", data: [...values].reverse(), name: "Voos" }],
    };
  };

  const configurarGraficoCancelamentos = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => d.carrier);
    const values = rows.map(d => d.taxa_cancelamento);
    configuracaoGraficoCancelamentos.value = {
      ...configuracaoGrafico,
      grid: {
        top: 16,
        right: 48,
        bottom: 8,
        left: 40,
        outerBounds: { top: 16, right: 48, bottom: 8, left: 40 },
        outerBoundsContain: "axisLabel",
      },
      color: ["#f43f5e"],
      tooltip: { trigger: "axis" as const },
      xAxis: { type: "value", axisLabel: { fontSize: 10 }, name: "%", nameTextStyle: { fontSize: 10 } },
      yAxis: {
        type: "category",
        data: [...labels].reverse(),
        axisLabel: { fontSize: 11, fontWeight: "bold" },
      },
      series: [{ type: "bar", data: [...values].reverse(), name: "Taxa Cancelamento (%)" }],
    };
  };

  const configurarGraficoHoraPartida = (data: any[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHoraPartida.value = {};
      return;
    }
    const rows = data as any[];
    const labels = rows.map(d => `${String(d.hora).padStart(2, "0")}h`);
    const atrasos = rows.map(d => d.atraso_medio ?? 0);
    configuracaoGraficoHoraPartida.value = {
      ...configuracaoGrafico,
      grid: { top: 16, right: 16, bottom: 48, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: "category", data: labels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 }, name: "min", nameTextStyle: { fontSize: 10 } },
      series: [
        {
          type: "line",
          data: atrasos,
          name: "Atraso Médio (min)",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          areaStyle: { opacity: 0.15 },
        },
      ],
    };
  };

  const configurarGraficoRadar = (data: any[]) => {
    const rows = data as any[];
    const maxAtraso = Math.ceil(Math.max(...rows.map(d => d.atraso_medio ?? 0), 10) / 10) * 10;
    const maxDist = Math.ceil(Math.max(...rows.map(d => d.distancia_media ?? 0), 500) / 500) * 500;
    configuracaoGraficoRadar.value = {
      backgroundColor: "transparent",
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        type: "scroll",
        textStyle: { fontSize: 10 },
      },
      radar: {
        indicator: [
          { name: "Pontualidade (%)", max: 100 },
          { name: "Dist. Média (mi)", max: maxDist },
          { name: "Atraso Médio (min)", max: maxAtraso },
          { name: "Taxa Cancelamento\n(inversa)", max: 100 },
        ],
        radius: "60%",
        center: ["50%", "46%"],
        axisName: { fontSize: 10 },
      },
      series: [{
        type: "radar",
        data: rows.map(d => ({
          name: d.carrier,
          value: [
            d.pct_pontual ?? 0,
            d.distancia_media ?? 0,
            d.atraso_medio ?? 0,
            // taxa cancelamento invertida: 100 = nunca cancela, 0 = sempre cancela
            Math.max(0, 100 - (d.pct_cancelado ?? 0) * 20),
          ],
        })),
      }],
    };
  };

  const configurarGraficoSankey = (data: any[]) => {
    const rows = data as { companhia: string; status: string; total: number }[];
    const companhias = [...new Set(rows.map(d => d.companhia))];
    const statuses = [...new Set(rows.map(d => d.status))];
    const COR_SANKEY_STATUS: Record<string, string> = {
      "Pontual": COR_SECUNDARIA,
      "Atrasado (>15min)": COR_TERCIARIA,
      "Cancelado": "#f43f5e",
      "Desviado": COR_QUATERNARIA,
    };
    configuracaoGraficoSankey.value = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (p: any) => {
          if (p.dataType === "edge") {
            return `${p.data.source} → ${p.data.target}<br/>${
              new Intl.NumberFormat("pt-BR").format(p.data.value)
            } voos`;
          }
          return p.name;
        },
      },
      series: [{
        type: "sankey",
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
          ...statuses.map(s => ({ name: s, itemStyle: { color: COR_SANKEY_STATUS[s] ?? "#94a3b8" } })),
        ],
        edges: rows.map(d => ({
          source: d.companhia,
          target: d.status,
          value: d.total,
        })),
      }],
    };
  };

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = pontualidadeVoosUrl;
    const nomeArquivo = await registrarParquet(url);

    executar(ontimeKpisConsulta(nomeArquivo))
      .then(([kpisData]) => {
        kpis.value = kpisData as Kpis;
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`;
        console.error(e);
      })
      .finally(() => {
        carregandoKpis.value = false;
      });

    executar(ontimeCompanhiasConsulta(nomeArquivo)).then(configurarGraficoCompanhias);
    executar(ontimeStatusConsulta(nomeArquivo)).then(configurarGraficoStatus);
    executar(ontimeDiaSemanaConsulta(nomeArquivo)).then(configurarGraficoDiaSemana);
    executar(ontimeMensalConsulta(nomeArquivo)).then(configurarGraficoMensal);
    executar(ontimeAtrasoPartidaConsulta(nomeArquivo)).then(configurarGraficoAtrasoPartida);
    executar(ontimeDistanciaConsulta(nomeArquivo)).then(configurarGraficoDistancia);
    executar(ontimeAeroportosConsulta(nomeArquivo)).then(configurarGraficoAeroportos);
    executar(ontimeCancelamentosConsulta(nomeArquivo)).then(configurarGraficoCancelamentos);
    executar(ontimeHoraPartidaConsulta(nomeArquivo))
      .then(configurarGraficoHoraPartida)
      .catch(() => {
        configuracaoGraficoHoraPartida.value = {};
      });
    executar(ontimeRadarCompanhiasConsulta(nomeArquivo)).then(configurarGraficoRadar);
    executar(ontimeSankeyConsulta(nomeArquivo)).then(configurarGraficoSankey);
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);
  const fmtMin = (n: number) => `${n} min`;
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;
  const fmtMi = (n: number) => `${numeroSemCasaDecimal.format(n)} mi`;

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
    fmtMi,
  };
};
