<script
  setup
  lang="ts"
>
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";
import EChartBase from "./GraficoEChartBase.vue";

use([LineChart]);

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
