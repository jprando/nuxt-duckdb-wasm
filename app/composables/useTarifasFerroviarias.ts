interface Kpis {
  total_routes: number;
  total_stations: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";

const baseChart = {
  backgroundColor: "transparent",
  grid: { top: 32, right: 16, bottom: 48, left: 56 },
  tooltip: { trigger: "axis" as const },
};

export const useTarifasFerroviarias = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(
    () => (colorMode.value === "dark" ? "dark" : ""),
  );

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_routes: 0,
    total_stations: 0,
    avg_price: 0,
    min_price: 0,
    max_price: 0,
  });

  const opcaoDistribuicaoPreco = ref<Record<string, unknown> | null>(null);
  const opcaoRotasCaras = ref<Record<string, unknown> | null>(null);
  const opcaoEstacoesConectadas = ref<Record<string, unknown> | null>(null);

  const carregarDados = () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = railwayFaresUrl;

    executar(railwayFaresKpisConsulta(url))
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

    executar(railwayFaresPriceDistributionConsulta(url)).then((data) => {
      const rows = data as { count: number; price_bucket: number }[];
      const labels = rows.map((d) => `€${d.price_bucket}`);
      const values = rows.map((d) => d.count);
      opcaoDistribuicaoPreco.value = {
        ...baseChart,
        color: [COR_PRIMARIA],
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: { fontSize: 10, rotate: 45 },
        },
        yAxis: { type: "value", axisLabel: { fontSize: 10 } },
        series: [{ type: "bar", data: values, name: "Nº de Rotas" }],
      };
    });

    executar(railwayFaresMostExpensiveRoutesConsulta(url)).then((data) => {
      const rows = data as { route: string; price: number }[];
      const routes = rows.map((d) => d.route);
      const prices = rows.map((d) => d.price);
      opcaoRotasCaras.value = {
        ...baseChart,
        grid: { ...baseChart.grid, left: 80 },
        color: [COR_TERCIARIA],
        xAxis: { type: "value", axisLabel: { fontSize: 10 } },
        yAxis: { type: "category", data: routes, axisLabel: { fontSize: 10 } },
        series: [{ type: "bar", data: prices, name: "Preço" }],
      };
    });

    executar(railwayFaresBusiestStationsConsulta(url))
      .then((data) => {
        const rows = data as { station: string; appearances: number }[];
        const stations = rows.map((d) => d.station);
        const appearances = rows.map((d) => d.appearances);
        opcaoEstacoesConectadas.value = {
          ...baseChart,
          color: [COR_SECUNDARIA],
          xAxis: {
            type: "category",
            data: stations,
            axisLabel: { fontSize: 10, rotate: 45 },
          },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: appearances, name: "Nº de Conexões" }],
        };
      });
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);
  const fmtPreco = (n: number) => euroSemCasaDecimal.format(n);

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoDistribuicaoPreco,
    opcaoRotasCaras,
    opcaoEstacoesConectadas,
    fmtNumero,
    fmtPreco,
  };
};
