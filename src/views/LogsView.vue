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
        <LogTable
          :data="data"
          :show="show"
          style="max-width: 1000px; width: 100%"
          :height="height"
        />
      </div>
    </div>
    <LogAddon :data="toShow" ref="det" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Dayjs } from 'dayjs'
import LogTable from '@/components/LogTable.vue'
import LogAddon from '@/components/LogAddon.vue'
import type { LogDetail, LogResponse } from '@/types/type'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { AxiosResponse } from 'axios'
import type {} from '@/types/type'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
const client = useClient()
const axios = useAxios().Axios
const route = useRoute()
const toShow = ref<LogDetail>({
  opUser: '',
  opId: '',
  opTime: dayjs(),
  opDo: '',
  opInfo: ''
})
const det = ref<typeof LogAddon>()
const show = (target: LogDetail) => {
  toShow.value = target
  if (det.value != undefined) det.value.visible = true
}
const date = ref<Dayjs>()
defineProps<{
  width: number
  height: number
}>()
const data = ref<LogDetail[]>([])

onMounted(() => {
  search()
})
// TODO: get data
const search = () => {
  axios
    .post('/SuperuserOp/logInfo', {
      opUser: client.clientData.clientName,
      page: '1',
      num: '999'
    })
    .then((res: AxiosResponse<LogResponse>) => {
      res.data.logs.forEach((e) => data.value.push(e))
    })
    .catch((e: any) => message.info('Fetch log data failed ' + e))
}
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
