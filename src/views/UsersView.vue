<template>
  <div
    v-if="client.isAdmin"
    style="padding-top: 20px; padding: 20px; padding-bottom: 0px"
  >
    <a-typography-title :level="2" class="title">User Control</a-typography-title>
    <div class="batch-box">
      <a-input-search style="width: 400px" placeholder="Input Username">
        <template #enterButton>
          <a-button type="primary">
            <template #icon> <SearchOutlined /> </template>Search</a-button
          >
        </template>
      </a-input-search>
    </div>
    <div class="batch-box">
      <a-button @click="toRole('staff')" class="batch">To Staff</a-button
      ><a-button @click="toRole('user')" class="batch">To Patron</a-button>
      <a-button @click="toRole('super')" class="batch">To Superuser</a-button>
      <a-button @click="toRole('admin')" class="batch">To Admin</a-button>
      <a-button @click="del" class="batch" type="danger">Delete</a-button>
    </div>
    <div style="display: flex; justify-content: center">
      <UserTable ref="table" :height="height" style="max-width: 1000px; width: 100%" />
    </div>
  </div>
  <div v-else></div>
</template>
<script setup lang="ts">
import UserTable from "@/components/UserTable.vue";
import { useClient } from "@/stores/client";
import type { UserDetail } from "@/types/type";
import { SearchOutlined } from "@ant-design/icons-vue";
import { computed, onMounted, ref } from "vue";
const table = ref<typeof UserTable>();
const clearList = computed(() => {
  return table?.value?.clearList;
});
const toRole = (role: string) => {
  //TODO: Finish toRole function,更新成功之后刷新页面
  console.log(table?.value?.checkList); //这里是选中的列表;
  client.reload(); //这行就是刷新的
};
const del = () => {
  //TODO: Finish del function,成功之后刷新页面
};
defineProps<{
  width: number;
  height: number;
}>();
defineExpose({
  clearList,
});
const client = useClient();
</script>
<style scoped>
.title {
  width: 100%;
  text-align: center;
}
.batch {
  margin-right: 10px;
}
.batch-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
