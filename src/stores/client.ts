import { ref,reactive,computed } from 'vue'
import { defineStore } from 'pinia'
interface ClientData {
    clientName: string,
    clientType: string,
}
export const useClient = defineStore('client', () => {
    
    const loggedIn = ref(false)
    const clientData= reactive({
        clientName: '',
        clientType: 'admin',
    })
    const login = (data:ClientData) => {
        loggedIn.value = true
        clientData.clientName = data.clientName
        clientData.clientType = data.clientType
    }
    const logout = () => {
        loggedIn.value = false
        clientData.clientName = ''
        clientData.clientType = ''
    }
    const isUser = computed(() => {
        return clientData.clientType === 'user'&&loggedIn.value
    })
    const isAdmin= computed(() => {
        return clientData.clientType === 'admin'&&loggedIn.value
    })
    return { loggedIn,login,logout,isUser,isAdmin,clientData }
})