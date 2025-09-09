import api from '@/utils/request'

/**
 * 认证相关API模块
 * 处理用户登录、登出、权限验证等功能
 */
export const authAPI = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @returns {Promise} 登录响应
   */
  login(credentials) {
    return api.post('/auth/login/', credentials)
  },
  
  /**
   * 用户登出
   * @returns {Promise} 登出响应
   */
  logout() {
    return api.post('/auth/logout/')
  },
  
  /**
   * 刷新token
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise} 刷新响应
   */
  refreshToken(refreshToken) {
    return api.post('/auth/refresh/', { refresh: refreshToken })
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 用户信息
   */
  getCurrentUser() {
    return api.get('/auth/user/')
  },
  
  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @param {string} passwordData.old_password - 旧密码
   * @param {string} passwordData.new_password - 新密码
   * @returns {Promise} 修改响应
   */
  changePassword(passwordData) {
    return api.post('/auth/change-password/', passwordData)
  }
}

export default authAPI