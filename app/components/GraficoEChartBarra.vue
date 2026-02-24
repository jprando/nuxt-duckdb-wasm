<script
  setup
  lang="ts"
>
import { BarChart } from "echarts/charts";
import { use } from "echarts/core";
import EChartBase from "./GraficoEChartBase.vue";

use([BarChart]);

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
