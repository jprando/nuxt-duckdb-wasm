<script
  setup
  lang="ts"
>
const GraficoCard = defineAsyncComponent(() =>
  import("~/components/GraficoCard.vue")
);
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  configuracaoGraficoPartidasPorHora,
  configuracaoGraficoDuracaoMediaParada,
  fmtNumero,
} = useTrensHolandeses();
</script>

<template>
  <div class="conteudo-view">
    <!-- ── Erro ───────────────────────────────────────────────────── -->
    <UAlert
      v-if="erro"
      color="error"
      variant="soft"
      :title="erro"
      icon="i-lucide-circle-alert"
    />

    <!-- ── KPI Cards ──────────────────────────────────────────────── -->
    <div class="grade-kpis">
      <KpiCard
        label="Total de Serviços"
        icon="i-lucide-train-track"
        cor="primary"
        :valor="fmtNumero(kpis.total_services)"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Total de Estações"
        icon="i-lucide-building"
        cor="success"
        :valor="fmtNumero(kpis.total_stations)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Total de Trens"
        icon="i-lucide-train-front"
        cor="warning"
        :valor="fmtNumero(kpis.total_trains)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Período"
        icon="i-lucide-calendar-range"
        cor="secondary"
        :valor="formatarData(kpis.periodo_inicio)"
        :subtexto="`até ${formatarData(kpis.periodo_fim)}`"
        :carregando="carregandoKpis"
        esqueleto="w-28"
        :pequeno="true"
      />
    </div>

    <!-- ── Linha 3: Duração Média da Parada ─────────────────────── -->
    <GraficoCard
      :configuracao="configuracaoGraficoDuracaoMediaParada"
      :tema="temaGrafico"
      :altura="260"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-timer"
          class="text-warning size-4"
        />
        Duração Média da Parada
        <UBadge variant="soft">
          Top 10 Estações
        </UBadge>
      </template>
    </GraficoCard>

    <!-- ── Linha 4: Partidas por Hora ──────────────────────────── -->
    <GraficoCard
      :configuracao="configuracaoGraficoPartidasPorHora"
      :tema="temaGrafico"
      :altura="200"
      msg-sem-dados="Dados de hora indisponíveis para este dataset."
    >
      <template #titulo>
        <UIcon
          name="i-lucide-clock"
          class="text-primary size-4"
        />
        Partidas por Hora do Dia
      </template>
    </GraficoCard>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.grade-kpis {
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3;
}

.grade-graficos {
  @apply grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
