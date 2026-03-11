<template>
  <div>

    <!-- 右侧主内容区域 -->
    <main class="content">
      <!-- 顶部区域 -->
      <div class="main-header" v-if="!isFullPage">
        <h1 class="welcome-text">你好，张三</h1>
        <button class="btn btn-secondary history-btn">
          <span class="history-icon">📋</span> 历史对话
        </button>
      </div>
      
      <div class="welcome-message" v-if="!isFullPage">
        欢迎使用数智记者！一起 <span class="highlight">创作无限可能</span>
      </div>
      
      <!-- 标签按钮 -->
      <div class="tag-buttons" v-if="!isFullPage">
        <button class="tag-btn">新闻消息</button>
        <button class="tag-btn">新闻发布稿</button>
        <button class="tag-btn">政策解读</button>
        <button class="tag-btn">事件评论</button>
        <button class="tag-btn">讲话稿</button>
      </div>
      
      <!-- 问答展示区域 -->
      <!-- <div class="conversation-content">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="message.role"
        >
          <div v-if="message.role === 'user'" class="message-content user-content">
            <div class="message-title">{{ message.title }}</div>
            <div class="message-files" v-if="message.filearray && message.filearray.length > 0">
              <div class="message-file-item" v-for="(file, i) in message.filearray" :key="i">
                <el-icon><Link /></el-icon> {{ file.name || file.filename }}
              </div>
            </div>
          </div>
          <div v-else class="message-content ai-content">
            <div v-if="message.loading" class="loading-container">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在生成回答...</span>
            </div>
            <div v-else-if="message.compiledMarkdown" class="response-content" v-html="message.compiledMarkdown"></div>
            <div v-else class="yqts">本问答由 AI 生成，仅供参考，注意甄别！</div>
            <div class="ag" v-if="!message.loading">
              <div class="copy-box" @click="copyText(message.textcopy)">
                <el-tooltip content="复制" placement="top">
                  <el-icon class="down-word"><CopyDocument /></el-icon>
                </el-tooltip>
              </div>
              <div class="copy-box" @click="downWord(index, message.title, message.htmlcopy)">
                <el-tooltip content="下载word" placement="top">
                  <el-icon class="down-word"><Download /></el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 输入区域 -->
      <AiAsk @update:isFullPage="updateIsFullPage"/>
      <!-- <div class="input-section">
        <CommonAiAsk 
          :is-stop="isStop"
          :loading="loading"
          @fetch-data="handleFetchData"
          @stop-chat="stopChat"
          ref="commonAiAsk"
        />
      </div> -->
      
      <!-- 功能卡片 -->
      <div class="feature-cards" v-if="!isFullPage">
        <div class="feature-card">
          <div class="feature-icon">📄</div>
          <h3 class="feature-title">格式排版</h3>
          <p class="feature-desc">一句话介绍文案</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3 class="feature-title">一键润色</h3>
          <p class="feature-desc">一句话介绍文案</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✏️</div>
          <h3 class="feature-title">智能审校</h3>
          <p class="feature-desc">一句话介绍文案</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">AI智绘</h3>
          <p class="feature-desc">一句话介绍文案</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎬</div>
          <h3 class="feature-title">AI视频</h3>
          <p class="feature-desc">一句话介绍文案</p>
        </div>
      </div>
      
      <!-- 最近稿件 -->
      <div class="recent-articles" v-if="!isFullPage">
        <h3 class="section-title">最近稿件</h3>
        <div class="article-cards">
          <div class="article-card">
            <h4 class="article-title">稿件标题稿件标题稿件标题</h4>
            <p class="article-content">稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...</p>
          </div>
          <div class="article-card">
            <h4 class="article-title">稿件标题稿件标题稿件标题</h4>
            <p class="article-content">稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...</p>
          </div>
          <div class="article-card">
            <h4 class="article-title">稿件标题稿件标题稿件标题</h4>
            <p class="article-content">稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文稿件正文...</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 智能助手入口按钮 -->
    <button class="ai-assistant-toggle" @click="showAiAssistant = true" v-if="!showAiAssistant">
      <span class="ai-icon">🤖</span>
    </button>

    <!-- 智能助手悬浮窗口 -->
    <div class="ai-assistant" v-if="showAiAssistant">
      <div class="ai-assistant-header">
        <span>智能助手</span>
        <button @click="showAiAssistant = false">×</button>
      </div>
      <div class="ai-assistant-content">
        <div 
          v-for="(message, index) in assistantMessages" 
          :key="index"
          class="message"
          :class="message.role"
        >
          {{ message.content }}
        </div>
      </div>
      <div class="ai-assistant-input">
        <input type="text" placeholder="输入你的问题..." v-model="aiInput" />
        <button class="btn btn-primary" @click="sendAiMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import History from '../../components/History.vue'
import AiAsk from '../../components/AiAsk.vue'
import CommonAiAsk from '../../components/CommonAiAsk.vue'
import { chatWithAssistant } from '../../services/aiService.js'
import { marked } from 'marked'
import { Loading, Link, CopyDocument, Download } from '@element-plus/icons-vue'
import { Document, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, Packer } from 'docx'
import { saveAs } from 'file-saver'

