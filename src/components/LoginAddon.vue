<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { AxiosResponse } from 'axios';
const client = useClient()
const axios = useAxios().Axios
interface FormState {
  username: string
  password: string
  remember: boolean
  usertype: string
}
interface RegisterState {
  username: string
  password: string
  optcode: string
  usertype: string
}
const func = ref(false)
const formLogin = reactive<FormState>({
  username: '',
  password: '',
  remember: false,
  usertype: 'user'
})
const formRegister = reactive<RegisterState>({
  username: '',
  password: '',
  optcode: '',
  usertype: 'user'
})
const onFinish = (values: RegisterState | FormState) => {
  //判断是不是FormState
  if ('usertype' in values && 'remember' in values) {
    if (values.usertype == 'user') {
      axios
        .get('/userop/login', {
          params: {
            account: values.username,
            password: values.password
          }
        })
        .then((res: AxiosResponse) => {
          console.log(res)
        })
        .catch((err: AxiosResponse) => {
          console.log(err)
          setTimeout(() => {
            client.loggedIn = true
            localStorage.setItem('loggedin', 'true')
            client.clientData.clientType = 'user'
          }, 500)
          visible.value = false
        })
    } else {
      console.log('admin')
      axios
        .get('/managerop/login', {
          params: {
            account: values.username,
            password: values.password
          }
        })
        .then((res: any) => {
          console.log(res)
        })
    }
  } else {
    axios
      .get('/userop/register', {
        params: {
          account: values.username,
          password: values.password
        }
      })
      .then((res: any) => {
        console.log(res)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}
const onFinishFailed = (errorInfo: any) => {}
const clearState = () => {
  formLogin.username = ''
  formLogin.password = ''
  formLogin.remember = false
  formLogin.usertype = 'user'
  formRegister.username = ''
  formRegister.password = ''
  func.value = false
}
const visible = ref<boolean>(false)
defineExpose({
  visible
})
</script>
<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="null"
      centered
      :footer="null"
      destroyOnClose
      @cancel="clearState()"
      :closable="false"
      :bodyStyle="{}"
    >
      <div class="modal" :style="{ height: func ? '465px' : '465px' }">
        <transition
          mode="out-in"
          name="fade"
          enter-active-class="animate__animated animate__faster animate__zoomIn"
          leave-active-class="animate__animated animate__faster animate__zoomOut"
        >
          <div v-if="!func" style="padding: 50px; padding-bottom: 20px">
            <a-typography-title :level="3">Login</a-typography-title>
            <a-form
              :model="formLogin"
              name="basic"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              style="margin-left: -10px; padding-top: 20px"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
            >
              <a-form-item
                label="Username"
                name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]"
              >
                <a-input v-model:value="formLogin.username" />
              </a-form-item>
              <a-form-item
                label="Password"
                name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]"
              >
                <a-input-password v-model:value="formLogin.password" />
              </a-form-item>
              <a-form-item
                label="Usertype"
                name="usertype"
                :rules="[{ required: true, message: 'Please Select your usertype!' }]"
              >
                <a-select v-model:value="formLogin.usertype">
                  <a-select-option value="user">User</a-select-option>
                  <a-select-option value="admin">Admin</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item name="remember" :wrapper-col="{ offset: 9, span: 16 }">
                <a-checkbox v-model:checked="formLogin.remember">Remember me</a-checkbox>
              </a-form-item>

              <a-form-item :wrapper-col="{ offset: 11, span: 12 }">
                <a-button type="primary" html-type="submit">Login</a-button>
              </a-form-item>
            </a-form>
            <div style="padding-left: 10px">
              To create a new account
              <a href="javascript:void(0);" @click="func = true">Register</a>
            </div>
          </div>
          <!-- Register -->
          <div v-else style="padding: 50px; padding-bottom: 20px">
            <a-typography-title :level="3">Register</a-typography-title>
            <a-form
              :model="formRegister"
              name="basic"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              style="margin-left: -10px; padding-top: 20px"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
            >
              <a-form-item
                label="Username"
                name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]"
                ><a-input v-model:value="formRegister.username"
              /></a-form-item>
              <a-form-item
                label="Password"
                name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]"
                ><a-input v-model:value="formRegister.password" />
              </a-form-item>
              <a-form-item
                label="Optcode"
                name="optcode"
                :rules="[{ required: true, message: 'Please input the optcode!' }]"
                ><a-input v-model:value="formRegister.optcode" />
              </a-form-item>
              <a-form-item
                label="Usertype"
                name="usertype"
                :rules="[{ required: true, message: 'Please Select your usertype!' }]"
              >
                <a-select v-model:value="formRegister.usertype">
                  <a-select-option value="user">User</a-select-option>
                  <a-select-option value="admin">Admin</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :wrapper-col="{ offset: 11, span: 12 }">
                <a-button type="primary" html-type="submit">Register</a-button>
              </a-form-item>
            </a-form>
            <div style="padding-left: 10px">
              To access your account
              <a href="javascript:void(0);" @click="func = false">Login</a>
            </div>
          </div>
        </transition>
      </div>
    </a-modal>
  </div>
</template>
<style scoped>
.modal {
  box-sizing: border-box;
  transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
