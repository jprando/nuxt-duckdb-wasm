<script
  setup
  lang="ts"
>
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
      <!-- Total de Rotas -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-route"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Rotas
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_routes) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de Estações -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-building"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Nº de Estações
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_stations) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Médio -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-euro"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Preço Médio
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtPreco(kpis.avg_price) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Mínimo -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon
              name="i-lucide-arrow-down-right"
              class="size-5 text-error"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Preço Mínimo
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtPreco(kpis.min_price) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Preço Máximo -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-info/10 shrink-0">
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-5 text-info"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Preço Máximo
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtPreco(kpis.max_price) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Distribuição de Preços + Rotas mais caras ───── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <GraficoCard
        :opcao="opcaoDistribuicaoPreco"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-bar-chart-3"
            class="text-primary size-4"
          />
          Distribuição de Preços
        </template>
      </GraficoCard>

      <GraficoCard
        :opcao="opcaoRotasCaras"
        :tema="temaGrafico"
        :altura="260"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-trending-up"
            class="text-tertiary size-4"
          />
          Top 10 Rotas mais Caras
        </template>
      </GraficoCard>
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
