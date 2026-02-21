<script
  setup
  lang="ts"
>
const { duckDBWasmInfo } = useDuckDb();

const _collapsed = ref(false);

const navItens = [
  [
    { label: "Dados", icon: "i-lucide-table-2", to: "/" },
  ],
  [
    {
      label: "NYC Taxi Jan/2024",
      icon: "i-lucide-layout-dashboard",
      badge: "550k",
      to: "/dashboard/localnyctaxi",
    },
    {
      label: "NYC Taxi Abr/2019",
      icon: "i-lucide-layout-dashboard",
      badge: "7.4Mi",
      to: "/dashboard/nycTaxi2019Apr",
    },
    {
      label: "NYC Taxi Jan/2010",
      icon: "i-lucide-layout-dashboard",
      badge: "14.8Mi",
      to: "/dashboard/nycTaxi2010Jan",
    },
    {
      label: "Serviços de Trem (Holanda)",
      icon: "i-lucide-train-track",
      badge: "380k",
      to: "/dashboard/dutchTrainServices",
    },
    {
      label: "Tarifas Ferroviárias",
      icon: "i-lucide-euro",
      badge: "158k",
      to: "/dashboard/railwayFares",
    },
    {
      label: "Shakespeare",
      icon: "i-lucide:scroll-text",
      badge: "87k",
      to: "/dashboard/shakespeare",
    },
    {
      label: "Estações de Trem",
      icon: "i-lucide-building-2",
      badge: "578",
      to: "/dashboard/trainStations",
    },
  ],
];
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
            :class="{ 'right-2': !collapsed, 'right-3': collapsed }"
          />
        </template>

        <template #toggle>
          <UDashboardSidebarToggle variant="subtle" />
        </template>

        <UNavigationMenu
          orientation="vertical"
          :items="navItens"
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
