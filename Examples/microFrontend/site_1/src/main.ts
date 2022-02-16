import './public-path'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import store from './store'

let router = null
let instance: any = null
let history: any = null

function render (props = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { container } = props
  // history = createWebHistory(process.env.BASE_URL)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/site1' : '/')
  router = createRouter({
    history,
    routes
  })

  instance = createApp(App)
  instance.use(router)
  instance.use(store)
  instance.mount(container ? container.querySelector('#app') : '#app')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export const bootstrap = async (): Promise<void> => {
  console.log('%c ', 'color: green ', 'vue3.0 app bootstraped')
}

const storeTest = (props: any): void => {
  props.onGlobalStateChange &&
  props.onGlobalStateChange(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
    true
  )
  props.setGlobalState &&
  props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name
    }
  })
}

export const mount = async (props: any): Promise<void> => {
  storeTest(props)
  render(props)
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange
  instance.config.globalProperties.$setGlobalState = props.setGlobalState
}

export const unmount = async (): Promise<void> => {
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
  router = null
  history.destroy()
}
