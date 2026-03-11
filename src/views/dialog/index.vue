<template>
  <div>

    <!-- 右侧主内容区域 -->
    <main class="content">
      <!-- 顶部区域 -->
      <div class="main-header">
        <h1 class="welcome-text">你好，张三</h1>
        <button class="btn btn-secondary history-btn">
          <span class="history-icon">📋</span> 历史对话
        </button>
      </div>
      
      <div class="welcome-message">
        欢迎使用数智记者！一起 <span class="highlight">创作无限可能</span>
      </div>
      
      <!-- 标签按钮 -->
      <div class="tag-buttons">
        <button class="tag-btn">新闻消息</button>
        <button class="tag-btn">新闻发布稿</button>
        <button class="tag-btn">政策解读</button>
        <button class="tag-btn">事件评论</button>
        <button class="tag-btn">讲话稿</button>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-container">
          <input 
            type="text" 
            class="main-input"
            placeholder="你想问我点什么？"
            v-model="aiInput"
          />
          <div class="input-actions">
            <select class="model-select">
              <option>deepseek</option>
            </select>
            <button class="action-btn">深度思考</button>
            <button class="action-btn">联网搜索</button>
            <button class="action-btn settings-btn">⚙️</button>
            <button class="btn btn-primary send-btn" @click="sendAiMessage">
              <span class="send-icon">➤</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 功能卡片 -->
      <div class="feature-cards">
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
      <div class="recent-articles">
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
import { ref, onMounted } from 'vue'
import History from '../../components/History.vue'
import { chatWithAssistant } from '../../services/aiService.js'

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
</style>