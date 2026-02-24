<script
  setup
  lang="ts"
>
const GraficoCard = defineAsyncComponent(() =>
  import("~/components/GraficoCard.vue")
);
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  configuracaoGraficoDimensoes,
  configuracaoGraficoNsfw,
  configuracaoGraficoSteps,
  configuracaoGraficoSampler,
  configuracaoGraficoAtividade,
  fmtNumero,
  fmtDecimal,
} = useDiffusionDB();
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
        label="Total de Imagens"
        icon="i-lucide-image"
        cor="primary"
        :valor="fmtNumero(kpis.total_imagens)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Usuários Únicos"
        icon="i-lucide-users"
        cor="success"
        :valor="fmtNumero(kpis.total_usuarios)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Taxa NSFW"
        icon="i-lucide-shield-alert"
        cor="error"
        :valor="`${fmtDecimal(kpis.pct_nsfw)}%`"
        :carregando="carregandoKpis"
        esqueleto="w-16"
      />
      <KpiCard
        label="Steps Médios"
        icon="i-lucide-sliders"
        cor="warning"
        :valor="fmtDecimal(kpis.steps_medio)"
        :carregando="carregandoKpis"
        esqueleto="w-16"
      />
      <KpiCard
        label="Período"
        icon="i-lucide-calendar-range"
        cor="secondary"
        :valor="formatarData(kpis.periodo_inicio)"
        :subtexto="`até ${formatarData(kpis.periodo_fim)}`"
        :carregando="carregandoKpis"
        esqueleto="w-28"
        :pequeno="true"
      />
    </div>

    <!-- ── Linha 1: Dimensões + NSFW ──────────────────────────────── -->
    <div class="grade-graficos">
      <!-- Top 10 Dimensões -->
      <GraficoCard
        :configuracao="configuracaoGraficoDimensoes"
        :tema="temaGrafico"
        :altura="280"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-frame"
            class="text-primary size-4"
          />
          Dimensões Mais Usadas
          <UBadge variant="soft">
            Top 10
          </UBadge>
        </template>
      </GraficoCard>

      <!-- Classificação NSFW -->
      <GraficoCard
        :configuracao="configuracaoGraficoNsfw"
        :tema="temaGrafico"
        :altura="280"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-shield"
            class="text-error size-4"
          />
          Classificação de Segurança (NSFW)
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 2: Steps + Samplers ──────────────────────────────── -->
    <div class="grade-graficos">
      <!-- Distribuição de Steps -->
      <GraficoCard
        :configuracao="configuracaoGraficoSteps"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-sliders-horizontal"
            class="text-warning size-4"
          />
          Distribuição de Steps de Inferência
        </template>
      </GraficoCard>

      <!-- Samplers -->
      <GraficoCard
        :configuracao="configuracaoGraficoSampler"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-cpu"
            class="text-secondary size-4"
          />
          Algoritmo de Sampling Usado
        </template>
      </GraficoCard>
    </div>

    <!-- ── Atividade por Hora ──────────────────────────────────────── -->
    <GraficoCard
      :configuracao="configuracaoGraficoAtividade"
      :tema="temaGrafico"
      :altura="220"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-clock"
          class="text-success size-4"
        />
        Atividade de Geração por Hora do Dia
        <UBadge variant="soft">
          UTC
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
