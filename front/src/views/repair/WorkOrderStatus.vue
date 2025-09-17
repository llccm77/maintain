<template>
  <div class="work-order-status">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工单状态</h2>
      <p class="page-description">实时查看和跟踪工单处理状态</p>
    </div>

    <!-- 工单状态统计 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <el-icon size="24"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总工单</div>
            <div class="stat-note">小管家收到的任务</div>
          </div>
          <i class="stat-decoration iconfont icon-wendang"></i>
        </div>
        
        <div class="stat-card pending">
          <div class="stat-icon">
            <el-icon size="24"><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">待处理</div>
            <div class="stat-note">等待小管家分配</div>
          </div>
          <i class="stat-decoration iconfont icon-shijian"></i>
        </div>
        
        <div class="stat-card processing">
          <div class="stat-icon">
            <el-icon size="24"><Tools /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
            <div class="stat-note">小管家正在努力</div>
          </div>
          <i class="stat-decoration iconfont icon-gongju"></i>
        </div>
        
        <div class="stat-card completed">
          <div class="stat-icon">
            <el-icon size="24"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
            <div class="stat-note">小管家的成就</div>
          </div>
          <i class="stat-decoration iconfont icon-wancheng"></i>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-card shadow="never">
        <el-form :model="filterForm" inline>
          <el-form-item label="工单号">
            <el-input 
              v-model="filterForm.orderId" 
              placeholder="请输入工单号" 
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-select v-model="filterForm.priority" placeholder="请选择优先级" clearable>
              <el-option label="高" value="high" />
              <el-option label="中" value="medium" />
              <el-option label="低" value="low" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button @click="handleRefresh">
              <el-icon><RefreshRight /></el-icon>
              刷新
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 工单列表 -->
    <div class="order-list-section">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>工单列表</span>
            <div class="header-actions">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="list">列表视图</el-radio-button>
                <el-radio-button label="card">卡片视图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>

        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'">
          <el-table 
            :data="tableData" 
            v-loading="loading"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="id" label="工单号" width="120" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityTagType(row.priority)">{{ getPriorityText(row.priority) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="assignee" label="处理人" width="120" />
            <el-table-column prop="progress" label="进度" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :status="getProgressStatus(row.status)" />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleViewDetail(row)">
                  <el-icon><View /></el-icon>
                  详情
                </el-button>
                <el-button 
                  type="success" 
                  size="small" 
                  @click="handleUpdateStatus(row)"
                  v-if="row.status !== 'completed'"
                >
                  <el-icon><Edit /></el-icon>
                  更新
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 卡片视图 -->
        <div v-else class="card-view">
          <el-row :gutter="20">
            <el-col :span="8" v-for="item in tableData" :key="item.id">
              <el-card class="order-card" shadow="hover">
                <template #header>
                  <div class="order-card-header">
                    <span class="order-id">{{ item.id }}</span>
                    <el-tag :type="getStatusTagType(item.status)" size="small">
                      {{ getStatusText(item.status) }}
                    </el-tag>
                  </div>
                </template>
                <div class="order-card-content">
                  <h4 class="order-title">{{ item.title }}</h4>
                  <div class="order-info">
                    <div class="info-item">
                      <span class="label">优先级：</span>
                      <el-tag :type="getPriorityTagType(item.priority)" size="small">
                        {{ getPriorityText(item.priority) }}
                      </el-tag>
                    </div>
                    <div class="info-item">
                      <span class="label">处理人：</span>
                      <span>{{ item.assignee || '未分配' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">进度：</span>
                      <el-progress 
                        :percentage="item.progress" 
                        :status="getProgressStatus(item.status)"
                        :stroke-width="6"
                      />
                    </div>
                    <div class="info-item">
                      <span class="label">创建时间：</span>
                      <span>{{ item.createTime }}</span>
                    </div>
                  </div>
                  <div class="order-actions">
                    <el-button type="primary" size="small" @click="handleViewDetail(item)">
                      <el-icon><View /></el-icon>
                      查看详情
                    </el-button>
                    <el-button 
                      type="success" 
                      size="small" 
                      @click="handleUpdateStatus(item)"
                      v-if="item.status !== 'completed'"
                    >
                      <el-icon><Edit /></el-icon>
                      更新状态
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[9, 18, 36]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Clock, Loading, CircleCheck, Document, Search, Refresh, RefreshRight,
  View, Edit, Tools
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const viewMode = ref('list')
const tableData = ref([])

// 筛选表单
const filterForm = reactive({
  orderId: '',
  status: '',
  priority: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 9,
  total: 0
})

// 统计数据
const stats = reactive({
  pending: 0,
  processing: 0,
  completed: 0,
  total: 0
})

// 模拟数据
const mockData = [
  {
    id: 'WO202401001',
    title: '宿舍水龙头漏水维修',
    status: 'completed',
    priority: 'high',
    assignee: '张师傅',
    progress: 100,
    createTime: '2024-01-15 09:30:00'
  },
  {
    id: 'WO202401002',
    title: '桌椅损坏需要维修',
    status: 'processing',
    priority: 'medium',
    assignee: '李师傅',
    progress: 60,
    createTime: '2024-01-16 10:15:00'
  },
  {
    id: 'WO202401003',
    title: '网络连接异常处理',
    status: 'pending',
    priority: 'low',
    assignee: '',
    progress: 0,
    createTime: '2024-01-17 08:45:00'
  },
  {
    id: 'WO202401004',
    title: '空调制冷效果差',
    status: 'processing',
    priority: 'high',
    assignee: '王师傅',
    progress: 30,
    createTime: '2024-01-17 14:20:00'
  },
  {
    id: 'WO202401005',
    title: '门锁损坏更换',
    status: 'completed',
    priority: 'medium',
    assignee: '赵师傅',
    progress: 100,
    createTime: '2024-01-18 11:00:00'
  }
]

// 计算统计数据
const calculateStats = () => {
  stats.pending = mockData.filter(item => item.status === 'pending').length
  stats.processing = mockData.filter(item => item.status === 'processing').length
  stats.completed = mockData.filter(item => item.status === 'completed').length
  stats.total = mockData.length
}

// 获取状态标签样式
const getStatusTagType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

// 获取优先级标签样式
const getPriorityTagType = (priority) => {
  const priorityMap = {
    high: 'danger',
    medium: 'warning',
    low: 'success'
  }
  return priorityMap[priority] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority) => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority] || '未知'
}

