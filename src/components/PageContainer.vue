<script setup>
// 父传子传数据  进行对应内容渲染
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 使用具名插槽渲染按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>

    <!-- 内容也使用默认插槽 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
