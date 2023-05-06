<script setup lang="ts">
import { computed, nextTick } from 'vue'
import type { BackendResponse, BookDetail } from '@/types/type'
import { useClient } from '@/stores/client'
import { useAxios } from '@/stores/axios'
import type { AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'

const axios = useAxios().Axios

const client = useClient()

const props = defineProps<{
  book: BookDetail
}>()
const computedLocation = computed(() => {
  let res = ''
  if (props.book.bookLocation.length == 0) {
    res = 'none'
  } else {
    res = props.book.bookLocation
  }
  res = res.substring(0, res.length - 1)
  return res
})
const emits = defineEmits<{
  (e: 'show', a: BookDetail): void
  (e: 'deleteBook', a: BookDetail): void
}>()
const borrow = (isbn: string) => {
  //TODO: finish borrow function
}
</script>

<template>
  <a-card :bodyStyle="{ height: '100%' }" class="card">
    <div class="upper">
      <div class="uLeft">
        <img alt="example" :src="props.book.bookCover" />
      </div>
      <div class="uRight">
        <div>
          <div>Name: {{ props.book.bookName }}</div>
          <div>Author: {{ props.book.bookAuthor }}</div>
          <div>Type: {{ props.book.bookCategoryName }}</div>
          <div>Location: {{ computedLocation }}</div>
          <div>ISBN: {{ props.book.bookIsbn }}</div>
          <div>Info: {{ props.book.bookSummary }}</div>
        </div>
      </div>
    </div>
    <div class="lower">
      <p v-if="client.isUser">
        <a-button
          style="border-color: #52c41a; color: #52c41a; background-color: #f6ffed"
          @click="borrow(props.book.bookIsbn)"
          >Borrow</a-button
        >
      </p>
      <div v-else>
        <a-button style="margin-right: 20px" danger @click="emits('deleteBook', props.book)"
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
