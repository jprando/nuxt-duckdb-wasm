<script
  setup
  lang="ts"
>
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

const chartType = computed(() => {
  let type = "bar";
  if (Array.isArray(props.option?.series) && props.option.series.length > 0) {
    type = (props.option.series[0] as Record<string, unknown>).type as string
      || "bar";
  } else if (
    props.option?.series
    && (props.option.series as Record<string, unknown>).type
  ) {
    type = (props.option.series as Record<string, unknown>).type as string;
  }
  return type;
});

const componentName = computed(() => {
  switch (chartType.value) {
    case "bar":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartBarra.vue")
      );
      // return resolveComponent("GraficoEChartBarra");
    case "line":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartLinha.vue")
      );
      // return resolveComponent("LazyGraficoEChartLinha");
    case "pie":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartPizza.vue")
      );
      // return resolveComponent("LazyGraficoEChartPizza");
    case "radar":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartRadar.vue")
      );
      // return resolveComponent("LazyGraficoEChartRadar");
    case "heatmap":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartHeatmap.vue")
      );
      // return resolveComponent("LazyGraficoEChartHeatmap");
    case "sankey":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartSankey.vue")
      );
      // return resolveComponent("LazyGraficoEChartSankey");
    case "chord":
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartChord.vue")
      );
      // return resolveComponent("LazyGraficoEChartChord");
    default:
      return defineAsyncComponent(async () =>
        import("~/components/GraficoEChartBarra.vue")
      );
      // return resolveComponent("LazyGraficoEChartBarra");
  }
});
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
