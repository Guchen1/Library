<template>
  <div>
    <a-table
      @change="resize"
      :columns="columns"
      :scroll="{ x: 'max-content', y: height - 310, visible: false }"
      :data-source="props.data"
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
          record.accountType == 'user' ? 'patron' : record.accountType
        }}</template>
        <template v-else-if="column.key == 'action'">
          <div class="action" style="display: flex; justify-content: space-between">
            <div class="action" style="display: inline-flex">
              <div v-if="record.accountType != 'user'">
                <a-button
                  @click="emit('toRole', 'staff', record)"
                  v-if="record.accountType != 'staff'"
                  >To Staff</a-button
                >
                <a-button
                  @click="emit('toRole', 'manager', record)"
                  v-if="record.accountType != 'manager'"
                  >To Admin</a-button
                >
                <a-button
                  @click="emit('toRole', 'superuser', record)"
                  v-if="record.accountType != 'superuser'"
                  >To Superuser</a-button
                >
              </div>
            </div>
            <div style="display: inline-flex" class="action">
              <a-popover title="Please input new password" trigger="click">
                <template #content>
                  <a-input v-model:value="newPass"></a-input
                  ><a-button
                    style="display: inline-block"
                    @click="emit('changepass', record, newPass)"
                    >Submit</a-button
                  >
                </template>
                <a-button style="display: inline-block" type="primary">Change Password</a-button>
              </a-popover>
              <a-button style="display: inline-block" type="danger" @click="emit('delete', record)"
                >Delete</a-button
              >
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
//TODO: Bind to the real data corresponding to the search
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useClient } from '@/stores/client'
import type { UserDetail, UserTypeResponse } from '@/types/type'
import { message } from 'ant-design-vue'
import { usePagination } from 'vue-request'
import axios, { type AxiosResponse } from 'axios'
const newPass = ref('')
const client = useClient()
const checkList = ref<UserDetail[]>([])
const clearList = () => {
  checkList.value = []
}
const props = defineProps<{
  height: number
  data: UserDetail[]
}>()
const currentList = computed({
  set: () => {},
  get: () => {
    let temp: Array<UserDetail> = []
    props.data.forEach((item) => {
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
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
watch(
  () => props.data,
  () => {
    nextTick(() => {
      resize()
    })
  }
)
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
        text: 'Manager',
        value: 'manager'
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
  (event: 'delete', item?: UserDetail): void
  (event: 'changepass', item: UserDetail, pass: string): void
}>()
const check = (record: UserDetail, e: boolean) => {
  if (e) {
    checkList.value.push(record)
  } else {
    checkList.value.splice(checkList.value.indexOf(record), 1)
  }
}
/*
const toRole = (record: UserDetail, role: 'user' | 'staff' | 'manager' | 'superuser') => {
  props.data.forEach((item) => {
    //TODO: Finish toRole function
    //For DEMO ONLY!
    if (item === record) {
      console.log('ready to change...')
      //if (emit('toRole', role, item)) {
      //if (true) {
      //  console.log('success')
      item.accountType = role
      //} else {
      //  message.error(`Change role for ${item.accountName} failed`)
      //}
    }
  })
}
*/
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

defineExpose({
  clearList,
  checkList,
  currentList
})

watch(props.data, () => {
  resize()
})
</script>
<style scoped>
.action button {
  margin-right: 10px;
}
:deep(.ant-table-body) {
  height: v-bind('maxHeight');
}
</style>
