## 简述

窗口最小化或者关闭的情况下，进程未退出，需要通过系统托盘来查看，当然还需要托盘菜单。这里就用最简单的菜单实现，加上点击事件触发。



## 官方文档

```javascript
const { app, Menu, Tray } = require('electron')

let tray = null
app.whenReady().then(() => {
  tray = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
```



## 实现

```javascript
let tray = null;
app.whenReady().then(() => {
  const iconUrl =
        process.env.NODE_ENV === "development"
  ? path.join(__dirname, "../build/favicon.ico")
  : path.join(__dirname, "favicon.ico");
  tray = new Tray(nativeImage.createFromPath(iconUrl));

  let trayMenuTemplate = [
    {
      label: "显示/隐藏",
      click: function() {
        return win.isVisible() ? win.hide() : win.show();
      }
    },
    {
      label: "退出",
      click: function() {
        app.quit();
      }
    }
  ];
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setToolTip("kuari");
  tray.setContextMenu(contextMenu);
});
```



## 参考文档

* [官方文档](https://www.electronjs.org/docs/api/tray)