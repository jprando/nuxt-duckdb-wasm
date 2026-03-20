<script
  setup
  lang="ts"
>
import { LazyGraficoCard } from '@/utils/lazy-components'

const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  configuracaoGraficoAto,
  configuracaoGraficoElenco,
  configuracaoGraficoComprimento,
  fmtNumero,
  fmtDecimal
} = useShakespeare()
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
        label="Total de Linhas"
        icon="i-lucide-scroll-text"
        cor="primary"
        :valor="fmtNumero(kpis.total_lines)"
        :carregando="carregandoKpis"
        esqueleto="w-24"
      />
      <KpiCard
        label="Total de Peças"
        icon="i-lucide-book-open"
        cor="success"
        :valor="fmtNumero(kpis.total_plays)"
        :carregando="carregandoKpis"
        esqueleto="w-16"
      />
      <KpiCard
        label="Personagens Únicos"
        icon="i-lucide-users"
        cor="warning"
        :valor="fmtNumero(kpis.total_speakers)"
        :carregando="carregandoKpis"
      />
      <KpiCard
        label="Palavras por Fala"
        icon="i-lucide-message-square"
        cor="secondary"
        :valor="fmtDecimal(kpis.avg_words_per_line)"
        :carregando="carregandoKpis"
        esqueleto="w-16"
      />
    </div>

    <!-- ── Linha 3: Linhas por Ato + Tamanho do Elenco ───────────── -->
    <div class="grade-graficos">
      <LazyGraficoCard
        :configuracao="configuracaoGraficoAto"
        :tema="temaGrafico"
        :altura="220"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-layers"
            class="text-warning size-4"
          />
          Linhas por Ato
        </template>
      </LazyGraficoCard>

      <LazyGraficoCard
        :configuracao="configuracaoGraficoElenco"
        :tema="temaGrafico"
        :altura="220"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-users-2"
            class="text-secondary size-4"
          />
          Tamanho do Elenco
          <UBadge variant="soft">
            Top 10 Peças
          </UBadge>
        </template>
      </LazyGraficoCard>
    </div>

    <!-- ── Linha 4: Comprimento das Falas ─────────────────────────── -->
    <LazyGraficoCard
      :configuracao="configuracaoGraficoComprimento"
      :tema="temaGrafico"
      :altura="200"
    >
      <template #titulo>
        <UIcon
          name="i-lucide-align-left"
          class="text-primary size-4"
        />
        Distribuição do Comprimento das Falas
        <UBadge variant="soft">
          caracteres
        </UBadge>
      </template>
    </LazyGraficoCard>
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
