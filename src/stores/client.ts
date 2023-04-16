import { ref,reactive,computed } from 'vue'
import { defineStore } from 'pinia'
interface ClientData {
    clientName: string,
    clientType: string,
}
export const useClient = defineStore('client', () => {
    const loggedIn = ref(window.localStorage.getItem('loggedin')==='true')
    console.log(window.localStorage.getItem('loggedin'))
    const clientData= reactive({
        clientName: window.localStorage.getItem('clientName'),
        clientType: 'user',
    })
    const login = (data:ClientData) => {
        loggedIn.value = true
        window.localStorage.setItem('loggedin','true')
        clientData.clientName = data.clientName
        window.localStorage.setItem('clientName',data.clientName)
        window.localStorage.setItem('clientType',data.clientType)
        clientData.clientType = data.clientType
    }
    const logout = () => {
        loggedIn.value = false
        window.localStorage.setItem('loggedin','false')
        clientData.clientName = ''
        clientData.clientType = 'user'
    }
    const isUser = computed(() => {
        return clientData.clientType === 'user'&&loggedIn.value
    })
    const isAdmin= computed(() => {
        return clientData.clientType === 'admin'&&loggedIn.value
    })
    return { loggedIn,login,logout,isUser,isAdmin,clientData }
})