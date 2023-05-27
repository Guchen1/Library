<template>
  <a-modal :maskClosable="false" v-model:visible="visible" :title="null" centered :footer="null" destroyOnClose
    :closable="false" :bodyStyle="{}">
    <a-typography-title style="text-align: center; padding-top: 20px" :level="2">{{
      bookDetail == undefined ? 'Add a Book' : 'Modify Book'
    }}</a-typography-title>
    <div class="padding">
      <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
        :show-upload-list="false" :customRequest="customRequest" accept="image/*" @change="handleChange">
        <img style="max-height: 170px; max-width: 170px" v-if="book?.picObj" :src="book?.picObj" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <div style="display: inline-flex; padding-left: 20px">
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :model="book"
          style="width: 100%; height: 178px; font-size: 20px !important"><a-form-item style="margin-bottom: 10px"
            label="ISBN"><a-input style="width: 60%; margin-right: 13px" v-model:value="book.isbn"></a-input><a-button
              :onclick="isbnFill">Check</a-button> </a-form-item><a-form-item style="margin-bottom: 10px"
            label="Name"><a-input v-model:value="book.name"></a-input> </a-form-item><a-form-item
            style="margin-bottom: 10px" label="Author"><a-input v-model:value="book.author"></a-input>
          </a-form-item><a-form-item style="margin-bottom: 10px" label="Type"><a-select v-model:value="book.type"
              @change="changeType">
              <template v-for="item in typeList" :key="item">
                <a-select-option v-if="item != 'All'" :value="item">{{ item }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item style="margin-bottom: 0px" label="Info"><a-input v-model:value="book.info"></a-input>
          </a-form-item></a-form>
      </div>
    </div>
    <div class="padding bottom-box">
      <div style="width: 100%; padding-bottom: 20px" class="bottom-box">
        <div class="text">Location</div>
        <a-cascader v-model:value="book.location" :options="options" placeholder="Please select" />
      </div>
      <div class="bottom-box">
        <div class="text" style="padding-left: 30px">Inventory</div>
        <a-input-number :precision="0" :min="0" v-model:value="book.inventory"
          @change="(e: number) => (book.inventory = e)"></a-input-number>
      </div>
    </div>
    <div class="padding bottom-box">
      <a-button style="margin-right: 20px" @click="handleCancel">
        <CloseOutlined />Cancel
      </a-button>
      <a-button type="primary" @click="handleOk(bookDetail == undefined)">
        <CheckOutlined />OK
      </a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { PlusOutlined, LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { message, type UploadChangeParam } from 'ant-design-vue'
import type { BookModify, BookDetail, BackendResponse } from '@/types/type'
import { useAxios } from '@/stores/axios'
import { useClient } from '@/stores/client'
import type { AxiosResponse } from 'axios'
//引入message样式
import 'ant-design-vue/es/message/style/css'
import type { CascaderProps } from 'ant-design-vue'
defineProps<{
  typeList: string[]
}>()
const client = useClient()
//TODO-C: finish location and type selection
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
const picChanged = ref<boolean>(false)
const picName = ref<string>('')
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
  inventory: 0,
  cover: ''
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
//TODO: Check isbn
const isbnCheck = () => {
  /*方法1

(1) 用1分别乘书号的前12位中的奇数位, 用3乘以偶数位:(位数从左到右为13位到2位）
(2) 将各乘积相加，求出总和 ；
(3) 将总和除以10，得出余数；
(4) 将10减去余数后即为校验位。如相减后的数值为10,校验位则为0。*/
  let sum = 0
  for (let i = 0; i < 12; i++) {
    if (i % 2 == 0) {
      sum += parseInt(book.isbn[i]) * 1
    } else {
      sum += parseInt(book.isbn[i]) * 3
    }
  }
  let check = 10 - sum % 10
  //is 9787544766500 valid?

  if (check == parseInt(book.isbn[12])||check==10&&parseInt(book.isbn[12])==0) {
    return true
  } else {
    return false
  }
}
const isbnFill = () => {
  console.log(book.isbn)
  if (book.isbn.length != 13 || !isbnCheck()) {
    message.info('Invalid ISBN. ISBN should be 13 digits.')
    //ISBN format check

    return
  }
  // First get the book info.
  axios
    .get('https://isbn.dovetham.com/api/volumes?q=isbn:' + book.isbn)
    .then((e: AxiosResponse) => {
      let data = e.data
      if (data.totalItems != 0) {
        let item = data.items[0]
        console.log(item.volumeInfo.title)
        console.log(item.volumeInfo.authors[0])
        book.name = item.volumeInfo.title
        book.author = item.volumeInfo.authors[0]
      } else {
        message.info('We have not found the book with this isbn.')
      }
    })

  // Then the picture
  axios
    .get('https://isbn.dovetham.com/getimg.php?isbn=' + book.isbn)
    .then((e: AxiosResponse) => {
      book.cover = e.data.imgUrl
    })
    .catch(() => {
      book.cover = ''
    })
    .finally(async () => {
      console.log('Cover address is ' + book.cover)
      if (book.cover != '') {
        const img = new Image()
        img.src = book.cover
        img.crossOrigin = 'anonymous'
        //imgtoBlob
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0, img.width, img.height)
          //png or jpg
          let dataURL: string
          if (book.cover.indexOf('png') > 0) {
            dataURL = canvas.toDataURL('image/png')
          } else
            dataURL = canvas.toDataURL('image/jpeg')
          book.picObj = dataURL
        }

      }
    })
}

