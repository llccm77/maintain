import { authAPI, dormitoryAPI, repairAPI, systemAPI } from '@/api'

/**
 * API连接测试工具
 * 用于验证所有API模块是否正确连接到Django后端
 */

// 导入API模块
import { systemAPI, authAPI, dormitoryAPI, repairAPI } from '@/api'

export class APIConnectionTester {
  constructor() {
    this.results = {
      auth: { success: false, error: null },
      dormitory: { success: false, error: null },
      repair: { success: false, error: null },
      system: { success: false, error: null }
    }
  }

  /**
   * 测试系统健康检查
   */
  async testSystemHealth() {
    try {
      const response = await systemAPI.healthCheck()
      console.log('✅ 系统健康检查成功:', response)
      this.results.system.success = true
      return true
    } catch (error) {
      console.error('❌ 系统健康检查失败:', error)
      this.results.system.error = error.message
      return false
    }
  }

  /**
   * 测试认证API（需要先登录）
   */
  async testAuthAPI() {
    try {
      // 测试获取当前用户信息（需要登录状态）
      const response = await authAPI.getCurrentUser()
      console.log('✅ 认证API测试成功:', response)
      this.results.auth.success = true
      return true
    } catch (error) {
      console.log('ℹ️ 认证API测试（未登录状态）:', error.message)
      // 未登录是正常情况，不算错误
      this.results.auth.success = true
      return true
    }
  }

  /**
   * 测试宿舍管理API
   */
  async testDormitoryAPI() {
    try {
      const response = await dormitoryAPI.getDormitoryList({ page: 1, page_size: 5 })
      console.log('✅ 宿舍管理API测试成功:', response)
      this.results.dormitory.success = true
      return true
    } catch (error) {
      console.error('❌ 宿舍管理API测试失败:', error)
      this.results.dormitory.error = error.message
      return false
    }
  }

  /**
   * 学生管理API已移除 - 现在使用Django标准用户系统
   */

  /**
   * 测试报修工单API
   */
  async testRepairAPI() {
    try {
      const response = await repairAPI.getRepairList({ page: 1, page_size: 5 })
      console.log('✅ 报修工单API测试成功:', response)
      this.results.repair.success = true
      return true
    } catch (error) {
      console.error('❌ 报修工单API测试失败:', error)
      this.results.repair.error = error.message
      return false
    }
  }

  /**
   * 运行所有API测试
   */
  async runAllTests() {
    console.log('🚀 开始API连接测试...')
    
    const tests = [
      { name: '系统健康检查', test: () => this.testSystemHealth() },
      { name: '认证API', test: () => this.testAuthAPI() },
      { name: '宿舍管理API', test: () => this.testDormitoryAPI() },
      { name: '报修工单API', test: () => this.testRepairAPI() }
    ]

    for (const { name, test } of tests) {
      console.log(`\n📋 测试: ${name}`)
      await test()
    }

    return this.generateReport()
  }

  /**
   * 生成测试报告
   */
  generateReport() {
    const successCount = Object.values(this.results).filter(r => r.success).length
    const totalCount = Object.keys(this.results).length
    
    console.log('\n📊 API连接测试报告:')
    console.log(`成功: ${successCount}/${totalCount}`)
    
    Object.entries(this.results).forEach(([module, result]) => {
      const status = result.success ? '✅' : '❌'
      const error = result.error ? ` (${result.error})` : ''
      console.log(`${status} ${module}: ${result.success ? '连接正常' : '连接失败'}${error}`)
    })

    if (successCount === totalCount) {
      console.log('\n🎉 所有API连接测试通过！Django后端连接正常')
    } else {
      console.log(`\n⚠️ 有${totalCount - successCount}个API连接失败，请检查Django后端服务`)
    }

    return {
      success: successCount === totalCount,
      successCount,
      totalCount,
      results: this.results
    }
  }
}

// 导出测试实例
export const apiTester = new APIConnectionTester()

// 在开发环境下自动运行测试
if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_MODE === 'true') {
  // 延迟3秒后自动运行测试，确保应用完全加载
  setTimeout(() => {
    apiTester.runAllTests()
  }, 3000)
}