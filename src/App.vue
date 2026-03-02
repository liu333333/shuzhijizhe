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
        <h2>快速写作</h2>
        <div class="toolbar">
          <button class="btn btn-secondary">保存</button>
          <button class="btn btn-secondary">导出</button>
          <button class="btn btn-primary">AI助手</button>
        </div>
        <QuillEditor 
          ref="editor"
          @selection-change="handleSelectionChange"
        />
        <SelectionMenu 
          v-if="showSelectionMenu"
          :position="selectionPosition"
          @close="showSelectionMenu = false"
          @rewrite="rewriteSelectedText"
          @expand="expandSelectedText"
          @ai-check="aiCheckSelectedText"
        />
      </div>

      <!-- 以稿写稿 -->
      <div v-else-if="activeModule === 'draft-write'" class="card">
        <h2>以稿写稿</h2>
        <p>上传已有稿件，基于此进行创作</p>
        <input type="file" class="file-input" />
        <QuillEditor ref="editor" />
      </div>

      <!-- 步骤式写作 -->
      <div v-else-if="activeModule === 'step-write'" class="card">
        <h2>步骤式写作</h2>
        <div class="steps">
          <div class="step">
            <h3>1. 确定主题</h3>
            <input type="text" placeholder="输入写作主题" class="form-input" />
          </div>
          <div class="step">
            <h3>2. 大纲生成</h3>
            <button class="btn btn-primary">生成大纲</button>
          </div>
          <div class="step">
            <h3>3. 内容填充</h3>
            <QuillEditor ref="editor" />
          </div>
        </div>
      </div>

      <!-- AI校对 -->
      <div v-else-if="activeModule === 'ai-check'" class="card">
        <h2>AI校对</h2>
        <QuillEditor ref="editor" />
        <button class="btn btn-primary" style="margin-top: 1rem;">开始校对</button>
      </div>

      <!-- 格式排版 -->
      <div v-else-if="activeModule === 'format'" class="card">
        <h2>格式排版</h2>
        <QuillEditor ref="editor" />
        <div class="format-options" style="margin-top: 1rem;">
          <button class="btn btn-secondary">标题格式</button>
          <button class="btn btn-secondary">段落间距</button>
          <button class="btn btn-secondary">字体设置</button>
        </div>
      </div>

      <!-- 自定义模板 -->
      <div v-else-if="activeModule === 'template'" class="card">
        <h2>自定义模板</h2>
        <div class="template-list">
          <div class="template-item">会议纪要</div>
          <div class="template-item">工作报告</div>
          <div class="template-item">新闻稿</div>
          <div class="template-item">创建模板</div>
        </div>
      </div>

      <!-- 会议纪要 -->
      <div v-else-if="activeModule === 'meeting'" class="card">
        <h2>会议纪要</h2>
        <div class="meeting-form">
          <input type="text" placeholder="会议标题" class="form-input" />
          <input type="text" placeholder="参会人员" class="form-input" />
          <input type="datetime-local" class="form-input" />
          <QuillEditor ref="editor" />
        </div>
      </div>

      <!-- 智能助手 -->
      <div v-else-if="activeModule === 'assistant'" class="card">
        <h2>智能助手</h2>
        <div class="ai-chat">
          <div class="chat-messages">
            <div class="message ai">你好，我是你的智能写作助手，有什么可以帮助你的吗？</div>
          </div>
          <div class="chat-input">
            <input type="text" placeholder="输入你的问题..." class="form-input" />
            <button class="btn btn-primary">发送</button>
          </div>
        </div>
      </div>
    </main>

    <!-- 智能助手悬浮窗口 -->
    <div class="ai-assistant" v-if="showAiAssistant">
      <div class="ai-assistant-header">
        <span>智能助手</span>
        <button @click="showAiAssistant = false">×</button>
      </div>
      <div class="ai-assistant-content">
        <div class="message ai">你好，我是你的智能写作助手，有什么可以帮助你的吗？</div>
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
import QuillEditor from './components/QuillEditor.vue'
import SelectionMenu from './components/SelectionMenu.vue'
import { rewriteText, expandText, checkText, chatWithAssistant, generateOutline } from './services/aiService.js'

// 导航项
const navItems = [
  { id: 'quick-write', name: '快速写作' },
  { id: 'draft-write', name: '以稿写稿' },
  { id: 'step-write', name: '步骤式写作' },
  { id: 'ai-check', name: 'AI校对' },
  { id: 'format', name: '格式排版' },
  { id: 'template', name: '自定义模板' },
  { id: 'meeting', name: '会议纪要' },
  { id: 'assistant', name: '智能助手' }
]

// 状态管理
const activeModule = ref('quick-write')
const showAiAssistant = ref(false)
const aiInput = ref('')
const editor = ref(null)
const showSelectionMenu = ref(false)
const selectionPosition = ref({ x: 0, y: 0 })

// 切换模块
const switchModule = (moduleId) => {
  activeModule.value = moduleId
}

// 处理文本选择
const handleSelectionChange = (range, oldRange, source) => {
  if (range && range.length > 0) {
    // 计算选择菜单位置
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect()
      selectionPosition.value = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40
      }
      showSelectionMenu.value = true
    }
  } else {
    showSelectionMenu.value = false
  }
}

// 文本操作方法
const rewriteSelectedText = async () => {
  if (editor.value && editor.value.quill) {
    const range = editor.value.quill.getSelection()
    if (range && range.length > 0) {
      const selectedText = editor.value.quill.getText(range.index, range.length)
      try {
        const rewrittenText = await rewriteText(selectedText)
        editor.value.quill.deleteText(range.index, range.length)
        editor.value.quill.insertText(range.index, rewrittenText)
        editor.value.quill.setSelection(range.index, rewrittenText.length)
      } catch (error) {
        console.error('改写失败:', error)
      }
    }
  }
  showSelectionMenu.value = false
}

const expandSelectedText = async () => {
  if (editor.value && editor.value.quill) {
    const range = editor.value.quill.getSelection()
    if (range && range.length > 0) {
      const selectedText = editor.value.quill.getText(range.index, range.length)
      try {
        const expandedText = await expandText(selectedText)
        editor.value.quill.deleteText(range.index, range.length)
        editor.value.quill.insertText(range.index, expandedText)
        editor.value.quill.setSelection(range.index, expandedText.length)
      } catch (error) {
        console.error('扩展失败:', error)
      }
    }
  }
  showSelectionMenu.value = false
}

const aiCheckSelectedText = async () => {
  if (editor.value && editor.value.quill) {
    const range = editor.value.quill.getSelection()
    if (range && range.length > 0) {
      const selectedText = editor.value.quill.getText(range.index, range.length)
      try {
        const checkedText = await checkText(selectedText)
        // 显示校对结果
        alert('校对结果:\n' + checkedText)
      } catch (error) {
        console.error('校对失败:', error)
      }
    }
  }
  showSelectionMenu.value = false
}

// 发送AI消息
const sendAiMessage = async () => {
  if (aiInput.value.trim()) {
    try {
      const response = await chatWithAssistant(aiInput.value)
      // 这里可以将响应添加到聊天界面
      console.log('AI响应:', response)
      aiInput.value = ''
    } catch (error) {
      console.error('聊天失败:', error)
    }
  }
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