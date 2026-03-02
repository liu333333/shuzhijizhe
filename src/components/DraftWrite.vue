<template>
  <div class="draft-write">
    <h2>以稿写稿</h2>
    <p>上传已有稿件，基于此进行创作</p>
    <input type="file" class="file-input" @change="handleFileUpload" />
    <div class="file-content" v-if="fileContent">
      <h3>上传的稿件内容</h3>
      <div class="file-text">{{ fileContent }}</div>
    </div>
    <div class="ai-prompt-section">
      <input 
        type="text" 
        v-model="aiPrompt" 
        placeholder="基于上传稿件，输入写作指令..."
        class="ai-prompt-input"
        @keyup.enter="generateContent"
      />
      <button class="btn btn-primary" @click="generateContent">生成</button>
    </div>
    <QuillEditor ref="editor" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import { chatWithAssistant } from '../services/aiService.js'

const editor = ref(null)
const fileContent = ref('')
const aiPrompt = ref('')

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target.result
    }
    reader.readAsText(file)
  }
}

// 生成内容
const generateContent = async () => {
  if (aiPrompt.value.trim() && fileContent.value) {
    try {
      const prompt = `基于以下稿件内容，${aiPrompt.value}\n\n稿件内容：${fileContent.value}`
      const response = await chatWithAssistant(prompt)
      if (editor.value && editor.value.quill) {
        editor.value.quill.insertText(0, response)
      }
      aiPrompt.value = ''
    } catch (error) {
      console.error('生成内容失败:', error)
    }
  }
}
</script>

<style scoped>
.draft-write {
  width: 100%;
}

.file-input {
  margin: 1rem 0;
  padding: 0.5rem;
}

.file-content {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: rgba(67, 97, 238, 0.05);
}

.file-text {
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