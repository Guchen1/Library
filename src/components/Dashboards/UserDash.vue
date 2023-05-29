<template>
  <div style="margin-top: 20px">
    <v-chart :option="option" style="height: 400px; width: 100%" autoresize></v-chart>
  </div>
</template>
<script setup lang="ts">
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { useAxios } from "@/stores/axios";
import axios from "axios";
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, provide } from "vue";
import { useClient } from "@/stores/client";
provide(THEME_KEY, "light");
// 注册必须的组件
axios.get(useAxios().urlAlter + "/UserOp/getStatisInfo?opUser="+useClient().clientData.clientName).then((res) => {
  if (res.data.code == 200) {
    option.value.series[0].data = res.data.borrow;
    option.value.series[1].data = res.data.return;
  }
});
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const in_ = ref<Array<Number>>([]);
const out = ref<Array<Number>>([]);
const option = ref({
  title: {
    text: "Reading Info",
    left: "center",
  },
  legend: {
    top: "bottom",
  },
  xAxis: {
    type: "category",
    data: [
      "Januaray",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  yAxis: {
    type: "value",
    //标注单位，仅一个
    name: "Book Number",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ",
  },
  series: [
    {
      name: "Borrow",
      type: "bar",
      data:[],
    },
    {
      name: "Return",
      type: "bar",
      data: [],
    },
  ],
});
</script>
