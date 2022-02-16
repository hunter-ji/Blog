import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { registerMicroApps, start } from 'qiankun'

const apps: any[] = [
  {
    name: 'site1', // 应用的名字
    entry: 'http://localhost:9001/', // 默认加载这个html，解析里面的js动态的执行（子应用必须支持跨域，内部使用的是 fetch）
    container: '#site1', // 要渲染到的节点id
    activeRule: '/site1' // 访问子节点路由
  }
  // {
  //   name: 'site2',
  //   entry: 'http://localhost:9002/',
  //   container: '#site2',
  //   activeRule: '/site2'
  // }
]

registerMicroApps(apps) // 注册应用
start() // 开启应用

createApp(App).use(store).use(router).mount('#app')
