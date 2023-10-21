<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user'

const formRef = ref() // 和表单绑定
// const userStore = useUserStore()
// 解构赋值
// 是在使用仓库数据初始化  (无需响应式)  解构无问题
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()

const userInfo = ref({ username, nickname, email, id })

// 校验规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 提交修改
// 两步  第一步是封装接口
// 第二步是点击提交修改
const submitForm = async () => {
  // 真正提交之前需要校验
  // 等待校验结果
  // 里面写了 rules  调用这个方法回触发校验
  await formRef.value.validate()
  // 校验成功我们就提交修改
  await userUpdateInfoService(userInfo.value)
  // 页面修改之后通知后面数据修改
  // 可以重新获取最新数据 进行渲染   通知 user 模块  进行数据更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->

    <el-row>
      <el-col :span="12">
        <el-form
          :model="userInfo"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
