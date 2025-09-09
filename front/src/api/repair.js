import api from '@/utils/request'

/**
 * 报修工单API模块
 * 处理工单的增删改查、状态流转、统计分析等功能
 */
export const repairAPI = {
  /**
   * 获取工单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.search - 搜索关键词（工单号、标题、学生姓名）
   * @param {string} params.status - 状态筛选 (pending/processing/completed/cancelled)
   * @param {string} params.priority - 优先级筛选 (low/medium/high/urgent)
   * @param {string} params.fault_type - 故障类型筛选 (water/furniture/door_window/network/other)
   * @returns {Promise} 工单列表响应
   */
  getRepairList(params = {}) {
    return api.get('/repair-orders/', { params })
  },
  
  /**
   * 获取工单列表 - 别名方法（兼容性）
   */
  list(params = {}) {
    return this.getRepairList(params)
  },
  
  /**
   * 获取工单详情
   * @param {number} id - 工单ID
   * @returns {Promise} 工单详情
   */
  getRepairDetail(id) {
    return api.get(`/repair-orders/${id}/`)
  },
  
  /**
   * 创建工单
   * @param {Object} data - 工单数据
   * @param {string} data.title - 工单标题
   * @param {string} data.description - 问题描述
   * @param {number} data.student_id - 报修学生ID
   * @param {number} data.dormitory_id - 宿舍ID
   * @param {string} [data.fault_type] - 故障类型，默认'other'
   * @param {string} [data.priority] - 优先级，默认'medium'
   * @returns {Promise} 创建响应
   */
  createRepair(data) {
    return api.post('/repair-orders/', data)
  },
  
  /**
   * 更新工单（完整更新）
   * @param {number} id - 工单ID
   * @param {Object} data - 工单数据
   * @returns {Promise} 更新响应
   */
  updateRepair(id, data) {
    return api.put(`/repair-orders/${id}/`, data)
  },
  
  /**
   * 部分更新工单
   * @param {number} id - 工单ID
   * @param {Object} data - 部分工单数据
   * @returns {Promise} 更新响应
   */
  partialUpdateRepair(id, data) {
    return api.patch(`/repair-orders/${id}/`, data)
  },
  
  /**
   * 删除工单
   * @param {number} id - 工单ID
   * @returns {Promise} 删除响应
   */
  deleteRepair(id) {
    return api.delete(`/repair-orders/${id}/`)
  },
  
  /**
   * 更新工单状态
   * @param {number} id - 工单ID
   * @param {string} status - 新状态 (pending/processing/completed/cancelled)
   * @returns {Promise} 状态更新响应
   */
  updateStatus(id, status) {
    return api.patch(`/repair-orders/${id}/`, { status })
  },
  
  /**
   * 分配维修员
   * @param {number} id - 工单ID
   * @param {number} workerId - 维修员ID
   * @returns {Promise} 分配响应
   */
  assignWorker(id, workerId) {
    return api.post(`/repair-orders/${id}/assign-worker/`, {
      worker_id: workerId
    })
  },
  
  /**
   * 添加维修备注
   * @param {number} id - 工单ID
   * @param {string} notes - 维修备注
   * @returns {Promise} 添加响应
   */
  addRepairNotes(id, notes) {
    return api.post(`/repair-orders/${id}/add-notes/`, {
      repair_notes: notes
    })
  },
  
  /**
   * 工单评价
   * @param {number} id - 工单ID
   * @param {number} rating - 评分 (1-5)
   * @param {string} comment - 评价内容
   * @returns {Promise} 评价响应
   */
  addRating(id, rating, comment) {
    return api.post(`/repair-orders/${id}/rate/`, {
      rating,
      comment
    })
  },
  
  /**
   * 获取工单统计信息
   * @param {Object} params - 统计参数
   * @param {string} [params.start_date] - 开始日期
   * @param {string} [params.end_date] - 结束日期
   * @param {string} [params.group_by] - 分组方式 (status/priority/fault_type/date)
   * @returns {Promise} 统计数据
   */
  getStatistics(params = {}) {
    return api.get('/repair-orders/statistics/', { params })
  },
  
  /**
   * 批量更新工单状态
   * @param {number[]} ids - 工单ID数组
   * @param {string} status - 目标状态
   * @returns {Promise} 批量更新响应
   */
  batchUpdateStatus(ids, status) {
    return api.post('/repair-orders/batch-update/', {
      ids,
      status
    })
  },
  
  /**
   * 导出工单数据
   * @param {Object} params - 导出参数
   * @returns {Promise} 导出响应
   */
  exportData(params = {}) {
    return api.get('/repair-orders/export/', { 
      params,
      responseType: 'blob' // 用于文件下载
    })
  }
}

export default repairAPI