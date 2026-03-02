<template>
  <div class="format">
    <h2>格式排版</h2>
    <QuillEditor ref="editor" />
    <div class="format-options" style="margin-top: 1rem;">
      <button class="btn btn-secondary" @click="formatHeading">标题格式</button>
      <button class="btn btn-secondary" @click="formatSpacing">段落间距</button>
      <button class="btn btn-secondary" @click="formatFont">字体设置</button>
      <button class="btn btn-primary" @click="autoFormat">自动排版</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'
import { chatWithAssistant } from '../services/aiService.js'

const editor = ref(null)

// 格式设置方法
const formatHeading = () => {
  // 这里可以实现标题格式设置逻辑
  console.log('设置标题格式')
}

const formatSpacing = () => {
  // 这里可以实现段落间距设置逻辑
  console.log('设置段落间距')
}

const formatFont = () => {
  // 这里可以实现字体设置逻辑
  console.log('设置字体')
}

// 自动排版
const autoFormat = async () => {
  if (editor.value && editor.value.quill) {
    const text = editor.value.quill.getText()
    if (text.trim()) {
      try {
        const prompt = `请对以下文本进行专业的格式排版，包括标题层级、段落间距、字体样式等，使其更加美观易读：\n${text}`
        const response = await chatWithAssistant(prompt)
        editor.value.quill.setText(response)
      } catch (error) {
        console.error('自动排版失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.format {
  width: 100%;
}

.format-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>