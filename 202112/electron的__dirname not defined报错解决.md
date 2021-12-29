## 报错

在使用vue cli plugin electron builder开发项目，用到涉及node相关的功能，比如`fs`、`path`，出现报错`__dirname not defined `。



## 解决

该问题在于需要开启electron对于node操作的支持。

### 1. 安装@types/node

```bash
yarn add @types/node -D
```

### 2. 修改配置

修改electron的配置文件，此处我的配置文件为`src/background.ts`

```javascript
webPreferences: {
	// ...
  nodeIntegration: true,
  nodeIntegrationInWorker: true
}
```

