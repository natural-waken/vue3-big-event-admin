<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <!-- App 整个只需要留一个路由出口 router-view 即可 -->

  <!-- 使用这个将整个显示包裹起来  全局配置中文 -->
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
