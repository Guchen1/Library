<template>
  <a-table
    :scroll="{
      y:
        $route.path == '/history'
          ? width > 1380
            ? props.height - 320 + 'px'
            : props.height - 360 + 'px'
          : width > 1576
          ? props.height - 310 + 'px'
          : props.height - 365 + 'px',
      visible: false
    }"
    :columns="columns"
    :pagination="{ position: ['bottomCenter'], pageSize: 12, showSizeChanger: false }"
    :data-source="data"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'isbn'">
        <span style="color: #1d39c4"> ISBN </span>
      </template>
      <template v-else-if="column.key === 'status'"> <a-badge status="success" />Status </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.name }}
      </template>
      <template v-if="column.key === 'borrowdate'">
        {{ record.borrowdate === undefined ? '' : record.borrowdate.format('YYYY-MM-DD') }}
      </template>
      <template v-if="column.key === 'duedate'">
        {{ record.duedate === undefined ? '' : record.duedate.format('YYYY-MM-DD') }} </template
      ><template v-if="column.key === 'returndate'">
        {{ record.returndate === undefined ? '' : record.returndate.format('YYYY-MM-DD') }}
      </template>
      <template v-if="column.key === 'name'">
        {{ record.name }}
      </template>
      <template v-else-if="column.key === 'selected'"
        ><div style="display: flex; justify-content: center">
          <a-checkbox
            :checked="checked(record)"
            @update:checked="check(record, $event)"
          ></a-checkbox></div
      ></template>
      <template v-else-if="column.key === 'status'">
        <a-tag v-if="record.status == 'available'" class="tag" color="green">Available</a-tag>
        <a-tag v-else-if="record.status == 'returned'" class="tag" color="green">Returned</a-tag>
        <a-tag v-else-if="record.status == 'borrowed'" class="tag" color="blue">Borrowed</a-tag>
        <a-tag v-else-if="record.status == 'renewed'" class="tag" color="yellow">Renewed</a-tag>
        <a-tag v-else color="red" class="tag">Overdue</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popover
          v-if="record.status == 'available' && props.type != 'user'"
          v-model:open="record.visible"
          title="Please input patron name"
          trigger="click"
        >
          <template #content>
            <a-input v-model:value="name"></a-input
            ><a-button style="display: inline-block">Submit</a-button>
          </template>
          <a style="font-size: 10px; white-space: nowrap" type="primary" size="small">Check Out</a>
        </a-popover>

        <a
          v-else-if="props.type != 'user'"
          type="primary"
          style="font-size: 10px; white-space: nowrap"
          size="small"
          >Return</a
        >
        <div style="display: inline-block">
          <a
            :disabled="record.renewable == false ? 'disabled' : null"
            v-if="record.status != 'available' && record.status != 'Returned'"
            style="padding-left: 5px; font-size: 10px; word-wrap: break-word; word-break: keep-all"
            type="primary"
            size="small"
            @click="renew(record)"
            >Renew</a
          >
        </div>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
