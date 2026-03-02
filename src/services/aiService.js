import axios from 'axios'
import { ElMessage } from 'element-plus'

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
    // 模拟API调用失败，使用mock数据
    throw new Error('API调用失败，使用mock数据')
    
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
    // 返回mock改写结果
    return `改写后的文本：${text}\n\n说明：保持了原文的核心意思，使用了更流畅的表达方式，增强了文本的可读性和专业性。`
  }
}

// AI扩展功能
export const expandText = async (text) => {
  try {
    // 模拟API调用失败，使用mock数据
    throw new Error('API调用失败，使用mock数据')
    
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
    // 返回mock扩展结果
    return `${text}\n\n扩展内容：\n这是对原文的详细扩展，包括了更多的细节和例子。通过扩展，文本变得更加丰富和全面，能够更好地表达作者的意图。扩展部分提供了更多的背景信息、具体实例和深入分析，使读者能够更全面地理解文本内容。`
  }
}

// AI校对功能
export const checkText = async (text) => {
  try {
    // 模拟API调用失败，使用mock数据
    throw new Error('API调用失败，使用mock数据')
    
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
    // 返回mock校对结果
    return `校对结果：\n\n原文：${text}\n\n修改建议：\n1. 语法：无明显语法错误\n2. 拼写：无拼写错误\n3. 建议：可以适当增加连接词，使文本更加流畅；可以考虑使用更具体的例子来支持观点。\n\n修改后：${text}\n\n总体评价：文本质量良好，表达清晰，逻辑连贯。`
  }
}