// 状态管理
const activeModule = ref('quick-write')
const showAiAssistant = ref(false)
const aiInput = ref('')
const assistantMessages = ref([
  {
    role: 'ai',
    content: '你好，我是你的智能写作助手，有什么可以帮助你的吗？'
  }
])
const historyComponent = ref(null)
const isStop = ref(false)
const loading = ref(false)
const taskId = ref("")
const commonAiAsk = ref(null)
const messages = ref([])
const responseText = ref('')
const isStreaming = ref(false)
const isFullPage = ref(false) // AI对话是否全屏

// 更新isFullPage状态
const updateIsFullPage = (val) => {
  isFullPage.value = val
}

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 处理深度思考内容的渲染
const processThinkContent = html => {
  // 将 <think> 标签转换为特定样式的容器
  return html.replace(
    /<think>([\s\S]*?)<\/think>/g,
    '<div class="think-container"><div class="think-label">深度思考</div><div class="think-content">$1</div></div>'
  )
}
const processThinkContentOutText = html => {
  // 将 <think> 标签转换为特定样式的容器
  return html.replace(/<think>([\s\S]*?)<\/think>/g, '')
}

// 监听响应文本变化
watch(responseText, newVal => {
  if (newVal && messages.value.length > 0) {
    // 将 markdown 转换为 HTML
    const rawHtml = marked.parse(newVal)
    // 处理深度思考内容
    messages.value[messages.value.length - 1].compiledMarkdown = processThinkContent(rawHtml)
    messages.value[messages.value.length - 1].textcopy = processThinkContentOutText(rawHtml).replace(/<[^>]*>/g, '')
    messages.value[messages.value.length - 1].htmlcopy = processThinkContentOutText(rawHtml)
    // 确保滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
})

// 滚动到底部
const scrollToBottom = () => {
  const container = document.querySelector('.conversation-content')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 切换模块
const switchModule = (moduleId) => {
  activeModule.value = moduleId
}

// 发送AI消息
const sendAiMessage = async () => {
  if (aiInput.value.trim()) {
    // 添加用户消息
    assistantMessages.value.push({
      role: 'user',
      content: aiInput.value
    })
    
    try {
      // 发送到AI
      const response = await chatWithAssistant(aiInput.value)
      // 添加AI回复
      assistantMessages.value.push({
        role: 'ai',
        content: response
      })
    } catch (error) {
      console.error('聊天失败:', error)
      // 添加错误消息
      assistantMessages.value.push({
        role: 'ai',
        content: '抱歉，我暂时无法回答你的问题，请重试'
      })
    }
    
    aiInput.value = ''
  }
}

// 处理获取数据
const handleFetchData = async (formData) => {
  if (loading.value) return
  if (!formData || !formData.query) {
    return
  }
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    title: formData.query,
    filearray: formData.local_files
  })
  
  // 添加AI消息（加载状态）
  messages.value.push({
    role: 'ai',
    compiledMarkdown: '',
    loading: true,
    textcopy: '',
    htmlcopy: ''
  })
  
  loading.value = true
  isStop.value = true
  isStreaming.value = true
  responseText.value = ''
  
  try {
    // 发送到AI
    const response = await chatWithAssistant(formData.query)
    // 更新AI回复
    responseText.value = response
    messages.value[messages.value.length - 1].loading = false
  } catch (error) {
    console.error('聊天失败:', error)
    // 更新错误消息
    messages.value[messages.value.length - 1].loading = false
    messages.value[messages.value.length - 1].compiledMarkdown = '<div class="error-message">抱歉，我暂时无法回答你的问题，请重试</div>'
  } finally {
    loading.value = false
    isStop.value = false
    isStreaming.value = false
  }
}

// 停止生成
const stopChat = () => {
  isStop.value = false
  loading.value = false
}

// 复制
const copyText = async textcopy => {
  if (!textcopy) {
    return false
  }
  try {
    await navigator.clipboard.writeText(textcopy)
    alert('复制成功！')
  } catch (err) {
    alert('复制失败！')
  }
}

// 下载word
const downWord = async (index, name , htmlcopy) => {
  try {
    // 创建一个新的Document实例
    const doc = new Document({
      sections: [
        {
          children: await htmlToDocx(htmlcopy)
        }
      ]
    })
    // 生成文档并下载
    const blob = await Packer.toBlob(doc)
    saveAs(blob, name + '.docx')
  } catch (err) {
    alert('下载失败！')
  }
}

