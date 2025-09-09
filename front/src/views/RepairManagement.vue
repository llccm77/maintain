<template>
  <div class="repair-management">
    <div class="page-header">
      <h1>报修工单管理</h1>
      <button @click="showAddDialog = true" class="add-btn">
        ➕ 新增工单
      </button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <div class="search-group">
        <input
          v-model="searchForm.keyword"
          type="text"
          placeholder="搜索工单号、标题或学生姓名..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">搜索</button>
      </div>
      
      <div class="filter-group">
        <select v-model="searchForm.status" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">维修中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
        
        <select v-model="searchForm.priority" @change="handleSearch">
          <option value="">全部优先级</option>
          <option value="urgent">紧急</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        
        <select v-model="searchForm.fault_type" @change="handleSearch">
          <option value="">全部类型</option>
          <option value="water">水电故障</option>
          <option value="furniture">家具损坏</option>
          <option value="door_window">门窗问题</option>
          <option value="network">网络故障</option>
          <option value="other">其他问题</option>
        </select>
      </div>
    </div>

    <!-- 工单统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <h3>{{ statistics.total || 0 }}</h3>
          <p>总工单数</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-info">
          <h3>{{ statistics.pending || 0 }}</h3>
          <p>待处理</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-info">
          <h3>{{ statistics.processing || 0 }}</h3>
          <p>维修中</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>{{ statistics.completed || 0 }}</h3>
          <p>已完成</p>
        </div>
      </div>
    </div>

    <!-- 工单列表 -->
    <div class="repairs-container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="repairs.length === 0" class="no-data">暂无工单数据</div>
      <div v-else class="repairs-list">
        <div 
          v-for="repair in repairs" 
          :key="repair.id"
          class="repair-card"
          @click="viewRepairDetail(repair)"
        >
          <!-- 工单头部 -->
          <div class="card-header">
            <div class="order-info">
              <h3>{{ repair.order_number }}</h3>
              <span class="priority-badge" :class="getPriorityClass(repair.priority)">
                {{ getPriorityText(repair.priority) }}
              </span>
            </div>
            <div class="status-badge" :class="getStatusClass(repair.status)">
              {{ getStatusText(repair.status) }}
            </div>
          </div>
          
          <!-- 工单内容 -->
          <div class="card-content">
            <h4 class="repair-title">{{ repair.title }}</h4>
            <p class="repair-description">{{ repair.description }}</p>
            
            <div class="repair-meta">
              <div class="meta-row">
                <span class="label">🏠 宿舍:</span>
                <span class="value">{{ repair.dormitory_name || `${repair.dormitory?.building_name}-${repair.dormitory?.room_number}` }}</span>
              </div>
              
              <div class="meta-row">
                <span class="label">👤 报修人:</span>
                <span class="value">{{ repair.student_name || repair.student?.name }}</span>
              </div>
              
              <div class="meta-row">
                <span class="label">🔧 故障类型:</span>
                <span class="value fault-type" :class="getFaultTypeClass(repair.fault_type)">
                  {{ getFaultTypeText(repair.fault_type) }}
                </span>
              </div>
              
              <div class="meta-row">
                <span class="label">📅 创建时间:</span>
                <span class="value">{{ formatDate(repair.created_at) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="card-actions">
            <button @click.stop="editRepair(repair)" class="edit-btn">✏️ 编辑</button>
            <button @click.stop="updateStatus(repair)" class="status-btn">
              {{ getStatusActionText(repair.status) }}
            </button>
            <button @click.stop="deleteRepair(repair)" class="delete-btn">🗑️ 删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && repairs.length > 0" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" class="page-btn">
        上一页
      </button>
      <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" class="page-btn">
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { repairAPI, studentAPI, dormitoryAPI } from '@/api'

// 响应式数据
const loading = ref(false)
const repairs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 统计数据
const statistics = reactive({
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  priority: '',
  fault_type: ''
})

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

// 获取工单列表
const fetchRepairs = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchForm.keyword,
      status: searchForm.status,
      priority: searchForm.priority,
      fault_type: searchForm.fault_type
    }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const response = await repairAPI.getRepairList(params)
    repairs.value = response.results || []
    totalCount.value = response.count || 0
    updateStatistics()
  } catch (error) {
    console.error('获取工单列表失败:', error)
    ElMessage.error('获取工单列表失败，请检查后端服务连接')
    // 保持空数组，不使用模拟数据
    repairs.value = []
    totalCount.value = 0
    updateStatistics()
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStatistics = () => {
  statistics.total = repairs.value.length
  statistics.pending = repairs.value.filter(r => r.status === 'pending').length
  statistics.processing = repairs.value.filter(r => r.status === 'processing').length
  statistics.completed = repairs.value.filter(r => r.status === 'completed').length
}

// 其他方法
const handleSearch = () => {
  currentPage.value = 1
  fetchRepairs()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchRepairs()
  }
}

