<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });

useHead({
  title: "Dashboard - Tarifas Ferroviárias",
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="dashboard-cabecalho-titulo">
        <UIcon
          name="i-lucide-euro"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
          Tarifas Ferroviárias
        </h1>
        <UTooltip text="158.802 registros">
          <UBadge
            label="158k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardTarifasFerroviarias />
  </NuxtLayout>
</template>
