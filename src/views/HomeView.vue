<script setup lang="ts">
import { useAxios } from '@/stores/axios'
import { ref, onMounted, computed, watch, onActivated, onDeactivated, nextTick, onUnmounted } from 'vue'
import { useClient } from '@/stores/client'
const client = useClient()
const loading = ref(true)
const xx=ref(0)
const ready=ref(false)
const axios = useAxios().Axios
function handleMessage(event: any) {
  var data = event.data
  switch (data.method) {
    case 'updateVueMessage':
      nextTick(() => {
        loading.value = false
      })
      break
    case 'ready':
      if(props.visible)
      ready.value=true
      else{
        xx.value= setInterval(()=>{
          if(props.visible){
          ready.value=true
          clearInterval(xx.value)
          }
        },100)
      }
      break
    default:
      break
  }
}
const props = defineProps<{
  width: number,
  visible: boolean
}>()
onMounted(() => {
  window.addEventListener('message', handleMessage, false)
})
onUnmounted(() => {
  loading.value = true
  ready.value=false
  window.removeEventListener('message', handleMessage, false)
})
const x = computed(() => {
  return props.width > 1600 ? 0.192505 * props.width + 'px' : 0.247755 * props.width + 'px'
})
</script>

<template>
  <div class="main">
    <div
      v-show="loading"
      style="background-color: black  height: 100%; width: 100%; border: 0px"
      v-cloak
    ></div>
    <iframe
      v-show="!loading"
      v-cloak
      id="frame"
      style="height: 100%; width: 100%; border: 0px"
      title="top"
      src="/HomeSlider.html"
      sandbox="allow-scripts"
    ></iframe>
    <div
      style="
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        top: 0px;
        align-items: center;
        pointer-events: none
      "
    ><Transition name="fade">
      <div v-if="ready" class="panel"><RouterLink to="/sign" @click="client.state='signin'">Sign In</RouterLink><RouterLink to="/sign" style="padding-left:50px" @click="client.state='signup'">Sign Up</RouterLink></div>
    </Transition>
    </div>
  </div>
</template>
<style scoped>
@font-face {
  font-family: '优设标题黑';
  src: url('@/assets/Small.ttf');
}
.main {
  width: 100vw;
  user-select:none;
  height: 100vh;
  box-sizing: border-box;
}
a {
  color: white;
  font-size: 20px;
  pointer-events: auto;
}

.panel{
  margin-bottom: -70vh;
  margin-left:-70px;
}

</style>
<style>
body {
  overflow: hidden;
  background-color: black;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
