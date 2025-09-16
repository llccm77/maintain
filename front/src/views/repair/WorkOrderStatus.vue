<template>
  <div class="work-order-status">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工单状态</h2>
      <p class="page-description">实时查看和跟踪工单处理状态</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card pending">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.pending }}</div>
                <div class="stats-label">待处理</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card processing">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon><Loading /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.processing }}</div>
                <div class="stats-label">处理中</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card completed">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.completed }}</div>
                <div class="stats-label">已完成</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card total">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.total }}</div>
                <div class="stats-label">总工单</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
  View, Edit
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

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.work-order-status {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-description {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-section {
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stats-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stats-card.pending .stats-icon {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.stats-card.processing .stats-icon {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.stats-card.completed .stats-icon {
  background: linear-gradient(135deg, #27ae60, #229954);
}

.stats-card.total .stats-icon {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.stats-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.filter-section {
  margin-bottom: 20px;
}

.order-list-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-view {
  min-height: 400px;
}

.order-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-weight: 600;
  color: #303133;
}

.order-card-content {
  padding: 0;
}

.order-title {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.order-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  color: #909399;
  margin-right: 8px;
  min-width: 60px;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
  margin-bottom: 15px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}

:deep(.el-progress-bar__outer) {
  border-radius: 3px;
}
</style>