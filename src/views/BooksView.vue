<template>
  <a-layout class="layout-top" theme="light">
    <a-layout-sider class="layout-side" theme="light">
      <book-search />
    </a-layout-sider>
    <a-layout-content theme="light" style="background-color: white">
      <a-row>
        <a-col v-for="i in a" :key="i" span="12" :xxl="8">
          <book-card :book="data[0]" />
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import { ref, reactive, onMounted } from 'vue'
import BookSearch from '@/components/BookSearch.vue'
import { useAxios } from '@/stores/axios'
import type { BookDetail } from '@/types/type'
const axios = useAxios().Axios
//todo: add network request to get books and search function
const data = reactive<BookDetail[]>([])
onMounted(() => {
  console.log('mounted')
})

data.push({
  name: 'Fresh Cream',
  author: 'Cream',
  isbn: 'T4988 005 00760 5',
  info: 'Cream debut album released in 1967, featuring I Feel Free.',
  situation: true,
  picAdd:
    'https://i.discogs.com/-MFOcWZEds4m0aIBEwrdBZYVLItKac3trqugpxK5YoA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3NTE4/ODMtMTUzODEyOTkx/My0zNDkxLmpwZWc.jpeg'
})
//todo: add infinite scroll
const a = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])
</script>

<style scoped>
.layout-top {
  padding: 0px;
  padding-top: 20px;
  background-color: white;
}
.layout-side {
  justify-content: center;
  display: flex;
  flex: 0 0 300px !important;
  max-width: 300px !important;
  min-width: 300px !important;
  width: 300px !important;
}
@media (max-width: 1463px) {
  .layout-top {
    max-width: 1024px;
  }
}

@media (min-width: 1463px) {
  .layout-top {
    max-width: 70%;
  }
}
</style>
