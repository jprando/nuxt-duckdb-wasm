<script
  setup
  lang="ts"
>
definePageMeta({ layout: "dashboard" });

useHead({
  title: "Dashboard - Serviços de Trem (Holanda)",
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <template #titulo>
      <div class="dashboard-cabecalho-titulo">
        <UIcon
          name="i-lucide-train-track"
          class="dashboard-icone-secao"
        />
        <h1 class="dashboard-titulo-secao">
          Serviços de Trem
        </h1>
        <UBadge
          label="Holanda"
          size="sm"
        />
        <UTooltip text="380 mil registros">
          <UBadge
            label="380k"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </UTooltip>
      </div>
    </template>

    <ViewDashboardTrensHolandeses />
  </NuxtLayout>
</template>
