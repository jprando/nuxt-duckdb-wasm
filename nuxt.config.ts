// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],

  devtools: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2025-01-15",

  future: {
    compatibilityVersion: 5,
  },

  experimental: {
    viewTransition: true,
  },

  nitro: {
    ...import.meta.env.NITRO_PRESET === "bun"
      ? {
        // preparacao para rodar bun:compile em seguida para gerar um binario standalone
        preset: "bun",
        noExternals: true,
        inlineDynamicImports: true,
        serveStatic: "inline",
        esbuild: {
          options: {
            target: "esnext",
          },
        },
        rollupConfig: {
          external: [
            "sharp",
            /^@img\//,
            "css-tree",
            "csso",
            "svgo",
            "mdn-data",
            /^mdn-data\//,
            /^css-tree\//,
          ],
        },
      }
      : {},
    experimental: {
      wasm: true,
    },
    routeRules: {
      "/**": {
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["@duckdb/duckdb-wasm"],
    },

    worker: {
      format: "es",
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
