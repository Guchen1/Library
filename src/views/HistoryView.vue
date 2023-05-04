<template>
  <div style="padding-top:20px;padding-left:20px;padding-right:20px">
    <BookSearch :search-func="search" />
    <BookTable :width="width" type="user" style="padding-top:20px" :height="props.height" />
  </div>
</template>

<script setup lang="ts">
import BookSearch from '@/components/BookSearch.vue';
import BookTable from '@/components/BookTable.vue';
import { ref } from 'vue';
const props=defineProps<{
  width: number;
  height: number;
}>();
const search=()=>{
  //TODO: Finish search function
}
</script>

<style scoped></style>
