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
  opcaoPaises,
  opcaoTipos,
  opcaoCategorias,
  opcaoLatitude,
  opcaoLongitude,
  opcaoTiposPorPais,
  fmtNumero,
} = useEstacoesTrem();
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
        label="Total de Estações"
        icon="i-lucide-building-2"
        cor="primary"
        :valor="fmtNumero(kpis.total_estacoes)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Países Cobertos"
        icon="i-lucide-globe"
        cor="success"
        :valor="fmtNumero(kpis.total_paises)"
        :carregando="carregandoKpis"
        esqueleto="w-16"
      />
      <KpiCard
        label="Tipos de Estação"
        icon="i-lucide-layers"
        cor="warning"
        :valor="fmtNumero(kpis.total_tipos)"
        :carregando="carregandoKpis"
        esqueleto="w-14"
      />
      <KpiCard
        label="Megaestações"
        icon="i-lucide-star"
        cor="secondary"
        :valor="fmtNumero(kpis.megaestacoes)"
        :carregando="carregandoKpis"
        esqueleto="w-14"
      />
      <KpiCard
        label="Estações na Holanda"
        icon="i-lucide-train"
        cor="info"
        :valor="fmtNumero(kpis.estacoes_nl)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Estações Intercidade"
        icon="i-lucide-zap"
        cor="error"
        :valor="fmtNumero(kpis.estacoes_intercidade)"
        :carregando="carregandoKpis"
      />
    </div>

    <!-- ── Linha 1: Países + Tipos ────────────────────────────────── -->
    <div class="grade-graficos">
      <!-- Estações por País -->
      <GraficoCard
        :opcao="opcaoPaises"
        :tema="temaGrafico"
        :altura="280"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-globe"
            class="text-primary size-4"
          />
          Estações por País
        </template>
      </GraficoCard>

      <!-- Tipos de Estação (donut) -->
      <GraficoCard
        :opcao="opcaoTipos"
        :tema="temaGrafico"
        :altura="280"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-pie-chart"
            class="text-success size-4"
          />
          Distribuição por Tipo de Estação
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 2: Categorias + Latitude ─────────────────────────── -->
    <div class="grade-graficos">
      <!-- Categorias Simplificadas -->
      <GraficoCard
        :opcao="opcaoCategorias"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-layers"
            class="text-warning size-4"
          />
          Categorias de Estação
        </template>
      </GraficoCard>

      <!-- Distribuição por Latitude -->
      <GraficoCard
        :opcao="opcaoLatitude"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-move-vertical"
            class="text-warning size-4"
          />
          Distribuição Norte–Sul
          <UBadge variant="soft">
            Latitude
          </UBadge>
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 3: Longitude ─────────────────────────────────────── -->
    <GraficoCard
      :opcao="opcaoLongitude"
      :tema="temaGrafico"
      :altura="200"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-move-horizontal"
          class="text-secondary size-4"
        />
        Distribuição Leste–Oeste
        <UBadge variant="soft">
          Longitude
        </UBadge>
      </template>
    </GraficoCard>

    <!-- ── Linha 4: Tipos por País (stacked bar) ──────────────────── -->
    <GraficoCard
      :opcao="opcaoTiposPorPais"
      :tema="temaGrafico"
      :altura="280"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-bar-chart-3"
          class="text-primary size-4"
        />
        Composição por Tipo
        <UBadge variant="soft">
          Top 6 Países
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
