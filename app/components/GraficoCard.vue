<script setup lang="ts">
const props = withDefaults(defineProps<{
  opcao: Record<string, unknown> | null;
  tema?: string;
  altura?: number;
  msgSemDados?: string;
}>(), {
  tema: '',
  altura: 260,
  msgSemDados: 'Dados indisponíveis para este dataset.',
});

const expandido = ref(false);
const alturaExpandida = ref(0);

const semDados = computed(
  () => props.opcao !== null && Object.keys(props.opcao).length === 0,
);

const calcularAlturaExpandida = () => {
  // viewport - inset-4 (2×16px) - header (~53px) - padding corpo (2×16px)
  alturaExpandida.value = window.innerHeight - 32 - 53 - 32;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') fecharExpandido();
};

const abrirExpandido = () => {
  calcularAlturaExpandida();
  expandido.value = true;
  window.addEventListener('resize', calcularAlturaExpandida);
  document.addEventListener('keydown', onKeydown);
  document.body.style.overflow = 'hidden';
};

const fecharExpandido = () => {
  expandido.value = false;
  window.removeEventListener('resize', calcularAlturaExpandida);
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
};

onUnmounted(() => {
  if (expandido.value) {
    window.removeEventListener('resize', calcularAlturaExpandida);
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <!-- Card normal -->
  <UCard :ui="{ header: 'pb-2!', body: 'pt-0!' }">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-sm font-semibold flex items-center gap-1.5 min-w-0 overflow-hidden">
          <slot name="titulo" />
        </h2>
        <UButton
          icon="i-lucide-expand"
          size="xs"
          variant="soft"
          color="neutral"
          class="shrink-0"
          aria-label="Expandir gráfico"
          @click="abrirExpandido"
        />
      </div>
    </template>

    <template v-if="!opcao">
      <USkeleton class="w-full rounded-lg" :style="{ height: altura + 'px' }" />
    </template>
    <div
      v-else-if="semDados"
      class="flex items-center justify-center"
      :style="{ height: altura + 'px' }"
    >
      <p class="text-sm text-muted">
        {{ msgSemDados }}
      </p>
    </div>
    <LazyGraficoEChart
      v-else
      :option="opcao"
      :tema="tema"
      :height="altura"
    />
  </UCard>

  <!-- Modal expandido -->
  <Teleport to="body">
    <Transition name="grafico-expandido">
      <div
        v-if="expandido"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="fecharExpandido"
        />
        <!-- Card expandido -->
        <div class="relative z-10 w-full h-full flex flex-col bg-(--ui-bg) border border-(--ui-border) rounded-xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-(--ui-border) shrink-0">
            <h2 class="text-sm font-semibold flex items-center gap-1.5">
              <slot name="titulo" />
            </h2>
            <UButton
              icon="i-lucide-shrink"
              size="xs"
              variant="ghost"
              color="neutral"
              aria-label="Fechar modo expandido"
              @click="fecharExpandido"
            />
          </div>
          <!-- Corpo -->
          <div class="flex-1 p-4 min-h-0">
            <div
              v-if="semDados"
              class="h-full flex items-center justify-center"
            >
              <p class="text-sm text-muted">
                {{ msgSemDados }}
              </p>
            </div>
            <LazyGraficoEChart
              v-else-if="opcao && alturaExpandida > 0"
              :option="opcao"
              :tema="tema"
              :height="alturaExpandida"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.grafico-expandido-enter-active,
.grafico-expandido-leave-active {
  transition: opacity 0.2s ease;
}

.grafico-expandido-enter-from,
.grafico-expandido-leave-to {
  opacity: 0;
}
</style>
