import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAxios = defineStore('axios', () => {
  const Axios = ref()
  const urlAlter = ref('https://spm.guchen.work:8848')
  const serverUrl = ref('https://library.superbart.xyz')
  Axios.value = axios.create({
    baseURL: 'https://spm.guchen.work:8433'
    // withCredentials:true,
  })

  return { Axios, serverUrl, urlAlter }
})
