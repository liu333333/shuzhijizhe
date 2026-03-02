import axios from 'axios'

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-f60489f1d6344f92a91bb20f55aa1719'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 创建axios实例
const aiClient = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
  }
})

// AI改写功能
export const rewriteText = async (text) => {
  try {
    const response = await aiClient.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文本改写助手，能够保持原意的同时，用更流畅、更专业的语言重写文本。'
        },
        {
          role: 'user',
          content: `请重写以下文本，保持原意：\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('改写失败:', error)
    return text
  }
}

// AI扩展功能
export const expandText = async (text) => {
  try {
    const response = await aiClient.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文本扩展助手，能够基于给定的文本，提供更详细、更丰富的内容。'
        },
        {
          role: 'user',
          content: `请扩展以下文本，使其更详细、更丰富：\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('扩展失败:', error)
    return text
  }
}

// AI校对功能
export const checkText = async (text) => {
  try {
    const response = await aiClient.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的文本校对助手，能够检查文本中的语法错误、拼写错误，并提供改进建议。'
        },
        {
          role: 'user',
          content: `请校对以下文本，指出错误并提供改进建议：\n${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('校对失败:', error)
    return '校对失败，请重试'
  }
}

// 智能助手聊天
export const chatWithAssistant = async (message) => {
  try {
    const response = await aiClient.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的写作助手，能够帮助用户解决各种写作问题，提供创意建议和写作技巧。'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('聊天失败:', error)
    return '抱歉，我暂时无法回答你的问题，请重试'
  }
}

// 生成大纲
export const generateOutline = async (topic) => {
  try {
    const response = await aiClient.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的写作大纲生成助手，能够基于给定的主题，生成详细的写作大纲。'
        },
        {
          role: 'user',
          content: `请为以下主题生成详细的写作大纲：\n${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('大纲生成失败:', error)
    return '大纲生成失败，请重试'
  }
}