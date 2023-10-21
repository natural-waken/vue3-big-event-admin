import request from '@/utils/request'

// 分类：获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 分类：添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data) // 参数是 data
}
// 分类：编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info', data) // 参数是 data
}

// 分类：删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/my/cate/del', {
    params: { id }
  })
}

// 文章管理：获取文章列表     文章数据
// 传递参数是  params   对象
export const artGetListService = (params) => {
  return request.get('/my/article/list', {
    params
  })
}

// 如果是 put  post   就直接写参数
// 如果是  get   delete   就要在  params  里面配置参数

// 文章：添加文章
// 注意：data 需要 formData 格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)

// 文章：获取文章详情
export const artGetDetailService = (id) => {
  return request.get('/my/article/info', {
    params: { id }
  })
}

// 文章：编辑文章接口
export const artEditService = (data) => {
  return request.put('/my/article/info', data)
}

// 文章：删除文章接口
export const artDeleteService = (id) => {
  return request.delete('/my/article/info', {
    params: { id }
  })
}
