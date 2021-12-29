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
