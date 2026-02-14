<script
  setup
  lang="ts"
>
const {
  estahCarregando,
  obterDadosSimples,
  obterDadosParquet,
} = useDuckDb();

const ultimoDatasetCarregado = ref<string | null>(null);
const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(1);
const datasetSelecionado = ref<DatasetParquet | undefined>();
const paginadorSiblingCount = ref(1);
const tempoExecucaoMs = ref<number | null>(null);
const elmPaginacao = ref<HTMLDivElement | null>(null);
const debounceTimerId = ref<ReturnType<typeof setTimeout> | null>(null);

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
    && registros.value.length
    ? Object.keys(registros.value[0])
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

const calcularDeslocamento = (base: number, ehPrimeiraPagina: boolean) =>
  ehPrimeiraPagina ? base - 1 : base;

const teclasNavegacao: Record<string, (pagina: number, shift: boolean, ehPrimeira: boolean) => number> = {
  ArrowRight: (p, shift, eh1) => p + (shift ? calcularDeslocamento(5, eh1) : 1),
  ArrowLeft: (p, shift, eh1) => p - (shift ? calcularDeslocamento(5, eh1) : 1),
  Home: () => 1,
  End: () => totalPaginas.value,
  PageUp: (p, shift, eh1) => p + calcularDeslocamento(shift ? 100 : 50, eh1),
  PageDown: (p, shift, eh1) => p - calcularDeslocamento(shift ? 100 : 50, eh1),
};

const aoTeclarNoPaginador = (evento: KeyboardEvent) => {
  evento.preventDefault();
  if (estahCarregando.value) return;

  const calcular = teclasNavegacao[evento.key];
  if (!calcular) return;

  const novaPagina = Math.max(
    1,
    Math.min(
      calcular(paginaAtual.value, evento.shiftKey, paginaAtual.value === 1),
      totalPaginas.value,
    ),
  );

  if (novaPagina !== paginaAtual.value) {
    paginaAtual.value = novaPagina;
    if (debounceTimerId.value) clearTimeout(debounceTimerId.value);
    debounceTimerId.value = setTimeout(() => {
      executarConsulta(paginaAtual.value);
    }, 650);
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
        <TabelaSkeleton v-if="estahCarregando" />

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
