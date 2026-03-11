import { describe, expect, it } from "vitest";
import { selectDadosParquet, selectDadosSimples } from "../../app/utils/duckdb.queries";

// Valor padrão de duckDBItensPorPagina usado nas queries
const ITENS_POR_PAGINA = 50;

// As queries usam a constante auto-importada duckDBItensPorPagina.
// No contexto de teste unitário (sem Nuxt), precisamos simular via globalThis.
globalThis.duckDBItensPorPagina = ITENS_POR_PAGINA;

describe("selectDadosSimples", () => {
  it("gera SQL com LIMIT e OFFSET para primeira página", () => {
    const sql = selectDadosSimples(1, 50);

    expect(sql).toContain("LIMIT 50");
    expect(sql).toContain("OFFSET 0");
    expect(sql).toContain("range(10_000)");
  });

  it("calcula OFFSET correto para segunda página", () => {
    const sql = selectDadosSimples(2, 50);

    expect(sql).toContain("OFFSET 50");
  });

  it("calcula OFFSET correto para página 5 com 20 itens", () => {
    const sql = selectDadosSimples(5, 20);

    expect(sql).toContain("LIMIT 20");
    expect(sql).toContain("OFFSET 80");
  });
});

describe("selectDadosParquet", () => {
  it("gera SQL com nome do arquivo e paginação", () => {
    const sql = selectDadosParquet("dados.parquet", 1, 50);

    expect(sql).toContain("FROM 'dados.parquet'");
    expect(sql).toContain("LIMIT 50");
    expect(sql).toContain("OFFSET 0");
  });

  it("calcula OFFSET correto para páginas posteriores", () => {
    const sql = selectDadosParquet("arquivo.parquet", 3, 25);

    expect(sql).toContain("OFFSET 50");
    expect(sql).toContain("LIMIT 25");
  });
});
