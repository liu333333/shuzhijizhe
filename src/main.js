import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { registerStore } from './store'
import piniaPersist from 'pinia-plugin-persist'
const store = createPinia()
store.use(piniaPersist)

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
// 注册 Pinia
registerStore()
app.mount('#app')