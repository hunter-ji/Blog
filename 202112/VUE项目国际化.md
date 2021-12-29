## 一. 前言

`i18n`是“国际化”的简称。在资讯领域，国际化(i18n)指让产品（出版物，软件，硬件等）无需做大的改变就能够适应不同的语言和地区的需要。对程序来说，在不修改内部代码的情况下，能根据不同语言及地区显示相应的界面。 在全球化的时代，国际化尤为重要，因为产品的潜在用户可能来自世界的各个角落。

Node.js本身有一个`i18n`的包，但是为了更好地结合vue，此处我们使用的是`vue-i18n`。



源码：[https://github.com/Kuari/Blog/tree/master/Examples/vue_i18n_demo](https://github.com/Kuari/Blog/tree/master/Examples/vue_i18n_demo)



## 二. 环境

* Vue 3.0.0
* TypeScript 4.5.4
* Vue Cli 4.5.15



## 三. 安装

使用vue cli安装，会自动生成文件且引入。

```bash
vue add i18n
```

执行过程中将需要填写如下问题：

```
? The locale of project localization. [默认选项]en
? The fallback locale of project localization. [默认选项]en
? The directory where store localization messages of project. It's stored under `src` directory. [默认选项]locales
? Enable legacy API (compatible vue-i18n@v8.x) mode ? [默认选项]No
```

执行完成之后，将会自动处理如下文件：

```
// vue add i18n执行结束后的git status

new file:   .env // 执行过程中的第一个和第二个问题将使用环境变量更新
modified:   package.json
new file:   src/components/HelloI18n.vue // 官方给出的demo组件
new file:   src/i18n.ts // 自动读取多语言的json文件且创建i18n实例
new file:   src/locales/en.json // 多语言json文件所在文件夹，默认选择的en语言，所以生成一个默认的语言json文件
modified:   src/main.ts // 引入i18n
new file:   vue.config.js // 配置i18n
modified:   yarn.lock
```



## 四. 多语言配置

想要多语言则需要配置多个对应语言的json文件，其字段必须相同，否则当用户切换时，会出现找不到该字段对应文字的问题。

为了便于切换和处理，此处不再使用`en`之类的简写，而是和系统语言名称对应起来，此处将使用`zh_CN`和`en_GB`来做配置。

### 1. 创建多语言json文件

此处生成两个文件`src/locales/zh_CN.json`和`src/locales/en_GB.json`，内容分别如下：

```json
{
  "language": "中文",
  "message": "你好，世界!"
}
```

```json
{
  "language": "English",
  "message": "Hello, World !"
}
```

### 2. 更新语言标识

将相关文件的`en`都改成`en_GB`。

```
# .env

VUE_APP_I18N_LOCALE=en_GB
VUE_APP_I18N_FALLBACK_LOCALE=en_GB
```

```typescript
// src/i18n.ts

// ...
export default createI18n({
  legacy: false,
  locale: process.env.VUE_APP_I18N_LOCALE || 'en_GB',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en_GB',
  messages: loadLocaleMessages()
})
```



## 五. 使用

### 1. 重写首页

此处重写`src/views/Home.vue`文件，先按照正常的内容去写，内容如下：

```vue
<template>
  <div>
    <div>Hello, World !</div>
  </div>
</template>
```



### 2. 配置多语言

需要配置多语言的地方就是展示的文字，所以将该文字替换掉即可。

```vue
<template>
  <div>
    <div>{{ t('message') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

此处引入`t`方法，而其参数`message`为上面配置的每一个json文件中的`message`字段，其将用json对应字段的value来展示。

可能有小伙伴儿要问，那如果不是html中的展示文字怎么办呢？

这也一样使用`t`方法的，示例如下：

```html
<input type="text" :placeholder="t('message')" />
```

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const exampleVal = t('message')
</script>
```

此处我们的json结构都是单层的，如果是嵌套的结构的话，可以使用`t('home.message')`这样的方式来引用。



### 3. 切换语言

此处需要引入`locale`，主要通过更新locale.value来切换语言。此处的切换是全局的，所以只需要写一个切换组件，其它组件都将会被切换语言。

写一个下拉框来实现语言的切换，完整内容如下：

```vue
<template>
  <div>
    <div>{{ t('message') }}</div>
    <select v-model="state.language" @change="handleLanguageChange">
      <option value="zh_CN">zh_CN</option>
      <option value="en_GB">en_GB</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const state: { language: string } = reactive({
  language: 'en_GB'
})
const handleLanguageChange = (option: { target: { value: string } }) => {
  // 主要通过更新locale.value来切换语言
  locale.value = option.target.value
}
</script>
```

通过下拉框切换选项可以切换语言。



## 六. 本地环境

虽然`i18n`设置了默认的语言，但是友好的交互应当是根据用户的环境语言加载。这里需要使用`navigator.language`来拿到用户的环境语言，通过判断环境语言切换初始的语言配置。

```typescript
switch (navigator.language) {
  case 'zh-CN':
    state.language = 'zh_CN'
    locale.value = 'zh_CN'
    break
  case 'en-GB':
    state.language = 'en_GB'
    locale.value = 'en_GB'
    break
  default:
    state.language = 'en_GB'
    locale.value = 'en_GB'
}
```

完整代码如下：

```vue
<template>
  <div>
    <div>{{ t('message') }}</div>
    <select v-model="state.language" @change="handleLanguageChange">
      <option value="zh_CN">zh_CN</option>
      <option value="en_GB">en_GB</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const state: { language: string } = reactive({
  language: 'en_GB'
})
const handleLanguageChange = (option: { target: { value: string } }) => {
  // 主要通过更新locale.value来切换语言
  locale.value = option.target.value
}
const fetchData = () => {
  switch (navigator.language) {
    // 环境语言中间的线是居中的
    case 'zh-CN':
      state.language = 'zh_CN'
      locale.value = 'zh_CN'
      break
    case 'en-GB':
      state.language = 'en_GB'
      locale.value = 'en_GB'
      break
    default:
      state.language = 'en_GB'
      locale.value = 'en_GB'
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

运行之后，默认语言不再是英语，而是跟环境语言一致的。



## 七. 参考文档

* [vue-i18n](https://kazupon.github.io/vue-i18n/zh/started.html)