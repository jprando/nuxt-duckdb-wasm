// KPI's
export const dutchTrainServicesKpisConsulta = (url: string) => `
  SELECT
    COUNT(DISTINCT Service_id)                    AS total_services,
    COUNT(DISTINCT Station_name)                  AS total_stations,
    COUNT(DISTINCT Train_number)                  AS total_trains,
    CAST(MIN(Departure_time) AS VARCHAR)          AS periodo_inicio,
    CAST(MAX(Departure_time) AS VARCHAR)          AS periodo_fim
  FROM read_parquet('${url}');
`

// Gráfico de Tipos de Trem
export const dutchTrainServicesTypeConsulta = (url: string) => `
  SELECT
    Type,
    COUNT(*) as total
  FROM read_parquet('${url}')
  GROUP BY Type
  ORDER BY total DESC;
`

// Gráfico de Estações mais movimentadas
export const dutchTrainServicesBusiestStationsConsulta = (url: string) => `
  SELECT
    Station_name,
    COUNT(*) AS count
  FROM read_parquet('${url}')
  GROUP BY Station_name
  ORDER BY count DESC
  LIMIT 10;
`

// Gráfico de Partidas por Hora
export const dutchTrainServicesDeparturesByHourConsulta = (url: string) => `
  SELECT
    EXTRACT(hour FROM Departure_time) AS hora,
    COUNT(*) AS total
  FROM read_parquet('${url}')
  WHERE Departure_time IS NOT NULL
  GROUP BY hora
  ORDER BY hora;
`

// Gráfico de Duração Média de Parada nas 10 Estações mais Movimentadas
export const dutchTrainServicesAvgStopDurationConsulta = (url: string) => `
  WITH station_counts AS (
    SELECT
      Station_name,
      COUNT(*) as total_events
    FROM read_parquet('${url}')
    GROUP BY Station_name
    ORDER BY total_events DESC
    LIMIT 10
  )
  SELECT
    s.Station_name,
    AVG(epoch(s.Departure_time - s.Arrival_time)) as avg_stop_seconds
  FROM read_parquet('${url}') as s
  JOIN station_counts sc ON s.Station_name = sc.Station_name
  WHERE s.Departure_time IS NOT NULL AND s.Arrival_time IS NOT NULL AND s.Departure_time > s.Arrival_time
  GROUP BY s.Station_name
  ORDER BY avg_stop_seconds DESC;
`
