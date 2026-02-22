// export const DUCKDB_VERSION = "1.32.0";
export const duckDBDataProtocolHTTP = 4; // Protocolo HTTP para leitura de dados (vs. Fetch API ou File API)
export const duckDBItensPorPagina = 50; // Quantidade de itens a exibir por página na paginação dos resultados
export const duckDBLogLevelWARNING = 3; // Correspondente a LogLevel.WARNING em @duckdb/duckdb-wasm

const r2BaseUrl = "https://pub-1407a0cd06da4125aec80dc262085591.r2.dev";

// Nomes curtos registrados no VFS do DuckDB (usados nas queries após registerFileURL)
export const taxiNYCLocalNome = "yellow_tripdata_2024-01.parquet";
export const trensHolandesNome = "train_services.parquet";
export const tarifasFerroviariasNome = "tariffs.parquet";
export const taxiNYCAbril2019Nome = "taxi_2019_04.parquet";
export const taxiNYCJaneiro2010Nome = "yellow_tripdata_2010-01.parquet";
export const shakespeareNome = "shakespeare.parquet";
export const estacoesTremNome = "stations.parquet";
export const pontualidadeVoosNome = "ontime.parquet";

export const datasetNomes = [
  taxiNYCLocalNome,
  trensHolandesNome,
  tarifasFerroviariasNome,
  taxiNYCAbril2019Nome,
  taxiNYCJaneiro2010Nome,
  shakespeareNome,
  estacoesTremNome,
  pontualidadeVoosNome,
];

// Mapeamento URL → nome para registro em lote no VFS (usado em duckdb.init.ts)
export const datasetsR2 = datasetNomes.map((nome) => ({ nome, url: `${r2BaseUrl}/${nome}` }));

// Ordem deve ser idêntica à de datasetNomes acima
export const [
  taxiNYCLocalUrl,
  trensHolandesUrl,
  tarifasFerroviariasUrl,
  taxiNYCAbril2019Url,
  taxiNYCJaneiro2010Url,
  shakespeareUrl,
  estacoesTremUrl,
  pontualidadeVoosUrl,
] = datasetNomes.map((nome) => `${r2BaseUrl}/${nome}`) as [string, string, string, string, string, string, string, string];


export interface DatasetParquet {
  label: string;
  url: string;
  grupo: string;
}

export const datasetsParquet: DatasetParquet[] = [
  // Gerado em memória
  { label: "Dados simples (gerado)", url: "", grupo: "Local" },
  { label: "Parquet local (NYC Taxi)", url: taxiNYCLocalUrl, grupo: "Local" },
  // Dados de Táxi (NYC)
  {
    label: "NYC Taxi - Abr/2019",
    url: taxiNYCAbril2019Url,
    grupo: "Táxi (NYC)",
  },
  {
    label: "NYC Taxi - Jan/2010",
    url: taxiNYCJaneiro2010Url,
    grupo: "Táxi (NYC)",
  },
  // Ferroviário (Holanda)
  {
    label: "Serviços de Trem (Holanda)",
    url: trensHolandesUrl,
    grupo: "Ferroviário",
  },
  {
    label: "Tarifas Ferroviárias",
    url: tarifasFerroviariasUrl,
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
    url: pontualidadeVoosUrl,
    grupo: "Outros",
  },
  // Amostras de Redes Sociais (Metadados)
  {
    label: "Amostra de Posts (HackerNews)",
    url:
      "https://huggingface.co/datasets/poloclub/diffusiondb/resolve/main/metadata.parquet",
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
    url:
      "https://raw.githubusercontent.com/kimmolinna/parquet_public/master/2021.parquet",
    grupo: "Energia",
  },
];
