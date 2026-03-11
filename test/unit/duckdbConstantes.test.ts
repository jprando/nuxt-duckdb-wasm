import { describe, expect, it } from "vitest";
import {
  datasetsParquet,
  duckDBItensPorPagina,
  listaParquets,
  nomeUrlParquetsR2,
} from "../../app/utils/duckdb.constantes";

describe("duckDBItensPorPagina", () => {
  it("é 50", () => {
    expect(duckDBItensPorPagina).toBe(50);
  });
});

describe("listaParquets", () => {
  it("contém 11 arquivos parquet", () => {
    expect(listaParquets).toHaveLength(11);
  });

  it("todos os nomes terminam com .parquet", () => {
    for (const nome of listaParquets) {
      expect(nome).toMatch(/\.parquet$/);
    }
  });
});

describe("nomeUrlParquetsR2", () => {
  it("tem o mesmo número de itens que listaParquets", () => {
    expect(nomeUrlParquetsR2).toHaveLength(listaParquets.length);
  });

  it("cada item possui nome e url válida do R2", () => {
    for (const item of nomeUrlParquetsR2) {
      expect(item.nome).toMatch(/\.parquet$/);
      expect(item.url).toMatch(/^https:\/\/pub-.+\.r2\.dev\/.+\.parquet$/);
    }
  });
});

describe("datasetsParquet", () => {
  it("contém 12 datasets", () => {
    expect(datasetsParquet).toHaveLength(12);
  });

  it("todos os datasets possuem label e grupo", () => {
    for (const dataset of datasetsParquet) {
      expect(dataset.label).toBeTruthy();
      expect(dataset.grupo).toBeTruthy();
    }
  });

  it("o primeiro dataset (dados simples) tem url vazia", () => {
    expect(datasetsParquet[0].url).toBe("");
  });

  it("os demais datasets possuem url válida do R2", () => {
    for (const dataset of datasetsParquet.slice(1)) {
      expect(dataset.url).toMatch(/^https:\/\/.+\.parquet$/);
    }
  });
});
