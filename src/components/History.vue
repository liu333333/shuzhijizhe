<template>
  <div class="history">
    <h2>历史记录</h2>
    <div class="history-filters">
      <input 
        type="text" 
        v-model="searchKeyword" 
        placeholder="搜索历史稿件..."
        class="search-input"
      />
      <select v-model="filterType" class="filter-select">
        <option value="all">全部类型</option>
        <option value="quick-write">快速写作</option>
        <option value="meeting">会议纪要</option>
        <option value="draft-write">以稿写稿</option>
      </select>
    </div>
    <div class="history-list">
      <div 
        v-for="item in filteredHistory" 
        :key="item.id"
        class="history-item"
        @click="loadHistory(item)"
      >
        <div class="history-item-header">
          <h3>{{ item.title }}</h3>
          <span class="history-date">{{ formatDate(item.createdAt) }}</span>
        </div>
        <div class="history-item-content">
          <p>{{ truncateText(item.content, 100) }}</p>
        </div>
        <div class="history-item-footer">
          <span class="history-type">{{ getTypeLabel(item.type) }}</span>
          <button class="btn btn-sm btn-danger" @click.stop="deleteHistory(item.id)">删除</button>
        </div>
      </div>
      <div v-if="filteredHistory.length === 0" class="empty-history">
        <p>暂无历史记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['load-history'])

const searchKeyword = ref('')
const filterType = ref('all')
const history = ref([])

// 计算过滤后的历史记录
const filteredHistory = computed(() => {
  return history.value.filter(item => {
    const matchesKeyword = item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                        item.content.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesType = filterType.value === 'all' || item.type === filterType.value
    return matchesKeyword && matchesType
  })
})

// 加载历史记录
const loadHistoryFromStorage = () => {
  const savedHistory = localStorage.getItem('writingHistory')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
}

// 保存历史记录
const saveHistoryToStorage = () => {
  localStorage.setItem('writingHistory', JSON.stringify(history.value))
}

// 加载历史稿件
const loadHistory = (item) => {
  emit('load-history', item)
}

// 删除历史记录
const deleteHistory = (id) => {
  history.value = history.value.filter(item => item.id !== id)
  saveHistoryToStorage()
  ElMessage.success('历史记录已删除')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 截断文本
const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// 获取类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    'quick-write': '快速写作',
    'meeting': '会议纪要',
    'draft-write': '以稿写稿',
    'step-write': '步骤式写作'
  }
  return typeMap[type] || type
}

// 添加历史记录（供父组件调用）
const addHistory = (item) => {
  const newItem = {
    id: Date.now().toString(),
    title: item.title || '未命名文档',
    content: item.content || '',
    type: item.type || 'quick-write',
    createdAt: new Date().toISOString()
  }
  history.value.unshift(newItem)
  saveHistoryToStorage()
  ElMessage.success('历史记录已保存')
}

// 初始化
onMounted(() => {
  loadHistoryFromStorage()
})

// 暴露方法
defineExpose({
  addHistory
})
</script>

<style scoped>
.history {
  width: 100%;
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-width: 120px;
}

.history-list {
  margin-top: 1rem;
}

.history-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.history-item:hover {
  box-shadow: var(--hover-shadow);
  transform: translateY(-2px);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-item-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.history-date {
  font-size: 0.875rem;
  color: var(--light-text);
}

.history-item-content {
  margin-bottom: 0.5rem;
  line-height: 1.4;
  color: var(--light-text);
}

.history-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.history-type {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(67, 97, 238, 0.1);
  border-radius: 12px;
  color: var(--primary-color);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-danger:hover {
  background-color: #c82333;
}

.empty-history {
  text-align: center;
  padding: 3rem;
  color: var(--light-text);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius);
}
</style>