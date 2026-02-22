// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    // "@nuxt/hints", // desabilitado: com ssr:false todos os componentes disparam o hint de lazy loading, tornando-o ruidoso e inútil
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "nuxt-bun-compile",
    "nuxt-echarts",
    "nuxt-vitalizer",
    "nuxt-monitoring",
  ],

  bunCompile: {
    outfile: "nuxtbin",
  },

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

  echarts: {
    renderer: "svg",
    charts: ["BarChart", "LineChart", "PieChart"],
    components: ["GridComponent", "TooltipComponent", "LegendComponent"],
    features: ["LabelLayout", "UniversalTransition"],
  },

  monitoring: {
    metrics: {
      enabled: import.meta.dev,
      path: "/metrics",
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
