import api from '@/utils/request'

/**
 * 用户管理API模块
 * 处理用户信息的查询、管理等功能
 */
export const userAPI = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.search - 搜索关键词
   * @returns {Promise} 用户列表响应
   */
  getUserList(params = {}) {
    return api.get('/users/', { params })
  },
  
  /**
   * 搜索用户
   * @param {string} query - 搜索关键词
   * @returns {Promise} 用户搜索结果
   */
  searchUsers(query) {
    return api.get('/users/', { 
      params: { 
        search: query,
        page_size: 20 // 限制搜索结果数量
      } 
    })
  },
  
  /**
   * 获取用户详情
   * @param {number} id - 用户ID
   * @returns {Promise} 用户详情
   */
  getUserDetail(id) {
    return api.get(`/users/${id}/`)
  },
  
  /**
   * 创建用户
   * @param {Object} data - 用户数据
   * @returns {Promise} 创建响应
   */
  createUser(data) {
    return api.post('/users/', data)
  },
  
  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} data - 用户数据
   * @returns {Promise} 更新响应
   */
  updateUser(id, data) {
    return api.put(`/users/${id}/`, data)
  },
  
  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise} 删除响应
   */
  deleteUser(id) {
    return api.delete(`/users/${id}/`)
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 当前用户信息
   */
  getCurrentUser() {
    return api.get('/users/me/')
  }
}

export default userAPI
