<script
  setup
  lang="ts"
>
import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, VisualMapComponent } from "echarts/components";
import { use } from "echarts/core";
// import EChartBase from "./GraficoEChartBase.vue";

const LazyEChartBase = defineLazyHydrationComponent(
  "visible",
  () => import("./GraficoEChartBase.vue"),
);

withDefaults(
  defineProps<{
    option: Record<string, unknown>;
    height?: number;
    tema?: string;
  }>(),
  {
    height: 260,
    tema: "",
  },
);

onMounted(() => {
  use([HeatmapChart, CalendarComponent, VisualMapComponent]);
})
</script>

<template>
  <LazyEChartBase
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
