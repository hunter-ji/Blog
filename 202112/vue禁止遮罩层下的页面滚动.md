## 问题

功能开发过程中写遮罩时，遇到遮罩下页面还可以滚动的问题。



## 解决

直接给遮罩下的元素套上一个样式，使其不可滚动。

```html
<template>
	<div :class="isPopup ? 'disableRoll' : ''">
    <div>
      ...
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPopup: false,
    }
  }
}
</script>

<style>
  .disableRoll {
    overflow: hidden;
    position: fixed;
    height: 100%;
    width: 100%;
  }
</style>
```

