<script
  setup
  lang="ts"
>
const { duckDBWasmInfo, estahCarregando } = useDuckDb();
</script>

<template>
  <UApp>
    <div class="pagina-principal">
      <UHeader
        :toggle="false"
        :ui="{ root: 'h-12!', container: 'h-full' }"
      >
        <template #left>
          <NuxtLink to="/">
            <AppLogo class="logo-aplicacao" />
          </NuxtLink>
        </template>

        <template #right>
          <UButton
            to="/pocs-v1/taxiNYCLocal"
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

      <UMain class="area-principal">
        <UContainer class="container-conteudo">
          <UCard
            class="card-conteudo"
            :ui="{
              header: 'p-2 sm:px-6',
              root: 'flex-1 flex flex-col min-h-0 ring-0! sm:ring-1!',
              body: 'flex-1 min-h-0 overflow-y-auto p-0!',
              footer: 'py-0! pt-1! sm:py-2!',
            }"
          >
            <template #header>
              <slot name="header" />
            </template>

            <template #default>
              <slot name="default" />
            </template>

            <template #footer>
              <slot name="footer" />
            </template>
          </UCard>
        </UContainer>
      </UMain>

      <USeparator
        class="separador-rodape"
        icon="i-simple-icons-nuxtdotjs"
      />
      <UFooter
        class="rodape-pagina"
        :ui="{
          container:
            'w-full max-w-(--ui-container) mx-auto px-0 sm:py-2 flex sm:gap-x-3 py-0!',
          left: 'flex gap-x-1.5 order-1 mt-0',
          center: 'order-2',
          right: 'flex gap-x-1.5 order-3',
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
            class="info-versao-duckdb"
          >
            {{ duckDBWasmInfo }}
          </span>
        </template>
      </UFooter>
    </div>
  </UApp>
</template>

<style scoped>
@reference "../assets/css/main.css";

.pagina-principal {
  @apply h-dvh flex flex-col overflow-hidden bg-linear-to-br from-default dark:to-muted light:to-accented;
}

.logo-aplicacao {
  @apply w-auto h-6 shrink-0;
}

.area-principal {
  @apply flex-1 flex flex-col min-h-0;
}

.container-conteudo {
  @apply flex flex-1 flex-col min-h-0 pt-0 px-0.5 sm:pt-3;
}

.card-conteudo {
  @apply flex-1 flex flex-col min-h-0;
}

.separador-rodape {
  @apply relative md:top-2 p-0! -mt-1! lg:mt-0!;
}

.rodape-pagina {
  @apply hidden md:block;
}

.texto-copyright {
  @apply text-sm text-muted;
}

.info-versao-duckdb {
  @apply text-[0.67rem] sm:text-xs text-dimmed inline;
}
</style>
