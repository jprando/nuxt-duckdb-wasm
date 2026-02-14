<script
  setup
  lang="ts"
>
const {
  estahCarregando,
  obterDadosSimples,
  obterDadosParquet,
} = useDuckDb();

const ultimoDatasetCarregado = ref<String | null>(null);
const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(1);
const datasetSelecionado = ref<DatasetParquet | undefined>();
const paginadorSiblingCount = ref(1);
const tempoExecucaoMs = ref<number | null>(null);
const elmPaginacao = ref<HTMLDivElement | null>(null);
const intervalId = ref<NodeJS.Timeout | null>(null);

const totalPaginas = computed(() =>
  Math.max(
    1,
    Math.ceil((quantidadeTotalRegistros.value || 1) / duckDBItensPorPagina),
  )
);

const itensAgrupados = computed(() => {
  const grupos = new Map<string, DatasetParquet[]>();
  for (const ds of datasetsParquet) {
    const lista = grupos.get(ds.grupo) ?? [];
    lista.push(ds);
    grupos.set(ds.grupo, lista);
  }
  const items:
    (DatasetParquet | { type: "label" | "separator"; label?: string })[] = [];
  for (const [nome, lista] of grupos) {
    if (items.length) items.push({ type: "separator" });
    items.push({ type: "label", label: nome });
    items.push(...lista);
  }
  return items;
});

const colunas = computed(() =>
  !estahCarregando.value
    && Array.isArray(registros.value)
    && registros.value?.length
    ? Object.keys(registros.value?.[0])
    : []
);

const rodapeQuantidadeRegistros = computed(() =>
  estahCarregando.value
    ? "carregando, aguarde..."
    : ["nenhum registro", "1 registro"][quantidadeTotalRegistros.value || 0]
      || `${
        numeroSemCasaDecimal.format(quantidadeTotalRegistros.value)
      } registros`
);

const aoTeclarNoPaginador = (evento: KeyboardEvent) => {
  evento.preventDefault();

  if (estahCarregando.value) return;

  let novaPagina = paginaAtual.value;

  switch (evento.key) {
    case "ArrowRight":
      novaPagina = Math.min(paginaAtual.value + 1, totalPaginas.value);
      break;
    case "ArrowLeft":
      novaPagina = Math.max(paginaAtual.value - 1, 1);
      break;
    case "Home":
      novaPagina = 1;
      break;
    case "End":
      novaPagina = totalPaginas.value;
      break;
    case "PageUp":
      novaPagina = Math.min(
        paginaAtual.value + (evento.shiftKey ? 100 : 50),
        totalPaginas.value,
      );
      break;
    case "PageDown":
      novaPagina = Math.max(
        paginaAtual.value - (evento.shiftKey ? 100 : 50),
        1,
      );
      break;
  }

  if (novaPagina !== paginaAtual.value) {
    executarConsulta(novaPagina);
  }
};

const executarConsulta = async (
  pagina: number = 1,
  itensPorPagina: number = duckDBItensPorPagina,
) => {
  if (!datasetSelecionado.value) return;

  paginaAtual.value = pagina;

  tempoExecucaoMs.value = null;
  const inicio = performance.now();
  const url = datasetSelecionado.value.url;
  ultimoDatasetCarregado.value = datasetSelecionado.value.label;
  const resultado = url === ""
    ? await obterDadosSimples(pagina, itensPorPagina)
    : await obterDadosParquet(pagina, itensPorPagina, url);

  tempoExecucaoMs.value = performance.now() - inicio;
  registros.value = resultado.registros;
  quantidadeTotalRegistros.value = resultado.quantidadeTotal;
  elmPaginacao.value?.focus();
};

