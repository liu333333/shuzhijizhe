<template>
  <div class="step-write">
    <h2>步骤式写作</h2>
    <div class="steps">
      <div class="step">
        <h3>1. 确定主题</h3>
        <input 
          type="text" 
          v-model="topic" 
          placeholder="输入写作主题" 
          class="form-input" 
        />
      </div>
      <div class="step">
        <h3>2. 大纲生成</h3>
        <button 
          class="btn btn-primary" 
          @click="generateOutline"
          :disabled="!topic.trim()"
        >
          生成大纲
        </button>
        <div class="outline-content" v-if="outline">
          <h4>生成的大纲</h4>
          <div class="outline-text">{{ outline }}</div>
        </div>
      </div>
      <div class="step">
        <h3>3. 内容填充</h3>
        <div class="ai-prompt-section">
          <input 
            type="text" 
            v-model="aiPrompt" 
            placeholder="输入填充指令，按Enter生成内容..."
            class="ai-prompt-input"
            @keyup.enter="generateContent"
          />
          <button class="btn btn-primary" @click="generateContent">生成</button>
        </div>
        <QuillEditor ref="editor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import { generateOutline as aiGenerateOutline, chatWithAssistant } from '../services/aiService.js'

const editor = ref(null)
const topic = ref('')
const outline = ref('')
const aiPrompt = ref('')

// 生成大纲
const generateOutline = async () => {
  if (topic.value.trim()) {
    try {
      const result = await aiGenerateOutline(topic.value)
      outline.value = result
    } catch (error) {
      console.error('大纲生成失败:', error)
    }
  }
}

// 生成内容
const generateContent = async () => {
  if (aiPrompt.value.trim() && topic.value) {
    try {
      const prompt = `基于主题"${topic.value}"和大纲"${outline.value}"，${aiPrompt.value}`
      const response = await chatWithAssistant(prompt)
      if (editor.value && editor.value.quill) {
        const range = editor.value.quill.getSelection()
        if (range) {
          editor.value.quill.insertText(range.index, response)
        } else {
          editor.value.quill.insertText(0, response)
        }
      }
      aiPrompt.value = ''
    } catch (error) {
      console.error('生成内容失败:', error)
    }
  }
}
</script>

<style scoped>
.step-write {
  width: 100%;
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

.outline-content {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(67, 97, 238, 0.05);
}

.outline-text {
  white-space: pre-wrap;
  line-height: 1.6;
  margin-top: 0.5rem;
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
</style>