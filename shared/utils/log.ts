export const infoDev = (...args: unknown[]) => {
  if (import.meta.dev) console.info(...args);
};
