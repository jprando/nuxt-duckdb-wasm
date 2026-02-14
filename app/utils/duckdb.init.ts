export const duckDBWasmInit = (
  db: ShallowRef<unknown>,
  estahCarregando: WritableComputedRef<boolean>,
  duckDBWasmInfo: Ref<string>,
) =>
async () => {
  console.clear();

  if (!import.meta.client || db.value || estahCarregando.value) return;

  estahCarregando.value = true;

  try {
    const duckdb = await import("@duckdb/duckdb-wasm");

    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

    const version = JSDELIVR_BUNDLES.mvp!.mainModule.match(/duckdb-wasm@([\d.\-\w]+)\//)?.[1] ?? "latest";

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
      new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" }),
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

    const tipo = bundle.mainModule.match(/duckdb-(mvp|eh|coi)\.wasm/)?.[1] ?? "desconhecido";
    duckDBWasmInfo.value = `DuckDB WASM v${version} (${tipo})`;
    // infoDev(duckDBWasmInfo.value);
  } catch (error) {
    console.error("Falha ao instanciar DuckDB COI:", error);
  } finally {
    estahCarregando.value = false;
  }
};
