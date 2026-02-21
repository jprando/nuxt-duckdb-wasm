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
          name="i-lucide-scroll-text"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Shakespeare — Dashboard
        </h1>
        <UBadge
          label="87k"
          color="primary"
          variant="subtle"
          size="sm"
        />
      </div>
    </template>

    <ViewDashboardShakespeare />
  </NuxtLayout>
</template>
