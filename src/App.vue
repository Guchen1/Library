<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useClient } from './stores/client';
import { useRouter,useRoute } from 'vue-router';
const router = useRouter();
const client = useClient();
const route = useRoute();
const selectedKeys = ref(['1']);
const ready= ref(false);
const height= ref('');
onMounted(() => {
  height.value= (window.innerHeight-64-70).toString();
  setTimeout(() => {
    ready.value=true;
  }, 100);
});
const goHome = () => {
  router.push('/');
  //清空selectedKeys
  selectedKeys.value.shift();

};
setInterval(() => {
  console.log(selectedKeys);
}, 1000);
</script>

<template>
  <a-layout v-if="route.name!='login'&&ready">
    <a-layout-header v-cloak class="layout-head" >
    <div style="display:flex">
      <div class="logo" @click="goHome();">Library</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        :style="{ lineHeight: '64px','border':'0px' }"
      >
        <a-menu-item key="1">Books</a-menu-item>
        <a-menu-item v-if="client.isAdmin" key="2">nav 2</a-menu-item>
        <a-menu-item v-if="client.isAdmin" key="3">nav 3</a-menu-item>
      </a-menu>
    </div>
    <div><a-button @click="router.push('/login')">Login</a-button></div>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px','min-height':height+'px','box-sizing':'border-box','background-color':'white'   }">
    <RouterView></RouterView>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Library ©2023 Created by B3 SPM
    </a-layout-footer>
  </a-layout>
  <RouterView v-cloak v-else-if="ready"></RouterView>
</template>
<style scoped>
.layout-head {
  position: fixed;
  z-index: 1;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 3px -3px black;
  display:flex;
  justify-content: space-between;

}
.logo{
  display: inline-block;
  padding-right: 20px;
  line-height: 64px;
  font-size: 20px;
  cursor: pointer;
}
[v-cloak] {
  display: none;
}
</style>