onMounted(() => {
  const breakpoints: [MediaQueryList, number][] = [
    [matchMedia("(min-width: 1280px)"), 5],
    [matchMedia("(min-width: 1200px)"), 5],
    [matchMedia("(min-width: 1120px)"), 4],
    [matchMedia("(min-width: 1040px)"), 4],
    [matchMedia("(min-width: 960px)"), 3],
    [matchMedia("(min-width: 880px)"), 3], // 883
    [matchMedia("(min-width: 800px)"), 2],
    [matchMedia("(min-width: 720px)"), 2],
    [matchMedia("(min-width: 640px)"), 1],
    [matchMedia("(min-width: 560px)"), 1],
    [matchMedia("(min-width: 480px)"), 1],
    [matchMedia("(min-width: 400px)"), 1], // 417
  ];
  const atualizar = () => {
    paginadorSiblingCount.value = breakpoints.find(([mq]) => mq.matches)?.[1]
      ?? 1;
  };
  atualizar();
  breakpoints.forEach(([mq]) => mq.addEventListener("change", atualizar));
  if (import.meta.env.DEV) {
    intervalId.value = setInterval(() => {
      try {
        if (
          !estahCarregando.value
          && ultimoDatasetCarregado.value === datasetSelecionado.value?.label
          && quantidadeTotalRegistros.value > 1
          && paginaAtual.value < totalPaginas.value
        ) {
          executarConsulta(paginaAtual.value + 1);
        }
      } finally {
      }
    }, 3250);
  }
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <UContainer class="flex flex-1 flex-col min-h-0 pt-0 px-0.5 sm:pt-3">
    <UCard
      class="flex-1 flex flex-col min-h-0"
      :ui="{
        header: 'p-2 sm:px-6',
        root: 'flex-1 flex flex-col min-h-0 ring-0! sm:ring-1!',
        body: 'flex-1 min-h-0 overflow-y-auto p-0',
        footer: 'py-1.5 px-4 sm:px-4',
      }"
    >
      <template #header>
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-end gap-2">
            <div class="flex-1">
              <label class="text-sm font-medium text-neutral-250 mb-1 block">
                Datasets
              </label>
              <USelectMenu
                v-model="datasetSelecionado"
                :items="itensAgrupados"
                :search-input="false"
                :loading="estahCarregando"
                :disabled="estahCarregando"
                :ui="{
                  trailingIcon:
                    'group-data-[state=open]:rotate-180 transition-transform duration-200',
                }"
                variant="soft"
                placeholder="Selecione um dataset..."
                size="xl"
                class="w-full"
              />
            </div>
            <UButton
              size="xl"
              :disabled="!datasetSelecionado"
              :loading="estahCarregando"
              class="justify-center w-28 min-w-28 max-w-28"
              @click="() => {
                estahCarregando = true;
                quantidadeTotalRegistros = 0;
                executarConsulta(1);
              }"
            >
              <span class="truncate">
                {{ estahCarregando ? "carregando" : "carregar" }}
              </span>
            </UButton>
          </div>
          <div
            tabindex="0"
            ref="elmPaginacao"
            @keydown="aoTeclarNoPaginador"
          >
            <UPagination
              v-model:page="paginaAtual"
              :disabled="estahCarregando || !datasetSelecionado"
              :show-edges="true"
              :show-controls="false"
              :sibling-count="paginadorSiblingCount"
              :items-per-page="duckDBItensPorPagina"
              :total="quantidadeTotalRegistros || 1"
              @update:page="(valorPagina: number) => executarConsulta(valorPagina, duckDBItensPorPagina)"
              activeVariant="subtle"
              class="pagination"
              variant="ghost"
              size="xl"
            />
          </div>
        </div>
      </template>

      <template #default>
        <!-- <div> -->
        <!-- Skeleton de tabela durante carregamento -->
        <table
          v-if="estahCarregando"
          class="w-full"
        >
          <thead>
            <tr>
              <th
                v-for="i in 5"
                :key="i"
                class="px-5 py-2"
              >
                <USkeleton class="h-4 w-full" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in 8"
              :key="row"
            >
              <td
                v-for="col in 5"
                :key="col"
                class="px-5 py-2"
              >
                <USkeleton
                  class="h-3.5"
                  :class="col === 1 ? 'w-3/4' : col === 3 ? 'w-1/2' : 'w-full'"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabela com dados -->
        <table
          v-else
          class="w-full"
        >
          <thead class="text-justify">
            <th
              v-for="(nomeColuna, indexColuna) in colunas"
              :key="`${registros?.length || 0}:${indexColuna}`"
              class="px-5"
            >
              {{ nomeColuna }}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(itemRegistro, indexRegistro) in registros"
              :key="(registros?.length || 0) - indexRegistro"
              class="text-justify"
            >
              <td
                v-for="(nomeColuna, indexColuna) in colunas"
                :key="(registros?.length || 0) - indexColuna"
                class="px-5"
              >
                {{ itemRegistro?.[nomeColuna] }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- </div> -->
      </template>

      <template #footer>
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
    </UCard>
  </UContainer>
</template>

<style scoped>
nav.pagination button:first-child {
  padding-left: 0px !important;
}
</style>
