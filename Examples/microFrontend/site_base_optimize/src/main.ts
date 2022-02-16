import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import start from './childNodes'

start() // 开启应用

createApp(App).use(store).use(router).mount('#app')
