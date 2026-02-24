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
          name="i-lucide-zap"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
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
            class="dashboard-badge-info"
          />
        </UTooltip>
      </div>
    </template>

    <ViewPocsV1EletricidadeFinlandia />
  </NuxtLayout>
</template>
