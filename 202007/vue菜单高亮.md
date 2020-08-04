## 一. 需求

在使用vue写菜单时，需要实现菜单上高亮与当前路由匹配。





## 二. 原生支持

Vue原生支持菜单高亮，菜单中路由使用`<router-link>`。

添加样式`.router-link-class`来实现菜单高亮的样式。

在菜单中某一元素的`<router-link>`添加`exact`属性来实现默认高亮。



```html
<template>
  <div class="menu">
    <ul>
      <li>
        <!--默认高亮路由-->
        <router-link to="/" exact>首页</router-link>
      </li>
      <li>
        <router-link to="/news" exact>资讯</router-link>
      </li>
      <li>
        <router-link to="/about" exact>关于</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .router-link-active {
    background: lightblue;
    color: black;
  }
</style>
```





## 三. ElementUI的NavMenu组件

`ElementUI`的`NavMenu`组件封装比较完善，可以直接上手使用，但是需要设置`router=true`才可开启高亮。

高亮样式可以通过官方给出的属性设置。



```html
 <el-menu
      default-active="/"
      :router="true">
     <el-menu-item index="/">
         <span slot="title">首页</span>
     </el-menu-item>
     <el-menu-item index="/news">
         <span slot="title">资讯</span>
     </el-menu-item>
     <el-menu-item index="/about">
         <span slot="title">关于</span>
     </el-menu-item>
</el-menu>
```



## 四. 参考文档

* [Vue Router API Reference](https://router.vuejs.org/api/#linkactiveclass)
* [Element UI NavMenu](https://element.eleme.cn/#/zh-CN/component/menu)

