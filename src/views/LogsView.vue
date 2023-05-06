<template>
  <div>
    <div style="padding-top: 20px">
      <a-typography-title :level="2" class="title">Logs</a-typography-title>
      <div class="top-box">
        <a-range-picker v-model:value="date" /><a-input
          style="max-width: 200px; margin-left: 10px"
        ></a-input>
        <a-button style="margin-left: 10px" type="primary">Search</a-button>
      </div>
      <div class="top-box" style="padding-top: 20px">
        <LogTable :show="show" style="max-width: 1000px; width: 100%" :height="height" />
      </div>
    </div>
    <LogAddon :id="id" ref="det" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import type { Dayjs } from "dayjs";
import LogTable from "@/components/LogTable.vue";
import LogAddon from "@/components/LogAddon.vue";
import type { LogInfo } from "@/types/type";
const route = useRoute();
const id = ref("");
const det = ref<typeof LogAddon>();
const show = (target: LogInfo) => {
  id.value = target.id;
  if (det.value != undefined) det.value.visible = true;
};
const date = ref<Dayjs>();
defineProps<{
  width: number;
  height: number;
}>();
</script>
<style scoped>
.title {
  width: 100%;
  text-align: center;
}
.top-box {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  justify-content: center;
}
</style>
