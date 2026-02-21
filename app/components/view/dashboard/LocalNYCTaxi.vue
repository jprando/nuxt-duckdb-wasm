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
} = useLocalNYCTaxi();
</script>

<template>
  <div class="p-4 md:p-6 space-y-5">
    <!-- ── Erro ───────────────────────────────────────────────────── -->
    <UAlert
      v-if="erro"
      color="error"
      variant="soft"
      :title="erro"
      icon="i-lucide-circle-alert"
    />

    <!-- ── KPI Cards ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- Total de corridas -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-car"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Corridas
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_trips) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Distância média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-map-pin"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Distância Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
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
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-circle-dollar-sign"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Valor Médio
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDolarDecimal(kpis.avg_amount) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Receita total -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-trending-up"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Receita Total
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-28" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDolar(kpis.total_revenue) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Vendor + Passageiros ─────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-pie-chart"
              class="text-primary size-4"
            />
            Corridas por Fornecedor
          </h2>
        </template>
        <template v-if="!opcaoVendor">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoVendor"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-users"
              class="text-success size-4"
            />
            Corridas por Nº de Passageiros
          </h2>
        </template>
        <template v-if="!opcaoPassageiros">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoPassageiros"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Linha 3: Distância + Valor ────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-ruler"
              class="text-warning size-4"
            />
            Distribuição por Distância (milhas)
          </h2>
        </template>
        <template v-if="!opcaoDistancia">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoDistancia"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-dollar-sign"
              class="text-secondary size-4"
            />
            Distribuição por Valor (USD)
          </h2>
        </template>
        <template v-if="!opcaoValor">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoValor"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Linha 4: Corridas por Hora ────────────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon
            name="i-lucide-clock"
            class="text-primary size-4"
          />
          Corridas por Hora do Dia
        </h2>
      </template>
      <template v-if="!opcaoHora">
        <USkeleton class="h-[200px] w-full rounded-lg" />
      </template>
      <template v-else-if="Object.keys(opcaoHora).length === 0">
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-sm text-muted">
            Dados de hora indisponíveis para este dataset.
          </p>
        </div>
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoHora"
        :tema="temaGrafico"
        :height="200"
      />
    </UCard>
  </div>
</template>
