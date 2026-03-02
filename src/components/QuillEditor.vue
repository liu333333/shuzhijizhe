<template>
  <div class="quill-editor-container">
    <div ref="editorRef" class="quill-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'selection-change'])

const editorRef = ref(null)
const quillInstance = ref(null)

onMounted(() => {
  // 初始化Quill编辑器
  quillInstance.value = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // 加粗, 斜体, 下划线, 删除线
        ['blockquote', 'code-block'],                     // 引用, 代码块
        [{ 'header': 1 }, { 'header': 2 }],              // 标题
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // 列表
        [{ 'script': 'sub'}, { 'script': 'super' }],     // 上标, 下标
        [{ 'indent': '-1'}, { 'indent': '+1' }],         // 缩进
        [{ 'direction': 'rtl' }],                        // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // 标题级别
        [{ 'color': [] }, { 'background': [] }],         // 字体颜色, 背景颜色
        [{ 'font': [] }],                                // 字体
        [{ 'align': [] }],                               // 对齐方式
        ['clean']                                        // 清除格式
      ]
    },
    placeholder: '开始写作...',
  })

  // 监听文本变化
  quillInstance.value.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user') {
      emit('update:modelValue', quillInstance.value.root.innerHTML)
    }
  })

  // 监听选择变化
  quillInstance.value.on('selection-change', (range, oldRange, source) => {
    emit('selection-change', range, oldRange, source)
  })

  // 设置初始内容
  if (props.modelValue) {
    quillInstance.value.root.innerHTML = props.modelValue
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (quillInstance.value && newValue !== quillInstance.value.root.innerHTML) {
    quillInstance.value.root.innerHTML = newValue
  }
})

// 暴露编辑器实例
defineExpose({
  quill: quillInstance
})
</script>

<style scoped>
.quill-editor-container {
  position: relative;
  margin-top: 1rem;
}

.quill-editor {
  min-height: 400px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
}

.ql-container {
  font-size: 16px;
  min-height: 400px;
}

.ql-editor {
  padding: 1rem;
  line-height: 1.6;
}

/* 自定义Quill工具栏样式 */
.ql-toolbar {
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  border-bottom: 1px solid var(--border-color);
}

.ql-snow .ql-toolbar button:hover,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  color: var(--primary-color);
}

.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
  fill: var(--primary-color);
}

.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke {
  stroke: var(--primary-color);
}
</style>