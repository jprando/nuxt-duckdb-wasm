// export const DUCKDB_VERSION = "1.32.0";
export const duckDBDataProtocolHTTP = 4; // Protocolo HTTP para leitura de dados (vs. Fetch API ou File API)
export const duckDBItensPorPagina = 50; // Quantidade de itens a exibir por página na paginação dos resultados
export const duckDBLogLevelWARNING = 3; // Correspondente a LogLevel.WARNING em @duckdb/duckdb-wasm

const r2BaseUrl = "https://pub-1407a0cd06da4125aec80dc262085591.r2.dev";

// Nomes curtos registrados no VFS do DuckDB (usados nas queries após registerFileURL)
export const taxiNYCLocalParquet = "yellow_tripdata_2024-01.parquet";
export const trensHolandesParquet = "train_services.parquet";
export const tarifasFerroviariasParquet = "tariffs.parquet";
export const taxiNYCAbril2019Parquet = "taxi_2019_04.parquet";
export const taxiNYCJaneiro2010Parquet = "yellow_tripdata_2010-01.parquet";
export const shakespeareParquet = "shakespeare.parquet";
export const estacoesTremParquet = "stations.parquet";
export const pontualidadeVoosParquet = "ontime.parquet";
export const eletricidadeFinlandiaParquet = "electricity_finland_2021.parquet";
export const diffusionDBParquet = "diffusiondb_meta.parquet";
export const precosAcoesParquet = "prices_sample.parquet";

export const listaParquets = [
  taxiNYCLocalParquet,
  trensHolandesParquet,
  tarifasFerroviariasParquet,
  taxiNYCAbril2019Parquet,
  taxiNYCJaneiro2010Parquet,
  shakespeareParquet,
  estacoesTremParquet,
  pontualidadeVoosParquet,
  eletricidadeFinlandiaParquet,
  diffusionDBParquet,
  precosAcoesParquet,
];

// Mapeamento URL → nome para registro em lote no VFS (usado em duckdb.init.ts)
export const nomeUrlParquetsR2 = listaParquets.map((nome) => ({
  nome,
  url: `${r2BaseUrl}/${nome}`,
}));

// Ordem deve ser idêntica à de listaParquets acima
export const [
  taxiNYCLocalUrl,
  trensHolandesUrl,
  tarifasFerroviariasUrl,
  taxiNYCAbril2019Url,
  taxiNYCJaneiro2010Url,
  shakespeareUrl,
  estacoesTremUrl,
  pontualidadeVoosUrl,
  eletricidadeFinlandiaUrl,
  diffusionDBUrl,
  precosAcoesUrl,
] = listaParquets.map((nome) => `${r2BaseUrl}/${nome}`) as [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

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
  // IA Generativa
  {
    label: "DiffusionDB (IA Generativa)",
    url: diffusionDBUrl,
    grupo: "IA Generativa",
  },
  // Dados Financeiros
  {
    label: "Preços de Ações (Amostra)",
    url: precosAcoesUrl,
    grupo: "Financeiro",
  },
  // Energia
  {
    label: "Eletricidade Finlândia (Histórico)",
    url: eletricidadeFinlandiaUrl,
    grupo: "Energia",
  },
];
