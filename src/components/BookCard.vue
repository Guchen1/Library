<script setup lang="ts">
import { ref, reactive } from 'vue'
interface BookDetail {
  name: string
  author: string
  isbn: string
  info: string
  situation: boolean
  picAdd: string
}

const a: BookDetail = reactive({
  name: 'Fresh Cream',
  author: 'Cream',
  isbn: 'T4988 005 00760 5',
  info: 'Cream debut album released in 1967, featuring I Feel Free.',
  situation: true,
  picAdd:
    'https://i.discogs.com/-MFOcWZEds4m0aIBEwrdBZYVLItKac3trqugpxK5YoA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3NTE4/ODMtMTUzODEyOTkx/My0zNDkxLmpwZWc.jpeg'
})
</script>

<template>
  <a-card class="card">
    <div class="upper">
      <div class="uLeft">
        <img alt="example" :src="a.picAdd" />
      </div>
      <div class="uRight">
        <div>
          <div>bookName: {{ a.name }}</div>
          <div>author: {{ a.author }}</div>
          <div>isbn: {{ a.isbn }}</div>
          <div>info: {{ a.info }}</div>
        </div>
      </div>
    </div>
    <div class="lower">
      <p>
        <a-badge :status="a.situation ? 'success' : 'error'" />{{
          a.situation ? 'In the library' : 'borrowed'
        }}
      </p>
    </div>
  </a-card>
</template>

<style scoped>
.card {
  flex-wrap: wrap;
  border-radius: 15px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.card .upper {
  height: 95%;
  display: flex;
}

.card .upper .uLeft {
  width: 40%;
  align-items: flex-start;
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
  max-width: 110px;
  border-radius: 10px;
}
</style>
