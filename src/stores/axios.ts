import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAxios = defineStore('axios', () => {
  const Axios = ref()
  Axios.value = axios.create({
    baseURL: 'http://localhost:8080',
   // withCredentials:true,
  })

  return { Axios }
})
