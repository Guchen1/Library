<template>
  <div v-if="client.isAdmin" style="padding-top: 20px; padding: 20px; padding-bottom: 0px">
    <a-typography-title :level="2" class="title">User Control</a-typography-title>
    <div class="batch-box">
      <a-input-search
        style="width: 400px"
        placeholder="Input Username"
        v-model:value="searchString"
        @search="searchx"
      >
        <template #enterButton>
          <a-button type="primary">
            <template #icon> <SearchOutlined /> </template>Search</a-button
          >
        </template>
      </a-input-search>
    </div>
    <div class="batch-box">
      <a-button @click="toRole('staff')" class="batch">To Staff</a-button>
      <a-button @click="toRole('superuser')" class="batch">To Superuser</a-button>
      <a-button @click="toRole('manager')" class="batch">To Manager</a-button>
      <a-button @click="staffCreate()" class="batch" type="primary">New Staff</a-button>
      <a-button @click="del(undefined)" class="batch" type="danger">Delete</a-button>
    </div>
    <div style="display: flex; justify-content: center">
      <UserTable
        ref="table"
        :data="data"
        @toRole="(e, f) => toRole(e, f)"
        @delete="(e) => del(e)"
        @changepass="(e, f) => changePass(e, f)"
        :height="height"
        style="max-width: 1000px; width: 100%"
      />
    </div>
  </div>
  <div v-else></div>
</template>
<script setup lang="ts">
import UserTable from '@/components/UserTable.vue'
import { useClient } from '@/stores/client'
import type { BackendResponse, UserDetail, UserTypeResponse } from '@/types/type'
import { SearchOutlined, ToTopOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { AxiosResponse } from 'axios'
import { useAxios } from '@/stores/axios'
import { computed, onMounted, reactive, ref } from 'vue'
import 'ant-design-vue/es/message/style/css'
const client = useClient()
const axios = useAxios().Axios
const searchString = ref('')
const table = ref<typeof UserTable>()
const clearList = computed(() => {
  return table?.value?.clearList
})
const staffCreate = () => {
  //TODO: Finish staffCreate function
}
const toRole = async (role: string, item?: UserDetail) => {
  console.log(role)
  console.log(item)
  if (item != undefined) {
    await axios
      .post('/ManagerOp/changeAuthority', {
        opUser: client.clientData.clientName,
        account: item.accountName,
        type: role
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          data.value.forEach((e) => {
            if (e.accountName == item.accountName) {
              e.accountType = role
            }
          })
          return true
        } else {
          throw e.data.msg.content
        }
      })
      .catch((e: any) => {
        message.info(`Error detected in changing the role: ${e}`)
        return false
      })
  } else {
    for (var e of table!.value!.currentList) {
      await axios
        .post('/ManagerOp/changeAuthority', {
          opUser: client.clientData.clientName,
          account: e.accountName,
          type: role
        })
        .then((f: AxiosResponse<BackendResponse>) => {
          console.log(f.data.status)
          if (!f.data.status) {
            throw f.data.msg.content
          }
          data.value.forEach((g) => {
            if (g.accountName == e.accountName) {
              g.accountType = role
            }
          })
        })
        .catch((e: any) => {
          message.info(`Error detected in changing the role of ${e.accountName}. ${e}`)
          return false
        })
    }
  }
  //TODO-C: Finish toRole function,更新成功之后刷新页面
}
const del = async (item?: UserDetail) => {
  //TODO: Finish del function,成功之后刷新页面
  //Ask api tomorrow

  if (item != undefined) {
    console.log('start del')
    await axios
      .post('/ManagerOp/deleteRole', {
        account: client.clientData.clientName,
        targetAcc: item.accountName
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          data.value.splice(data.value.indexOf(item), 1)
          return true
        } else {
          throw e.data.msg.content
        }
      })
      .catch((e: any) => {
        console.log(e)
        message.info(`Error detected in deleting ${item.accountName}: ${e}`)
        return false
      })
  } else {
    for (var e of table!.value!.currentList) {
      await axios
        .post('/ManagerOp/deleteRole', {
          account: client.clientData.clientName,
          targetAcc: e.accountName
        })
        .then((f: AxiosResponse<BackendResponse>) => {
          if (!f.data.status) {
            throw f.data.msg.content
          } else {
            data.value.splice(data.value.indexOf(e), 1)
          }
        })
        .catch((f: String) => {
          console.log(f)
          message.info(`Error detected in deleting ${e.accountName}: ${f}`)
          return false
        })
    }
  }
}
const changePass = (item: UserDetail, pass: string) => {
  //TODO: change password
  //Ask api tomorrow
  if (item != undefined) {
    console.log('start del')
    axios
      .post('/ManagerOp/changePassword', {
        opUser: client.clientData.clientName,
        account: client.clientData.clientName,
        targetAcc: item.accountName,
        newPassword: pass,
        OpType: 'manager'
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          message.info(`Change password successfully`)
          return true
        } else {
          throw e.data.msg
        }
      })
      .catch((e: any) => {
        message.info(`Change password failed`)
        return false
      })
  }
}

//TODO-C: Search formula.
const data = ref<UserDetail[]>([])
const searchx = () => {
  axios
    .post('SuperuserOp/userInfo', {
      opUser: client.clientData.clientName,
      page: '1',
      num: '999'
    })
    .then((res: AxiosResponse<UserTypeResponse>) => {
      console.log('searchStr' + searchString.value)
      data.value = res.data.accounts.filter((e) => e.accountName.indexOf(searchString.value) != -1)
    })
    .catch((e: any) => {
      message.error(`Error while fetching user data: ${e}`)
      data.value = []
    })
}
searchx()
defineProps<{
  width: number
  height: number
}>()
defineExpose({
  clearList
})
</script>
<style scoped>
.title {
  width: 100%;
  text-align: center;
}
.batch {
  margin-right: 10px;
}
.batch-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
