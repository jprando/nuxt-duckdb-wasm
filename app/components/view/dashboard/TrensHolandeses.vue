<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoTipo,
  opcaoEstacoesMovimentadas,
  opcaoPartidasPorHora,
  opcaoDuracaoMediaParada,
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
      <!-- Total de serviços -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-train-track"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Total de Serviços
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_services) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de Estações -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-building"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Total de Estações
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_stations) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de Trens -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-train-front"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Total de Trens
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_trains) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Tipo + Estações ─────────────────────────── -->
    <div class="grade-graficos">
      <GraficoCard
        :opcao="opcaoTipo"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-pie-chart"
            class="text-primary size-4"
          />
          Serviços por Tipo de Trem
        </template>
      </GraficoCard>

      <GraficoCard
        :opcao="opcaoEstacoesMovimentadas"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-bar-chart-big"
            class="text-success size-4"
          />
          Top 10 Estações mais Movimentadas
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 3: Duração Média da Parada ─────────────────────── -->
    <GraficoCard
      :opcao="opcaoDuracaoMediaParada"
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
      :opcao="opcaoPartidasPorHora"
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
