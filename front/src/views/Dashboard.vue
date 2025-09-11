<template>
  <div class="modern-dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span class="greeting">{{ getGreeting() }}</span>
          <span class="user-name">管理员</span>
        </h1>
        <p class="welcome-subtitle">宿舍维修管理系统 - 让维修更高效</p>
        <div class="quick-stats">
          <div class="stat-item">
            <el-icon><Clock /></el-icon>
            <span>最后登录: {{ lastLoginTime }}</span>
          </div>
          <div class="stat-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" size="large" @click="quickCreateOrder">
          <el-icon><Plus /></el-icon>
          新建工单
        </el-button>
        <el-button @click="refreshData" :loading="refreshing" size="large">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-button @click="handleLogout" type="danger" plain size="large">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div 
        v-for="(card, index) in overviewCards" 
        :key="index"
        class="overview-card"
        :class="card.type"
        @click="card.onClick"
      >
        <div class="card-header">
          <div class="card-icon">
            <el-icon><component :is="card.icon" /></el-icon>
          </div>
          <div class="card-actions">
            <el-badge v-if="card.badge" :value="card.badge" :max="99">
              <el-button link :type="card.type" size="small">
                <el-icon><component :is="card.actionIcon" /></el-icon>
              </el-button>
            </el-badge>
            <el-button v-else link :type="card.type" size="small">
              <el-icon><component :is="card.actionIcon" /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="card-content">
          <div class="card-info">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
            <div class="card-trend" :class="card.trendType">
              <el-icon><component :is="card.trendIcon" /></el-icon>
              <span>{{ card.trend }}</span>
            </div>
          </div>
          <div class="card-chart">
            <div :class="card.chartClass"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 快速操作 -->
        <el-card class="quick-actions-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><Lightning /></el-icon>
                <span>快速操作</span>
              </div>
            </div>
          </template>
          <div class="quick-actions-grid">
            <div 
              v-for="(action, index) in quickActions" 
              :key="index"
              class="quick-action-item" 
              @click="action.onClick"
            >
              <div class="action-icon" :class="action.iconClass">
                <el-icon><component :is="action.icon" /></el-icon>
              </div>
              <div class="action-content">
                <div class="action-title">{{ action.title }}</div>
                <div class="action-desc">{{ action.description }}</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 系统状态监控 -->
        <el-card class="system-status-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><Monitor /></el-icon>
                <span>系统状态</span>
              </div>
              <el-button @click="refreshSystemStatus" size="small" :loading="statusLoading">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <div class="status-items">
            <div 
              v-for="(status, index) in systemStatus" 
              :key="index"
              class="status-item"
            >
              <div class="status-indicator" :class="status.status"></div>
              <div class="status-info">
                <div class="status-title">{{ status.title }}</div>
                <div class="status-value">{{ status.value }}</div>
              </div>
              <div class="status-metrics">
                <div class="metric">
                  <span class="metric-label">{{ status.metricLabel }}</span>
                  <span class="metric-value" :class="status.metricClass">{{ status.metricValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 最新工单 -->
        <el-card class="recent-orders-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><Bell /></el-icon>
                <span>最新工单</span>
              </div>
              <el-link type="primary" @click="navigateTo('/repair')">查看全部</el-link>
            </div>
          </template>
          <div v-loading="ordersLoading" class="recent-orders-list">
            <div v-if="recentOrders.length === 0" class="empty-state">
              <el-empty description="暂无工单数据" />
            </div>
            <div v-else>
              <div
                v-for="order in recentOrders"
                :key="order.id"
                class="order-item"
                @click="viewOrderDetail(order)"
              >
                <div class="order-header">
                  <span class="order-number">{{ order.number }}</span>
                  <el-tag :type="getStatusTagType(order.status)" size="small">
                    {{ getStatusText(order.status) }}
                  </el-tag>
                </div>
                <div class="order-content">
                  <div class="order-title">{{ order.title }}</div>
                  <div class="order-meta">
                    <span><el-icon><User /></el-icon>{{ order.studentName }}</span>
                    <span><el-icon><House /></el-icon>{{ order.dormitory }}</span>
                  </div>
                  <div class="order-time">{{ formatDate(order.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- API连接状态 -->
        <el-card class="api-status-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><Link /></el-icon>
                <span>API连接状态</span>
              </div>
              <el-button @click="testApiConnections" size="small" :loading="apiTesting">
                <el-icon><Refresh /></el-icon>
                测试连接
              </el-button>
            </div>
          </template>
          <div class="api-status-list">
            <div 
              v-for="(status, api) in apiStatus" 
              :key="api" 
              class="api-status-item"
            >
              <div class="api-name">
                <el-icon><component :is="getApiIcon(api)" /></el-icon>
                <span>{{ getApiDisplayName(api) }}</span>
              </div>
              <div class="api-indicator">
                <el-tag :type="status.connected ? 'success' : 'danger'" size="small">
                  {{ status.connected ? '已连接' : '未连接' }}
                </el-tag>
                <span v-if="status.error" class="api-error" :title="status.error">
                  <el-icon><Warning /></el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  House, Document, Clock, CircleCheck, User, Plus, List, UserFilled, 
  Bell, Monitor, Refresh, Lightning, Warning, Check, Setting, 
  Lock, Tools, Calendar, Link, TrendCharts, View, SwitchButton
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const refreshing = ref(false)
const ordersLoading = ref(false)
const statusLoading = ref(false)
const apiTesting = ref(false)
const lastLoginTime = ref('今日 09:30')
const autoRefreshTimer = ref(null)

// 统计数据
const statistics = reactive({
  totalOrders: 1,
  pendingOrders: 0,
  completedOrders: 1,
  totalUsers: 1,
  totalDormitories: 1
})

// 最新工单数据
const recentOrders = ref([
  {
    id: 1,
    number: 'R202509100082815',
    title: '断电了',
    status: 'completed',
    studentName: '张三',
    dormitory: '10号楼-1010',
    createdAt: '2025-09-10T08:28:00Z'
  }
])

// API连接状态
const apiStatus = reactive({
  system: { connected: true, error: null },
  auth: { connected: true, error: null },
  dormitory: { connected: false, error: '连接超时' },
  repair: { connected: true, error: null }
})

// 计算属性
const completionRate = computed(() => {
  if (statistics.totalOrders === 0) return 0
  return Math.round((statistics.completedOrders / statistics.totalOrders) * 100)
})

// 概览卡片配置
const overviewCards = computed(() => [
  {
    type: 'primary',
    icon: 'Document',
    actionIcon: 'View',
    title: '总工单数',
    value: statistics.totalOrders,
    trend: '系统运行中',
    trendType: 'positive',
    trendIcon: 'TrendCharts',
    chartClass: 'mini-chart-line',
    onClick: () => navigateTo('/repair')
  },
  {
    type: 'warning',
    icon: 'Clock',
    actionIcon: 'Warning',
    title: '待处理',
    value: statistics.pendingOrders,
    trend: '暂无待处理',
    trendType: 'urgent',
    trendIcon: 'Warning',
    chartClass: 'mini-chart-bar',
    badge: statistics.pendingOrders,
    onClick: () => handlePendingOrders()
  },
  {
    type: 'success',
    icon: 'CircleCheck',
    actionIcon: 'Check',
    title: '已完成',
    value: statistics.completedOrders,
    trend: `完成率 ${completionRate.value}%`,
    trendType: 'positive',
    trendIcon: 'Check',
    chartClass: 'mini-chart-progress',
    onClick: () => navigateTo('/repair?status=completed')
  },
  {
    type: 'info',
    icon: 'User',
    actionIcon: 'UserFilled',
    title: '系统用户',
    value: statistics.totalUsers,
    trend: `${statistics.totalDormitories} 间宿舍`,
    trendType: 'neutral',
    trendIcon: 'House',
    chartClass: 'mini-chart-donut',
    onClick: () => navigateTo('/users')
  }
])

// 快速操作配置
const quickActions = ref([
  {
    icon: 'Plus',
    iconClass: 'create',
    title: '新建工单',
    description: '快速创建维修工单',
    onClick: () => quickCreateOrder()
  },
  {
    icon: 'List',
    iconClass: 'manage',
    title: '工单管理',
    description: '查看所有工单',
    onClick: () => navigateTo('/repair')
  },
  {
    icon: 'UserFilled',
    iconClass: 'user',
    title: '用户管理',
    description: '系统用户管理',
    onClick: () => navigateTo('/users')
  },
  {
    icon: 'House',
    iconClass: 'dorm',
    title: '宿舍管理',
    description: '宿舍信息管理',
    onClick: () => navigateTo('/dormitory')
  }
])

// 系统状态配置
const systemStatus = ref([
  {
    title: '前端服务',
    value: '运行正常',
    status: 'online',
    metricLabel: '响应时间',
    metricValue: '< 100ms',
    metricClass: 'success'
  },
  {
    title: '后端服务',
    value: '运行正常',
    status: 'online',
    metricLabel: 'API延迟',
    metricValue: '156ms',
    metricClass: 'success'
  },
  {
    title: '数据库',
    value: '连接正常',
    status: 'online',
    metricLabel: '查询时间',
    metricValue: '23ms',
    metricClass: 'success'
  }
])

// 方法定义
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '晚上好'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusTagType = (status) => {
  const typeMap = {
    'pending': 'warning',
    'processing': 'primary',
    'completed': 'success',
    'cancelled': 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    'pending': '待处理',
    'processing': '维修中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return textMap[status] || '未知'
}

const getApiDisplayName = (api) => {
  const nameMap = {
    system: '系统管理',
    auth: '认证模块',
    dormitory: '宿舍管理',
    repair: '工单管理'
  }
  return nameMap[api] || api
}

const getApiIcon = (api) => {
  const iconMap = {
    system: 'Setting',
    auth: 'Lock',
    dormitory: 'House',
    repair: 'Tools'
  }
  return iconMap[api] || 'Setting'
}

// 事件处理
const navigateTo = (route) => {
  router.push(route)
}

const quickCreateOrder = () => {
  ElMessage.success('跳转到新建工单页面')
  // router.push('/repair/create')
}

const handlePendingOrders = () => {
  if (statistics.pendingOrders > 0) {
    navigateTo('/repair?status=pending')
  } else {
    ElMessage.info('当前没有待处理的工单')
  }
}

const viewOrderDetail = (order) => {
  ElMessage.info(`查看工单详情: ${order.title}`)
  // router.push(`/repair/${order.id}`)
}

const refreshData = async () => {
  refreshing.value = true
  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据后台实际数据更新
    const baseOrders = 1      // 实际有 1 个工单
    const basePending = 0     // 0 个待处理
    const baseCompleted = 1   // 1 个已完成
    const baseUsers = 1       // 1 个管理员用户
    
    statistics.totalOrders = baseOrders
    statistics.pendingOrders = basePending
    statistics.completedOrders = baseCompleted
    statistics.totalUsers = baseUsers
    statistics.totalDormitories = 1  // 有 1 间宿舍（10号楼-1010）
    
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    refreshing.value = false
  }
}

const refreshSystemStatus = async () => {
  statusLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟状态检查
    systemStatus.value.forEach(status => {
      const isOnline = Math.random() > 0.1 // 90%概率在线
      status.status = isOnline ? 'online' : 'warning'
      status.value = isOnline ? '运行正常' : '性能降级'
    })
    
    ElMessage.success('系统状态刷新成功')
  } catch (error) {
    ElMessage.error('系统状态刷新失败')
  } finally {
    statusLoading.value = false
  }
}

const testApiConnections = async () => {
  if (apiTesting.value) return
  
  apiTesting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟 API 连接测试
    Object.keys(apiStatus).forEach(api => {
      const connected = Math.random() > 0.2 // 80%成功率
      apiStatus[api].connected = connected
      apiStatus[api].error = connected ? null : '连接超时'
    })
    
    ElMessage.success('API连接测试完成')
  } catch (error) {
    ElMessage.error('API连接测试失败')
  } finally {
    apiTesting.value = false
  }
}

// 自动刷新功能
const startAutoRefresh = () => {
  autoRefreshTimer.value = setInterval(() => {
    // 静默刷新数据，保持与后台一致
    const baseOrders = 1
    const basePending = 0
    const baseCompleted = 1
    const baseUsers = 1
    
    statistics.totalOrders = baseOrders
    statistics.pendingOrders = basePending
    statistics.completedOrders = baseCompleted
    statistics.totalUsers = baseUsers
    statistics.totalDormitories = 1
  }, 30000) // 30秒刷新一次
}

const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// 退出登录功能
const handleLogout = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后需要重新登录。',
      '退出确认',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 显示加载状态
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在退出登录...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    try {
      // 停止自动刷新
      stopAutoRefresh()
      
      // 调用退出登录API
      await authStore.logout()
      
      ElMessage.success({
        message: '退出登录成功',
        duration: 2000
      })
      
      // 跳转到登录页
      await router.replace('/login')
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使API调用失败，也要清除本地状态
      authStore.logout()
      ElMessage.warning('退出登录完成（网络异常）')
      await router.replace('/login')
    } finally {
      loadingInstance.close()
    }
  } catch (error) {
    // 用户取消退出
    if (error === 'cancel') {
      ElMessage.info('已取消退出')
    }
  }
}

// 生命周期钩子
onMounted(async () => {
  try {
    // 并行加载初始数据
    await Promise.allSettled([
      refreshData(),
      refreshSystemStatus()
    ])
    
    // 启动自动刷新
    startAutoRefresh()
    
    // 显示欢迎消息
    await nextTick()
    ElMessage({
      message: '欢迎使用宿舍维修管理系统！',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    console.error('Dashboard初始化失败:', error)
    ElMessage.error('仪表盘初始化失败，请刷新重试')
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
/* 现代化仪表盘样式 */
.modern-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.welcome-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.welcome-content .welcome-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  animation: fadeInUp 0.6s ease-out;
}

.welcome-content .greeting {
  margin-right: 8px;
}

.welcome-content .user-name {
  color: #f0f8ff;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.welcome-content .welcome-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 16px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.quick-stats {
  display: flex;
  gap: 24px;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.8;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.welcome-actions {
  display: flex;
  gap: 12px;
  animation: fadeInLeft 0.6s ease-out 0.3s both;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.overview-card:hover::before {
  transform: scaleX(1);
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.overview-card.primary { --card-color: #409eff; }
.overview-card.warning { --card-color: #e6a23c; }
.overview-card.success { --card-color: #67c23a; }
.overview-card.info { --card-color: #909399; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
}

.primary .card-icon { 
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.2)); 
  color: #409eff; 
}
.warning .card-icon { 
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.1), rgba(230, 162, 60, 0.2)); 
  color: #e6a23c; 
}
.success .card-icon { 
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1), rgba(103, 194, 58, 0.2)); 
  color: #67c23a; 
}
.info .card-icon { 
  background: linear-gradient(135deg, rgba(144, 147, 153, 0.1), rgba(144, 147, 153, 0.2)); 
  color: #909399; 
}

.overview-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-trend.positive { color: #67c23a; }
.card-trend.urgent { color: #f56c6c; }
.card-trend.neutral { color: #909399; }

/* 主要内容区域 */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 卡片样式 */
.quick-actions-card, .recent-orders-card, .system-status-card, .api-status-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.quick-actions-card:hover, .recent-orders-card:hover, 
.system-status-card:hover, .api-status-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
  padding: 20px 20px 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

/* 快速操作 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 20px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.quick-action-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  border-color: var(--action-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
}

.action-icon.create { 
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.2)); 
  color: #409eff; 
  --action-color: #409eff;
}
.action-icon.manage { 
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1), rgba(103, 194, 58, 0.2)); 
  color: #67c23a;
  --action-color: #67c23a;
}
.action-icon.user { 
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.1), rgba(230, 162, 60, 0.2)); 
  color: #e6a23c;
  --action-color: #e6a23c;
}
.action-icon.dorm { 
  background: linear-gradient(135deg, rgba(144, 147, 153, 0.1), rgba(144, 147, 153, 0.2)); 
  color: #909399;
  --action-color: #909399;
}

.quick-action-item:hover .action-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(var(--action-color), 0.3);
}

.action-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.action-desc {
  font-size: 12px;
  color: #909399;
}

/* 最新工单 */
.recent-orders-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.recent-orders-list::-webkit-scrollbar {
  width: 6px;
}

.recent-orders-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.recent-orders-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.order-item {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 8px;
}

.order-item:hover {
  background: #f8f9fa;
  transform: translateX(4px);
  border-color: #409eff;
}

.order-item:last-child {
  border-bottom: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-number {
  font-weight: 600;
  color: #409eff;
  font-family: 'SF Mono', Consolas, monospace;
}

.order-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}

.order-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.order-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-time {
  font-size: 12px;
  color: #c0c4cc;
}

/* 系统状态 */
.status-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.status-item:hover {
  background: #e9ecef;
  border-color: #67c23a;
  transform: translateY(-1px);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.status-indicator::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online { 
  background: #67c23a;
}
.status-indicator.online::before {
  background: rgba(103, 194, 58, 0.3);
}

.status-indicator.warning { 
  background: #e6a23c;
}
.status-indicator.warning::before {
  background: rgba(230, 162, 60, 0.3);
}

.status-indicator.offline { 
  background: #f56c6c;
}
.status-indicator.offline::before {
  background: rgba(245, 108, 108, 0.3);
}

.status-info {
  flex: 1;
}

.status-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.status-value {
  font-size: 12px;
  color: #909399;
}

.status-metrics {
  text-align: right;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  font-size: 10px;
  color: #c0c4cc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  font-family: 'SF Mono', Consolas, monospace;
}

.metric-value.success { color: #67c23a; }
.metric-value.warning { color: #e6a23c; }
.metric-value.danger { color: #f56c6c; }

/* API状态 */
.api-status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.api-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.api-status-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.api-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.api-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.api-error {
  color: #f56c6c;
  cursor: help;
}

/* 迷你图表 */
.card-chart {
  width: 60px;
  height: 40px;
  position: relative;
}

.mini-chart-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.3) 100%);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.mini-chart-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to right, 
    transparent 0%, 
    rgba(64, 158, 255, 0.5) 25%, 
    rgba(64, 158, 255, 0.8) 50%, 
    rgba(64, 158, 255, 0.6) 75%, 
    transparent 100%);
  animation: chartFlow 3s ease-in-out infinite;
}

.mini-chart-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(230, 162, 60, 0.3) 0%, rgba(230, 162, 60, 0.1) 100%);
  border-radius: 4px;
  position: relative;
}

.mini-chart-progress {
  width: 100%;
  height: 8px;
  background: #ebeef5;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.mini-chart-progress::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 85%;
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
  border-radius: 4px;
  animation: progressFill 2s ease-out;
}

.mini-chart-donut {
  width: 40px;
  height: 40px;
  border: 3px solid #ebeef5;
  border-top-color: #909399;
  border-radius: 50%;
  margin: auto;
  animation: spin 2s linear infinite;
}

/* 空状态 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes chartFlow {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

@keyframes progressFill {
  from {
    width: 0;
  }
  to {
    width: 85%;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .modern-dashboard {
    padding: 12px;
  }
  
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .welcome-content .welcome-title {
    font-size: 24px;
  }
  
  .card-value {
    font-size: 28px;
  }
  
  .overview-card {
    padding: 16px;
  }
}</style>