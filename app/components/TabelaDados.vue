<script
  setup
  lang="ts"
>
interface DataRecord {
  [key: string]: any;
}

const props = defineProps<{
  colunas: string[];
  registros: DataRecord[];
  estahCarregando?: boolean;
}>();

// const columns = computed(() =>
//   props.colunas.map(coluna => ({
//     id: coluna,
//     key: coluna,
//     label: coluna,
//   }))
// );
</script>

<template>
  <div
    v-if="registros.length === 0"
    class="tabela-vazia"
  >
    Nenhum registro
  </div>
  <div
    v-else
    class="tabela-container"
  >
    <UTable
      :loading="props.estahCarregando"
      :data="props.registros"
      sticky
    />
    <!--
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-900">
        <tr>
          <th v-for="col in colunas" :key="col" class="px-4 py-3 text-left text-sm font-semibold">{{ col }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(row, idx) in registros" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-900">
          <td v-for="col in colunas" :key="col" class="px-4 py-3 text-sm">{{ row[col] }}</td>
        </tr>
      </tbody>
    </table>
    -->
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tabela-vazia {
  @apply text-center py-4;
  color: var(--ui-text-muted);
}

.tabela-container {
  @apply w-full h-full min-h-0 overflow-auto;
}

/* Força a DIV interna do UTable a herdar a altura do container */
:deep(>div[data-slot="root"]) {
  height: 100%;
  min-height: 0;
  overflow: auto !important;
}
</style>
