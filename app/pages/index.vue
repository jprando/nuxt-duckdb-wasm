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
const tempoExecucaoMs = ref<number | null>(null);
const elmPaginacao = useTemplateRef<{ focus: () => void }>("elmPaginacao");

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
          <SeletorDataset
            v-model:dataset-selecionado="datasetSelecionado"
            :loading="estahCarregando"
            @carregar="() => {
              estahCarregando = true;
              quantidadeTotalRegistros = 0;
              executarConsulta(1);
            }"
          />
          <Paginador
            ref="elmPaginacao"
            v-model:page="paginaAtual"
            :disabled="estahCarregando || !datasetSelecionado"
            :total="quantidadeTotalRegistros"
            @consultar-pagina="(p) => executarConsulta(p, duckDBItensPorPagina)"
          />
        </div>
      </template>

      <template #default>
        <TabelaSkeleton v-if="estahCarregando" />
        <TabelaDados
          v-else
          :colunas="colunas"
          :registros="registros"
        />
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
