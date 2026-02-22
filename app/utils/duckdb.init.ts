import { datasetsR2, duckDBDataProtocolHTTP, duckDBLogLevelWARNING } from "./duckdb.constantes";

export const duckDBWasmIniciar = (
  db: ShallowRef<unknown>,
  estahCarregando: WritableComputedRef<boolean>,
  duckDBWasmInfo: Ref<string>,
  warmupAtual: Ref<number>,
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

    // Registrar datasets R2 no VFS com AsyncBuffer persistente e preaquecer o
    // footer de cada arquivo (range request leve ~50KB). Queries subsequentes
    // pulam esse round trip e vão direto para os column chunks.
    const conn = await _db.connect();
    for (const { nome, url } of datasetsR2) {
     await _db.registerFileURL(nome, url, duckDBDataProtocolHTTP, false);
    }
    await Promise.allSettled(
      datasetsR2.map(({ nome }) =>
        conn.query(`SELECT COUNT(*) FROM '${nome}'`).then(() => {
          warmupAtual.value++;
        }),
      ),
    );
    await conn.close();

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
