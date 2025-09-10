<template>
  <div class="modern-dashboard">

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="overview-card primary">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-title">总工单数</div>
            <div class="card-value">{{ statistics.total_orders || 0 }}</div>
            <div class="card-trend positive">
              <el-icon><TrendCharts /></el-icon>
              较昨日 +12.5%
            </div>
          </div>
        </div>
        <div class="card-chart">
          <div class="mini-chart-line"></div>
        </div>
      </div>

      <div class="overview-card warning">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-title">待处理</div>
            <div class="card-value">{{ statistics.pending_orders || 0 }}</div>
            <div class="card-trend urgent">
              <el-icon><Warning /></el-icon>
              需要关注
            </div>
          </div>
        </div>
        <div class="card-chart">
          <div class="mini-chart-bar"></div>
        </div>
      </div>

      <div class="overview-card success">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-title">已完成</div>
            <div class="card-value">{{ statistics.completed_orders || 0 }}</div>
            <div class="card-trend positive">
              <el-icon><Check /></el-icon>
              完成率 {{ completionRate }}%
            </div>
          </div>
        </div>
        <div class="card-chart">
          <div class="mini-chart-progress"></div>
        </div>
      </div>

      <div class="overview-card info">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-title">系统用户</div>
            <div class="card-value">{{ statistics.total_users || 0 }}</div>
            <div class="card-trend neutral">
              <el-icon><House /></el-icon>
              {{ statistics.total_dormitories || 0 }} 间宿舍
            </div>
          </div>
        </div>
        <div class="card-chart">
          <div class="mini-chart-donut"></div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 工单状态分析 -->
        <el-card class="analytics-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><PieChartIcon /></el-icon>
                <span>工单状态分析</span>
              </div>
              <el-select v-model="chartTimeRange" @change="updateChartData" size="small">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="pieChartOption" style="height: 300px;" />
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color pending"></div>
              <span>待处理 ({{ statistics.pending_orders }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color processing"></div>
              <span>维修中 ({{ processingCount }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color completed"></div>
              <span>已完成 ({{ statistics.completed_orders }})</span>
            </div>
          </div>
        </el-card>

        <!-- 趋势分析 -->
        <el-card class="trend-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><TrendCharts /></el-icon>
                <span>工单趋势</span>
              </div>
              <div class="header-actions">
                <el-button-group size="small">
                  <el-button :type="trendType === 'day' ? 'primary' : ''" @click="changeTrendType('day')">日</el-button>
                  <el-button :type="trendType === 'week' ? 'primary' : ''" @click="changeTrendType('week')">周</el-button>
                  <el-button :type="trendType === 'month' ? 'primary' : ''" @click="changeTrendType('month')">月</el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="lineChartOption" style="height: 350px;" />
          </div>
        </el-card>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- API连接状态 -->
        <el-card class="api-status-card">
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>API连接状态</span>
              <el-button @click="testApiConnections" size="small" :loading="apiTesting">
                <el-icon><Refresh /></el-icon>
                测试连接
              </el-button>
            </div>
          </template>
          <div class="api-status-list">
            <div v-for="(status, api) in apiStatus" :key="api" class="api-status-item">
              <div class="api-name">
                <el-icon :class="getApiIconClass(api)"></el-icon>
                {{ getApiDisplayName(api) }}
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
        
        <!-- 快速操作 -->
        <el-card class="quick-actions-card">
          <template #header>
            <div class="card-header">
              <el-icon><Lightning /></el-icon>
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions-grid">
            <div class="quick-action-item" @click="quickCreateOrder">
              <div class="action-icon create">
                <el-icon><Plus /></el-icon>
              </div>
              <div class="action-content">
                <div class="action-title">新建工单</div>
                <div class="action-desc">快速创建维修工单</div>
              </div>
            </div>
            <div class="quick-action-item" @click="navigateTo('/repair')">
              <div class="action-icon manage">
                <el-icon><List /></el-icon>
              </div>
              <div class="action-content">
                <div class="action-title">工单管理</div>
                <div class="action-desc">查看所有工单</div>
              </div>
            </div>
            <div class="quick-action-item" @click="navigateTo('/users')">
              <div class="action-icon user">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="action-content">
                <div class="action-title">用户管理</div>
                <div class="action-desc">系统用户管理</div>
              </div>
            </div>
            <div class="quick-action-item" @click="navigateTo('/dormitory')">
              <div class="action-icon dorm">
                <el-icon><House /></el-icon>
              </div>
              <div class="action-content">
                <div class="action-title">宿舍管理</div>
                <div class="action-desc">宿舍信息管理</div>
              </div>
            </div>
          </div>
        </el-card>

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
          <div v-loading="loading" class="recent-orders-list">
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
                  <span class="order-number">{{ order.order_number }}</span>
                  <el-tag :type="getStatusTagType(order.status)" size="small">
                    {{ getStatusText(order.status) }}
                  </el-tag>
                </div>
                <div class="order-content">
                  <div class="order-title">{{ order.title }}</div>
                  <div class="order-meta">
                    <span><el-icon><User /></el-icon>{{ order.student_name }}</span>
                    <span><el-icon><House /></el-icon>{{ order.dormitory_name }}</span>
                  </div>
                  <div class="order-time">{{ formatDate(order.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 系统状态监控 -->
        <el-card class="system-status-card">
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>系统状态</span>
            </div>
          </template>
          <div class="status-items">
            <div class="status-item">
              <div class="status-indicator online"></div>
              <div class="status-info">
                <div class="status-title">后端服务</div>
                <div class="status-value">运行正常</div>
              </div>
              <div class="status-metrics">
                <div class="metric">
                  <span class="metric-label">延迟</span>
                  <span class="metric-value">15ms</span>
                </div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-indicator online"></div>
              <div class="status-info">
                <div class="status-title">数据库</div>
                <div class="status-value">连接正常</div>
              </div>
              <div class="status-metrics">
                <div class="metric">
                  <span class="metric-label">查询</span>
                  <span class="metric-value">1.2s</span>
                </div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-indicator warning"></div>
              <div class="status-info">
                <div class="status-title">缓存服务</div>
                <div class="status-value">性能降级</div>
              </div>
              <div class="status-metrics">
                <div class="metric">
                  <span class="metric-label">命中率</span>
                  <span class="metric-value">78%</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
// 引入图标
import {
  House, Document, Clock, CircleCheck, User, PieChart as PieChartIcon, TrendCharts,
  Lightning, Plus, List, UserFilled, Bell, Monitor, Refresh,
  ArrowDown, Warning, Check, Setting, Lock, Tools, QuestionFilled
} from '@element-plus/icons-vue'
import { systemAPI, repairAPI, dormitoryAPI, authAPI } from '@/api'
import { APIConnectionTester } from '@/utils/apiTester'

// 注册ECharts组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()

// 响应式数据
const loading = ref(false)
const refreshing = ref(false)
const chartTimeRange = ref('week')
const trendType = ref('week')

const statistics = reactive({
  total_orders: 0,
  pending_orders: 0,
  completed_orders: 0,
  total_users: 0,
  total_dormitories: 0
})

const recentOrders = ref([])
const processingCount = ref(0)

// API连接状态
const apiTesting = ref(false)
const apiTester = new APIConnectionTester()
const apiStatus = reactive({
  system: { connected: false, error: null },
  auth: { connected: false, error: null },
  dormitory: { connected: false, error: null },
  repair: { connected: false, error: null }
})

// 计算属性
const completionRate = computed(() => {
  if (statistics.total_orders === 0) return 0
  return Math.round((statistics.completed_orders / statistics.total_orders) * 100)
})

// ECharts配置
const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: [
    {
      name: '工单状态',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: statistics.pending_orders, name: '待处理', itemStyle: { color: '#f39c12' } },
        { value: processingCount.value, name: '维修中', itemStyle: { color: '#3498db' } },
        { value: statistics.completed_orders, name: '已完成', itemStyle: { color: '#2ecc71' } },
      ]
    }
  ]
}))

const lineChartOption = computed(() => ({
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增工单',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        color: '#409EFF'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(64, 158, 255, 0.3)'
          }, {
            offset: 1, color: 'rgba(64, 158, 255, 0.1)'
          }]
        }
      },
      data: [12, 8, 15, 10, 18, 22, 14]
    },
    {
      name: '完成工单',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        color: '#67C23A'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(103, 194, 58, 0.3)'
          }, {
            offset: 1, color: 'rgba(103, 194, 58, 0.1)'
          }]
        }
      },
      data: [10, 12, 8, 15, 16, 20, 18]
    }
  ]
}))

