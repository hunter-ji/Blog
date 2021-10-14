## 一. 简介

首先，介绍下`vite`和`Electron`。

* Vite是一种新型前端构建工具，能够显著提升前端开发体验。由尤大推出，其发动态表示“再也回不去webpack了...”
* Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入Chromium和Node.js到二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验。



当开始想用vue去开发一个桌面应用时，首先去搜索下，了解到当前如下两种现成方案：

* **electron-vue**： 该项目集成度较好，封装较为完整，中文搜索下来文章较多也是该方案，可以直接上手去使用。但是，问题在于其内置electron的版本太低，写文章时看到的版本是2.0.4，而最新的electron版本是15.1.2。
* **Vue CLI Plugin Electron Builder**： 该方案是集成到到`vue-cli`中使用，使用`vue add electron-builder`后可直接上手，免去了基础配置的步骤。但是其只能在`vue-cli`下使用，无法配合`vite`来使用。



因此，若要使用`vite`和`electron`，还需要自己来配置。



## 二. 创建一个Vite项目

### 1. 安装 vite

```bash
yarn create vite
```

### 2. 创建项目

创建命令如下：

```bash
yarn create vite <your-vue-app-name> --template vue
```

此处创建一个项目，名为kuari。

```bash
yarn create vite kuari --template vue
```

### 3. 进入且运行

进入项目，在运行前需要先安装下依赖。

```bash
cd kuari
yarn install
yarn dev
```

在运行命令敲下的一瞬间，几乎是已经在运行了，不愧是vite。此时按照输出，打开地址预览，即可看到初始化页面。

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gveqwmm4eij61bc0u03zy02.jpg" alt="截屏2021-10-14 下午12.50.48" style="zoom:50%;" />

至此一个基础的vite项目创建完成。



## 三. 配置Electron

### 1. 官方文档

在[Electron官网的快速入门文档](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)中，有官方给出的利用html、javascript、css来创建一个electron应用的案例，vite+electron的方案也借鉴其中。



### 2. 安装

首先安装electron至vite应用。目前electron的版本为`^15.1.2,`。

```bash
yarn add --dev electron
```



### 3. 配置文件

#### 1）vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' 										// 新增

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, './dist/'),	// 新增
  plugins: [vue()]
})
```



#### 2）main.js

创建一个新的文件`main.js`，需要注意的是，该内容中`index.html`的加载路径跟electron官网给的配置不同。

```javascript
// main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  mainWindow.loadFile('dist/index.html') // 此处跟electron官网路径不同，需要注意

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
```



#### 3）preload.js

创建一个新的文件`preload.js`。

```javascript
// preload.js

// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```



#### 4）package.json

为了确保能够运行相关electron的命令，需要修改`package.json`文件。

首先需要去设置`main`属性，electron默认会去在开始时寻找项目根目录下的`index.js`文件，此处我们使用的是`main.js`，所以需要去定义下。

```json
// package.json

{
  "name": "kuari",
  "version": "0.0.0",
  "main": "main.js", 			// 新增
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.16"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.9.3",
    "electron": "^15.1.2",
    "vite": "^2.6.4"
  }
}

```

最后我们需要新增electron的运行命令。

```json
// package.json

{
  "name": "kuari",
  "version": "0.0.0",
  "main": "main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "electron:serve": "electron ." // 新增
  },
  "dependencies": {
    "vue": "^3.2.16"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.9.3",
    "electron": "^15.1.2",
    "vite": "^2.6.4"
  }
}
```



## 四. 运行

直接在终端输入如下命令：

```bash
yarn electron:serve
```

接着我们就可以看到我们桌面应用就出来咯！

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gves3xrayzj612f0u0myy02.jpg" alt="截屏2021-10-14 下午1.32.38" style="zoom:50%;" />



## 五. 最后

之前做项目一直用的Vue CLI Plugin Electron Builder，这次有个项目先用electron开发一下，推一波看看，后期看情况swift重新开发一个mac的桌面应用。也刚好尝尝鲜，一直没有机会试试vite。

electron这个东东确实很方便，就是打包出来的应用体积太大，真的是硬伤啊。这次目标人群首先是windows用户，所以上electron吧！



## 六. 参考文档

* [Electron官网快速入门](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
* [Vite官网](https://vitejs.dev/)
* [Build vue3 desktop apps in just 5 minutes](https://learnvue.co/2021/05/build-vue-3-desktop-apps-in-just-5-minutes-vite-electron-quick-start-guide/)

