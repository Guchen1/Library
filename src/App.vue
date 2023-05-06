<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useClient } from "./stores/client";
import { useRouter, useRoute } from "vue-router";
import {
  ReloadOutlined,
  VerticalAlignTopOutlined,
  ClearOutlined,
} from "@ant-design/icons-vue";
import HomeView from "./views/HomeView.vue";
const router = useRouter();
const route = useRoute();
const spinning = ref(false);
const show = ref(true);
const client = useClient();
const selectedKeys = ref<Array<string>>([]);
const height = ref("");
const width = ref(0);
const compo = ref();
interface table {
  [key: string]: string;
}
const routetable: table = {
  "0": "/books",
  "1": "/history",
  "3": "/check",
  "6": "/sign",
  "7": "/dashboard",
  "8": "/users",
  "9": "/logs",
};
const reload = () => {
  spinning.value = true;
  show.value = false;
  nextTick(() => {
    show.value = true;
  });
  setTimeout(() => {
    spinning.value = false;
  }, 1000);
};
client.reload = reload;
const scrollTop = () => {
  //缓慢滚动到顶部
  //阻止滚动事件
  window.onscroll = null;
  let scroll = setInterval(() => {
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTop -= 50;
    } else {
      clearInterval(scroll);
      //恢复滚动事件
    }
  }, 2);
};
const clearList = () => {
  //清空list
  compo.value.clearList();
};
const goHome = () => {
  router.push("/");
  //清空selectedKeys
  selectedKeys.value.shift();
};
const logout = () => {
  client.logout();
  router.push("/");
};

watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    if (newValue === "/") {
      selectedKeys.value.shift();
    } else {
      selectedKeys.value = [
        Object.keys(routetable).find((key) => routetable[key] === newValue) as string,
      ];
    }
  },
  { immediate: true }
);
watch(selectedKeys, (value) => {
  if (value.length > 0) {
    router.push(routetable[value[0]]);
  } else {
    router.replace(route.path);
  }
});
onMounted(() => {
  height.value = (window.innerHeight - 70).toString();
  width.value = window.innerWidth;
  window.onresize = () => {
    height.value = (window.innerHeight - 70).toString();
    width.value = window.innerWidth;
  };
});
</script>

<template>
  <a-layout theme="light">
    <a-button
      style="position: fixed; bottom: 60px; right: 50px; z-index: 900"
      @click="reload()"
      v-if="!(route.path == '/') && route.path != '/sign'"
      shape="circle"
      size="large"
    >
      <template #icon>
        <ReloadOutlined :spin="spinning" />
      </template>
    </a-button>
    <a-button
      style="position: fixed; bottom: 120px; right: 50px; z-index: 900"
      shape="circle"
      size="large"
      v-if="route.path == '/books'"
      @click="scrollTop"
    >
      <template #icon>
        <vertical-align-top-outlined />
      </template>
    </a-button>
    <a-button
      style="position: fixed; bottom: 120px; right: 50px; z-index: 900"
      shape="circle"
      size="large"
      v-if="route.path == '/check' || (route.path == '/users' && client.isAdmin)"
      @click="clearList"
    >
      <template #icon>
        <clear-outlined />
      </template>
    </a-button>
    <a-layout-sider
      v-if="route.path != '/' && route.path != '/sign'"
      class="sider"
      theme="light"
      style="justify-content: center"
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }"
    >
      <div class="logo"><img src="@/assets/Vector.png" /> Library</div>
      <div class="box-bottom">
        <a-menu class="home" v-model:selectedKeys="selectedKeys"
          ><a-menu-item key="7">Dashboard</a-menu-item>
          <a-menu-item v-if="client.isAdmin" key="8">Users</a-menu-item>
          <a-menu-item v-if="client.isUser" key="1">History</a-menu-item>
          <a-menu-item v-if="client.isStaff" key="3">Check Out&Return</a-menu-item>
          <a-menu-item v-if="client.isStaff || client.isUser" key="0">Books</a-menu-item>
          <a-menu-item v-if="client.isSuper" key="9">Logs</a-menu-item>
        </a-menu>
        <div class="user-data">
          <div style="width: 80%">
            <div style="font-size: 30px; font-weight: 700">
              {{ client.clientData.clientName }}
            </div>
            <div style="font-size: 16px">{{ client.clientData.clientType }}</div>
          </div>
          <div style="display: flex; align-items: center">
            <img
              style="width: 50px; cursor: pointer"
              src="@/assets/log-out.png"
              @click="logout"
            />
          </div>
        </div>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="layout-main" theme="light">
        <div v-if="!client.loggedIn" v-show="route.path == '/'">
          <HomeView :visible="route.path == '/'" :width="Number(width)"></HomeView>
        </div>
        <div style="width: 100%" v-if="show && route.path != '/'">
          <router-view v-slot="{ Component }">
            <component
              ref="compo"
              :width="Number(width)"
              :height="Number(height)"
              :is="Component"
            />
          </router-view>
        </div>
      </a-layout-content>
      <a-layout-footer
        style="background-color: white"
        v-if="route.path != '/' && route.path != '/sign'"
        :style="{ textAlign: 'center' }"
      >
        <div
          style="
            box-sizing: border-box;
            width: 100%;
            padding-left: 350px;
            text-align: center;
          "
        >
          Library ©2023 Created by SPM Class2 B3
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
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
  line-height: 64px;
  font-size: 40px;
  font-weight: 600;
  background-color: #fffbe6;
  margin: 15px;
  margin-top: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 5px;
  width: 300px;
  box-sizing: border-box;
  text-align: center;
}
.layout-main {
  padding: 0px;
  min-height: v-bind("route.path=='/sign'?'0px': height + 'px'");
  box-sizing: border-box;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  padding-left: v-bind("route.path != '/' && route.path != '/sign'?'350px':'0px'");
}
[v-cloak] {
  display: none;
}
.sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep(.ant-menu) {
  border: 0px !important;
  width: 300px;
}
.sider {
  width: 350px !important;
  max-width: 350px !important;
  min-width: 350px !important;
  border-right: 1px black solid;
}
.home :deep(.ant-menu-item) {
  font-size: 25px;
  border-radius: 5px;
  height: 60px !important;
  display: flex;
  align-items: center;
  color: gray;
}
.home :deep(.ant-menu-item-active) {
  color: #85a5ff !important;
}
.home :deep(.ant-menu-item-selected) {
  color: white !important;
  background-color: #85a5ff !important;
}
.user-data {
  background-color: #e6f7ff;
  width: 300px;
  border-radius: 5px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
}
.box-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding-bottom: 40px;
  height: 100%;
}
</style>
