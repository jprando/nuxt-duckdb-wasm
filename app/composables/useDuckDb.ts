const db = shallowRef<any>(null);
const _estahCarregando = ref(false);
const duckDBWasmInfo = ref("...");

let timerDebounce: number | undefined;

const estahCarregando = computed({
  get: () => _estahCarregando.value,
  set: (value: boolean) => {
    clearTimeout(timerDebounce);
    timerDebounce = window.setTimeout(() => {
      _estahCarregando.value = value;
    }, 400);
  },
});

export const useDuckDb = () => {
  const init = duckDBWasmInit(db, estahCarregando, duckDBWasmInfo);

  const execute = async (sql: string) => {
    if (!db.value) await init();

    estahCarregando.value = true;
    const conn = await db.value!.connect();
    try {
      // infoDev("#duckdb:query#", sql);
      const result = await conn.query(sql);
      return result.toArray().map((row: any) => sanitizeRow(row.toJSON()));
    } finally {
      await conn.close();
      estahCarregando.value = false;
    }
  };

  const obterDadosSimples = async (
    pagina: number = 1,
    itensPorPagina: number = duckDBItensPorPagina,
  ) => {
    const registros: any[] = await execute(
      selectDadosSimples(pagina, itensPorPagina),
    );
    return registros;
  };

  const obterDadosSimplesQuantidade = async () => {
    const [quantidade]: [{ total?: number }] = await execute(
      "FROM range(10_000) SELECT COUNT() AS total WHERE range % 2 = 0",
    );
    return quantidade?.total ?? 0;
  };

  const obterDadosParquet = async (
    pagina: number = 1,
    itensPorPagina: number = duckDBItensPorPagina,
    url: string = "",
  ) => {
    if (!url) return [];

    const absoluteUrl = url.startsWith("/") ? `${window.location.origin}${url}` : url;
    const registros: any[] = await execute(
      selectDadosParquet(absoluteUrl, pagina, itensPorPagina),
    );

    return registros;
  };

  const obterDadosParquetQuantidade = async (
    url: string = "",
  ) => {
    if (!url) return 0;

    const absoluteUrl = url.startsWith("/") ? `${window.location.origin}${url}` : url;
    const [quantidade]: [{ total?: number }] = await execute(
      `FROM '${absoluteUrl}' SELECT COUNT() AS total`,
    );

    return quantidade?.total ?? 0;
  };

  return {
    init,
    estahCarregando: readonly(estahCarregando),
    duckDBWasmInfo: duckDBWasmInfo,
    obterDadosSimples,
    obterDadosSimplesQuantidade,
    obterDadosParquet,
    obterDadosParquetQuantidade,
  };
};
