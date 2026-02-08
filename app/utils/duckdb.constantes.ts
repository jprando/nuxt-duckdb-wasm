// export const DUCKDB_VERSION = "1.32.0";
export const duckDBDataProtocolHTTP = 4;
export const duckDBItensPorPagina = 50;
export const parquetUrl = "/yellow_tripdata_2024-01.parquet";

export interface DatasetParquet {
  label: string;
  url: string;
  grupo: string;
}

export const datasetsParquet: DatasetParquet[] = [
  // Gerado em memória
  { label: "Dados simples (gerado)", url: "", grupo: "Local" },
  { label: "Parquet local (NYC Taxi)", url: parquetUrl, grupo: "Local" },
  // Dados de Táxi (NYC)
  { label: "NYC Taxi - Abr/2019", url: "https://blobs.duckdb.org/data/taxi_2019_04.parquet", grupo: "Táxi (NYC)" },
  { label: "NYC Taxi - Jan/2010", url: "https://blobs.duckdb.org/data/yellow_tripdata_2010-01.parquet", grupo: "Táxi (NYC)" },
  // Ferroviário (Holanda)
  { label: "Serviços de Trem (Holanda)", url: "https://blobs.duckdb.org/train_services.parquet", grupo: "Ferroviário" },
  { label: "Tarifas Ferroviárias", url: "https://blobs.duckdb.org/tariffs.parquet", grupo: "Ferroviário" },
  { label: "Estações de Trem", url: "https://blobs.duckdb.org/stations.parquet", grupo: "Ferroviário" },
  // Outros
  { label: "Corpus de Shakespeare", url: "https://blobs.duckdb.org/data/shakespeare.parquet", grupo: "Outros" },
  { label: "Dados de Voos (On-time)", url: "https://blobs.duckdb.org/data/ontime.parquet", grupo: "Outros" },
];
