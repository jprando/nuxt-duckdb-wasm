<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard-pocv1" });
</script>

<template>
  <NuxtLayout name="dashboard-pocv1">
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

    <ViewPocsV1TaxiNYCAbril2019 />
  </NuxtLayout>
</template>
