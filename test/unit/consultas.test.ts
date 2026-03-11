import { describe, expect, it } from "vitest";
import {
  diffusionDBDimensoesConsulta,
  diffusionDBKpisConsulta,
  diffusionDBNsfwConsulta,
  diffusionDBSamplerConsulta,
  diffusionDBStepsConsulta,
} from "../../app/consultas/diffusionDB.consultas";
import {
  localNYCTaxiDistanciaConsulta,
  localNYCTaxiHoraConsulta,
  localNYCTaxiKpisConsulta,
  localNYCTaxiPassageirosConsulta,
  localNYCTaxiVendorConsulta,
} from "../../app/consultas/taxiNYCLocal.consultas";
import {
  eletricidadeFinlandiaCalendarioConsulta,
  eletricidadeFinlandiaDistribuicaoConsulta,
  eletricidadeFinlandiaHorariaConsulta,
  eletricidadeFinlandiaKpisConsulta,
  eletricidadeFinlandiaMensalConsulta,
  eletricidadeFinlandiaSemanaisConsulta,
} from "../../app/consultas/eletricidadeFinlandia.consultas";

const ARQUIVO_TESTE = "teste.parquet";

describe("consultas DiffusionDB", () => {
  it("KPIs inclui COUNT e FROM com o arquivo", () => {
    const sql = diffusionDBKpisConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("COUNT(*)");
    expect(sql).toContain(`FROM '${ARQUIVO_TESTE}'`);
  });

  it("dimensões agrupa por dimensão com LIMIT", () => {
    const sql = diffusionDBDimensoesConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("GROUP BY dimensao");
    expect(sql).toContain("LIMIT 10");
  });

  it("NSFW categoriza por faixas", () => {
    const sql = diffusionDBNsfwConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("CASE");
    expect(sql).toContain("categoria");
  });

  it("steps agrupa em faixas de 10", () => {
    const sql = diffusionDBStepsConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("faixa_inicio");
    expect(sql).toContain("FLOOR");
  });

  it("sampler mapeia códigos para nomes", () => {
    const sql = diffusionDBSamplerConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("k_lms");
    expect(sql).toContain("ddim");
    expect(sql).toContain("nome_sampler");
  });
});

describe("consultas Taxi NYC Local", () => {
  it("KPIs calcula distância e valor médios", () => {
    const sql = localNYCTaxiKpisConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("AVG(trip_distance)");
    expect(sql).toContain("AVG(total_amount)");
    expect(sql).toContain(`FROM '${ARQUIVO_TESTE}'`);
  });

  it("vendor agrupa por vendor_id", () => {
    const sql = localNYCTaxiVendorConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("GROUP BY vendor_id");
  });

  it("passageiros filtra entre 1 e 8", () => {
    const sql = localNYCTaxiPassageirosConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("BETWEEN 1 AND 8");
  });

  it("distância limita até 30 milhas", () => {
    const sql = localNYCTaxiDistanciaConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("trip_distance < 30");
  });

  it("hora extrai HOUR do pickup", () => {
    const sql = localNYCTaxiHoraConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("EXTRACT(HOUR FROM pickup_datetime)");
  });
});

describe("consultas Eletricidade Finlândia", () => {
  it("KPIs calcula estatísticas de preço", () => {
    const sql = eletricidadeFinlandiaKpisConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("AVG(price)");
    expect(sql).toContain("MIN(price)");
    expect(sql).toContain("MAX(price)");
    expect(sql).toContain("STDDEV(price)");
  });

  it("mensal agrupa por mês", () => {
    const sql = eletricidadeFinlandiaMensalConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("EXTRACT(MONTH FROM time)");
    expect(sql).toContain("ORDER BY mes");
  });

  it("horária agrupa por hora", () => {
    const sql = eletricidadeFinlandiaHorariaConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("EXTRACT(HOUR FROM time)");
    expect(sql).toContain("ORDER BY hora");
  });

  it("semanal trunca por semana", () => {
    const sql = eletricidadeFinlandiaSemanaisConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("DATETRUNC('week'");
    expect(sql).toContain("ORDER BY semana");
  });

  it("distribuição agrupa em faixas de 20", () => {
    const sql = eletricidadeFinlandiaDistribuicaoConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("FLOOR(price / 20)");
    expect(sql).toContain("faixa_inicio");
  });

  it("calendário agrupa por dia", () => {
    const sql = eletricidadeFinlandiaCalendarioConsulta(ARQUIVO_TESTE);
    expect(sql).toContain("DATE_TRUNC('day'");
    expect(sql).toContain("ORDER BY dia");
  });
});
