<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'

import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

// 一进页面就调用
const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  userStore.getUser() // 挂载页面就获取信息   获取信息之后我们就可以对页面信息地方进行渲染
})

// command   进行判断跳转路由
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    // 退出时我们弹出提示框  .eslintrc.cjs  里面已经添加过了  不会引入报错
    // 整个会得到个 promise 对象  await 就是如果这个成功了  才会向下执行
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 除了要切换到登录页   同时也要清除本地数据 (token + user 信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!-- 
        el-menu 整个菜单组件
            :default-active="$route.path"   配置默认高亮的菜单项
            router   router  选项开启，el-menu-item  中 index 就是点击跳转的路径

            el-menu-item  每个菜单项
              index="/article/channel"  配置的是访问的跳转路径   配合 default-active 值   实现高亮
     -->

  <el-container class="layout-container">
    <!-- 左边菜单部分 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>

      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <!-- 一级菜单 -->
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>

        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <!-- 多级菜单 -->
        <el-sub-menu index="/user">
          <!-- 多级菜单的标题  具名插槽 title -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容  默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>

          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>

          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 右边内容部分 -->
    <el-container>
      <el-header>
        <div>
          黑马程序员：<strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>

        <!-- 下拉菜单 -->
        <!-- 绑定 command 事件 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 默认展示给用户看 -->
          <span class="el-dropdown__box">
            <!-- 如果没有头像就显示默认头像 -->
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>

          <!-- 下拉内容  菜单展示内容 -->
          <!-- 我们给每个菜单项都进行了 command 绑定   因为我们要根据每个不同 command 进行不同操作  跳转路由还是进行退出什么操作等等 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
