<script
  setup
  lang="ts"
>
import type { NavigationMenuItem } from "@nuxt/ui";

const { duckDBWasmInfo } = useDuckDb();

const _collapsed = ref(false);

const navItens = computed<NavigationMenuItem[][]>(() => {
  return [
    [
      { label: "Dados", icon: "i-lucide-table-2", to: "/" },
    ].map(i => ({...i, class: "text-lg p-2.5 my-1.5"})),
    [
      {
        label: "NYC Taxi Jan/2024",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "550k",
        to: "/dashboard/localnyctaxi",
      },
      {
        label: "NYC Taxi Abr/2019",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "7.4Mi",
        to: "/dashboard/nycTaxi2019Apr",
      },
      {
        label: "NYC Taxi Jan/2010",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "14.8Mi",
        to: "/dashboard/nycTaxi2010Jan",
      },
      {
        label: "Serviços de Trem (Holanda)",
        icon: "i-lucide-train-track",
        badge: _collapsed.value ? undefined : "380k",
        to: "/dashboard/dutchTrainServices",
      },
      {
        label: "Tarifas Ferroviárias",
        icon: "i-lucide-euro",
        badge: _collapsed.value ? undefined : "158k",
        to: "/dashboard/railwayFares",
      },
      {
        label: "Shakespeare",
        icon: "i-lucide:scroll-text",
        badge: _collapsed.value ? undefined : "87k",
        to: "/dashboard/shakespeare",
      },
      {
        label: "Estações de Trem",
        icon: "i-lucide-building-2",
        badge: _collapsed.value ? undefined : "578",
        to: "/dashboard/trainStations",
      },
      {
        label: "Dados de Voos",
        icon: "i-lucide-plane",
        badge: _collapsed.value ? undefined : "4.3Mi",
        to: "/dashboard/ontime",
      },
    ].map(i => ({...i, class: "text-lg p-2.5 my-1.5"})),
  ];
});
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar
        collapsible
        :class="{ 'w-fit': !_collapsed }"
        @update:collapsed="(valor) => _collapsed = valor"
      >
        <template #header="{ collapsed }">
          <NuxtLink
            v-if="!collapsed"
            to="/"
          >
            <AppLogo class="h-5 w-auto" />
          </NuxtLink>
          <UDashboardSidebarCollapse
            class="text-dimmed absolute top-5"
            :icon="collapsed && 'i-simple-icons:nuxtdotjs'"
            :class="{ 'right-2': !collapsed, 'right-3': collapsed }"
          />
        </template>

        <template #toggle>
          <UDashboardSidebarToggle variant="soft" />
        </template>

        <UNavigationMenu
          :items="navItens"
          orientation="vertical"
          class="w-full data-[orientation=vertical]:w-full"
        />

        <template #footer>
          <div class="min-w-full flex flex-col gap-2 items-center">
            <USeparator />
            <span
              v-if="duckDBWasmInfo"
              class="text-[0.65rem] text-muted truncate transition-shadow"
              :class="_collapsed ? '[writing-mode:vertical-rl] rotate-180' : ''"
            >
              {{ duckDBWasmInfo }}
            </span>
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <UDashboardNavbar>
          <template #left>
            <slot name="titulo">
              <h1 class="text-sm font-semibold text-highlighted truncate">
                Dashboard
              </h1>
            </slot>
          </template>
          <template #right>
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
        </UDashboardNavbar>

        <UMain class="flex-1 overflow-y-auto">
          <slot />
        </UMain>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
