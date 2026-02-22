// export const DUCKDB_VERSION = "1.32.0";
export const duckDBDataProtocolHTTP = 4; // Protocolo HTTP para leitura de dados (vs. Fetch API ou File API)
export const duckDBItensPorPagina = 50; // Quantidade de itens a exibir por página na paginação dos resultados
export const duckDBLogLevelWARNING = 3; // Correspondente a LogLevel.WARNING em @duckdb/duckdb-wasm
export const localNycTaxiParquetUrl = "/yellow_tripdata_2024-01.parquet";
export const dutchTrainServicesUrl = "https://blobs.duckdb.org/train_services.parquet";
export const railwayFaresUrl = "https://blobs.duckdb.org/tariffs.parquet";
export const nycTaxi2019AprUrl = "https://blobs.duckdb.org/data/taxi_2019_04.parquet";
export const nycTaxi2010JanUrl = "https://blobs.duckdb.org/data/yellow_tripdata_2010-01.parquet";
export const shakespeareUrl = "https://blobs.duckdb.org/data/shakespeare.parquet";
export const estacoesTremUrl = "https://blobs.duckdb.org/stations.parquet";
export const ontimeUrl = "https://blobs.duckdb.org/data/ontime.parquet";

export interface DatasetParquet {
  label: string;
  url: string;
  grupo: string;
}

export const datasetsParquet: DatasetParquet[] = [
  // Gerado em memória
  { label: "Dados simples (gerado)", url: "", grupo: "Local" },
  { label: "Parquet local (NYC Taxi)", url: localNycTaxiParquetUrl, grupo: "Local" },
  // Dados de Táxi (NYC)
  {
    label: "NYC Taxi - Abr/2019",
    url: nycTaxi2019AprUrl,
    grupo: "Táxi (NYC)",
  },
  {
    label: "NYC Taxi - Jan/2010",
    url: nycTaxi2010JanUrl,
    grupo: "Táxi (NYC)",
  },
  // Ferroviário (Holanda)
  {
    label: "Serviços de Trem (Holanda)",
    url: dutchTrainServicesUrl,
    grupo: "Ferroviário",
  },
  {
    label: "Tarifas Ferroviárias",
    url: railwayFaresUrl,
    grupo: "Ferroviário",
  },
  {
    label: "Estações de Trem",
    url: estacoesTremUrl,
    grupo: "Ferroviário",
  },
  // Outros
  {
    label: "Corpus de Shakespeare",
    url: shakespeareUrl,
    grupo: "Outros",
  },
  {
    label: "Dados de Voos (On-time)",
    url: ontimeUrl,
    grupo: "Outros",
  },
  // Amostras de Redes Sociais (Metadados)
  {
    label: "Amostra de Posts (HackerNews)",
    url: "https://huggingface.co/datasets/poloclub/diffusiondb/resolve/main/metadata.parquet",
    grupo: "Redes Sociais",
  },
  // Dados Financeiros (DuckDB Sample Data - Direto do S3 Público)
  {
    label: "Preços de Ações (Amostra)",
    url: "https://duckdb.org/data/prices.parquet",
    grupo: "Financeiro",
  },
  // GitHub Raw (Datasets de teste da comunidade)
  {
    label: "Eletricidade Finlândia (Histórico)",
    url: "https://raw.githubusercontent.com/kimmolinna/parquet_public/master/2021.parquet",
    grupo: "Energia",
  },
];
