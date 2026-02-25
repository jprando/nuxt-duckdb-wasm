<script
  setup
  lang="ts"
>
import { SankeyChart } from "echarts/charts";
import { use } from "echarts/core";

import { LazyGraficoEChartBase } from "@/utils/lazy-components";

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

onBeforeMount(() => {
  use([SankeyChart]);
});
</script>

<template>
  <LazyGraficoEChartBase
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
