<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });

useHead({
  title: "Dashboard - Tarifas Ferroviárias",
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="flex items-center gap-2 cursor-default">
        <UIcon
          name="i-lucide-euro"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Tarifas Ferroviárias
        </h1>
        <UTooltip text="158.802 registros">
          <UBadge
            label="158k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardRailwayFares />
  </NuxtLayout>
</template>
