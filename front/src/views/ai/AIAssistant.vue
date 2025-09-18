<template>
  <div class="ai-assistant-container">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon class="title-icon"><ChatDotRound /></el-icon>
          AI维修小助手
        </h1>
        <p class="page-description">
          通过语音或文字与AI维修小助手交流，上传照片获取更精准的维修建议
        </p>
      </div>
    </div>

    <div class="chat-content">
      <!-- 聊天记录区域 -->
      <div class="chat-messages" ref="chatMessagesRef">
        <div v-if="chatMessages.length === 0" class="empty-chat">
          <div class="empty-chat-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <h3>开始与AI维修小助手对话</h3>
          <p>您可以询问维修相关问题，上传照片获取更精准的维修建议</p>
          <div class="quick-questions">
            <el-button @click="sendQuickQuestion('宿舍突然停电跳闸了怎么办？')" size="small">🔌 宿舍跳闸了</el-button>
            <el-button @click="sendQuickQuestion('水龙头漏水或水管堵塞怎么处理？')" size="small">🚿 水管问题</el-button>
            <el-button @click="sendQuickQuestion('宿舍WiFi连不上或网络很慢')" size="small">📶 网络故障</el-button>
            <el-button @click="sendQuickQuestion('门锁坏了打不开或关不上')" size="small">🚪 门锁问题</el-button>
            <el-button @click="sendQuickQuestion('空调不制冷或不工作')" size="small">❄️ 空调故障</el-button>
          </div>
          
          <!-- 语音识别模式选择 -->
          <div v-if="speechSupport.supported" class="speech-mode-selector">
            <span class="mode-label">🎤 语音识别模式:</span>
            <el-radio-group v-model="speechMode" size="small">
              <el-radio-button 
                v-if="speechSupport.webSpeech"
                label="browser"
              >
                🌐 浏览器内置
              </el-radio-button>
              <el-radio-button 
                v-if="speechSupport.mediaRecorder"
                label="qwen"
              >
                🧠 通义千问API
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <template v-else>
          <div 
            v-for="(message, index) in chatMessages" 
            :key="index" 
            :class="[
              'message-item', 
              message.role === 'user' ? 'user-message' : 'assistant-message',
              { 'error-message': message.isError },
              { 'streaming-message': message.isStreaming }
            ]"
          >
            <div class="message-avatar">
              <el-avatar :icon="message.role === 'user' ? UserFilled : ChatDotRound" :size="36" />
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div v-if="message.image" class="message-image">
                <el-image 
                  :src="getImageSrc(message.image)" 
                  :preview-src-list="[getImageSrc(message.image)]"
                  fit="cover"
                  style="width: 200px; height: 150px; border-radius: 8px;"
                />
              </div>
              <div class="message-time">{{ formatTime(message.time) }}</div>
            </div>
          </div>
        </template>
        
        <div v-if="isLoading && !isStreaming" class="loading-indicator">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <span>AI正在思考中...</span>
        </div>
        
        <div v-if="isStreaming" class="streaming-indicator">
          <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <span>小维正在输入...</span>
        </div>
      </div>
    </div>

    <!-- 输入区域 - 固定在屏幕底部 -->
    <div class="chat-input-area">
      <div class="input-container">
        <div class="input-wrapper">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="1"
            placeholder="输入您的问题，或点击下方按钮使用语音输入..."
            resize="none"
            @keyup.enter.ctrl="sendMessage"
            @keyup.enter.exact="sendMessage"
            class="chat-input"
          />
          
          <div class="input-actions">
            <el-tooltip content="上传照片" placement="top">
              <el-button 
                text 
                circle 
                @click="triggerImageUpload"
                :icon="Picture"
                class="action-btn"
              />
            </el-tooltip>
            
            <el-tooltip content="语音输入" placement="top">
              <el-button 
                text 
                circle 
                @click="toggleVoiceInput"
                :icon="Microphone"
                :class="['action-btn', { 'recording': isRecording }]"
              />
            </el-tooltip>
            
            <el-button 
              type="primary" 
              circle
              @click="sendMessage"
              :disabled="!userInput.trim() && !selectedImage"
              class="send-btn"
              :icon="isLoading ? Loading : undefined"
            >
              {{ isLoading ? '' : '发送' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <div v-if="selectedImage" class="selected-image-preview">
        <img 
          :src="selectedImageUrl" 
          alt="选择的图片"
          style="width: 100px; height: 80px; border-radius: 4px; object-fit: cover; border: 1px solid #ddd;"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <el-button 
          type="danger" 
          circle 
          size="small" 
          class="remove-image-btn"
          @click="removeSelectedImage"
          :icon="Delete"
        />
      </div>
      
      <input 
        type="file" 
        ref="imageInputRef" 
        style="display: none" 
        accept="image/*"
        @change="handleImageSelected"
      />
      
      <div v-if="isRecording" class="voice-recording-indicator">
        <div class="recording-waves">
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
        </div>
        <span>正在录音... {{ recordingTime }}秒</span>
        <el-button type="danger" size="small" @click="stopRecording">停止</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ChatDotRound, UserFilled, Picture, Microphone, Delete, Loading, VideoPlay, ArrowDown
} from '@element-plus/icons-vue'
import { aiService } from '@/services/aiService.js'
import { speechService } from '@/services/speechService.js'

// 聊天消息
const chatMessages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const isStreaming = ref(false)
const chatMessagesRef = ref(null)
const currentStreamingMessage = ref(null)

// 图片上传相关
const imageInputRef = ref(null)
const selectedImage = ref(null)
const selectedImageUrl = ref('')

// 语音输入相关
const isRecording = ref(false)
const recordingTime = ref(0)
const speechMode = ref('browser') // 'browser' | 'qwen'
const speechSupport = ref({})
const interimTranscript = ref('')
const recordingTimer = ref(null)

// 初始化语音识别和欢迎消息
onMounted(async () => {
  // 检查语音识别支持情况
  speechSupport.value = speechService.checkBrowserSupport()
  console.log('语音识别支持情况:', speechSupport.value)
  
  // 根据支持情况选择默认模式
  if (speechSupport.value.webSpeech) {
    speechMode.value = 'browser'
  } else if (speechSupport.value.mediaRecorder && speechSupport.value.getUserMedia) {
    speechMode.value = 'qwen'
  }

  // 添加欢迎消息
  chatMessages.value.push({
    role: 'assistant',
    content: '你好！我是小维，您的专属宿舍维修AI助手 🔧\n\n我可以帮助您：\n• 🔍 诊断各种宿舍设备故障\n• 💡 提供专业的维修建议\n• 📝 指导您提交维修申请\n• 🎯 判断问题的紧急程度\n\n您可以通过文字、图片或语音与我交流。有什么维修问题需要帮助吗？\n\n💬 **语音识别模式**: ' + (speechMode.value === 'browser' ? '浏览器内置识别' : speechMode.value === 'qwen' ? '通义千问API' : '不支持'),
    time: new Date()
  })
  
  // 确保初始消息也能正确滚动
  setTimeout(() => {
    scrollToBottom()
  }, 200)
})

// 滚动到底部的函数
const scrollToBottom = () => {
  if (!chatMessagesRef.value) return
  
  const element = chatMessagesRef.value
  const maxScroll = element.scrollHeight - element.clientHeight
  
  if (maxScroll > 0) {
    element.scrollTop = maxScroll
  }
}

// 监听聊天消息变化，自动滚动到底部
watch(chatMessages, () => {
  nextTick(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  })
}, { deep: true })

