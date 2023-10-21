<script setup>
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const formRef = ref() // 和表单进行绑定
const pwdForm = ref({
  // 数据进行绑定
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkOldSame = (rule, value, cb) => {
  // 校验新密码和原密码不能一样
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  // 校验确认密码必须和新密码一样
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}

// 导入 store 中信息数据
const userStore = useUserStore()
// 使用路由
const router = useRouter()

// 校验规则
const rules = {
  // 原密码
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  // 新密码
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  // 确认新密码
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}

// 点击提交修改密码
const submitForm = async () => {
  // 先进行校验
  await formRef.value.validate()
  // 调用接口方法   进行提交
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('密码修改成功')

  // 密码修改成功后   退出重新登录
  // 1. 清空本地存储中  token
  userStore.setToken('')
  userStore.setUser({})

  // 2. 拦截登录
  router.push('/login')
}

// 重置密码
const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>

          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitForm" type="primary">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
