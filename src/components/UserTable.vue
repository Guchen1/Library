<template>
  <div>
    <a-table
      @change="resize"
      :columns="columns"
      :scroll="{ x: 'max-content', y: height - 310, visible: false }"
      :pagination="{ position: ['bottomCenter'], pageSize: 10 }"
      :data-source="data"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'selected'"
          ><div style="display: flex; justify-content: center">
            <a-checkbox
              :checked="checked(record)"
              @update:checked="check(record, $event)"
            ></a-checkbox></div
        ></template>
        <template v-else-if="column.key == 'role'">{{
          record.type == "user" ? "patron" : record.type
        }}</template>
        <template v-else-if="column.key == 'action'">
          <div class="action" style="display: flex; justify-content: space-between">
            <div class="action" style="display: inline-flex">
              <a-button @click="toRole(record, 'user')" v-if="record.type != 'user'"
                >To Patron</a-button
              >
              <a-button @click="toRole(record, 'staff')" v-if="record.type != 'staff'"
                >To Staff</a-button
              >
              <a-button @click="toRole(record, 'admin')" v-if="record.type != 'admin'"
                >To Admin</a-button
              >
              <a-button @click="toRole(record, 'super')" v-if="record.type != 'super'"
                >To Superuser</a-button
              >
            </div>
            <div style="display: inline-flex" class="action">
              <a-button style="display: inline-block" type="primary"
                >Change Password</a-button
              >
              <a-button style="display: inline-block" type="danger">Delete</a-button>
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useClient } from "@/stores/client";
import type { UserDetail } from "@/types/type";

const client = useClient();
const checkList = ref<UserDetail[]>([]);
const clearList = () => {
  checkList.value = [];
};
defineProps<{
  height: number;
}>();
const resize = () => {
  maxHeight.value = "unset";
  nextTick(() => {
    const a = document
      .getElementsByClassName("ant-table-body")[0]
      .getAttribute("style")
      ?.split(";")[1]
      .split(":")[1];
    const b = document.getElementsByClassName("ant-table-body")[0].clientHeight;
    //a转数字
    const c = Number(a?.split("px")[0]);
    if (c != undefined) {
      if (c - b >= 20) {
        maxHeight.value = b + 10 + "px";
      } else {
        maxHeight.value = c + "px";
      }
    }
  });
};
const maxHeight = ref<string>("");
onMounted(() => {
  window.addEventListener("resize", resize);
  resize();
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
});
const columns = [
  {
    title: "Selected",
    key: "selected",
    width: 87,
    fixed: "left",
  },
  {
    title: "Username",
    dataIndex: "name",
    key: "username",
    width: 150,
  },
  {
    title: "Role",
    key: "role",
    width: 80,
    filters: [
      {
        text: "Patron",
        value: "user",
      },
      {
        text: "Staff",
        value: "staff",
      },
      {
        text: "Admin",
        value: "admin",
      },
      {
        text: "Superuser",
        value: "super",
      },
    ],
    onFilter: (value: string, record: UserDetail) => record.type.indexOf(value) === 0,
  },
  {
    title: "Action",
    key: "action",
  },
];
const check = (record: UserDetail, e: boolean) => {
  if (e) {
    checkList.value.push(record);
  } else {
    checkList.value.splice(checkList.value.indexOf(record), 1);
  }
};
const toRole = (record: UserDetail, role: "user" | "staff" | "admin" | "super") => {
  data.value.forEach((item) => {
    //TODO: Finish toRole function
    if (item === record) {
      item.type = role;
    }
  });
};
const checked = computed({
  //可对setter和getter都传参的计算属性
  get: () => {
    return (record: UserDetail) => {
      //列表里有就返回true
      if (checkList.value.indexOf(record) != -1) {
        return true;
      } else {
        return false;
      }
    };
  },
  set: () => {},
});
const data = ref<UserDetail[]>([]);
for (let i = 0; i < 21; i++) {
  data.value.push({
    id: 1,
    name: "Chen",
    type: "admin",
  });
}
defineExpose({
  clearList,
  checkList,
});
</script>
<style scoped>
.action button {
  margin-right: 10px;
}
:deep(.ant-table-body) {
  height: v-bind("maxHeight");
}
</style>
