<template>
  <div>
    <a-table
      :columns="columns"
      @change="resize"
      :dataSource="data"
      :scroll="{ x: 'max-content', y: height - 258 }"
      :pagination="{ position: ['bottomCenter'], pageSize: 10, showSizeChanger: false }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'selected'">
          <div style="display: flex; justify-content: center">
            <a-checkbox
              :checked="checkList.length == data.length"
              @update:checked="checkAll($event)"
            ></a-checkbox>
          </div>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'selected'">
          <div style="display: flex; justify-content: center">
            <a-checkbox
              :checked="checked(record)"
              @update:checked="check(record, $event)"
            ></a-checkbox>
          </div>
        </template>
        <template v-if="column.key === 'id'"> {{ record.opId }} </template>
        <template v-if="column.key === 'operator'"> {{ record.opUser }} </template>
        <template v-if="column.key === 'type'"> {{ record.opDo }} </template>
        <template v-if="column.key === 'time'">
          {{ record.opTime.format("YYYY-MM-DD") }}
        </template>
        <template v-if="column.key === 'operation'">
          <div
            style="display: flex; flex-wrap: nowrap; justify-content: center; width: 100%"
          >
            <a-button @click="show(record as LogDetail)" style="margin-right: 10px"
              >Detail</a-button
            >
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
//TODO-C: Bind to the real data corresponding to the search
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { LogDetail } from "@/types/type";
const props = defineProps<{
  height: number;
  data: LogDetail[];
  show: (target: LogDetail) => void;
}>();
const checkList = ref<LogDetail[]>([]);
//TODO: Change comparison method from object to id
//No need to use at limited time...Time delayed
const check = (record: LogDetail, e: boolean) => {
  if (e) {
    checkList.value.push(record);
  } else {
    checkList.value.splice(checkList.value.indexOf(record), 1);
  }
};
const checkAll = (e: boolean) => {
  if (e) {
    props.data.forEach((item) => {
      if (checkList.value.indexOf(item) == -1) {
        checkList.value.push(item);
      }
    });
  } else {
    props.data.forEach((item) => {
      if (checkList.value.indexOf(item) != -1) {
        checkList.value.splice(checkList.value.indexOf(item), 1);
      }
    });
  }
};
const checked = computed({
  //可对setter和getter都传参的计算属性
  get: () => {
    return (record: LogDetail) => {
      //列表里有就返回true
      if (checkList.value.indexOf(record) != -1) {
        return true;
      } else {
        return false;
      }
    };
  },
  set: () => {},
});
watch(
  () => props.data,
  () => {
    nextTick(() => {
      resize();
    });
  }
);
const resize = () => {
  maxHeight.value = "unset";
  nextTick(() => {
    const a = document
      .getElementsByClassName("ant-table-body")[0]
      .getAttribute("style")
      ?.split(";")[1]
      .split(":")[1];
    const b = document.getElementsByClassName("ant-table-body")[0].clientHeight;
    //a转数字
    const c = Number(a?.split("px")[0]);
    if (c != undefined) {
      if (c - b >= 20) {
        maxHeight.value = b + 10 + "px";
      } else {
        maxHeight.value = c + "px";
      }
    }
  });
};
const maxHeight = ref<string>("");
onMounted(() => {
  window.addEventListener("resize", resize);
  resize();
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
const columns = ref<Array<any>>([
  {
    key: "selected",
    width: 50,
    fixed: "left",
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    width: 100,
  },
  {
    title: "Operator",
    dataIndex: "operator",
    key: "operator",
    width: 150,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 150,
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    width: 200,
  },
  {
    title: "Operation",
    key: "operation",
    width: 200,
  },
]);

defineExpose({
  checkList,
});
</script>
<style scoped>
:deep(.ant-table-body) {
  height: v-bind("maxHeight");
}
</style>
