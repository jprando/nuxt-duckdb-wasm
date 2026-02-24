<script
  setup
  lang="ts"
>
import { SankeyChart } from "echarts/charts";
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
  use([SankeyChart]);
});
</script>

<template>
  <LazyEChartBase
    :option="option"
    :height="height"
    :tema="tema"
  />
</template>