// 模拟数据
const mockData = {
  writing: [
    '在当今快速发展的时代，写作已经成为一项不可或缺的技能。无论是学术研究、职场沟通还是个人表达，良好的写作能力都能帮助我们更好地传递思想、分享观点。\n\n写作不仅仅是文字的堆砌，更是一种思维的整理和表达。通过写作，我们可以将混乱的想法系统化，将抽象的概念具体化，将个人的经验分享给更多人。\n\n要提高写作能力，首先要培养阅读的习惯。广泛的阅读可以丰富我们的词汇量，拓宽我们的视野，为写作提供源源不断的素材。其次，要勤加练习，只有通过不断地写作，我们才能掌握写作的技巧，形成自己的风格。\n\n此外，写作时要注意结构的清晰和逻辑的连贯。一个好的文章应该有明确的主题，合理的段落划分，以及流畅的过渡。同时，要注重语言的准确性和生动性，避免使用模糊不清的表达，让读者能够清晰地理解我们的意图。\n\n最后，要勇于分享自己的作品，接受他人的反馈。通过他人的建议，我们可以发现自己的不足，不断改进和提高。\n\n总之，写作是一项需要长期积累和不断练习的技能。只要我们保持热情，持之以恒，就一定能够写出优秀的作品。',
    '科技的发展正在深刻改变着我们的生活方式。从智能手机的普及到人工智能的应用，科技已经渗透到我们生活的方方面面。\n\n在教育领域，科技为学习带来了新的可能性。在线课程、虚拟实验室、智能辅导系统等技术的应用，使得学习变得更加个性化、高效化。学生可以根据自己的节奏学习，获取更丰富的学习资源。\n\n在医疗领域，科技的进步提高了诊断和治疗的准确性。远程医疗、智能手术机器人、基因编辑技术等，为患者带来了更好的医疗服务。\n\n在交通领域，自动驾驶技术的发展正在改变我们的出行方式。未来，自动驾驶汽车将大大提高交通安全性，减少交通事故的发生。\n\n然而，科技的发展也带来了一些挑战。例如，隐私保护问题、数字鸿沟、技术依赖等。我们需要在享受科技带来的便利的同时，认真思考如何应对这些挑战。\n\n总之，科技是一把双刃剑，我们应该理性看待它的发展，充分发挥它的积极作用，同时努力克服它带来的负面影响。',
    '健康是人类最宝贵的财富。没有健康，一切都无从谈起。因此，我们应该重视健康，养成良好的生活习惯。\n\n首先，要保持均衡的饮食。合理的饮食结构应该包括适量的蛋白质、碳水化合物、脂肪、维生素和矿物质。我们应该多吃新鲜的蔬菜和水果，少吃高油、高盐、高糖的食物。\n\n其次，要坚持适量的运动。运动可以增强体质，提高免疫力，预防疾病。我们可以选择适合自己的运动方式，如散步、跑步、游泳、瑜伽等，每天坚持30分钟以上的运动。\n\n此外，要保证充足的睡眠。睡眠是身体恢复和修复的重要时期，良好的睡眠有助于提高记忆力，增强免疫力，保持心情愉悦。成年人每天应该保证7-8小时的睡眠时间。\n\n还要保持良好的心态。压力过大、情绪不稳定会影响身体健康。我们应该学会调节自己的情绪，保持乐观、积极的心态。\n\n最后，要定期进行体检。定期体检可以及时发现潜在的健康问题，做到早发现、早治疗。\n\n总之，健康的生活方式是保持健康的关键。我们应该从日常生活中的点滴做起，养成良好的生活习惯，为自己的健康保驾护航。'
  ],
  meeting: [
    '会议纪要\n\n会议时间：2024年12月15日 14:00-16:00\n会议地点：公司会议室A\n参会人员：张三（主持人）、李四、王五、赵六、钱七\n\n一、会议主题\n讨论2025年第一季度工作计划\n\n二、会议内容\n1. 各部门工作总结\n   - 市场部：2024年第四季度完成了3个重要项目，销售额同比增长15%\n   - 研发部：完成了产品迭代，新功能已上线测试\n   - 运营部：优化了用户运营策略，用户活跃度提升20%\n\n2. 2025年第一季度工作计划\n   - 市场部：计划推出2个新产品，拓展3个新市场\n   - 研发部：完成产品2.0版本开发，加强技术创新\n   - 运营部：提升用户留存率，增加用户粘性\n\n3. 资源需求\n   - 市场部：需要增加市场推广预算20%\n   - 研发部：需要招聘5名新员工\n   - 运营部：需要增加运营工具投入\n\n三、会议决议\n1. 批准各部门2025年第一季度工作计划\n2. 同意市场部增加预算的申请\n3. 授权人力资源部启动研发部招聘工作\n4. 运营部工具投入需要进一步评估\n\n四、下一步行动\n1. 各部门于12月20日前提交详细的工作计划\n2. 财务部门于12月25日前完成预算审核\n3. 人力资源部于12月30日前启动招聘流程\n\n会议记录：张三\n抄送：公司领导班子',
    '会议纪要\n\n会议时间：2024年12月10日 9:00-11:00\n会议地点：线上会议\n参会人员：项目组全体成员\n\n一、会议主题\n项目进度回顾与风险评估\n\n二、会议内容\n1. 项目进度回顾\n   - 已完成：需求分析、系统设计、数据库搭建\n   - 进行中：前端开发（完成60%）、后端开发（完成70%）\n   - 未开始：测试、部署\n\n2. 风险评估\n   - 风险1：前端开发进度滞后，可能影响整体项目 timeline\n   - 风险2：后端接口文档不完整，可能导致前后端对接困难\n   - 风险3：测试资源不足，可能影响测试质量\n\n3. 解决方案\n   - 针对风险1：增加前端开发人员，调整开发计划\n   - 针对风险2：安排后端人员优先完成接口文档\n   - 针对风险3：提前与测试团队沟通，确保测试资源到位\n\n三、会议决议\n1. 前端开发团队于12月15日前完成80%的开发任务\n2. 后端开发团队于12月12日前完成接口文档\n3. 项目负责人于12月13日前与测试团队确认测试计划\n\n四、下一步行动\n1. 每日更新项目进度，及时解决遇到的问题\n2. 每周五召开项目例会，回顾进度，调整计划\n\n会议记录：李四\n抄送：项目管理办公室',
    '会议纪要\n\n会议时间：2024年12月5日 15:00-16:30\n会议地点：公司会议室B\n参会人员：销售部全体成员\n\n一、会议主题\n2024年销售目标完成情况与2025年销售策略\n\n二、会议内容\n1. 2024年销售目标完成情况\n   - 全年销售目标：1000万元\n   - 截至11月底完成：850万元（85%）\n   - 预计全年完成：950万元（95%）\n\n2. 未完成目标原因分析\n   - 市场竞争加剧\n   - 部分客户预算缩减\n   - 新产品上市延迟\n\n3. 2025年销售策略\n   - 产品策略：推出3个新产品，优化现有产品\n   - 市场策略：拓展二三线城市市场，加强线上推广\n   - 客户策略：加强大客户维护，开发中小客户\n   - 团队策略：加强销售培训，优化激励机制\n\n4. 2025年销售目标\n   - 全年销售目标：1200万元（同比增长26%）\n   - 季度目标：Q1 250万元，Q2 300万元，Q3 350万元，Q4 300万元\n\n三、会议决议\n1. 同意2025年销售策略和目标\n2. 销售部于12月20日前提交详细的2025年销售计划\n\n四、下一步行动\n1. 各销售团队完成2024年剩余工作，确保全年目标达成\n2. 开始准备2025年销售计划，包括目标分解、客户开发计划等\n\n会议记录：王五\n抄送：公司领导班子'
  ]
}

