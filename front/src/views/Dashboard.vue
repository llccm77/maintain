<template>
  <div class="cozy-dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-illustration">
          <div class="floating-elements">
            <!-- 主要的小房子 -->
            <svg width="60" height="60" viewBox="0 0 60 60" class="floating-house main-house">
              <path d="M30 8L8 25v28h44V25L30 8z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" stroke-linejoin="round"/>
              <rect x="20" y="35" width="8" height="12" fill="#87CEEB" stroke="#4682B4" stroke-width="1.5" rx="1"/>
              <rect x="32" y="35" width="8" height="8" fill="#F0E68C" stroke="#DAA520" stroke-width="1.5" rx="1"/>
              <path d="M25 8L30 3L35 8" fill="none" stroke="#FF69B4" stroke-width="2" stroke-linecap="round"/>
              <circle cx="24" cy="41" r="1" fill="#4682B4"/>
              <path d="M32 39h8M32 41h8" stroke="#DAA520" stroke-width="1" stroke-linecap="round"/>
              <!-- 可爱的烟囱 -->
              <rect x="38" y="15" width="4" height="8" rx="1" fill="#FF69B4" opacity="0.7"/>
              <ellipse cx="40" cy="13" rx="2" ry="1" fill="rgba(255,255,255,0.6)"/>
            </svg>
            
            <!-- 飘浮的小装饰房子 -->
            <svg width="30" height="30" viewBox="0 0 30 30" class="floating-house small-house-1">
              <path d="M15 4L4 12v14h22V12L15 4z" fill="#87CEEB" stroke="#4682B4" stroke-width="1" stroke-linejoin="round" opacity="0.7"/>
              <rect x="10" y="18" width="4" height="6" fill="rgba(255,255,255,0.4)" rx="0.5"/>
              <circle cx="12" cy="21" r="0.5" fill="#4682B4" opacity="0.8"/>
            </svg>
            
            <svg width="25" height="25" viewBox="0 0 25 25" class="floating-house small-house-2">
              <path d="M12.5 3L3 10v12h19V10L12.5 3z" fill="#DDA0DD" stroke="#9370DB" stroke-width="1" stroke-linejoin="round" opacity="0.7"/>
              <rect x="8" y="15" width="3" height="5" fill="rgba(255,255,255,0.4)" rx="0.5"/>
              <circle cx="9.5" cy="17.5" r="0.3" fill="#9370DB" opacity="0.8"/>
            </svg>
            
            <!-- 飘浮的小星星 -->
            <svg width="20" height="20" viewBox="0 0 20 20" class="floating-star star-1">
              <path d="M10 2L12 8L18 8L13 12L15 18L10 14L5 18L7 12L2 8L8 8Z" fill="rgba(255,255,255,0.8)"/>
            </svg>
            
            <svg width="15" height="15" viewBox="0 0 15 15" class="floating-star star-2">
              <path d="M7.5 1.5L9 6L13.5 6L10 9L11.5 13.5L7.5 10.5L3.5 13.5L5 9L1.5 6L6 6Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
            
            <svg width="12" height="12" viewBox="0 0 12 12" class="floating-star star-3">
              <path d="M6 1L7 4.5L10.5 4.5L8 7L9 10.5L6 8.5L3 10.5L4 7L1.5 4.5L5 4.5Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
          </div>
        </div>
        <h1 class="welcome-title">
          <span class="greeting">{{ getGreeting() }}</span>
          <span class="user-name">小管家</span>
        </h1>
        <p class="welcome-subtitle">宿舍小管家，让生活更美好 ✨</p>
        <div class="quick-stats">
          <div class="stat-item">
            <!-- 手绘时钟图标 -->
            <svg width="16" height="16" viewBox="0 0 16 16" class="hand-drawn-icon">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1,1"/>
              <path d="M8 4v4l3 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>上次见面: {{ lastLoginTime }}</span>
          </div>
          <div class="stat-item">
            <!-- 手绘日历图标 -->
            <svg width="16" height="16" viewBox="0 0 16 16" class="hand-drawn-icon">
              <rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 1v4M11 1v4M2 6h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" size="large" @click="quickCreateOrder" class="cozy-button">
          <!-- 手绘加号图标 -->
          <svg width="18" height="18" viewBox="0 0 18 18" class="button-icon">
            <path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          我要报修
        </el-button>
        <el-button @click="refreshData" :loading="refreshing" size="large" class="cozy-button secondary">
          <!-- 手绘刷新图标 -->
          <svg width="18" height="18" viewBox="0 0 18 18" class="button-icon">
            <path d="M15 9a6 6 0 1 1-6-6 6 6 0 0 1 6 6z" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 6l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          看看最新情况
        </el-button>
        <el-button @click="handleLogout" type="danger" plain size="large" class="cozy-button goodbye">
          <!-- 手绘再见图标 -->
          <svg width="18" height="18" viewBox="0 0 18 18" class="button-icon">
            <path d="M9 2v14M2 9h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" transform="rotate(45 9 9)"/>
          </svg>
          再见啦，小管家
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
            <HandDrawnIcons :type="getHandDrawnIconType(card.icon)" :size="28" class="hand-drawn-icon" />
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
                <HandDrawnIcons type="star" :size="20" class="hand-drawn-icon" />
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
            <HandDrawnIcons :type="getHandDrawnIconType(action.icon)" :size="24" />
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
                <HandDrawnIcons type="chart" :size="20" class="hand-drawn-icon" />
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
              <HandDrawnIcons type="manage" :size="20" class="hand-drawn-icon" />
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
                <HandDrawnIcons type="star" :size="20" class="hand-drawn-icon" />
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
import HandDrawnIcons from '@/components/HandDrawnIcons.vue'
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
    title: '工单总数',
    value: statistics.totalOrders,
    trend: '小管家正在运行中~',
    trendType: 'positive',
    trendIcon: 'TrendCharts',
    chartClass: 'mini-chart-line',
    onClick: () => navigateTo('/repair')
  },
  {
    type: 'warning',
    icon: 'Clock',
    actionIcon: 'Warning',
    title: '正在等待分配...',
    value: statistics.pendingOrders,
    trend: statistics.pendingOrders > 0 ? '需要处理哦！' : '当前没有新的报修单哦~',
    trendType: statistics.pendingOrders > 0 ? 'urgent' : 'positive',
    trendIcon: 'Warning',
    chartClass: 'mini-chart-bar',
    badge: statistics.pendingOrders,
    onClick: () => handlePendingOrders()
  },
  {
    type: 'success',
    icon: 'CircleCheck',
    actionIcon: 'Check',
    title: '今日任务完成！',
    value: statistics.completedOrders,
    trend: `完成率 ${completionRate.value}% 棒棒哒！`,
    trendType: 'positive',
    trendIcon: 'Check',
    chartClass: 'mini-chart-progress',
    onClick: () => navigateTo('/repair?status=completed')
  },
  {
    type: 'info',
    icon: 'User',
    actionIcon: 'UserFilled',
    title: '宿舍小伙伴',
    value: statistics.totalUsers,
    trend: `${statistics.totalDormitories} 间温馨小窝`,
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
    title: '我要报修',
    description: '有什么问题告诉小管家吧~',
    onClick: () => quickCreateOrder()
  },
  {
    icon: 'List',
    iconClass: 'manage',
    title: '工单管理',
    description: '看看大家都遇到了什么问题',
    onClick: () => navigateTo('/repair')
  },
  {
    icon: 'UserFilled',
    iconClass: 'user',
    title: '小伙伴管理',
    description: '管理宿舍里的小伙伴们',
    onClick: () => navigateTo('/users')
  },
  {
    icon: 'House',
    iconClass: 'dorm',
    title: '温馨小窝',
    description: '管理我们的宿舍信息',
    onClick: () => navigateTo('/dormitory')
  }
])

