<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="dashboard-cabecalho-titulo">
        <UIcon
          name="i-lucide-layout-dashboard"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
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
