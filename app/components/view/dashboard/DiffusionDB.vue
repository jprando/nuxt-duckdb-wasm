<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoDimensoes,
  opcaoNsfw,
  opcaoSteps,
  opcaoSampler,
  opcaoAtividade,
  fmtNumero,
  fmtDecimal,
  fmtData,
} = useDiffusionDB();
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
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <!-- Total de Imagens -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon name="i-lucide-image" class="size-5 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Imagens
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_imagens) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Usuários Únicos -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon name="i-lucide-users" class="size-5 text-success" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Usuários Únicos
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_usuarios) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Taxa NSFW -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-error/10 shrink-0">
            <UIcon name="i-lucide-shield-alert" class="size-5 text-error" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Taxa NSFW
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-16" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDecimal(kpis.pct_nsfw) }}%
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Steps Médio -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon name="i-lucide-sliders" class="size-5 text-warning" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Steps Médios
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-16" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDecimal(kpis.steps_medio) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Período -->
      <UCard :ui="{ body: 'p-4!' }">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon name="i-lucide-calendar-range" class="size-5 text-secondary" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Período
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-28" />
            </template>
            <template v-else>
              <p class="text-sm font-bold text-highlighted leading-tight">
                {{ fmtData(kpis.periodo_inicio) }}
              </p>
              <p class="text-xs text-muted">
                até {{ fmtData(kpis.periodo_fim) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 1: Dimensões + NSFW ──────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Top 10 Dimensões -->
      <GraficoCard :opcao="opcaoDimensoes" :tema="temaGrafico" :altura="280">
        <template #titulo>
          <UIcon name="i-lucide-frame" class="text-primary size-4" />
          Dimensões Mais Usadas
          <UBadge variant="soft">
            Top 10
          </UBadge>
        </template>
      </GraficoCard>

      <!-- Classificação NSFW -->
      <GraficoCard :opcao="opcaoNsfw" :tema="temaGrafico" :altura="280">
        <template #titulo>
          <UIcon name="i-lucide-shield" class="text-error size-4" />
          Classificação de Segurança (NSFW)
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 2: Steps + Samplers ──────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Distribuição de Steps -->
      <GraficoCard :opcao="opcaoSteps" :tema="temaGrafico" :altura="260">
        <template #titulo>
          <UIcon name="i-lucide-sliders-horizontal" class="text-warning size-4" />
          Distribuição de Steps de Inferência
        </template>
      </GraficoCard>

      <!-- Samplers -->
      <GraficoCard :opcao="opcaoSampler" :tema="temaGrafico" :altura="260">
        <template #titulo>
          <UIcon name="i-lucide-cpu" class="text-secondary size-4" />
          Algoritmo de Sampling Usado
        </template>
      </GraficoCard>
    </div>

    <!-- ── Atividade por Hora ──────────────────────────────────────── -->
    <GraficoCard :opcao="opcaoAtividade" :tema="temaGrafico" :altura="220">
      <template #titulo>
        <UIcon name="i-lucide-clock" class="text-success size-4" />
        Atividade de Geração por Hora do Dia
        <UBadge variant="soft">
          UTC
        </UBadge>
      </template>
    </GraficoCard>
  </div>
</template>
