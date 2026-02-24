<script
  setup
  lang="ts"
>
import type { NavigationMenuItem } from "@nuxt/ui";

const { isFullscreen, toggle } = useFullscreen();

const { duckDBWasmInfo, cancelarConsulta, estahCarregando } = useDuckDb();

const _collapsed = ref(false);

const navItens = computed<NavigationMenuItem[][]>(() => {
  return [
    [
      { label: "Dados", icon: "i-lucide-table-2", to: "/dados" },
    ].map(i => ({
      ...i,
      class: [
        "text-md",
        "my-1.5",
        "-mx-1",
        "p-2.5",
        _collapsed.value ? "w-10" : "",
      ]
        .filter(Boolean)
        .join(" "),
      onSelect: cancelarConsulta,
    })),
    [
      {
        label: "NYC Taxi Jan/2024",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "550k",
        to: "/pocs-v1/taxiNYCLocal",
      },
      {
        label: "NYC Taxi Abr/2019",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "7.4Mi",
        to: "/pocs-v1/taxiNYCAbril2019",
      },
      {
        label: "NYC Taxi Jan/2010",
        icon: "i-lucide-layout-dashboard",
        badge: _collapsed.value ? undefined : "14.8Mi",
        to: "/pocs-v1/taxiNYCJaneiro2010",
      },
      {
        label: "Serviços de Trem (Holanda)",
        icon: "i-lucide-train-track",
        badge: _collapsed.value ? undefined : "380k",
        to: "/pocs-v1/trensHolandeses",
      },
      {
        label: "Tarifas Ferroviárias",
        icon: "i-lucide-euro",
        badge: _collapsed.value ? undefined : "158k",
        to: "/pocs-v1/tarifasFerroviarias",
      },
      {
        label: "Shakespeare",
        icon: "i-lucide:scroll-text",
        badge: _collapsed.value ? undefined : "87k",
        to: "/pocs-v1/shakespeare",
      },
      {
        label: "Estações de Trem",
        icon: "i-lucide-building-2",
        badge: _collapsed.value ? undefined : "578",
        to: "/pocs-v1/estacoesTrem",
      },
      {
        label: "Dados de Voos",
        icon: "i-lucide-plane",
        badge: _collapsed.value ? undefined : "4.3Mi",
        to: "/pocs-v1/pontualidadeVoos",
      },
      {
        label: "Eletricidade Finlândia",
        icon: "i-lucide-zap",
        badge: _collapsed.value ? undefined : "7,9k",
        to: "/pocs-v1/eletricidadeFinlandia",
      },
      {
        label: "DiffusionDB",
        icon: "i-lucide-image",
        badge: _collapsed.value ? undefined : "2Mi",
        to: "/pocs-v1/diffusionDB",
      },
    ].map(i => ({
      ...i,
      class: [
        "text-md",
        "my-1.5",
        "-mx-1",
        "p-2.5",
        _collapsed.value ? "w-10" : "",
      ]
        .filter(Boolean)
        .join(" "),
      onSelect: cancelarConsulta,
    })),
  ];
});

async function alternarFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
    return;
  }
  await document.exitFullscreen();
}
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
            <AppLogo class="logo-aplicacao" />
          </NuxtLink>
          <UDashboardSidebarCollapse
            class="botao-colapso-sidebar"
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
          class="menu-navegacao-vertical"
        />

        <template #footer>
          <div class="rodape-sidebar">
            <!-- <USeparator /> -->
            <UProgress
              v-if="estahCarregando && !_collapsed"
              animation="swing"
              size="sm"
              class="w-full"
            />
            <span
              v-else-if="duckDBWasmInfo"
              class="info-versao-duckdb"
              :class="_collapsed ? '[writing-mode:vertical-rl] rotate-180' : ''"
            >
              {{ duckDBWasmInfo }}
            </span>
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel class="painel-principal">
        <UDashboardNavbar
          class="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
          :ui="{ wrapper: 'bg-transparent', root: 'bg-transparent' }"
        >
          <template #left>
            <slot name="titulo">
              <h1 class="titulo-dashboard">
                Dashboard
              </h1>
            </slot>
          </template>
          <template #right>
            <UButton
              v-if="isFullscreen"
              icon="i-lucide-shrink"
              size="xs"
              variant="ghost"
              color="neutral"
              aria-label="Fechar modo expandido"
              @click="toggle"
            />
            <UButton
              v-else
              icon="i-lucide-expand"
              aria-label="Expandir gráfico"
              color="neutral"
              variant="ghost"
              @click="toggle"
            />
            <USeparator
              orientation="vertical"
              class="block-5"
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
        </UDashboardNavbar>

        <UMain class="area-conteudo">
          <slot />
        </UMain>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>

<style scoped>
@reference "../assets/css/main.css";

.logo-aplicacao {
  @apply h-5 w-auto;
}

.botao-colapso-sidebar {
  @apply text-dimmed absolute top-5;
}

.menu-navegacao-vertical {
  @apply w-full data-[orientation=vertical]:w-full;
}

.rodape-sidebar {
  @apply min-w-full flex flex-col gap-2 items-center;
}

.info-versao-duckdb {
  @apply text-[0.65rem] text-muted truncate transition-shadow;
}

.titulo-dashboard {
  @apply text-sm font-semibold text-highlighted truncate;
}

.area-conteudo {
  @apply flex-1 overflow-y-auto;
}
</style>