// 系统状态配置
const systemStatus = ref([
  {
    title: '小管家前台',
    value: '精神满满！',
    status: 'online',
    metricLabel: '响应速度',
    metricValue: '< 100ms',
    metricClass: 'success'
  },
  {
    title: '小管家后台',
    value: '工作中...',
    status: 'online',
    metricLabel: '处理速度',
    metricValue: '156ms',
    metricClass: 'success'
  },
  {
    title: '数据小仓库',
    value: '连接顺畅~',
    status: 'online',
    metricLabel: '查询速度',
    metricValue: '23ms',
    metricClass: 'success'
  }
])

// 图标类型映射
const getHandDrawnIconType = (iconName) => {
  const iconMap = {
    'Document': 'manage',
    'Clock': 'chart',
    'CircleCheck': 'heart',
    'UserFilled': 'user',
    'Plus': 'repair',
    'List': 'manage',
    'User': 'user',
    'Setting': 'manage'
  }
  return iconMap[iconName] || 'star'
}

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

<script>
export default {
  name: 'Dashboard',
  components: {
    HandDrawnIcons
  }
}
</script>

<style scoped>
/* 温馨宿舍小管家样式 */
.cozy-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #FFF8F0 0%, #F0F8FF 50%, #F5F0FF 100%);
  min-height: 100vh;
  position: relative;
}

