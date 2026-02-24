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
  opcaoDistribuicaoPreco,
  opcaoRotasCaras,
  opcaoEstacoesConectadas,
  opcaoChord,
  fmtNumero,
  fmtPreco,
} = useTarifasFerroviarias();
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
        label="Total de Rotas"
        icon="i-lucide-route"
        cor="primary"
        :valor="fmtNumero(kpis.total_routes)"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Nº de Estações"
        icon="i-lucide-building"
        cor="success"
        :valor="fmtNumero(kpis.total_stations)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Preço Médio"
        icon="i-lucide-euro"
        cor="warning"
        :valor="fmtPreco(kpis.avg_price)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Preço Mínimo"
        icon="i-lucide-arrow-down-right"
        cor="error"
        :valor="fmtPreco(kpis.min_price)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Preço Máximo"
        icon="i-lucide-arrow-up-right"
        cor="info"
        :valor="fmtPreco(kpis.max_price)"
        :carregando="carregandoKpis"
      />
    </div>

    <!-- ── Linha 3: Estações mais conectadas ─────────────────────── -->
    <GraficoCard
      :opcao="opcaoEstacoesConectadas"
      :tema="temaGrafico"
      :altura="260"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-network"
          class="text-success size-4"
        />
        Top 10 Estações com mais Conexões
      </template>
    </GraficoCard>

    <!-- ── Chord: Conexões entre Estações ─────────────────────────── -->
    <GraficoCard
      :opcao="opcaoChord"
      :tema="temaGrafico"
      :altura="400"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-circle-dot"
          class="text-primary size-4"
        />
        Rede de Conexões entre Estações
        <UBadge variant="soft">
          Top 10 · Chord
        </UBadge>
      </template>
    </GraficoCard>
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
</style>
