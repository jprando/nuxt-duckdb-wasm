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
          name="i-lucide-plane"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Voos (On-time)
        </h1>
        <UTooltip text="4.276.457 registros">
          <UBadge
            label="4.2Mi"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardPontualidadeVoos />
  </NuxtLayout>
</template>
