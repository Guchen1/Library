<script setup lang="ts">
import BookCard from '@/components/BookCard.vue';
</script>

<template>
      <a-row :gutter="[3, 3]">

        <a-col
          v-for="item in 3"
          :key="item.toString()"
          :span="24 / 3"
        >
          <div><BookCard/></div>
        </a-col>
      </a-row>
</template>



<style scoped></style>