<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoVendor,
  opcaoPassageiros,
  opcaoDistancia,
  opcaoValor,
  opcaoHora,
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
      <!-- Total de corridas -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-car"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Total de Corridas
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_trips) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Distância média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-map-pin"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Distância Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ kpis.avg_distance }}
                <span class="text-sm font-normal text-muted">mi</span>
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Valor médio -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-circle-dollar-sign"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Valor Médio
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtDolarDecimal(kpis.avg_amount) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Receita total -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-trending-up"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Receita Total
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-28" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtDolar(kpis.total_revenue) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Vendor + Passageiros ─────────────────────────── -->
    <div class="grade-graficos">
      <GraficoCard
        :opcao="opcaoVendor"
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
        :opcao="opcaoPassageiros"
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
        :opcao="opcaoDistancia"
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
        :opcao="opcaoValor"
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
      :opcao="opcaoHora"
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
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3;
}

.grade-graficos {
  @apply grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
