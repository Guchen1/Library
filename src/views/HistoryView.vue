<template>
  <div style="padding-top: 20px; padding-left: 20px; padding-right: 20px">
    <BookSearch :search-func="search" />
    <BookTable
      :data-a="data"
      :width="width"
      type="user"
      style="padding-top: 20px"
      :height="props.height"
    />
  </div>
</template>

<script setup lang="ts">
import BookSearch from '@/components/BookSearch.vue'
import BookTable from '@/components/BookTable.vue'
import type { BookDetail, BookInfo, BookResponse, BorrowRecord, BorrowResponse } from '@/types/type'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import type { AxiosResponse } from 'axios'
import message from 'ant-design-vue/lib/message'
const props = defineProps<{
  width: number
  height: number
}>()
const data = reactive<BookInfo[]>([])
const axios = useAxios().Axios
const client = useClient()

const search = async (name: string, author: string, isbn: string) => {
  //TODO-C: Finish search function
  data.splice(0, data.length)
  let page: number = 1
  let isMore: boolean = true
  let bookBorrowInfo: BorrowRecord[] = []
  let bookInfo: BookDetail[] = []
  await axios
    .post('/StaffOp/bookAllBorrowInfo', {
      opUser: client.clientData.clientName,
      page: '1',
      num: '999'
    })
    .then((e: AxiosResponse<BorrowResponse>) => {
      console.log(e)
      // Do not ask me why...
      e.data.infoList.forEach((e: BorrowRecord) => {
        if (
          e.bookName.indexOf(name) != -1 &&
          e.bookAuthor.indexOf(author) != -1 &&
          e.bookIsbn.indexOf(isbn) != -1 &&
          e.borrowAccount == client.clientData.clientName
        ) {
          bookBorrowInfo.push(e)
        }
      })
    })
    .catch((e: any) => {
      message.error(e)
    })
  try {
    while (isMore) {
      await axios
        .post('/UserOp/searchBook', {
          opUser: client.clientData.clientName,
          name: '',
          isbn: '',
          author: '',
          page: String(page),
          ready: true
        })
        .then((res: AxiosResponse<BookResponse>) => {
          if (!res.status) {
            isMore = false
            throw 'Unable to get data with status code ' + res.status
          }
          if (res.data.books.length == 0) {
            isMore = false
          } else {
            res.data.books.forEach((e: BookDetail) => {
              if (
                e.bookName.indexOf(name) != -1 &&
                e.bookAuthor.indexOf(author) != -1 &&
                e.bookIsbn.indexOf(isbn) != -1
              ) {
                bookInfo.push(e)
              }
            })
            page += 1
          }
        })
        .catch((e: any) => {
          isMore = false
          throw e
        })
    }
  } catch (err: any) {
    message.error(err)
  }

  bookInfo.forEach((e: any) => {
    let whatever = e
    console.log(whatever.bookStock)
    for (var i = 0; i < whatever.bookStock; ++i) {
      data.push({
        name: whatever.bookName,
        bookId: whatever.bookId,
        isbn: whatever.bookIsbn,
        author: whatever.bookAuthor,
        borrower: undefined,
        borrowdate: undefined,
        duedate: undefined,
        returndate: e.returndate,
        status: 'available',
        renewable: undefined,
        visible: false,
        borrowId: undefined,
        fine: 0
      })
    }
    let recordForBook = bookBorrowInfo.filter((e) => e.bookIsbn == whatever.bookIsbn)
    console.log(recordForBook.length)
    for (i = 0; i < recordForBook.length; ++i) {
      data.push({
        name: whatever.bookName,
        bookId: whatever.bookId,
        isbn: whatever.bookIsbn,
        author: whatever.bookAuthor,
        borrower: e.borrowAccount,
        borrowdate: dayjs(e.borrowTime, 'YYYY-MM-DD'),
        duedate: dayjs(e.borrowTime, 'YYYY-MM-DD').add(e.borrowDuration, 'day'),
        returndate: dayjs(e.borrowTime, 'YYYY-MM-DD').add(e.borrowDuration, 'day'),
        status: e.borrowIsOverTime == 1 ? 'overdue' : e.borrowIsrenew == 1 ? 'renewed' : 'borrowed',
        renewable: e.borrowIsrenew == 0,
        visible: true,
        borrowId: e.borrowId,
        fine: 0
      })
      //TODO-C: Add fine
    }
  })
}
search('', '', '')
</script>

<style scoped></style>