// 格式化消息内容（支持换行）
const formatMessage = (content) => {
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 发送快速问题
const sendQuickQuestion = (question) => {
  userInput.value = question
  sendMessage()
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() && !selectedImage.value) return
  
  // 添加用户消息
  const userMessage = {
    role: 'user',
    content: userInput.value.trim(),
    time: new Date()
  }
  
  // 保存图片文件引用（在清空之前）
  const imageFile = selectedImage.value
  let imageBase64 = null
  
  // 如果有图片，转换为base64保存
  if (imageFile) {
    try {
      imageBase64 = await convertFileToBase64(imageFile)
      userMessage.image = imageBase64
      console.log('图片已转换为base64并保存到消息中')
    } catch (error) {
      console.error('转换图片为base64失败:', error)
      ElMessage.error('图片处理失败')
      isLoading.value = false
      return
    }
  }
  
  chatMessages.value.push(userMessage)
  
  // 清空输入和图片
  userInput.value = ''
  removeSelectedImage()
  
  // 滚动到底部显示用户消息
  nextTick(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 50)
  })
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    if (userMessage.image && imageFile) {
      // 处理图片消息 (暂时使用非流式)
      console.log('开始处理图片消息:', { imageFile, userMessage })
      try {
        // 将图片文件转换为base64格式
        console.log('开始转换图片为base64...')
        const imageBase64 = await convertFileToBase64(imageFile)
        console.log('图片转换成功，base64长度:', imageBase64.length)
        
        console.log('调用AI分析图片...')
        const aiResponse = await aiService.analyzeImage(imageBase64, userMessage.content || '请帮我分析这个维修问题')
        console.log('AI分析完成:', aiResponse)
        
        // 添加AI回复
        chatMessages.value.push({
          role: 'assistant',
          content: aiResponse,
          time: new Date()
        })
        console.log('图片消息处理完成')
      } catch (imageError) {
        console.error('图片处理失败:', imageError)
        ElMessage.error('图片处理失败，请重试')
        chatMessages.value.push({
          role: 'assistant',
          content: '抱歉，图片处理失败了。请确保上传的是有效的图片文件，然后重试。',
          time: new Date(),
          isError: true
        })
      }
    } else {
      // 处理文本消息 (使用流式输出)
      const messageHistory = aiService.formatMessages(chatMessages.value)
      
      // 创建一个空的AI消息用于流式更新
      const aiMessage = {
        role: 'assistant',
        content: '',
        time: new Date(),
        isStreaming: true
      }
      
      chatMessages.value.push(aiMessage)
      currentStreamingMessage.value = aiMessage
      isStreaming.value = true
      isLoading.value = false // 停止加载指示器，开始流式指示器
      
      // 立即滚动到新消息位置
      nextTick(() => {
        setTimeout(() => {
          scrollToBottom()
        }, 50)
      })
      
      // 使用流式输出
      const fullResponse = await aiService.sendMessageStream(
        messageHistory,
        (chunk, fullContent) => {
          // 更新消息内容
          if (currentStreamingMessage.value) {
            currentStreamingMessage.value.content = fullContent
            // 实时滚动到底部
            nextTick(() => {
              scrollToBottom()
            })
          }
        }
      )
      
      // 流式完成后，标记消息为完成状态
      if (currentStreamingMessage.value) {
        currentStreamingMessage.value.isStreaming = false
        currentStreamingMessage.value.content = fullResponse
      }
    }
    
    // 滚动到底部显示最终回复
    nextTick(() => {
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    })
  } catch (error) {
    console.error('发送消息出错:', error)
    
    // 根据不同错误类型给出不同提示
    let errorMessage = '发送消息失败，请重试'
    
    if (error.message.includes('404')) {
      errorMessage = 'AI服务暂时不可用，请稍后重试'
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = 'AI服务认证失败，请检查配置'
    } else if (error.message.includes('429')) {
      errorMessage = 'AI服务请求过于频繁，请稍后重试'
    } else if (error.message.includes('网络')) {
      errorMessage = '网络连接失败，请检查网络设置'
    }
    
    ElMessage.error(errorMessage)
    
    // 添加错误提示消息到聊天记录
    chatMessages.value.push({
      role: 'assistant',
      content: `抱歉，我遇到了一些技术问题：${errorMessage}\n\n请稍后重试，或者您可以：\n• 检查网络连接\n• 刷新页面重试\n• 如果问题持续存在，请联系技术支持`,
      time: new Date(),
      isError: true
    })
  } finally {
    isLoading.value = false
    isStreaming.value = false
    currentStreamingMessage.value = null
  }
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInputRef.value.click()
}

