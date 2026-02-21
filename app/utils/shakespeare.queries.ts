export const shakespeareKpisQuery = (url: string) => `
  SELECT
    COUNT(*)                                                          AS total_lines,
    COUNT(DISTINCT Play_name)                                         AS total_plays,
    COUNT(DISTINCT Speaker)                                           AS total_speakers,
    ROUND(AVG(len(string_split(Text_entry, ' '))), 1)                AS avg_words_per_line
  FROM '${url}'
  WHERE Text_entry IS NOT NULL
    AND TRIM(Text_entry) != ''
`

export const shakespearePecasQuery = (url: string) => `
  SELECT
    Play_name AS peca,
    COUNT(*)  AS total
  FROM '${url}'
  GROUP BY Play_name
  ORDER BY total DESC
  LIMIT 10
`

export const shakespearePersonagensQuery = (url: string) => `
  SELECT
    Speaker   AS personagem,
    COUNT(*)  AS total
  FROM '${url}'
  WHERE Speaker IS NOT NULL
    AND TRIM(Speaker) != ''
  GROUP BY Speaker
  ORDER BY total DESC
  LIMIT 15
`

export const shakespeareAtoQuery = (url: string) => `
  SELECT
    SPLIT_PART(Line_number, '.', 1) AS ato,
    COUNT(*)                        AS total
  FROM '${url}'
  WHERE Line_number IS NOT NULL
    AND TRIM(Line_number) != ''
  GROUP BY ato
  ORDER BY ato
`

export const shakespeareElencoQuery = (url: string) => `
  SELECT
    Play_name                       AS peca,
    COUNT(DISTINCT Speaker)         AS personagens
  FROM '${url}'
  WHERE Speaker IS NOT NULL
    AND TRIM(Speaker) != ''
  GROUP BY Play_name
  ORDER BY personagens DESC
  LIMIT 10
`

export const shakespeareComprimentoQuery = (url: string) => `
  SELECT
    CAST(FLOOR(LENGTH(Text_entry) / 20) * 20 AS INTEGER) AS faixa,
    COUNT(*) AS total
  FROM '${url}'
  WHERE Text_entry IS NOT NULL
    AND LENGTH(Text_entry) > 0
    AND LENGTH(Text_entry) <= 300
  GROUP BY faixa
  ORDER BY faixa
`
