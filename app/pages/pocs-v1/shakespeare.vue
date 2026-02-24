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
          name="i-lucide-scroll-text"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
          Shakespeare
        </h1>
        <UTooltip text="87.643 registros">
          <UBadge
            label="87k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewPocsV1Shakespeare />
  </NuxtLayout>
</template>
