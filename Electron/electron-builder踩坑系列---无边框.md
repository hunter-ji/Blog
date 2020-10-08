## 简述

虽然并非出于直接实现无边框的需求，但是为了实现窗口的固定大小（设置固定值不可调整情况下，mac是没问题的，但是windows一直可以调整大小）而设置了无边框。



## 官方文档

```javascript
const { BrowserWindow } = require('electron')
let win = new BrowserWindow({ width: 800, height: 600, frame: false })
win.show()
```



## 实现

```javascript
// background.js

win = new BrowserWindow({
  width: 800,
  height: 600,
  frame: false
});
```



## 参考文档

* [官方文档](https://www.electronjs.org/docs/api/frameless-window)