// 获取进度条状态
const getProgressStatus = (status) => {
  if (status === 'completed') return 'success'
  if (status === 'processing') return undefined
  return undefined
}

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loadData()
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

// 重置
const handleReset = () => {
  filterForm.orderId = ''
  filterForm.status = ''
  filterForm.priority = ''
  loadData()
}

// 刷新
const handleRefresh = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

// 查看详情
const handleViewDetail = (row) => {
  ElMessage.info(`查看工单详情: ${row.id}`)
}

// 更新状态
const handleUpdateStatus = (row) => {
  ElMessageBox.confirm(
    `确定要更新工单 ${row.id} 的状态吗？`,
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('状态更新成功')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadData()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadData()
}

// 加载数据
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = mockData
    pagination.total = mockData.length
    calculateStats()
    loading.value = false
  }, 500)
}

// 微交互处理
const handleStatHover = (type) => {
  // 可以在这里添加更多的悬停效果逻辑
}

const handleStatLeave = () => {
  // 可以在这里添加离开悬停的逻辑
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.work-order-status {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.page-header h2 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.page-description {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  font-weight: 400;
}

.stats-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
    background: #ffffff;
    border: none;
    border-radius: 20px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, currentColor 2px, transparent 2px);
    background-size: 8px 8px;
    opacity: 0.1;
    transform: rotate(45deg);
  }
 
 .stat-card:hover {
   box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
   transform: translateY(-4px) scale(1.02);
 }
 
 .stat-card.total {
   color: #6b7280;
   background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
 }
 
 .stat-card.pending {
   color: #f59e0b;
   background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
 }
 
 .stat-card.processing {
   color: #3b82f6;
   background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
 }
 
 .stat-card.completed {
   color: #10b981;
   background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
 }

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f9fafb;
  color: #6b7280;
}

.stat-card.total .stat-icon {
  background: #f3f4f6;
  color: #6b7280;
}

.stat-card.pending .stat-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-card.processing .stat-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-card.completed .stat-icon {
  background: #d1fae5;
  color: #10b981;
}

.stat-content {
   flex: 1;
 }
 
 .stat-number {
   font-size: 32px;
   font-weight: 700;
   color: #111827;
   margin: 0 0 4px 0;
   line-height: 1;
 }
 
 .stat-label {
   font-size: 14px;
   font-weight: 500;
   color: #6b7280;
   margin: 0 0 2px 0;
 }
 
 .stat-note {
   font-size: 12px;
   color: #9ca3af;
   font-style: italic;
   margin: 0;
 }
 
 .stat-decoration {
     font-size: 20px;
     opacity: 0.7;
     position: absolute;
     top: 14px;
     right: 14px;
     transform: rotate(8deg);
     transition: all 0.3s ease;
     color: inherit;
   }
   
   .stat-card:hover .stat-decoration {
     transform: rotate(-3deg) scale(1.1);
     opacity: 0.9;
   }
   
   .stat-card.total .stat-decoration {
     color: #409eff;
   }
   
   .stat-card.pending .stat-decoration {
     color: #e6a23c;
   }
   
   .stat-card.processing .stat-decoration {
     color: #67c23a;
   }
   
   .stat-card.completed .stat-decoration {
     color: #f56c6c;
   }
  


.filter-section {
  margin-bottom: 32px;
}

.order-list-section {
  margin-bottom: 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-view {
  min-height: 400px;
}

.order-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  background: #ffffff;
}

.order-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  letter-spacing: 0.025em;
}

.order-card-content {
  padding: 0;
}

.order-title {
  margin: 0 0 16px 0;
  color: #111827;
  font-size: 16px;
  font-weight: 500;
}

.order-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  color: #6b7280;
  margin-right: 8px;
  min-width: 60px;
  font-weight: 400;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

:deep(.el-card) {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
  margin-bottom: 16px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: none;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #9ca3af;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

:deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

:deep(.el-table th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
  background-color: #f3f4f6;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}

:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  letter-spacing: 0.025em;
}

:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-radio-button__inner) {
  border-radius: 8px;
  font-weight: 500;
}
</style>