<template>
  <div class="meeting">
    <h2>会议纪要</h2>
    <div class="meeting-form">
      <input 
        type="text" 
        v-model="meetingTitle" 
        placeholder="会议标题" 
        class="form-input" 
      />
      <input 
        type="text" 
        v-model="participants" 
        placeholder="参会人员" 
        class="form-input" 
      />
      <input 
        type="datetime-local" 
        v-model="meetingTime" 
        class="form-input" 
      />
      
      <!-- 附件上传 -->
      <div class="attachments-section">
        <h3>附件</h3>
        <div class="attachments-upload">
          <input 
            type="file" 
            accept="image/*,audio/*" 
            multiple 
            @change="handleFileUpload"
            class="file-input"
            ref="fileInput"
          />
          <button class="btn btn-secondary" @click="triggerFileInput">上传附件</button>
        </div>
        <div class="attachments-list">
          <div 
            v-for="(attachment, index) in attachments" 
            :key="index"
            class="attachment-item"
          >
            <div class="attachment-info">
              <span class="attachment-name">{{ attachment.name }}</span>
              <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
            </div>
            <button class="btn btn-sm btn-danger" @click="removeAttachment(index)">删除</button>
          </div>
        </div>
      </div>
      
      <!-- 手机同步 -->
      <div class="sync-section">
        <h3>手机同步</h3>
        <div class="sync-info">
          <p>扫描二维码同步到手机</p>
          <div class="qrcode-placeholder">
            <!-- 这里可以集成二维码生成库 -->
            <div class="qrcode-text">二维码区域</div>
          </div>
          <button class="btn btn-primary" @click="syncToPhone">同步到手机</button>
        </div>
      </div>
      
      <div class="ai-prompt-section">
        <input 
          type="text" 
          v-model="aiPrompt" 
          placeholder="输入纪要生成指令，按Enter生成内容..."
          class="ai-prompt-input"
          @keyup.enter="generateMinutes"
          :disabled="isGenerating"
        />
        <button class="btn btn-primary" @click="generateMinutes" :disabled="isGenerating">
          {{ isGenerating ? '生成中...' : '生成纪要' }}
        </button>
      </div>
      <QuillEditor ref="editor" />
      <div class="toolbar">
        <button class="btn btn-secondary" @click="saveMeeting">保存</button>
        <button class="btn btn-secondary" @click="exportMeeting">导出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import { chatWithAssistant } from '../services/aiService.js'
import { ElMessage } from 'element-plus'

const editor = ref(null)
const meetingTitle = ref('')
const participants = ref('')
const meetingTime = ref('')
const aiPrompt = ref('')
const attachments = ref([])
const fileInput = ref(null)

// 触发文件输入
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      attachments.value.push(files[i])
    }
    ElMessage.success(`成功上传 ${files.length} 个附件`)
  }
}

// 移除附件
const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
  ElMessage.success('附件已删除')
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 同步到手机
const syncToPhone = () => {
  // 这里可以实现二维码生成和同步逻辑
  ElMessage.info('同步功能开发中...')
}

// 生成会议纪要
const isGenerating = ref(false)

const generateMinutes = async () => {
  if (aiPrompt.value.trim() && meetingTitle.value && !isGenerating.value) {
    isGenerating.value = true
    try {
      const prompt = `请基于以下信息生成会议纪要：\n会议标题：${meetingTitle.value}\n参会人员：${participants.value}\n会议时间：${meetingTime.value}\n${aiPrompt.value}`
      
      if (editor.value && editor.value.quill) {
        let currentIndex = 0
        
        await chatWithAssistant(prompt, (chunk) => {
          if (editor.value && editor.value.quill) {
            editor.value.quill.insertText(currentIndex, chunk)
            currentIndex += chunk.length
          }
        })
      }
      aiPrompt.value = ''
    } catch (error) {
      console.error('生成会议纪要失败:', error)
    } finally {
      isGenerating.value = false
    }
  }
}

// 保存会议纪要
const saveMeeting = () => {
  if (editor.value && editor.value.quill) {
    const content = editor.value.quill.getText()
    const meetingData = {
      title: meetingTitle.value || '未命名会议',
      participants: participants.value,
      time: meetingTime.value,
      content: content,
      attachments: attachments.value.map(a => ({ name: a.name, size: a.size }))
    }
    // 保存到本地存储
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]')
    meetings.unshift({
      ...meetingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('meetings', JSON.stringify(meetings))
    ElMessage.success('会议纪要已保存')
  }
}

// 导出会议纪要
const exportMeeting = () => {
  if (editor.value && editor.value.quill) {
    const content = editor.value.quill.getText()
    const meetingData = {
      title: meetingTitle.value || '未命名会议',
      participants: participants.value,
      time: meetingTime.value,
      content: content
    }
    const dataStr = JSON.stringify(meetingData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${meetingData.title || '会议纪要'}.json`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('会议纪要已导出')
  }
}
</script>

<style scoped>
.meeting {
  width: 100%;
}

.meeting-form {
  margin-top: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 0.5rem 0;
  font-size: 1rem;
}

.attachments-section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(67, 97, 238, 0.05);
}

.attachments-upload {
  margin: 0.5rem 0;
}

.attachments-list {
  margin-top: 1rem;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  background-color: white;
}

.attachment-info {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.attachment-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.attachment-size {
  font-size: 0.875rem;
  color: var(--light-text);
}

.sync-section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(76, 201, 240, 0.05);
}

.sync-info {
  text-align: center;
}

.qrcode-placeholder {
  width: 150px;
  height: 150px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.qrcode-text {
  color: var(--light-text);
  font-size: 0.875rem;
}

.ai-prompt-section {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.ai-prompt-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>