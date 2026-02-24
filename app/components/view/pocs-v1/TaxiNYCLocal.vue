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
  configuracaoGraficoVendor,
  configuracaoGraficoPassageiros,
  configuracaoGraficoDistancia,
  configuracaoGraficoValor,
  configuracaoGraficoHora,
  fmtNumero,
  fmtDolar,
  fmtDolarDecimal,
} = useTaxiNYCLocal();
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
        label="Distância Média"
        icon="i-lucide-map-pin"
        cor="success"
        :valor="kpis.avg_distance"
        unidade="mi"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Valor Médio"
        icon="i-lucide-circle-dollar-sign"
        cor="warning"
        :valor="fmtDolarDecimal(kpis.avg_amount)"
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

    <!-- ── Linha 2: Vendor + Passageiros ─────────────────────────── -->
    <div class="grade-graficos">
      <GraficoCard
        :opcao="configuracaoGraficoVendor"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-pie-chart"
            class="text-primary size-4"
          />
          Corridas por Fornecedor
        </template>
      </GraficoCard>

      <GraficoCard
        :opcao="configuracaoGraficoPassageiros"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-users"
            class="text-success size-4"
          />
          Corridas por Nº de Passageiros
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 3: Distância + Valor ────────────────────────────── -->
    <div class="grade-graficos">
      <GraficoCard
        :opcao="configuracaoGraficoDistancia"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-ruler"
            class="text-warning size-4"
          />
          Distribuição por Distância
          <UBadge variant="soft">
            milhas
          </UBadge>
        </template>
      </GraficoCard>

      <GraficoCard
        :opcao="configuracaoGraficoValor"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-dollar-sign"
            class="text-secondary size-4"
          />
          Distribuição por Valor
          <UBadge variant="soft">
            USD
          </UBadge>
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 4: Corridas por Hora ────────────────────────────── -->
    <GraficoCard
      :opcao="configuracaoGraficoHora"
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
