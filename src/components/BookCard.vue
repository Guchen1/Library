<script setup lang="ts">
import { nextTick } from 'vue'
import type { BackendResponse, BookDetail } from '@/types/type'
import { useClient } from '@/stores/client'
import { useAxios } from '@/stores/axios'
import type { AxiosResponse } from 'axios'

const axios = useAxios().Axios

const client = useClient()

const props = defineProps<{
  book: BookDetail
}>()

const emits = defineEmits<{
  (e: 'show', a: BookDetail): void
}>()
const borrow=(isbn:string)=>{
  //TODO: finish borrow function
}
const del = (isbn: BookDetail['isbn']) => {
  axios
    .post('managerop/deletebook', {
      ISBN: isbn
    })
    .then((e: AxiosResponse<BackendResponse>) => {
      console.log(e.data.msg.content)
      if (!e.data.status) {
        throw e.data.msg.content
      }
      alert('删除成功，请按上方刷新键刷新')
      nextTick(() => {})
    })
    .catch((e: any) => {
      alert('删除失败：' + e)
    })
  // TODO: Father refresh
}
</script>

<template>
  <a-card :bodyStyle="{ height: '100%' }" class="card">
    <div class="upper">
      <div class="uLeft">
        <img alt="example" :src="props.book.cover" />
      </div>
      <div class="uRight">
        <div>
          <div>bookName: {{ props.book.name }}</div>
          <div>author: {{ props.book.author }}</div>
          <div>isbn: {{ props.book.isbn }}</div>
          <div>info: {{ props.book.summary }}</div>
        </div>
      </div>
    </div>
    <div class="lower">
      <p v-if="client.isUser">
        <a-button
          style="border-color: #52c41a; color: #52c41a; background-color: #f6ffed"
          @click="borrow(props.book.isbn)"
          >Borrow</a-button
        >
      </p>
      <div v-else>
        <a-button style="margin-right: 20px" danger @click="del(props.book.isbn)"
          >Withdraw</a-button
        >
        <a-button
          style="border-color: #52c41a; color: #52c41a; background-color: #f6ffed"
          @click="emits('show', props.book)"
          >Change Info</a-button
        >
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.card {
  flex-wrap: wrap;
  border-radius: 12px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.card .upper {
  height: 80%;
  display: flex;
}

.card .upper .uLeft {
  width: 40%;
  align-items: center;
  display: inline-flex;
}

.card .upper .uRight {
  width: 60%;
  height: 100%;
  display: inline-flex;
}

.card .lower {
  height: 20%;
  justify-content: center;
  display: flex;
  padding-bottom: 10px;
}
p {
  margin: 0px;
  padding-top: 10px;
  margin-bottom: -10px;
}
img {
  width: 80%;
  border-radius: 10px;
}
</style>
