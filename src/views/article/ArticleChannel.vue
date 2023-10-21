<script setup>
import { ref } from 'vue'
import {
  artGetChannelsService,
  artDelChannelService
} from '../../api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([]) // 数据列表
const loading = ref(false) // 控制 loading 显示
const dialog = ref() // 组件实例

const getChannelList = async () => {
  // 发请求时将 loading 开启
  loading.value = true
  const res = await artGetChannelsService() // 获取表格信息
  channelList.value = res.data.data

  // 发完请求之后将 loading 关掉
  loading.value = false
  console.log(channelList.value)
}
getChannelList() // 刚上来就渲染表格信息

// 点击添加按钮显示弹层  弹层封装成组件  添加 和 编辑 同时使用
const onAddChannel = () => {
  dialog.value.open({}) // 组件实例直接调用 open 方法
}

// 编辑操作  和 添加复用同一个弹层
// 添加功能不需要回显   编辑功能需要回显
const onEditChannel = (row) => {
  dialog.value.open(row)
}

// 当子组件中数据进行添加或者是编辑时   成功时候  更新父组件中数据列表
const onSuccess = () => {
  getChannelList()
}

const onDelChannel = async (row) => {
  // 弹框提示
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 调用接口
  await artDelChannelService(row.id)
  getChannelList()
  ElMessage.success('删除成功')
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <!-- 具名插槽 -->
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <!-- 数据绑定请求回来的数据  样式撑满整个盒子 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <!-- 总共有 4 列  prop 配置数据 -->
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- 自定义列模板  用来放我们的操作部分 -->
        <!-- row 就是我们 channelList 每项数据  $index  就是下标 -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>

        <!-- 如果说列表中没有数据  那么就显示空状态 -->
        <!-- 我们 el-table 支持空 empty 插槽 -->
      </el-table-column>
      <!-- 插槽内容 空 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
