<template>
  <div class="quill-editor-container">
    <div ref="editorRef" class="quill-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
const icons = Quill.import('ui/icons');

// 一键排版图标 (类似魔法棒或对齐文档)
icons['layout'] = `
<svg viewBox="0 0 18 18">
  <line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"></line>
  <line class="ql-stroke" x1="3" x2="11" y1="9" y2="9"></line>
  <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
  <path class="ql-fill" d="M15.5,7.5 L14.7,9.2 L13,10 L14.7,10.8 L15.5,12.5 L16.3,10.8 L18,10 L16.3,9.2 Z"></path>
</svg>`;

// 清除空格图标 (类似带有斜杠的空格符号)
icons['clearSpace'] = `
<svg viewBox="0 0 18 18">
  <path class="ql-stroke" d="M3,9 L15,9"></path>
  <path class="ql-stroke" d="M3,7 L3,11"></path>
  <path class="ql-stroke" d="M15,7 L15,11"></path>
  <line class="ql-stroke" x1="5" x2="13" y1="14" y2="4"></line>
</svg>`;

icons['formatPainter'] = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="20" height="20">
  <title>格式化的SVG示例</title>
  <desc>一个展示多种SVG元素（渐变、矩形、圆形、路径、文本）的图像</desc>

  <!-- 定义渐变等资源 -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffcc33" />
      <stop offset="100%" stop-color="#ff9933" />
    </linearGradient>
  </defs>

  <!-- 文本样式（带黑色描边，提高可读性） -->
  <style>
    .text {
      font-size: 14px;
      fill: white;
      font-family: Arial, sans-serif;
      text-anchor: middle;
      stroke: black;
      stroke-width: 0.5;
      paint-order: stroke;
    }
  </style>

  <!-- 背景圆角矩形，填充线性渐变 -->
  <rect x="10" y="10" width="180" height="180" rx="20" fill="url(#grad1)" stroke="#333" stroke-width="2" />

  <!-- 半透明圆形，增加层次感 -->
  <circle cx="100" cy="80" r="30" fill="#ffffff80" stroke="#fff" stroke-width="2" />

  <!-- 星形路径（封闭图形） -->
  <path d="M 100,30 L 118,70 L 162,70 L 127,96 L 144,140 L 100,112 L 56,140 L 73,96 L 38,70 L 82,70 Z" fill="yellow" stroke="orange" stroke-width="1.5" />

  <!-- 居中的欢迎文字 -->
  <text x="100" y="150" class="text">Hello, SVG!</text>
