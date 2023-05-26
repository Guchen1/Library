<template>
  <div class="liquid-chart"></div>
</template>

<script>
import echarts from "echarts";
import "echarts-liquidfill";
import ResizeListener from "element-resize-detector";
export default {
  name: "Liquid-Chart",
  data() {
    return {
      option: null,
      chart: null,
    };
  },
  props: {
    data: {
      type: Number,
      default: 0.52,
    },
    colors: {
      type: Array,
      default: () => [
        "rgba(14, 71, 120, 1)",
        "rgba(58, 160, 235, 1)",
        "rgba(107, 211, 253, 1)",
      ],
    },
    backgroundColor: {
      type: String,
      default: "rgba(2, 31, 64, 1)",
    },
    borderColor: {
      type: String,
      default: "rgba(27, 114, 177, 1)",
    },
    shadowColor: {
      type: String,
      default: "rgba(107, 211, 253, 1)",
    },
    radius: {
      type: String,
      default: "47%",
    },
  },
  mounted() {
    const dataArr = [this.data, this.data, this.data];
    this.option = {
      title: {
        show: true,
        text: this.data * 100 + "%",
        textStyle: {
          fontSize: 23,
          fontFamily: "Microsoft Yahei",
          fontWeight: "normal",
          color: "#fff",
        },
        x: "30%",
        y: "45%",
      },
      series: [
        {
          type: "liquidFill",
          radius: this.radius,
          center: ["50%", "53%"],
          // shape: 'roundRect',
          data: dataArr,
          color: this.colors,
          backgroundStyle: {
            color: this.backgroundColor,
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 3,
              borderColor: this.borderColor,
              shadowBlur: 15,
              shadowColor: this.shadowColor,
            },
          },
          label: {
            normal: {
              formatter: "",
            },
          },
        },
      ],
    };
    this.chart = echarts.init(this.$el);
    this.chart.setOption(this.option);
    window.addEventListener("resize", this.handleWindowResize);
    this.addChartResizeListener();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    /**
     * 对chart元素尺寸进行监听，当发生变化时同步更新echart视图
     */
    addChartResizeListener() {
      const instance = ResizeListener({
        strategy: "scroll",
        callOnAdd: true,
      });

      instance.listenTo(this.$el, () => {
        if (!this.chart) return;
        this.chart.resize();
      });
    },
    /**
     * 当窗口缩放时，echart动态调整自身大小
     */
    handleWindowResize() {
      if (!this.chart) return;
      this.chart.resize();
    },
  },
  watch: {
    data(newVal) {
      this.option.series[0].data = newVal;
      // 更新之前先清空图表 不然会有数字重叠的问题
      this.chart.clear();
      this.chart.setOption(this.option, true);
      this.handleItemMouseover(0);
    },
  },
};
</script>

<style scoped>
.liquid-chart {
  width: 100%;
  height: 100%;
}
</style>
