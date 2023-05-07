<template>
  <div>
    <a-table
      @change="resize"
      :columns="columns"
      :scroll="{ x: 'max-content', y: height - 310, visible: false }"
      :data-source="data"
      :loading="loading"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'selected'"
          ><div style="display: flex; justify-content: center">
            <a-checkbox
              :checked="checked(record)"
              @update:checked="check(record, $event)"
            ></a-checkbox></div
        ></template>
        <template v-else-if="column.key == 'username'">{{ record.accountName }}</template>
        <template v-else-if="column.key == 'role'">{{
          record.accountType == 'user' ? 'pateron' : record.accountType
        }}</template>
        <template v-else-if="column.key == 'action'">
          <div class="action" style="display: flex; justify-content: space-between">
            <div class="action" style="display: inline-flex">
              <a-button @click="toRole(record, 'user')" v-if="record.accountType != 'user'"
                >To Patron</a-button
              >
              <a-button @click="toRole(record, 'staff')" v-if="record.accountType != 'staff'"
                >To Staff</a-button
              >
              <a-button @click="toRole(record, 'manager')" v-if="record.accountType != 'manager'"
                >To Admin</a-button
              >
              <a-button
                @click="toRole(record, 'superuser')"
                v-if="record.accountType != 'superuser'"
                >To Superuser</a-button
              >
            </div>
            <div style="display: inline-flex" class="action">
              <a-button style="display: inline-block" type="primary">Change Password</a-button>
              <a-button style="display: inline-block" type="danger">Delete</a-button>
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
//TODO: Bind to the real data corresponding to the search
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useClient } from '@/stores/client'
import type { UserDetail, UserTypeResponse } from '@/types/type'
import { message } from 'ant-design-vue'
import { usePagination } from 'vue-request'
import axios, { type AxiosResponse } from 'axios'

const client = useClient()
const checkList = ref<UserDetail[]>([])
const clearList = () => {
  checkList.value = []
}

defineProps<{
  height: number
}>()
const currentList = computed({
  set: () => {},
  get: () => {
    let temp: Array<UserDetail> = []
    data.value?.forEach((item) => {
      if (checkList.value.indexOf(item) != -1) {
        temp.push(item)
      }
    })
    return temp
  }
})
const resize = () => {
  maxHeight.value = 'unset'
  nextTick(() => {
    const a = document
      .getElementsByClassName('ant-table-body')[0]
      .getAttribute('style')
      ?.split(';')[1]
      .split(':')[1]
    const b = document.getElementsByClassName('ant-table-body')[0].clientHeight
    //a转数字
    const c = Number(a?.split('px')[0])
    if (c != undefined) {
      if (c - b >= 20) {
        maxHeight.value = b + 10 + 'px'
      } else {
        maxHeight.value = c + 'px'
      }
    }
  })
}
const maxHeight = ref<string>('')
onMounted(() => {
  window.addEventListener('resize', resize)
  resize()
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
const columns = [
  {
    title: 'Selected',
    key: 'selected',
    width: 87,
    fixed: 'left'
  },
  {
    title: 'Username',
    dataIndex: 'name',
    key: 'username',
    width: 150
  },
  {
    title: 'Role',
    key: 'role',
    width: 80,
    filters: [
      {
        text: 'Patron',
        value: 'user'
      },
      {
        text: 'Staff',
        value: 'staff'
      },
      {
        text: 'Admin',
        value: 'admin'
      },
      {
        text: 'Superuser',
        value: 'superuser'
      }
    ],
    onFilter: (value: string, record: UserDetail) => record.accountType.indexOf(value) === 0
  },
  {
    title: 'Action',
    key: 'action'
  }
]
const emit = defineEmits<{
  (event: 'toRole', role: string, item?: UserDetail): boolean
}>()
const check = (record: UserDetail, e: boolean) => {
  if (e) {
    checkList.value.push(record)
  } else {
    checkList.value.splice(checkList.value.indexOf(record), 1)
  }
}
const toRole = (record: UserDetail, role: 'user' | 'staff' | 'manager' | 'superuser') => {
  data.value?.forEach((item) => {
    //TODO: Finish toRole function
    if (item === record) {
      console.log('ready to change...')
      if (emit('toRole', role, item)) {
        console.log('success')
        item.accountType = role
      } else {
        message.error(`Change role for ${item.accountName} failed`)
      }
    }
  })
}
const checked = computed({
  //可对setter和getter都传参的计算属性
  get: () => {
    return (record: UserDetail) => {
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
//const data = ref<UserDetail[]>([])
const queryData = () => {
  return axios
    .post<UserTypeResponse>('http://localhost:8080/SuperuserOp/userInfo', {
      opUser: client.clientData.clientName,
      page: '1',
      num: '999'
    })
    .then((res: AxiosResponse<UserTypeResponse>) => {
      return res.data.accounts
    })
    .catch((e) => {
      message.error(`Error while fetching user data: ${e}`)
      return [] as UserDetail[]
    })
}

defineExpose({
  clearList,
  checkList,
  currentList
})

const {
  data: data,
  run,
  loading,
  current,
  pageSize
} = usePagination(queryData, {
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'results'
  }
})

const pagination = computed(() => ({
  total: data.value?.length,
  current: current.value,
  pageSize: pageSize.value
}))
</script>
<style scoped>
.action button {
  margin-right: 10px;
}
:deep(.ant-table-body) {
  height: v-bind('maxHeight');
}
</style>
