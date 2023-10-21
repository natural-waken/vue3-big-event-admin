import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

// createRouter  创建路由实例

// vite 中环境变量  import.meta.env.DEV  就是 vite.config.js 中 base 配置项
console.log(import.meta.env.DEV)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页

    {
      // 登录页  一旦你访问到这个路径  我肯定要重定向到某个路径显示
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',

      // 配置二级路由
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截
// 语法默认是直接放行   不用 next
// 根据返回值确定是返回还是拦截
// 返回值：
//   1. undefined  /  true       直接放行
//   2. false     拦回 from 地址页面
//   3. 具体路径  或   路径对象   拦截到对应地址
//      '/login'    或者传参 { name: 'login' }
router.beforeEach((to) => {
  // 如果没有 token  且访问的是非登录页，这时需要授权，拦截到登录，其他情况正常放行
  const useStore = useUserStore() // 导出这方法  使用   pinia

  // 返回具体路径  就是拦截   比如访问首页    直接拦截到 login  页面
  if (!useStore.token && to.path !== '/login') return '/login'

  // 其他情况  返回正常    直接放行
  return true
})

export default router
