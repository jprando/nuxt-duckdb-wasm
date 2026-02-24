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
          name="i-lucide-image"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
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
            class="dashboard-badge-info"
          />
        </UTooltip>
      </div>
    </template>

    <ViewPocsV1DiffusionDB />
  </NuxtLayout>
</template>
