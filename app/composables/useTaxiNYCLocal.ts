interface Kpis {
  total_trips: number;
  avg_distance: number;
  avg_amount: number;
  total_revenue: number;
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

export const useTaxiNYCLocal = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_trips: 0,
    avg_distance: 0,
    avg_amount: 0,
    total_revenue: 0,
  });

  const opcaoVendor = ref<Record<string, unknown> | null>(null);
  const opcaoPassageiros = ref<Record<string, unknown> | null>(null);
  const opcaoDistancia = ref<Record<string, unknown> | null>(null);
  const opcaoValor = ref<Record<string, unknown> | null>(null);
  const opcaoHora = ref<Record<string, unknown> | null>(null);

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = taxiNYCLocalUrl;

    executar(localNYCTaxiKpisConsulta(url))
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

    executar(localNYCTaxiVendorConsulta(url))
      .then((vendorData) => {
        opcaoVendor.value = {
          backgroundColor: "transparent",
          color: PALETA,
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { bottom: 0, type: "scroll" },
          series: [
            {
              type: "pie",
              radius: ["42%", "70%"],
              center: ["50%", "42%"],
              data: (vendorData as any[]).map(d => ({ name: d.vendor, value: d.total })),
              label: { show: false },
              emphasis: { label: { show: true, fontWeight: "bold" } },
            },
          ],
        };
      });

    executar(localNYCTaxiPassageirosConsulta(url))
      .then((passageirosData) => {
        const paxLabels = (passageirosData as any[]).map(d => `${d.passageiros} pax`);
        const paxValues = (passageirosData as any[]).map(d => d.total);
        opcaoPassageiros.value = {
          ...baseChart,
          color: [COR_SECUNDARIA],
          xAxis: { type: "category", data: paxLabels, axisLabel: { fontSize: 11 } },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: paxValues, name: "Corridas", barMaxWidth: 48 }],
        };
      });

    executar(localNYCTaxiDistanciaConsulta(url))
      .then((distanciaData) => {
        const distLabels = (distanciaData as any[]).map(d => `${d.milhas}mi`);
        const distValues = (distanciaData as any[]).map(d => d.total);
        opcaoDistancia.value = {
          ...baseChart,
          color: [COR_TERCIARIA],
          xAxis: { type: "category", data: distLabels, axisLabel: { fontSize: 10, rotate: 45 } },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: distValues, name: "Corridas" }],
        };
      });

    executar(localNYCTaxiValorConsulta(url))
      .then((valorData) => {
        const valorLabels = (valorData as any[]).map(d => `$${d.faixa}`);
        const valorValues = (valorData as any[]).map(d => d.total);
        opcaoValor.value = {
          ...baseChart,
          color: [COR_QUATERNARIA],
          xAxis: { type: "category", data: valorLabels, axisLabel: { fontSize: 10, rotate: 45 } },
          yAxis: { type: "value", axisLabel: { fontSize: 10 } },
          series: [{ type: "bar", data: valorValues, name: "Corridas" }],
        };
      });

    executar(localNYCTaxiHoraConsulta(url))
      .then((horaData) => {
        if (!horaData || horaData.length === 0) {
          opcaoHora.value = {};
          return;
        }
        const horaLabels = (horaData as any[]).map(d => `${String(d.hora).padStart(2, "0")}h`);
        const horaValues = (horaData as any[]).map(d => d.total);
        opcaoHora.value = {
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
      })
      .catch(() => {
        opcaoHora.value = {};
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

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoVendor,
    opcaoPassageiros,
    opcaoDistancia,
    opcaoValor,
    opcaoHora,
    fmtNumero,
    fmtDolar,
    fmtDolarDecimal,
  };
};
