<script setup lang="ts">
import type {BookDetail} from '@/types/type'
const props=defineProps<{
  book:BookDetail
}>()

</script>

<template>
  <a-card class="card">
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
      <p>
        <a-badge :status="props.book.situation ? 'success' : 'error'" />{{
          props.book.situation ? 'In the library' : 'borrowed'
        }}
      </p>
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
  height: 95%;
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
  height: 5%;
  justify-content: center;
  display: flex;
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
