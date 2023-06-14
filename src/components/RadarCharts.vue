<template>
  <div class="line" ref="chartDom"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

var chartDom = ref(null);
onMounted(() => {
  console.log(chartDom);
  chartDom.value.style.width = "350px";
  chartDom.value.style.height = "400px";

  chartDom.value.style.transform = "translate(10px) scale(0.6)";
  chartDom.value.style.transformOrigin = "0 0";
  var myChart = echarts.init(chartDom.value);
  var option;

  option = {
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "安全", max: 6500 },
        { name: "清洁", max: 16000 },
        { name: "经济", max: 30000 },
        { name: "科技", max: 38000 },
        { name: "舒适", max: 52000 },
        { name: "环境", max: 25000 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: "Allocated Budget",
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: "Actual Spending",
          },
        ],
      },
    ],
    grid: {
      left: "50",
      right: "10",
      top: "130",
      bottom: "30",
    },
  };

  option && myChart.setOption(option);
});
</script>
