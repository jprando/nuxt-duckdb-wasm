interface Kpis {
  total_estacoes: number;
  total_paises: number;
  total_tipos: number;
  megaestacoes: number;
  estacoes_nl: number;
  estacoes_intercidade: number;
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

export const useEstacoesTrem = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_estacoes: 0,
    total_paises: 0,
    total_tipos: 0,
    megaestacoes: 0,
    estacoes_nl: 0,
    estacoes_intercidade: 0,
  });

  const opcaoPaises = ref<Record<string, unknown> | null>(null);
  const opcaoTipos = ref<Record<string, unknown> | null>(null);
  const opcaoCategorias = ref<Record<string, unknown> | null>(null);
  const opcaoLatitude = ref<Record<string, unknown> | null>(null);
  const opcaoLongitude = ref<Record<string, unknown> | null>(null);
  const opcaoTiposPorPais = ref<Record<string, unknown> | null>(null);

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = trainStationsUrl;

    executar(trainStationsKpisQuery(url))
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

    executar(trainStationsPaisesQuery(url))
      .then((data) => {
        const rows = data as any[];
        const labels = rows.map(d => d.country);
        const values = rows.map(d => d.total);
        opcaoPaises.value = {
          ...baseChart,
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
          series: [{ type: "bar", data: [...values].reverse(), name: "Estações" }],
        };
      });

    executar(trainStationsTiposQuery(url))
      .then((data) => {
        opcaoTipos.value = {
          backgroundColor: "transparent",
          color: PALETA,
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0, type: "scroll", textStyle: { fontSize: 10 } },
          series: [
            {
              type: "pie",
              radius: ["42%", "70%"],
              center: ["50%", "42%"],
              data: (data as any[]).map(d => ({ name: d.type, value: d.total })),
              label: { show: false },
              emphasis: { label: { show: true, fontWeight: "bold" } },
            },
          ],
        };
      });

    executar(trainStationsCategoriasQuery(url))
      .then((data) => {
        opcaoCategorias.value = {
          backgroundColor: "transparent",
          color: PALETA,
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0, type: "scroll", textStyle: { fontSize: 10 } },
          series: [
            {
              type: "pie",
              radius: ["42%", "70%"],
              center: ["50%", "42%"],
              data: (data as any[]).map(d => ({ name: d.categoria, value: d.total })),
              label: { show: false },
              emphasis: { label: { show: true, fontWeight: "bold" } },
            },
          ],
        };
      });

    executar(trainStationsLatitudeQuery(url))
      .then((data) => {
        const labels = (data as any[]).map(d => `${d.faixa_lat}°N`);
        const values = (data as any[]).map(d => d.total);
        opcaoLatitude.value = {
          ...baseChart,
          color: [COR_TERCIARIA],
          xAxis: { type: "category", data: labels, axisLabel: { fontSize: 10, rotate: 45 } },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: values, name: "Estações" }],
        };
      });

    executar(trainStationsLongitudeQuery(url))
      .then((data) => {
        const labels = (data as any[]).map(d => `${d.faixa_lng}°–${d.faixa_lng + 2}°L`);
        const values = (data as any[]).map(d => d.total);
        opcaoLongitude.value = {
          ...baseChart,
          color: [COR_QUATERNARIA],
          xAxis: { type: "category", data: labels, axisLabel: { fontSize: 10, rotate: 45 } },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: values, name: "Estações" }],
        };
      });

    executar(trainStationsTiposPorPaisQuery(url))
      .then((data) => {
        const rows = data as any[];
        const countries = [...new Set(rows.map(d => d.country))];
        const types = [...new Set(rows.map(d => d.type))];

        const map = new Map<string, Map<string, number>>();
        rows.forEach((d) => {
          if (!map.has(d.country)) map.set(d.country, new Map());
          map.get(d.country)!.set(d.type, d.total);
        });

        const series = types.map((type, i) => ({
          name: type,
          type: "bar",
          stack: "total",
          data: countries.map(c => map.get(c)?.get(type) ?? 0),
          itemStyle: { color: PALETA[i % PALETA.length] },
        }));

        opcaoTiposPorPais.value = {
          backgroundColor: "transparent",
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { bottom: 0, type: "scroll", textStyle: { fontSize: 10 } },
          grid: {
            top: 32,
            right: 16,
            bottom: 80,
            left: 40,
            outerBounds: { top: 32, right: 16, bottom: 80, left: 40 },
            outerBoundsContain: "axisLabel",
          },
          xAxis: {
            type: "category",
            data: countries,
            axisLabel: { fontSize: 11, fontWeight: "bold" },
          },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series,
        };
      });
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoPaises,
    opcaoTipos,
    opcaoCategorias,
    opcaoLatitude,
    opcaoLongitude,
    opcaoTiposPorPais,
    fmtNumero,
  };
};
