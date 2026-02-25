<script
  setup
  lang="ts"
>
import { LazyGraficoEChart } from "@/utils/lazy-components";

const props = withDefaults(
  defineProps<{
    configuracao: Record<string, unknown> | null;
    tema?: string;
    altura?: number;
    msgSemDados?: string;
  }>(),
  {
    tema: "",
    altura: 260,
    msgSemDados: "Dados indisponíveis para este dataset.",
  },
);

const expandido = ref(false);
const alturaExpandida = ref(0);

const semDados = computed(
  () =>
    props.configuracao !== null && Object.keys(props.configuracao).length === 0,
);

const calcularAlturaExpandida = () => {
  // viewport - inset-4 (2×16px) - header (~53px) - padding corpo (2×16px)
  alturaExpandida.value = window.innerHeight - 32 - 53 - 32;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") fecharExpandido();
};

const abrirExpandido = () => {
  calcularAlturaExpandida();
  expandido.value = true;
  window.addEventListener("resize", calcularAlturaExpandida);
  document.addEventListener("keydown", onKeydown);
  document.body.style.overflow = "hidden";
};

const fecharExpandido = () => {
  expandido.value = false;
  window.removeEventListener("resize", calcularAlturaExpandida);
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
};

onUnmounted(() => {
  if (expandido.value) {
    window.removeEventListener("resize", calcularAlturaExpandida);
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <!-- Card normal -->
  <UCard
    :ui="{
      header: 'p-0! cursor-pointer select-none',
      body: 'py-2 sm:py-2 my-2',
      root: 'divide-transparent',
    }"
  >
    <template #header>
      <div
        class="cabecalho-card px-4 pt-4"
        tabindex="1"
        @dblclick="abrirExpandido"
      >
        <h2 class="titulo-card">
          <slot name="titulo" />
        </h2>
        <UButton
          icon="i-lucide-expand"
          size="xs"
          variant="ghost"
          color="neutral"
          class="shrink-0"
          aria-label="Expandir gráfico"
          @click="abrirExpandido"
        />
      </div>
    </template>

    <template v-if="!configuracao">
      <USkeleton
        class="my-5"
        :style="{ height: altura + 'px' }"
      />
    </template>
    <div
      v-else-if="semDados"
      class="card-sem-dados"
      :style="{ height: altura + 'px' }"
    >
      <p class="msg-sem-dados">
        {{ msgSemDados }}
      </p>
    </div>
    <LazyGraficoEChart
      v-else
      :option="configuracao"
      :tema="tema"
      :height="altura"
    />
  </UCard>

  <!-- Modal expandido -->
  <Teleport to="body">
    <Transition name="grafico-expandido">
      <div
        v-if="expandido"
        class="overlay-expandido"
      >
        <!-- Backdrop -->
        <div
          class="backdrop-expandido"
          @click="fecharExpandido"
        />
        <!-- Card expandido -->
        <UCard
          class="card-expandido"
          :ui="{
            root: 'relative z-10 w-full h-full flex flex-col shadow-2xl divide-y-0',
            header: 'shrink-0 p-0! cursor-pointer select-none',
            body: 'flex-1 min-h-0 p-0 sm:p-0',
          }"
        >
          <!-- Header -->
          <template #header>
            <div
              class="flex items-center justify-between px-4 pt-4"
              @dblclick="fecharExpandido"
            >
              <h2 class="titulo-expandido">
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
          </template>

          <!-- Corpo -->
          <div class="corpo-expandido">
            <div
              v-if="semDados"
              class="expandido-sem-dados"
            >
              <p class="msg-sem-dados">
                {{ msgSemDados }}
              </p>
            </div>
            <LazyGraficoEChart
              v-else-if="configuracao && alturaExpandida > 0"
              :option="configuracao"
              :tema="tema"
              :height="alturaExpandida"
            />
          </div>
        </UCard>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "../assets/css/main.css";

.cabecalho-card {
  @apply flex items-center justify-between gap-2;
}

.titulo-card {
  @apply text-sm font-semibold flex items-center gap-1.5 min-w-0 overflow-hidden;
}

.card-sem-dados {
  @apply flex items-center justify-center;
}

.msg-sem-dados {
  @apply text-sm text-muted;
}

.overlay-expandido {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
}

.backdrop-expandido {
  @apply absolute inset-0 bg-black/60 backdrop-blur-sm;
}

.titulo-expandido {
  @apply text-sm font-semibold flex items-center gap-1.5;
}

.corpo-expandido {
  @apply flex-1 p-4 min-h-0;
}

.expandido-sem-dados {
  @apply h-full flex items-center justify-center;
}

.grafico-expandido-enter-active,
.grafico-expandido-leave-active {
  transition: opacity 0.2s ease;
}

.grafico-expandido-enter-from,
.grafico-expandido-leave-to {
  opacity: 0;
}
</style>
