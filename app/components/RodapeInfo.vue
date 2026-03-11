<script
  setup
  lang="ts"
>
const props = defineProps<{
  tempoExecucaoMs: number | null
  quantidadeTotalRegistros: number
  loading: boolean
}>()

const rodapeTempoExecucao = computed(() => {
  if (props.tempoExecucaoMs == null) return null
  return props.tempoExecucaoMs < 1000
    ? `${Math.round(props.tempoExecucaoMs)} ms`
    : `${(props.tempoExecucaoMs / 1000).toFixed(2)} s`
})

const rodapeQuantidadeRegistros = computed(() =>
  ['-', '1 registro'][props.quantidadeTotalRegistros || 0]
  || `${numeroSemCasaDecimal.format(props.quantidadeTotalRegistros)} registros`
)
</script>

<template>
  <div class="rodape-info">
    <span
      v-if="rodapeTempoExecucao != null"
      class="texto-rodape"
    >
      {{ rodapeTempoExecucao }}
    </span>
    <span v-else>&nbsp;</span>
    <span class="contagem-rodape">
      {{ rodapeQuantidadeRegistros }}
    </span>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.rodape-info {
  @apply flex justify-between;
}

.texto-rodape {
  color: var(--ui-text-muted);
}

.contagem-rodape {
  color: var(--ui-text-muted);
}
</style>
