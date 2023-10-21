import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'

// 用户模块  token  setToken  removeToken
// 存 token
export const useUserStore = defineStore(
  'big-user',
  () => {
    // 用户 token
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }

    const removeToken = () => {
      token.value = ''
    }

    // 用户基本信息
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      user.value = res.data.data // 存入 ref
    }
    const setUser = (obj) => {
      user.value = obj // 要是传过来个空对象  那就相当于是重置了
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true // 持久化
  }
)
