<template>
  <div class="main">
    <BookSearch :search-func="search" />
    <div style="width: 100%; padding-top: 10px; display: flex; justify-content: center">
      <a-popover
        placement="bottom"
        v-model:visible="visibleA"
        title="Please input patron name"
        trigger="click"
      >
        <template #content>
          <a-input v-model:value="batchName"></a-input
          ><a-button style="display: inline-block">Submit</a-button>
        </template>
        <a-button :disabled="!allBorrowable" class="batch">Batch Check Out</a-button>
      </a-popover>
      <a-button :disabled="!allReturnable" class="batch">Batch Return</a-button
      ><a-button :disabled="!allRenewable" class="batch">Batch Renew</a-button>
      <a-popover
        placement="bottom"
        v-model:visible="visibleB"
        title="Create a Patron"
        trigger="click"
      >
        <template #content>
          <div style="display: flex; flex-direction: column">
            <div>Username: <a-input class="" v-model:value="paName"></a-input></div>
            <div>Password: <a-input v-model:value="paPass"></a-input></div>
            <div style="width: 100%; justify-content: end; display: flex">
              <a-button
                type="primary"
                style="width: 40%; margin-top: 5px; justify-self: end"
                >Submit</a-button
              >
            </div>
          </div>
        </template>
        <a-button class="batch"> Create a Patron</a-button>
      </a-popover>
    </div>
    <BookTable
      :width="width"
      ref="table"
      :type="'staff'"
      :height="props.height"
      class="tableSet"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import BookTable from "@/components/BookTable.vue";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useAxios } from "@/stores/axios";
import BookSearch from "@/components/BookSearch.vue";
const axios = useAxios().Axios;
const visibleA = ref(false);
const visibleB = ref(false);
const batchName = ref("");
const paName = ref("");
const paPass = ref("");
interface SearchForm {
  name: string;
  isbn: string;
  date: Array<Dayjs>;
}
const search = () => {
  //TODO: Finish search function
};
const table = ref<typeof BookTable>();
const searchForm: SearchForm = reactive({
  name: "",
  isbn: "",
  date: [],
});
const props = defineProps<{
  width: number;
  height: number;
}>();
const ResetForm = () => {
  searchForm.name = "";
  searchForm.isbn = "";
  searchForm.date = [];
};
const onFinish = () => {
  axios.post("/managerop/bookBorrowInfo", {
    name: searchForm.name,
    isbn: searchForm.isbn,
    date: searchForm.date,
  });
  console.log("Success:");
  console.log("Success:", searchForm.date[0].format("YYYY-MM-DD"));
};
const computedWidth = computed(() => {
  return {
    first: props.width >= 1070 ? "0px" : "-14px",
    second: props.width >= 1070 ? "0px" : "-10px",
    third: props.width >= 1070 ? "0px" : "5px",
  };
});
const allBorrowable = computed(() => {
  //遍历查看是否选中的均可借阅
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (table.value?.currentList[i].status != "available") {
      return false;
    }
  }
  if (table.value?.currentList.length == 0) {
    return false;
  }
  return true;
});
const allRenewable = computed(() => {
  //遍历查看是否选中的均可续借
  let res = true;
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (!table.value?.currentList[i].renewable) {
      res = false;
    }
  }
  if (table.value?.currentList.length == 0) {
    res = false;
  }
  return res;
});
const allReturnable = computed(() => {
  //遍历查看是否选中的均可归还
  for (let i = 0; i < table.value?.currentList.length; i++) {
    if (
      table.value?.currentList[i].status != "borrowed" &&
      table.value?.currentList[i].status != "overdue" &&
      table.value?.currentList[i].status != "renewed"
    ) {
      return false;
    }
  }
  if (table.value?.currentList.length == 0) {
    return false;
  }
  return true;
});
const clearList = computed(() => {
  return table?.value?.clearList;
});
onMounted(() => {});
defineExpose({
  clearList,
});
watch(visibleA, () => {
  batchName.value = "";
  paName.value = "";
  paPass.value = "";
});
watch(visibleB, () => {
  batchName.value = "";
  paName.value = "";
  paPass.value = "";
});
</script>

<style scoped>
.main {
  padding: 20px;
  width: 100%;
  height: 100%;
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
  margin-top: v-bind("computedWidth.first");
}

.item {
  margin-top: v-bind("computedWidth.second");
  margin-bottom: v-bind("computedWidth.third");
}

@media screen and (max-width: 872px) {
  #dateForm {
    margin-top: 0px;
  }
}

.tableSet {
  margin-top: 10px;
}
.batch {
  margin-right: 10px;
}
</style>
