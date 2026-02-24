interface Kpis {
  total_trips: number;
  avg_duration_min: number;
  avg_tip: number;
  total_revenue: number;
  periodo_inicio: string;
  periodo_fim: string;
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";
const COR_QUATERNARIA = "#8b5cf6";
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, "#f43f5e", "#14b8a6"];

const baseChart = {
  backgroundColor: "transparent",
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: "axis" as const },
};

export const useTaxiNYCAbril2019 = () => {
  const { executar, init, registrarParquet } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_trips: 0,
    avg_duration_min: 0,
    avg_tip: 0,
    total_revenue: 0,
    periodo_inicio: "",
    periodo_fim: "",
  });

  const opcaoTarifa = ref<Record<string, unknown> | null>(null);
  const opcaoPagamento = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoDuracao = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoGorjeta = ref<Record<string, unknown> | null>(null);
  const configuracaoGraficoHora = ref<Record<string, unknown> | null>(null);

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoTarifa = (data: any[]) => {
    opcaoTarifa.value = {
      backgroundColor: "transparent",
      color: PALETA,
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 0, type: "scroll" },
      series: [
        {
          type: "pie",
          radius: ["42%", "70%"],
          center: ["50%", "42%"],
          data: (data as any[]).map(d => ({ name: d.tarifa, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: "bold" } },
        },
      ],
    };
  };

  const configurarGraficoPagamento = (data: any[]) => {
    opcaoPagamento.value = {
      backgroundColor: "transparent",
      color: PALETA,
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 0, type: "scroll" },
      series: [
        {
          type: "pie",
          radius: ["42%", "70%"],
          center: ["50%", "42%"],
          data: (data as any[]).map(d => ({ name: d.pagamento, value: d.total })),
          label: { show: false },
          emphasis: { label: { show: true, fontWeight: "bold" } },
        },
      ],
    };
  };

  const configurarGraficoDuracao = (data: any[]) => {
    const durLabels = (data as any[]).map(d => `${d.faixa_min}min`);
    const durValues = (data as any[]).map(d => d.total);
    configuracaoGraficoDuracao.value = {
      ...baseChart,
      color: [COR_SECUNDARIA],
      xAxis: { type: "category", data: durLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: durValues, name: "Corridas" }],
    };
  };

  const configurarGraficoGorjeta = (data: any[]) => {
    const gorjLabels = (data as any[]).map(d => `$${d.faixa}`);
    const gorjValues = (data as any[]).map(d => d.total);
    configuracaoGraficoGorjeta.value = {
      ...baseChart,
      color: [COR_TERCIARIA],
      xAxis: { type: "category", data: gorjLabels, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: gorjValues, name: "Corridas" }],
    };
  };

  const configurarGraficoHora = (data: any[]) => {
    if (!data || data.length === 0) {
      configuracaoGraficoHora.value = {};
      return;
    }
    const horaLabels = (data as any[]).map(d => `${String(d.hora).padStart(2, "0")}h`);
    const horaValues = (data as any[]).map(d => d.total);
    configuracaoGraficoHora.value = {
      ...baseChart,
      grid: { top: 16, right: 16, bottom: 48, left: 64 },
      color: [COR_PRIMARIA],
      xAxis: { type: "category", data: horaLabels, boundaryGap: false, axisLabel: { fontSize: 11 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [
        {
          type: "line",
          data: horaValues,
          name: "Corridas",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          areaStyle: { opacity: 0.15 },
        },
      ],
    };
  };

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = taxiNYCAbril2019Url;
    const nomeArquivo = await registrarParquet(url);

    executar(nycTaxi2019AprKpisConsulta(nomeArquivo))
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

    executar(nycTaxi2019AprTarifaConsulta(nomeArquivo)).then(configurarGraficoTarifa);
    executar(nycTaxi2019AprPagamentoConsulta(nomeArquivo)).then(configurarGraficoPagamento);
    executar(nycTaxi2019AprDuracaoConsulta(nomeArquivo)).then(configurarGraficoDuracao);
    executar(nycTaxi2019AprGorjetaConsulta(nomeArquivo)).then(configurarGraficoGorjeta);
    executar(nycTaxi2019AprHoraConsulta(nomeArquivo))
      .then(configurarGraficoHora)
      .catch(() => {
        configuracaoGraficoHora.value = {};
      });
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);
  const fmtDolar = (n: number) => dolarSemCasaDecimal.format(n);
  const fmtDolarDecimal = (n: number) => dolarComDuasCasas.format(n);
  const fmtMin = (n: number) => `${n} min`;

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoTarifa,
    opcaoPagamento,
    configuracaoGraficoDuracao,
    configuracaoGraficoGorjeta,
    configuracaoGraficoHora,
    fmtNumero,
    fmtDolar,
    fmtDolarDecimal,
    fmtMin,
  };
};
