<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoCompanhias,
  opcaoStatus,
  opcaoDiaSemana,
  opcaoMensal,
  opcaoAtrasoPartida,
  opcaoDistancia,
  opcaoAeroportos,
  opcaoCancelamentos,
  opcaoHoraPartida,
  fmtNumero,
  fmtMin,
  fmtPct,
  fmtMi,
} = useOntime();
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
      <!-- Total de Voos -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-plane"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Voos
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-28" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_voos) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- % Voos Pontuais -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-check-circle"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Voos Pontuais
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtPct(kpis.pct_pontuais) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Taxa de Cancelamento -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon
              name="i-lucide-ban"
              class="size-5 text-error"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Taxa de Cancelamento
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtPct(kpis.taxa_cancelamento) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Atraso Médio — Partida -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-timer"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Atraso Médio Partida
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtMin(kpis.atraso_medio_partida) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Atraso Médio — Chegada -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-alarm-clock"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Atraso Médio Chegada
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtMin(kpis.atraso_medio_chegada) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Distância Média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-info/10 shrink-0">
            <UIcon
              name="i-lucide-ruler"
              class="size-5 text-info"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Distância Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtMi(kpis.distancia_media) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 1: Companhias + Status ───────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Voos por Companhia Aérea -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-building"
              class="text-primary size-4"
            />
            Voos por Companhia Aérea
          </h2>
        </template>
        <template v-if="!opcaoCompanhias">
          <USkeleton class="h-75 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoCompanhias"
          :tema="temaGrafico"
          :height="300"
        />
      </UCard>

      <!-- Status dos Voos -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-pie-chart"
              class="text-success size-4"
            />
            Status dos Voos
          </h2>
        </template>
        <template v-if="!opcaoStatus">
          <USkeleton class="h-75 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoStatus"
          :tema="temaGrafico"
          :height="300"
        />
      </UCard>
    </div>

    <!-- ── Linha 2: Dia da Semana + Mensal ────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Atraso por Dia da Semana -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-calendar-days"
              class="text-warning size-4"
            />
            Atraso Médio por Dia da Semana
          </h2>
        </template>
        <template v-if="!opcaoDiaSemana">
          <USkeleton class="h-60 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoDiaSemana"
          :tema="temaGrafico"
          :height="240"
        />
      </UCard>

      <!-- Voos por Mês -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-calendar"
              class="text-primary size-4"
            />
            Voos por Mês
          </h2>
        </template>
        <template v-if="!opcaoMensal">
          <USkeleton class="h-60 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoMensal"
          :tema="temaGrafico"
          :height="240"
        />
      </UCard>
    </div>

    <!-- ── Linha 3: Histograma de Atraso + Distância ─────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Distribuição de Atraso na Partida -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-hourglass"
              class="text-error size-4"
            />
            Distribuição do Atraso na Partida
          </h2>
        </template>
        <template v-if="!opcaoAtrasoPartida">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoAtrasoPartida"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <!-- Distribuição por Grupo de Distância -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-map"
              class="text-secondary size-4"
            />
            Voos por Faixa de Distância
          </h2>
        </template>
        <template v-if="!opcaoDistancia">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoDistancia"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Linha 4: Aeroportos + Cancelamentos por Companhia ──────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Top 12 Aeroportos de Origem -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-map-pin"
              class="text-success size-4"
            />
            Top 12 Aeroportos de Origem
          </h2>
        </template>
        <template v-if="!opcaoAeroportos">
          <USkeleton class="h-75 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoAeroportos"
          :tema="temaGrafico"
          :height="300"
        />
      </UCard>

      <!-- Taxa de Cancelamento por Companhia -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon
              name="i-lucide-ban"
              class="text-error size-4"
            />
            Taxa de Cancelamento por Companhia
            <UBadge variant="soft">
              %
            </UBadge>
          </h2>
        </template>
        <template v-if="!opcaoCancelamentos">
          <USkeleton class="h-75 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoCancelamentos"
          :tema="temaGrafico"
          :height="300"
        />
      </UCard>
    </div>

    <!-- ── Linha 5: Atraso por Hora do Dia (full width) ──────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon
            name="i-lucide-clock"
            class="text-primary size-4"
          />
          Atraso Médio por Hora da Partida
          <UBadge variant="soft">
            min
          </UBadge>
        </h2>
      </template>
      <template v-if="!opcaoHoraPartida">
        <USkeleton class="h-50 w-full rounded-lg" />
      </template>
      <template v-else-if="Object.keys(opcaoHoraPartida).length === 0">
        <div class="h-50 flex items-center justify-center">
          <p class="text-sm text-muted">
            Dados de hora indisponíveis para este dataset.
          </p>
        </div>
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoHoraPartida"
        :tema="temaGrafico"
        :height="200"
      />
    </UCard>
  </div>
</template>
