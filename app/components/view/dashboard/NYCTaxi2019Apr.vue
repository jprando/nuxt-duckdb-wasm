<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoTarifa,
  opcaoPagamento,
  opcaoDuracao,
  opcaoGorjeta,
  opcaoHora,
  fmtNumero,
  fmtDolar,
  fmtDolarDecimal,
  fmtMin,
} = useNYCTaxi2019Apr();
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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
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

      <!-- Duração média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-timer"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Duração Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtMin(kpis.avg_duration_min) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Gorjeta média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-hand-coins"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Gorjeta Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDolarDecimal(kpis.avg_tip) }}
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

    <!-- ── Linha 2: Tipo de tarifa + Forma de pagamento ───────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-tag"
              class="text-primary size-4"
            />
            Corridas por Tipo de Tarifa
          </h2>
        </template>
        <template v-if="!opcaoTarifa">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoTarifa"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-credit-card"
              class="text-success size-4"
            />
            Corridas por Forma de Pagamento
          </h2>
        </template>
        <template v-if="!opcaoPagamento">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoPagamento"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Linha 3: Duração + Gorjeta ────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-timer"
              class="text-success size-4"
            />
            Distribuição por Duração da Corrida
          </h2>
        </template>
        <template v-if="!opcaoDuracao">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoDuracao"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-hand-coins"
              class="text-warning size-4"
            />
            Distribuição de Gorjeta
            <UBadge variant="soft">
              USD
            </UBadge>
          </h2>
        </template>
        <template v-if="!opcaoGorjeta">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoGorjeta"
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
        <USkeleton class="h-50 w-full rounded-lg" />
      </template>
      <template v-else-if="Object.keys(opcaoHora).length === 0">
        <div class="h-50 flex items-center justify-center">
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
