import { registerMicroApps, start } from 'qiankun'
import apps from './apps'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 子节点加载前
  beforeLoad: (app: any) => {
    NProgress.start() // 开始进度条
    return Promise.resolve()
  },
  // qiankun 生命周期钩子 - 子节点挂载后
  afterMount: (app: any) => {
    NProgress.done() // 进度条结束
    return Promise.resolve()
  }
})

export default start
