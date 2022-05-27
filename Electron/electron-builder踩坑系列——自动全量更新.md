## 一. 前言

最近完成一个 Redis GUI Client开源项目——[RedFish](https://github.com/Kuari/RedFish)，经过了漫长的开发期，最后在准备上线`v 1.0.0`的时候，发现跨平台打包和自动化更新还挺麻烦的。当然打包这事儿吧，我再挖个坑......以及自动化更新也是个大坑，以及之前做了一个项目，期间经历了N多种更新方案（甲方那无处安放的需求...），包括electron的全量更新，electron-builder的全量更新 ，也做了局部更新等等，再再挖个坑吧。

这次我先记录下最近用的这个`electron-builder`的`auto update`。由于是开源项目，项目中我用的是github releases发布版本的，所以当时选择方案时候尽可能原生支持github。此文中也会介绍怎么使用自定义服务器进行更新。



## 二. 环境

* **Node**: 16.13.0
* **electron**: 13.0
* **electron-builder**: 23.0.3
* **electron-updater**: 5.0.1



## 三. 官方示例

**官网文档**: [auto-update](https://www.electron.build/auto-update.html)

主要代码如下：

```typescript
import { autoUpdater } from "electron-updater"

export default class AppUpdater {
  constructor() {
    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}
```

哇喔，看上去整体就很简单！



## 四. 具体实现

### 1. 安装

```bash
# npm
npm install electron-updater
# yarn
yarn add electron-updater
```

### 2. 配置publish

### github

```json
"build": {
    "publish": {
        "provider": "github",
        "owner": "Kuari",
        "repo": "RedFish"
    }
}
```

### 自定义服务器

```json
"build": {
    "publish": {
        "provider": "generic",
        "url": "http://your-domain.com/update"
    }
}
```

### 3. 开启自动化更新

 可以看到官方代码中，引入了一个electron的日志的库。该库其实个人建议是非常必要的，其将自动更新的功能的检测、下载、更新等流程日志全部存储起来，方便你去进行排错。前段时间我就遇到一个事情，之前做的一个项目突然找到我，说版本升级有问题，虽然那个项目做的是做的增量更新，但是我有日志啊，直接从目标电脑拿到日志，告诉甲方是什么原因导致的，更新功能本身没有问题，应该如何避免这类问题等等。

如其名`checkForUpdatesAndNotify`所言，自动化更新时候会去检测版本，然后更新和通知。其更新方式是静默更新，打开客户端时去检测版本，需要更新时，会下载更新的包，然后在用户关闭客户端后进行更新和通知。

#### 不使用日志，开启自动化更新

配置`background.js`文件

```javascript
import { autoUpdater } from 'electron-updater'

// ...

async function createWindow () {
	// ...
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // ...
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
    // 加入此行，开启自动化更新
    await autoUpdater.checkForUpdatesAndNotify()
  }
}

// ...
```

 #### 使用日志，开启自动化更新

首先先安装日志所需要的库

```bash
# npm
npm install elecrton-log
# yarn
yarn add electron-log
```

然后配置`background.js`文件

```javascript
import { autoUpdater } from 'electron-updater'

// ...

async function createWindow () {
	// ...
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // ...
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
    // 加入此行，开启自动化更新
    log.transports.file.level = 'debug'
    autoUpdater.logger = log
    await autoUpdater.checkForUpdatesAndNotify()
  }
}

// ...
```

至于日志位置，就是`electron-log`本身使用的日志位置了，其路径如下：

- **on Linux:** `~/.config/{app name}/logs/{process type}.log`
- **on macOS:** `~/Library/Logs/{app name}/{process type}.log`
- **on Windows:** `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`



### 4. 配置更新服务端

那么一个很关键的问题在于，如何配置服务端让客户端知道它要更新呢？在配置了`publish`参数以后，electron打包文件内会携带一个`latest.yml`文件，其名字会根据不同打包方式和平台等或有所不同，比如`latest-mac.yml`。

我们打开`latest.yml`，可以看到几个文件，其它参数我们目前暂且可以不用管，那是autoUpdater处理的。内包含的几个文件在打包后的文件夹内都能找到，我们只需要在服务端把`latest.yml`和其内涉及的几个文件全都放到服务端即可。放上去之后，当我们打开客户端，即可触发自动化检测。

但是如何触发版本更新呢？那也是简单的，就是修改`package.json`内的`version`参数，当服务端的`version`高于客户端时，便会触发自动化更新。在配置了`publish`参数后，除了`latest.yml`文件，客户端内也会有一个更新配置文件，内置打包时的版本号。



### 5. 更新失败

更新可能不那么一帆风顺，所以如果遇到报错，我们可以打开上述的日志文件，看看到底是哪一步报错了，然后根据相关报错进行排错和调整。



## 五. 报错

`electron`升级到当前最新版（13.0.0），却在mac上打包时报错，报错内容如下：

```
Exit code: ENOENT. spawn /usr/bin/python ENOENT
```

 该问题是由于mac系统升级后默认`python`命令是指向`python3`的，但是`vue-cli-plugin-electron-builder`是要求`python2`的，但是`electron-builder`是支持的，所以此处指定其使用`electron-builder v23.0.3`版本。

网上还有另一种解决方案就是将`python`重新指向`python2`，这种方案对于系统来说侵入性太强。我也考虑过起一个python2的docker continer然后临时指向，但是这样每次写代码还要设置下环境就很麻烦。

总体来说，还是觉得指定版本是最方便了。

解决方案就是在`package.json`中添加如下：

```json
{
  // ...
  "resolutions": {
    "vue-cli-plugin-electron-builder/electron-builder": "^23.0.3"
  }
  // ...
}
```



## 六. 结语

整体来说，使用electron-builder的auto update配置还是比较简单的。但是自动化更新离不开的一点就是打包，打包涉及的问题还是挺多的，比如Mac平台涉及intel和M1两个包，还有打包需要掏钱买开发者资格获取证书然后签名等，后期文章慢慢跟大家分享吧。

推荐两个参考项目，有需要可以看一看：

* [electron-builder官方demo github仓库](https://github.com/iffy/electron-updater-example)
* 我自己的Redis GUI Client开源项目——[RedFish项目](https://github.com/Kuari/RedFish/releases/tag/v1.0.0)，由于证书问题，目前已经完成了Mac平台的自动化更新，包含Intel和M1（心疼ing...)

