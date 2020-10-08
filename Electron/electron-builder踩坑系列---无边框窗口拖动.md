## 简述

无边框的拖动本来很简单，只要对可以拖动的部分加上`-webkit-app-region: drag;`的样式即可。但是，当可拖动区域存在其他元素，如顶部菜单的搜索框，对mac是没有问题的，当在windows平台下拖动事件就会覆盖掉其他元素，因此需要对其他元素单独设置样式。



## 官方文档

```html
<body style="-webkit-app-region: drag">
</body>
```

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
  -webkit-app-region: no-drag
}
```





## 参考文档

* [官方文档](https://www.electronjs.org/docs/api/frameless-window#%E5%8F%AF%E6%8B%96%E6%8B%BD%E5%8C%BA)