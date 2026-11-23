/**
 * Lazy-loaded components para reduzir tamanho do bundle principal.
 */
// defineLazyHydrationComponent nao funciona com SSR off, que eh o caso desse projeto
export const LazyGraficoCard = defineAsyncComponent(() => import('~/components/GraficoCard.vue'))
