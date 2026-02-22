interface Kpis {
  total_services: number;
  total_stations: number;
  total_trains: number;
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

export const useTrensHolandeses = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => (colorMode.value === "dark" ? "dark" : ""));

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_services: 0,
    total_stations: 0,
    total_trains: 0,
  });

  const opcaoTipo = ref<Record<string, unknown> | null>(null);
  const opcaoEstacoesMovimentadas = ref<Record<string, unknown> | null>(null);
  const opcaoPartidasPorHora = ref<Record<string, unknown> | null>(null);
  const opcaoDuracaoMediaParada = ref<Record<string, unknown> | null>(null);

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = dutchTrainServicesUrl;

    executar(dutchTrainServicesKpisQuery(url))
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

    executar(dutchTrainServicesTypeQuery(url)).then((typeData) => {
      opcaoTipo.value = {
        backgroundColor: "transparent",
        color: PALETA,
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        legend: { bottom: 0, type: "scroll" },
        series: [
          {
            type: "pie",
            radius: ["42%", "70%"],
            center: ["50%", "42%"],
            data: (typeData as any[]).map(d => ({ name: d.type, value: d.total })),
            label: { show: false },
            emphasis: { label: { show: true, fontWeight: "bold" } },
          },
        ],
      };
    });

    executar(dutchTrainServicesBusiestStationsQuery(url)).then((stationsData) => {
      const stationLabels = (stationsData as any[]).map(d => d.station_name);
      const stationValues = (stationsData as any[]).map(d => d.count);
      opcaoEstacoesMovimentadas.value = {
        ...baseChart,
        color: [COR_SECUNDARIA],
        xAxis: { type: "category", data: stationLabels, axisLabel: { fontSize: 10, rotate: 45 } },
        yAxis: { type: "value", axisLabel: { fontSize: 10 } },
        series: [{ type: "bar", data: stationValues, name: "Eventos" }],
      };
    });

    executar(dutchTrainServicesDeparturesByHourQuery(url)).then((departuresData) => {
      const hourLabels = (departuresData as any[]).map(d => `${String(d.hora).padStart(2, "0")}h`);
      const hourValues = (departuresData as any[]).map(d => d.total);
      opcaoPartidasPorHora.value = {
        ...baseChart,
        grid: { top: 16, right: 16, bottom: 48, left: 64, containLabel: false },
        color: [COR_PRIMARIA],
        xAxis: { type: "category", data: hourLabels, boundaryGap: false, axisLabel: { fontSize: 11 } },
        yAxis: { type: "value", axisLabel: { fontSize: 10 } },
        series: [
          {
            type: "line",
            data: hourValues,
            name: "Partidas",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            areaStyle: { opacity: 0.15 },
          },
        ],
      };
    });

    executar(dutchTrainServicesAvgStopDurationQuery(url)).then((stopDurationData) => {
      const stopLabels = (stopDurationData as any[]).map(d => d.station_name);
      const stopValues = (stopDurationData as any[]).map(d => d.avg_stop_seconds);
      opcaoDuracaoMediaParada.value = {
        ...baseChart,
        color: [COR_TERCIARIA],
        xAxis: { type: "category", data: stopLabels, axisLabel: { fontSize: 10, rotate: 45 } },
        yAxis: { type: "value", axisLabel: { fontSize: 10, formatter: "{value}s" } },
        series: [{ type: "bar", data: stopValues, name: "Duração Média (s)" }],
      };
    });
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoTipo,
    opcaoEstacoesMovimentadas,
    opcaoPartidasPorHora,
    opcaoDuracaoMediaParada,
    fmtNumero,
  };
};