.cozy-dashboard::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(173, 216, 230, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(221, 160, 221, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.cozy-dashboard > * {
  position: relative;
  z-index: 1;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #FFB6C1 0%, #DDA0DD 50%, #87CEEB 100%);
  color: white;
  padding: 40px;
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.welcome-illustration {
  margin-bottom: 16px;
}

/* 飘浮元素容器 */
.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主房子动画 */
.main-house {
  animation: float-main 6s ease-in-out infinite;
  z-index: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* 小装饰房子动画 */
.small-house-1 {
  position: absolute;
  top: -10px;
  right: -15px;
  animation: float-small-1 8s ease-in-out infinite;
  z-index: 2;
}

.small-house-2 {
  position: absolute;
  bottom: -5px;
  left: -10px;
  animation: float-small-2 7s ease-in-out infinite;
  z-index: 2;
}

/* 星星动画 */
.star-1 {
  position: absolute;
  top: 10px;
  left: -20px;
  animation: twinkle-1 4s ease-in-out infinite;
  z-index: 1;
}

.star-2 {
  position: absolute;
  top: -15px;
  right: 10px;
  animation: twinkle-2 5s ease-in-out infinite;
  z-index: 1;
}

.star-3 {
  position: absolute;
  bottom: 15px;
  right: -5px;
  animation: twinkle-3 3s ease-in-out infinite;
  z-index: 1;
}

.hand-drawn-icon {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.button-icon {
  margin-right: 8px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.cozy-button {
  border-radius: 20px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  border: 2px solid transparent !important;
  backdrop-filter: blur(10px);
}

.cozy-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.cozy-button.secondary {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.cozy-button.goodbye {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 182, 193, 0.5) !important;
  color: #FFB6C1 !important;
}

.welcome-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.welcome-content .welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  animation: fadeInUp 0.8s ease-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-content .greeting {
  margin-right: 12px;
}

.welcome-content .user-name {
  color: #FFF8DC;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.welcome-content .welcome-subtitle {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 20px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.quick-stats {
  display: flex;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  backdrop-filter: blur(15px);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.stat-item:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-actions {
  display: flex;
  gap: 16px;
  animation: fadeInLeft 0.8s ease-out 0.3s both;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.overview-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #FEFEFE 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 
    0 8px 32px rgba(255, 182, 193, 0.12),
    0 2px 8px rgba(173, 216, 230, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 182, 193, 0.1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  backdrop-filter: blur(10px);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #FFB6C1 0%, #DDA0DD 50%, #87CEEB 100%);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px 20px 0 0;
}

.overview-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -50px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: all 0.4s ease;
}

.overview-card:hover::before {
  transform: scaleX(1);
}

.overview-card:hover::after {
  right: -30px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.1) 0%, transparent 70%);
}

.overview-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(255, 182, 193, 0.2),
    0 8px 16px rgba(173, 216, 230, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 182, 193, 0.2);
}

.overview-card.primary { --card-color: #FFB6C1; }
.overview-card.warning { --card-color: #F0E68C; }
.overview-card.success { --card-color: #98FB98; }
.overview-card.info { --card-color: #DDA0DD; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 20px rgba(255, 182, 193, 0.2),
    0 2px 4px rgba(221, 160, 221, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.card-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.primary .card-icon { 
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.warning .card-icon { 
  background: linear-gradient(135deg, #F0E68C 0%, #FFFFE0 100%); 
  color: #8B7D3A;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.success .card-icon { 
  background: linear-gradient(135deg, #98FB98 0%, #90EE90 100%); 
  color: #2E8B57;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.info .card-icon { 
  background: linear-gradient(135deg, #DDA0DD 0%, #E6E6FA 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.overview-card:hover .card-icon {
  transform: scale(1.15) rotate(8deg);
  box-shadow: 
    0 12px 28px rgba(255, 182, 193, 0.3),
    0 4px 8px rgba(221, 160, 221, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-title {
  font-size: 15px;
  color: #8B7D9B;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF69B4 0%, #9370DB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(255, 105, 180, 0.1);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card-trend.positive { 
  color: #20B2AA;
  background: rgba(32, 178, 170, 0.1);
  border: 1px solid rgba(32, 178, 170, 0.2);
}
.card-trend.urgent { 
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.2);
}
.card-trend.neutral { 
  color: #9B59B6;
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid rgba(155, 89, 182, 0.2);
}

.card-trend:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主要内容区域 */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 32px;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
.quick-actions-card, .recent-orders-card, .system-status-card, .api-status-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #FEFEFE 100%);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(255, 182, 193, 0.08),
    0 2px 8px rgba(173, 216, 230, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 182, 193, 0.08);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.quick-actions-card::before, .recent-orders-card::before, 
.system-status-card::before, .api-status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.quick-actions-card:hover, .recent-orders-card:hover, 
.system-status-card:hover, .api-status-card:hover {
  box-shadow: 
    0 16px 48px rgba(255, 182, 193, 0.15),
    0 8px 16px rgba(173, 216, 230, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(255, 182, 193, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #6B5B95;
  padding: 24px 24px 0;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}

.header-left .hand-drawn-icon {
  color: #FFB6C1;
  filter: drop-shadow(0 2px 4px rgba(255, 182, 193, 0.3));
}

/* 快速操作 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.05) 0%, rgba(173, 216, 230, 0.05) 100%);
  border-radius: 16px;
  border: 2px solid rgba(255, 182, 193, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.quick-action-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.quick-action-item:hover::before {
  left: 100%;
}

.quick-action-item:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(173, 216, 230, 0.1) 100%);
  border-color: rgba(255, 182, 193, 0.2);
  box-shadow: 0 8px 25px rgba(255, 182, 193, 0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 12px rgba(255, 182, 193, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.action-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.quick-action-item:hover .action-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 
    0 8px 20px rgba(255, 182, 193, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.action-icon.create { 
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.action-icon.manage { 
  background: linear-gradient(135deg, #98FB98 0%, #32CD32 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.action-icon.user { 
  background: linear-gradient(135deg, #DDA0DD 0%, #9370DB 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.action-icon.dorm { 
  background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-title {
  font-weight: 700;
  margin-bottom: 6px;
  color: #6B5B95;
  font-size: 16px;
  position: relative;
  z-index: 1;
}

.action-desc {
  font-size: 13px;
  color: #8B7D9B;
  font-weight: 500;
  position: relative;
  z-index: 1;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 动画关键帧 */
@keyframes float-main {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(1deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-12px) rotate(-1deg); }
}

@keyframes float-small-1 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.7; }
  33% { transform: translateY(-6px) translateX(2px) rotate(2deg); opacity: 0.9; }
  66% { transform: translateY(-3px) translateX(-1px) rotate(-1deg); opacity: 0.6; }
}

@keyframes float-small-2 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.7; }
  40% { transform: translateY(-4px) translateX(-2px) rotate(-2deg); opacity: 0.8; }
  80% { transform: translateY(-7px) translateX(1px) rotate(1deg); opacity: 0.5; }
}

@keyframes twinkle-1 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.4; }
}

@keyframes twinkle-2 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  25% { transform: scale(0.8) rotate(90deg); opacity: 0.9; }
  75% { transform: scale(1.1) rotate(270deg); opacity: 0.3; }
}

@keyframes twinkle-3 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  60% { transform: scale(1.3) rotate(-180deg); opacity: 0.8; }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
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