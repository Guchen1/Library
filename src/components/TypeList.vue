<template>
  <div>
    <c-scrollbar maxWidth="100%" direction="x" trigger="hover"
      ><div id="outBox" style="display: flex">
        <a-tag @click="switchSelected('All')" :class="{ deactived: !active('All') }" :color="'blue'"
          >All</a-tag
        >
        <TransitionGroup
          enter-active-class="animate__animated animate__fadeIn animate__faster"
          leave-active-class="animate__animated animate__fadeOut animate__faster"
        >
          <template v-for="(item, index) in list" :key="item">
            <a-tag
              v-if="item != 'All'"
              @click="switchSelected(item)"
              :class="{ deactived: !active(item) }"
              :color="colorlist[index % 7]"
              >{{ item
              }}<delete-outlined
                style="padding-left: 10px"
                @click.stop="del(item)"
                v-if="client.isStaff"
            /></a-tag>
          </template>
        </TransitionGroup>
        <a-tag
        v-if="client.isStaff"
          class="Pr"
          @click="inInput = true;$nextTick(() => addType.focus())"
          ><a-input
            @keyup.enter="save"
            @blur="inInput = false;newType = ''"
            @keyup.esc="inInput = false;newType = ''"
            ref="addType"
            style="
              border: 0px !important;
              box-shadow: none;
              background: rgb(250, 250, 250);
              width: 130px;
            "
            v-model:value="newType"
            v-if="inInput"
          ></a-input>
          <div v-else>Add New Type<plus-outlined style="padding-left: 10px" /></div
        ></a-tag>
      </div>
    </c-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'
import { useClient } from '@/stores/client'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
const client = useClient()
const props = defineProps({
  selected: {
    type: Array<String>,
    default: []
  }
})
const colorlist = ['blue', 'pink', 'red', 'orange', 'green', 'cyan', 'purple']
const emit = defineEmits(['update:selected'])
const inInput = ref(false)
const newType = ref('')
const addType = ref()
const temp = ref(props.selected)
//TODO: get from database
const list = ref([
  'All',
  'Magazine',
  'Biography',
  'Novel',
  'Science',
  'History',
  'Literature',
  'Fantasy',
  'Others'
])
defineExpose({
  list
})
temp.value = JSON.parse(JSON.stringify(list.value))
emit('update:selected', temp.value)
const active = (item: string) => {
  return temp.value.includes(item)
}
const save = () => {
  if (inInput.value) {
    if (newType.value != '') {
      if (list.value.includes(newType.value)) {
        message.error('Type already exists')
      } else {
        list.value.push(newType.value)
        temp.value.push(newType.value)
        //TODO: save to database
        emit('update:selected', temp.value)
        inInput.value = false
        newType.value = ''
      }
    } else {
      message.error('Type cannot be empty')
    }
  }
}
const switchSelected = (item: string) => {
  if (item == 'All' && temp.value.length != list.value.length) {
    temp.value = JSON.parse(JSON.stringify(list.value))
    emit('update:selected', temp.value)
    return
  } else if (item == 'All' && temp.value.length == list.value.length) {
    temp.value = []
    emit('update:selected', temp.value)
    return
  }
  if (temp.value.includes(item)) {
    if (temp.value.includes('All')) temp.value.splice(temp.value.indexOf('All'), 1)
    // Remove
    temp.value.splice(temp.value.indexOf(item), 1)
    if (temp.value.length == list.value.length - 1) temp.value.push('All')
  } else {
    temp.value.push(item)
    if (temp.value.length == list.value.length - 1) temp.value.push('All')
  }

  emit('update:selected', temp.value)
}
const del = (item: string) => {
  list.value.splice(list.value.indexOf(item), 1)
  //TODO: delete from database
  if (temp.value.includes(item)) {
    switchSelected(item)
  } else if (temp.value.length == list.value.length - 1) temp.value.push('All')
}
watch(props.selected, (newVal: String[]) => {
  temp.value = newVal
})
</script>
<style scoped>
#outBox :deep(.ant-tag) {
  height: 30px;
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  font-size: 16px;
  padding: 20px;
  cursor: pointer;
}
#outBox :deep(.ant-tag).deactived {
  background-color: white;
}
.Pr[ant-click-animating-without-extra-node]:active {
  animation: none 0 ease 0 1 normal !important;
  box-shadow: none;
}
</style>
