import axios from 'axios'
// 导入 pinia 仓库   下面 token 要使用
import { useUserStore } from '@/stores'
// 导入组件库中 消息提示框组件
import { ElMessage } from 'element-plus'
import router from '@/router'

// 基地址   前缀地址
const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 创建 axios 实例
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器中需要携带 token
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token  token 在 pinia 仓库里  导入仓库
    const useStore = useUserStore()
    // 如果 token 存在，我们就需要向我们请求头里面携带
    if (useStore.token) {
      // Authorization 来自我们接口文档中的请求头
      config.headers.Authorization = useStore.token
    }

    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    // 接口文档中后台返回的数据中成功时 code = 0
    if (res.data.code === 0) {
      return res
    }

    // TODO 3. 处理业务失败
    // 处理业务失败  给错误提示  并且抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    //   错误特殊情况 => 401  权限不足  或  token 过期  =>  这种情况我们应该拦截到登录页面
    if (err.response?.status === 401) {
      router.push('/login')
    }

    //   错误的默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
