export const trainStationsKpisQuery = (url: string) => `
  SELECT
    COUNT(*)                                                                            AS total_estacoes,
    COUNT(DISTINCT Country)                                                             AS total_paises,
    COUNT(DISTINCT Type)                                                                AS total_tipos,
    COUNT(*) FILTER (WHERE Type = 'megastation')                                       AS megaestacoes,
    COUNT(*) FILTER (WHERE Country = 'NL')                                             AS estacoes_nl,
    COUNT(*) FILTER (WHERE Type IN ('intercitystation', 'knooppuntIntercitystation'))  AS estacoes_intercidade
  FROM '${url}'
`

export const trainStationsPaisesQuery = (url: string) => `
  SELECT
    Country,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Country IS NOT NULL
  GROUP BY Country
  ORDER BY total DESC
`

export const trainStationsTiposQuery = (url: string) => `
  SELECT
    Type,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Type IS NOT NULL
  GROUP BY Type
  ORDER BY total DESC
`

export const trainStationsCategoriasQuery = (url: string) => `
  SELECT
    CASE
      WHEN Type = 'megastation'               THEN 'Mega Estação'
      WHEN Type = 'knooppuntIntercitystation' THEN 'Intercidade (Nó)'
      WHEN Type = 'intercitystation'          THEN 'Intercidade'
      WHEN Type = 'knooppuntStoptreinstation' THEN 'Parada (Nó)'
      WHEN Type = 'stoptreinstation'          THEN 'Parada Local'
      WHEN Type = 'sneltreinstation'          THEN 'Trem Rápido'
      ELSE 'Outros'
    END AS categoria,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Type IS NOT NULL
  GROUP BY categoria
  ORDER BY total DESC
`

export const trainStationsLatitudeQuery = (url: string) => `
  SELECT
    CAST(FLOOR(Geo_lat) AS INTEGER) AS faixa_lat,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Geo_lat IS NOT NULL
  GROUP BY faixa_lat
  ORDER BY faixa_lat
`

export const trainStationsLongitudeQuery = (url: string) => `
  SELECT
    CAST(FLOOR(Geo_lng / 2) * 2 AS INTEGER) AS faixa_lng,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Geo_lng IS NOT NULL
  GROUP BY faixa_lng
  ORDER BY faixa_lng
`

export const trainStationsTiposPorPaisQuery = (url: string) => `
  SELECT
    Country,
    Type,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Country IN (
    SELECT Country FROM '${url}' GROUP BY Country ORDER BY COUNT(*) DESC LIMIT 6
  )
    AND Type IS NOT NULL
    AND Country IS NOT NULL
  GROUP BY Country, Type
  ORDER BY Country, total DESC
`