// 处理图片选择
const handleImageSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  console.log('开始处理图片选择:', file.name, file.type, file.size)
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  
  // 检查文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }
  
  try {
    // 清理之前的blob URL
    if (selectedImageUrl.value) {
      URL.revokeObjectURL(selectedImageUrl.value)
      console.log('已清理旧的图片预览URL')
    }
    
    // 重置状态
    selectedImage.value = null
    selectedImageUrl.value = ''
    
    // 创建新的blob URL
    const newUrl = URL.createObjectURL(file)
    console.log('创建新的图片预览URL:', newUrl)
    
    // 设置新的状态
    selectedImage.value = file
    selectedImageUrl.value = newUrl
    
    console.log('图片选择处理完成')
  } catch (error) {
    console.error('图片选择处理失败:', error)
    ElMessage.error('图片选择失败: ' + error.message)
    selectedImage.value = null
    selectedImageUrl.value = ''
  }
  
  // 清空文件输入，以便再次选择同一文件
  event.target.value = ''
}

// 移除已选择的图片
const removeSelectedImage = () => {
  try {
    if (selectedImageUrl.value) {
      URL.revokeObjectURL(selectedImageUrl.value)
      console.log('已清理图片预览URL')
    }
  } catch (error) {
    console.error('清理图片预览URL失败:', error)
  }
  selectedImage.value = null
  selectedImageUrl.value = ''
}

