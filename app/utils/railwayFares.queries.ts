// KPI's
export const railwayFaresKpisQuery = (url: string) => `
  WITH stations AS (
      SELECT Station1 as station FROM read_parquet('${url}')
      UNION
      SELECT Station2 as station FROM read_parquet('${url}')
  )
  SELECT
      (SELECT COUNT(*) FROM read_parquet('${url}')) as total_routes,
      (SELECT COUNT(*) FROM stations) as total_stations,
      (SELECT AVG(Price) FROM read_parquet('${url}')) as avg_price,
      (SELECT MIN(Price) FROM read_parquet('${url}')) as min_price,
      (SELECT MAX(Price) FROM read_parquet('${url}')) as max_price;
`;

// Gráfico de Distribuição de Preços
export const railwayFaresPriceDistributionQuery = (url: string) => `
  SELECT
      floor(Price / 20) * 20 as price_bucket,
      COUNT(*) as count
  FROM read_parquet('${url}')
  GROUP BY price_bucket
  ORDER BY price_bucket;
`;

// Gráfico de Rotas mais Caras
export const railwayFaresMostExpensiveRoutesQuery = (url: string) => `
  SELECT
      Station1 || ' → ' || Station2 as route,
      Price
  FROM read_parquet('${url}')
  ORDER BY Price DESC
  LIMIT 10;
`;

// Gráfico de Estações mais Conectadas
export const railwayFaresBusiestStationsQuery = (url: string) => `
  WITH all_stations AS (
      SELECT Station1 as station FROM read_parquet('${url}')
      UNION ALL
      SELECT Station2 as station FROM read_parquet('${url}')
  )
  SELECT
      station,
      COUNT(*) as appearances
  FROM all_stations
  GROUP BY station
  ORDER BY appearances DESC
  LIMIT 10;
`;
