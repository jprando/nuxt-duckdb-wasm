export interface DatasetParquet {
  label: string
  url: string
  grupo: string
}

export type ItemSeletorDataset =
  | DatasetParquet
  | {
    type: 'label'
    label: string
  }
  | {
    type: 'separator'
  }

// Contrato mínimo dos métodos do DuckDB WASM usados na aplicação

export interface LoteDuckDBWasm {
  toArray(): Array<{ toJSON(): Record<string, unknown> }>
}

export interface ConexaoDuckDBWasm {
  send(sql: string): Promise<AsyncIterable<LoteDuckDBWasm>>
  close(): Promise<void>
}

export interface InstanciaDuckDBWasm {
  connect(): Promise<ConexaoDuckDBWasm>
  registerFileBuffer(nomeArquivo: string, buffer: Uint8Array): Promise<void>
  terminate(): Promise<void>
}
