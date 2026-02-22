<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoMensal,
  opcaoHoraria,
  opcaoSemanal,
  opcaoDistribuicao,
  opcaoCalendario,
  fmtNumero,
  fmtEuro,
} = useEletricidadeFinlandia();
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
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <!-- Total de Registros -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon name="i-lucide-zap" class="size-5 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Registros Horários
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_registros) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Médio -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon name="i-lucide-trending-up" class="size-5 text-success" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Preço Médio
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtEuro(kpis.preco_medio) }}
              </p>
              <p class="text-xs text-muted">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Máximo -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon name="i-lucide-arrow-up" class="size-5 text-error" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Pico Máximo
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtEuro(kpis.preco_maximo) }}
              </p>
              <p class="text-xs text-muted">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Mínimo -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon name="i-lucide-arrow-down" class="size-5 text-warning" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Mínimo Registrado
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtEuro(kpis.preco_minimo) }}
              </p>
              <p class="text-xs text-muted">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Desvio Padrão -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon name="i-lucide-bar-chart-2" class="size-5 text-secondary" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Desvio Padrão
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtEuro(kpis.desvio_padrao) }}
              </p>
              <p class="text-xs text-muted">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Série Temporal Semanal ──────────────────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon name="i-lucide-chart-line" class="text-primary size-4" />
          Evolução Semanal do Preço
          <UBadge variant="soft">
            2021
          </UBadge>
        </h2>
      </template>
      <template v-if="!opcaoSemanal">
        <USkeleton class="h-70 w-full rounded-lg" />
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoSemanal"
        :tema="temaGrafico"
        :height="280"
      />
    </UCard>

    <!-- ── Linha 2: Mensal + Horário ───────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Variação Mensal -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon name="i-lucide-calendar" class="text-success size-4" />
            Preço por Mês
            <UBadge variant="soft">
              Médio / Min / Máx
            </UBadge>
          </h2>
        </template>
        <template v-if="!opcaoMensal">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoMensal"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>

      <!-- Perfil Horário -->
      <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
        <template #header>
          <h2 class="text-sm font-semibold flex items-center gap-1.5">
            <UIcon name="i-lucide-clock" class="text-secondary size-4" />
            Perfil de Consumo por Hora
            <UBadge variant="soft">
              Média do dia
            </UBadge>
          </h2>
        </template>
        <template v-if="!opcaoHoraria">
          <USkeleton class="h-65 w-full rounded-lg" />
        </template>
        <LazyGraficoEChart
          v-else
          :option="opcaoHoraria"
          :tema="temaGrafico"
          :height="260"
        />
      </UCard>
    </div>

    <!-- ── Distribuição de Preços ─────────────────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon name="i-lucide-bar-chart-3" class="text-warning size-4" />
          Distribuição de Preços
          <UBadge variant="soft">
            Faixas de €20/MWh
          </UBadge>
        </h2>
      </template>
      <template v-if="!opcaoDistribuicao">
        <USkeleton class="h-55 w-full rounded-lg" />
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoDistribuicao"
        :tema="temaGrafico"
        :height="220"
      />
    </UCard>

    <!-- ── Calendário de Preços ────────────────────────────────────── -->
    <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
      <template #header>
        <h2 class="text-sm font-semibold flex items-center gap-1.5">
          <UIcon name="i-lucide-calendar-range" class="text-primary size-4" />
          Mapa de Calor Diário de Preços
          <UBadge variant="soft">
            2021
          </UBadge>
        </h2>
      </template>
      <template v-if="!opcaoCalendario">
        <USkeleton class="h-50 w-full rounded-lg" />
      </template>
      <LazyGraficoEChart
        v-else
        :option="opcaoCalendario"
        :tema="temaGrafico"
        :height="200"
      />
    </UCard>
  </div>
</template>
