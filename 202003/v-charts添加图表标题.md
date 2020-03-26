## 一. 场景
使用 `v-charts` 做数据可视化，需要给图表添加标题。

## 二. 解决方法
v-charts本身并没有提供显示标题的配置，顾需要引入 `echarts` 的 `title` 。

## 三. 实现

### 1. 引入title
```javascript
import "echarts/lib/component/title";
```

### 2. 添加标题配置
```javascript
this.chartTitle = {
  text: "平台用户与创客数量对比图",
  textStyle: {
    fontWeight: 600,
    color: "white"
  }
};
```

### 3. 使用
```html
<ve-bar :title="chartTitle" />
```

### 4. 完整实现
```vue
<template>
  <ve-bar ... :title="chartTitle" />
</template>

<script>
import "echarts/lib/component/title";

export default {
  data() {
    this.chartTitle = {
      text: "平台用户与创客数量对比图",
      textStyle: {
        fontWeight: 600,
        color: "white"
      }
    };
  }
};
</script>
```

## 四. echarts配置手册
* https://www.echartsjs.com/zh/option.html#title

## 五. 参考文章
* https://github.com/ElemeFE/v-charts/issues/191