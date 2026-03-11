<script
  setup
  lang="ts"
>
const { duckDBWasmInfo, estahCarregando } = useDuckDb()
</script>

<template>
  <UApp>
    <div class="pagina-principal relative">
      <!-- Fundo tech animado e grade -->
      <div class="absolute inset-0 -z-20 bg-gray-50 dark:bg-gray-950" />
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div class="absolute top-0 inset-x-0 h-[500px] -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary-500)_0%,transparent_70%)] opacity-20 dark:opacity-30 pointer-events-none" />

      <UHeader
        :toggle="false"
        :ui="{
          root:
            'h-12! shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl',
          container: 'h-full'
        }"
      >
        <template #left>
          <NuxtLink to="/">
            <AppLogo class="logo-aplicacao" />
          </NuxtLink>
        </template>

        <template #right>
          <UButton
            to="/pocs-v1"
            icon="i-lucide-layout-dashboard"
            label="Dashboards v1"
            color="neutral"
            variant="ghost"
            size="sm"
          />

          <UColorModeButton />

          <UButton
            to="https://github.com/jprando/nuxt-duckdb-wasm"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UHeader>

      <UMain class="area-principal relative z-10">
        <slot />
      </UMain>

      <div class="mt-auto shrink-0 relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
        <UFooter
          class="rodape-pagina"
          :ui="{
            container:
              'w-full max-w-(--ui-container) mx-auto px-4 sm:py-3 flex sm:gap-x-3 py-2',
            left: 'flex gap-x-1.5 order-1',
            center: 'order-2',
            right: 'flex gap-x-1.5 order-3 items-center'
          }"
        >
          <template #left>
            <p class="texto-copyright">
              Built with Nuxt UI • © {{ new Date().getFullYear() }}
            </p>
          </template>
          <template #right>
            <UProgress
              v-if="estahCarregando"
              size="sm"
              class="w-20"
            />
            <span
              v-else-if="duckDBWasmInfo"
              class="info-versao-duckdb px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono"
            >
              {{ duckDBWasmInfo }}
            </span>
          </template>
        </UFooter>
      </div>
    </div>
  </UApp>
</template>

<style scoped>
@reference "../assets/css/main.css";

.pagina-principal {
  @apply h-dvh flex flex-col overflow-hidden;
}

.logo-aplicacao {
  @apply w-auto h-6 shrink-0;
}

.area-principal {
  @apply flex-1 flex flex-col min-h-0 overflow-y-auto;
}

.texto-copyright {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.info-versao-duckdb {
  @apply text-[0.65rem] sm:text-xs text-gray-600 dark:text-gray-300 inline-block;
}
</style>
