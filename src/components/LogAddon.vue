<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { AxiosResponse } from 'axios'
import { FileProtectOutlined } from '@ant-design/icons-vue'
const client = useClient()
const axios = useAxios().Axios
const visible = ref<boolean>(false)
interface LogDetail {
  id: string
  type: string
  time: string
  operator: string
  detail: string
}
const props = defineProps<{
  id: string
}>()
defineExpose({
  visible
})
const data = reactive<LogDetail>({
  id: '1',
  type: 'Delete User',
  time: '2023-03-01 18:00',
  operator: 'Chen',
  detail: 'Patron s was deleted and all his/her records were deleted. '
})
axios.get('/api/log/' + props.id).then((res: AxiosResponse<LogDetail>) => {
  //TODO: Refactor this
  console.log(res.data)
  visible.value = true
})
</script>
<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="null"
      centered
      :footer="null"
      destroyOnClose
      :closable="false"
      :bodyStyle="{}"
    >
      <div class="modal">
        <a-typography-title :level="2">Detail</a-typography-title>
        <div
          style="font-size: 23px; color: rgb(50, 50, 50); margin-top: -15px; padding-bottom: 5px"
        >
          {{ id }}
        </div>
        <div style="font-size: 18px; color: rgb(100, 100, 100)">Created at {{ data.time }}</div>
        <div style="padding: 10px">
          <a-tag
            style="
              font-size: 15px;
              padding: 7px;
              padding-left: 15px;
              padding-right: 15px;
              border-radius: 20px;
            "
            color="green"
            >{{ data.type }}</a-tag
          >
          <a-tag
            style="
              font-size: 15px;
              padding: 7px;
              padding-left: 15px;
              padding-right: 15px;
              border-radius: 20px;
            "
            color="blue"
            >{{ data.operator }}</a-tag
          >
        </div>
        <div style="width: 300px; text-align: center; word-wrap: break-word">
          <div style="text-align: left; display: inline-block">
            {{ data.detail }}
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<style scoped>
.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
