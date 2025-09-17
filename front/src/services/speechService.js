import { AI_CONFIG } from '@/config/ai.js'

/**
 * 语音识别服务
 * 使用通义千问Paraformer实时语音识别模型
 */
class SpeechService {
  constructor() {
    this.apiKey = AI_CONFIG.QWEN_API_KEY
    this.apiUrl = AI_CONFIG.QWEN_ASR_URL
    this.model = AI_CONFIG.QWEN_ASR_MODEL
    
    // Web Speech API 相关
    this.recognition = null
    this.isRecording = false
    this.recordedChunks = []
    this.mediaRecorder = null
  }

  /**
   * 检查浏览器是否支持语音识别
   */
  checkBrowserSupport() {
    const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const hasMediaRecorder = 'MediaRecorder' in window
    const hasGetUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    
    return {
      webSpeech: hasWebSpeech,
      mediaRecorder: hasMediaRecorder,
      getUserMedia: hasGetUserMedia,
      supported: hasWebSpeech || (hasMediaRecorder && hasGetUserMedia)
    }
  }

  /**
   * 使用浏览器内置语音识别 (Chrome/Edge)
   * @param {Function} onResult - 识别结果回调
   * @param {Function} onError - 错误回调
   * @param {Function} onEnd - 结束回调
   */
  startWebSpeechRecognition(onResult, onError, onEnd) {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        throw new Error('浏览器不支持语音识别')
      }

      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'zh-CN'

      this.recognition.onstart = () => {
        this.isRecording = true
        console.log('语音识别开始')
      }

      this.recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (onResult) {
          onResult({
            final: finalTranscript,
            interim: interimTranscript,
            isFinal: finalTranscript.length > 0
          })
        }
      }

      this.recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error)
        this.isRecording = false
        if (onError) {
          onError(new Error(`语音识别失败: ${event.error}`))
        }
      }

      this.recognition.onend = () => {
        this.isRecording = false
        console.log('语音识别结束')
        if (onEnd) {
          onEnd()
        }
      }

      this.recognition.start()
      return true
    } catch (error) {
      console.error('启动语音识别失败:', error)
      if (onError) {
        onError(error)
      }
      return false
    }
  }

  /**
   * 停止浏览器语音识别
   */
  stopWebSpeechRecognition() {
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
    this.isRecording = false
  }

  /**
   * 使用通义千问API进行语音识别
   * @param {Blob} audioBlob - 音频文件
   * @returns {Promise<string>} 识别结果
   */
  async recognizeWithQwen(audioBlob) {
    if (!this.apiKey) {
      throw new Error('通义千问API密钥未配置')
    }

    try {
      // 将音频转换为base64
      const base64Audio = await this.blobToBase64(audioBlob)
      
      const requestBody = {
        model: this.model,
        input: {
          audio: base64Audio.split(',')[1], // 去掉data:audio/wav;base64,前缀
          format: 'wav'
        },
        parameters: {
          language: 'zh',
          sample_rate: 16000
        }
      }

      console.log('发送语音识别请求到通义千问API')

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-DashScope-Async': 'enable'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`通义千问API请求失败: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      
      if (result.output && result.output.text) {
        return result.output.text
      } else if (result.output && result.output.transcription) {
        return result.output.transcription
      } else {
        throw new Error('API返回格式异常')
      }
    } catch (error) {
      console.error('通义千问语音识别错误:', error)
      throw error
    }
  }

  /**
   * 开始录音 (用于通义千问API)
   * @param {Function} onDataAvailable - 数据可用回调
   * @returns {Promise<boolean>} 是否成功开始录音
   */
  async startRecording(onDataAvailable) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      })

      this.recordedChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
          if (onDataAvailable) {
            onDataAvailable(event.data)
          }
        }
      }

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
      }

      this.mediaRecorder.start()
      this.isRecording = true
      
      console.log('开始录音')
      return true
    } catch (error) {
      console.error('启动录音失败:', error)
      throw new Error('无法访问麦克风，请检查权限设置')
    }
  }

  /**
   * 停止录音并返回音频数据
   * @returns {Promise<Blob>} 录音数据
   */
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('录音未开始或已停止'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' })
        this.isRecording = false
        console.log('录音结束，音频大小:', audioBlob.size, 'bytes')
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * 将Blob转换为Base64
   * @param {Blob} blob 
   * @returns {Promise<string>}
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * 获取录音状态
   */
  getRecordingState() {
    return {
      isRecording: this.isRecording,
      hasRecorder: !!this.mediaRecorder,
      recorderState: this.mediaRecorder?.state || 'inactive'
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    
    this.isRecording = false
    this.recordedChunks = []
  }
}

// 导出单例
export const speechService = new SpeechService()
export default speechService
