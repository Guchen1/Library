<template>
  <div style="margin-top: 20px">
    <BookSearch @show="show(undefined)" style="padding-left: 5px" :searchFunc="search" />
    <TypeList ref="types" style="padding: 20px" v-model:selected="selected" />
    <BookOperation
      :typeList="types?.list == undefined ? [] : types.list"
      ref="BookOperationRef"
      @add-book="addBook"
      @change-book="changeBook"
    />
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
const store = reactive<BookDetail[]>([])
// Actually toShow
const data = ref<BookDetail[]>([])
const types = ref()
const loading = ref(false)
const selected = ref<string[]>([])
const show = (book: BookDetail | undefined) => {
  tempbook.value = book
  if (BookOperationRef.value != undefined) {
    BookOperationRef.value.bookDetail = tempbook.value
    BookOperationRef.value.visible = true
  }
}
const addBook = (newBook: BookDetail) => {
  axios
    .post('/StaffOp/addBook', {
      opUser: client.clientData.clientName,
      isbn: newBook.bookIsbn,
      name: newBook.bookName,
      author: newBook.bookAuthor,
      publisher: newBook.bookPublisher,
      summary: newBook.bookSummary,
      cover: newBook.bookCover,
      stock: String(newBook.bookStock),
      category: newBook.bookCategoryName,
      price: String(newBook.bookPrice),
      location: newBook.bookLocation
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (e.data.status) {
        data.value.push(newBook)
        message.info('Book added.')
      } else {
        throw e.data.msg.content
      }
    })
    .catch((e: any) => {
      console.log(e)
      message.warning('Add book failed.')
    })
}
const changeBook = (newBook: BookDetail) => {
  axios
    .post('/StaffOp/updateBook', {
      opUser: client.clientData.clientName,
      isbn: newBook.bookIsbn,
      name: newBook.bookName,
      author: newBook.bookAuthor,
      publisher: newBook.bookPublisher,
      summary: newBook.bookSummary,
      cover: newBook.bookCover,
      stock: String(newBook.bookStock),
      category: newBook.bookCategoryName,
      price: String(newBook.bookPrice),
      location: newBook.bookLocation
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (e.data.status) {
        data.value.forEach((e) => {
          if (e.bookIsbn === newBook.bookIsbn) {
            e = newBook
          }
        })
        message.info('change completed')
      } else {
        throw e.data.msg.content
      }
    })
    .catch((e: any) => {
      console.log(e)
      message.warning('change failed')
    })
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
        data.value.splice(data.value.indexOf(isbn), 1)
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
    page.value = 1
  }
  if (authorSave != author) {
    authorSave = author
    isMore.value = true
    page.value = 1
  }
  if (isbnSave != isbn) {
    isbnSave = isbn
    isMore.value = true
    page.value = 1
  }
  if (readySave != ready) {
    readySave = ready
    isMore.value = true
    page.value = 1
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
              store.push(e)
              data.value.push(e)
            })
          loading.value = false
          console.log(e.bookCover)
        })
        page.value += 1
      }
    })
    .catch((err: any) => {
      message.error(`Error detected while fetching books: ${err}`)
      loading.value = false
    })
}
const search = (name: string, author: string, isbn: string, ready: boolean) => {
  store.splice(0, data.value.length)
  data.value.splice(0, data.value.length)
  request(name, author, isbn, ready)
}
watch(selected, (e: string[]) => {
  //TODO-C: finish search by type
  //Time so little, delayed
  //request(nameSave,authorSave,isbnSave,readySave)

  data.value = store.filter((f) => {
    if (e.length == 0) return true
    for (var i of e) {
      if (f.bookCategoryName == i) return true
    }
    return false
  })

  console.log(data.value)
})
search('', '', '', false)
onMounted(() => {
  window.addEventListener('scroll', scrollHandle, false)
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandle, false)
})
function scrollHandle() {
  if (!isMore.value) return
  window.onscroll = () => {
    let bottom =
      Math.abs(
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          document.documentElement.scrollTop
      ) < 1
    if (bottom && isMore.value) {
      console.log(page.value)
      const a = setInterval(() => {
        if (!loading.value) {
          clearInterval(a)
          loading.value = true
          request(nameSave, authorSave, isbnSave, readySave)
        }
      }, 100)
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
