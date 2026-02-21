<script setup lang="ts">
import { init, use } from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);

const props = withDefaults(defineProps<{
  option: Record<string, unknown>
  height?: number
  tema?: string
}>(), {
  height: 260,
  tema: "",
});

const containerRef = ref<HTMLDivElement | null>(null);
let chart: ReturnType<typeof init> | null = null;
let resizeObserver: ResizeObserver | null = null;

const initChart = () => {
  if (!containerRef.value) return;
  chart = init(containerRef.value, props.tema || undefined);
  chart.setOption(props.option);
};

onMounted(() => {
  initChart();

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  chart?.dispose();
  chart = null;
});

watch(() => props.option, (novaOpcao) => {
  if (!chart) return;
  chart.setOption(novaOpcao, { notMerge: true });
}, { deep: false });

watch(() => props.tema, (novoTema) => {
  chart?.dispose();
  initChart();
});
</script>

<template>
  <div ref="containerRef" :style="{ height: height + 'px', width: '100%' }" />
</template>
