const sanitizeRow = (row: Record<string, unknown>) => {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    obj[key] = typeof value === "bigint" ? Number(value) : value;
  }
  return obj;
};

const parquetUrl = "/yellow_tripdata_2024-01.parquet";

const selectDadosSimples = (pagina: number, tamanhoPagina: number = 50) => `
    SELECT range, random() as val
    FROM range(10000)
    WHERE range % 2 = 0
    LIMIT ${tamanhoPagina} OFFSET ${pagina * tamanhoPagina}
  `;

const selectDadosParquet = (pagina: number, tamanhoPagina: number = 50) => `
    -- SELECT
    --   passenger_count,
    --   round(avg(tip_amount), 2) as avg_tip,
    --   count(*) as total_trips
    FROM 'remote_file.parquet'
    -- WHERE passenger_count IS NOT NULL
    -- GROUP BY passenger_count
    ORDER BY passenger_count ASC
    LIMIT ${tamanhoPagina} OFFSET ${pagina * tamanhoPagina}
  `;

export const useDuckDb = () => {
  const db = shallowRef<any>(null);
  const estahInicializando = ref(false);
  const estahCarregando = ref(false);
  const duckDBDataProtocolHTTP = 4;

  const init = async () => {
    if (!import.meta.client || db.value || estahInicializando.value) return;
    estahInicializando.value = true;

    try {
      const duckdb = await import("@duckdb/duckdb-wasm");
      const wasmUrl = (await import("@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url")).default;
      const workerUrl = (await import("@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url")).default;

      const logger = new duckdb.ConsoleLogger();
      const worker = new Worker(workerUrl);
      const _db = new duckdb.AsyncDuckDB(logger, worker);

      await _db.instantiate(wasmUrl);

      db.value = _db;
    } catch (error) {
      console.error("Falha ao instanciar DuckDB COI:", error);
    } finally {
      estahInicializando.value = false;
    }
  };

  const execute = async (sql: string) => {
    if (!db.value) await init();

    const conn = await db.value!.connect();
    try {
      const result = await conn.query(sql);
      return result.toArray().map((row: any) => sanitizeRow(row.toJSON()));
    } finally {
      await conn.close();
    }
  };

  const queryRemoteParquet = async (url: string, sql: string) => {
    if (!db.value) await init();

    // Registra o arquivo no sistema de arquivos virtual (HTTP FS)
    await db.value!.registerFileURL("remote_file.parquet", url, duckDBDataProtocolHTTP, false);

    const conn = await db.value!.connect();
    try {
      // O DuckDB lê apenas o necessário via Range Requests
      const result = await conn.query(sql);
      return result.toArray().map((row: any) => sanitizeRow(row.toJSON()));
    } finally {
      await conn.close();
    }
  };

  const obterDadosSimples = async (pagina: number = 0, tamanhoPagina: number = 50) => {
    estahCarregando.value = true;
    try {
      const registros = await execute(selectDadosSimples(pagina, tamanhoPagina));
      const [quantidade] = await execute("FROM range(10000) SELECT COUNT() AS total");
      return { registros, quantidadeTotal: quantidade?.total ?? 0 };
    } finally {
      estahCarregando.value = false;
    }
  };

  const obterDadosParquet = async (pagina: number = 0, tamanhoPagina: number = 50) => {
    estahCarregando.value = true;
    try {
      const registros = await queryRemoteParquet(parquetUrl, selectDadosParquet(pagina, tamanhoPagina));
      const [quantidade] = await execute("FROM 'remote_file.parquet' SELECT COUNT() AS total");
      return { registros, quantidadeTotal: quantidade?.total ?? 0 };
    } finally {
      estahCarregando.value = false;
    }
  };

  return { estahInicializando, estahCarregando, execute, queryRemoteParquet, obterDadosSimples, obterDadosParquet };
};
