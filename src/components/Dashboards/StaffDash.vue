<template>
  <div style="padding-top: 20px">
    <v-chart :option="options" style="height: 400px"></v-chart>
  </div>
</template>
<script setup lang="ts">
import { use } from "echarts/core";
import { PieChart, LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { useAxios } from "@/stores/axios";
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, provide } from "vue";
import axios from "axios";
import { useClient } from "@/stores/client";
provide(THEME_KEY, "light");
// 注册必须的组件
const out = ref<Array<Number>>([]);
const in_ = ref<Array<Number>>([]);
axios.get(useAxios().urlAlter + "/StaffOp/getStatisInfo?opUser="+useClient().clientData.clientName).then((res) => {
  if (res.data.code == 200) {
    options.value.series[0].data = res.data.borrow;
    options.value.series[1].data = res.data.return;
  }
});
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const options = ref({
  title: {
    text: "Work Statistics",
    left: "center",
  },
  legend: {
    top: "bottom",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
    //标注单位，仅一个
    name: "Book Number",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  series: [
    {
      name: "Borrow",
      type: "line",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
    {
      name: "Return",
      type: "line",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});
</script>
