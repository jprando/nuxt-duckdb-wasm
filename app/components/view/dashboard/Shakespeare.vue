<script
  setup
  lang="ts"
>
const {
  carregandoKpis,
  erro,
  kpis,
  temaGrafico,
  opcaoPecas,
  opcaoPersonagens,
  opcaoAto,
  opcaoElenco,
  opcaoComprimento,
  fmtNumero,
  fmtDecimal,
} = useShakespeare();
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
      <!-- Total de linhas -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              name="i-lucide-scroll-text"
              class="size-5 text-primary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Linhas
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-24" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_lines) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de peças -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-success/10 shrink-0">
            <UIcon
              name="i-lucide-book-open"
              class="size-5 text-success"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Total de Peças
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-16" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_plays) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Total de personagens -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-warning/10 shrink-0">
            <UIcon
              name="i-lucide-users"
              class="size-5 text-warning"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Personagens Únicos
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-20" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtNumero(kpis.total_speakers) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>

      <!-- Média de palavras por fala -->
      <UCard
        :ui="{ body: 'p-4!' }"
        class="overflow-hidden"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-secondary/10 shrink-0">
            <UIcon
              name="i-lucide-message-square"
              class="size-5 text-secondary"
            />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-muted mb-0.5">
              Palavras por Fala
            </p>
            <template v-if="carregandoKpis">
              <USkeleton class="h-7 w-16" />
            </template>
            <template v-else>
              <p class="text-2xl font-bold text-highlighted leading-tight">
                {{ fmtDecimal(kpis.avg_words_per_line) }}
              </p>
            </template>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ── Linha 2: Top peças + Top personagens ───────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <GraficoCard
        :opcao="opcaoPecas"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-book-open"
            class="text-primary size-4"
          />
          Top 10 Peças por Nº de Linhas
        </template>
      </GraficoCard>

      <GraficoCard
        :opcao="opcaoPersonagens"
        :tema="temaGrafico"
        :altura="300"
      >
        <template #titulo>
          <UIcon
            name="i-lucide-mic-2"
            class="text-success size-4"
          />
          Top 15 Personagens mais Falantes
        </template>
      </GraficoCard>
    </div>

    <!-- ── Linha 3: Linhas por Ato + Tamanho do Elenco ───────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      <GraficoCard
        :opcao="opcaoAto"
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
      </GraficoCard>

      <GraficoCard
        :opcao="opcaoElenco"
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
      </GraficoCard>
    </div>

    <!-- ── Linha 4: Comprimento das Falas ─────────────────────────── -->
    <GraficoCard
      :opcao="opcaoComprimento"
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
    </GraficoCard>
  </div>
</template>
