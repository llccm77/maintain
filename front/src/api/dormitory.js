import api from '@/utils/request'

/**
 * 宿舍管理API模块
 * 处理宿舍信息的增删改查、统计等功能
 */
export const dormitoryAPI = {
  /**
   * 获取宿舍列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.search - 搜索关键词
   * @param {string} params.building_name - 楼栋筛选
   * @param {number} params.floor - 楼层筛选
   * @returns {Promise} 宿舍列表响应
   */
  getDormitoryList(params = {}) {
    return api.get('/dormitories/', { params })
  },
  
  /**
   * 获取宿舍详情
   * @param {number} id - 宿舍ID
   * @returns {Promise} 宿舍详情
   */
  getDormitoryDetail(id) {
    return api.get(`/dormitories/${id}/`)
  },
  
  /**
   * 创建宿舍
   * @param {Object} data - 宿舍数据
   * @param {string} data.building_name - 楼栋名称
   * @param {string} data.room_number - 房间号
   * @param {number} data.floor - 楼层
   * @returns {Promise} 创建响应
   */
  createDormitory(data) {
    return api.post('/dormitories/', data)
  },
  
  /**
   * 更新宿舍信息（完整更新）
   * @param {number} id - 宿舍ID
   * @param {Object} data - 宿舍数据
   * @returns {Promise} 更新响应
   */
  updateDormitory(id, data) {
    return api.put(`/dormitories/${id}/`, data)
  },
  
  /**
   * 部分更新宿舍信息
   * @param {number} id - 宿舍ID
   * @param {Object} data - 部分宿舍数据
   * @returns {Promise} 更新响应
   */
  partialUpdateDormitory(id, data) {
    return api.patch(`/dormitories/${id}/`, data)
  },
  
  /**
   * 删除宿舍
   * @param {number} id - 宿舍ID
   * @returns {Promise} 删除响应
   */
  deleteDormitory(id) {
    return api.delete(`/dormitories/${id}/`)
  },
  
  /**
   * 获取宿舍统计信息
   * @returns {Promise} 统计数据
   */
  getStatistics() {
    return api.get('/dormitories/statistics/')
  },
  
  /**
   * 获取可用宿舍列表（用于分配）
   * @param {Object} params - 查询参数
   * @returns {Promise} 可用宿舍列表
   */
  getAvailableDormitories(params = {}) {
    return api.get('/dormitories/', { 
      params: { 
        ...params,
        available: true // 只获取有空位的宿舍
      } 
    })
  }
}

export default dormitoryAPI