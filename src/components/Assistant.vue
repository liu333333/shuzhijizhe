<template>
  <div class="assistant">
    <h2>智能助手</h2>
    <div class="ai-chat">
      <div class="chat-messages">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="message.role"
        >
          {{ message.content }}
        </div>
      </div>
      <div class="chat-input">
        <input 
          type="text" 
          v-model="userInput" 
          placeholder="输入你的问题..."
          class="form-input"
          @keyup.enter="sendMessage"
        />
        <button class="btn btn-primary" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { chatWithAssistant } from '../services/aiService.js'

const userInput = ref('')
const messages = ref([
  {
    role: 'ai',
    content: '你好，我是你的智能写作助手，有什么可以帮助你的吗？'
  }
])

// 发送消息
const sendMessage = async () => {
  if (userInput.value.trim()) {
    // 添加用户消息
    messages.value.push({
      role: 'user',
      content: userInput.value
    })
    
    try {
      // 发送到AI
      const response = await chatWithAssistant(userInput.value)
      // 添加AI回复
      messages.value.push({
        role: 'ai',
        content: response
      })
    } catch (error) {
      console.error('聊天失败:', error)
      // 添加错误消息
      messages.value.push({
        role: 'ai',
        content: '抱歉，我暂时无法回答你的问题，请重试'
      })
    }
    
    userInput.value = ''
  }
}
</script>

<style scoped>
.assistant {
  width: 100%;
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
  max-width: 80%;
}

.message.ai {
  background-color: rgba(67, 97, 238, 0.1);
  align-self: flex-start;
}

.message.user {
  background-color: rgba(76, 201, 240, 0.1);
  align-self: flex-end;
  margin-left: auto;
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