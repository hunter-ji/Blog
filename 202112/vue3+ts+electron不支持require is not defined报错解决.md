## 报错

在使用vue3+typescript+electron开发时，遇到一个报错为：

```bash
Uncaught ReferenceError: require is not defined
```

点进去是`module.exports = require("events")`，并不是自己的代码中的`require`，因此无法改变写法只能让项目去支持它。



## 解决

在electron的配置文件中，新增或者修改如下配置：

```javascript
webPreferences: {
  // ...
  contextIsolation: false,
  nodeIntegration: true
}
```



## 参考文档

* [Electron/Tedious: require("events") is not defined](https://stackoverflow.com/questions/64706829/electron-tedious-requireevents-is-not-defined)

