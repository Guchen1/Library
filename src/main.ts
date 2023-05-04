import { createApp } from 'vue'
import { createPinia } from 'pinia'
import CScrollbar from 'c-scrollbar';
import 'animate.css';
import App from './App.vue'
import router from './router'


const app = createApp(App)
app.use(CScrollbar)
app.use(createPinia())
app.use(router)

app.mount('#app')
