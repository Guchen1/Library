<template>
  <div style="padding-top: 20px">
    <a-modal
      v-model:visible="visible"
      :centered="true"
      :closable="false"
      title="Settings"
      @ok="ok"
    >
    <a-form-item label="Max books borrowed/time">
        <a-input-number
          v-model:value="books"
          :min="0"
          :step="1"
          style="width: 100%"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="Fine per book overdue">
        <a-input-number
          v-model:value="fine"
          :min="0"
          :step="0.01"
          style="width: 100%"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="Book borrow time limit" style="margin-bottom: 0px">
        <a-input-number
          v-model:value="limit"
          :min="0"
          :step="1"
          style="width: 100%"
        ></a-input-number>
      </a-form-item>
    </a-modal>
    <v-chart
      :option="option2"
      style="height: 400px; width: 50%; display: inline-block"
      autoresize
    ></v-chart>
    <v-chart
      :option="option1"
      style="height: 400px; width: 50%; display: inline-block"
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
import { useAxios } from "@/stores/axios";
import axios from "axios";
import 'ant-design-vue/es/message/style/css'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from "echarts/components";
import "echarts-liquidfill";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, provide } from "vue";
import { useClient } from "@/stores/client";
import { message } from "ant-design-vue";
provide(THEME_KEY, "light");
const fine = ref(0);
const limit = ref(0);
const books=ref(0)
//用户一次最大借书数英文描述
//Maximum number of books borrowed by users at one time

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
  ToolboxComponent,
]);
const visible = ref(false);
const option = reactive({
  title: {
    text: "Daily Active Patrons",
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
          value: 0, // 水球图数据值
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
optionsx.value.title.text = "Weekly Active Patrons";
//change color
optionsx.value.series[0].data[0].itemStyle.normal.color = "#f5b461";
//change background color corresponding to color
optionsx.value.series[0].backgroundStyle.color = "#ffe5d0";
//change outline color corresponding to color
optionsx.value.series[0].outline.itemStyle.borderColor = "#f5b461";
const optionsy = ref(JSON.parse(JSON.stringify(option)));
//different color like green
optionsy.value.series[0].data[0].itemStyle.normal.color = "#5cb85c";
//change background color corresponding to color
optionsy.value.series[0].backgroundStyle.color = "#e5f7e5";
//change outline color corresponding to color
optionsy.value.series[0].outline.itemStyle.borderColor = "#5cb85c";
optionsy.value.title.text = "Monthly Active Patrons";
axios.get(useAxios().urlAlter + "/ManagerOp/getStatisInfo?opUser="+useClient().clientData.clientName).then((res) => {
  if (res.data.code == 200) {
    option.series[0].data[0].value = res.data.active[0];
    optionsx.value.series[0].data[0].value = res.data.active[1];
    optionsy.value.series[0].data[0].value = res.data.active[2];
    option1.series[0].data = res.data.fine;
    
    option2.series[0].data = res.data.patronNum;
    const today = new Date().getMonth();
    option2.series[0].data=option2.series[0].data.slice(0, today + 1);
  }
});
axios.get(useAxios().urlAlter + "/Static/getStatisInfo?opUser="+useClient().clientData.clientName).then((res) => {
  if (res.data.code == 200) {
    /*maxBook:int//最大借书数目
    fine:float //罚款金额 美元
    timeLimit:int //借书时长 天*/
    fine.value = res.data.fine;
    limit.value = res.data.timeLimit;
    books.value=res.data.maxBook
  }
})
const ok=()=>{
  axios.post(useAxios().urlAlter + "/ManagerOp/Set",{
    opUser:useClient().clientData.clientName,
    maxBook:books.value,
    fine:fine.value,
    timeLimit:limit.value
  }).then((res)=>{
    if(res.data.code==200){
      message.success("Success")
    }
    else{
      message.error("Fail")
    }
  }).catch((err)=>{
    message.error("Fail")
  })
  visible.value=false
}
const option1 = reactive({
  title: {
    text: "Fine Statistics",
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
    //向左移动
    name: "Dollar",
  },
  //add tool box
  toolbox: {
    //整体向左移动
    left: "90%",
    show: true,
    feature: {
      //自定义，弹出框
      myTool1: {
        show: true,
        title: "Customize",
        icon:
          "path://M512 0C229.248 0 0 229.248 0 512s229.248 512 512 512 512-229.248 512-512S794.752 0 512 0zM512 960C264.576 960 64 759.424 64 512S264.576 64 512 64s448 200.576 448 448S759.424 960 512 960z m0-832C316.288 128 160 284.288 160 480s156.288 352 352 352 352-156.288 352-352S707.712 128 512 128z m0 640c-141.376 0-256-114.624-256-256s114.624-256 256-256 256 114.624 256 256-114.624 256-256 256z",
        onclick: function () {
          visible.value = true;
        },
      },
      //save as image
    },
  },
  series: [
    {
      type: "line",
      radius: "50%",
      data:[],
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
