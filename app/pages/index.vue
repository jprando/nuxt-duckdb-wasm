<script
  setup
  lang="ts"
>
definePageMeta({ layout: "landing" });
</script>

<template>
  <UPage>
    <UPageHero
      title="Data Hub Analytics"
      description="Explore as capacidades de processamento de dados do DuckDB executado inteiramente no navegador via WebAssembly."
      :ui="{
        title:
          'text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-6 bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-primary-700 to-gray-900 dark:from-white dark:via-primary-300 dark:to-white',
        container:
          'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid py-24 sm:py-32 lg:py-24 gap-16 sm:gap-y-24',
      }"
    >
      <template #headline>
        <UBadge
          variant="subtle"
          size="lg"
          class="rounded-full mb-4"
        >
          <UIcon
            name="i-lucide-rocket"
            class="w-4 h-4 mr-2"
          />
          Nuxt 4 (v5) + DuckDB WASM
        </UBadge>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container:
          'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid py-16 sm:py-16 lg:py-16 gap-8 sm:gap-16',
      }"
    >
      <UPageGrid>
        <UPageCard
          to="/dados"
          title="Base de Dados"
          description="Ambiente de testes para ingestão de parquets e execução de queries SQL em memória."
          icon="i-lucide-database"
          class="group"
          spotlight
          spotlight-color="secondary"
        >
          <template #footer>
            <div class="flex items-center text-sm font-semibold transition-colors text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Iniciar testes <UIcon
                name="i-lucide-arrow-right"
                class="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </template>
        </UPageCard>

        <UPageCard
          to="/pocs-v1/taxiNYCLocal"
          title="Dashboards v1"
          description="Primeira geração de Provas de Conceito. Análises visuais de grandes volumes de dados."
          icon="i-lucide-layout-dashboard"
          class="group"
          spotlight
          spotlight-color="error"
        >
          <template #footer>
            <div class="flex items-center text-sm font-semibold transition-colors text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Acessar legado <UIcon
                name="i-lucide-arrow-right"
                class="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </template>
        </UPageCard>

        <UPageCard
          to="/pocs-v2"
          title="Dashboards v2"
          description="Próxima geração de visualizações. Foco em performance, novos componentes e features avançadas."
          icon="i-lucide-flask-conical"
          class="group"
          spotlight
        >
          <template #footer>
            <div class="flex items-center text-sm font-semibold transition-colors text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Explorar v2 <UIcon
                name="i-lucide-arrow-right"
                class="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>
  </UPage>
</template>
