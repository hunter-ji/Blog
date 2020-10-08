## 简述

当想为程序设定一个固定的窗口大小时候，需要限制用户对程序窗口的大小进行拖动调整。但是使用官方的设定时候，在mac平台上可以禁用调整，当在windows平台上时候却依然可以。所以为了兼容两者，可以选择使用无边框来实现。



## 官方文档

- `resizable` Boolean (optional) - Whether window is resizable. 默认值为 `true`。



## 实现

### mac

```javascript
win = new BrowserWindow({
  width: 800,
  height: 600,
  resizable: false
});
```



### windows

* 为了兼容，可选择都加上无边框

```javascript
win = new BrowserWindow({
  width: 800,
  height: 600,
  frame: false,
  resizable: false
});
```



## 参考文档

* [electron官方文档](https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions)