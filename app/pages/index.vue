<script
  setup
  lang="ts"
>
const {
  estahInicializando,
  estahCarregando,
  obterDadosSimples,
  obterDadosParquet,
} = useDuckDb();

const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(0);

const carregando = computed(() =>
  estahInicializando.value || estahCarregando.value
);

const colunas = computed(() =>
  !carregando.value
    && Array.isArray(registros.value)
    && registros.value?.length
    ? Object.keys(registros.value?.[0])
    : []
);

const rodapeQuantidadeRegistros = computed(() =>
  ["nenhum registro", "1 registro"][quantidadeTotalRegistros.value || 0]
  || `${numeroSemCasaDecimal.format(quantidadeTotalRegistros.value)} registros`
);

const executarObterDadosSimples = async (
  pagina: number = 0,
  totalPagina: number = 50,
) => {
  const {
    registros: _registros,
    quantidadeTotal,
  } = await obterDadosSimples(pagina, totalPagina);
  registros.value = _registros;
  quantidadeTotalRegistros.value = quantidadeTotal;
  ultimaConsultaExecutada = executarObterDadosSimples;
};

const executarObterDadosParquet = async (
  pagina: number = 0,
  totalPagina: number = 50,
) => {
  const {
    registros: _registros,
    quantidadeTotal,
  } = await obterDadosParquet(pagina, totalPagina);
  registros.value = _registros;
  quantidadeTotalRegistros.value = quantidadeTotal;
  ultimaConsultaExecutada = executarObterDadosParquet;
};

let ultimaConsultaExecutada: (
  pagina: number,
  totalPagina: number,
) => Promise<unknown> = executarObterDadosSimples;

// onMounted(fetchData);
</script>

<template>
  <UContainer class="ucontainer">
    <UCard
      class="mt-10"
      :ui="{ body: 'p-0!' }"
    >
      <template #header>
        <div class="flex gap-4 justify-between items-baseline">
          <div class="grid grid-cols-3 grid-rows-2 grid-flow-col gap-4 overflow-x-auto">
            <UButton
              @click="() => {
                paginaAtual = 0;
                executarObterDadosSimples(paginaAtual);
              }"
              size="xl"
            >
              carregar dados simples
            </UButton>
            <UButton
              @click="() => {
                paginaAtual = 0;
                executarObterDadosParquet(paginaAtual);
              }"
              size="xl"
            >
              carregar dados parquet
            </UButton>
            <UPagination
              v-if="quantidadeTotalRegistros"
              v-model="paginaAtual"
              show-edges
              variant="link"
              size="xl"
              class="place-content-center-safe row-span-2 col-span-2"
              :sibling-count="3"
              :items-per-page="50"
              :total="quantidadeTotalRegistros"
              @update:page="(valorPagina: number) => ultimaConsultaExecutada(valorPagina, 50)"
            />
          </div>
          <div class="items-baseline">
            <span v-if="carregando"> carregando... </span>
          </div>
        </div>
      </template>
      <template #default>
        <div class="min-h-115 max-h-115 overflow-y-auto">
          <!-- <ClientOnly> -->
          <table class="w-full">
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
          <!-- </ClientOnly> -->
        </div>
      </template>
      <template #footer>
        <span class="flex justify-end">
          {{ rodapeQuantidadeRegistros }}
        </span>
      </template>
    </UCard>
  </UContainer>
</template>
