<template>
  <a-layout class="layout-top" theme="light">
    <a-layout-sider class="layout-side" theme="light"></a-layout-sider>
    <a-layout-content theme="light" style="background-color: white">
      <a-row>
        <a-col v-for=" i in a" :key="i" span="12" :xxxl="8">
          <book-card  />
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import { watch,ref,onMounted } from 'vue';
const props=defineProps<{
  height: number,
  width: number
}>()
const width = ref(0)
const a=ref([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
onMounted(() => {
  width.value = props.width
})
watch(props, (newProps) => {
  width.value = newProps.width
})
</script>

<style scoped>
.layout-top {
  padding-top: 20px;
  background-color: white;
}

@media  (max-width: 1463px) {
  .layout-top {
    max-width: 1024px;
  }
}
  
@media  (min-width: 1463px) {
  .layout-top {
    max-width: v-bind((0.7*width)+'px');
  }
}
</style>
