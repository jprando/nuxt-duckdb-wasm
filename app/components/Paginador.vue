<script
  setup
  lang="ts"
>
const pagina = defineModel<number>("page", { required: true });

const props = defineProps<{
  disabled: boolean
  total: number
}>();

const emit = defineEmits<{
  consultarPagina: [pagina: number]
}>();

const paginadorSiblingCount = ref(1);
const elmRaiz = ref<HTMLDivElement | null>(null);
const debounceTimerId = ref<ReturnType<typeof setTimeout> | null>(null);

const totalPaginas = computed(() =>
  Math.max(
    1,
    Math.ceil((props.total || 1) / duckDBItensPorPagina),
  )
);

const calcularDeslocamento = (base: number, ehPrimeiraPagina: boolean) =>
  ehPrimeiraPagina ? base - 1 : base;

const teclasNavegacao: Record<string, (p: number, shift: boolean, eh1: boolean) => number> = {
  ArrowRight: (p, shift, eh1) => p + (shift ? calcularDeslocamento(5, eh1) : 1),
  ArrowLeft: (p, shift, eh1) => p - (shift ? calcularDeslocamento(5, eh1) : 1),
  Home: () => 1,
  End: () => totalPaginas.value,
  PageUp: (p, shift, eh1) => p + calcularDeslocamento(shift ? 100 : 50, eh1),
  PageDown: (p, shift, eh1) => p - calcularDeslocamento(shift ? 100 : 50, eh1),
};

const aoTeclarNoPaginador = (evento: KeyboardEvent) => {
  evento.preventDefault();
  if (props.disabled) return;

  const calcular = teclasNavegacao[evento.key];
  if (!calcular) return;

  const novaPagina = Math.max(
    1,
    Math.min(
      calcular(pagina.value, evento.shiftKey, pagina.value === 1),
      totalPaginas.value,
    ),
  );

  if (novaPagina !== pagina.value) {
    pagina.value = novaPagina;
    if (debounceTimerId.value) clearTimeout(debounceTimerId.value);
    debounceTimerId.value = setTimeout(() => {
      emit("consultarPagina", pagina.value);
    }, 650);
  }
};

const focus = () => elmRaiz.value?.focus();

defineExpose({ focus });

onMounted(() => {
  const breakpoints: [string, number][] = [
    ["(min-width: 1120px)", 4],
    ["(min-width: 960px)", 3],
    ["(min-width: 800px)", 2],
    ["(min-width: 400px)", 1],
  ];
  const mediaQueries = breakpoints.map(
    ([query, count]) => [matchMedia(query), count] as const,
  );
  const atualizar = () => {
    paginadorSiblingCount.value = mediaQueries.find(([mq]) => mq.matches)?.[1]
      ?? 1;
  };
  atualizar();
  mediaQueries.forEach(([mq]) => mq.addEventListener("change", atualizar));
});

onUnmounted(() => {
  if (debounceTimerId.value) {
    clearTimeout(debounceTimerId.value);
  }
});
</script>

<template>
  <div
    tabindex="0"
    ref="elmRaiz"
    @keydown="aoTeclarNoPaginador"
  >
    <UPagination
      v-model:page="pagina"
      :disabled="disabled"
      :show-edges="true"
      :show-controls="false"
      :sibling-count="paginadorSiblingCount"
      :items-per-page="duckDBItensPorPagina"
      :total="total || 1"
      @update:page="(valorPagina: number) => emit('consultarPagina', valorPagina)"
      activeVariant="subtle"
      class="pagination"
      variant="ghost"
      size="xl"
    />
  </div>
</template>

<style scoped>
nav.pagination button:first-child {
  padding-left: 0px !important;
}
</style>
