interface Kpis {
  total_voos: number
  distancia_media: number
  atraso_medio_partida: number
  atraso_medio_chegada: number
  taxa_cancelamento: number
  pct_pontuais: number
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";
const COR_QUATERNARIA = "#8b5cf6";
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, "#f43f5e", "#14b8a6"];

const baseChart = {
  backgroundColor: "transparent",
  grid: { top: 32, right: 16, bottom: 48, left: 56, containLabel: false },
  tooltip: { trigger: "axis" as const },
};

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIST_LABELS = [
  "<250mi", "250-499", "500-749", "750-999",
  "1000-1249", "1250-1499", "1500-1749", "1750-1999",
  "2000-2249", "2250-2499", "2500+mi",
];

export const useOntime = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregando = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_voos: 0,
    distancia_media: 0,
    atraso_medio_partida: 0,
    atraso_medio_chegada: 0,
    taxa_cancelamento: 0,
    pct_pontuais: 0,
  });

  const opcaoCompanhias = ref<Record<string, unknown>>({});
  const opcaoStatus = ref<Record<string, unknown>>({});
  const opcaoDiaSemana = ref<Record<string, unknown>>({});
  const opcaoMensal = ref<Record<string, unknown>>({});
  const opcaoAtrasoPartida = ref<Record<string, unknown>>({});
  const opcaoDistancia = ref<Record<string, unknown>>({});
  const opcaoAeroportos = ref<Record<string, unknown>>({});
  const opcaoCancelamentos = ref<Record<string, unknown>>({});
  const opcaoHoraPartida = ref<Record<string, unknown>>({});

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = () => {
    carregando.value = true;
    erro.value = null;

    const url = ontimeUrl;

    const promises = [
      executar(ontimeKpisQuery(url))
        .then((data) => {
          kpis.value = data[0] as Kpis;
        }),

      executar(ontimeCompanhiasQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => d.carrier);
          const values = rows.map(d => d.total);
          opcaoCompanhias.value = {
            ...baseChart,
            grid: { top: 16, right: 32, bottom: 8, left: 40, containLabel: true },
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
        }),

      executar(ontimeStatusQuery(url))
        .then((data) => {
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
        }),

      executar(ontimeDiaSemanaQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => DIAS_SEMANA[(d.dayofweek as number) - 1] ?? `D${d.dayofweek}`);
          const atrasos = rows.map(d => d.atraso_medio ?? 0);
          opcaoDiaSemana.value = {
            ...baseChart,
            color: [COR_TERCIARIA],
            xAxis: { type: "category", data: labels, axisLabel: { fontSize: 11 } },
            yAxis: { type: "value", axisLabel: { fontSize: 10 }, name: "min", nameTextStyle: { fontSize: 10 } },
            series: [{ type: "bar", data: atrasos, name: "Atraso Médio (min)" }],
          };
        }),

      executar(ontimeMensalQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => MESES[(d.month as number) - 1] ?? `M${d.month}`);
          const totais = rows.map(d => d.total);
          opcaoMensal.value = {
            ...baseChart,
            grid: { top: 16, right: 16, bottom: 40, left: 64, containLabel: false },
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
        }),

      executar(ontimeAtrasoPartidaQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => `${d.faixa_min}min`);
          const values = rows.map(d => d.total);
          opcaoAtrasoPartida.value = {
            ...baseChart,
            color: ["#f43f5e"],
            xAxis: { type: "category", data: labels, axisLabel: { fontSize: 9, rotate: 45 } },
            yAxis: { type: "value", axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: values, name: "Voos" }],
          };
        }),

      executar(ontimeDistanciaQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => DIST_LABELS[(d.distancegroup as number) - 1] ?? `G${d.distancegroup}`);
          const values = rows.map(d => d.total);
          opcaoDistancia.value = {
            ...baseChart,
            color: [COR_QUATERNARIA],
            xAxis: { type: "category", data: labels, axisLabel: { fontSize: 9, rotate: 30 } },
            yAxis: { type: "value", axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: values, name: "Voos" }],
          };
        }),

      executar(ontimeAeroportosQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => d.origin);
          const values = rows.map(d => d.total);
          opcaoAeroportos.value = {
            ...baseChart,
            grid: { top: 16, right: 32, bottom: 8, left: 40, containLabel: true },
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
        }),

      executar(ontimeCancelamentosQuery(url))
        .then((data) => {
          const rows = data as any[];
          const labels = rows.map(d => d.carrier);
          const values = rows.map(d => d.taxa_cancelamento);
          opcaoCancelamentos.value = {
            ...baseChart,
            grid: { top: 16, right: 48, bottom: 8, left: 40, containLabel: true },
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
        }),

      executar(ontimeHoraPartidaQuery(url))
        .then((data) => {
          if (!data || data.length === 0) return;
          const rows = data as any[];
          const labels = rows.map(d => `${String(d.hora).padStart(2, "0")}h`);
          const atrasos = rows.map(d => d.atraso_medio ?? 0);
          opcaoHoraPartida.value = {
            ...baseChart,
            grid: { top: 16, right: 16, bottom: 48, left: 64, containLabel: false },
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
        })
        .catch(() => { /* silently fail */ }),
    ];

    Promise.allSettled(promises)
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`;
        console.error(e);
      })
      .finally(() => {
        carregando.value = false;
      });
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
    carregando,
    erro,
    kpis,
    temaGrafico,
    opcaoCompanhias,
    opcaoStatus,
    opcaoDiaSemana,
    opcaoMensal,
    opcaoAtrasoPartida,
    opcaoDistancia,
    opcaoAeroportos,
    opcaoCancelamentos,
    opcaoHoraPartida,
    fmtNumero,
    fmtMin,
    fmtPct,
    fmtMi,
  };
};
