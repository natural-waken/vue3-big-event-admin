import request from '@/utils/request'

// 封装注册 api   注册接口
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 封装登录 api   登录接口   返回结果是 token
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')
// 获取到用户信息之后我们要存到 pinia

// 更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

// 更新用户头像
export const userUpdateAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', { avatar })
}

// 更新用户密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}
