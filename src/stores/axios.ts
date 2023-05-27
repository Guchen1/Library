import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAxios = defineStore('axios', () => {
  const Axios = ref()
  const serverUrl = ref('https://library.superbart.xyz')
  Axios.value = axios.create({
    baseURL: 'https://server.superbart.xyz:8433'
    // withCredentials:true,
  })

  return { Axios, serverUrl }
})
