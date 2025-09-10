import axios from 'axios'

// 创建 axios 实例 - 标准前后端分离配置
const api = axios.create({
  // 使用环境变量配置 API 基础地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000, // 15秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 支持跨域请求，启用cookies以支持Django session认证
  withCredentials: true
})

// 请求拦截器 - 前后端分离架构
api.interceptors.request.use(
  (config) => {
    // Django使用session认证，不需要添加Authorization头
    // session会通过cookies自动传递
    
    // 开发环境下的请求日志
    if (import.meta.env.DEV && import.meta.env.VITE_LOG_API_REQUESTS === 'true') {
      console.group(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`)
      console.log('📍 完整URL:', `${config.baseURL}${config.url}`)
      console.log('📤 请求头:', config.headers)
      if (config.data) {
        console.log('📦 请求数据:', config.data)
      }
      if (config.params) {
        console.log('🔍 查询参数:', config.params)
      }
      console.groupEnd()
    }
    
    return config
  },
  (error) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 开发环境下打印响应信息
    if (import.meta.env.DEV) {
      console.log('响应数据:', response)
    }
    
    // 统一处理响应数据
    if (response.data && response.data.code !== undefined) {
      // 如果后端返回统一格式 {code, message, data}
      if (response.data.code === 200 || response.data.code === 0) {
        return response.data.data || response.data
      } else {
        throw new Error(response.data.message || '请求失败')
      }
    }
    
    return response.data
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 统一错误处理
    let errorMessage = '网络错误'
    
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 可以在这里处理token过期，跳转到登录页
          localStorage.removeItem('token')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = error.response.data?.message || `服务器错误 ${error.response.status}`
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      errorMessage = '网络连接超时，请检查网络'
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误'
    }
    
    // 在开发环境下显示更详细的错误信息
    if (import.meta.env.DEV) {
      console.error('详细错误信息:', error)
    }
    
    return Promise.reject(new Error(errorMessage))
  }
)

export default api