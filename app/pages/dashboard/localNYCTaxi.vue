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
          name="i-lucide-layout-dashboard"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          NYC Taxi — Dashboard
        </h1>
        <UBadge
          label="550k"
          color="primary"
          variant="subtle"
          size="sm"
        />
      </div>
    </template>

    <ViewDashboardLocalNYCTaxi />
  </NuxtLayout>
</template>
