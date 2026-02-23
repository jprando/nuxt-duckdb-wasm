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
  opcaoRadar,
  opcaoSankey,
  fmtNumero,
  fmtMin,
  fmtPct,
  fmtMi,
} = usePontualidadeVoos();
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
      <!-- Total de Voos -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-plane"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Total de Voos
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-28" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtNumero(kpis.total_voos) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- % Voos Pontuais -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-check-circle"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Voos Pontuais
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtPct(kpis.pct_pontuais) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Taxa de Cancelamento -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon
              name="i-lucide-ban"
              class="size-5 text-error"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Taxa de Cancelamento
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtPct(kpis.taxa_cancelamento) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Atraso Médio — Partida -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-timer"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Atraso Médio Partida
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtMin(kpis.atraso_medio_partida) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Atraso Médio — Chegada -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-alarm-clock"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Atraso Médio Chegada
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtMin(kpis.atraso_medio_chegada) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Distância Média -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="card-kpi"
      >
        <div class="item-kpi">
          <div class="p-2 rounded-lg bg-info/10 shrink-0">
            <UIcon
              name="i-lucide-ruler"
              class="size-5 text-info"
            />
          </div>
          <div class="min-w-0">
            <p class="label-kpi">
              Distância Média
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="valor-kpi">
                {{ fmtMi(kpis.distancia_media) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 1: Companhias + Status ───────────────────────────── -->
    <div class="grade-graficos">
      <!-- Voos por Companhia Aérea -->
      <GraficoCard
        :opcao="opcaoCompanhias"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-building"
            class="text-primary size-4"
          />
          Voos por Companhia Aérea
        </template>
      </GraficoCard>

      <!-- Status dos Voos -->
      <GraficoCard
        :opcao="opcaoStatus"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-pie-chart"
            class="text-success size-4"
          />
          Status dos Voos
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 2: Dia da Semana + Mensal ────────────────────────── -->
    <div class="grade-graficos">
      <!-- Atraso por Dia da Semana -->
      <GraficoCard
        :opcao="opcaoDiaSemana"
        :tema="temaGrafico"
        :altura="240"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-calendar-days"
            class="text-warning size-4"
          />
          Atraso Médio por Dia da Semana
        </template>
      </GraficoCard>

      <!-- Voos por Mês -->
      <GraficoCard
        :opcao="opcaoMensal"
        :tema="temaGrafico"
        :altura="240"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-calendar"
            class="text-primary size-4"
          />
          Voos por Mês
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 3: Histograma de Atraso + Distância ─────────────── -->
    <div class="grade-graficos">
      <!-- Distribuição de Atraso na Partida -->
      <GraficoCard
        :opcao="opcaoAtrasoPartida"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-hourglass"
            class="text-error size-4"
          />
          Distribuição do Atraso na Partida
        </template>
      </GraficoCard>

      <!-- Distribuição por Grupo de Distância -->
      <GraficoCard
        :opcao="opcaoDistancia"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-map"
            class="text-secondary size-4"
          />
          Voos por Faixa de Distância
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 4: Aeroportos + Cancelamentos por Companhia ──────── -->
    <div class="grade-graficos">
      <!-- Top 12 Aeroportos de Origem -->
      <GraficoCard
        :opcao="opcaoAeroportos"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-map-pin"
            class="text-success size-4"
          />
          Top 12 Aeroportos de Origem
        </template>
      </GraficoCard>

      <!-- Taxa de Cancelamento por Companhia -->
      <GraficoCard
        :opcao="opcaoCancelamentos"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-ban"
            class="text-error size-4"
          />
          Taxa de Cancelamento por Companhia
          <UBadge variant="soft">
            %
          </UBadge>
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 5: Atraso por Hora do Dia (full width) ──────────── -->
    <GraficoCard
      :opcao="opcaoHoraPartida"
      :tema="temaGrafico"
      :altura="200"
      msg-sem-dados="Dados de hora indisponíveis para este dataset."
    >
      <template #titulo>
        <UIcon
          name="i-lucide-clock"
          class="text-primary size-4"
        />
        Atraso Médio por Hora da Partida
        <UBadge variant="soft">
          min
        </UBadge>
      </template>
    </GraficoCard>

    <!-- ── Linha 6: Radar de Performance + Sankey Companhia→Status ── -->
    <div class="grade-graficos-xl">
      <!-- Radar: Performance Comparativa das Companhias -->
      <GraficoCard
        :opcao="opcaoRadar"
        :tema="temaGrafico"
        :altura="320"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-radar"
            class="text-primary size-4"
          />
          Performance Comparativa das Companhias
          <UBadge variant="soft">
            Radar
          </UBadge>
        </template>
      </GraficoCard>

      <!-- Sankey: Fluxo Companhia → Status do Voo -->
      <GraficoCard
        :opcao="opcaoSankey"
        :tema="temaGrafico"
        :altura="320"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-git-merge"
            class="text-secondary size-4"
          />
          Fluxo de Voos: Companhia → Status
          <UBadge variant="soft">
            Sankey
          </UBadge>
        </template>
      </GraficoCard>
    </div>
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

.grade-graficos-xl {
  @apply grid grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