//TODO: Bind to the real data corresponding to the search
import { computed, reactive, ref, onMounted } from 'vue'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { BookDetail, BookResponse } from '@/types/type'
import type { AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
const visible = reactive<boolean[]>([])
const axios = useAxios().Axios
const client = useClient()
dayjs.extend(customParseFormat)
interface BookInfo {
  name: string
  isbn: string
  author: string
  borrower: string | undefined
  borrowdate: Dayjs | undefined
  duedate: Dayjs | undefined
  returndate: Dayjs | undefined
  status: 'available' | 'borrowed' | 'overdue' | 'returned' | 'renewed'
  renewable: boolean | undefined
  visible: boolean
}

interface BorrowRecord {
  bookIsbn: string
  bookName: string
  bookAuthor: string
  borrowAccount: string
  borrowTime: string
  borrowDuration: number
  borrowIsOverTime: number
}

interface BorrowResponse {
  status: boolean
  op: string
  msg: {
    code: number
    content: string
  }
  pageNum: number
  numEachPage: number
  infoList: BorrowRecord[]
}

const props = defineProps<{
  height: number
  type: string
  width: number
}>()
const name = ref('')
const hide = (record: BookInfo) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].isbn == record.isbn) {
      data[i].visible = false
    }
  }
}
const currentList = computed({
  set: () => {},
  get: () => {
    let temp: Array<BookInfo> = []
    data.forEach((item) => {
      if (checkList.value.indexOf(item) != -1) {
        temp.push(item)
      }
    })
    return temp
  }
})
const renew = (record: BookInfo) => {
  //TODO: Finish renew function
}
const checkList = ref<BookInfo[]>([])
const check = (record: BookInfo, e: boolean) => {
  if (e) {
    checkList.value.push(record)
  } else {
    checkList.value.splice(checkList.value.indexOf(record), 1)
  }
}
const clearList = () => {
  checkList.value = []
}
const checked = computed({
  //可对setter和getter都传参的计算属性
  get: () => {
    return (record: BookInfo) => {
      //列表里有就返回true
      if (checkList.value.indexOf(record) != -1) {
        return true
      } else {
        return false
      }
    }
  },
  set: () => {}
})
const data = reactive<BookInfo[]>([])
// TODO-E: Finish initalize data.
onMounted(async () => {
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
      e.data.infoList.forEach((e: any) => {
        bookBorrowInfo.push(e)
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
            throw 'Unable to get data with status code ' + res.status
          }
          if (res.data.books.length == 0) {
            isMore = false
          } else {
            res.data.books.forEach((element: any) => {
              bookInfo.push(element)
            })
            page += 1
          }
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
    console.log(count)
    for (var i = 0; i < whatever.bookStock - count; ++i) {
      data.push({
        name: whatever.bookName,
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
  })
  console.log(bookBorrowInfo)
  console.log(bookInfo)
  console.log(data)
})
const filter = reactive([
  {
    text: 'Borrowed',
    value: 'borrowed'
  },
  {
    text: 'Overdue',
    value: 'overdue'
  },
  {
    text: 'Returned',
    value: 'returned'
  },
  {
    text: 'Renewed',
    value: 'renewed'
  }
])
if (props.type != 'user') {
  filter.push({
    text: 'Available',
    value: 'available'
  })
}
const columns = [
  {
    name: 'Selected',
    key: 'selected',
    title: 'Selected',
    //设置width
    width: 87
  },
  {
    name: 'ISBN',
    dataIndex: 'isbn',
    key: 'isbn',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO-C: sorter with backend
      //Just in frontend, well...
      if (a.isbn > b.isbn) {
        return true
      } else {
        return false
      }
    },
    customHeaderCell: () => {
      return {
        style: {
          backgroundColor: '#fffbe6'
        }
      }
    }
  },
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name',
    title: 'BookName'
  },
  {
    name: 'Author',
    dataIndex: 'author',
    key: 'author',
    title: 'Author'
  },
  {
    name: 'Borrower',
    dataIndex: 'borrower',
    key: 'borrower',
    title: 'Borrower'
  },
  {
    name: 'Borrow Date',
    dataIndex: 'borrowdate',
    key: 'borrowdate',
    title: 'Borrow Date',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      if (a.borrowdate === undefined) return false
      if (b.borrowdate === undefined) return true
      return a.borrowdate.isAfter(b.borrowdate)
    },
    filters: [
      {
        text: 'Recent 14 days',
        value: '14'
      },
      {
        text: 'Recent 30 days',
        value: '30'
      },
      {
        text: 'Recent 90 days',
        value: '90'
      }
    ],
    onFilter: (value: string, record: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      if (record.borrowdate === undefined) return false
      let nowfilter = dayjs().add(-1 * Number(value), 'day')
      return record.borrowdate.isAfter(nowfilter)
    }
  },
  {
    name: 'Due Date',
    dataIndex: 'duedate',
    key: 'duedate',
    title: 'Due Date',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      if (a.duedate === undefined) return false
      if (b.duedate === undefined) return true
      return a.duedate.isAfter(b.duedate)
    },
    filters: [
      {
        text: 'Due in 3 days',
        value: '3'
      },
      {
        text: 'Due in 7 days',
        value: '7'
      },
      {
        text: 'Is due.',
        value: '0'
      }
    ],
    onFilter: (value: string, record: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      if (record.duedate === undefined) return false
      let number: number = Number(value)
      let nowfilter = dayjs().add(1 * Number(value), 'day')
      if (number > 0) {
        return record.duedate.isAfter(dayjs()) && record.duedate.isBefore(nowfilter)
      } else {
        return record.duedate.isBefore(dayjs())
      }
    }
  },
  {
    name: 'Return Date',
    dataIndex: 'Returndate',
    key: 'returndate',
    title: 'Return Date',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      if (a.returndate === undefined) return false
      if (b.returndate === undefined) return true
      return a.returndate.isAfter(b.returndate)
    },
    filters: [
      {
        text: 'Recent 7 days',
        value: '7'
      },
      {
        text: 'Recent 15 days',
        value: '14'
      },
      {
        text: 'Not returned',
        value: '0'
      }
    ],
    onFilter: (value: string, record: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      let number: number = Number(value)
      if (number == 0) {
        if (record.returndate === undefined) return true
      } else {
        if (record.returndate === undefined) return false
        let nowfilter = dayjs().add(-1 * Number(value), 'day')
        return record.returndate.isAfter(nowfilter) && record.returndate.isBefore(dayjs())
      }
    }
  },
  {
    name: 'Status',
    dataIndex: 'status',
    key: 'status',
    title: 'Status',
    filters: filter,
    onFilter: (value: string, record: BookInfo) => {
      //TODO-C: filter with backend
      //Just let it in frontend, well...
      return record.status === value
    }
  },
  {
    name: 'Action',
    key: 'action',
    title: 'Operation'
  }
]
if (props.type == 'user') {
  for (let i of columns) {
    //移除借书人
    if (i.name == 'Borrower') {
      columns.splice(columns.indexOf(i), 1)
      break
    }
  }
  for (let i of columns) {
    if (i.name == 'Author') {
      columns.splice(columns.indexOf(i), 1)
      break
    }
  }
  for (let i of columns) {
    if (i.name == 'Selected') {
      columns.splice(columns.indexOf(i), 1)
      break
    }
  }
} else {
  for (let i of columns) {
    if (i.name == 'Return Date') {
      columns.splice(columns.indexOf(i), 1)
      break
    }
  }
}
defineExpose({
  clearList,
  checkList,
  currentList
})
</script>
<style>
.tag {
  width: 66px;
  text-align: center;
}

.ant-popover-inner-content {
  display: flex;
}
</style>
