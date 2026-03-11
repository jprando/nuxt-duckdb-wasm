<script
  setup
  lang="ts"
>
const props = withDefaults(
  defineProps<{
    label: string
    icon: string
    cor: string
    valor?: string | number
    subtexto?: string
    unidade?: string
    carregando?: boolean
    esqueleto?: string
    pequeno?: boolean
  }>(),
  {
    valor: undefined,
    subtexto: undefined,
    unidade: undefined,
    carregando: false,
    esqueleto: 'w-20',
    pequeno: false
  }
)

const mapaCorClasses: Record<string, { icone: string, fundo: string }> = {
  primary: { icone: 'text-primary', fundo: 'bg-primary/10' },
  success: { icone: 'text-success', fundo: 'bg-success/10' },
  warning: { icone: 'text-warning', fundo: 'bg-warning/10' },
  secondary: { icone: 'text-secondary', fundo: 'bg-secondary/10' },
  info: { icone: 'text-info', fundo: 'bg-info/10' },
  error: { icone: 'text-error', fundo: 'bg-error/10' }
}

const classes = computed(() =>
  mapaCorClasses[props.cor] ?? mapaCorClasses.primary
)
</script>

<template>
  <UCard :ui="{ body: 'p-4!' }">
    <div class="item-kpi">
      <div :class="['p-2 rounded-lg shrink-0', classes?.fundo]">
        <UIcon
          :name="icon"
          :class="['size-5', classes?.icone]"
        />
      </div>
      <div class="min-w-0">
        <p class="label-kpi">
          {{ label }}
        </p>
        <template v-if="carregando">
          <USkeleton :class="`h-7 ${esqueleto}`" />
        </template>
        <template v-else>
          <p :class="pequeno ? 'valor-kpi-pequeno' : 'valor-kpi'">
            {{ valor }}<span
              v-if="unidade"
              class="unidade-kpi"
            >{{ unidade }}</span>
          </p>
          <p
            v-if="subtexto"
            class="subtexto-kpi"
          >
            {{ subtexto }}
          </p>
        </template>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
@reference "../assets/css/main.css";

.valor-kpi-pequeno {
  @apply text-sm font-bold text-highlighted leading-tight;
}

.unidade-kpi {
  @apply text-sm font-normal text-muted ml-1;
}
</style>
