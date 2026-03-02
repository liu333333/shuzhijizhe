<template>
  <div class="template">
    <h2>自定义模板</h2>
    <div class="template-list">
      <div 
        v-for="item in templates" 
        :key="item.id"
        class="template-item"
        @click="selectTemplate(item)"
      >
        {{ item.name }}
      </div>
      <div class="template-item create-template" @click="createTemplate">
        创建模板
      </div>
    </div>
    <div class="template-content" v-if="selectedTemplate">
      <h3>{{ selectedTemplate.name }}</h3>
      <QuillEditor ref="editor" />
      <div class="toolbar">
        <button class="btn btn-secondary" @click="saveTemplate">保存模板</button>
        <button class="btn btn-primary" @click="useTemplate">使用模板</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'

const editor = ref(null)
const selectedTemplate = ref(null)

// 模板列表
const templates = [
  { id: 1, name: '会议纪要' },
  { id: 2, name: '工作报告' },
  { id: 3, name: '新闻稿' },
  { id: 4, name: '产品介绍' },
  { id: 5, name: '活动策划' },
  { id: 6, name: '个人简历' }
]

// 选择模板
const selectTemplate = (template) => {
  selectedTemplate.value = template
  // 这里可以加载模板内容
  console.log('选择模板:', template.name)
}

// 创建模板
const createTemplate = () => {
  const templateName = prompt('请输入模板名称:')
  if (templateName) {
    const newTemplate = {
      id: templates.length + 1,
      name: templateName
    }
    templates.push(newTemplate)
    selectedTemplate.value = newTemplate
  }
}

// 保存模板
const saveTemplate = () => {
  if (selectedTemplate.value && editor.value && editor.value.quill) {
    const content = editor.value.quill.getText()
    // 这里可以实现模板保存逻辑
    console.log('保存模板:', selectedTemplate.value.name, content)
  }
}

// 使用模板
const useTemplate = () => {
  if (selectedTemplate.value && editor.value && editor.value.quill) {
    // 这里可以实现模板使用逻辑
    console.log('使用模板:', selectedTemplate.value.name)
  }
}
</script>

<style scoped>
.template {
  width: 100%;
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

.create-template {
  background-color: rgba(67, 97, 238, 0.05);
  border-style: dashed;
}

.template-content {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>