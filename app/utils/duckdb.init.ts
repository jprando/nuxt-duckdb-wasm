export const duckDBWasmIniciar = (
  db: ShallowRef<unknown>,
  estahCarregando: WritableComputedRef<boolean>,
  duckDBWasmInfo: Ref<string>,
) =>
async () => {
  // console.clear();

  if (!import.meta.client || db.value || estahCarregando.value) return;

  estahCarregando.value = true;

  try {
    const duckdb = await import("@duckdb/duckdb-wasm");

    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

    const version = JSDELIVR_BUNDLES.mvp!.mainModule.match(/duckdb-wasm@([\d.\-\w]+)\//)
      ?.[1] ?? "latest";

    // // COI bundle desabilitado: extensões (parquet, etc.) não são compiladas com shared memory,
    // // causando LinkError em wasm_threads. Bug aberto: https://github.com/duckdb/duckdb-wasm/issues/1916
    // // Quando corrigido, descomentar o bloco abaixo para reativar COI com multi-threading.
    // JSDELIVR_BUNDLES.coi = {
    //   mainModule: `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-coi.wasm`,
    //   mainWorker: `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-browser-coi.worker.js`,
    //   pthreadWorker:
    //     `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-browser-coi.pthread.worker.js`,
    // };

    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    // infoDev("Bundle selecionado:", JSON.stringify(bundle, null, 2));

    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: "text/javascript",
      }),
    );

    let pthreadWorkerUrl: string | null = null;
    if (bundle.pthreadWorker) {
      const res = await fetch(bundle.pthreadWorker);
      const blob = await res.blob();
      pthreadWorkerUrl = URL.createObjectURL(blob);
    }

    const logger = new duckdb.ConsoleLogger(duckDBLogLevelWARNING);
    const worker = new Worker(workerUrl);
    const _db = new duckdb.AsyncDuckDB(logger, worker);

    await _db.instantiate(bundle.mainModule, pthreadWorkerUrl);
    db.value = _db;
    const conn = await _db.connect();
    await conn.query(`
      INSTALL httpfs;
      LOAD httpfs;
      CREATE SECRET (
        TYPE r2,
        KEY_ID '795bc4564e26558db20d054f10ab0f7a',
        SECRET '3511e0909dfb4902485b5d5be2676742e22d5a5ef90fb2cd9ae09f16db987f03',
        ACCOUNT_ID '4948c0330a30de25bd62ed74721e547b'
      );
    `);

    const tipo = bundle.mainModule.match(/duckdb-(mvp|eh|coi)\.wasm/)?.[1]
      ?? "desconhecido";
    duckDBWasmInfo.value = `DuckDB WASM v${version} (${tipo})`;
    // infoDev(duckDBWasmInfo.value);
  } catch (error) {
    console.error("Falha ao instanciar DuckDB COI:", error);
  } finally {
    estahCarregando.value = false;
  }
};

export const duckDBWasmEncerrar = async (db: ShallowRef<unknown>) => {
  if (typeof db.value?.close === "function") {
    await db.value.close();
    console.info("Conexão encerrada.");
  }
};
