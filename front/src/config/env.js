// ========================================
// 开发环境配置 - 前后端分离架构
// ========================================

// 环境变量配置
export const env = {
  // 应用基本信息
  appTitle: import.meta.env.VITE_APP_TITLE || '宿舍维修管理系统',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API配置 - 专注开发环境
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  
  // 开发模式配置
  isDev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  mockEnabled: import.meta.env.VITE_MOCK_ENABLED === 'true',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  logApiRequests: import.meta.env.VITE_LOG_API_REQUESTS === 'true',
  
  // 构建信息
  buildTime: new Date().toISOString(),
  nodeEnv: import.meta.env.NODE_ENV
}

// 开发环境下输出配置信息
if (env.isDev && env.debugMode) {
  console.group('🛠️ 开发环境配置')
  console.log('💻 应用标题:', env.appTitle)
  console.log('🔢 应用版本:', env.appVersion)
  console.log('🔗 API基础地址:', env.apiBaseUrl)
  console.log('🏠 后端地址:', env.backendUrl)
  console.log('🎭 Mock模式:', env.mockEnabled ? '开启' : '关闭')
  console.log('🐛 调试模式:', env.debugMode ? '开启' : '关闭')
  console.log('📝 API日志:', env.logApiRequests ? '开启' : '关闭')
  console.log('🕰️ 构建时间:', env.buildTime)
  console.groupEnd()
}

// 导出环境配置
export default env