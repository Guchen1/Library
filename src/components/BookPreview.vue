<template>
  <a-typography-title :level="2">{{ props.title }}</a-typography-title>
  <div class="wraper">
    <a-row class="row"  style="max-width:100%"
      ><a-col span="11"><img src="@/assets/milkandhoney3.png" /></a-col
      ><a-col span="11" offset="2"><img src="@/assets/milkandhoney3.png" /></a-col
    ></a-row>

    <a-pagination class="pagination" :pageSize="2" v-model:current="current" :total="10" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  title: string
}>()
const current = ref(1)
</script>
<style scoped>
.wraper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}
img{
    z-index: -1;
    max-width: 100%;
}
.pagination {
  margin-top: 20px;
}
</style>