</svg>`;


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'selection-change', 'contextmenu-event', 'text-change'])

const editorRef = ref(null)
let quillInstance = null

onMounted(() => {
  // 初始化Quill编辑器
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // 加粗, 斜体, 下划线, 删除线
          ['blockquote', 'code-block'],                     // 引用, 代码块
          [{ 'header': 1 }, { 'header': 2 }],              // 标题
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // 列表
          [{ 'script': 'sub'}, { 'script': 'super' }],     // 上标, 下标
          [{ 'indent': '-1'}, { 'indent': '+1' }],         // 缩进
          [{ 'direction': 'rtl' }],                        // 文本方向
          [{ 'size': ['small', 'normal', 'large', 'huge', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'] }], // 字体大小
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // 标题级别
          [{ 'color': [] }, { 'background': [] }],         // 字体颜色, 背景颜色
          [{ 'font': [] }],                                // 字体
          [{ 'align': [] }],                               // 对齐方式
          ['image', 'video'],                              // 图片, 视频
          ['layout'],                                      // 一键排版
          ['clearSpace'],                                  // 清除空格
          ['formatPainter'],                               // 格式刷
          ['clean']                                        // 清除格式
        ],
        handlers: {
          'image': function() {
            // 图片上传功能
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function() {
              const file = this.files[0];
              if (file) {
                // 创建FileReader读取文件
                const reader = new FileReader();
                reader.onload = function(e) {
                  // 获取base64编码的图片数据
                  const imageUrl = e.target.result;
                  // 在编辑器中插入图片
                  const selection = quillInstance.getSelection();
                  quillInstance.insertEmbed(selection.index, 'image', imageUrl);
                  quillInstance.setSelection(selection.index + 1);
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          },
          'video': function() {
            // 视频上传功能
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'video/*');
            input.onchange = function() {
              const file = this.files[0];
              if (file) {
                // 创建FileReader读取文件
                const reader = new FileReader();
                reader.onload = function(e) {
                  // 获取base64编码的视频数据
                  const videoUrl = e.target.result;
                  // 在编辑器中插入视频
                  const selection = quillInstance.getSelection();
                  quillInstance.insertEmbed(selection.index, 'video', videoUrl);
                  quillInstance.setSelection(selection.index + 1);
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          },
          'layout': function() {
            // 一键排版功能
            const contents = quillInstance.getContents();
            if (contents.ops && contents.ops.length > 0) {
              const newOps = [];
              let currentText = '';
              
              // 遍历所有操作，处理文本和保留其他内容（如图片）
              contents.ops.forEach(op => {
                if (op.insert && typeof op.insert === 'string') {
                  // 处理文本内容
                  currentText += op.insert;
                } else if (op.insert) {
                  // 处理非文本内容（如图片）
                  // 先处理之前积累的文本
                  if (currentText) {
                    // 基本排版：移除多余空行，确保段落间有一个空行
                    let formattedText = currentText
                      .replace(/\n\s*\n\s*\n+/g, '\n\n') // 多个空行替换为一个
                      .replace(/^\s+|\s+$/g, '') // 移除首尾空格
                      .replace(/\s+\n/g, '\n'); // 行尾空格
                    // 注意：移除了行首空格的替换，保留缩进
                    
                    // 为每个段落添加首行缩进
                    const paragraphs = formattedText.split(/\n/);
                    paragraphs.forEach((paragraph, index) => {
                      if (paragraph.trim()) {
                        // 添加缩进和段落文本，每个段落以换行结束
                        newOps.push({ insert: '    ' + paragraph + '\n' });
                      } else {
                        // 添加空行
                        newOps.push({ insert: '\n' });
                      }
                    });
                    currentText = '';
                  }
                  // 保留非文本内容
                  newOps.push(op);
                }
              });
              
              // 处理最后积累的文本
              if (currentText) {
                // 基本排版：移除多余空行，确保段落间有一个空行
                let formattedText = currentText
                  .replace(/\n\s*\n\s*\n+/g, '\n\n') // 多个空行替换为一个
                  .replace(/^\s+|\s+$/g, '') // 移除首尾空格
                  .replace(/\s+\n/g, '\n'); // 行尾空格
                // 注意：移除了行首空格的替换，保留缩进
                
                // 为每个段落添加首行缩进
                const paragraphs = formattedText.split(/\n/);
                paragraphs.forEach((paragraph, index) => {
                  if (paragraph.trim()) {
                    // 添加缩进和段落文本，每个段落以换行结束
                    newOps.push({ insert: '    ' + paragraph + '\n' });
                  } else {
                    // 添加空行
                    newOps.push({ insert: '\n' });
                  }
                });
              }
              
              // 保存当前光标位置
              const selection = quillInstance.getSelection();
              
              // 清空并重新插入格式化后的内容
              quillInstance.setContents({ ops: newOps });
              
              // 恢复光标位置（如果有选择）
              if (selection) {
                const newIndex = Math.min(selection.index, quillInstance.getLength() - 1);
                quillInstance.setSelection(newIndex, 0);
              }
            }
          },
          'clearSpace': function() {
            // 清除空格功能
            const contents = quillInstance.getContents();
            if (contents.ops && contents.ops.length > 0) {
              const newOps = [];
              
              // 遍历所有操作，处理文本和保留其他内容（如图片）
              contents.ops.forEach(op => {
                if (op.insert && typeof op.insert === 'string') {
                  // 处理文本内容，移除多余空格
                  let cleanedText = op.insert
                    .replace(/\s+/g, ' ') // 多个空格替换为一个
                    .replace(/\s+\n/g, '\n') // 行尾空格
                    .replace(/\n\s+/g, '\n') // 行首空格
                    .replace(/^\s+|\s+$/g, ''); // 首尾空格
                  
                  if (cleanedText) {
                    newOps.push({ insert: cleanedText });
                  }
                } else if (op.insert) {
                  // 保留非文本内容
                  newOps.push(op);
                }
              });
              
              // 保存当前光标位置
              const selection = quillInstance.getSelection();
              
              // 清空并重新插入清理后的内容
              quillInstance.setContents({ ops: newOps });
              
              // 恢复光标位置（如果有选择）
              if (selection) {
                const newIndex = Math.min(selection.index, quillInstance.getLength() - 1);
                quillInstance.setSelection(newIndex, 0);
              }
            }
          },
          'formatPainter': function() {
            // 格式刷功能
            console.log('Format painter clicked');
            
            // 检查是否有选中的文本
            const selection = quillInstance.getSelection();
            console.log('Selection:', selection);
            
            if (selection && selection.length > 0) {
              // 复制选中区域的格式
              formatPainterFormat = quillInstance.getFormat(selection.index, selection.length);
              console.log('Copied format:', formatPainterFormat);
              formatPainterActive = true;
              // 视觉反馈：改变按钮样式
              const formatPainterBtn = document.querySelector('.ql-formatPainter');
              console.log('Format painter button:', formatPainterBtn);
              if (formatPainterBtn) {
                formatPainterBtn.classList.add('ql-active');
                console.log('Button activated - ready to apply format');
              }
            } else {
              console.log('No selection to copy format from');
            }
          }
        }
      }
    },
    placeholder: '开始写作...',
  })

  // 格式刷状态变量
  let formatPainterActive = false;
  let formatPainterFormat = null;

  // 监听文本变化
  quillInstance.on('text-change', (delta, oldDelta, source) => {
    emit('text-change', delta, oldDelta, source)
    if (source === 'user') {
      emit('update:modelValue', quillInstance.root.innerHTML)
    }
  })

  // 监听选择变化
  quillInstance.on('selection-change', (range, oldRange, source) => {
    emit('selection-change', range, oldRange, source)
    
    // 格式刷功能：当激活时，自动应用格式到新的选择
    if (formatPainterActive && range && range.length > 0 && formatPainterFormat) {
      console.log('Applying format to new selection:', range);
      // 应用保存的格式 - 逐个应用每个格式属性
      Object.keys(formatPainterFormat).forEach(format => {
        console.log('Applying format:', format, formatPainterFormat[format]);
        quillInstance.format(format, formatPainterFormat[format]);
      });
      
      // 应用后重置状态
      formatPainterActive = false;
      formatPainterFormat = null;
      // 视觉反馈：恢复按钮样式
      const formatPainterBtn = document.querySelector('.ql-formatPainter');
      if (formatPainterBtn) {
        formatPainterBtn.classList.remove('ql-active');
        console.log('Button deactivated after applying format');
      }
    }
  })

  // 监听右键点击事件
  quillInstance.root.addEventListener('contextmenu', (e) => {
    emit('contextmenu-event', e)
  })

  // 设置初始内容
  if (props.modelValue) {
    // 使用Quill的API设置内容，而不是直接修改innerHTML
    quillInstance.setContents([])
    quillInstance.insertText(0, props.modelValue)
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (quillInstance && newValue !== quillInstance.root.innerHTML) {
    // 使用Quill的API设置内容，而不是直接修改innerHTML
    quillInstance.setContents([])
    quillInstance.insertText(0, newValue)
  }
})

// 暴露编辑器实例
defineExpose({
  get quill() {
    return quillInstance
  }
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