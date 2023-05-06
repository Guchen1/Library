import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
interface ClientData {
  clientName: string
  clientType: string
}
export const useClient = defineStore('client', () => {
  const reload = ref<Function>(() => {})
  const state = ref('signin')
  const loggedIn = ref(window.localStorage.getItem('loggedin') === 'true')
  console.log(window.localStorage.getItem('loggedin'))
  const clientData: ClientData = reactive({
    clientName:
      window.localStorage.getItem('clientName') !== null
        ? window.localStorage.getItem('clientName')!
        : '',
    clientType:
      window.localStorage.getItem('clientType') !== null
        ? window.localStorage.getItem('clientType')!
        : ''
  })
  const login = (data: ClientData) => {
    loggedIn.value = true
    window.localStorage.setItem('loggedin', 'true')
    clientData.clientName = data.clientName
    window.localStorage.setItem('clientName', data.clientName)
    window.localStorage.setItem('clientType', data.clientType)
    clientData.clientType = data.clientType
  }
  const logout = () => {
    loggedIn.value = false
    window.localStorage.setItem('loggedin', 'false')
    window.localStorage.removeItem('clientName')
    window.localStorage.removeItem('clientType')
    clientData.clientName = ''
    clientData.clientType = ''
  }
  const isUser = computed(() => {
    return clientData.clientType === 'user' && loggedIn.value
  })
  const isAdmin = computed(() => {
    return clientData.clientType === 'manager' && loggedIn.value
  })
  const isStaff = computed(() => {
    return clientData.clientType === 'staff' && loggedIn.value
  })
  const isSuper = computed(() => {
    return clientData.clientType === 'super' && loggedIn.value
  })
  return { loggedIn, login, logout, isUser, isAdmin, clientData, isStaff, state, isSuper, reload }
})
