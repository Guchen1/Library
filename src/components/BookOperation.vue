<template>
  <a-modal
    :maskClosable="false"
    v-model:visible="visible"
    :title="null"
    centered
    :footer="null"
    destroyOnClose
    :closable="false"
    :bodyStyle="{}"
  >
    <a-typography-title style="text-align: center" :level="2">{{
      bookDetail != undefined ? 'Add a Book' : 'Modify Book'
    }}</a-typography-title>
    <div class="padding">
      <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :customRequest="customRequest"
        accept="image/*"
        @change="handleChange"
      >
        <img
          style="max-height: 170px; max-width: 170px"
          v-if="book?.picObj"
          :src="book?.picObj"
          alt="avatar"
        />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <div style="display: inline-flex; padding-left: 20px">
        <a-form
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :model="book"
          style="width: 100%; height: 178px; font-size: 20px !important"
          ><a-form-item style="margin-bottom: 14px" label="Name"
            ><a-input v-model:value="book.name"></a-input> </a-form-item
          ><a-form-item vue="margin-bottom: 14px" label="Author"
            ><a-input v-model:value="book.author"></a-input> </a-form-item
          ><a-form-item style="margin-bottom: 14px" label="ISBN"
            ><a-input v-model:value="book.isbn"></a-input> </a-form-item
          ><a-form-item style="margin-bottom: 0px" label="Info"
            ><a-input v-model:value="book.info"></a-input> </a-form-item
        ></a-form>
      </div>
    </div>
    <div class="padding bottom-box">
      <div class="text">Can Use</div>
      <a-switch v-model:checked="book.useable" />
      <div class="text" style="padding-left: 30px">Inventory</div>
      <a-input-number
        size="small"
        :precision="0"
        :min="0"
        v-model:value="book.inventory"
      ></a-input-number>
    </div>
    <div class="padding bottom-box">
      <a-button style="margin-right: 20px" @click="handleCancel"><CloseOutlined />Cancel</a-button>
      <a-button type="primary" @click="handleOk(bookDetail == undefined)"
        ><CheckOutlined />OK</a-button
      >
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { PlusOutlined, LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { message, type UploadChangeParam } from 'ant-design-vue'
import type { BookModify, BookDetail } from '@/types/type'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import { formToJSON, type AxiosResponse } from 'axios'
//引入message样式
import 'ant-design-vue/es/message/style/css'
const axios = useAxios().Axios
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const bookDetail = ref<BookDetail | undefined>(undefined)
const book: BookModify = reactive<BookModify>({
  id: 0,
  name: '',
  author: '',
  isbn: '',
  info: '',
  price: 0,
  picObj: '',
  inventory: 0,
  useable: true
})
const fileList = ref([])
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}
const handleCancel = () => {
  visible.value = false
}
const handleOk = (isAdd: boolean) => {
  axios.post(isAdd ? 'managerop/addbook' : 'managerop/updatebook', {
    isbn: book.isbn,
    name: book.name,
    author: book.author,
    publisher: '',
    summary: book.info,
    cover: 'https://imgbed.link/file/23947',
    price: String(1),
    stock: String(book.inventory),
    category: 'novel'
  })
  visible.value = false
}
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading' && info.file.originFileObj != undefined) {
    getBase64(info.file.originFileObj, (base64Url: string) => {
      if (book != undefined) book.picObj = base64Url
      loading.value = false
    })
  }
  if (info.file.status === 'done' && info.file.originFileObj != undefined) {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      //.value = base64Url
      loading.value = false
    })
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error('upload error')
  }
}
const customRequest = (e: any) => {
  return
}
defineExpose({
  visible,
  bookDetail
})
watch(
  () => visible.value,
  (val: boolean) => {
    console.log(bookDetail.value + String(val))
    if (val && bookDetail.value != undefined) {
      fileList.value = []
      book.name = bookDetail.value.name
      book.author = bookDetail.value.author
      book.isbn = bookDetail.value.isbn
      book.info = bookDetail.value.summary
      book.picObj = bookDetail.value.cover
      book.inventory = bookDetail.value.stock
      // TODO: useable to be implemented
      book.useable = true
      console.log(book.name)
    } else {
      fileList.value = []
      book.name = ''
      book.author = ''
      book.isbn = ''
      book.info = ''
      book.picObj = ''
      book.inventory = 0
      book.useable = true
    }
  }
)
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 170px;
  height: 170px;
  border-radius: 10px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-upload-picture-card-wrapper {
  width: 170px;
}
</style>
<style scoped>
.padding {
  padding-top: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.bottom-box {
  display: flex;
  justify-content: center;
}
.text {
  font-size: 20px;
  line-height: 22px;
  padding-right: 10px;
}
</style>
