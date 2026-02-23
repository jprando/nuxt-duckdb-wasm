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
          name="i-lucide-building-2"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
          Estações de Trem
        </h1>
        <UTooltip text="578 registros">
          <UBadge
            label="578"
            color="primary"
            variant="subtle"
            size="sm"
            title="578 registros"
            class="dashboard-badge-info"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardEstacoesTrem />
  </NuxtLayout>
</template>
