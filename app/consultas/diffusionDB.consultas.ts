export const diffusionDBKpisConsulta = (url: string) => `
  SELECT
    COUNT(*)                                                            AS total_imagens,
    COUNT(DISTINCT user_name)                                           AS total_usuarios,
    ROUND(AVG(CASE WHEN image_nsfw > 0.5 THEN 1.0 ELSE 0.0 END) * 100, 1) AS pct_nsfw,
    ROUND(AVG(CAST(step AS DOUBLE)), 1)                                AS steps_medio,
    CAST(MIN(timestamp) AS VARCHAR)                                     AS periodo_inicio,
    CAST(MAX(timestamp) AS VARCHAR)                                     AS periodo_fim
  FROM '${url}'
`

export const diffusionDBDimensoesConsulta = (url: string) => `
  SELECT
    CAST(width AS VARCHAR) || 'x' || CAST(height AS VARCHAR) AS dimensao,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY dimensao
  ORDER BY total DESC
  LIMIT 10
`

export const diffusionDBNsfwConsulta = (url: string) => `
  SELECT
    CASE
      WHEN image_nsfw < 0.2 THEN 'Seguro (<0.2)'
      WHEN image_nsfw < 0.5 THEN 'Limítrofe (0.2–0.5)'
      WHEN image_nsfw < 0.8 THEN 'Suspeito (0.5–0.8)'
      ELSE 'NSFW (>0.8)'
    END AS categoria,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY categoria
  ORDER BY total DESC
`

export const diffusionDBStepsConsulta = (url: string) => `
  SELECT
    CAST(FLOOR(CAST(step AS INTEGER) / 10) * 10 AS INTEGER) AS faixa_inicio,
    COUNT(*) AS total
  FROM '${url}'
  WHERE step > 0
  GROUP BY faixa_inicio
  ORDER BY faixa_inicio
  LIMIT 25
`

export const diffusionDBSamplerConsulta = (url: string) => `
  SELECT
    CASE CAST(sampler AS INTEGER)
      WHEN 1 THEN 'k_lms'
      WHEN 2 THEN 'ddim'
      WHEN 3 THEN 'k_euler'
      WHEN 4 THEN 'k_euler_a'
      WHEN 5 THEN 'k_heun'
      WHEN 6 THEN 'plms'
      WHEN 7 THEN 'k_dpm_2'
      WHEN 8 THEN 'k_dpm_2_a'
      ELSE 'outro'
    END AS nome_sampler,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY nome_sampler
  ORDER BY total DESC
`

export const diffusionDBAtividadeHorariaConsulta = (url: string) => `
  SELECT
    CAST(EXTRACT(HOUR FROM timestamp) AS INTEGER) AS hora,
    COUNT(*) AS total
  FROM '${url}'
  GROUP BY hora
  ORDER BY hora
`
