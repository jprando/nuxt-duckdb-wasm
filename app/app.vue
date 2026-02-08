<script
  setup
  lang="ts"
>
// import type { main } from "#build/ui";

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
  ],
  htmlAttrs: {
    lang: "ptBR",
  },
});

const title = "DuckDB - Nuxt Starter Template";
const description =
  "A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});

const { duckDBWasmInfo, estahCarregando } = useDuckDb();
</script>

<template>
  <UApp>
    <div class="h-dvh flex flex-col overflow-hidden">
      <UHeader :ui="{ root: 'h-12!', container: 'h-full' }">
        <template #left>
          <NuxtLink to="/">
            <AppLogo class="w-auto h-6 shrink-0" />
          </NuxtLink>
        </template>

        <template #right>
          <span
            v-if="duckDBWasmInfo"
            class="text-xs text-muted hidden sm:inline"
          >
            {{ duckDBWasmInfo }}
          </span>

          <UColorModeButton />
        </template>
      </UHeader>

      <UMain class="flex-1 flex flex-col min-h-0">
        <NuxtPage />
      </UMain>

      <USeparator
        class="relative top-1"
        icon="i-simple-icons-nuxtdotjs"
      />
      <UFooter
        :ui="{
          container:
            'w-full max-w-(--ui-container) mx-auto px-4 sm:px-8 py-8 sm:py-4 flex items-center justify-between sm:gap-x-3 pt-0! pb-1!',
          left: 'flex-1 flex items-center justify-start gap-x-1.5 order-1',
          right: 'flex-1 flex items-center justify-end gap-x-1.5 mt-3.5 order-3',
        }"
      >
        <template #left>
          <p class="text-sm text-muted">
            Built with Nuxt UI • © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <UButton
            to="https://github.com/jprando/nuxt-duckdb-wasm"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
            class="relative -top-1"
          />
        </template>
      </UFooter>
    </div>
  </UApp>
</template>
