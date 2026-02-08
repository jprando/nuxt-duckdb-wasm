<script setup lang="ts">
const {
  estahCarregando,
  obterDadosSimples,
  obterDadosParquet,
} = useDuckDb();

const registros = ref<any[]>([]);
const quantidadeTotalRegistros = ref(0);
const paginaAtual = ref(1);

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
    <UCard class="mt-10" :ui="{ body: 'p-0!' }">
      <template #header>
        <div class="flex flex-row items-center gap-4">
          <div class="flex flex-col gap-2 shrink-0">
            <UButton @click="() => {
              paginaAtual = 1;
              executarObterDadosSimples(paginaAtual);
            }" size="xl">
              carregar dados simples
            </UButton>
            <UButton @click="() => {
              paginaAtual = 1;
              executarObterDadosParquet(paginaAtual);
            }" size="xl">
              carregar dados parquet
            </UButton>
          </div>
          <UPagination v-show="quantidadeTotalRegistros" v-model="paginaAtual" show-edges variant="link" size="xl"
            class="flex-1" :sibling-count="3" :items-per-page="duckDBItensPorPagina"
            :total="quantidadeTotalRegistros || 1"
            @update:page="(valorPagina: number) => ultimaConsultaExecutada(valorPagina, 50)" />
        </div>
      </template>
      <template #default>
        <div class="min-h-115 max-h-115 overflow-y-auto">
          <!-- <ClientOnly> -->
          <table class="w-full">
            <thead class="text-justify">
              <th v-for="(nomeColuna, indexColuna) in colunas" :key="`${registros?.length || 0}:${indexColuna}`"
                class="px-5">
                {{ nomeColuna }}
              </th>
            </thead>
            <tbody>
              <tr v-for="(itemRegistro, indexRegistro) in registros" :key="(registros?.length || 0) - indexRegistro"
                class="text-justify">
                <td v-for="(nomeColuna, indexColuna) in colunas" :key="(registros?.length || 0) - indexColuna"
                  class="px-5">
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
