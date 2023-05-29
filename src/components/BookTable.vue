<template>
  <div>
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
        <template v-else-if="column.key === 'status'">
          <a-badge status="success" />Status
        </template>
      </template>
      <template #bodyCell="{ column, record }">
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
        <template v-else-if="column.key === 'selected'">
          <div style="display: flex; justify-content: center">
            <a-checkbox
              :checked="checked(record)"
              @update:checked="check(record, $event)"
            ></a-checkbox>
          </div>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag v-if="record.status == 'available'" class="tag" color="green">Available</a-tag>
          <a-tag v-else-if="record.status == 'returned'" class="tag" color="green">Returned</a-tag>
          <a-tag v-else-if="record.status == 'borrowed'" class="tag" color="blue">Borrowed</a-tag>
          <a-tag v-else-if="record.status == 'renewed'" class="tag" color="yellow">Renewed</a-tag>
          <a-tag v-else color="red" class="tag">Overdue</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-popover
            placement="left"
            v-if="record.status == 'available' && props.type != 'user'"
            v-model:open="record.visible"
            title="Please input patron name"
            trigger="click"
          >
            <template #content>
              <a-input v-model:value="name"></a-input
              ><a-button style="display: inline-block" @click="borrow(record, name)"
                >Submit</a-button
              >
            </template>
            <a style="font-size: 10px; white-space: nowrap" type="primary" size="small"
              >Check Out</a
            >
          </a-popover>

          <a
            v-else-if="props.type != 'user'&&record.status != 'overdue'"
            type="primary"
            style="font-size: 10px; white-space: nowrap"
            size="small"
            @click="returnBook(record)"
            >Return</a
          >
          <div style="display: inline-block">
            <a
              :disabled="record.renewable == false ? 'disabled' : null"
              v-if="record.status != 'available' && record.status != 'returned'&&record.status != 'overdue'"
              style="
                padding-left: 5px;
                font-size: 10px;
                word-wrap: break-word;
                word-break: keep-all;
              "
              type="primary"
              size="small"
              @click="renew(record)"
              >Renew</a
            >
          </div>
          <div style="display: inline-block">
            <a
              v-if="record.status == 'overdue' && props.type != 'user' "
              style="
                font-size: 10px;
                word-wrap: break-word;
                word-break: keep-all;
              "
              type="error"
              size="small"
              @click="fine(record)"
              >Fine and Return</a
            >
          </div>
        </template>
      </template>
    </a-table>
    <PayAddon @success="(e) => success(e)" v-if="ready" :fV="fV" :record="record" />
  </div>
</template>
<script setup lang="ts">
//TODO-C: Bind to the real data corresponding to the search
import PayAddon from './PayAddon.vue'
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { BackendResponse, BookInfo, BookDetail, BookResponse } from '@/types/type'
import type { AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
const visible = reactive<boolean[]>([])
const axios = useAxios().Axios
const client = useClient()
dayjs.extend(customParseFormat)
const record = ref()
const fV=ref(0)
const ready = ref(false)
//TODO-C: Finish initalize data.
const props = defineProps<{
  height: number
  type: string
  width: number
  dataA: BookInfo[]
}>()
watch(props.dataA, () => {
  data.splice(0, data.length)
  props.dataA.forEach((e) => data.push(e))
})
const name = ref('')
const hide = (record: BookInfo) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].isbn == record.isbn) {
      data[i].visible = false
    }
  }
}
axios.get(useAxios().urlAlter + "/Static/getStatisInfo?opUser="+useClient().clientData.clientName).then((res:any) => {
  if (res.data.code == 200) {
    /*maxBook:int//最大借书数目
    fine:float //罚款金额 美元
    timeLimit:int //借书时长 天*/
    fV.value = res.data.fine;

  }
})
const fine = (recordx: BookInfo) => {
  record.value = recordx
  ready.value = true
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
const returnBook = async (record: BookInfo) => {
  //TODO-C: Return books
  //TODO: 检测用户是否缴纳罚金
  await axios
    .post('/StaffOp/returnBook', {
      opUser: client.clientData.clientName,
      bookId: record.bookId,
      isDamaged: false,
      account: record.borrower,
      borrowId: record.borrowId
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (!e.data.status) {
        throw e.data.msg.content
      }
      message.info(`Return book success!`)
      data[data.indexOf(record)].borrowdate = undefined
      data[data.indexOf(record)].borrower = undefined
      data[data.indexOf(record)].duedate = undefined
      data[data.indexOf(record)].returndate = undefined
      data[data.indexOf(record)].status = 'available'
      client.reload()
    })
    .catch((e: any) => {
      message.error(`Error detected when returing books: ${e}`)
    })
}
const borrow = async (record: BookInfo, person: string) => {
  //TODO: 检测用户是否达到借书上限制，是否缴纳罚金
  await axios
    .post('/StaffOp/borrowBook', {
      opUser: client.clientData.clientName,
      bookId: record.bookId,
      userAccount: person,
      dates: '30'
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (!e.data.status) {
        throw e.data.msg.content
      }
      message.info(`Borrow book success!`)
      data[data.indexOf(record)].borrowdate = dayjs()
      data[data.indexOf(record)].borrower = name.value
      data[data.indexOf(record)].duedate = dayjs().add(30, 'day')
      data[data.indexOf(record)].returndate = dayjs().add(30, 'day')
      data[data.indexOf(record)].status = 'borrowed'
      client.reload()
    })
    .catch((e: any) => {
      message.error(`Error detected when borrowing books: ${e}`)
    })
}
const renew = (record: BookInfo) => {
  //TODO-C: Finish renew function
  //TODO：查询用户是否缴纳罚金
  axios
    .post('/UserOp/renewBook', {
      opUser: client.clientData.clientName,
      account: record.borrower,
      bookId: record.bookId,
      time: '30'
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (!e.data.status) {
        throw e.data.msg.content
      }
      message.info(`Renew book success!`)
      data[data.indexOf(record)].duedate?.add(30, 'day')
      data[data.indexOf(record)].returndate?.add(30, 'day')
      client.reload()
    })
    .catch((e: any) => {
      message.error(`Error detected when renewing books: ${e}`)
    })
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
const success = (e: any) => {
  ready.value = false
}
const data = reactive<BookInfo[]>([])
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
  renew,
  returnBook,
  borrow,
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
