<template>
  <a-card
    class="cardflex"
    style="width: 250px; border-radius: 10px;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
    :bodyStyle="{ 'padding-bottom': '0px', 'padding-top': '15px' }"
  >
    <a-typography-title :level="2" style="text-align: center">Search</a-typography-title>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
      autocomplete="off"
    >
      <a-form-item label="author" name="author">
        <a-input v-model:value="formState.author" />
      </a-form-item>

      <a-form-item label="name" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="isbn" name="isbn">
        <a-input v-model:value="formState.isbn" />
      </a-form-item>
      <a-form-item name="ready" :wrapper-col="{ span: 24 }">
        <div class="checkbox">
          only in the library
          <a-switch style="margin-left: 10px" v-model:checked="formState.ready"
            ><template #checkedChildren><check-outlined /></template>
            <template #unCheckedChildren><close-outlined /></template
          ></a-switch>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }">
        <div class="buttons">
          <a-button danger @click="ResetForm()">
            <template #icon><CloseOutlined /></template>Reset</a-button
          >
          <a-button type="primary" html-type="submit">
            <template #icon><SearchOutlined /></template>Search</a-button
          >
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons-vue'
interface FormState {
  name: string
  author: string
  isbn: string
  ready: boolean
}
const formState: FormState = reactive({
  name: '',
  author: '',
  isbn: '',
  ready: false
})
const ResetForm = () => {
  formState.name = ''
  formState.author = ''
  formState.isbn = ''
}
//todo: add search function
</script>
<style scoped>
.cardflex {
  display: flex;
  justify-content: center;
}
.buttons {
  display: flex;
  justify-content: space-around;
}
.checkbox {
  display: flex;
  justify-content: center;
  line-height: 22px;
  font-size: 16px;
}
</style>
<style>
label {
  font-size: 16px !important;
}
</style>
