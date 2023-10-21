<script setup>
// 在这里我们需要获取文章分类  因为下拉菜单文章分类里面选项就是 我们这些文章分类
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'

// 父传子 v-model
// 我们将父传子数据在下面  el-select   中进行渲染
// 在子组件中接收父组件传过来的参数
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

// 并且定义 emit 触发事件
const emit = defineEmits(['update:modelValue'])

const channelList = ref([]) // 存放文章分类
const getChannelList = async () => {
  const res = await artGetChannelsService() // 获取文章分类
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- label 是展示给用户看  value 收集起来提交给后台 -->
  <!-- 将上面数据在这进行渲染  我们不能使用 v-model  这样双向绑定就相当于是可以修改父组件 props 中数据   所以我们使用 :modelValue 进行绑定 -->
  <!-- 触发事件向上传递 -->
  <!-- 这样的好处是  第一 我们通过父传子 上面设置什么下面就显示什么 能够进行基本展示   
        第二 当我们内部 el-select 修改了 就触发事件 然后就会进行子传父 将我们触发获取的值上传到父组件 cateId 中
    -->

  <el-select
    :modelValue="modelValue"
    :style="{ width }"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
