export const sanitizeRow = (row: Record<string, unknown>) => {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    obj[key] = typeof value === "bigint" ? Number(value) : value;
  }
  return obj;
};
