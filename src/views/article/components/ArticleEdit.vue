<!-- 封装抽屉组件 -->
<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类 id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
}

// 准备数据
// 准备好数据   当我们 open 回显的时候   就要往这里面回显填充
// 编辑的时候需要填充    添加的时候不需要填充
const formModel = ref({ ...defaultForm })

// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片  在框中显示
  // 立刻将图片对象  存入 formModel.value.cover_img  将来用于提交发布
  formModel.value.cover_img = uploadFile.raw
}

const editorRef = ref() // 重置文本编辑器的变量  在下面给 文本编辑器  加 ref  属性
// 组件向外暴露个方法  open,  基于 open 传来的参数，区分是添加功能还是编辑
// open({})  =>   表单无需渲染   说明是添加
// open({ id: ..., ... })    =>  表单需要渲染    说明是编辑
// open  调用之后   可以打开抽屉
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉

  if (row.id) {
    // 需要基于 row.id 发送请求  获取编辑对应的详情数据   进行回显
    // 点击每条文章后的编辑按钮编辑回显
    // 回显就是编辑操作改数据   而不是从头改   是在之前数据上修改
    // 参数是每个 id
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    // 图片路径需要进行拼接
    imgUrl.value = baseURL + formModel.value.cover_img

    // 注意：提交给后台，需要的数据格式，是 file 对象格式
    // 需要将网络图片地址  =>  转换成 file 对象   存储起来   将来便于提交
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm } // 基于默认数据   重置 form 数据
    // 这里重置了表单的数据   但是图片上传 img 地址   富文本编辑器 都需要手动重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

defineExpose({
  open
})

// 定义 emit   因为我们下面要使用 emit
const emit = defineEmits(['success'])
// 文章提交
const onPublish = async (state) => {
  // 将已发布还是草稿的状态  存入 formModel
  formModel.value.state = state

  // 注意 当前接口需要 formData 对象
  // 将 js 普通对象 => 转换成 => formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    // 将 formModel 中数据加到 formData 对象 fd 中
    // formData 对象加数据使用  fd
    fd.append(key, formModel.value[key])
  }

  // 添加然后发请求
  if (formModel.value.id) {
    // 编辑操作
    // 这里编辑和添加操作就接口   传递给父组件参数不同
    await artEditService(fd)
    ElMessage.success('修改成功')
    // 抽屉关掉
    visibleDrawer.value = false

    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    // 抽屉关掉
    visibleDrawer.value = false

    // 因为我们调用了接口  然后所以我们点击发布之后
    // 新加的数据请求会加到我们页面数据最后面
    // 通知到父组件   添加成功了
    // 懂了懂了 success  是自定义事件   我们通过 emit  传给父组件
    // 父组件在组组件标签中  @success  中调用自定义事件
    emit('success', 'add')
  }
}

// 将网络图片地址转换为File对象
// 两个参数  一个是 url 地址  另一个是文件名
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 自动上传  不需要配置 action 等参数
                    只需要做前端的本地预览图片即可  无需在提交之前上传图标
                    语法：URL.createObjectURL(...)   创建本地预览的地址   来预览
                 -->

        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <!-- 因为我们 imgUrl  默认是空  所以我们刚开始不会展示这个图片 -->
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <!-- 富文本编辑器 -->
          <!-- 实现数据双向绑定   和我们渲染数据双向绑定 -->
          <!-- 需要设置文本格式    content-type 可以识别标签 -->
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          >
            <!--  -->
          </quill-editor>
        </div>
      </el-form-item>

      <!-- 发布  草稿 -->
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
