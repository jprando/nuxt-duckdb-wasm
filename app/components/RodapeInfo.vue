<script
  setup
  lang="ts"
>
const props = defineProps<{
  tempoExecucaoMs: number | null
  quantidadeTotalRegistros: number
  loading: boolean
}>()

const rodapeQuantidadeRegistros = computed(() =>
  ['-', '1 registro'][props.quantidadeTotalRegistros || 0]
  || `${numeroSemCasaDecimal.format(props.quantidadeTotalRegistros)} registros`
)
</script>

<template>
  <div class="rodape-info">
    <span
      v-if="tempoExecucaoMs != null"
      class="texto-rodape"
    >
      {{
        tempoExecucaoMs < 1000
          ? `${Math.round(tempoExecucaoMs)} ms`
          : `${(tempoExecucaoMs / 1000).toFixed(2)} s`
      }}
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
