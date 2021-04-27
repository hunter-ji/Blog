## 简介

一直觉得毛玻璃样式很炫，而要在`electron`中实现，本来是需要自己去写样式的，我在开发之前也去了解了下，想看看有没有大佬已经实现了，不过确实发现了一个[大佬的仓库](https://github.com/arkenthera/electron-vibrancy)分享了毛玻璃组件，但是其README也提到了官方仓库对于[mac的毛玻璃效果的pr](https://github.com/electron/electron/pull/7898)，然后我去找了官方文档，已经有相关属性了，就很妙啊！

但是为什么标题要写“mac下”下呢，因为这个属性只对mac有效。（打工人落泪...）



## 官方文档

### 文档地址

[https://www.electronjs.org/docs/api/browser-window](https://www.electronjs.org/docs/api/browser-window)

### 相关属性

- `vibrancy` String (可选) - 窗口是否使用 vibrancy 动态效果, 仅 macOS 中有效. Can be `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`, `sidebar`, `medium-light`, `ultra-dark`, `header`, `sheet`, `window`, `hud`, `fullscreen-ui`, `tooltip`, `content`, `under-window`, or `under-page`. Please note that using `frame: false` in combination with a vibrancy value requires that you use a non-default `titleBarStyle` as well. Also note that `appearance-based`, `light`, `dark`, `medium-light`, and `ultra-dark` have been deprecated and will be removed in an upcoming version of macOS.

- `visualEffectState`String (optional) - Specify how the material appearance should reflect window activity state on macOS. Must be used with the`vibrancy`property. 可能的值有
  - `followWindow` - 当窗口处于激活状态时，后台应自动显示为激活状态，当窗口处于非激活状态时，后台应自动显示为非激活状态。 This is the default.
  - `active` - 后台应一直显示为激活状态。
  - `inactive` - 后台应一直显示为非激活状态。



## 实现

有了官方Buff加持，使起来就很方便了。

```javascript
// background.js

let win = new BrowserWindow({
  width: 800,
  height: 600,
  vibrancy: 'dark',  // 'light', 'medium-light' etc
  visualEffectState: "active" // 这个参数不加的话，鼠标离开应用程序其背景就会变成白色
})
```

实现就是这么简单！

小伙伴儿们有兴趣的可以参考下我[这个项目](https://github.com/Kuari/QingKe)，使用的毛玻璃样式。