<template>
  <a-table :scroll="{ y: $route.path=='/history'? width>1380?props.height - 320 + 'px': props.height - 360 + 'px':width>1576? props.height - 310 + 'px': props.height - 365 + 'px', visible: false }" :columns="columns"
    :pagination="{ position: ['bottomCenter'], pageSize: 12 }" :data-source="data">
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
      <template v-else-if="column.key === 'selected'"><div style="display:flex;justify-content: center;"><a-checkbox
          :checked="checked(record)" @update:checked="check(record,$event)"></a-checkbox></div></template>
      <template v-else-if="column.key === 'status'">
        <a-tag v-if="record.status == 'available'" class="tag" color="green">Available</a-tag>
        <a-tag v-else-if="record.status == 'returned'" class="tag" color="green">Returned</a-tag>
        <a-tag v-else-if="record.status == 'borrowed'" class="tag" color="blue">Borrowed</a-tag>
        <a-tag v-else-if="record.status == 'renewed'" class="tag" color="yellow">Renewed</a-tag>
        <a-tag v-else color="red" class="tag">Overdue</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popover v-if="record.status == 'available' && props.type != 'user'" v-model:open="record.visible"
          title="Please input patron name" trigger="click">
          <template #content>
            <a-input v-model:value="name"></a-input><a-button style="display:inline-block">Submit</a-button>
          </template>
          <a style="font-size: 10px; white-space: nowrap" type="primary" size="small">Check Out</a>
        </a-popover>

        <a v-else-if="props.type != 'user'" type="primary" style="font-size: 10px; white-space: nowrap"
          size="small">Return</a>
        <div style="display: inline-block">
          <a :disabled="record.renewable == false ? 'disabled' : null"
            v-if="record.status != 'available' && record.status != 'Returned'"
            style="padding-left: 5px; font-size: 10px; word-wrap: break-word; word-break: keep-all" type="primary"
            size="small" @click="renew(record)">Renew</a>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">

import { computed, reactive, ref } from 'vue'
const visible = reactive<boolean[]>([])

interface BookInfo {
  name: string
  isbn: string
  author: string
  borrower: string | undefined
  borrowdate: string | undefined
  duedate: string | undefined
  returndate: string | undefined
  status: 'available' | 'borrowed' | 'overdue' | 'returned' | 'renewed'
  renewable: boolean | undefined
  visible: boolean
}
const props = defineProps<{
  height: number,
  type: string,
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
const renew = (record: BookInfo) => {
  //TODO: Finish renew function
}
const checkList=ref<BookInfo[]>([])
const check= (record:BookInfo,e: boolean) => {
  if(e){
    checkList.value.push(record)
  }
  else{
    checkList.value.splice(checkList.value.indexOf(record),1)
  }
}
const clearList=()=>{
  checkList.value=[]
}
const checked = computed({
  //可对setter和getter都传参的计算属性
  get: () => {
    return (record: BookInfo) => {
      //列表里有就返回true
      if(checkList.value.indexOf(record)!=-1){
        return true
      }
      else{
        return false
      }
    }
  },
  set: () => {
  }
})
const data = reactive<BookInfo[]>([])
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  duedate: '2021-01-31',
  returndate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'renewed',
  renewable: false,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
  returndate: '2021-01-31',
  duedate: '2021-01-31',
  status: 'borrowed',
  renewable: true,
  visible: false
})
data.push({
  name: 'One Piece',
  isbn: '987654321',
  author: 'Eiichiro Oda',
  borrower: undefined,
  borrowdate: undefined,
  returndate: undefined,
  duedate: undefined,
  status: 'available',
  renewable: undefined,
  visible: false
})
data.push({
  name: 'The Lord of the Rings',
  isbn: '123456789',
  author: 'J.R.R. Tolkien',
  borrower: 'John',
  borrowdate: '2021-12-01',
  duedate: '2021-12-31',
  returndate: undefined,
  status: 'overdue',
  renewable: false,
  visible: false
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
const sortFunc = (a: BookInfo, b: BookInfo) => {
  //TODO: sorter with backend
  if (a.isbn > b.isbn) {
    return true
  } else {
    return false
  }
}
const columns = [
  {
    name: 'Selected',
    key: 'selected',
    title: 'Selected',
    //设置width
    width: 87,
  },
  {
    name: 'ISBN',
    dataIndex: 'isbn',
    key: 'isbn',
    sorter: sortFunc,
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
    title: 'Name'
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
      //TODO: sorter with backend
      if (a.borrowdate === undefined) return false
      if (b.borrowdate === undefined) return true
      if (a.borrowdate > b.borrowdate) {
        return true
      } else {
        return false
      }
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
      //TODO: filter with backend
      if (value === '14') {
        if (record.borrowdate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 14)
        const date2 = new Date(record.borrowdate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value === '30') {
        if (record.borrowdate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 30)
        const date2 = new Date(record.borrowdate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value === '90') {
        if (record.borrowdate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 90)
        const date2 = new Date(record.borrowdate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  {
    name: 'Due Date',
    dataIndex: 'duedate',
    key: 'duedate',
    title: 'Due Date',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO: sorter with backend
      if (a.duedate === undefined) return false
      if (b.duedate === undefined) return true
      if (a.duedate > b.duedate) {
        return true
      } else {
        return false
      }
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
      //TODO: filter with backend
      if (value === '14') {
        if (record.duedate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 14)
        const date2 = new Date(record.duedate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value === '30') {
        if (record.duedate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 30)
        const date2 = new Date(record.duedate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value === '90') {
        if (record.duedate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 90)
        const date2 = new Date(record.duedate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
  },
  {
    name: 'Return Date',
    dataIndex: 'Returndate',
    key: 'returndate',
    title: 'Return Date',
    sorter: (a: BookInfo, b: BookInfo) => {
      //TODO: sorter with backend
      if (a.returndate === undefined) return false
      if (b.returndate === undefined) return true
      if (a.returndate > b.returndate) {
        return true
      } else {
        return false
      }
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
      //TODO: filter with backend
      if (value == '14') {
        if (record.returndate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 14)
        const date2 = new Date(record.returndate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value == '30') {
        if (record.returndate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 30)
        const date2 = new Date(record.returndate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else if (value == '90') {
        if (record.returndate === undefined) return false
        const date = new Date()
        date.setDate(date.getDate() - 90)
        const date2 = new Date(record.returndate)
        if (date2 > date) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
  },
  {
    name: 'Status',
    dataIndex: 'status',
    key: 'status',
    title: 'Status',
    filters: filter,
    onFilter: (value: string, record: BookInfo) => {
      //TODO: filter with backend
      return record.status === value
    },
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
}
else {
  for (let i of columns) {
    if (i.name == 'Return Date') {
      columns.splice(columns.indexOf(i), 1)
      break
    }
  }
}
defineExpose({
  clearList,
  checkList
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
