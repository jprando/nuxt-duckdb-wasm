<script
  setup
  lang="ts"
>
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { init, use } from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

// Initialize base components
use([
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);

const props = withDefaults(
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

const containerRef = ref<HTMLDivElement | null>(null);
let chart: ReturnType<typeof init> | null = null;
let resizeObserver: ResizeObserver | null = null;

// Dynamically load only required chart types based on the option
const loadRequiredCharts = async (option: any) => {
  const types = new Set<string>();
  if (Array.isArray(option.series)) {
    option.series.forEach((s: any) => { if (s.type) types.add(s.type); });
  } else if (option.series && option.series.type) {
    types.add(option.series.type);
  }

  const chartsToLoad: Promise<any>[] = [];
  
  if (types.has("bar")) chartsToLoad.push(import("echarts/charts").then(m => m.BarChart));
  if (types.has("line")) chartsToLoad.push(import("echarts/charts").then(m => m.LineChart));
  if (types.has("pie")) chartsToLoad.push(import("echarts/charts").then(m => m.PieChart));
  if (types.has("radar")) chartsToLoad.push(import("echarts/charts").then(m => m.RadarChart));
  if (types.has("heatmap")) chartsToLoad.push(import("echarts/charts").then(m => m.HeatmapChart));
  if (types.has("sankey")) chartsToLoad.push(import("echarts/charts").then(m => m.SankeyChart));
  if (types.has("chord")) chartsToLoad.push(import("echarts/charts").then(m => m.ChordChart));

  if (chartsToLoad.length > 0) {
    const modules = await Promise.all(chartsToLoad);
    use(modules);
  }
};

const initChart = async () => {
  if (!containerRef.value) return;
  await loadRequiredCharts(props.option);
  
  if (!chart) {
    chart = init(containerRef.value, props.tema || undefined);
  }
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

watch(() => props.option, async (novaOpcao) => {
  await loadRequiredCharts(novaOpcao);
  if (!chart) return;
  chart.setOption(novaOpcao, { notMerge: true });
}, { deep: false });

watch(() => props.tema, () => {
  chart?.dispose();
  chart = null;
  initChart();
});
</script>

<template>
  <div
    ref="containerRef"
    :style="{ height: height + 'px', width: '100%' }"
  />
</template>