// 将HTML转换为docx格式
const htmlToDocx = async html => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const children = []
  // 遍历DOM节点并转换为docx元素
  for (const node of doc.body.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      switch (node.tagName.toLowerCase()) {
        case 'h1':
          children.push(
            new Paragraph({
              text: node.textContent,
              heading: HeadingLevel.HEADING_1
            })
          )
          break
        case 'h2':
          children.push(
            new Paragraph({
              text: node.textContent,
              heading: HeadingLevel.HEADING_2
            })
          )
          break
        case 'p':
          children.push(
            new Paragraph({
              children: [new TextRun(node.textContent)]
            })
          )
          break
        case 'ul':
        case 'ol':
          for (const li of node.querySelectorAll('li')) {
            children.push(
              new Paragraph({
                text: li.textContent,
                bullet: { level: 0 }
              })
            )
          }
          break
        case 'table':
          const rows = []
          for (const tr of node.querySelectorAll('tr')) {
            const cells = []
            for (const td of tr.querySelectorAll('th, td')) {
              cells.push(
                new TableCell({
                  children: [new Paragraph(td.textContent)]
                })
              )
            }
            rows.push(new TableRow({ children: cells }))
          }
          children.push(new Table({ rows }))
          break
        default:
          children.push(
            new Paragraph({
              children: [new TextRun(node.textContent)]
            })
          )
      }
    }
  }

  return children
}

// 保存历史记录
const saveToHistory = (item) => {
  // 通知历史记录组件更新
  if (historyComponent.value) {
    historyComponent.value.addHistory(item)
  }
}

// 加载历史记录项
const loadHistoryItem = (item) => {
  // 切换到对应的模块
  activeModule.value = item.type
  // 这里可以实现加载历史内容到对应模块的逻辑
  console.log('加载历史记录:', item)
}

onMounted(() => {
  // 初始化
  console.log('数字记者应用已启动')
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.file-input {
  margin: 1rem 0;
  padding: 0.5rem;
}

.steps {
  margin-top: 1rem;
}

.step {
  margin-bottom: 2rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 0.5rem 0;
  font-size: 1rem;
}

.template-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.template-item {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.template-item:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

.meeting-form {
  margin-top: 1rem;
}

.ai-chat {
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.chat-messages {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius);
}

.message.ai {
  background-color: rgba(67, 97, 238, 0.1);
  align-self: flex-start;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}
.ai-assistant-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  box-shadow: var(--hover-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  z-index: 999;
}

.ai-assistant-toggle:hover {
  background-color: var(--secondary-color);
  transform: scale(1.1);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
}

.ai-icon {
  font-size: 1.5rem;
}

.ai-assistant {
  position: fixed;
  bottom: 100px;
  right: 2rem;
  width: 300px;
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--hover-shadow);
  z-index: 1000;
}

.ai-assistant-header {
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-assistant-content {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.ai-assistant-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
}

.ai-assistant-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius);
}

.message.ai {
  background-color: rgba(67, 97, 238, 0.1);
  align-self: flex-start;
}

.message.user {
  background-color: rgba(76, 201, 240, 0.1);
  align-self: flex-end;
  margin-left: 2rem;
}

/* 对话内容区域 */
.conversation-content {
  width: 100%;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
}

.message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.ai {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 10px;
  border-radius: 8px;
}

.user-content {
  background-color: #4763e4;
  color: white;
  border-radius: 10px 10px 0 10px;
}

.ai-content {
  background-color: #f5f5f5;
  border-radius: 0 10px 10px 10px;
}

.message-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-files {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.message-file-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 3px 8px;
  border-radius: 4px;
  margin-right: 5px;
  margin-top: 5px;
  font-size: 12px;
}

.loading-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  padding: 10px 0;
}

.response-content {
  width: 100%;
  height: auto;
  font-size: 14px;
  color: #333333;
  line-height: 24px;
  padding-top: 10px;
}

.response-content h3 {
  margin-top: 10px;
}

.response-content h4 {
  margin-top: 10px;
}

.response-content table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #333333;
  box-sizing: border-box;
  overflow-x: auto;
}

.response-content th,
.response-content td {
  border: 1px solid #333333;
  padding: 8px;
  text-align: left;
  word-break: break-word;
  overflow-wrap: break-word;
}

.response-content .think-container {
  width: 100%;
  font-size: 13px;
}

.response-content .think-label {
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.response-content .think-label::before {
  content: '💭';
  margin-right: 6px;
}

.response-content .think-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  line-height: 2;
  margin-bottom: 10px;
  text-align: justify;
  color: #8b8b8b;
  padding: 10px 0;
}

.response-content code {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #f56c6c;
}

.response-content pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
}

.response-content pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.response-content blockquote {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 1em 0;
  color: #606266;
  background-color: #f0f7ff;
}

.response-content ul,
.response-content ol {
  padding-left: 2em;
}

.yqts {
  font-size: 12px;
  color: #808fd1;
  line-height: 20px;
  font-style: italic;
  margin-top: 10px;
}

.ag {
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.copy-box {
  width: 26px;
  height: 26px;
  padding: 6px;
  box-sizing: border-box;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 2px;
}

.copy-box:hover {
  background: #e1f3fd;
}

.down-word {
  color: #3884ef;
  font-size: 16px;
}

.error-message {
  color: #f56c6c;
  padding: 10px;
  background-color: #fef0f0;
  border-radius: 4px;
}

/* 滚动条样式 */
.conversation-content::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.conversation-content::-webkit-scrollbar-thumb {
  background: #c1c2c6;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}

.conversation-content::-webkit-scrollbar-corner,
.conversation-content::-webkit-scrollbar-track {
  background: transparent;
  border: none;
}
</style>