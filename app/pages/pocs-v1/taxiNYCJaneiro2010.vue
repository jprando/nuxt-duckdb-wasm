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
          label="JANEIRO/2010"
          variant="solid"
          color="primary"
          size="sm"
        />
        <UTooltip text="14.831.597 registros">
          <UBadge
            label="14.8Mi"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewPocsV1TaxiNYCJaneiro2010 />
  </NuxtLayout>
</template>
