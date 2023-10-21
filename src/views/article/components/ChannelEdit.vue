<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'

const dialogVisible = ref(false) // 控制 dialog 显示
const formRef = ref()
const formModel = ref({
  // 表单数据
  cate_name: '',
  cate_alias: ''
})

// rules 中字段需要和 formModel 中对应
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是 1-10 位非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是 1-15 位非空字符',
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['success']) // 要使用子传父
// 提交事件
const onSubmit = async () => {
  await formRef.value.validate() // 先校验  通过校验再往下走
  const isEdit = formModel.value.id // 如果有 id  那么就是编辑分类
  if (isEdit) {
    await artEditChannelService(formModel.value) // 将我们整个 form 对象传过去
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value) // 将我们整个 form 对象传过去  然后添加之后请求就会给我们数据加上新增的数据
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false // 关闭弹层
  emit('success') // 给父组件传递 通知修改数据
}

// 组件向外暴露个方法  open,  基于 open 传来的参数，区分是添加功能还是编辑
// open({})  =>   表单无需渲染   说明是添加
// open({ id: cate_name, ... })    =>  表单需要渲染    说明是编辑
// open  调用之后   可以打开弹窗

const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row } // 将添加的数据写到 formModel 中
  // 添加 ->  重置了表单内容   编辑 ->  存储了需要回显的数据
}

// 向外暴露方法  这样在父组件中就可以使用  方法   ref
defineExpose({
  open
})
</script>

<template>
  <!-- 对话框 -->
  <!-- title 动态绑定 -->
  <el-dialog
    :title="formModel.id ? '编辑分类' : '添加分类'"
    v-model="dialogVisible"
    width="30%"
  >
    <!-- 注意这里不是 v-model  就是 model 绑定 -->
    <!-- 还要绑定 rules -->
    <!-- 绑定 formRef  提交事件进行校验 -->
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <!-- 校验 prop   v-model 要绑定 -->
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>

        <!-- 注册提交事件 -->
        <el-button @click="onSubmit" type="primary"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
