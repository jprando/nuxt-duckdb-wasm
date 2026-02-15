<script
  setup
  lang="ts"
>
const props = defineProps<{
  tempoExecucaoMs: number | null
  quantidadeTotalRegistros: number
  loading: boolean
}>();

const rodapeQuantidadeRegistros = computed(() =>
  props.loading
    ? "carregando, aguarde..."
    : ["nenhum registro", "1 registro"][props.quantidadeTotalRegistros || 0]
      || `${
        numeroSemCasaDecimal.format(props.quantidadeTotalRegistros)
      } registros`
);
</script>

<template>
  <div class="flex justify-between">
    <span
      v-if="tempoExecucaoMs != null"
      class="text-neutral-400"
    >
      {{
        tempoExecucaoMs < 1000
        ? `${Math.round(tempoExecucaoMs)} ms`
        : `${(tempoExecucaoMs / 1000).toFixed(2)} s`
      }}
    </span>
    <span v-else> </span>
    <span class="text-neutral-400">
      {{ rodapeQuantidadeRegistros }}
    </span>
  </div>
</template>
