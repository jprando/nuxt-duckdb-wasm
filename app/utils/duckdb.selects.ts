export const selectDadosSimples = (
  pagina: number = 1,
  tamanhoPagina: number = duckDBItensPorPagina,
) => `
    SELECT range, random() as val
    FROM range(10_000)
    WHERE range % 2 = 0
    LIMIT ${tamanhoPagina || duckDBItensPorPagina} OFFSET ${(pagina - 1) * (tamanhoPagina || duckDBItensPorPagina)}
`;

export const selectDadosParquet = (
  nomeArquivo: string,
  pagina: number = 1,
  tamanhoPagina: number = duckDBItensPorPagina,
) => `
    FROM '${nomeArquivo}'
    LIMIT ${tamanhoPagina || duckDBItensPorPagina} OFFSET ${(pagina - 1) * (tamanhoPagina || duckDBItensPorPagina)}
`;
