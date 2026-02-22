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
          name="i-lucide-zap"
          class="text-primary shrink-0"
        />
        <h1 class="text-sm font-semibold text-highlighted truncate">
          Eletricidade Finlândia
        </h1>
        <UBadge
          label="2021"
          variant="solid"
          color="primary"
          size="sm"
        />
        <UTooltip text="7.992 registros horários">
          <UBadge
            label="7,9k"
            color="primary"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardEletricidadeFinlandia />
  </NuxtLayout>
</template>
