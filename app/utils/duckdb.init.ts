import type { Ref, ShallowRef } from 'vue'
import type { InstanciaDuckDBWasm } from '~/types/duckdb.types'
import { duckDBLogLevelWARNING } from './duckdb.constantes'

export const duckDBWasmIniciar = (
  db: ShallowRef<InstanciaDuckDBWasm | null>,
  estahCarregando: Ref<boolean>,
  duckDBWasmInfo: Ref<string>
) => {
  return async () => {
    // console.clear();

    if (!import.meta.client || db.value || estahCarregando.value) return

    estahCarregando.value = true

    try {
      const duckdb = await import('@duckdb/duckdb-wasm')

      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles()

      const version = JSDELIVR_BUNDLES.mvp!.mainModule.match(/duckdb-wasm@([\d.\-\w]+)\//)
        ?.[1] ?? 'latest'

      // // COI bundle desabilitado: extensões (parquet, etc.) não são compiladas com shared memory,
      // // causando LinkError em wasm_threads. Bug aberto: https://github.com/duckdb/duckdb-wasm/issues/1916
      // // Quando corrigido, descomentar o bloco abaixo para reativar COI com multi-threading.
      // JSDELIVR_BUNDLES.coi = {
      //   mainModule: `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-coi.wasm`,
      //   mainWorker: `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-browser-coi.worker.js`,
      //   pthreadWorker:
      //     `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@${version}/dist/duckdb-browser-coi.pthread.worker.js`,
      // };

      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES)

      // infoDev("Bundle selecionado:", JSON.stringify(bundle, null, 2));

      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], {
          type: 'text/javascript'
        })
      )

      let pthreadWorkerUrl: string | null = null
      if (bundle.pthreadWorker) {
        const res = await fetch(bundle.pthreadWorker)
        const blob = await res.blob()
        pthreadWorkerUrl = URL.createObjectURL(blob)
      }

      const logger = new duckdb.ConsoleLogger(duckDBLogLevelWARNING)
      const worker = new Worker(workerUrl)
      const _db = new duckdb.AsyncDuckDB(logger, worker)

      await _db.instantiate(bundle.mainModule, pthreadWorkerUrl)
      // Cast necessário: AsyncDuckDB do pacote usa assinaturas genéricas (ex.: send<T>)
      // incompatíveis estruturalmente com InstanciaDuckDBWasm, mas implementa todos os métodos.
      db.value = _db as unknown as InstanciaDuckDBWasm

      const _conn = await _db.connect()
      // await _conn.close();

      const tipo = bundle.mainModule.match(/duckdb-(mvp|eh|coi)\.wasm/)?.[1]
        ?? 'desconhecido'
      duckDBWasmInfo.value = `DuckDB WASM v${version} (${tipo})`
      // infoDev(duckDBWasmInfo.value);
    } catch (error) {
      console.error('Falha ao instanciar DuckDB COI:', error)
    } finally {
      estahCarregando.value = false
    }
  }
}

export const duckDBWasmEncerrar = async (db: ShallowRef<InstanciaDuckDBWasm | null>) => {
  if (typeof db.value?.terminate === 'function') {
    await db.value.terminate()
    console.info('Conexão encerrada.')
  }
}
