<script
  setup
  lang="ts"
>
const {
  duckDBWasmInfo,
} = useDuckDb();
</script>

<template>
  <UApp>
    <div class="h-dvh flex flex-col overflow-hidden">
      <UHeader :toggle="false" :ui="{ root: 'h-12!', container: 'h-full' }">
        <template #left>
          <NuxtLink to="/">
            <AppLogo class="w-auto h-6 shrink-0" />
          </NuxtLink>
        </template>

        <template #right>
          <span
            v-if="duckDBWasmInfo"
            class="text-xs text-muted inline"
          >
            {{ duckDBWasmInfo }}
          </span>

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

      <UMain class="flex-1 flex flex-col min-h-0">
        <UContainer class="flex flex-1 flex-col min-h-0 pt-0 px-0.5 sm:pt-3">
          <UCard
            class="flex-1 flex flex-col min-h-0"
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
        class="relative md:top-2 p-0! -mt-1! lg:mt-0!"
        icon="i-simple-icons-nuxtdotjs"
      />
      <UFooter class="hidden md:block"
        :ui="{
          container:
            'w-full max-w-(--ui-container) mx-auto px-0 sm:py-2 flex sm:gap-x-3 py-0!',
          left: 'flex gap-x-1.5 order-1 mt-0',
          center: 'order-2',
          right: 'flex gap-x-1.5 order-3',
        }"
      >
        <template #left>
          <p class="text-sm text-muted">
            Built with Nuxt UI • © {{ new Date().getFullYear() }}
          </p>
        </template>
      </UFooter>
    </div>
  </UApp>
</template>
