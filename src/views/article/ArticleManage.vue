<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'

// 表格数据   获取要在下拉菜单选择对应分类之后   然后在下面展示对应文章有什么    需要发送请求获取
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
const loading = ref(false) // loading  状态

// 定义请求参数对象
// 这样我们在下面进行绑定时候就是基于数据去绑定   传递给子组件  而不是使用空数据去
// 这是分类名称   就是哪类文章   传递给子组件    然后子组件进行选择   我们拿这个数据要进行下面表格渲染
// 要根据哪类来渲染     分类对应文章
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '', // 这两个是我们下拉菜单去选择
  state: ''
})

// 发送请求获取对应分类文章列表
// 基于 params 参数获取文章列表
const getArticleList = async () => {
  loading.value = true

  const res = await artGetListService(params.value) // 将对应参数传过去获取请求结果
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
// 刚进页面就发请求
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  // 只要是每页条数变化   那么原来正在访问的当前页意义不大   数据大概率已经不在原来那页了
  // 重新从首页开始渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新当前页  和  每页条数   渲染数据
  getArticleList()
}
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  // 基于最新当前页   渲染数据
  getArticleList()
}

// 表单按钮搜索  重置逻辑
// 搜索逻辑  =>  按照最新条件，重新检索，从首页开始展示
const onSearch = () => {
  params.value.pagenum = 1 // 重置页面
  getArticleList()
}

// 重置逻辑 =>  将筛选条件清空   重新检索   从首页开始展示
const onReset = () => {
  params.value.pagenum = 1 // 重置页面
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 按钮编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 按钮删除逻辑
// const onDeleteArticle = async (row) => {
//     console.log(row);
//     // 我来试试自己写删除逻辑
//     await artDeleteService(row.id)
//     ElMessage.success('删除成功')
//     getArticleList()
// }
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })

  await artDeleteService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}

// 点击按钮添加文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

const articleEditRef = ref() // 组件  ref    要调用子组件的 open 方法

// 添加或者编辑成功回调
// 自定义事件
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加  最好是点击发布之后就渲染最后页   默认发布之后渲染的是第一页开始  我们要看还要查看最后页才能找到最新数据
    // 计算出最后页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数   再渲染
    params.value.pagenum = lastPage
    console.log(total.value)
  } else {
    // 如果是编辑  就直接渲染当前页即可
    getArticleList()
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <!-- 具名插槽 -->
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- 我们将下拉菜单封装成小组件 -->

        <!-- 我们希望的是  传过去这个  那么那边渲染默认这个类是被选中  并且是联动的 -->
        <!-- Vue2  =>    v-model 是 :value  和 @input 简写 -->
        <!-- Vue3  =>    v-model 是 :modelValue   和  @update:modelValue  简写 -->
        <!-- 所以在 Vue3 中我们写  v-model  在组件内部需要使用 props 接收  并且使用 emit  触发事件和上面做个绑定 -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>

      <!-- 文章状态 -->
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态  就是通过真标记  已发布 / 草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <!-- 如果我们要对当前表格进行渲染  需要配 :data -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 总结这里两种结构 -->
        <!-- 这里首先有五列  有的列是 prop 进行渲染 这是直接填充数据  有的是作用域插槽 template 这个拿到数据可以自定义去渲染 -->
        <!-- 作用域插槽这种方式明显更加灵活  代码量多 -->

        <!-- 在这里将这个写成个链接 -->
        <!-- 作用域插槽 -->
        <template #default="{ row }">
          <!-- 解构出 row  然后在里面进行渲染  组件给我们提供表格里面 a 是 el-link -->
          <!-- 默认是蓝色  并且去掉下划线 -->
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>

      <!-- 发表时间  默认请求结果数据是格式化时间   我们需要将时间进行处理 -->
      <el-table-column label="发表时间" prop="pub_date">
        <!-- 因为要自定义里面数据   所以我们使用 template 默认插槽 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <!-- 同样是作用域插槽 -->
        <!-- 同样解构出 row  因为我们进行操作需要用到每项 id -->
        <!-- 注册点击事件 无论是我们编辑还是删除都需要传 id  -->
        <!-- 利用作用域插槽  row 可以拿到当前行数据   row 可以理解为 v-for  中遍历 item -->
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <!-- 
            v-model:current-page  就是绑定的是当前页  和我们上面  params  中数据进行绑定
            size-change    事件就是我们每页条数发生变化时候   触发  比如每页 5  条这种
            current-change     触发就是当前页变化   触发事件
            这两个函数还可以接收参数
         -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加文章编辑抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