//TODO-C: Add Book info
//TODO-C: Change Book info
const handleOk = async (isAdd: boolean) => {
  if (picChanged.value) {
    await axios
      .post('/picture/upload', {
        data: book.picObj.substring(23),
        name: picName.value
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          book.cover = picName.value
        } else {
          message.info('Upload picture failed.')
        }
        book.cover = picName.value
        picChanged.value = !picChanged.value
        picName.value = ''
      })
      .catch(() => message.info('Pic not uploaded.'))
  }
  if (!isAdd) {
    console.log('change book')
    axios
      .post('/StaffOp/updateBook', {
        opUser: client.clientData.clientName,
        isbn: book.isbn,
        name: book.name,
        author: book.author,
        publisher: 'BenderBlog Record',
        summer: book.info,
        cover: book.cover,
        stock: String(book.inventory),
        category: String(book.type),
        price: String(book.price),
        location: book.location
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          message.info('change completed')
        } else {
          throw e.data.msg.content
        }
      })
      .catch((e: any) => {
        console.log(e)
        message.warning('change failed')
      })
  } else {
    console.log('add book')
    axios
      .post('/StaffOp/addBook', {
        opUser: client.clientData.clientName,
        isbn: book.isbn,
        name: book.name,
        author: book.author,
        publisher: 'BenderBlog Record',
        summary: book.info,
        cover: book.cover,
        stock: String(book.inventory),
        category: String(book.type),
        price: String(book.price),
        location: book.location
      })
      .then((e: AxiosResponse<BackendResponse>) => {
        if (e.data.status) {
          message.info('change completed')
        } else {
          throw e.data.msg.content
        }
      })
      .catch((e: any) => {
        console.log(e)
        message.warning('change failed')
      })
  }

  visible.value = false
}
const changeType = (t: string) => {
  book.type = t
}
const changePosition = (t: any) => {
  console.log(t)
  t.forEach((e: any) => {
    book.location.push(e.value)
  })
}
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading' && info.file.originFileObj != undefined) {
    getBase64(info.file.originFileObj, (base64Url: string) => {
      if (book != undefined) book.picObj = base64Url
      picChanged.value = true
      picName.value = info.file.name
      loading.value = false
    })
  }
  if (info.file.status === 'done' && info.file.originFileObj != undefined) {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      if (book != undefined) book.picObj = base64Url
      //.value = base64Url
      picChanged.value = true
      picName.value = info.file.name
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
      book.type = bookDetail.value.bookCategoryName
      book.info = bookDetail.value.bookSummary
      book.picObj = bookDetail.value.bookCover
      book.inventory = bookDetail.value.bookStock
      book.cover = bookDetail.value.bookCoverName
      console.log(book.name)
    } else {
      fileList.value = []
      book.name = ''
      book.author = ''
      book.isbn = ''
      book.info = ''
      book.picObj = ''
      book.cover = ''
      book.inventory = 0
    }
  }
)
</script>
<style>
.avatar-uploader>.ant-upload {
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
