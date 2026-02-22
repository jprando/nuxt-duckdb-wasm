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
      <div class="flex items-center gap-2 cursor-default">
        <UIcon
          name="i-lucide-train-track"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Serviços de Trem
        </h1>
        <UBadge
          label="Holanda"
          size="sm"
        />
        <UTooltip text="380 mil registros">
          <UBadge
            label="380k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardTrensHolandeses />
  </NuxtLayout>
</template>
