<script
  setup
  lang="ts"
>
const props = withDefaults(
  defineProps<{
    colunas?: number;
  }>(),
  {
    colunas: 5,
  },
);

const tabelaRef = ref<HTMLTableElement | null>(null);
const linhas = ref(0);

const larguras = [
  "w-full",
  "w-11/12",
  "w-5/6",
  "w-4/5",
  "w-3/4",
  "w-2/3",
  "w-3/5",
  "w-1/2",
];

const gerarLargura = (linha: number, coluna: number) =>
  larguras[(linha * props.colunas + coluna * 7) % larguras.length];

const calcularLinhas = () => {
  const tabela = tabelaRef.value;
  if (!tabela) return;

  const container = tabela.parentElement;
  if (!container) return;

  const alturaContainer = container.clientHeight;
  const thead = tabela.querySelector("thead");
  const primeiraLinha = tabela.querySelector("tbody tr");

  if (!thead || !primeiraLinha) return;

  const alturaHeader = thead.getBoundingClientRect().height;
  const alturaLinha = primeiraLinha.getBoundingClientRect().height;

  if (alturaLinha <= 0) return;

  linhas.value = Math.floor((alturaContainer - alturaHeader) / alturaLinha);
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  // Renderiza 1 linha inicial para poder medir
  linhas.value = 1;

  nextTick(() => {
    calcularLinhas();

    const container = tabelaRef.value?.parentElement;
    if (container) {
      observer = new ResizeObserver(calcularLinhas);
      observer.observe(container);
    }
  });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <table
    ref="tabelaRef"
    class="w-full"
  >
    <thead>
      <tr>
        <th
          v-for="i in colunas"
          :key="i"
          class="px-5 py-2"
        >
          <USkeleton class="h-4 w-full" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in linhas"
        :key="row"
      >
        <td
          v-for="col in colunas"
          :key="col"
          class="px-5 py-2"
        >
          <USkeleton
            class="h-3.5"
            :class="gerarLargura(row, col)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
