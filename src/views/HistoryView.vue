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
import 'ant-design-vue/es/message/style/css'
import BookSearch from '@/components/BookSearch.vue'
import BookTable from '@/components/BookTable.vue'
import type { BookDetail, BookInfo, BookResponse, BorrowRecord, BorrowResponse } from '@/types/type'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import { reactive } from 'vue'
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

  bookBorrowInfo.forEach((e) => {
    console.log(e.borrowIsReturn)
    let thisbook = bookInfo.filter((f) => f.bookIsbn == e.bookIsbn)
    data.push({
      name: e.bookName,
      bookId: String(thisbook[0]!.bookId),
      isbn: e.bookIsbn,
      author: e.bookAuthor,
      borrower: e.borrowAccount,
      borrowdate: dayjs(e.borrowTime, 'YYYY-MM-DD'),
      duedate: dayjs(e.borrowTime, 'YYYY-MM-DD').add(e.borrowDuration, 'day'),
      returndate:
        e.borrowReturnDate != undefined
          ? dayjs(e.borrowReturnDate, 'YYYY-MM-DD')
          : e.borrowIsReturn == 'yes'
          ? dayjs()
          : undefined,
      status:
        e.borrowIsReturn == 'yes'
          ? 'returned'
          : e.borrowIsOverTime == 1
          ? 'overdue'
          : e.borrowIsrenew == 1
          ? 'renewed'
          : 'borrowed',
      renewable: e.borrowIsrenew == 0,
      visible: true,
      borrowId: e.borrowId,
      fine: 0
    })
  })
}
search('', '', '')
</script>

<style scoped></style>
