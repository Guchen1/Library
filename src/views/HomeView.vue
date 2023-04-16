<script setup lang="ts">
import { useAxios } from '@/stores/axios'
import { ref, onMounted, computed,watch } from 'vue'
import BookPreview from '@/components/BookPreview.vue'
const axios = useAxios().Axios
const topimg = ref()
const props = defineProps<{
  width: number
}>()
watch(()=>props.width,(newval)=>{
  newval>1600?topimg.value.src='/src/assets/Librarywithhangingbulbs2.png':topimg.value.src='/src/assets/Librarywithhangingbulbs1.png'
})
const x = computed(() => {
  return props.width > 1600 ? 0.192505 * props.width + 'px' : 0.247755 * props.width + 'px'
})
</script>

<template>
  <div class="main">
    <div
      class="up-box"
      :style="{
        width: '98%',
        height: x
      }"
    >
      <div class="main-text">
        <div class="text-body">The Library</div>
        <a-input class="main-search" onfocus="this.placeholder=''" onblur="this.placeholder='Search The Books" placeholder="Search The Books">12</a-input>
      </div>
    </div>
    <img src="@/assets/Librarywithhangingbulbs1.png" loading='lazy' v-if="false">
    <img src="@/assets/Librarywithhangingbulbs2.png" loading='lazy' v-if="false">
    <img
      ref="topimg"
      :src="
        props.width > 1600
          ? '/src/assets/Librarywithhangingbulbs2.png'
          : '/src/assets/Librarywithhangingbulbs1.png'
      "
      alt="logo"
    />
    <div class="down-list" :style="{ marginTop: x }">
      <BookPreview title="What's on"></BookPreview>
      <BookPreview title="Learn"></BookPreview>
      <BookPreview title="Discover"></BookPreview>
    </div>
  </div>
</template>
<style scoped>
@font-face {
  font-family: '优设标题黑';
  src: url('@/assets/Small.ttf');
}
.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  padding-top: 0px;
  display: flex;
  justify-content: center;
}
img {
  height: auto;
  object-fit: cover;
  width: 98%;
  position: fixed;
  z-index: 10;
  border-top: 20px solid white;
}
.text-body {
  width: 100%;
  text-align: center;
  font-family: '优设标题黑', sans-serif;
}
.up-box {
  z-index: 200;
  position: fixed;
  margin-top: 20px;
}
.main-text {
  color: white;
  height: 100%;
  width: 40%;
  flex-wrap: wrap;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
.main-search {
  width: 45%;
  display: block;
  min-height: 30px;
  height: 8%;
  max-width: 350px;
  border-radius: 20px;
}
.down-list {
  padding-top: 40px;
  position: relative;
  z-index: 0;
  width:60%;
}
::placeholder {
  color: black;
  text-decoration: underline;
  text-align: center;
}
@media screen and (max-width: 1224px) and (min-width: 1024px) {
  .main-text {
    font-size: 48px;
  }
  ::placeholder {
    font-size: 18px;
  }
  
}
@media screen and (min-width: 1820px) {
  .main-text {
    font-size: 64px;
  }
  ::placeholder {
    font-size: 18px;
  }
  .down-list{
    width: 50%;
  }
}
@media screen and (min-width: 1224px) and (max-width: 1820px) {
  .main-text {
    font-size: 56px;
  }
  ::placeholder {
    font-size: 18px;
  }
}
@media screen and (max-width: 1024px) and (min-width: 800px) {
  .main-text {
    font-size: 32px;
  }
  ::placeholder {
    font-size: 14px;
  }
  .down-list{
    width: 70%;
  }
}
@media screen and (max-width: 800px) {
  .main-text {
    font-size: 28px;
  }
  ::placeholder {
    font-size: 10px;
  }
}
@media screen and (min-width: 2220px){
  .down-list{
    width: 40%;
  }
}
</style>
