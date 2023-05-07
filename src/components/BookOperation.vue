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
    <a-typography-title style="text-align: center; padding-top: 20px" :level="2">{{
      bookDetail == undefined ? 'Add a Book' : 'Modify Book'
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
          ><a-form-item style="margin-bottom: 10px" label="ISBN"
            ><a-input style="width: 60%; margin-right: 13px" v-model:value="book.isbn"></a-input
            ><a-button>Check</a-button> </a-form-item
          ><a-form-item style="margin-bottom: 10px" label="Name"
            ><a-input v-model:value="book.name"></a-input> </a-form-item
          ><a-form-item style="margin-bottom: 10px" label="Author"
            ><a-input v-model:value="book.author"></a-input> </a-form-item
          ><a-form-item style="margin-bottom: 10px" label="Type"
            ><a-select v-model:value="book.type">
              <template v-for="item in typeList" :key="item">
                <a-select-option v-if="item != 'All'" :value="item">{{ item }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item style="margin-bottom: 0px" label="Info"
            ><a-input v-model:value="book.info"></a-input> </a-form-item
        ></a-form>
      </div>
    </div>
    <div class="padding bottom-box">
      <div style="width: 100%; padding-bottom: 20px" class="bottom-box">
        <div class="text">Location</div>
        <a-cascader v-model:value="book.location" :options="options" placeholder="Please select" />
      </div>
      <div class="bottom-box">
        <div class="text" style="padding-left: 30px">Inventory</div>
        <a-input-number :precision="0" :min="0" v-model:value="book.inventory"></a-input-number>
      </div>
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
import type { CascaderProps } from 'ant-design-vue'
defineProps<{
  typeList: string[]
}>()
//TODO-D::finish location and type selection
const options: CascaderProps['options'] = [
  {
    value: 'floor1',
    label: 'Floor 1',
    children: [
      {
        value: 'stack_a',
        label: 'Stack A',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_b',
        label: 'Stack B',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_c',
        label: 'Stack C',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'floor2',
    label: 'Floor 2',
    children: [
      {
        value: 'stack_a',
        label: 'Stack A',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_b',
        label: 'Stack B',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_c',
        label: 'Stack C',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'floor3',
    label: 'Floor 3',
    children: [
      {
        value: 'stack_a',
        label: 'Stack A',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_b',
        label: 'Stack B',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf2',
            label: 'Shelf 2',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          },
          {
            value: 'shelf3',
            label: 'Shelf 3',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              },
              {
                value: 'layer2',
                label: 'Layer 2'
              },
              {
                value: 'layer3',
                label: 'Layer 3'
              }
            ]
          }
        ]
      },
      {
        value: 'stack_c',
        label: 'Stack C',
        children: [
          {
            value: 'shelf1',
            label: 'Shelf 1',
            children: [
              {
                value: 'layer1',
                label: 'Layer 1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'floor4',
    label: 'Floor 4',
    children: [
      {
        value: 'stack_a',
        label: 'Stack A',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men'
          }
        ]
      }
    ]
  }
]
const value = ref<string[]>([])
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
  location: [],
  type: '',
  picObj: '',
  inventory: 0
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
const handleOk = async (isAdd: boolean) => {
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
      book.name = bookDetail.value.bookName
      book.author = bookDetail.value.bookAuthor
      book.isbn = bookDetail.value.bookIsbn
      book.info = bookDetail.value.bookSummary
      book.picObj = bookDetail.value.bookCover
      book.inventory = bookDetail.value.bookStock
      console.log(book.name)
    } else {
      fileList.value = []
      book.name = ''
      book.author = ''
      book.isbn = ''
      book.info = ''
      book.picObj = ''
      book.inventory = 0
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
.avatar-uploader {
  margin-top: 18px;
}
.padding {
  padding-top: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.bottom-box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
.text {
  font-size: 20px;
  line-height: 22px;
  padding-right: 10px;
  display: flex;
  align-items: center;
}
</style>
