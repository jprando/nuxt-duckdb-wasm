export const numeroSemCasaDecimal = new Intl.NumberFormat("pt-BR", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  currency: "BRL",
});

export const dolarSemCasaDecimal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const dolarComDuasCasas = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const euroSemCasaDecimal = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatarData = (s: string) => (s ? s.slice(0, 10) : "—");
