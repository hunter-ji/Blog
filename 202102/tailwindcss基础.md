## 一. 简介

> Rapidly build modern websites without ever leaving your HTML.

[Tailwind CSS](https://tailwindcss.com/)可以快速建立现代网站，而无需离开HTML。其特性是原子化，很像的`BootStrap`的css。

通俗点解释就是，其封装了很多独立的css样式，只需要在html中添加`class`即可调用，而不需要去从头写css样式。



## 二. 安装

### 1. 下载包

```bash
npm install tailwindcss@latest postcss@latest autoprefixer@latest
```

可能会遇到如下报错：

```bash
Error: PostCSS plugin tailwindcss requires PostCSS 8.
```

那就需要降低`PostCSS`的版本。如下，先卸载，再去安装。

```bash
npm uninstall tailwindcss postcss autoprefixer
npm install tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

### 2. 添加Tailwind作为PostCSS插件

添加`tailwindcss`和`autoprefixer`到`PostCSS`配置。大部分情况下作为`postcss.config.js`文件放在项目的顶级路径下。其也能作为`.postcssrc`文件，或者使用`postcss`键放在`package.json`文件中。

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

### 3. 创建配置文件

如果想自定义安装，当使用`npm`安装`tailwindcss`时候需要使用tailwind命令行去生成一个配置文件。

```bash
npx tailwindcss init
```

这将会创建一个最小化的`tailwind.config.js`文件，其位于项目的顶级路径下。

```javascript
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```

### 4. 在CSS中包含Tailwind

创建`styles.css`文件。

```css
/* ./your-css-folder/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

引入该文件。

```js
import "./styles.css"
```

### 5. 构建CSS

为生产而构建时，确保配置清除选项以删除任何最小文件大小的未使用类。

```js
// tailwind.config.js
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"], // 修改此行
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
```



## 三. 简要说明

由于其样式属性巨多，此处只举几例作简要说明，讲解基础用法。在开始不熟悉的情况下，要开着其手册查询。

### 1. Width

| Class  | 解释            |
| ------ | --------------- |
| w-0    | width: 0px;     |
| w-1    | width: 0.25rem; |
| w-1/2  | width: 50%;     |
| w-full | width: 100%;    |
| ...    | ...             |

```html
<!--示例-->
<div>
  <div class="w-1/2"></div>
</div>
```

### 2. Padding

| Class | 解释                   |
| ----- | ---------------------- |
| p-0   | padding: 0px;          |
| p-5   | padding: 1.25rem;      |
| pl-1  | padding-left: 0.25rem; |
| ...   | ...                    |

```html
<!--示例-->
<div class="p-5"></div>
```

### 3. Position

| Class    | 解释                |
| -------- | ------------------- |
| static   | position: static;   |
| fixed    | position: fixed;    |
| absolute | position: absolute; |
| ...      | ...                 |

```html
<!--示例-->
<div class="static">
  <p>Static parent</p>
  <div class="absolute bottom-0 left-0 ...">
    <p>Absolute child</p>
  </div>
</div>
```

### 4. Flex垂直居中

```html
<div class="flex flex-row justify-center items-center">
  <div>1</div>
  <div>2</div>
  <div></div>
</div>
```



## 四. 简单案例

```html
<div class="flex flex-col justify-center items-center p-20">
  <div v-for="item in 10"
       :key="item"
       class="flex flex-row justify-between items-center w-1/5 bg-gray-100 m-5 p-10 cursor-pointer shadow rounded hover:shadow-lg transition duration-300 ease-in-out">
    <img src="@/assets/message.png" alt="logo" height="50px" width="50px">
    <div class="flex flex-col ml-5">
      <div class="text-lg">今天晚上加{{ item }}个鸡腿</div>
      <div class="text-sm text-gray-500">2020.2.{{ item }}</div>
    </div>
  </div>
</div>
```

