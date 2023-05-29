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
      <a-button @click="toRole('staff')" :disabled="hasPatron||hasSelf" class="batch" >To Staff</a-button>
      <a-button @click="toRole('manager')" :disabled="hasPatron||hasSelf"  class="batch">To Admin</a-button>
      <a-popover
        placement="bottom"
        v-model:visible="visibleB"
        title="Create a Patron"
        trigger="click"
      >
        <template #content>
          <div style="display: flex; flex-direction: column">
            <div>Username: <a-input class="" v-model:value="stName"></a-input></div>
            <div>Password: <a-input v-model:value="stPass"></a-input></div>
            <div style="width: 100%; justify-content: end; display: flex">
              <a-button
                type="primary"
                style="width: 40%; margin-top: 5px; justify-self: end"
                @click="staffCreate()"
                >Submit</a-button
              >
            </div>
          </div>
        </template>
        <a-button class="batch" type="primary"> Create a Staff</a-button>
      </a-popover>
      <a-button @click="del(undefined)" class="batch" type="danger" :disabled="hasSelf">Delete</a-button>
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
const visibleB = ref(false)
const stName = ref('')
const stPass = ref('')
const table = ref<typeof UserTable>()
const clearList = computed(() => {
  return table?.value?.clearList
})
const staffCreate = async () => {
  //TODO-C: Finish staffCreate function
  if (stName.value.length == 0 || stPass.value.length == 0) {
    message.error('Pleace fulfill all info.')
  } else {
    axios
      .post('/ManagerOp/creatRole', {
        opUser: client.clientData.clientName,
        account: stName.value,
        password: stPass.value,
        type: 'staff',
        email: 'default@example.com'
      })
      .then((res: any) => {
        console.log(res)
        if (!res.data.status) {
          throw res.data.msg.content
        } else {
          data.value.push({
            accountName: stName.value,
            accountPassword: stPass.value,
            accountType: 'staff'
          })
          message.info(`Create Staff complete`)
        }
      })
      .catch((err: any) => {
        message.error(`Error detected while creating Staff: ${err}`)
      })
      .finally(() => {
        stName.value = ''
        stPass.value = ''
      })
  }
}
const hasPatron = computed((item: UserDetail) => {
  let flag=false
  table.value?.currentList.forEach((e:any) => {
    if (e.accountType == 'user') {
      flag=true
    }
  })
  return flag
})
const hasSelf = computed((item: UserDetail) => {
  let flag=false
  table.value?.currentList.forEach((e:any) => {
    if (e.accountName == client.clientData.clientName) {
      flag=true
    }
  })
  return flag
})
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
}
const del = async (item?: UserDetail) => {
  //TODO-C: Finish del function,成功之后刷新页面
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
  console.log('start del')
  axios
    .post('/ManagerOp/changePassword', {
      opUser: client.clientData.clientName,
      account: client.clientData.clientName,
      targetAcc: item.accountName,
      newPassword: pass,
      OpType: client.clientData.clientType
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      if (e.data.status) {
        message.info(`Change password successfully`)
        return true
      } else {
        throw e.data.msg.content
      }
    })
    .catch((e: any) => {
      console.log(e)
      message.info(`Change password failed`)
      return false
    })
    .finally(() => {})
}

//TODO-C: Search formula.
const data = ref<UserDetail[]>([])
const searchx = () => {
  axios
    .post('SuperuserOp/userInfo', {
      opUser: client.clientData.clientName,
      page: '1',
      num: '99999'
    })
    .then((res: AxiosResponse<UserTypeResponse>) => {
      console.log('searchStr' + searchString.value)
      data.value = res.data.accounts.filter((e) => (e.accountName.indexOf(searchString.value) != -1&&e.accountType!='superuser'))
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
