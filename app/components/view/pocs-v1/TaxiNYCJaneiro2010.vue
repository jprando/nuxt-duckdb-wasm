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
  configuracaoGraficoDuracao,
  configuracaoGraficoGorjeta,
  configuracaoGraficoHora,
  fmtNumero,
  fmtDolar,
  fmtDolarDecimal,
  fmtMin,
} = useTaxiNYCJaneiro2010();
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
        label="Total de Corridas"
        icon="i-lucide-car"
        cor="primary"
        :valor="fmtNumero(kpis.total_trips)"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Duração Média"
        icon="i-lucide-timer"
        cor="success"
        :valor="fmtMin(kpis.avg_duration_min)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Gorjeta Média"
        icon="i-lucide-hand-coins"
        cor="warning"
        :valor="fmtDolarDecimal(kpis.avg_tip)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Receita Total"
        icon="i-lucide-trending-up"
        cor="secondary"
        :valor="fmtDolar(kpis.total_revenue)"
        :carregando="carregandoKpis"
        esqueleto="w-28"
      />
      <KpiCard
        label="Período"
        icon="i-lucide-calendar-range"
        cor="info"
        :valor="formatarData(kpis.periodo_inicio)"
        :subtexto="`até ${formatarData(kpis.periodo_fim)}`"
        :carregando="carregandoKpis"
        esqueleto="w-28"
        :pequeno="true"
      />
    </div>

    <!-- ── Linha 3: Duração + Gorjeta ────────────────────────────── -->
    <div class="grade-graficos">
      <GraficoCard
        :configuracao="configuracaoGraficoDuracao"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-timer"
            class="text-success size-4"
          />
          Distribuição por Duração da Corrida
        </template>
      </GraficoCard>

      <GraficoCard
        :configuracao="configuracaoGraficoGorjeta"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-hand-coins"
            class="text-warning size-4"
          />
          Distribuição de Gorjeta
          <UBadge variant="soft">
            USD
          </UBadge>
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 4: Corridas por Hora ────────────────────────────── -->
    <GraficoCard
      :configuracao="configuracaoGraficoHora"
      :tema="temaGrafico"
      :altura="200"
      msg-sem-dados="Dados de hora indisponíveis para este dataset."
    >
      <template #titulo>
        <UIcon
          name="i-lucide-clock"
          class="text-primary size-4"
        />
        Corridas por Hora do Dia
      </template>
    </GraficoCard>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.grade-kpis {
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3;
}

.grade-graficos {
  @apply grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