const viewRepairDetail = (repair) => {
  alert(`工单详情: ${repair.order_number} - ${repair.title}`)
}

const editRepair = (repair) => {
  alert(`编辑工单: ${repair.order_number}`)
}

const updateStatus = (repair) => {
  alert(`更新状态: ${repair.order_number}`)
}

const deleteRepair = (repair) => {
  if (confirm(`确定要删除工单 ${repair.order_number} 吗？`)) {
    alert('删除成功')
    fetchRepairs()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 样式类方法
const getPriorityClass = (priority) => {
  const priorityMap = {
    'low': 'priority-low',
    'medium': 'priority-medium', 
    'high': 'priority-high',
    'urgent': 'priority-urgent'
  }
  return priorityMap[priority] || 'priority-medium'
}

const getPriorityText = (priority) => {
  const priorityMap = {
    'low': '低',
    'medium': '中',
    'high': '高', 
    'urgent': '紧急'
  }
  return priorityMap[priority] || '中'
}

const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'status-pending',
    'processing': 'status-processing',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return statusMap[status] || 'status-pending'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '维修中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '待处理'
}

const getFaultTypeClass = (faultType) => {
  const typeMap = {
    'water': 'fault-water',
    'furniture': 'fault-furniture',
    'door_window': 'fault-door',
    'network': 'fault-network',
    'other': 'fault-other'
  }
  return typeMap[faultType] || 'fault-other'
}

const getFaultTypeText = (faultType) => {
  const typeMap = {
    'water': '水电故障',
    'furniture': '家具损坏',
    'door_window': '门窗问题',
    'network': '网络故障',
    'other': '其他问题'
  }
  return typeMap[faultType] || '其他问题'
}

const getStatusActionText = (status) => {
  const actionMap = {
    'pending': '🔧 开始维修',
    'processing': '✅ 完成维修',
    'completed': '✅ 已完成',
    'cancelled': '🔄 重新开始'
  }
  return actionMap[status] || '🔧 开始维修'
}

// 组件挂载时加载数据
onMounted(() => {
  fetchRepairs()
})
</script>

<style scoped>
.repair-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin: 0;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

/* 搜索筛选样式 */
.search-filter {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-group {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 250px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-group select {
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
}

/* 统计卡片样式 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info h3 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 工单列表样式 */
.repairs-container {
  margin-bottom: 30px;
}

.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.repairs-list {
  display: grid;
  gap: 20px;
}

.repair-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.repair-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-info h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.priority-low { background: #d4edda; color: #155724; }
.priority-medium { background: #fff3cd; color: #856404; }
.priority-high { background: #f8d7da; color: #721c24; }
.priority-urgent { background: #d1ecf1; color: #0c5460; }

.status-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #cce5ff; color: #004085; }
.status-completed { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.card-content {
  padding: 20px;
}

.repair-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.repair-description {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.repair-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #666;
  font-size: 13px;
  flex-shrink: 0;
}

.value {
  font-weight: 500;
  color: #333;
  text-align: right;
  font-size: 13px;
}

.fault-type {
  padding: 2px 8px;
  border-radius: 12px;
}

.fault-water { background: #cce5ff; color: #004085; }
.fault-furniture { background: #fff3cd; color: #856404; }
.fault-door { background: #d4edda; color: #155724; }
.fault-network { background: #f3e5f5; color: #7b1fa2; }
.fault-other { background: #e2e3e5; color: #6c757d; }

.card-actions {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
}

.edit-btn, .status-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #bbdefb;
}

.status-btn {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-btn:hover {
  background: #e1bee7;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #ffcdd2;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>