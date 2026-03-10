<template>
  <div class="quick-write">
    <h2>快速写作</h2>
    <div class="toolbar">
      <button class="btn btn-secondary" @click="saveContent">保存</button>
      <button class="btn btn-secondary" @click="exportContent">导出</button>
      <button class="btn btn-primary" @click="toggleAiAssistant">AI助手</button>
    </div>
    <input 
      type="text" 
      v-model="title" 
      placeholder="文章标题" 
      class="title-input"
    />
    <div class="ai-prompt-section">
      <input 
        type="text" 
        v-model="aiPrompt" 
        placeholder="输入写作指令，按Enter生成内容..."
        class="ai-prompt-input"
        @keyup.enter="generateContent"
        :disabled="isGenerating"
      />
      <button class="btn btn-primary" @click="generateContent" :disabled="isGenerating">
        {{ isGenerating ? '生成中...' : '生成' }}
      </button>
    </div>
    <QuillEditor 
      ref="editor"
      @selection-change="handleSelectionChange"
      @contextmenu-event="handleContextMenu"
      @text-change="handleTextChange"
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
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import SelectionMenu from './SelectionMenu.vue'
import { rewriteText, expandText, checkText, chatWithAssistant } from '../services/aiService.js'

const props = defineProps({
  showAiAssistant: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:showAiAssistant', 'save-history'])

const editor = ref(null)
const showSelectionMenu = ref(false)
const selectionPosition = ref({ x: 0, y: 0 })
const aiPrompt = ref('')
const selectedText = ref('')
const savedRange = ref(null)
const title = ref('')

// 切换AI助手
const toggleAiAssistant = () => {
  emit('update:showAiAssistant', !props.showAiAssistant)
}

// 处理文本选择
const handleSelectionChange = (range, oldRange, source) => {
  if (range && range.length > 0) {
    // 保存选中的文本和位置，但不显示菜单
    if (editor.value && editor.value.quill) {
      selectedText.value = editor.value.quill.getText(range.index, range.length)
      savedRange.value = { ...range }
      showSelectionMenu.value = false
    }
  } else {
    selectedText.value = ''
    savedRange.value = null
    showSelectionMenu.value = false
  }
}

// 处理右键菜单事件
const handleContextMenu = (e) => {
  e.preventDefault()
  if (selectedText.value && savedRange.value) {
    // 获取选择范围的位置
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect()
      selectionPosition.value = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40
      }
    }
    // 右键点击且有选中文字时显示菜单
    showSelectionMenu.value = true
  } else {
    showSelectionMenu.value = false
  }
}

// 处理文本变化，关闭弹窗
const handleTextChange = () => {
  showSelectionMenu.value = false
}

// 生成内容
const isGenerating = ref(false)

const generateContent = async () => {
  if (aiPrompt.value.trim() && !isGenerating.value) {
    isGenerating.value = true
    try {
      if (editor.value && editor.value.quill) {
        const range = editor.value.quill.getSelection()
        const startIndex = range ? range.index : 0
        let currentIndex = startIndex
        let fullContent = ''
        
        await chatWithAssistant(aiPrompt.value, (chunk) => {
          if (editor.value && editor.value.quill) {
            const quill = editor.value.quill
            quill.insertText(currentIndex, chunk)
            currentIndex += chunk.length
            fullContent += chunk
          }
        })
        
        // 生成完成后设置一次选区
        if (editor.value && editor.value.quill) {
          try {
            const quill = editor.value.quill
            const length = quill.getLength()
            const safeIndex = Math.min(currentIndex, length - 1)
            quill.setSelection(safeIndex, 0)
          } catch (e) {
            console.warn('设置选区失败:', e)
          }
        }
      }
      aiPrompt.value = ''
    } catch (error) {
      console.error('生成内容失败:', error)
    } finally {
      isGenerating.value = false
    }
  }
}

// 文本操作方法
const rewriteSelectedText = async () => {
  if (!selectedText.value || !savedRange.value || !editor.value || !editor.value.quill) {
    showSelectionMenu.value = false
    return
  }
  
  try {
    const rewrittenText = await rewriteText(selectedText.value)
    const quill = editor.value.quill
    const { index, length } = savedRange.value
    
    // 先删除选中文本
    quill.deleteText(index, length)
    // 插入改写后的文本
    quill.insertText(index, rewrittenText)
    // 设置新的选择范围
    try {
      quill.setSelection(index, rewrittenText.length)
    } catch (selectionError) {
      console.warn('设置选择范围失败:', selectionError)
    }
  } catch (error) {
    console.error('改写失败:', error)
  }
  showSelectionMenu.value = false
}

const expandSelectedText = async () => {
  if (!selectedText.value || !savedRange.value || !editor.value || !editor.value.quill) {
    showSelectionMenu.value = false
    return
  }
  
  try {
    const expandedText = await expandText(selectedText.value)
    const quill = editor.value.quill
    const { index, length } = savedRange.value
    
    // 先删除选中文本
    quill.deleteText(index, length)
    // 插入扩展后的文本
    quill.insertText(index, expandedText)
    // 设置新的选择范围
    try {
      quill.setSelection(index, expandedText.length)
    } catch (selectionError) {
      console.warn('设置选择范围失败:', selectionError)
    }
  } catch (error) {
    console.error('扩展失败:', error)
  }
  showSelectionMenu.value = false
}

const aiCheckSelectedText = async () => {
  if (!selectedText.value) {
    showSelectionMenu.value = false
    return
  }
  
  try {
    const checkedText = await checkText(selectedText.value)
    alert('校对结果:\n' + checkedText)
  } catch (error) {
    console.error('校对失败:', error)
  }
  showSelectionMenu.value = false
}

// 保存内容
const saveContent = () => {
  if (editor.value && editor.value.quill) {
    const content = editor.value.quill.getText()
    // 保存到历史记录
    const articleData = {
      title: title.value || '未命名文章',
      content: content,
      type: 'quick-write'
    }
    // 通知父组件保存历史记录
    emit('save-history', articleData)
  }
}

// 导出内容
const exportContent = () => {
  if (editor.value && editor.value.quill) {
    // const content = editor.value.quill.getText()
    var content = editor.value.quill.root.innerHTML;
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.value || 'article'}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
}
</script>

<style scoped>
.quick-write {
  width: 100%;
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

.title-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>