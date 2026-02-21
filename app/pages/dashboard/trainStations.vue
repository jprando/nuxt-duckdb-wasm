<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-building-2"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Estações de Trem — Dashboard
        </h1>
        <UBadge
          label="578"
          color="primary"
          variant="subtle"
          size="sm"
        />
      </div>
    </template>

    <ViewDashboardTrainStations />
  </NuxtLayout>
</template>
