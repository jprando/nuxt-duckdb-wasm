<script
  setup
  lang="ts"
>
import { defineAsyncComponent } from "vue"

const GraficoCard = defineAsyncComponent(() => import("~/components/GraficoCard.vue"))
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
      <KpiCard
        label="Registros Horários"
        icon="i-lucide-zap"
        cor="primary"
        :valor="fmtNumero(kpis.total_registros)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Preço Médio"
        icon="i-lucide-trending-up"
        cor="success"
        :valor="fmtEuro(kpis.preco_medio)"
        subtexto="€/MWh"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Pico Máximo"
        icon="i-lucide-arrow-up"
        cor="error"
        :valor="fmtEuro(kpis.preco_maximo)"
        subtexto="€/MWh"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Mínimo Registrado"
        icon="i-lucide-arrow-down"
        cor="warning"
        :valor="fmtEuro(kpis.preco_minimo)"
        subtexto="€/MWh"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Desvio Padrão"
        icon="i-lucide-bar-chart-2"
        cor="secondary"
        :valor="fmtEuro(kpis.desvio_padrao)"
        subtexto="€/MWh"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Período"
        icon="i-lucide-calendar-range"
        cor="info"
        :valor="formatarData(kpis.periodo_inicio)"
        :subtexto="`até ${formatarData(kpis.periodo_fim)}`"
        :carregando="carregandoKpis"
        esqueleto="w-28"
        :pequeno="true"
      />
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
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3;
}

.grade-graficos {
  @apply grid grid-cols-1 xl:grid-cols-2 gap-4;
}
</style>
