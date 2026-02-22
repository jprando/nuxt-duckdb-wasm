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
          label="ABRIL/2019"
          variant="solid"
          color="primary"
          size="sm"
        />
        <UTooltip text="7.427.174 registros">
          <UBadge
            label="7.4Mi"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardTaxiNYCAbril2019 />
  </NuxtLayout>
</template>
