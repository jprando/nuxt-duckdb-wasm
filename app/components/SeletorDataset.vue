<script
  setup
  lang="ts"
>
const datasetSelecionado = defineModel<DatasetParquet | undefined>("datasetSelecionado");

defineProps<{
  loading: boolean
}>();

const emit = defineEmits<{
  carregar: []
}>();

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
</script>

<template>
  <div class="flex flex-row items-end gap-2">
    <div class="flex-1">
      <label class="text-sm font-medium text-neutral-250 mb-1 block">
        Datasets
      </label>
      <USelectMenu
        v-model="datasetSelecionado"
        :items="itensAgrupados"
        :search-input="false"
        :loading="loading"
        :disabled="loading"
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
      :loading="loading"
      class="justify-center w-28 min-w-28 max-w-28"
      @click="emit('carregar')"
    >
      <span class="truncate">
        {{ loading ? "carregando" : "carregar" }}
      </span>
    </UButton>
  </div>
</template>