// 方法
const fetchStatistics = async () => {
  try {
    const response = await systemAPI.getSystemInfo()
    Object.assign(statistics, response.statistics)
  } catch (error) {
    console.error('获取统计信息失败:', error)
    ElMessage.error('获取系统统计信息失败，请检查后端服务连接')
    // 保持默认值0，不使用模拟数据
  }
}

const fetchRecentOrders = async () => {
  try {
    loading.value = true
    const response = await repairAPI.getRepairList({ page: 1, page_size: 5 })
    recentOrders.value = response.results || []
    // 计算维修中的数量
    processingCount.value = recentOrders.value.filter(order => order.status === 'processing').length
  } catch (error) {
    console.error('获取最新工单失败:', error)
    ElMessage.error('获取最新工单失败，请检查后端服务连接')
    // 保持空数组，不使用模拟数据
    recentOrders.value = []
    processingCount.value = 0
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  refreshing.value = true
  try {
    await Promise.all([
      fetchStatistics(),
      fetchRecentOrders()
    ])
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    refreshing.value = false
  }
}

const navigateTo = (route) => {
  router.push(route)
}

const quickCreateOrder = () => {
  router.push('/repair/create')
}

// API连接测试方法
const testApiConnections = async () => {
  apiTesting.value = true
  
  try {
    const testResults = await apiTester.runAllTests()
    
    // 更新API状态
    Object.entries(testResults.results).forEach(([api, result]) => {
      apiStatus[api].connected = result.success
      apiStatus[api].error = result.error
    })
    
    if (testResults.success) {
      ElMessage.success('所有API连接正常')
    } else {
      ElMessage.warning(`有${testResults.totalCount - testResults.successCount}个API连接失败`)
    }
  } catch (error) {
    console.error('API连接测试失败:', error)
    ElMessage.error('API连接测试失败')
  } finally {
    apiTesting.value = false
  }
}

// 获取API显示名称
const getApiDisplayName = (api) => {
  const nameMap = {
    system: '系统管理',
    auth: '认证模块',
    dormitory: '宿舍管理',
    repair: '工单管理'
  }
  return nameMap[api] || api
}

// 获取API图标样式
const getApiIconClass = (api) => {
  const iconMap = {
    system: 'Setting',
    auth: 'Lock',
    dormitory: 'House',
    repair: 'Tools'
  }
  return iconMap[api] || 'QuestionFilled'
}

const viewOrderDetail = (order) => {
  router.push(`/repair/${order.id}`)
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const updateChartData = () => {
  // 根据时间范围更新图表数据
  console.log('更新图表数据:', chartTimeRange.value)
}

const changeTrendType = (type) => {
  trendType.value = type
  // 更新趋势图数据
}


// 生命周期
onMounted(() => {
  fetchStatistics()
  fetchRecentOrders()
  // 自动测试API连接
  testApiConnections()
})
</script>

<style scoped>
/* 现代化仪表盘样式 */
.modern-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}


/* 数据概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.overview-card.primary { border-left: 4px solid #3b82f6; }
.overview-card.warning { border-left: 4px solid #f59e0b; }
.overview-card.success { border-left: 4px solid #10b981; }
.overview-card.info { border-left: 4px solid #8b5cf6; }

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.overview-card.primary .card-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.overview-card.warning .card-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.overview-card.success .card-icon { background: linear-gradient(135deg, #10b981, #059669); }
.overview-card.info .card-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-trend.positive { color: #10b981; }
.card-trend.urgent { color: #ef4444; }
.card-trend.neutral { color: #6b7280; }

.card-chart {
  height: 20px;
  position: relative;
  overflow: hidden;
}

.mini-chart-line,
.mini-chart-bar,
.mini-chart-progress,
.mini-chart-donut {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.3));
  border-radius: 4px;
  position: relative;
}

/* 主要内容区域 */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 0 24px 24px;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片通用样式 */
.el-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1f2937;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 图表容器 */
.chart-container {
  padding: 16px 0;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.pending { background: #f59e0b; }
.legend-color.processing { background: #3b82f6; }
.legend-color.completed { background: #10b981; }

/* 快速操作 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.quick-action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.quick-action-item:hover {
  border-color: #3b82f6;
  background: #f8faff;
  transform: translateY(-2px);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.action-icon.create { background: linear-gradient(135deg, #10b981, #059669); }
.action-icon.manage { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.action-icon.user { background: linear-gradient(135deg, #f59e0b, #d97706); }
.action-icon.dorm { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 12px;
  color: #6b7280;
}

/* 最新工单 */
.recent-orders-list {
  max-height: 400px;
  overflow-y: auto;
}

.order-item {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.order-item:hover {
  background-color: #f9fafb;
}

.order-item:last-child {
  border-bottom: none;
}

/* API连接状态样式 */
.api-status-card {
  margin-bottom: 24px;
}

.api-status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.api-status-item:hover {
  background: #e9ecef;
}

.api-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
}

.api-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.api-error {
  color: #ef4444;
  cursor: help;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-number {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.order-content {
  margin-left: 0;
}

.order-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
}

.order-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 4px;
}

.order-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.order-time {
  font-size: 11px;
  color: #9ca3af;
}

/* 系统状态监控 */
.status-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background: #10b981;
}

.status-indicator.warning {
  background: #f59e0b;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.status-value {
  font-size: 12px;
  color: #6b7280;
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
  color: #9ca3af;
  text-transform: uppercase;
}

.metric-value {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 空状态 */
.empty-state {
  padding: 32px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .overview-cards {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  
  .overview-cards {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .dashboard-content {
    padding: 0 16px 16px;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .order-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .system-title {
    font-size: 18px;
  }
  
  .card-value {
    font-size: 24px;
  }
  
  .quick-action-item {
    padding: 12px;
  }
}
</style>

<style scoped>
.modern-dashboard {
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}



/* 数据概览卡片样式 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.overview-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 16px;
  color: #666;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin: 5px 0;
  color: #333;
}

.card-trend {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.card-trend .el-icon {
  margin-right: 5px;
}

.card-trend.positive .el-icon {
  color: #2ecc71;
}

.card-trend.urgent .el-icon {
  color: #e74c3c;
}

.card-trend.neutral .el-icon {
  color: #3498db;
}

.card-chart {
  width: 100%;
  height: 100px;
  border-top: 1px solid #e1e5e9;
  margin-top: 10px;
}

.card-chart .mini-chart-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
}

.card-chart .mini-chart-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
}

.card-chart .mini-chart-progress {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
}

.card-chart .mini-chart-donut {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
}

/* 主要内容区域样式 */
.dashboard-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 1;
}

/* 工单状态分析卡片样式 */
.analytics-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .el-icon {
  margin-right: 5px;
}

.header-left span {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
}

.legend-color.pending {
  background: #f39c12;
}

.legend-color.processing {
  background: #3498db;
}

.legend-color.completed {
  background: #2ecc71;
}

/* 趋势分析卡片样式 */
.trend-card {
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* 快速操作卡片样式 */
.quick-actions-card {
  margin-bottom: 20px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.quick-action-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quick-action-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.action-icon.create {
  background: #409EFF;
}

.action-icon.manage {
  background: #3498db;
}


.action-icon.dorm {
  background: #2ecc71;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.action-desc {
  font-size: 14px;
  color: #666;
}

/* 最新工单卡片样式 */
.recent-orders-card {
  margin-bottom: 20px;
}

.recent-orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #409EFF;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-number {
  font-weight: bold;
  color: #333;
}

.order-content {
  display: flex;
  flex-direction: column;
}

.order-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.order-meta {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  display: flex;
  gap: 10px;
}

.order-time {
  font-size: 14px;
  color: #999;
}

/* 系统状态监控卡片样式 */
.system-status-card {
  margin-bottom: 20px;
}

.status-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.online {
  background: #2ecc71;
}

.status-indicator.warning {
  background: #e74c3c;
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-title {
  font-size: 14px;
  color: #666;
}

.status-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.status-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 5px;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.metric-value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