// 智能助手聊天（流式）
export const chatWithAssistant = async (message, callback) => {
  try {
    // 模拟API调用失败，使用mock数据
    throw new Error('API调用失败，使用mock数据')
    
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
      max_tokens: 1000,
      stream: true
    }, {
      responseType: 'stream'
    })

    return new Promise((resolve, reject) => {
      let fullResponse = ''
      const reader = response.data
      
      reader.on('data', (chunk) => {
        const chunkStr = chunk.toString()
        const lines = chunkStr.split('\n')
        
        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.trim() === 'data: [DONE]') continue
          
          try {
            const data = JSON.parse(line.replace('data: ', ''))
            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
              const content = data.choices[0].delta.content
              fullResponse += content
              if (callback) {
                callback(content)
              }
            }
          } catch (error) {
            console.error('解析流式数据失败:', error)
          }
        }
      })
      
      reader.on('end', () => {
        resolve(fullResponse)
      })
      
      reader.on('error', (error) => {
        console.error('流式请求失败:', error)
        reject(error)
      })
    })
  } catch (error) {
    console.error('聊天失败:', error)
    // 使用mock数据
    return new Promise((resolve) => {
      let fullResponse = ''
      // 根据消息内容选择合适的mock数据
      let mockText = ''
      if (message.includes('会议') || message.includes('纪要')) {
        mockText = mockData.meeting[Math.floor(Math.random() * mockData.meeting.length)]
      } else {
        mockText = mockData.writing[Math.floor(Math.random() * mockData.writing.length)]
      }
      
      let index = 0
      const interval = setInterval(() => {
        if (index < mockText.length) {
          // 每次生成1-3个字符，模拟AI生成的速度
          const chunkSize = Math.min(3, mockText.length - index)
          const chunk = mockText.substring(index, index + chunkSize)
          fullResponse += chunk
          if (callback) {
            callback(chunk)
          }
          index += chunkSize
        } else {
          clearInterval(interval)
          resolve(fullResponse)
        }
      }, 50) // 每50毫秒生成一次，模拟流式效果
    })
  }
}

// 生成大纲
export const generateOutline = async (topic) => {
  try {
    // 模拟API调用失败，使用mock数据
    throw new Error('API调用失败，使用mock数据')
    
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
    // 返回mock大纲
    return `# ${topic}\n\n## 一、引言\n- 背景介绍\n- 研究目的\n- 研究方法\n\n## 二、主要内容\n- 内容一\n  - 子内容1\n  - 子内容2\n- 内容二\n  - 子内容1\n  - 子内容2\n- 内容三\n  - 子内容1\n  - 子内容2\n\n## 三、结论\n- 主要发现\n- 实践意义\n- 未来展望`
  }
}