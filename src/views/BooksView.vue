<template>
  <div style="margin-top: 20px">
    <BookSearch @show="show(undefined)" style="padding-left: 5px" :searchFunc="search" />
    <TypeList ref="types" style="padding: 20px" v-model:selected="selected" />
    <BookOperation :typeList="types?.list == undefined ? [] : types.list" ref="BookOperationRef" />
    <a-layout-content
      theme="light"
      style="background-color: white; padding-left: 20px; padding-right: 0px"
    >
      <a-row>
        <a-col v-for="i in data" :key="i" span="12" :xxl="8" :xxxl="6">
          <BookCard
            @show="(e) => show(e)"
            @delete-book="(e) => deleteBook(e)"
            :book="i"
            style="height: 95%"
          />
        </a-col>
      </a-row>
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import BookCard from '@/components/BookCard.vue'
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import BookSearch from '@/components/BookSearch.vue'
import { useAxios } from '@/stores/axios'
import type { BackendResponse, BookDetail, BookResponse, PictureResponse } from '@/types/type'
import BookOperation from '@/components/BookOperation.vue'
import type { AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { useClient } from '@/stores/client'
const BookOperationRef = ref<typeof BookOperation>()
const tempbook = ref<BookDetail>()
const client = useClient()
const axios = useAxios().Axios
const data = reactive<BookDetail[]>([])
const types = ref()
const selected = ref([])
const show = (book: BookDetail | undefined) => {
  tempbook.value = book
  if (BookOperationRef.value != undefined) {
    BookOperationRef.value.bookDetail = tempbook.value
    BookOperationRef.value.visible = true
  }
}
const deleteBook = (isbn: BookDetail) => {
  axios
    .post('/StaffOp/deleteBook', {
      isbn: isbn.bookIsbn,
      opUser: client.clientData.clientName
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      console.log(e.data.msg.content)
      if (!e.data.status) {
        throw e.data.msg.content
      }
      message.info('删除成功')
      //TODO-C: Father refresh
      nextTick(() => {
        data.splice(data.indexOf(isbn), 1)
      })
    })
    .catch((e: any) => {
      message.error('Delete failed with error: ' + e)
    })
}
const isMore = ref(true)
const page = ref(1)
// Save the stat
let nameSave: string = ''
let authorSave: string = ''
let isbnSave: string = ''
let readySave: boolean = true
const request = (name: string, author: string, isbn: string, ready: boolean) => {
  if (nameSave != name) {
    nameSave = name
    isMore.value = true
    page.value = 0
  }
  if (authorSave != author) {
    authorSave = author
    isMore.value = true
    page.value = 0
  }
  if (isbnSave != isbn) {
    isbnSave = isbn
    isMore.value = true
    page.value = 0
  }
  if (readySave != ready) {
    readySave = ready
    isMore.value = true
    page.value = 0
  }

  axios
    .post('/UserOp/searchBook', {
      name: name,
      isbn: isbn,
      author: author,
      page: String(page.value),
      ready: String(ready),
      opUser: client.clientData.clientName
    })
    .then((res: AxiosResponse<BookResponse>) => {
      if (!res.status) {
        throw 'Unable to get data with status code ' + res.status
      }
      let resobj = res.data.books
      if (resobj.length == 0) {
        isMore.value = false
      } else {
        //TODO-C: ask backend to update api
        resobj.forEach((e) => {
          e.bookCoverName = e.bookCover
          axios
            .post('/picture/download', {
              name: e.bookCover
            })
            .then((f: AxiosResponse<PictureResponse>) => {
              if (f.data.status) e.bookCover = 'data:image/jpg;base64,' + f.data.data
              data.push(e)
            })
          console.log(e.bookCover)
        })
        page.value += 1
      }
    })
    .catch((err: any) => {
      message.error(`Error detected while fetching books: ${err}`)
    })
}
const search = (name: string, author: string, isbn: string, ready: boolean) => {
  data.splice(0, data.length)
  request(name, author, isbn, ready)
}
watch(selected, (e) => {
  //TODO: finish search by type
  //Time so little, delayed
  //request(nameSave,authorSave,isbnSave,readySave)
})
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
  margin: 0px;
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
