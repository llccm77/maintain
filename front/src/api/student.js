import api from '@/utils/request'

/**
 * 学生管理API模块
 * 处理学生信息的增删改查、宿舍分配等功能
 */
export const studentAPI = {
  /**
   * 获取学生列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.page_size - 每页数量
   * @param {string} params.search - 搜索关键词（姓名、学号、电话）
   * @param {string} params.building - 楼栋筛选
   * @param {string} params.has_dormitory - 是否已分配宿舍 (true/false)
   * @returns {Promise} 学生列表响应
   */
  getStudentList(params = {}) {
    return api.get('/students/', { params })
  },
  
  /**
   * 获取学生详情
   * @param {number} id - 学生ID
   * @returns {Promise} 学生详情
   */
  getStudentDetail(id) {
    return api.get(`/students/${id}/`)
  },
  
  /**
   * 创建学生
   * @param {Object} data - 学生数据
   * @param {string} data.student_id - 学号
   * @param {string} data.name - 姓名
   * @param {string} data.phone - 联系电话
   * @param {number} [data.dormitory_id] - 宿舍ID（可选）
   * @returns {Promise} 创建响应
   */
  createStudent(data) {
    return api.post('/students/', data)
  },
  
  /**
   * 更新学生信息（完整更新）
   * @param {number} id - 学生ID
   * @param {Object} data - 学生数据
   * @returns {Promise} 更新响应
   */
  updateStudent(id, data) {
    return api.put(`/students/${id}/`, data)
  },
  
  /**
   * 部分更新学生信息
   * @param {number} id - 学生ID
   * @param {Object} data - 部分学生数据
   * @returns {Promise} 更新响应
   */
  partialUpdateStudent(id, data) {
    return api.patch(`/students/${id}/`, data)
  },
  
  /**
   * 删除学生
   * @param {number} id - 学生ID
   * @returns {Promise} 删除响应
   */
  deleteStudent(id) {
    return api.delete(`/students/${id}/`)
  },
  
  /**
   * 为学生分配宿舍
   * @param {number} studentId - 学生ID
   * @param {number} dormitoryId - 宿舍ID
   * @returns {Promise} 分配响应
   */
  assignDormitory(studentId, dormitoryId) {
    return api.post(`/students/${studentId}/assign-dormitory/`, {
      dormitory_id: dormitoryId
    })
  },
  
  /**
   * 取消学生宿舍分配
   * @param {number} studentId - 学生ID
   * @returns {Promise} 取消响应
   */
  unassignDormitory(studentId) {
    return api.post(`/students/${studentId}/unassign-dormitory/`)
  },
  
  /**
   * 获取学生统计信息
   * @returns {Promise} 统计数据
   */
  getStatistics() {
    return api.get('/students/statistics/')
  },
  
  /**
   * 批量导入学生
   * @param {File} file - Excel文件
   * @returns {Promise} 导入响应
   */
  batchImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/students/batch-import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default studentAPI