<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="nav">
      <div class="nav-container">
        <div class="logo">数字记者</div>
        <ul class="nav-menu">
          <li 
            v-for="item in navItems" 
            :key="item.id"
            class="nav-item"
            :class="{ active: activeModule === item.id }"
            @click="switchModule(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 快速写作 -->
      <div v-if="activeModule === 'quick-write'" class="card">
            <QuickWrite v-model:show-ai-assistant="showAiAssistant" @save-history="saveToHistory" />
          </div>

      <!-- 以稿写稿 -->
      <div v-else-if="activeModule === 'draft-write'" class="card">
        <DraftWrite />
      </div>

      <!-- 步骤式写作 -->
      <div v-else-if="activeModule === 'step-write'" class="card">
        <StepWrite />
      </div>

      <!-- AI校对 -->
      <div v-else-if="activeModule === 'ai-check'" class="card">
        <AiCheck />
      </div>

      <!-- 格式排版 -->
      <div v-else-if="activeModule === 'format'" class="card">
        <Format />
      </div>

      <!-- 自定义模板 -->
      <div v-else-if="activeModule === 'template'" class="card">
        <Template />
      </div>

      <!-- 会议纪要 -->
      <div v-else-if="activeModule === 'meeting'" class="card">
        <Meeting />
      </div>

      <!-- 智能助手 -->
      <div v-else-if="activeModule === 'assistant'" class="card">
        <Assistant />
      </div>

      <!-- 历史记录 -->
      <div v-else-if="activeModule === 'history'" class="card">
        <History ref="historyComponent" @load-history="loadHistoryItem" />
      </div>
    </main>

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
import { ref, onMounted } from 'vue'
import QuickWrite from './components/QuickWrite.vue'
import DraftWrite from './components/DraftWrite.vue'
import StepWrite from './components/StepWrite.vue'
import AiCheck from './components/AiCheck.vue'
import Format from './components/Format.vue'
import Template from './components/Template.vue'
import Meeting from './components/Meeting.vue'
import Assistant from './components/Assistant.vue'
import History from './components/History.vue'
import { chatWithAssistant } from './services/aiService.js'

// 导航项
const navItems = [
  { id: 'quick-write', name: '快速写作' },
  { id: 'draft-write', name: '以稿写稿' },
  { id: 'step-write', name: '步骤式写作' },
  { id: 'ai-check', name: 'AI校对' },
  { id: 'format', name: '格式排版' },
  { id: 'template', name: '自定义模板' },
  { id: 'meeting', name: '会议纪要' },
  { id: 'assistant', name: '智能助手' },
  { id: 'history', name: '历史记录' }
]

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
</style>