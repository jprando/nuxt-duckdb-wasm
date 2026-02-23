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
      <!-- Total de Registros -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-zap"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Registros Horários
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_registros) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Médio -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-trending-up"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Preço Médio
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtEuro(kpis.preco_medio) }}
              </p>
              <p class="subtexto-kpi">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Máximo -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon
              name="i-lucide-arrow-up"
              class="size-5 text-error"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Pico Máximo
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtEuro(kpis.preco_maximo) }}
              </p>
              <p class="subtexto-kpi">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Mínimo -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-arrow-down"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Mínimo Registrado
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtEuro(kpis.preco_minimo) }}
              </p>
              <p class="subtexto-kpi">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Desvio Padrão -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-bar-chart-2"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Desvio Padrão
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtEuro(kpis.desvio_padrao) }}
              </p>
              <p class="subtexto-kpi">
                €/MWh
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Série Temporal Semanal ──────────────────────────────────── -->
    <GraficoCard
      :opcao="opcaoSemanal"
      :tema="temaGrafico"
      :altura="280"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-chart-line"
          class="text-primary size-4"
        />
        Evolução Semanal do Preço
        <UBadge variant="soft">
          2021
        </UBadge>
      </template>
    </GraficoCard>

    <!-- ── Linha 2: Mensal + Horário ───────────────────────────────── -->
    <div class="grade-graficos">
      <!-- Variação Mensal -->
      <GraficoCard
        :opcao="opcaoMensal"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-calendar"
            class="text-success size-4"
          />
          Preço por Mês
          <UBadge variant="soft">
            Médio / Min / Máx
          </UBadge>
        </template>
      </GraficoCard>

      <!-- Perfil Horário -->
      <GraficoCard
        :opcao="opcaoHoraria"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-clock"
            class="text-secondary size-4"
          />
          Perfil de Consumo por Hora
          <UBadge variant="soft">
            Média do dia
          </UBadge>
        </template>
      </GraficoCard>
    </div>

    <!-- ── Distribuição de Preços ─────────────────────────────────── -->
    <GraficoCard
      :opcao="opcaoDistribuicao"
      :tema="temaGrafico"
      :altura="220"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-bar-chart-3"
          class="text-warning size-4"
        />
        Distribuição de Preços
        <UBadge variant="soft">
          Faixas de €20/MWh
        </UBadge>
      </template>
    </GraficoCard>

    <!-- ── Calendário de Preços ────────────────────────────────────── -->
    <GraficoCard
      :opcao="opcaoCalendario"
      :tema="temaGrafico"
      :altura="200"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-calendar-range"
          class="text-primary size-4"
        />
        Mapa de Calor Diário de Preços
        <UBadge variant="soft">
          2021
        </UBadge>
      </template>
    </GraficoCard>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.grade-kpis {
  @apply grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3;
}

.grade-graficos {
  @apply grid grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
