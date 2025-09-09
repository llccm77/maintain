import request from './request'

/**
 * API工具函数库
 * 提供通用的API请求方法和数据处理函数
 */

/**
 * 通用GET请求
 * @param {string} url - 请求URL
 * @param {object} params - 查询参数
 * @param {object} config - 请求配置
 */
export const get = (url, params = {}, config = {}) => {
  return request.get(url, { params, ...config })
}

/**
 * 通用POST请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 */
export const post = (url, data = {}, config = {}) => {
  return request.post(url, data, config)
}

/**
 * 通用PUT请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 */
export const put = (url, data = {}, config = {}) => {
  return request.put(url, data, config)
}

/**
 * 通用PATCH请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} config - 请求配置
 */
export const patch = (url, data = {}, config = {}) => {
  return request.patch(url, data, config)
}

/**
 * 通用DELETE请求
 * @param {string} url - 请求URL
 * @param {object} config - 请求配置
 */
export const del = (url, config = {}) => {
  return request.delete(url, config)
}

/**
 * 构建查询参数字符串
 * @param {object} params - 参数对象
 * @returns {string} 查询参数字符串
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return ''
  }
  
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 格式化API路径
 * @param {string} path - 基础路径
 * @param {number|string} id - 资源ID
 * @returns {string} 格式化后的路径
 */
export const formatApiPath = (path, id = null) => {
  // 确保路径以 /api/ 开头
  if (!path.startsWith('/api/')) {
    path = `/api/${path.replace(/^\//, '')}`
  }
  
  // 如果提供了ID，添加到路径末尾
  if (id !== null && id !== undefined) {
    // 确保路径以 / 结尾，然后添加ID
    if (!path.endsWith('/')) {
      path += '/'
    }
    path += `${id}/`
  }
  
  return path
}

/**
 * 处理分页参数
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {object} otherParams - 其他参数
 * @returns {object} 处理后的参数对象
 */
export const buildPaginationParams = (page = 1, pageSize = 10, otherParams = {}) => {
  return {
    page,
    page_size: pageSize,
    ...otherParams
  }
}

/**
 * 处理排序参数
 * @param {string} field - 排序字段
 * @param {string} order - 排序方向 ('asc' | 'desc')
 * @returns {object} 排序参数对象
 */
export const buildSortParams = (field, order = 'asc') => {
  if (!field) return {}
  
  const orderPrefix = order === 'desc' ? '-' : ''
  return {
    ordering: `${orderPrefix}${field}`
  }
}

/**
 * 处理搜索参数
 * @param {string} keyword - 搜索关键词
 * @param {string} field - 搜索字段
 * @returns {object} 搜索参数对象
 */
export const buildSearchParams = (keyword, field = 'search') => {
  if (!keyword) return {}
  
  return {
    [field]: keyword
  }
}

/**
 * 组合多个参数对象
 * @param {...object} paramObjects - 参数对象
 * @returns {object} 合并后的参数对象
 */
export const combineParams = (...paramObjects) => {
  return Object.assign({}, ...paramObjects)
}

/**
 * 错误处理工具
 * @param {Error} error - 错误对象
 * @returns {object} 格式化的错误信息
 */
export const handleApiError = (error) => {
  const errorInfo = {
    message: '未知错误',
    code: 500,
    details: null
  }
  
  if (error.response) {
    // 服务器返回错误状态码
    errorInfo.code = error.response.status
    errorInfo.message = error.response.data?.message || error.message
    errorInfo.details = error.response.data
  } else if (error.request) {
    // 请求发出但没有收到响应
    errorInfo.code = 0
    errorInfo.message = '网络连接失败'
  } else {
    // 其他错误
    errorInfo.message = error.message
  }
  
  return errorInfo
}

/**
 * 创建RESTful API工具
 * @param {string} baseUrl - 基础URL
 * @returns {object} RESTful API方法集合
 */
export const createRestfulAPI = (baseUrl) => {
  const formattedBaseUrl = formatApiPath(baseUrl)
  
  return {
    // 获取列表
    list: (params = {}) => get(formattedBaseUrl, params),
    
    // 获取详情
    detail: (id) => get(formatApiPath(baseUrl, id)),
    
    // 创建
    create: (data) => post(formattedBaseUrl, data),
    
    // 更新
    update: (id, data) => put(formatApiPath(baseUrl, id), data),
    
    // 部分更新
    patch: (id, data) => patch(formatApiPath(baseUrl, id), data),
    
    // 删除
    delete: (id) => del(formatApiPath(baseUrl, id))
  }
}

/**
 * 默认导出请求实例（兼容性）
 */
export default request