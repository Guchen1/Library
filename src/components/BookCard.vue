<script setup lang="ts">
import type {BookDetail} from '@/types/type'
import { useClient } from '@/stores/client';
const client = useClient()

const props=defineProps<{
  book:BookDetail
}>()

const emits=defineEmits<{
  (e: 'show',a:BookDetail['id']): void
}>()
const del=(id:BookDetail['id'])=>{
  //TODO: delete book
}
</script>

<template>
  <a-card :bodyStyle="{height:'100%'}" class="card">
    <div class="upper">
      <div class="uLeft">
        <img alt="example" :src="props.book.picAdd" />
      </div>
      <div class="uRight">
        <div>
          <div>bookName: {{ props.book.name }}</div>
          <div>author: {{ props.book.author }}</div>
          <div>isbn: {{ props.book.isbn }}</div>
          <div>info: {{ props.book.info }}</div>
        </div>
      </div>
    </div>
    <div class="lower">
      <p v-if="!client.isAdmin">
        <a-badge :status="props.book.situation ? 'success' : 'error'" />{{
          props.book.situation ? 'In the library' : 'borrowed'
        }}
      </p>
      <div v-else >
        <a-button
        style="margin-right:20px"
          danger
          @click="del(props.book.id)">Withdraw</a-button>
        <a-button
          style="border-color: #52c41a;color:#52c41a;background-color: #F6FFED;"
          @click="emits('show',props.book.id)">Change Info</a-button>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.card {
  flex-wrap: wrap;
  border-radius: 12px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.card .upper {
  height: 80%;
  display: flex;
}

.card .upper .uLeft {
  width: 40%;
  align-items: center;
  display: inline-flex;

}

.card .upper .uRight {
  width: 60%;
  height: 100%;
  display: inline-flex;
}

.card .lower {
  height: 20%;
  justify-content: center;
  display: flex;
  padding-bottom: 10px;
}
p {
  margin: 0px;
  padding-top: 10px;
  margin-bottom: -10px;
}
img {
  width:80%;
  border-radius: 10px;
}
</style>