// 图片加载成功处理
const handleImageLoad = () => {
  console.log('图片预览加载成功')
}

// 图片加载错误处理
const handleImageError = (event) => {
  console.error('图片预览加载失败:', event)
  ElMessage.error('图片预览加载失败')
}

// 获取图片源地址
const getImageSrc = (imageData) => {
  if (!imageData) return ''
  
  // 如果已经是完整的data URL，直接返回
  if (imageData.startsWith('data:')) {
    return imageData
  }
  
  // 如果是base64数据，添加data URL前缀
  return `data:image/jpeg;base64,${imageData}`
}

// 将文件转换为base64格式
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // 移除data:image/jpeg;base64,前缀，只保留base64数据
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 切换语音输入
const toggleVoiceInput = async () => {
  if (isRecording.value) {
    await stopRecording()
  } else {
    await startRecording()
  }
}

// 开始录音
const startRecording = async () => {
  if (!speechSupport.value.supported) {
    ElMessage.warning('您的浏览器不支持语音识别功能')
    return
  }
  
  try {
    isRecording.value = true
    recordingTime.value = 0
    interimTranscript.value = ''
    
    // 开始计时
    recordingTimer.value = setInterval(() => {
      recordingTime.value++
      
      // 限制录音时间为60秒
      if (recordingTime.value >= 60) {
        stopRecording()
      }
    }, 1000)
    
    if (speechMode.value === 'browser') {
      // 使用浏览器内置语音识别
      speechService.startWebSpeechRecognition(
        (result) => {
          if (result.isFinal) {
            userInput.value = result.final
            interimTranscript.value = ''
          } else {
            interimTranscript.value = result.interim
          }
        },
        (error) => {
          console.error('语音识别错误:', error)
          stopRecording()
          ElMessage.error('语音识别出错，请重试')
        },
        () => {
          stopRecording()
        }
      )
    } else if (speechMode.value === 'qwen') {
      // 使用通义千问语音识别API
      await speechService.startRecording()
    }
    
  } catch (error) {
    console.error('开始录音出错:', error)
    ElMessage.error('开始录音失败，请重试')
    isRecording.value = false
  }
}

// 停止录音
const stopRecording = async () => {
  if (!isRecording.value) return
  
  try {
    if (speechMode.value === 'browser') {
      speechService.stopWebSpeechRecognition()
    } else if (speechMode.value === 'qwen') {
      // 停止录音并获取音频数据
      const audioBlob = await speechService.stopRecording()
      
      // 显示识别中状态
      ElMessage.info('正在识别语音内容...')
      
      try {
        // 使用通义千问进行语音识别
        const transcript = await speechService.recognizeWithQwen(audioBlob)
        if (transcript) {
          userInput.value = transcript
          ElMessage.success('语音识别成功')
        } else {
          ElMessage.warning('未识别到语音内容')
        }
      } catch (error) {
        console.error('语音识别失败:', error)
        ElMessage.error('语音识别失败：' + error.message)
      }
    }
  } catch (error) {
    console.error('停止录音出错:', error)
    ElMessage.error('停止录音失败')
  } finally {
    isRecording.value = false
    interimTranscript.value = ''
    clearInterval(recordingTimer.value)
    recordingTimer.value = null
  }
}
</script>

