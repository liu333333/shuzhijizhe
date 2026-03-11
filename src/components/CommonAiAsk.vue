<template>
  <div class="form-box">
    <el-form :model="form" class="form-class">
      <el-form-item v-if="isfilesList">
        <div class="files-list" ref="filesList">
          <div class="files-box" ref="filesBox">
            <div class="files-item" v-for="(item, index) in form.local_files" :key="index">
              <el-icon><Link /></el-icon> {{ item.name }} <el-icon @click="fileDel(item.uid)"><CircleCloseFilled /></el-icon>
            </div>
          </div>
          <el-tooltip class="box-item" effect="light" content="向下滚动" placement="top" v-if="bottomJt">
            <el-icon class="tips-zs" @click="goBottom"><Bottom /></el-icon>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.query"
          :class="['text-input', isfilesList ? 'mheigth' : '']"
          type="textarea"
          resize="none"
          placeholder="请问需要什么帮助"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip content="点击下拉选择模型~" placement="top">
          <el-dropdown trigger="click" @command="handleSelect">
            <!-- 触发按钮 -->
            <el-button circle class="trigger-btn">
              <img :src="models[form.type - 1].icon2" alt="" />
            </el-button>

            <!-- 下拉菜单 -->
            <template #dropdown>
              <el-dropdown-menu class="model-dropdown">
                <el-dropdown-item v-for="item in models" :key="item.value" :command="item.value" :class="{ 'is-active': form.type === item.value }">
                  <img v-if="form.type === item.value" :src="item.icon3" alt="" />
                  <img v-else :src="item.icon" alt="" />
                  <span class="model-text">{{ item.label }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
        <div class="send-box">
          <el-upload
            v-model:file-list="fileList"
            class="upload-btn"
            action="#"
            :auto-upload="false"
            multiple
            :limit="10"
            :show-file-list="showfilelist"
            :on-change="handleFileChange"
            accept=".pdf,.PDF,.doc,.docx"
          >
            <el-tooltip content="可上传附件类型：.pdf,.doc,.docx,.xlsx,.xls" placement="top" effect="dark">
              <el-icon><Link /></el-icon>
            </el-tooltip>
          </el-upload>
          <el-button v-if="!isStop" class="send-btn" :loading="loading" @click="fetchData">
            <el-icon v-if="!loading"><Promotion /></el-icon>
            发送
          </el-button>
          <el-tooltip v-if="isStop" content="停止生成" placement="top" effect="dark">
            <div @click="stopChat" class="stop-box">
              <div class="stop-in"></div>
            </div>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="CommonAiAsk">
import { ElMessage } from 'element-plus'
import { reactive, ref, watch, nextTick } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import { Loading, CircleCloseFilled, Bottom, Link, Promotion } from '@element-plus/icons-vue'
import { Document, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, Packer } from 'docx'
import { saveAs } from 'file-saver'

// 定义props
const props = defineProps({
  isStop: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['fetchData', 'stopChat'])

// 状态管理
const form = reactive({
  type: 1,
  conversation_id: '',
  query: '',
  local_files: []
})

const models = [
  {
    value: 1,
    label: 'Deepseek',
    icon: '/src/assets/deepseek-icon.png',
    icon2: '/src/assets/deepseek-icon2.png',
    icon3: '/src/assets/deepseek-icon3.png'
  },
  { value: 2, label: '通义千问', icon: '/src/assets/qianwen-icon.png', icon2: '/src/assets/qianwen-icon2.png', icon3: '/src/assets/qianwen-icon3.png' },
  { value: 3, label: '豆包', icon: '/src/assets/doubao-icon.png', icon2: '/src/assets/doubao-icon2.png', icon3: '/src/assets/doubao-icon3.png' }
]

const handleSelect = command => {
  form.type = command
}

const fileListObj = reactive({
  fileListArray: []
})
const showfilelist = ref(false)
const isfilesList = ref(false)
const bottomJt = ref(false)
const filesBox = ref<HTMLDivElement | null>(null)
const filesList = ref<HTMLDivElement | null>(null)
const filesListArrayId = ref([])
const filesListArrayAllId = ref([])

const fileDel = id => {
  form.local_files = form.local_files.filter(item => item.uid !== id)
  filesListArrayId.value.push(id)
  isfilesList.value = form.local_files.length > 0 ? true : false
  nextTick(() => {
    if (filesBox.value) {
      bottomJt.value = filesBox.value.offsetHeight > 60
    }
  })
}

const goBottom = () => {
  nextTick(() => {
    if (filesBox.value && filesList.value) {
      filesList.value.scrollTop = filesBox.value.offsetHeight
    }
  })
}

const handleFileChange = (file, fileList) => {
  // 1. 检查文件大小（限制 10MB）
  const maxSize = 10 * 1024 * 1024 // 10MB
  const sizeValid = file.size <= maxSize
  if (!sizeValid) {
    ElMessage.error(`${file.name} 超过 10MB 限制！`)
    // 移除超限文件
    fileList = fileList.filter(f => f.uid !== file.uid)
    return
  }

  if(filesListArrayId.value.length > 0) {
    filesListArrayId.value.forEach((item, index) => {
      fileList = fileList.filter(f => f.uid !== item)
      filesListArrayAllId.value.push(item.uid)
    })
  }
  // 2. 检查文件名是否重复
  const fileNameList = fileList.map(f => f.name)
  const hasDuplicate = fileNameList.some((name, index) => fileNameList.indexOf(name) !== index)
  if (hasDuplicate) {
    ElMessage.error(`${file.name} 文件名重复，请修改后重新上传！`)
    // 移除重复文件（保留第一个，移除后续重复文件）
    const uniqueFileList = fileList.filter((f, i, arr) => i === arr.findIndex(item => item.name === f.name))
    fileList = uniqueFileList
  }
  form.local_files = []
  fileList.forEach((item, index) => {
    form.local_files.push(item.raw)
  })
  isfilesList.value = form.local_files.length > 0 ? true : false
  nextTick(() => {
    if (filesBox.value) {
      bottomJt.value = filesBox.value.offsetHeight > 60
    }
  })
}

// 发送数据
const fetchData = () => {
  emit('fetchData', form)
}

// 停止生成
const stopChat = () => {
  emit('stopChat')
}

// 暴露form对象
defineExpose({
  form
})
</script>

<style scoped lang="scss">
.model-dropdown {
  :deep(.el-dropdown-menu__item) {
    line-height: 26px;
    img {
      margin-right: 5px;
    }
  }
  .is-active {
    .model-text {
      color: #4b85ff;
    }
  }
}

.form-box {
  width: 100%;
  height: auto;
  border: 1px solid #3559FF;
  border-radius: 14px;
  padding: 10px;
  background: #fff;
  box-sizing: border-box;
  .form-class {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    :deep(.el-form-item__content) {
      justify-content: space-between;
      .files-list {
        width: 100%;
        height: 50px;
        padding-right: 20px;
        box-sizing: border-box;
        margin-top: 5px;
        overflow: auto;
        position: relative;
        .tips-zs {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
          animation: float 1s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) translateY(0);
          }
          50% {
            transform: translate(0, 0) translateY(10px);
          }
        }
        .files-box {
          width: 100%;
          height: auto;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          padding-top: 10px;
          box-sizing: border-box;
          .files-item {
            display: flex;
            align-items: center;
            border-radius: 5px;
            background: #e6e8f8;
            padding: 0 5px;
            margin-right: 10px;
            margin-bottom: 10px;
            color: rgba(51, 51, 51, 0.5);
            position: relative;
            .el-icon {
              position: absolute;
              right: -6px;
              top: -6px;
              border: 1px solid #fff;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
      }
      .files-list::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }

      .files-list::-webkit-scrollbar-thumb {
        background: transparent;
      }
      .text-input {
        .el-textarea__inner {
          box-shadow: none;
          height: auto;
        }
      }
      .mheigth {
        .el-textarea__inner {
          height: auto;
        }
      }
      .send-box {
        display: flex;
        align-items: center;
        .send-btn {
          width: 90px;
          height: 40px;
          border-radius: 10px;
          background: #e7edff;
          color: #3559ff;
          font-size: 17px;
          font-weight: bold;
        }
        .stop-box {
          width: 30px;
          height: 30px;
          background: #4d6bfe;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          .stop-in {
            width: 12px;
            height: 12px;
            background: #ffffff;
          }
        }
        .upload-btn {
          margin-right: 10px;
          height: 30px;
          .el-icon {
            font-size: 30px;
            color: #4c4c4c;
            font-weight: bold;
          }
        }
      }

      .trigger-btn {
        width: 40px;
        height: 40px;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
