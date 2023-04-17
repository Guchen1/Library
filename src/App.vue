<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useClient } from './stores/client'
import { useRouter, useRoute } from 'vue-router'
import LoginAddon from './components/LoginAddon.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
const LoginRef = ref<InstanceType<typeof LoginAddon>>()
const router = useRouter()
const route = useRoute()
const spinning = ref(false)
const show = ref(true)
const client = useClient()
const selectedKeys = ref<Array<string>>([])
const height = ref('')
const width = ref(0)
interface table {
  [key: string]: string
}
const routetable: table = {
  '0': '/books',
  '2': '/manage',
  '3': '/checkinout',
  '4': '/personal',
  '5': '/news'
}
const reload = () => {
  spinning.value = true
  show.value = false
  nextTick(() => {
    show.value = true
  })
  setTimeout(() => {
    spinning.value = false
  }, 1000)
}
const goHome = () => {
  router.push('/')
  //清空selectedKeys
  selectedKeys.value.shift()
}
const logout = () => {
  client.logout()
  router.push('/')
}
watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    if (newValue === '/') {
      selectedKeys.value.shift()
    } else {
      selectedKeys.value = [
        Object.keys(routetable).find((key) => routetable[key] === newValue) as string
      ]
    }
  },
  { immediate: true }
)
watch(selectedKeys, (value) => {
  if (value.length > 0) {
    router.push(routetable[value[0]])
  } else {
    router.replace(route.path)
  }
})
onMounted(() => {
  height.value = (window.innerHeight - 64 - 70).toString()
  width.value = window.innerWidth
  window.onresize = () => {
    height.value = (window.innerHeight - 64 - 70).toString()
    width.value = window.innerWidth
  }
})
</script>

<template>
  <a-layout theme="light">
    <a-layout-header v-cloak class="layout-head" theme="light">
      <div style="display: flex">
        <div class="logo" @click="goHome()">Library</div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          :style="{ lineHeight: '64px', border: '0px', width: width - 350 + 'px' }"
        >
          <a-menu-item key="0">Books</a-menu-item>
          <a-menu-item key="5">News</a-menu-item>
          <a-menu-item v-if="client.isStaff" key="3">Check In/Out</a-menu-item>
          <a-menu-item v-if="client.isAdmin" key="2">Manage</a-menu-item>
          <a-menu-item v-if="client.loggedIn" key="4">Personal Center</a-menu-item>
        </a-menu>
      </div>
      <div>
        <a-button
          style="margin-right: 20px"
          v-if="!client.loggedIn"
          @click="LoginRef ? (LoginRef.visible = true) : ''"
          >Login</a-button
        ><a-button v-else style="margin-right: 20px" @click="logout()">Logout</a-button
        ><reload-outlined
          :spin="spinning"
          @click="reload()"
          style="height: 30px; width: 30px; cursor: pointer; margin-right: -25px"
        />
      </div>
    </a-layout-header>
    <a-layout-content class="layout-main" theme="light">
        <router-view v-if="show" v-slot="{ Component }">
            <component :width="Number(width)" :height="Number(height)" :is="Component" />
        </router-view>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Library ©2023 Created by SPM Class2 B3
    </a-layout-footer>
  </a-layout>
  <LoginAddon ref="LoginRef" v-if="!client.loggedIn"></LoginAddon>
</template>
<style scoped>
.layout-head {
  position: fixed;
  z-index: 1000;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 3px -3px black;
  display: flex;
  justify-content: space-between;
}
.logo {
  display: inline-block;
  padding-right: 20px;
  line-height: 64px;
  font-size: 20px;
  cursor: pointer;
}
.layout-main {
  padding: 0px;
  margin-top: 64px;
  min-height: v-bind(height + 'px');
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: center;
}
[v-cloak] {
  display: none;
}
</style>
