<template>
  <div class="ai-check">
    <h2>AI校对</h2>
    <QuillEditor ref="editor" />
    <div class="toolbar">
      <button class="btn btn-primary" @click="startCheck">开始校对</button>
      <button class="btn btn-secondary" @click="applyCorrections">应用修正</button>
    </div>
    <div class="check-result" v-if="checkResult">
      <h3>校对结果</h3>
      <div class="result-content">{{ checkResult }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import { checkText } from '../services/aiService.js'

const editor = ref(null)
const checkResult = ref('')

// 开始校对
const startCheck = async () => {
  if (editor.value && editor.value.quill) {
    const text = editor.value.quill.getText()
    if (text.trim()) {
      try {
        const result = await checkText(text)
        checkResult.value = result
      } catch (error) {
        console.error('校对失败:', error)
      }
    }
  }
}

// 应用修正
const applyCorrections = async () => {
  if (editor.value && editor.value.quill && checkResult.value) {
    try {
      // 这里可以实现更复杂的修正逻辑，比如提取AI建议的修正内容
      // 目前简化处理，直接替换整个文本
      const prompt = `基于以下校对结果，生成修正后的完整文本：\n${checkResult.value}`
      const response = await import('../services/aiService.js').then(m => m.chatWithAssistant(prompt))
      editor.value.quill.setText(response)
    } catch (error) {
      console.error('应用修正失败:', error)
    }
  }
}
</script>

<style scoped>
.ai-check {
  width: 100%;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.check-result {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(67, 97, 238, 0.05);
}

.result-content {
  white-space: pre-wrap;
  line-height: 1.6;
  margin-top: 0.5rem;
}
</style>