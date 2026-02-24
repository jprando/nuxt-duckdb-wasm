<script
  setup
  lang="ts"
>
import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, VisualMapComponent } from "echarts/components";
import { use } from "echarts/core";
import EChartBase from "./GraficoEChartBase.vue";

use([HeatmapChart, CalendarComponent, VisualMapComponent]);

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
</script>

<template>
  <EChartBase
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
