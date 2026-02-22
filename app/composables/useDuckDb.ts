const db = shallowRef<any>(null);
const estahCarregando = ref(false);
const duckDBWasmInfo = ref("...");
const warmupAtual = ref<number|null>(0);
const warmupTotal = datasetsR2.length;

let timerDebounce: number | undefined;
let _controller = new AbortController();

if (import.meta.client) {
  window.addEventListener("pagehide", () => duckDBWasmEncerrar(db));
}

export const useDuckDb = () => {
  const init = duckDBWasmIniciar(db, estahCarregando, duckDBWasmInfo, warmupAtual);

  const cancelarConsulta = () => {
    // console.info("#16 cancelarConsulta:invocado");
    _controller.abort();
    _controller = new AbortController();
  };

  const execute = async (sql: string, signal?: AbortSignal) => {
    const sinalEfetivo = signal ?? _controller.signal;
    if (!db.value) await init();
    if (sinalEfetivo.aborted) throw new DOMException("Consulta cancelada", "AbortError");

    estahCarregando.value = true;
    warmupAtual.value = null;
    const conn = await db.value!.connect();

    const onAbort = () => conn.cancelSent();
    sinalEfetivo.addEventListener("abort", onAbort);

    try {
      const resultado: any[] = [];
      const stream = await conn.send(sql);
      // const consultaId = crypto.randomUUID();
      for await (const batch of stream) {
        resultado.push(...batch.toArray().map((row: any) => sanitizeRow(row.toJSON())));
        if (sinalEfetivo.aborted) break;
        // console.info("#39 duckdb:batch:readed",consultaId);
      }

      if (sinalEfetivo.aborted) throw new DOMException("Consulta cancelada", "AbortError");

      return resultado;
    } finally {
      sinalEfetivo.removeEventListener("abort", onAbort);
      await conn.close();
      estahCarregando.value = false;
      warmupAtual.value = warmupTotal;
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
    executar: execute,
    cancelarConsulta,
    estahCarregando: readonly(estahCarregando),
    duckDBWasmInfo: duckDBWasmInfo,
    warmupAtual: readonly(warmupAtual),
    warmupTotal,
    obterDadosSimples,
    obterDadosSimplesQuantidade,
    obterDadosParquet,
    obterDadosParquetQuantidade,
  };
};
