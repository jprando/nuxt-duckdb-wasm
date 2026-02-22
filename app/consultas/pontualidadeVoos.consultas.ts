export const ontimeKpisConsulta = (url: string) => `
  SELECT
    COUNT(*)                                                                                          AS total_voos,
    ROUND(AVG(Distance), 0)                                                                           AS distancia_media,
    ROUND(AVG(CASE WHEN Depdelay > 0 THEN Depdelay ELSE NULL END), 1)                                AS atraso_medio_partida,
    ROUND(AVG(CASE WHEN Arrdelay > 0 THEN Arrdelay ELSE NULL END), 1)                                AS atraso_medio_chegada,
    ROUND(SUM(Cancelled) * 100.0 / COUNT(*), 2)                                                      AS taxa_cancelamento,
    ROUND(SUM(CASE WHEN Cancelled = 0 AND Depdel15 = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)   AS pct_pontuais
  FROM '${url}'
`;

export const ontimeCompanhiasConsulta = (url: string) => `
  SELECT
    Carrier,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY Carrier
  ORDER BY total DESC
  LIMIT 15
`;

export const ontimeStatusConsulta = (url: string) => `
  SELECT
    CASE
      WHEN Cancelled = 1 THEN 'Cancelado'
      WHEN Diverted  = 1 THEN 'Desviado'
      WHEN Depdel15  = 1 THEN 'Atrasado (>15min)'
      ELSE 'Pontual'
    END AS status,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY status
  ORDER BY total DESC
`;

export const ontimeDiaSemanaConsulta = (url: string) => `
  SELECT
    Dayofweek,
    ROUND(AVG(CASE WHEN Depdelay > 0 THEN Depdelay ELSE NULL END), 1) AS atraso_medio,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Cancelled = 0
  GROUP BY Dayofweek
  ORDER BY Dayofweek
`;

export const ontimeMensalConsulta = (url: string) => `
  SELECT
    Month,
    COUNT(*) AS total,
    ROUND(AVG(CASE WHEN Depdelay > 0 THEN Depdelay ELSE NULL END), 1) AS atraso_medio
  FROM '${url}'
  GROUP BY Month
  ORDER BY Month
`;

export const ontimeAtrasoPartidaConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(Depdelay / 15) * 15 AS INTEGER) AS faixa_min,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Cancelled = 0
    AND Depdelay IS NOT NULL
    AND Depdelay >= 0
    AND Depdelay <= 360
  GROUP BY faixa_min
  ORDER BY faixa_min
`;

export const ontimeDistanciaConsulta = (url: string) => `
  SELECT
    Distancegroup,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Distancegroup IS NOT NULL
  GROUP BY Distancegroup
  ORDER BY Distancegroup
`;

export const ontimeAeroportosConsulta = (url: string) => `
  SELECT
    Origin,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY Origin
  ORDER BY total DESC
  LIMIT 12
`;

export const ontimeCancelamentosConsulta = (url: string) => `
  SELECT
    Carrier,
    ROUND(SUM(Cancelled) * 100.0 / COUNT(*), 2) AS taxa_cancelamento,
    COUNT(*) AS total_voos
  FROM '${url}'
  GROUP BY Carrier
  HAVING COUNT(*) > 10000
  ORDER BY taxa_cancelamento DESC
  LIMIT 12
`;

export const ontimeHoraPartidaConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(Crsdeptime / 100) AS INTEGER) AS hora,
    ROUND(AVG(CASE WHEN Depdelay > 0 THEN Depdelay ELSE NULL END), 1) AS atraso_medio,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Crsdeptime IS NOT NULL
    AND Crsdeptime >= 0
    AND Cancelled = 0
  GROUP BY hora
  HAVING hora BETWEEN 0 AND 23
  ORDER BY hora
`;

export const ontimeRadarCompanhiasConsulta = (url: string) => `
  SELECT
    Carrier,
    COUNT(*) AS total_voos,
    ROUND(SUM(CASE WHEN Cancelled = 0 AND Depdel15 = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS pct_pontual,
    ROUND(SUM(Cancelled) * 100.0 / COUNT(*), 2) AS pct_cancelado,
    ROUND(AVG(CASE WHEN Depdelay > 0 THEN Depdelay ELSE NULL END), 1) AS atraso_medio,
    ROUND(AVG(Distance), 0) AS distancia_media
  FROM '${url}'
  GROUP BY Carrier
  HAVING COUNT(*) > 50000
  ORDER BY total_voos DESC
  LIMIT 8
`;

export const ontimeSankeyConsulta = (url: string) => `
  SELECT
    Carrier AS companhia,
    CASE
      WHEN Cancelled = 1 THEN 'Cancelado'
      WHEN Diverted  = 1 THEN 'Desviado'
      WHEN Depdel15  = 1 THEN 'Atrasado (>15min)'
      ELSE 'Pontual'
    END AS status,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY Carrier, status
  ORDER BY Carrier, total DESC
`;
