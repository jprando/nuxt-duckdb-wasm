<script
  setup
  lang="ts"
>
import { LazyGraficoCard } from "@/utils/lazy-components";

const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  configuracaoGraficoDiaSemana,
  configuracaoGraficoMensal,
  configuracaoGraficoAtrasoPartida,
  configuracaoGraficoDistancia,
  configuracaoGraficoAeroportos,
  configuracaoGraficoCancelamentos,
  configuracaoGraficoHoraPartida,
  configuracaoGraficoRadar,
  configuracaoGraficoSankey,
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
      <KpiCard
        label="Total de Voos"
        icon="i-lucide-plane"
        cor="primary"
        :valor="fmtNumero(kpis.total_voos)"
        :carregando="carregandoKpis"
        esqueleto="w-28"
      />
      <KpiCard
        label="Voos Pontuais"
        icon="i-lucide-check-circle"
        cor="success"
        :valor="fmtPct(kpis.pct_pontuais)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Taxa de Cancelamento"
        icon="i-lucide-ban"
        cor="error"
        :valor="fmtPct(kpis.taxa_cancelamento)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Atraso Médio Partida"
        icon="i-lucide-timer"
        cor="warning"
        :valor="fmtMin(kpis.atraso_medio_partida)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Atraso Médio Chegada"
        icon="i-lucide-alarm-clock"
        cor="secondary"
        :valor="fmtMin(kpis.atraso_medio_chegada)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Distância Média"
        icon="i-lucide-ruler"
        cor="info"
        :valor="fmtMi(kpis.distancia_media)"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
    </div>

    <!-- ── Linha 2: Dia da Semana + Mensal ────────────────────────── -->
    <div class="grade-graficos">
      <!-- Atraso por Dia da Semana -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoDiaSemana"
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
      </LazyGraficoCard>

      <!-- Voos por Mês -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoMensal"
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
      </LazyGraficoCard>
    </div>

    <!-- ── Linha 3: Histograma de Atraso + Distância ─────────────── -->
    <div class="grade-graficos">
      <!-- Distribuição de Atraso na Partida -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoAtrasoPartida"
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
      </LazyGraficoCard>

      <!-- Distribuição por Grupo de Distância -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoDistancia"
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
      </LazyGraficoCard>
    </div>

    <!-- ── Linha 4: Aeroportos + Cancelamentos por Companhia ──────── -->
    <div class="grade-graficos">
      <!-- Top 12 Aeroportos de Origem -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoAeroportos"
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
      </LazyGraficoCard>

      <!-- Taxa de Cancelamento por Companhia -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoCancelamentos"
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
      </LazyGraficoCard>
    </div>

    <!-- ── Linha 5: Atraso por Hora do Dia (full width) ──────────── -->
    <LazyGraficoCard
      :configuracao="configuracaoGraficoHoraPartida"
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
    </LazyGraficoCard>

    <!-- ── Linha 6: Radar de Performance + Sankey Companhia→Status ── -->
    <div class="grade-graficos-xl">
      <!-- Radar: Performance Comparativa das Companhias -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoRadar"
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
      </LazyGraficoCard>

      <!-- Sankey: Fluxo Companhia → Status do Voo -->
      <LazyGraficoCard
        :configuracao="configuracaoGraficoSankey"
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
      </LazyGraficoCard>
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
