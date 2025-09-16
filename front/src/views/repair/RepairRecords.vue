<template>
  <div class="repair-records">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>报修记录</h2>
      <p class="page-description">查看和管理所有报修记录</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-card shadow="never">
        <el-form :model="filterForm" inline>
          <el-form-item label="报修类型">
            <el-select v-model="filterForm.type" placeholder="请选择报修类型" clearable>
              <el-option label="水电维修" value="water_electric" />
              <el-option label="家具维修" value="furniture" />
              <el-option label="网络问题" value="network" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
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
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>报修记录列表</span>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出记录
            </el-button>
          </div>
        </template>
        
        <el-table 
          :data="tableData" 
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="工单号" width="120" />
          <el-table-column prop="title" label="报修标题" min-width="200" />
          <el-table-column prop="type" label="报修类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)">{{ getTypeText(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="报修地点" width="150" />
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
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleView(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button type="warning" size="small" @click="handleEdit(row)" v-if="row.status !== 'completed'">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download, View, Edit } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const tableData = ref([])

// 筛选表单
const filterForm = reactive({
  type: '',
  status: '',
  dateRange: []
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 模拟数据
const mockData = [
  {
    id: 'WO202401001',
    title: '宿舍水龙头漏水',
    type: 'water_electric',
    location: '1号楼201室',
    status: 'completed',
    priority: 'high',
    createTime: '2024-01-15 09:30:00',
    updateTime: '2024-01-16 14:20:00'
  },
  {
    id: 'WO202401002',
    title: '桌椅损坏需要维修',
    type: 'furniture',
    location: '2号楼305室',
    status: 'processing',
    priority: 'medium',
    createTime: '2024-01-16 10:15:00',
    updateTime: '2024-01-16 15:30:00'
  },
  {
    id: 'WO202401003',
    title: '网络连接异常',
    type: 'network',
    location: '3号楼102室',
    status: 'pending',
    priority: 'low',
    createTime: '2024-01-17 08:45:00',
    updateTime: '2024-01-17 08:45:00'
  }
]

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    water_electric: 'primary',
    furniture: 'success',
    network: 'warning',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取类型文本
const getTypeText = (type) => {
  const typeMap = {
    water_electric: '水电维修',
    furniture: '家具维修',
    network: '网络问题',
    other: '其他'
  }
  return typeMap[type] || '未知'
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

// 搜索
const handleSearch = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loadData()
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

// 重置
const handleReset = () => {
  filterForm.type = ''
  filterForm.status = ''
  filterForm.dateRange = []
  loadData()
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 查看详情
const handleView = (row) => {
  ElMessage.info(`查看工单: ${row.id}`)
}

// 编辑
const handleEdit = (row) => {
  ElMessage.info(`编辑工单: ${row.id}`)
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
  // 模拟API调用
  setTimeout(() => {
    tableData.value = mockData
    pagination.total = mockData.length
    loading.value = false
  }, 500)
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.repair-records {
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

.filter-section {
  margin-bottom: 20px;
}

.table-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>