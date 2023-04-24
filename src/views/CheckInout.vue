<template>
  <div class="main">
    <div class="innerwrapper">
      <a-card ref="card" :bodyStyle="{ display: 'flex', alignItems: 'center' }" class="searchbar"
        ><div class="title">Search</div>
        <a-divider type="vertical" />
        <a-form
          @finish="onFinish"
          style="display: inline-flex; justify-content: center"
          layout="inline"
          :model="searchForm"
          ><a-form-item class="item"
            ><a-input v-model:value="searchForm.name" placeholder="Name" /></a-form-item
          ><a-form-item class="item"
            ><a-input v-model:value="searchForm.isbn" placeholder="ISBN" /></a-form-item
          ><a-form-item id="dateForm" class="item"
            ><a-date-picker v-model:value="searchForm.date" /></a-form-item
          ><a-form-item id="dateForm" class="item"
            ><a-input v-model:value="searchForm.time" placeholder="Length"
          /></a-form-item>
          <div>
            <a-button danger @click="ResetForm()">
              <template #icon><CloseOutlined /></template>Reset</a-button
            >
            <a-button type="primary" html-type="submit" style="margin-left: 10px">
              <template #icon><SearchOutlined /></template>Search</a-button
            >
          </div>
        </a-form>
      </a-card>
    </div>
    <BookTable :height="props.height" class="tableSet" ref="borrowtable" />
  </div>
</template>

<script setup lang="ts">
/** __vue_virtual_code_placeholder */
import type { Dayjs } from 'dayjs'
import BookTable from '@/components/BookTable.vue'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { reactive, ref, computed, onMounted } from 'vue'
import { useAxios } from '@/stores/axios'
import dayjs from 'dayjs'
const axios = useAxios().Axios
interface SearchForm {
  name: string
  isbn: string
  date: Dayjs | null
  time: number | null
}
const borrowtable = ref<null | InstanceType<typeof BookTable>>(null)
const card = ref()
const cardWidth = computed(() => {
  return card.value.$el.offsetWidth
})
const searchForm: SearchForm = reactive({
  name: '',
  isbn: '',
  date: null,
  time: null
})
onMounted(() => {
  console.log(card.value.$el.offsetWidth)
})
const props = defineProps<{
  width: number
  height: number
}>()
const ResetForm = () => {
  searchForm.name = ''
  searchForm.isbn = ''
  searchForm.date = null
  searchForm.time = null
}
const onFinish = () => {
  /*
  console.log(searchForm.time)
  axios.post('/managerop/bookBorrowInfo', {
    name: searchForm.name,
    date1: searchForm.date == null ? '' : searchForm.date.format('YYYY-MM-DD'),
    date2: searchForm.time == null ? '0' : String(searchForm.time),
    page: '1',
    num: '7'
  })
  */
  borrowtable.value?.search(
    searchForm.name,
    searchForm.isbn,
    searchForm.date == null ? '' : searchForm.date.format('YYYY-MM-DD'),
    searchForm.time == null ? '999' : String(searchForm.time)
  )
  //console.log('Success:', searchForm.date[0].format('YYYY-MM-DD'))
}
const computedWidth = computed(() => {
  return {
    first: props.width >= 1070 ? '0px' : '-14px',
    second: props.width >= 1070 ? '0px' : '-10px',
    third: props.width >= 1070 ? '0px' : '5px'
  }
})
</script>

<style scoped>
.main {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.searchbar {
  max-width: 1343px;
  height: 100px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
}
.title {
  font-size: 30px;
  font-weight: bold;
  display: inline-flex;
  margin-top: v-bind('computedWidth.first');
}
.item {
  margin-top: v-bind('computedWidth.second');
  margin-bottom: v-bind('computedWidth.third');
}
.innerwrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
@media screen and (max-width: 872px) {
  #dateForm {
    margin-top: 0px;
  }
}
.tableSet {
  width: v-bind('cardWidth+"px"');
  margin-top: 10px;
}
</style>
