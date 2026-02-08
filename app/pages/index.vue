<script
  setup
  lang="ts"
>
const {
  estahCarregando,
  obterDadosSimples,
  obterDadosParquet,
} = useDuckDb();

const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(1);
const paginadorKey = ref(0);

const datasetSelecionado = ref<DatasetParquet | undefined>();

const itensAgrupados = computed(() => {
  const grupos = new Map<string, DatasetParquet[]>();
  for (const ds of datasetsParquet) {
    const lista = grupos.get(ds.grupo) ?? [];
    lista.push(ds);
    grupos.set(ds.grupo, lista);
  }
  return Array.from(grupos.values());
});

const colunas = computed(() =>
  !estahCarregando.value
    && Array.isArray(registros.value)
    && registros.value?.length
    ? Object.keys(registros.value?.[0])
    : []
);

const rodapeQuantidadeRegistros = computed(() =>
  ["nenhum registro", "1 registro"][quantidadeTotalRegistros.value || 0]
  || `${numeroSemCasaDecimal.format(quantidadeTotalRegistros.value)} registros`
);

const tempoExecucaoMs = ref<number | null>(null);

const executarConsulta = async (
  pagina: number = 1,
  totalPagina: number = 50,
) => {
  if (!datasetSelecionado.value) return;

  const inicio = performance.now();
  const url = datasetSelecionado.value.url;
  const resultado = url === ""
    ? await obterDadosSimples(pagina, totalPagina)
    : await obterDadosParquet(pagina, totalPagina, url);

  tempoExecucaoMs.value = performance.now() - inicio;
  registros.value = resultado.registros;
  quantidadeTotalRegistros.value = resultado.quantidadeTotal;
};

// onMounted(fetchData);
</script>

<template>
  <UContainer class="flex-1 flex flex-col min-h-0 pt-3 px-4">
    <UCard
      class="flex-1 flex flex-col min-h-0"
      :ui="{
        root: 'flex-1 flex flex-col min-h-0',
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
                placeholder="Selecione um dataset..."
                size="xl"
                class="w-full"
                :search-input="false"
              />
            </div>
            <UButton
              size="xl"
              :disabled="!datasetSelecionado"
              :loading="estahCarregando"
              class="justify-center w-28 min-w-28 max-w-28"
              @click="() => {
                paginaAtual = 1;
                paginadorKey++;
                executarConsulta(paginaAtual);
              }"
            >
              <span class="truncate">
                {{ estahCarregando ? "carregando" : "carregar" }}
              </span>
            </UButton>
          </div>
          <UPagination
            :key="paginadorKey"
            v-model="paginaAtual"
            :disabled="estahCarregando || !datasetSelecionado"
            :sibling-count="3"
            :items-per-page="duckDBItensPorPagina"
            :total="quantidadeTotalRegistros || 1"
            @update:page="(valorPagina: number) => executarConsulta(valorPagina, 50)"
            show-edges
            variant="link"
            size="xl"
          />
        </div>
      </template>
      <template #default>
        <div>
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
        </div>
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
