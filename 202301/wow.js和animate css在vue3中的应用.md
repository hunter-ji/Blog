## 一. 环境

* vue 3.2
* typescript 4.7.4
* wow.js 1.2.2
* animate.css 4.1.1



## 二. animate.css

### 1. 下载

```
pnpm add animate.css -D
```

### 2. 引入

在`vue3`项目的`main.ts`中引入

```js
import 'animate.css'
```

### 3. 使用

需要注意的是，animate css在4.0之后使用`animate__`前缀

```html
<h1 class="animate__animated animate__bounce">An animated element</h1>
```

### 4. 动画延迟

#### 官方方法

官方给出的动画延迟是`animate__delay-2s`、`animate__delay-3s` ......

直接在class中添加即可

```html
<h1 class="animate__animated animate__bounce animate__delay-2s">An animated element</h1>
```

#### 自定义延迟

特殊场景需要使用不同于官方的延迟时间，因此可以自定义延迟时间，直接声明延迟的类，然后在class上加入即可

```css
.animation-delay-1 {
  animation-delay: 100ms;
}
.animation-delay-2 {
  animation-delay: 300ms;
}
.animation-delay-3 {
  animation-delay: 500ms;
}
.animation-delay-4 {
  animation-delay: 700ms;
}
.animation-delay-5 {
  animation-delay: 900ms;
}
```

使用

```html
<h1 class="animate__animated animate__bounce animation-delay-1">An animated element</h1>
<h1 class="animate__animated animate__bounce animation-delay-2">Another animated element</h1>
```



## 三. wow.js

### 1. 下载

```
pnpm add wow.js -D
```

### 2. 引入

在`vue3`项目的`main.ts`中引入，内容如下:

```js
import WOW from 'wow.js'

new WOW({
  boxClass: 'wow', // 类名，在用户滚动时显示隐藏的框。
  animateClass: 'animate__animated', // 触发CSS动画的类名称
  offset: 300, // 定义浏览器视口底部与隐藏框顶部之间的距离。当用户滚动并到达此距离时，隐藏的框会显示出来。
  mobile: true, // 在移动设备上打开/关闭WOW.js。
  live: true, // 在页面上同时检查新的WOW元素。
}).init()
```

### 3. 使用

使用`wow`直接替代`animate__animated`即可

```html
<h1 class="wow animate__bounce animation-delay-1">An animated element</h1>
```



## 四. 结语

由于写一个页面需要使用到wow，好多年没用过了，查了一下文档超多版本教程，使用起来各种不成功，难受...暂时也没找到可替代的方案...



## 五. 参考文档

* [wow](https://github.com/graingert/wow)
* [animate css](https://animate.style/)