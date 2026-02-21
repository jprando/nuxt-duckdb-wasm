interface Kpis {
  total_lines: number;
  total_plays: number;
  total_speakers: number;
  avg_words_per_line: number;
}

const COR_PRIMARIA = "#3b82f6";
const COR_SECUNDARIA = "#10b981";
const COR_TERCIARIA = "#f59e0b";
const COR_QUATERNARIA = "#8b5cf6";
const PALETA = [COR_PRIMARIA, COR_SECUNDARIA, COR_TERCIARIA, COR_QUATERNARIA, "#f43f5e", "#14b8a6"];

export const useShakespeare = () => {
  const { executar, init } = useDuckDb();
  const colorMode = useColorMode();

  const temaGrafico = computed(() => colorMode.value === "dark" ? "dark" : "");

  // ─── Estado ───────────────────────────────────────────────────────────────

  const carregando = ref(true);
  const erro = ref<string | null>(null);

  const kpis = ref<Kpis>({
    total_lines: 0,
    total_plays: 0,
    total_speakers: 0,
    avg_words_per_line: 0,
  });

  const opcaoPecas = ref<Record<string, unknown>>({});
  const opcaoPersonagens = ref<Record<string, unknown>>({});
  const opcaoAto = ref<Record<string, unknown>>({});
  const opcaoElenco = ref<Record<string, unknown>>({});
  const opcaoComprimento = ref<Record<string, unknown>>({});

  // ─── Carregamento ─────────────────────────────────────────────────────────

  const carregarDados = () => {
    carregando.value = true;
    erro.value = null;

    const url = shakespeareUrl;

    const promises = [
      executar(shakespeareKpisQuery(url))
        .then(([kpisData]) => {
          kpis.value = kpisData as Kpis;
        }),

      executar(shakespearePecasQuery(url))
        .then((data) => {
          const rows = data as { peca: string; total: number }[];
          const pecas = rows.map(d => d.peca).reverse();
          const totais = rows.map(d => d.total).reverse();
          opcaoPecas.value = {
            backgroundColor: "transparent",
            color: [COR_PRIMARIA],
            tooltip: { trigger: "axis" },
            grid: { top: 16, right: 24, bottom: 8, left: 8, containLabel: true },
            xAxis: { type: "value", axisLabel: { fontSize: 10 } },
            yAxis: { type: "category", data: pecas, axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: totais, name: "Linhas" }],
          };
        }),

      executar(shakespearePersonagensQuery(url))
        .then((data) => {
          const rows = data as { personagem: string; total: number }[];
          const personagens = rows.map(d => d.personagem).reverse();
          const totais = rows.map(d => d.total).reverse();
          opcaoPersonagens.value = {
            backgroundColor: "transparent",
            color: [COR_SECUNDARIA],
            tooltip: { trigger: "axis" },
            grid: { top: 16, right: 24, bottom: 8, left: 8, containLabel: true },
            xAxis: { type: "value", axisLabel: { fontSize: 10 } },
            yAxis: { type: "category", data: personagens, axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: totais, name: "Falas" }],
          };
        }),

      executar(shakespeareAtoQuery(url))
        .then((data) => {
          const rows = data as { ato: string; total: number }[];
          const atos = rows.map(d => `Ato ${d.ato}`);
          const totais = rows.map(d => d.total);
          opcaoAto.value = {
            backgroundColor: "transparent",
            color: [COR_TERCIARIA],
            tooltip: { trigger: "axis" },
            grid: { top: 16, right: 16, bottom: 32, left: 56, containLabel: false },
            xAxis: { type: "category", data: atos, axisLabel: { fontSize: 11 } },
            yAxis: { type: "value", axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: totais, name: "Linhas" }],
          };
        }),

      executar(shakespeareElencoQuery(url))
        .then((data) => {
          const rows = data as { peca: string; personagens: number }[];
          const pecas = rows.map(d => d.peca).reverse();
          const totais = rows.map(d => d.personagens).reverse();
          opcaoElenco.value = {
            backgroundColor: "transparent",
            color: [COR_QUATERNARIA],
            tooltip: { trigger: "axis" },
            grid: { top: 16, right: 24, bottom: 8, left: 8, containLabel: true },
            xAxis: { type: "value", axisLabel: { fontSize: 10 } },
            yAxis: { type: "category", data: pecas, axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: totais, name: "Personagens" }],
          };
        }),

      executar(shakespeareComprimentoQuery(url))
        .then((data) => {
          const rows = data as { faixa: number; total: number }[];
          const labels = rows.map(d => `${d.faixa}–${d.faixa + 19}`);
          const totais = rows.map(d => d.total);
          opcaoComprimento.value = {
            backgroundColor: "transparent",
            color: [PALETA[4]],
            tooltip: { trigger: "axis" },
            grid: { top: 16, right: 16, bottom: 48, left: 56, containLabel: false },
            xAxis: { type: "category", data: labels, axisLabel: { fontSize: 9, rotate: 45 } },
            yAxis: { type: "value", axisLabel: { fontSize: 10 } },
            series: [{ type: "bar", data: totais, name: "Linhas" }],
          };
        }),
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
  const fmtDecimal = (n: number) =>
    new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

  return {
    carregando,
    erro,
    kpis,
    temaGrafico,
    opcaoPecas,
    opcaoPersonagens,
    opcaoAto,
    opcaoElenco,
    opcaoComprimento,
    fmtNumero,
    fmtDecimal,
  };
};
