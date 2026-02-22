<script
  setup
  lang="ts"
>
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
      <!-- Total de Estações -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-building-2"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Estações
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_estacoes) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Países Cobertos -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-globe"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Países Cobertos
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-16" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_paises) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Tipos de Estação -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-layers"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Tipos de Estação
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-14" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_tipos) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Megaestações -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-star"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Megaestações
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-14" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.megaestacoes) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Estações na Holanda -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-info/10 shrink-0">
            <UIcon
              name="i-lucide-train"
              class="size-5 text-info"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Estações na Holanda
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.estacoes_nl) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Estações Intercidade -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon
              name="i-lucide-zap"
              class="size-5 text-error"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Estações Intercidade
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.estacoes_intercidade) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 1: Países + Tipos ────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
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
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
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
