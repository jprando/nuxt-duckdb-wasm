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
          name="i-lucide-image"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          DiffusionDB
        </h1>
        <UBadge
          label="IA Generativa"
          variant="solid"
          color="primary"
          size="sm"
        />
        <UTooltip text="2 milhões de imagens geradas por IA">
          <UBadge
            label="2Mi"
            color="primary"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardDiffusionDB />
  </NuxtLayout>
</template>
