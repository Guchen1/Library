<template>

    <a-typography-title :level="2" style="text-align: center">Search Books</a-typography-title>
    <a-form
    layout="inline"
      :model="formState"
      name="basic"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
      autocomplete="off"
      :style="{ display: 'flex', justifyContent: 'center' }"
    >
      <a-form-item label="Author" name="author">
        <a-input v-model:value="formState.author" />
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="ISBN" name="isbn">
        <a-input v-model:value="formState.isbn" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 24 }">
        <div class="buttons">
          <a-button
          v-if="client.isStaff"
            danger
            style="border-color: #52c41a; color: #52c41a; background-color: #f6ffed"
            @click="emits('show')"
          >
            <template #icon><PlusOutlined /></template>Add</a-button
          >
          <a-button type="primary" html-type="submit" @click="Search()">
            <template #icon><SearchOutlined /></template>Search</a-button
          >
        </div>
      </a-form-item>
    </a-form>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CheckOutlined, CloseOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useClient } from '@/stores/client'
const client = useClient()
const emits = defineEmits<{
  (e: 'show'): void
}>()

const props = defineProps<{
  searchFunc: Function
}>()
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
const Search = () => {
  props.searchFunc(formState.name, formState.author, formState.isbn, formState.ready)
}
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
