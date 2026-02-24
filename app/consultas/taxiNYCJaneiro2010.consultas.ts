export const nycTaxi2010JanKpisConsulta = (url: string) => `
  SELECT
      COUNT(*)                                                              AS total_trips,
      ROUND(AVG(date_diff('minute', Pickup_datetime::TIMESTAMP, Dropoff_datetime::TIMESTAMP)), 1) AS avg_duration_min,
      ROUND(AVG(Tip_amount), 2)                                             AS avg_tip,
      ROUND(SUM(Total_amount), 0)                                           AS total_revenue,
      CAST(MIN(Pickup_datetime::TIMESTAMP) AS VARCHAR)                      AS periodo_inicio,
      CAST(MAX(Dropoff_datetime::TIMESTAMP) AS VARCHAR)                     AS periodo_fim
  FROM '${url}'
  WHERE Dropoff_datetime::TIMESTAMP > Pickup_datetime::TIMESTAMP
`;

export const nycTaxi2010JanVendorConsulta = (url: string) => `
  SELECT
    CASE Vendor_id
      WHEN 'VTS' THEN 'VTS (Verifone)'
      WHEN 'DDS' THEN 'DDS (Digital Dispatch)'
      WHEN 'CMT' THEN 'CMT (Creative Mobile)'
      ELSE Vendor_id
    END AS vendor,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Vendor_id IS NOT NULL
  GROUP BY Vendor_id, vendor
  ORDER BY total DESC
`;

export const nycTaxi2010JanPagamentoConsulta = (url: string) => `
  SELECT
    CASE UPPER(Payment_type)
      WHEN 'CAS' THEN 'Dinheiro'
      WHEN 'CRE' THEN 'Crédito'
      WHEN 'DIS' THEN 'Disputa'
      WHEN 'NOC' THEN 'Sem cobrança'
      ELSE 'Outro'
    END AS pagamento,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Payment_type IS NOT NULL
  GROUP BY UPPER(Payment_type), pagamento
  ORDER BY total DESC
`;

export const nycTaxi2010JanDistanciaConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(Trip_distance) AS INTEGER) AS milhas,
    COUNT(*)                              AS total
  FROM '${url}'
  WHERE Trip_distance IS NOT NULL
    AND Trip_distance >= 0
    AND Trip_distance < 30
  GROUP BY milhas
  ORDER BY milhas
`;

export const nycTaxi2010JanGorjetaConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(Tip_amount / 2) * 2 AS INTEGER) AS faixa,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Tip_amount IS NOT NULL
    AND Tip_amount >= 0
    AND Tip_amount < 30
  GROUP BY faixa
  ORDER BY faixa
`;

export const nycTaxi2010JanHoraConsulta = (url: string) => `
  SELECT
    EXTRACT(HOUR FROM Pickup_datetime::TIMESTAMP) AS hora,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Pickup_datetime IS NOT NULL
  GROUP BY hora
  ORDER BY hora;
`;
