export const eletricidadeFinlandiaKpisConsulta = (url: string) => `
  SELECT
    COUNT(*)                AS total_registros,
    ROUND(AVG(price), 2)   AS preco_medio,
    ROUND(MIN(price), 2)   AS preco_minimo,
    ROUND(MAX(price), 2)   AS preco_maximo,
    ROUND(STDDEV(price), 2)         AS desvio_padrao,
    CAST(MIN(time) AS VARCHAR)      AS periodo_inicio,
    CAST(MAX(time) AS VARCHAR)      AS periodo_fim
  FROM '${url}'
`

export const eletricidadeFinlandiaMensalConsulta = (url: string) => `
  SELECT
    CAST(EXTRACT(MONTH FROM time) AS INTEGER) AS mes,
    ROUND(AVG(price), 2) AS preco_medio,
    ROUND(MIN(price), 2) AS preco_min,
    ROUND(MAX(price), 2) AS preco_max
  FROM '${url}'
  GROUP BY mes
  ORDER BY mes
`

export const eletricidadeFinlandiaHorariaConsulta = (url: string) => `
  SELECT
    CAST(EXTRACT(HOUR FROM time) AS INTEGER) AS hora,
    ROUND(AVG(price), 2) AS preco_medio
  FROM '${url}'
  GROUP BY hora
  ORDER BY hora
`

export const eletricidadeFinlandiaSemanaisConsulta = (url: string) => `
  SELECT
    CAST(DATETRUNC('week', time::DATE) AS VARCHAR) AS semana,
    ROUND(AVG(price), 2) AS preco_medio,
    ROUND(MAX(price), 2) AS preco_max,
    ROUND(MIN(price), 2) AS preco_min
  FROM '${url}'
  GROUP BY semana
  ORDER BY semana
`

export const eletricidadeFinlandiaDistribuicaoConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(price / 20) * 20 AS INTEGER) AS faixa_inicio,
    COUNT(*) AS total
  FROM '${url}'
  WHERE price >= 0
  GROUP BY faixa_inicio
  ORDER BY faixa_inicio
`

export const eletricidadeFinlandiaCalendarioConsulta = (url: string) => `
  SELECT
    CAST(DATE_TRUNC('day', time) AS DATE) AS dia,
    ROUND(AVG(price), 2) AS preco_medio
  FROM '${url}'
  GROUP BY dia
  ORDER BY dia
`
