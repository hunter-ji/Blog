## 一. 前言

最近空下来，正好找个项目尝鲜，把vue3+ts+setup哐哐全堆上，试试最新的前端技术。

从最先体会到的变化，就是关于响应式APIs了。遇到不好问题，怪我没有理解文档/狗头。比如说：

* 明明这个数据改了，怎么没渲染出来？
* 同样是Arrary，怎么套了个reactive就类型不一样了？

所以这里基于遇到的几个问题，来写个笔记。



## 二. 简单对比

* [响应式官方文档](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%93%8D%E5%BA%94%E5%BC%8F)

官方案例如下：

 ```vue
 <script setup>
 import { ref } from 'vue'
 
 const count = ref(0)
 </script>
 
 <template>
   <button @click="count++">{{ count }}</button>
 </template>
 ```

我们可以先看看，如果是vue2，怎么做呢？

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
	<button @click="count++">{{ count }}</button>
</template>
```

可以很明显地看到此处的`count`跟上面的官方文档不同，使用了`ref`方法。这就是setup中的响应式APIs，需要预先声明响应式变量。

如果，不声明呢？那就是直接写成如下：

```javascript
const count = 0
```

运行一下，首先你会发现，没有任何报错，代码正常运行。但是当你在浏览器上查看，开始改变`count`的值时，就会发现，怎么页面没有变化？

所以，需要手动命名响应，才会在值变化时触发视图渲染。



## 三. ref

现在来详细讲讲`ref`，该方法常用于单个变量，比如：

```javascript
ref(0)
ref("hello")
```

这里需要说明一个问题，那就是`ref("hello") !== "hello"`。这就是我说的，为什么同样的值，类型就不同了。那是因为ref返回的是一个`Proxy`，而非原来的值。在视图中可直接使用，但是在js/ts中操作，需要使用`.value`来操作，如下所示：

```javascript
let name = ref("kuari")

function changeName() {
  name.value = "tom"
}
```



## 四. reactive

`reactive`不同于`ref`的点在于，其是“深层”的——它影响所有嵌套 property。也就是说，其可用在对象或者数组上。

```javascript
let form = reactive({
  name: "kuari",
  desc: "developer"
})
```

其返回类型也是`Proxy`，不同点在于，可以直接修改某一个元素的，如下所示：

```javascript
form.name = "tom"
```

但是如果你想整个替换就会报错了。

```javascript
form = {...} // 报错，类型不同
```

当使用的是数组时，如果想整个替换，可以将其写成对象，代码如下所示：

```typescript
let selected = reactive({
  arr: [
    {
      label: "vue",
      value: 0
    },
    {
      label: "typescript",
      value: 1
		}
  ]
})

// 使用
console.log(selected.arr)

// 整个替换
selected.arr = [...]
```

关于`reactive`跟`ref`一起使用，`reactive` 将解包所有深层的`ref`，同时维持 ref 的响应性。

```typescript
const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 它会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 它也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```



## 五. 总结

`setup`总体来说，用起来真的会更加简洁，而响应式虽然好像比之前麻烦些了，但是一定层面上让开发对对于程序有了更深入的操控。墙裂推荐一波！后面再来详细讲讲对于新特性的体验。