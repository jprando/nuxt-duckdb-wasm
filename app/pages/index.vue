<script
  setup
  lang="ts"
>
const {
  estahCarregando,
  obterDadosSimples,
  obterDadosSimplesQuantidade,
  obterDadosParquet,
  obterDadosParquetQuantidade,
} = useDuckDb();

const ultimoDatasetCarregado = ref<string | null>(null);
const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(1);
const datasetSelecionado = ref<DatasetParquet | undefined>();
const tempoExecucaoMs = ref<number | null>(null);
const elmPaginacao = useTemplateRef<{ focus: () => void }>("elmPaginacao");

const colunas = computed(() =>
  Array.isArray(registros.value) && registros.value.length
    ? Object.keys(registros.value[0])
    : []
);

const executarConsulta = async (
  pagina: number = 1,
  itensPorPagina: number = duckDBItensPorPagina,
) => {
  if (!datasetSelecionado.value) return;

  paginaAtual.value = pagina;
  tempoExecucaoMs.value = null;

  const url = datasetSelecionado.value.url;
  const inicio = performance.now();

  if (ultimoDatasetCarregado.value !== datasetSelecionado.value.label) {
    quantidadeTotalRegistros.value = 0;
    const quantidadeRegistros = url === ""
      ? await obterDadosSimplesQuantidade()
      : await obterDadosParquetQuantidade(url);
    quantidadeTotalRegistros.value = quantidadeRegistros;
  }

  ultimoDatasetCarregado.value = datasetSelecionado.value.label;

  const _registros = url === ""
    ? await obterDadosSimples(pagina, itensPorPagina)
    : await obterDadosParquet(pagina, itensPorPagina, url);

  tempoExecucaoMs.value = performance.now() - inicio;
  registros.value = _registros;

  elmPaginacao.value?.focus();
};
</script>

<template>
  <NuxtLayout>
    <template #header>
      <div class="flex flex-col gap-4">
        <SeletorDataset
          v-model:dataset-selecionado="datasetSelecionado"
          :loading="estahCarregando"
          @carregar="() => {
            // quantidadeTotalRegistros = 0;
            executarConsulta(1);
          }"
        />
        <Paginador
          ref="elmPaginacao"
          v-model:page="paginaAtual"
          :disabled="estahCarregando || !datasetSelecionado"
          :total="quantidadeTotalRegistros"
          @consultar-pagina="(numeroPagina: number) =>
          executarConsulta(numeroPagina, duckDBItensPorPagina)"
        />
      </div>
    </template>

    <template #default>
      <TabelaDados
        :colunas="colunas"
        :registros="registros"
        :estah-carregando="estahCarregando"
      />
    </template>

    <template #footer>
      <RodapeInfo
        :tempo-execucao-ms="tempoExecucaoMs"
        :quantidade-total-registros="quantidadeTotalRegistros"
        :loading="estahCarregando"
      />
    </template>
  </NuxtLayout>
</template>
