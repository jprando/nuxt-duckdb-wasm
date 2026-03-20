<script
  setup
  lang="ts"
>
definePageMeta({ layout: 'dashboard-pocv1' })
</script>

<template>
  <NuxtLayout name="dashboard-pocv1">
    <template #titulo>
      <div class="dashboard-cabecalho-titulo">
        <UIcon
          name="i-lucide-plane"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
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

    <ViewPocsV1PontualidadeVoos />
  </NuxtLayout>
</template>
