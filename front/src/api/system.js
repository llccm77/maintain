import api from '@/utils/request'

/**
 * 系统管理API模块
 * 处理系统设置、健康检查、文件上传等通用功能
 */
export const systemAPI = {
  /**
   * 健康检查
   * @returns {Promise} 健康状态响应
   */
  healthCheck() {
    return api.get('/health/')
  },
  
  /**
   * 获取系统信息
   * @returns {Promise} 系统信息和统计数据
   */
  getSystemInfo() {
    return api.get('/system/info/')
  },
  
  /**
   * 获取枚举选项
   * @param {string} type - 枚举类型 (status/priority/fault_type等)
   * @returns {Promise} 枚举选项列表
   */
  getChoices(type) {
    return api.get(`/system/choices/${type}/`)
  },
  
  /**
   * 上传文件
   * @param {File} file - 文件对象
   * @param {string} type - 文件类型 (avatar/attachment/import等)
   * @returns {Promise} 上传响应
   */
  uploadFile(file, type = 'general') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return api.post('/system/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  /**
   * 获取系统配置
   * @returns {Promise} 系统配置信息
   */
  getSystemConfig() {
    return api.get('/system/config/')
  },
  
  /**
   * 更新系统配置
   * @param {Object} config - 配置数据
   * @returns {Promise} 更新响应
   */
  updateSystemConfig(config) {
    return api.put('/system/config/', config)
  },
  
  /**
   * 获取系统日志
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.level - 日志级别 (info/warning/error)
   * @param {string} params.start_date - 开始日期
   * @param {string} params.end_date - 结束日期
   * @returns {Promise} 系统日志列表
   */
  getSystemLogs(params = {}) {
    return api.get('/system/logs/', { params })
  },
  
  /**
   * 清理系统缓存
   * @returns {Promise} 清理响应
   */
  clearCache() {
    return api.post('/system/clear-cache/')
  },
  
  /**
   * 数据库备份
   * @returns {Promise} 备份响应
   */
  backupDatabase() {
    return api.post('/system/backup/', {}, {
      responseType: 'blob' // 用于文件下载
    })
  },
  
  /**
   * 获取系统性能指标
   * @returns {Promise} 性能指标数据
   */
  getPerformanceMetrics() {
    return api.get('/system/metrics/')
  },
  
  /**
   * 发送系统通知
   * @param {Object} data - 通知数据
   * @param {string} data.title - 通知标题
   * @param {string} data.content - 通知内容
   * @param {string} data.type - 通知类型 (info/warning/error)
   * @param {number[]} [data.user_ids] - 目标用户ID数组，为空则广播
   * @returns {Promise} 发送响应
   */
  sendNotification(data) {
    return api.post('/system/notifications/', data)
  },
  
  /**
   * 获取通知列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 通知列表
   */
  getNotifications(params = {}) {
    return api.get('/system/notifications/', { params })
  },
  
  /**
   * 标记通知为已读
   * @param {number} id - 通知ID
   * @returns {Promise} 标记响应
   */
  markNotificationAsRead(id) {
    return api.patch(`/system/notifications/${id}/`, { is_read: true })
  }
}

export default systemAPI