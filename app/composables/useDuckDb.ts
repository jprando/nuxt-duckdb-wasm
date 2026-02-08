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
    }, 800);
  },
});

export const useDuckDb = () => {
  const init = duckDBWasmInit(db, estahCarregando, duckDBWasmInfo);

  const execute = async (sql: string) => {
    if (!db.value) await init();

    const conn = await db.value!.connect();
    try {
      estahCarregando.value = true;
      // infoDev("#duckdb:query#", sql);
      const result = await conn.query(sql);
      return result.toArray().map((row: any) => sanitizeRow(row.toJSON()));
    } finally {
      await conn.close();
      estahCarregando.value = false;
    }
  };

  const arquivosRegistrados = new Set<string>();

  /** Registra URL no sistema de arquivos virtual do DuckDB (HTTP FS) e retorna o nome do arquivo virtual. */
  const registrarArquivoRemoto = async (url: string) => {
    if (!db.value) await init();

    const absoluteUrl = url.startsWith("/") ? `${window.location.origin}${url}` : url;
    const nomeArquivo = absoluteUrl.split("/").pop() || "remote.parquet";

    if (!arquivosRegistrados.has(nomeArquivo)) {
      await db.value!.registerFileURL(
        nomeArquivo,
        absoluteUrl,
        duckDBDataProtocolHTTP,
        false,
      );
      arquivosRegistrados.add(nomeArquivo);
    }

    return nomeArquivo;
  };

  const obterDadosSimples = async (
    pagina: number = 1,
    tamanhoPagina: number = 50,
  ) => {
    try {
      const registros = await execute(
        selectDadosSimples(pagina, duckDBItensPorPagina),
      );
      const [quantidade] = await execute(
        "FROM range(10_000) SELECT COUNT() AS total WHERE range % 2 = 0",
      );
      return { registros, quantidadeTotal: quantidade?.total ?? 0 };
    } finally {
      selectDadosSimples;
      estahCarregando.value = false;
    }
  };

  const obterDadosParquet = async (
    pagina: number = 1,
    tamanhoPagina: number = 50,
    url: string = parquetUrl,
  ) => {
    try {
      const nomeArquivo = await registrarArquivoRemoto(url);
      const registros = await execute(
        selectDadosParquet(nomeArquivo, pagina, duckDBItensPorPagina),
      );
      const [quantidade] = await execute(
        `FROM '${nomeArquivo}' SELECT COUNT() AS total`,
      );
      return { registros, quantidadeTotal: quantidade?.total ?? 0 };
    } finally {
      estahCarregando.value = false;
    }
  };

  return {
    estahCarregando,
    duckDBWasmInfo,
    execute,
    registrarArquivoRemoto,
    obterDadosSimples,
    obterDadosParquet,
  };
};