<style scoped>
.ai-assistant-container {
  padding: 10px;
  height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
  min-height: 600px; /* 确保最小高度 */
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.page-header {
  background: white;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* 防止头部被压缩 */
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  color: #333;
}

.title-icon {
  margin-right: 8px;
  font-size: 1.5rem;
  color: #409EFF;
}

.page-description {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  margin-bottom: 140px; /* 为固定输入框预留空间 */
  min-height: 0; /* 允许flex子元素收缩 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background-color: #f9f9f9;
  scroll-behavior: smooth;
  /* 确保滚动条样式美观 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 20px;
}

.empty-chat-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #409EFF;
  opacity: 0.7;
}

.empty-chat h3 {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #333;
}

.empty-chat p {
  margin: 0 0 20px 0;
  max-width: 400px;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}

.speech-mode-selector {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%);
  border-radius: 8px;
  border: 1px solid #d0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mode-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.speech-mode-selector .el-radio-group {
  margin-left: 8px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 12px;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.user-message .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
}

.user-message .message-text {
  background-color: #409EFF;
  color: white;
  border-top-right-radius: 4px;
}

.assistant-message .message-text {
  background-color: #f0f2f5;
  color: #333;
  border-top-left-radius: 4px;
}

.error-message .message-text {
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
  border-left: 3px solid #f56c6c !important;
}

.error-message .message-avatar .el-avatar {
  background-color: #f56c6c !important;
}

.streaming-message .message-text {
  position: relative;
}

.streaming-message .message-text::after {
  content: '|';
  animation: blink 1s infinite;
  color: #409eff;
  font-weight: bold;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin: 10px 0;
  padding: 10px 15px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 12px;
  border-left: 3px solid #409eff;
}

.typing-dots {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.typing-dots .dot {
  width: 6px;
  height: 6px;
  background-color: #409eff;
  border-radius: 50%;
  margin: 0 2px;
  animation: typingDot 1.4s infinite ease-in-out;
}

.typing-dots .dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
}

.message-image {
  margin-top: 8px;
  max-width: 200px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 0.9rem;
  margin: 10px 0;
  animation: pulse 1.5s infinite;
}

.loading-icon {
  margin-right: 8px;
  animation: rotate 1s linear infinite;
}

.chat-input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, #f8f9fa 0%, rgba(248, 249, 250, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000; /* 提高层级确保在最上层 */
  margin-left: auto;
  margin-right: auto;
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  background: white;
  border-radius: 24px;
  padding: 8px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.input-wrapper:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  border-color: rgba(64, 158, 255, 0.3);
}

.input-wrapper:focus-within {
  box-shadow: 0 6px 25px rgba(64, 158, 255, 0.15);
  border-color: #409eff;
}

.chat-input {
  flex: 1;
  margin-right: 8px;
}

.chat-input :deep(.el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  resize: none !important;
  padding: 8px 0 !important;
  background: transparent !important;
  font-size: 15px !important;
  line-height: 1.5 !important;
  min-height: 20px !important;
  max-height: 120px !important;
}

.chat-input :deep(.el-textarea__inner):focus {
  border: none !important;
  box-shadow: none !important;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px !important;
  height: 36px !important;
  color: #666 !important;
  transition: all 0.2s ease !important;
}

.action-btn:hover {
  color: #409eff !important;
  background-color: rgba(64, 158, 255, 0.1) !important;
}

.send-btn {
  width: 36px !important;
  height: 36px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  background: linear-gradient(135deg, #409eff, #5dade2) !important;
  border: none !important;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #337ecc, #4a90c2) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4) !important;
}

.send-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.recording {
  color: #f56c6c !important;
  background-color: rgba(245, 108, 108, 0.1) !important;
  animation: pulse 1s infinite !important;
}

.selected-image-preview {
  margin-top: 12px;
  position: relative;
  display: inline-block;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px;
}

.voice-recording-indicator {
  margin-top: 12px;
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  padding: 8px 12px;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

.recording-waves {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.wave {
  width: 3px;
  height: 15px;
  background-color: #f56c6c;
  margin: 0 2px;
  border-radius: 2px;
  animation: wave 1s infinite ease-in-out;
}

.wave:nth-child(2) {
  animation-delay: 0.2s;
}

.wave:nth-child(3) {
  animation-delay: 0.4s;
}

.recording {
  background-color: #f56c6c !important;
  animation: pulse 1s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes wave {
  0%, 100% {
    height: 5px;
  }
  50% {
    height: 15px;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes typingDot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .chat-messages {
    padding: 12px;
  }
  
  .chat-input-area {
    padding: 16px 12px;
  }
  
  .input-wrapper {
    padding: 6px 10px;
  }
  
  .action-btn {
    width: 32px !important;
    height: 32px !important;
  }
  
  .send-btn {
    width: 32px !important;
    height: 32px !important;
    font-size: 12px !important;
  }
  
  .chat-input :deep(.el-textarea__inner) {
    font-size: 14px !important;
  }
}
</style>