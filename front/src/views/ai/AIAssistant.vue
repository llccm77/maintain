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
                  :src="message.image" 
                  :preview-src-list="[message.image]"
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

    <!-- 输入区域 -->
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
        <el-image 
          :src="selectedImageUrl" 
          fit="cover"
          style="width: 100px; height: 80px; border-radius: 4px;"
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
  ChatDotRound, UserFilled, Picture, Microphone, Delete, Loading
} from '@element-plus/icons-vue'
import { aiService } from '@/services/aiService.js'

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
const recordingTimer = ref(null)
const recognition = ref(null)

// 初始化语音识别
onMounted(() => {
  // 检查浏览器是否支持语音识别API
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = true
    recognition.value.interimResults = true
    recognition.value.lang = 'zh-CN'
    
    recognition.value.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      
      userInput.value = transcript
    }
    
    recognition.value.onerror = (event) => {
      console.error('语音识别错误:', event.error)
      stopRecording()
      ElMessage.error('语音识别出错，请重试')
    }
  }
  
  // 添加欢迎消息
  chatMessages.value.push({
    role: 'assistant',
    content: '您好！我是小维，您的专业宿舍维修AI助手！🔧\n\n我可以帮您：\n• 诊断各种宿舍维修问题\n• 提供详细的维修指导\n• 评估问题紧急程度\n• 建议是否需要报修\n\n有什么维修问题需要我帮助吗？您也可以上传故障照片，我会给出更精准的建议！',
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
  
  // 如果有图片，添加到消息中
  if (selectedImage.value) {
    userMessage.image = selectedImageUrl.value
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
    if (userMessage.image) {
      // 处理图片消息 (暂时使用非流式)
      const aiResponse = await aiService.analyzeImage(userMessage.image, userMessage.content || '请帮我分析这个维修问题')
      
      // 添加AI回复
      chatMessages.value.push({
        role: 'assistant',
        content: aiResponse,
        time: new Date()
      })
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
  
  selectedImage.value = file
  selectedImageUrl.value = URL.createObjectURL(file)
  
  // 清空文件输入，以便再次选择同一文件
  event.target.value = ''
}

// 移除已选择的图片
const removeSelectedImage = () => {
  if (selectedImageUrl.value) {
    URL.revokeObjectURL(selectedImageUrl.value)
  }
  selectedImage.value = null
  selectedImageUrl.value = ''
}

// 切换语音输入
const toggleVoiceInput = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 开始录音
const startRecording = () => {
  if (!recognition.value) {
    ElMessage.warning('您的浏览器不支持语音识别功能')
    return
  }
  
  try {
    recognition.value.start()
    isRecording.value = true
    recordingTime.value = 0
    
    // 开始计时
    recordingTimer.value = setInterval(() => {
      recordingTime.value++
      
      // 限制录音时间为60秒
      if (recordingTime.value >= 60) {
        stopRecording()
      }
    }, 1000)
  } catch (error) {
    console.error('开始录音出错:', error)
    ElMessage.error('开始录音失败，请重试')
  }
}

// 停止录音
const stopRecording = () => {
  if (!recognition.value) return
  
  try {
    recognition.value.stop()
  } catch (error) {
    console.error('停止录音出错:', error)
  }
  
  isRecording.value = false
  clearInterval(recordingTimer.value)
  recordingTimer.value = null
}
</script>

<style scoped>
.ai-assistant-container {
  padding: 10px;
  height: 100vh;
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
  margin-bottom: 140px; /* 为输入框预留空间 */
  position: relative;
  height: calc(100vh - 200px); /* 限制最大高度 */
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
  left: 220px; /* 侧边栏宽度 */
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, #f8f9fa 0%, rgba(248, 249, 250, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 10;
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
    left: 0; /* 移动端无侧边栏 */
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