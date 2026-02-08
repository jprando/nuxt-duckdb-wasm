export const selectDadosSimples = (
    pagina: number = 1,
    tamanhoPagina: number = duckDBItensPorPagina,
) => `
    SELECT range, random() as val
    FROM range(10_000)
    WHERE range % 2 = 0
    LIMIT ${tamanhoPagina || duckDBItensPorPagina} OFFSET ${
    (pagina - 1) * (tamanhoPagina || duckDBItensPorPagina)
}
`;

export const selectDadosParquet = (
    pagina: number = 1,
    tamanhoPagina: number = duckDBItensPorPagina,
) => `
    -- SELECT
    --   passenger_count,
    --   round(avg(tip_amount), 2) as avg_tip,
    --   count(*) as total_trips
    FROM 'remote_file.parquet'
    -- WHERE passenger_count IS NOT NULL
    -- GROUP BY passenger_count
    ORDER BY passenger_count ASC
    LIMIT ${tamanhoPagina || duckDBItensPorPagina} OFFSET ${
    (pagina - 1) * (tamanhoPagina || duckDBItensPorPagina)
}
`;
