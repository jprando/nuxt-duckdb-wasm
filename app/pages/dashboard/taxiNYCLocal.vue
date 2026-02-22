<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="flex items-center gap-2 cursor-default">
        <UIcon
          name="i-lucide-layout-dashboard"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          NYC Taxi
        </h1>
        <UBadge
          label="JANEIRO/2024"
          variant="solid"
          color="primary"
          size="sm"
        />
        <UTooltip text="550 mil registros">
          <UBadge
            label="550k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardTaxiNYCLocal />
  </NuxtLayout>
</template>
