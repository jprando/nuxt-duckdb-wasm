// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    // "@nuxt/hints", // desabilitado: com ssr:false todos os componentes disparam o hint de lazy loading, tornando-o ruidoso e inútil
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    'nuxt-bun-compile',
    'nuxt-echarts',
    'nuxt-vitalizer',
    'nuxt-monitoring',
    '@vueuse/nuxt'
  ],
  ssr: false,

  components: {
    // Desabilitar auto-import de componentes com gráficos para reduzir bundle (~300KB do ECharts)
    dirs: [
      {
        path: '~/components',
        // Excluir GraficoCard e todos os GraficoEChart* da auto-importação
        // Usar app/utils/lazy-components.ts para import explícito com defineAsyncComponent
        ignore: ['Grafico*']
      }
    ]
  },

  imports: {
    dirs: ['consultas']
  },

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 5
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    experimental: {
      wasm: true
    },
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp'
        }
      }
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['@duckdb/duckdb-wasm', 'echarts']
    },

    worker: {
      format: 'es'
    }
  },

  bunCompile: {
    outfile: 'nuxtbin'
  },

  echarts: {
    renderer: 'svg',
    charts: ['BarChart', 'LineChart', 'PieChart'],
    components: ['GridComponent', 'TooltipComponent', 'LegendComponent'],
    features: ['LabelLayout', 'UniversalTransition']
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  monitoring: {
    metrics: {
      enabled: import.meta.dev,
      path: '/metrics'
    }
  }
})
