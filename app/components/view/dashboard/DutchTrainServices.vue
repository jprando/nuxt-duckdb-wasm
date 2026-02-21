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
} = useDutchTrainServices();
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Total de serviços -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-train-track"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Serviços
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_services) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de Estações -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-building"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Estações
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_stations) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de Trens -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-train-front"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Trens
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_trains) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Tipo + Estações ─────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-pie-chart"
              class="text-primary size-4"
            />
            Serviços por Tipo de Trem
          </h2>
        </template>
        <template v-if="!opcaoTipo">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoTipo"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-bar-chart-big"
              class="text-success size-4"
            />
            Top 10 Estações mais Movimentadas
          </h2>
        </template>
        <template v-if="!opcaoEstacoesMovimentadas">
          <USkeleton class="h-[260px] w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoEstacoesMovimentadas"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Linha 3: Duração Média da Parada ─────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon
            name="i-lucide-timer"
            class="text-warning size-4"
          />
          Duração Média da Parada (Top 10 Estações)
        </h2>
      </template>
      <template v-if="!opcaoDuracaoMediaParada">
        <USkeleton class="h-[260px] w-full rounded-lg" />
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoDuracaoMediaParada"
        :tema="temaGrafico"
        :height="260"
      />
    </UCard>

    <!-- ── Linha 4: Partidas por Hora ──────────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon
            name="i-lucide-clock"
            class="text-primary size-4"
          />
          Partidas por Hora do Dia
        </h2>
      </template>
      <template v-if="!opcaoPartidasPorHora">
        <USkeleton class="h-[200px] w-full rounded-lg" />
      </template>
      <template v-else-if="Object.keys(opcaoPartidasPorHora).length === 0">
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-sm text-muted">
            Dados de hora indisponíveis para este dataset.
          </p>
        </div>
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoPartidasPorHora"
        :tema="temaGrafico"
        :height="200"
      />
    </UCard>
  </div>
</template>
