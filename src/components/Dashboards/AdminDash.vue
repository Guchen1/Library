<template>
  <div style="padding-top: 20px">
    <v-chart
      :option="option2"
      style="height: 400px; width: 100%; display: inline-block"
      autoresize
    ></v-chart>
    <v-chart
      :option="option"
      style="height: 450px; width: 33%; display: inline-block"
      autoresize
    ></v-chart>
    <v-chart
      :option="optionsx"
      style="height: 450px; width: 33%; display: inline-block"
      autoresize
    ></v-chart>
    <v-chart
      :option="optionsy"
      style="height: 450px; width: 33%; display: inline-block"
      autoresize
    ></v-chart>
  </div>
</template>
<script setup lang="ts">
import { use } from "echarts/core";
import { PieChart, LineChart, GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import "echarts-liquidfill";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, provide } from "vue";
provide(THEME_KEY, "light");
// 注册必须的组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const option = reactive({
  title: {
    text: "Daily Active Patrons: Today",
    left: "center",
  },
  series: [
    {
      // 水球图
      type: "liquidFill", // 水球图
      name: "Liquid Fill1", // 水球图名称
      radius: "60%", // 水球图半径
      itemStyle: {
        // 水球图样式
        opacity: 1, // 水球图透明度
        shadowBlur: 0, // 波浪的阴影范围
      },
      data: [
        {
          // 水球图数据
          name: "score", // 水球图数据名称
          direction: "right", // 水球图数据方向
          value: 0.45, // 水球图数据值
          itemStyle: {
            // 水球图数据样式
            opacity: 1, // 水球图数据透明度
            normal: {
              // 水球图数据正常样式
              color: "#e25d3e", // 水球图数据正常样式颜色
            },
          },
        },
      ],
      backgroundStyle: {
        // 设置水球图内部背景色
        // borderColor: '#4348EC',
        // borderWidth: 10
        color: "#ffe5e0", //水球图内部背景色
      },
      label: {
        // 设置百分比展示
        color: "#f70", // 百分比颜色
        normal: {
          // 百分比正常样式
          textStyle: {
            // 百分比正常样式字体
            fontSize: 20, // 百分比正常样式字体大小
            color: "#333",
          },
          formatter: function (param: any) {
            // 百分比正常样式字体格式
            return param.value * 100 + "%"; // 百分比正常样式字体格式
          },
        },
      },
      //外部细圆
      outline: {
        // 是否显示外圈
        show: true,
        borderDistance: 6, // 外部圆线距离水球的距离
        itemStyle: {
          // 外部圆线样式
          borderWidth: 3, // 外部圆线宽度
          borderColor: "#e25d3e", // 外部圆线颜色
          //shadowBlur: 20, // 外部圆线阴影范围
          //shadowColor: 'rgba(0, 0, 0, 0.25)' // 外部圆线阴影颜色
        },
      },
    },
  ],
});
const optionsx = ref(JSON.parse(JSON.stringify(option)));
optionsx.value.title.text = "Daily Active Patrons: Week";
optionsx.value.series[0].data[0].value = 0.65;
//change color
optionsx.value.series[0].data[0].itemStyle.normal.color = "#f5b461";
//change background color corresponding to color
optionsx.value.series[0].backgroundStyle.color = "#ffe5d0";
//change outline color corresponding to color
optionsx.value.series[0].outline.itemStyle.borderColor = "#f5b461";
const optionsy = ref(JSON.parse(JSON.stringify(option)));
optionsy.value.series[0].data[0].value = 0.85;
//different color like green
optionsy.value.series[0].data[0].itemStyle.normal.color = "#5cb85c";
//change background color corresponding to color
optionsy.value.series[0].backgroundStyle.color = "#e5f7e5";
//change outline color corresponding to color
optionsy.value.series[0].outline.itemStyle.borderColor = "#5cb85c";
optionsy.value.title.text = "Daily Active Patrons: Month";
const option2 = reactive({
  title: {
    text: "Patron Count",
    left: "center",
  },
  tooltip: {
    trigger: "item",
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
    name: "Number",
  },
  series: [
    {
      type: "line",
      radius: "50%",
      data: [{ value: 1000 }, { value: 7 }, { value: 10 }, { value: 50 }],
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
