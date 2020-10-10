## 简述

采用无边框就自然导致拖动问题，因此需要手动去设置可拖动区域。

设置可拖动区域也会出现新的问题，如果可拖动区域上存在其他元素的事件问题。在mac上直接设置一块可拖动区域即可，而windows就会出现可拖动区域上其他元素的事件被拖动事件覆盖掉了。因此还需要对其他元素设置不可拖动。



## 官方文档

默认情况下, 无边框窗口是不可拖拽的。 应用程序需要在 CSS 中指定 `-webkit-app-region: drag` 来告诉 Electron 哪些区域是可拖拽的（如操作系统的标准标题栏），在可拖拽区域内部使用 `-webkit-app-region: no-drag` 则可以将其中部分区域排除。 请注意, 当前只支持矩形形状。

要使整个窗口可拖拽, 您可以添加 `-webkit-app-region: drag` 作为 `body` 的样式:

```html
<body style="-webkit-app-region: drag">
</body>
```

请注意，如果您使整个窗口都可拖拽，则必须将其中的按钮标记为不可拖拽，否则用户将无法点击它们：

```css
button {
  -webkit-app-region: no-drag;
}
```



## 实现

```css
.menu {
  -webkit-app-region: drag;
}

.menu-button {
  -webkit-app-region: no-drag;
}
```



## 参考文档

* [官方文档](https://www.electronjs.org/docs/api/frameless-window#%E5%8F%AF%E6%8B%96%E6%8B%BD%E5%8C%BA)