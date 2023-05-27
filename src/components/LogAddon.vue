<script setup lang="ts">
import { ref } from 'vue'
import type { LogDetail } from '@/types/type'
const visible = ref<boolean>(false)
const props = defineProps<{
  data: LogDetail
}>()
defineExpose({
  visible
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
        <a-typography-title :level="2">Detail no {{ props.data.opId }}</a-typography-title>
        <div
          style="font-size: 23px; color: rgb(50, 50, 50); margin-top: -15px; padding-bottom: 5px"
        >
          operated by {{ props.data.opUser }}
        </div>
        <div style="font-size: 18px; color: rgb(100, 100, 100)">Created at {{ data.opTime }}</div>
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
            >{{ props.data.opDo }}</a-tag
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
            >{{ props.data.opUser }}</a-tag
          >
        </div>
        <div style="width: 300px; text-align: center; word-wrap: break-word">
          <div style="text-align: left; display: inline-block">
            {{ props.data.opInfo }}
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
