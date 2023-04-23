<template>
  <a-layout class="layout-top" theme="light">
    <a-layout-sider class="layout-side" theme="light">
      <BookSearch @show="show(undefined)" :searchFunc="search" />
    </a-layout-sider>
    <BookOperation :book="tempbook" ref="BookOperationRef" />
    <a-layout-content theme="light" style="background-color: white">
      <a-row>
        <a-col v-for="i in data" :key="i" span="12" :xxxl="8">
          <BookCard @show="(e) => show(e)" :book="i" style="height: 95%" />
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import BookSearch from '@/components/BookSearch.vue'
import { useAxios } from '@/stores/axios'
import type { BookDetail, BookResponse } from '@/types/type'
import BookOperation from '@/components/BookOperation.vue'
import type { AxiosResponse } from 'axios'
const BookOperationRef = ref<typeof BookOperation>()
const tempbook = ref<BookDetail>()
const axios = useAxios().Axios
const data = reactive<BookDetail[]>([])
const show = (book: BookDetail | undefined) => {
  tempbook.value = book

  if (BookOperationRef.value != undefined) {
    BookOperationRef.value.bookDetail = tempbook.value
    BookOperationRef.value.visible = true
  }
}
const isMore = ref(true)
const page = ref(0)
// Save the stat
let nameSave: string = ''
let authorSave: string = ''
let isbnSave: string = ''
let readySave: boolean = false
const request = (name: string, author: string, isbn: string, ready: boolean) => {
  nameSave = name
  authorSave = author
  isbnSave = isbn
  readySave = ready
  axios
    .post('/managerop/getbook/byname', {
      name: name,
      author: author,
      isbn: isbn,
      page: String(page.value),
      ready: String(ready)
    })
    .then((res: AxiosResponse<BookResponse>) => {
      if (!res.status) {
        throw 'Unable to get data with status code ' + res.status
      }
      let resobj = res.data.books
      if (resobj.length == 0) {
        isMore.value = false
      } else {
        resobj.forEach((e) => {
          data.push({
            author: e.author,
            category: e.category,
            cover: e.cover,
            id: e.id,
            isbn: e.isbn,
            name: e.name,
            price: e.price,
            publisher: e.publisher,
            stock: e.stock,
            summary: e.summary
            //situation: e.situation,
          })
        })
        page.value += 1
      }
    })
    .catch((err: any) => {
      console.log(err)
      alert(err)
    })
  page.value++
  if (page.value > 3) isMore.value = false
}
const search = (name: string, author: string, isbn: string, ready: boolean) => {
  data.splice(0, data.length)
  request(name, author, isbn, ready)
}
onMounted(() => {
  search('', '', '', false)
  window.addEventListener('scroll', scrollHandle, false)
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandle, false)
})
function scrollHandle() {
  if (!isMore.value) return
  window.onscroll = () => {
    console.log(
      Math.abs(
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          document.documentElement.scrollTop
      )
    )
    let bottom =
      Math.abs(
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          document.documentElement.scrollTop
      ) < 1
    if (bottom && isMore.value) {
      request(nameSave, authorSave, isbnSave, readySave)
    }
  }
}
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
