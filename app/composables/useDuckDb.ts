const db = shallowRef<any>(null);
const estahCarregando = ref(false);
const duckDBWasmInfo = ref("...");
const parquetsRegistrados = new Set<string>();

if (import.meta.client) {
  window.addEventListener("pagehide", () => duckDBWasmEncerrar(db));
}

export const useDuckDb = () => {
  const init = duckDBWasmIniciar(db, estahCarregando, duckDBWasmInfo);

  const executar = async (sql: string) => {
    if (!db.value) await init();

    estahCarregando.value = true;
    const conn = await db.value!.connect();

    try {
      const resultado: any[] = [];
      const stream = await conn.send(sql);
      for await (const batch of stream) {
        resultado.push(...batch.toArray().map((row: any) => sanitizeRow(row.toJSON())));
      }
      return resultado;
    } finally {
      // await conn.close();
      estahCarregando.value = false;
    }
  };

  const registrarParquet = async (url: string): Promise<string> => {
    if (!db.value) await init();

    const nomeArquivo = url.split("/").pop()!;
    if (parquetsRegistrados.has(nomeArquivo)) return nomeArquivo;

    const cache = await caches.open("parquet-cache-v1");
    let response = await cache.match(url);

    if (!response) {
      response = await fetch(url);
      try {
        await cache.put(url, response.clone());
      } catch {
        // Arquivo muito grande para o Cache API — prosseguir sem cache
      }
    }

    const buffer = await response.arrayBuffer();
    await db.value!.registerFileBuffer(nomeArquivo, new Uint8Array(buffer));
    parquetsRegistrados.add(nomeArquivo);

    return nomeArquivo;
  };

  const obterDadosSimples = async (
    pagina: number = 1,
    itensPorPagina: number = duckDBItensPorPagina,
  ) => {
    const registros: any[] = await executar(
      selectDadosSimples(pagina, itensPorPagina),
    );
    return registros;
  };

  const obterDadosSimplesQuantidade = async () => {
    const [quantidade]: [{ total?: number }] = await executar(
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
    const nomeArquivo = await registrarParquet(url);
    const registros: any[] = await executar(
      selectDadosParquet(nomeArquivo, pagina, itensPorPagina),
    );

    return registros;
  };

  const obterDadosParquetQuantidade = async (url: string = "") => {
    if (!url) return 0;

    const nomeArquivo = await registrarParquet(url);
    const [quantidade]: [{ total?: number }] = await executar(
      `FROM '${nomeArquivo}' SELECT COUNT() AS total`,
    );

    return quantidade?.total ?? 0;
  };

  return {
    init,
    executar,
    registrarParquet,
    estahCarregando: readonly(estahCarregando),
    duckDBWasmInfo: duckDBWasmInfo,
    obterDadosSimples,
    obterDadosSimplesQuantidade,
    obterDadosParquet,
    obterDadosParquetQuantidade,
  };
};
