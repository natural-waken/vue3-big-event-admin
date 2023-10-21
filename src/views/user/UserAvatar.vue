<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

// 基于 store 数据  初始化 imgUrl 初始值
// 就是点开进去显示原本的头像
const userStore = useUserStore()

const imgUrl = ref(userStore.user.user_pic)

// 更新头像文件    改变头像之后在页面进行预览
const onSelectFile = (uploadFile) => {
  // 基于 FileReader 选取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result // 上传头像需要这参数
    console.log(imgUrl.value)
  }

  // 法二
  // imgUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 点击上传头像触发接口
const onUpdateAvatar = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // userStore  重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('头像更新成功')
}

const uploadRef = ref()
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <!-- 改变就调用函数 -->
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <!-- 如果有头像就显示  没有就显示默认图片 -->
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />

        <el-button
          @click="uploadRef.$el.querySelector('input').click()"
          type="primary"
          :icon="Plus"
          size="large"
        >
          选择图片
        </el-button>
        <el-button
          @click="onUpdateAvatar"
          type="success"
          :icon="Upload"
          size="large"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
