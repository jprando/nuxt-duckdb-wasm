<script
  setup
  lang="ts"
>
const props = withDefaults(
  defineProps<{
    option: Record<string, unknown>
    height?: number
    tema?: string
  }>(),
  {
    height: 260,
    tema: ''
  }
)

const chartType = computed(() => {
  let type = 'bar'
  if (Array.isArray(props.option?.series) && props.option.series.length > 0) {
    type = (props.option.series[0] as Record<string, unknown>).type as string
      || 'bar'
  } else if (
    props.option?.series
    && (props.option.series as Record<string, unknown>).type
  ) {
    type = (props.option.series as Record<string, unknown>).type as string
  }
  return type
})

const componentName = computed(() => {
  switch (chartType.value) {
    case 'bar':
      return LazyGraficoEChartBarra
    case 'line':
      return LazyGraficoEChartLinha
    case 'pie':
      return LazyGraficoEChartPizza
    case 'radar':
      return LazyGraficoEChartRadar
    case 'heatmap':
      return LazyGraficoEChartHeatmap
    case 'sankey':
      return LazyGraficoEChartSankey
    case 'chord':
      return LazyGraficoEChartChord
    default:
      return LazyGraficoEChartBarra
  }
})
</script>

<template>
  <component
    :is="componentName"
    v-if="componentName"
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
