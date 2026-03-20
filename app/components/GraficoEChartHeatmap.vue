<script
  setup
  lang="ts"
>
import { HeatmapChart } from 'echarts/charts'
import { CalendarComponent, VisualMapComponent } from 'echarts/components'
import { use } from 'echarts/core'

import { LazyGraficoEChartBase } from '@/utils/lazy-components'

withDefaults(
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

onBeforeMount(() => {
  use([HeatmapChart, CalendarComponent, VisualMapComponent])
})
</script>

<template>
  <LazyGraficoEChartBase
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
