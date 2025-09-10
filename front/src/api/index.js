/**
 * API模块统一入口文件
 * 按照前端API结构优化与接口定义规范
 * 统一导出所有业务模块的API接口
 */

// 导入各个业务模块的API
import { authAPI } from './auth'
import { dormitoryAPI } from './dormitory'
import { repairAPI } from './repair'
import { systemAPI } from './system'

// 统一导出所有API模块，保持标准化命名
export {
  authAPI,
  dormitoryAPI,
  repairAPI,
  systemAPI
}

// 默认导出所有API模块的集合
export default {
  auth: authAPI,
  dormitory: dormitoryAPI,
  repair: repairAPI,
  system: systemAPI
}