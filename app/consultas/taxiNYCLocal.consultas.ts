export const localNYCTaxiKpisConsulta = (url: string) => `
  SELECT
    COUNT(*)                                    AS total_trips,
    ROUND(AVG(trip_distance), 2)                AS avg_distance,
    ROUND(AVG(total_amount), 2)                 AS avg_amount,
    ROUND(SUM(total_amount), 0)                 AS total_revenue,
    CAST(MIN(pickup_datetime) AS VARCHAR)        AS periodo_inicio,
    CAST(MAX(pickup_datetime) AS VARCHAR)        AS periodo_fim
  FROM '${url}'
`;

export const localNYCTaxiVendorConsulta = (url: string) => `
  SELECT
    'Vendor ' || CAST(vendor_id AS VARCHAR) AS vendor,
    COUNT(*)                                AS total
  FROM '${url}'
  WHERE vendor_id IS NOT NULL
  GROUP BY vendor_id
  ORDER BY vendor_id
`;

export const localNYCTaxiPassageirosConsulta = (url: string) => `
  SELECT
    CAST(passenger_count AS INTEGER) AS passageiros,
    COUNT(*)                         AS total
  FROM '${url}'
  WHERE passenger_count IS NOT NULL
    AND passenger_count BETWEEN 1 AND 8
  GROUP BY passageiros
  ORDER BY passageiros
`;

export const localNYCTaxiDistanciaConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(trip_distance) AS INTEGER) AS milhas,
    COUNT(*)                              AS total
  FROM '${url}'
  WHERE trip_distance IS NOT NULL
    AND trip_distance >= 0
    AND trip_distance < 30
  GROUP BY milhas
  ORDER BY milhas
`;

export const localNYCTaxiValorConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(total_amount / 10) * 10 AS INTEGER) AS faixa,
    COUNT(*)                                       AS total
  FROM '${url}'
  WHERE total_amount IS NOT NULL
    AND total_amount >= 0
    AND total_amount < 200
  GROUP BY faixa
  ORDER BY faixa
`;

export const localNYCTaxiHoraConsulta = (url: string) => `
  SELECT
    CAST(EXTRACT(HOUR FROM pickup_datetime) AS INTEGER) AS hora,
    COUNT(*)                                            AS total
  FROM '${url}'
  WHERE pickup_datetime IS NOT NULL
  GROUP BY hora
  ORDER BY hora
`;
