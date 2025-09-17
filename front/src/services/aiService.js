import { AI_CONFIG } from '@/config/ai.js'

/**
 * AI服务 - 处理与DeepSeek API的交互
 */
export class AIService {
  constructor() {
    this.apiKey = AI_CONFIG.DEEPSEEK_API_KEY
    this.apiUrl = AI_CONFIG.DEEPSEEK_API_URL
    this.model = AI_CONFIG.MODEL
    
    // 检查API密钥是否配置
    if (!this.apiKey) {
      console.warn('DeepSeek API密钥未配置，请在环境变量中设置 VITE_DEEPSEEK_API_KEY')
    }
  }

  /**
   * 测试API连接
   * @returns {Promise<boolean>} 连接是否成功
   */
  async testConnection() {
    try {
      const testMessages = [{
        role: 'user',
        content: '你好'
      }]
      
      await this.sendMessage(testMessages)
      return true
    } catch (error) {
      console.error('API连接测试失败:', error)
      return false
    }
  }

  /**
   * 发送消息到DeepSeek API (流式输出)
   * @param {Array} messages - 消息历史数组
   * @param {Function} onChunk - 处理流式数据的回调函数
   * @param {Object} options - 可选配置
   * @returns {Promise<string>} AI回复完整内容
   */
  async sendMessageStream(messages, onChunk, options = {}) {
    // 检查API密钥是否配置
    if (!this.apiKey) {
      throw new Error('DeepSeek API密钥未配置，请在.env.local文件中设置 VITE_DEEPSEEK_API_KEY')
    }
    
    try {
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: AI_CONFIG.SYSTEM_PROMPT
          },
          ...messages
        ],
        max_tokens: options.maxTokens || AI_CONFIG.MAX_TOKENS,
        temperature: options.temperature || AI_CONFIG.TEMPERATURE,
        stream: true
      }

      console.log('发送流式请求到DeepSeek API:', {
        url: this.apiUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey ? this.apiKey.substring(0, 20) + '...' : 'API密钥未配置'}`
        },
        bodyPreview: {
          model: requestBody.model,
          messagesCount: requestBody.messages.length,
          maxTokens: requestBody.max_tokens,
          stream: true
        }
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('流式API响应状态:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API错误响应:', errorText)
        
        let errorData = {}
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.warn('无法解析错误响应为JSON')
        }
        
        throw new Error(`API请求失败: ${response.status} ${response.statusText}. ${errorData.error?.message || errorText || '未知错误'}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          console.log('流式响应完成')
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.trim() === 'data: [DONE]') continue
          
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.choices && data.choices[0] && data.choices[0].delta) {
                const content = data.choices[0].delta.content
                if (content) {
                  fullContent += content
                  // 调用回调函数处理每个文本块
                  if (onChunk) {
                    onChunk(content, fullContent)
                  }
                }
              }
            } catch (e) {
              console.warn('解析流式数据失败:', line, e)
            }
          }
        }
      }

      return fullContent
    } catch (error) {
      console.error('AI流式服务错误:', error)
      throw error
    }
  }

  /**
   * 发送消息到DeepSeek API (非流式)
   * @param {Array} messages - 消息历史数组
   * @param {Object} options - 可选配置
   * @returns {Promise<string>} AI回复内容
   */
  async sendMessage(messages, options = {}) {
    // 检查API密钥是否配置
    if (!this.apiKey) {
      throw new Error('DeepSeek API密钥未配置，请在.env.local文件中设置 VITE_DEEPSEEK_API_KEY')
    }
    
    try {
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: AI_CONFIG.SYSTEM_PROMPT
          },
          ...messages
        ],
        max_tokens: options.maxTokens || AI_CONFIG.MAX_TOKENS,
        temperature: options.temperature || AI_CONFIG.TEMPERATURE,
        stream: false
      }

      console.log('发送请求到DeepSeek API:', {
        url: this.apiUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey.substring(0, 20)}...` // 只显示部分密钥
        },
        bodyPreview: {
          model: requestBody.model,
          messagesCount: requestBody.messages.length,
          maxTokens: requestBody.max_tokens
        }
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('API响应状态:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API错误响应:', errorText)
        
        let errorData = {}
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.warn('无法解析错误响应为JSON')
        }
        
        throw new Error(`API请求失败: ${response.status} ${response.statusText}. ${errorData.error?.message || errorText || '未知错误'}`)
      }

      const data = await response.json()
      console.log('DeepSeek API响应:', data)

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content
      } else {
        throw new Error('API响应格式异常')
      }
    } catch (error) {
      console.error('AI服务错误:', error)
      throw error
    }
  }

  /**
   * 处理图片分析（如果支持）
   * @param {string} imageBase64 - 图片的base64编码
   * @param {string} question - 用户问题
   * @returns {Promise<string>} AI回复内容
   */
  async analyzeImage(imageBase64, question = '请分析这张图片中的维修问题') {
    // DeepSeek目前主要支持文本，如果需要图片分析可以描述图片内容
    const messages = [
      {
        role: 'user',
        content: `${question}\n\n用户上传了一张图片，请提供通用的维修建议。`
      }
    ]

    return await this.sendMessage(messages)
  }

  /**
   * 格式化消息历史
   * @param {Array} chatMessages - 聊天消息数组
   * @returns {Array} 格式化的消息数组
   */
  formatMessages(chatMessages) {
    return chatMessages
      .filter(msg => msg.role && msg.content) // 过滤无效消息
      .map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
      .slice(-10) // 只保留最近10条消息，避免token过多
  }
}

// 创建单例实例
export const aiService = new AIService()

export default aiService
