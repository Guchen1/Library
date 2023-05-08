<template>
  <div class="main">
    <BookSearch :search-func="search" />
    <div style="width: 100%; padding-top: 10px; display: flex; justify-content: center">
      <a-popover
        placement="bottom"
        v-model:visible="visibleA"
        title="Please input patron name"
        trigger="click"
      >
        <template #content>
          <a-input v-model:value="batchName"></a-input
          ><a-button style="display: inline-block">Submit</a-button>
        </template>
        <a-button :disabled="!allBorrowable" class="batch">Batch Check Out</a-button>
      </a-popover>
      <a-button :disabled="!allReturnable" class="batch">Batch Return</a-button
      ><a-button :disabled="!allRenewable" class="batch">Batch Renew</a-button>
      <a-popover
        placement="bottom"
        v-model:visible="visibleB"
        title="Create a Patron"
        trigger="click"
      >
        <template #content>
          <div style="display: flex; flex-direction: column">
            <div>Username: <a-input class="" v-model:value="paName"></a-input></div>
            <div>Password: <a-input v-model:value="paPass"></a-input></div>
            <div style="width: 100%; justify-content: end; display: flex">
              <a-button
                type="primary"
                style="width: 40%; margin-top: 5px; justify-self: end"
                @click="newPateron()"
                >Submit</a-button
              >
            </div>
          </div>
        </template>
        <a-button class="batch"> Create a Patron</a-button>
      </a-popover>
    </div>
    <BookTable
      :dataA="data"
      :width="width"
      ref="table"
      :type="'staff'"
      :height="props.height"
      class="tableSet"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import BookTable from '@/components/BookTable.vue'
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useAxios } from '@/stores/axios'
import BookSearch from '@/components/BookSearch.vue'
import type { BookDetail, BookInfo, BookResponse, BorrowRecord, BorrowResponse } from '@/types/type'
import { useClient } from '@/stores/client'
import { message } from 'ant-design-vue'
import type { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
const axios = useAxios().Axios
const client = useClient()
const visibleA = ref(false)
const visibleB = ref(false)
const batchName = ref('')
const paName = ref('')
const paPass = ref('')
const data = reactive<BookInfo[]>([])
onMounted(() => {
  search('', '', '', '')
})
const search = async (name: string, author: string, isbn: string, borrower: string) => {
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
      // Do not ask me why...
      e.data.infoList.forEach((e: BorrowRecord) => {
        if (
          e.bookName.indexOf(name) != -1 &&
          e.bookAuthor.indexOf(author) != -1 &&
          e.bookIsbn.indexOf(isbn) != -1 &&
          e.borrowAccount.indexOf(borrower) != -1
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
    let count: number = 0
    function a(whatever: any) {
      return (e: BorrowRecord) => {
        if (e.bookName == whatever.bookName) {
          data.push({
            name: whatever.bookName,
            bookId: whatever.bookId,
            isbn: whatever.bookIsbn,
            author: whatever.bookAuthor,
            borrower: e.borrowAccount,
            borrowdate: dayjs(e.borrowTime, 'YYYY-MM-DD'),
            duedate: dayjs(e.borrowTime, 'YYYY-MM-DD').add(e.borrowDuration, 'day'),
            returndate: dayjs(e.borrowTime, 'YYYY-MM-DD').add(e.borrowDuration, 'day'),
            status: 'borrowed',
            renewable: true,
            visible: true
          })
          count++
        }
      }
    }
    bookBorrowInfo.forEach(a(whatever))
    if (!(borrower != '' && e.borrowAccount == undefined)) {
      for (var i = 0; i < whatever.bookStock - count; ++i) {
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
          visible: false
        })
      }
    }
  })
}
//TODO: Create Pateron
const newPateron = async () => {
  if (paName.value.length == 0 || paPass.value.length == 0) {
    message.error('Pleace fulfill all info.')
  } else {
    await axios
      .post('/ManagerOp/creatRole', {
        opUser: client.clientData.clientName,
        account: paName.value,
        password: paPass.value,
        type: 'user',
        email: 'default@example.com'
      })
      .then((res: any) => {
        console.log(res)
        if (!res.data.status) {
          throw res.data.msg.content
        } else {
          message.info(`Create pateron complete`)
        }
      })
      .catch((err: any) => {
        message.error(`Error detected while creating pateron: ${err}`)
      })
  }
}
const table = ref<typeof BookTable>()
const props = defineProps<{
  width: number
  height: number
}>()
const computedWidth = computed(() => {
  return {
    first: props.width >= 1070 ? '0px' : '-14px',
    second: props.width >= 1070 ? '0px' : '-10px',
    third: props.width >= 1070 ? '0px' : '5px'
  }
})
const allBorrowable = computed(() => {
  //遍历查看是否选中的均可借阅
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (table.value?.currentList[i].status != 'available') {
      return false
    }
  }
  if (table.value?.currentList.length == 0) {
    return false
  }
  return true
})
const allRenewable = computed(() => {
  //遍历查看是否选中的均可续借
  let res = true
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (!table.value?.currentList[i].renewable) {
      res = false
    }
  }
  if (table.value?.currentList.length == 0) {
    res = false
  }
  return res
})
const allReturnable = computed(() => {
  //遍历查看是否选中的均可归还
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (
      table.value?.currentList[i].status != 'borrowed' &&
      table.value?.currentList[i].status != 'overdue' &&
      table.value?.currentList[i].status != 'renewed'
    ) {
      return false
    }
  }
  if (table.value?.currentList.length == 0) {
    return false
  }
  return true
})
const clearList = computed(() => {
  return table?.value?.clearList
})
onMounted(() => {})
defineExpose({
  clearList
})
watch(visibleA, () => {
  batchName.value = ''
  paName.value = ''
  paPass.value = ''
})
watch(visibleB, () => {
  batchName.value = ''
  paName.value = ''
  paPass.value = ''
})
</script>

<style scoped>
.main {
  padding: 20px;
  width: 100%;
  height: 100%;
}

.searchbar {
  max-width: 1343px;
  height: 100px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
}

.title {
  font-size: 30px;
  font-weight: bold;
  display: inline-flex;
  margin-top: v-bind('computedWidth.first');
}

.item {
  margin-top: v-bind('computedWidth.second');
  margin-bottom: v-bind('computedWidth.third');
}

@media screen and (max-width: 872px) {
  #dateForm {
    margin-top: 0px;
  }
}

.tableSet {
  margin-top: 10px;
}
.batch {
  margin-right: 10px;
}
</style>
