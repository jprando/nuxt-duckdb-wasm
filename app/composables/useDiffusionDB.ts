interface Kpis {
  total_imagens: number;
  total_usuarios: number;
  pct_nsfw: number;
  steps_medio: number;
  periodo_inicio: string;
  periodo_fim: string;
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";
const COR_QUATERNARIA = "#8b5cf6";

const PALETA_NSFW = ["#10b981", "#f59e0b", "#f97316", "#f43f5e"];

const baseChart = {
  backgroundColor: "transparent",
  grid: { top: 32, right: 16, bottom: 48, left: 72 },
  tooltip: { trigger: "axis" as const },
};

export const useDiffusionDB = () => {
  const { executar, init, registrarParquet } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregandoKpis = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_imagens: 0,
    total_usuarios: 0,
    pct_nsfw: 0,
    steps_medio: 0,
    periodo_inicio: "",
    periodo_fim: "",
  });

  const opcaoDimensoes = ref<Record<string, unknown> | null>(null);
  const opcaoNsfw = ref<Record<string, unknown> | null>(null);
  const opcaoSteps = ref<Record<string, unknown> | null>(null);
  const opcaoSampler = ref<Record<string, unknown> | null>(null);
  const opcaoAtividade = ref<Record<string, unknown> | null>(null);

  // ─── Configuração dos Gráficos ────────────────────────────────────────────

  const configurarGraficoDimensoes = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => d.dimensao).reverse();
    const values = rows.map(d => d.total).reverse();
    opcaoDimensoes.value = {
      ...baseChart,
      color: [COR_PRIMARIA],
      xAxis: { type: "value", axisLabel: { fontSize: 10 } },
      yAxis: { type: "category", data: labels, axisLabel: { fontSize: 10, fontWeight: "bold" } },
      series: [{ type: "bar", data: values, name: "Imagens" }],
    };
  };

  const configurarGraficoNsfw = (data: any[]) => {
    opcaoNsfw.value = {
      backgroundColor: "transparent",
      color: PALETA_NSFW,
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
  };

  const configurarGraficoSteps = (data: any[]) => {
    const rows = data as any[];
    opcaoSteps.value = {
      ...baseChart,
      grid: { top: 16, right: 16, bottom: 48, left: 56 },
      color: [COR_TERCIARIA],
      xAxis: {
        type: "category",
        data: rows.map(d => `${d.faixa_inicio}–${(d.faixa_inicio as number) + 9}`),
        axisLabel: { fontSize: 10, rotate: 45 },
      },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: rows.map(d => d.total), name: "Imagens" }],
    };
  };

  const configurarGraficoSampler = (data: any[]) => {
    const rows = data as any[];
    const labels = rows.map(d => d.nome_sampler).reverse();
    const values = rows.map(d => d.total).reverse();
    opcaoSampler.value = {
      ...baseChart,
      grid: { top: 16, right: 16, bottom: 8, left: 72 },
      color: [COR_QUATERNARIA],
      tooltip: { trigger: "axis" as const },
      xAxis: { type: "value", axisLabel: { fontSize: 10 } },
      yAxis: { type: "category", data: labels, axisLabel: { fontSize: 10, fontWeight: "bold" } },
      series: [{ type: "bar", data: values, name: "Imagens" }],
    };
  };

  const configurarGraficoAtividadeHoraria = (data: any[]) => {
    const rows = data as any[];
    opcaoAtividade.value = {
      ...baseChart,
      grid: { top: 16, right: 16, bottom: 48, left: 72 },
      color: [COR_SECUNDARIA],
      xAxis: {
        type: "category",
        data: rows.map(d => `${String(d.hora as number).padStart(2, "0")}h`),
        axisLabel: { fontSize: 10 },
      },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [{ type: "bar", data: rows.map(d => d.total), name: "Imagens" }],
    };
  };

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = async () => {
    carregandoKpis.value = true;
    erro.value = null;

    const url = diffusionDBUrl;
    const nomeArquivo = await registrarParquet(url);

    executar(diffusionDBKpisConsulta(nomeArquivo))
      .then(([row]) => {
        kpis.value = row as Kpis;
      })
      .catch((e) => {
        erro.value = `Erro ao carregar dados: ${e}`;
        console.error(e);
      })
      .finally(() => {
        carregandoKpis.value = false;
      });

    executar(diffusionDBDimensoesConsulta(nomeArquivo)).then(configurarGraficoDimensoes);
    executar(diffusionDBNsfwConsulta(nomeArquivo)).then(configurarGraficoNsfw);
    executar(diffusionDBStepsConsulta(nomeArquivo)).then(configurarGraficoSteps);
    executar(diffusionDBSamplerConsulta(nomeArquivo)).then(configurarGraficoSampler);
    executar(diffusionDBAtividadeHorariaConsulta(nomeArquivo)).then(configurarGraficoAtividadeHoraria);
  };

  onMounted(async () => {
    await init();
    carregarDados();
  });

  // ─── Formatação ───────────────────────────────────────────────────────────

  const fmtNumero = (n: number) => numeroSemCasaDecimal.format(n);
  const fmtDecimal = (n: number) =>
    new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
  const fmtData = (s: string) => s ? s.slice(0, 10) : "—";

  return {
    carregandoKpis,
    erro,
    kpis,
    temaGrafico,
    opcaoDimensoes,
    opcaoNsfw,
    opcaoSteps,
    opcaoSampler,
    opcaoAtividade,
    fmtNumero,
    fmtDecimal,
    fmtData,
  };
};
