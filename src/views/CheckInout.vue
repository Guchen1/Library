<template>
  <div class="main">
    <a-card :bodyStyle="{ display: 'flex', alignItems: 'center' }" class="searchbar"
      ><div class="title">Search</div>
      <a-divider type="vertical" />
      <a-form @finish="onFinish" style="display: inline-flex" layout="inline" :model="searchForm"
        ><a-form-item><a-input v-model:value="searchForm.name" placeholder="Name" /></a-form-item
        ><a-form-item><a-input v-model:value="searchForm.isbn" placeholder="Isbn" /></a-form-item
        ><a-form-item><a-range-picker v-model:value="searchForm.date" /></a-form-item><a-button danger @click="ResetForm()" >
        <template #icon><CloseOutlined /></template>Reset</a-button
      >
      <a-button type="primary" html-type="submit" style="margin-left:10px">
        <template #icon><SearchOutlined /></template>Search</a-button
      >
      </a-form>
      </a-card
    >
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons-vue'

import { reactive, ref } from 'vue'
interface SearchForm {
  name: string
  isbn: string
  date: Array<Dayjs>
}
const searchForm: SearchForm = reactive({
  name: '',
  isbn: '',
  date: []
})
const ResetForm = () => {
  searchForm.name = ''
  searchForm.isbn = ''
  searchForm.date = []
}
const onFinish = () => {
  console.log('Success:')
  console.log('Success:', searchForm.date[0].format('YYYY-MM-DD'))
} 
</script>

<style scoped>
.main {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchbar {
  max-width: 1343px;
  height: 100px;
}
.title {
  font-size: 30px;
  font-weight: bold;
  display: inline-flex;
}
</style>
