export const nycTaxi2019AprKpisQuery = (url: string) => `
  SELECT
    COUNT(*)                                                   AS total_trips,
    ROUND(AVG(date_diff('minute', Pickup_at, Dropoff_at)), 1)  AS avg_duration_min,
    ROUND(AVG(Tip_amount), 2)                                  AS avg_tip,
    ROUND(SUM(Total_amount), 0)                                AS total_revenue
  FROM '${url}'
  WHERE Dropoff_at > Pickup_at
`

export const nycTaxi2019AprTarifaQuery = (url: string) => `
  SELECT
    CASE Rate_code_id
      WHEN 1 THEN 'Padrão'
      WHEN 2 THEN 'JFK'
      WHEN 3 THEN 'Newark'
      WHEN 4 THEN 'Nassau/Westchester'
      WHEN 5 THEN 'Negociado'
      WHEN 6 THEN 'Grupo'
      ELSE 'Outro'
    END AS tarifa,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Rate_code_id IS NOT NULL
  GROUP BY Rate_code_id, tarifa
  ORDER BY total DESC
`

export const nycTaxi2019AprPagamentoQuery = (url: string) => `
  SELECT
    CASE Payment_type
      WHEN 1 THEN 'Crédito'
      WHEN 2 THEN 'Dinheiro'
      WHEN 3 THEN 'Sem cobrança'
      WHEN 4 THEN 'Disputa'
      WHEN 5 THEN 'Desconhecido'
      ELSE 'Outro'
    END AS pagamento,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Payment_type IS NOT NULL
  GROUP BY Payment_type, pagamento
  ORDER BY total DESC
`

export const nycTaxi2019AprDuracaoQuery = (url: string) => `
  SELECT
    CAST(FLOOR(date_diff('minute', Pickup_at, Dropoff_at) / 5) * 5 AS INTEGER) AS faixa_min,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Pickup_at IS NOT NULL
    AND Dropoff_at IS NOT NULL
    AND Dropoff_at > Pickup_at
    AND date_diff('minute', Pickup_at, Dropoff_at) BETWEEN 1 AND 120
  GROUP BY faixa_min
  ORDER BY faixa_min
`

export const nycTaxi2019AprGorjetaQuery = (url: string) => `
  SELECT
    CAST(FLOOR(Tip_amount / 2) * 2 AS INTEGER) AS faixa,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Tip_amount IS NOT NULL
    AND Tip_amount >= 0
    AND Tip_amount < 30
  GROUP BY faixa
  ORDER BY faixa
`

export const nycTaxi2019AprHoraQuery = (url: string) => `
  SELECT
    CAST(EXTRACT(HOUR FROM Pickup_at) AS INTEGER) AS hora,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Pickup_at IS NOT NULL
  GROUP BY hora
  ORDER BY hora
`
