/**
 * Lazy-loaded components para reduzir tamanho do bundle principal.
 * ECharts (~300KB) é carregado dinamicamente apenas quando necessário.
 */

// defineLazyHydrationComponent nao funciona com SSR off, que eh o caso desse projeto

export const LazyGraficoCard = defineAsyncComponent(() => import('~/components/GraficoCard.vue'))

export const LazyGraficoEChart = defineAsyncComponent(() => import('~/components/GraficoEChart.vue'))

export const LazyGraficoEChartBase = defineAsyncComponent(() => import('~/components/GraficoEChartBase.vue'))

export const LazyGraficoEChartBarra = defineAsyncComponent(() => import('~/components/GraficoEChartBarra.vue'))

export const LazyGraficoEChartLinha = defineAsyncComponent(() => import('~/components/GraficoEChartLinha.vue'))

export const LazyGraficoEChartPizza = defineAsyncComponent(() => import('~/components/GraficoEChartPizza.vue'))

export const LazyGraficoEChartRadar = defineAsyncComponent(() => import('~/components/GraficoEChartRadar.vue'))

export const LazyGraficoEChartSankey = defineAsyncComponent(() => import('~/components/GraficoEChartSankey.vue'))

export const LazyGraficoEChartChord = defineAsyncComponent(() => import('~/components/GraficoEChartChord.vue'))

export const LazyGraficoEChartHeatmap = defineAsyncComponent(() => import('~/components/GraficoEChartHeatmap.vue'))
