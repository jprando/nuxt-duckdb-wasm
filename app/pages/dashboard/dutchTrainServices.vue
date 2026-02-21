<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });

useHead({
  title: "Dashboard - Serviços de Trem (Holanda)",
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-train-track"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Serviços de Trem (Holanda)
        </h1>
        <UBadge
          label="Dashboard"
          color="primary"
          variant="subtle"
          size="sm"
        />
      </div>
    </template>

    <ViewDashboardDutchTrainServices />
  </NuxtLayout>
</template>
