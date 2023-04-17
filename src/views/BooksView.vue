<template>
  <a-layout class="layout-top" theme="light">
    <a-layout-sider class="layout-side" theme="light">
      <BookSearch @show="show(undefined)" :searchFunc="search" />
    </a-layout-sider>
    <BookOperation :book="tempbook" ref="BookOperationRef"  />
    <a-layout-content theme="light" style="background-color: white">
      <a-row>
        <a-col v-for="i in data" :key="i" span="12" :xxxl="8">
          <BookCard @show="(e)=>show(e)" :book="i" style="height:95%" />
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
import type { BookDetail, ApiResponse } from '@/types/type'
import BookOperation from '@/components/BookOperation.vue'
import type { AxiosResponse } from 'axios'
const BookOperationRef = ref<InstanceType<typeof BookOperation>>()
const tempbook=ref<BookDetail['id']>()
const testData:BookDetail[] = [
  {
    id: 1,
    name: 'Fresh Cream',
    author: 'Cream',
    isbn: '25014',
    info: 'Cream debut album released in 1967, featuring I Feel Free.',
    situation: true,
    picAdd:
      'https://i.discogs.com/-MFOcWZEds4m0aIBEwrdBZYVLItKac3trqugpxK5YoA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3NTE4/ODMtMTUzODEyOTkx/My0zNDkxLmpwZWc.jpeg'
  },
  {
    id: 2,
    name: 'Wheels of Fire',
    author: 'Cream',
    isbn: '22033',
    info: 'Cream most famous double album.',
    situation: false,
    picAdd:
      'https://i.discogs.com/B9iDuausqOF7IsKt9bzu_uqoWDq7ZpM2djODtgkAZ4U/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2MjQ0/NjItMTM0MDE2NTAy/Mi05NDk2LmpwZWc.jpeg'
  },
  {
    id: 3,
    name: 'Eric Clapton',
    author: 'Eric Clapton',
    isbn: '22009',
    info: "Eric Clapton's debut album released in 1969.",
    situation: true,
    picAdd:
      'https://i.discogs.com/qO5TNtE7hEbLZXOwQu_8_QZNVg5xjrx5rgOy3pGy8YA/rs:fit/g:sm/q:90/h:600/w:597/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTY3OTc4/NS0xNDgwNDQ2MjY2/LTQxODYuanBlZw.jpeg'
  },
  {
    id:4  ,
    name: '461 Ocean',
    author: 'Eric Clapton',
    isbn: '22015',
    info: 'Good.',
    situation: true,
    picAdd:
      'https://i.discogs.com/VisrTkhihdSN_RlgMnIZ_z6Qxj0y9f6jq23q_e8pE0s/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU4NTE0/MS0xMzgxODAyNzI1/LTk3MDcuanBlZw.jpeg'
  },
  {
    id: 5,
    name: 'Backless',
    author: 'Eric Clapton',
    isbn: '25010',
    info: 'Bad.',
    situation: true,
    picAdd:
      'https://i.discogs.com/-PwldMDo_xiAAGGJjaHpBbcu-x8OsjDLBaxb3D1ddyI/rs:fit/g:sm/q:90/h:600/w:596/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTYyNzI1/NDMtMTQ3Nzc0NTk1/Ny05MzgxLmpwZWc.jpeg'
  }
]
const axios = useAxios().Axios
const data = reactive<BookDetail[]>([])
const show=(book:BookDetail['id']|undefined)=>{
  tempbook.value=book
  if(BookOperationRef.value!=undefined)
  BookOperationRef.value.visible=true
}
const search = (name: string, author: string, isbn: string, ready: boolean) => {
  console.log(`${name}, ${author}, ${isbn}, ${ready}`)
  data.splice(0, data.length)
  console.log(data.length)
  testData
    .filter(
      (e) =>
        ((ready && e.situation == true) || !ready) &&
        e.name.includes(name) &&
        e.author.includes(author) &&
        e.isbn.includes(isbn)
    )
    .forEach((e) =>
      data.push({
        id: e.id,
        name: e.name,
        author: e.author,
        isbn: e.isbn,
        info: e.info,
        situation: e.situation,
        picAdd: e.picAdd
      })
    )
  console.log(data.length)

  /*axios.post('/userop/getbook', {
    params: {
      name: name,
      author: author,
      isbn: isbn,
      ready: ready
    }
  }).then((res: AxiosResponse<ApiResponse<BookDetail[]>>) => {
    if (res.status != 200) {
      throw "xxx"
    }
    let resobj = res.data.data
    resobj.forEach((e) => {
      data.push({
        id: e.id,
        name: e.name,
        author: e.author,
        isbn: e.isbn,
        info: e.info,
        situation: e.situation,
        picAdd: e.picAdd,
      })
    })
  }).error((err: any) => console.log(err))*/
}
onMounted(() => search('', '', '', false))
//todo: add infinite scroll
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
