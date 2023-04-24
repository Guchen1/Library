<template>
  <a-table
    :scroll="{ y: props.height - 295 + 'px', visible: false }"
    :columns="columns"
    :pagination="{ position: ['bottomCenter'], pageSize: 10 }"
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
      <template v-else-if="column.key === 'status'">
        <a-tag v-if="record.status == 'available'" class="tag" color="green">available</a-tag>
        <a-tag v-else-if="record.status == 'borrowed'" class="tag" color="blue">borrowed</a-tag>
        <a-tag v-else color="red" class="tag">overdue</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popover  v-if="record.status == 'available'" v-model:open="record.visible" title="Please input patron name" trigger="click">
          <template #content>
            <a-input v-model:value="name"></a-input><a-button style="display:inline-block" >Submit</a-button>
          </template>
          <a
            
            style="font-size: 10px; white-space: nowrap"
            type="primary"
            size="small"
            >Check Out</a
          >
        </a-popover>

        <a v-else type="primary" style="font-size: 10px; white-space: nowrap" size="small"
          >Check In</a
        >
        <div style="display: inline-block">
          <a
            :disabled="!record.renewable"
            v-if="record.status != 'available'"
            style="padding-left: 5px; font-size: 10px; word-wrap: break-word; word-break: keep-all"
            type="primary"
            size="small"
            >Renew</a
          >
        </div>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
const visible=reactive<boolean[]>([])
interface BookInfo {
  name: string
  isbn: string
  author: string
  borrower: string | undefined
  borrowdate: string | undefined
  duedate: string | undefined
  status: 'available' | 'borrowed' | 'overdue'
  renewable: boolean | undefined
  visible: boolean
}
const props = defineProps<{
  height: number
}>()
const name=ref('')
const hide=(record:BookInfo)=>{
  for(let i=0;i<data.length;i++){
    if(data[i].isbn==record.isbn){
      data[i].visible=false
    }
  }
}
const data = reactive<BookInfo[]>([])
data.push({
  name: 'Harry Potter',
  isbn: '123456789',
  author: 'J.K. Rowling',
  borrower: 'John',
  borrowdate: '2021-01-01',
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
  status: 'overdue',
  renewable: false,
  visible: false
})

const sortFunc = (a: BookInfo, b: BookInfo) => {
  if (a.isbn > b.isbn) {
    return true
  } else {
    return false
  }
}
const columns = [
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
    title: 'Borrow Date'
  },
  {
    name: 'Due Date',
    dataIndex: 'duedate',
    key: 'duedate',
    title: 'Due Date'
  },
  {
    name: 'Status',
    dataIndex: 'status',
    key: 'status',
    title: 'Status',
    sorter: (a: BookInfo, b: BookInfo) => {
      if (a.status > b.status) {
        return true
      } else {
        return false
      }
    }
  },
  {
    name: 'Action',
    key: 'action',
    title: 'Operation'
  }
]
</script>
<style>
.tag {
  width: 66px;
  text-align: center;
}
.ant-popover-inner-content{
  display: flex;
}
</style>
