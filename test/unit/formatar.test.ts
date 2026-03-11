import { describe, expect, it } from "vitest";
import {
  dolarComDuasCasas,
  dolarSemCasaDecimal,
  euroSemCasaDecimal,
  formatarData,
  numeroSemCasaDecimal,
} from "../../shared/utils/formatar";

describe("numeroSemCasaDecimal", () => {
  it("formata número inteiro em pt-BR", () => {
    expect(numeroSemCasaDecimal.format(1000)).toBe("1.000");
  });

  it("remove casas decimais", () => {
    expect(numeroSemCasaDecimal.format(1234.56)).toBe("1.235");
  });

  it("formata zero", () => {
    expect(numeroSemCasaDecimal.format(0)).toBe("0");
  });
});

describe("dolarSemCasaDecimal", () => {
  it("formata em dólar sem decimais", () => {
    const resultado = dolarSemCasaDecimal.format(1500);
    expect(resultado).toContain("1,500");
    expect(resultado).toContain("$");
  });
});

describe("dolarComDuasCasas", () => {
  it("formata em dólar com duas casas decimais", () => {
    const resultado = dolarComDuasCasas.format(42.5);
    expect(resultado).toContain("42.50");
    expect(resultado).toContain("$");
  });
});

describe("euroSemCasaDecimal", () => {
  it("formata em euro sem decimais", () => {
    const resultado = euroSemCasaDecimal.format(2500);
    expect(resultado).toContain("2.500");
    expect(resultado).toContain("€");
  });
});

describe("formatarData", () => {
  it("formata string ISO em data pt-BR", () => {
    // Usar horário ao meio-dia para evitar mudança de dia por fuso horário
    const resultado = formatarData("2024-01-15T12:00:00Z");
    expect(resultado).toMatch(/15\/01\/2024/);
  });

  it("formata objeto Date em pt-BR", () => {
    const data = new Date(2024, 5, 20); // 20 de junho de 2024
    const resultado = formatarData(data);
    expect(resultado).toMatch(/20\/06\/2024/);
  });

  it("retorna traço para string vazia", () => {
    expect(formatarData("")).toBe("-");
  });

  it("retorna traço para data inválida", () => {
    expect(formatarData("nao-e-data")).toBe("-");
  });
});
