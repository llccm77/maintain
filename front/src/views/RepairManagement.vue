<template>
  <div class="repair-management">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <StatusIcons type="admin" :size="48" class="header-icon" />
          <div class="title-text">
            <h1>小管家的任务板</h1>
            <p class="subtitle">今天又有哪些小伙伴需要帮助呢？</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="testDetailDialog" class="test-btn" style="margin-right: 10px; background: #409eff; color: white; border: none; padding: 8px 16px; border-radius: 4px;">
            测试详情弹窗
          </button>
          <button @click="testStatusDialog" class="test-btn" style="margin-right: 10px; background: #67c23a; color: white; border: none; padding: 8px 16px; border-radius: 4px;">
            测试状态弹窗
          </button>
          <button @click="goToCreateOrder" class="add-btn">
            ✨ 添加新任务
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <div class="search-group">
        <input
          v-model="searchForm.keyword"
          type="text"
          placeholder="搜索报修单号或宿舍号..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">🔍 查找任务</button>
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

    <!-- 任务统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card total">
        <StatusIcons type="envelope" :size="32" class="stat-icon" />
        <div class="stat-info">
          <h3>{{ statistics.total || 0 }}</h3>
          <p>总任务数</p>
          <span class="stat-desc">小管家收到的所有任务</span>
        </div>
      </div>
      
      <div class="stat-card pending">
        <StatusIcons type="envelope" :size="32" class="stat-icon" />
        <div class="stat-info">
          <h3>{{ statistics.pending || 0 }}</h3>
          <p>正在等待分配</p>
          <span class="stat-desc">需要小管家关注的新任务</span>
        </div>
      </div>
      
      <div class="stat-card processing">
        <StatusIcons type="worker" :size="32" class="stat-icon" />
        <div class="stat-info">
          <h3>{{ statistics.processing || 0 }}</h3>
          <p>正在进行中</p>
          <span class="stat-desc">小管家正在努力解决</span>
        </div>
      </div>
      
      <div class="stat-card completed">
        <StatusIcons type="completed" :size="32" class="stat-icon" />
        <div class="stat-info">
          <h3>{{ statistics.completed || 0 }}</h3>
          <p>今日已解决</p>
          <span class="stat-desc">小管家的成就感满满</span>
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
              <StatusIcons 
                :type="getStatusIconType(repair.status)" 
                :size="32" 
                class="status-icon" 
              />
              <div class="order-details">
                <h3>{{ repair.order_number }}</h3>
                <span class="priority-badge" :class="getPriorityClass(repair.priority)">
                  {{ getPriorityText(repair.priority) }}
                </span>
              </div>
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
            <button @click.stop="viewRepairDetail(repair)" class="detail-btn">
              👀 查看详情
            </button>
            <button @click.stop="updateStatus(repair)" class="status-btn">
              {{ getStatusActionText(repair.status) }}
            </button>
            <button @click.stop="editRepair(repair)" class="edit-btn">✏️ 编辑任务</button>
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

    <!-- 工单详情弹窗 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="工单详情" 
      width="800px"
      :before-close="handleDetailClose"
    >
      <div v-if="currentRepair" class="repair-detail">
        <!-- 工单基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">📋 基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>工单号：</label>
                <span class="order-number">{{ currentRepair.order_number }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>创建时间：</label>
                <span>{{ formatDateTime(currentRepair.created_at) }}</span>
              </div>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>故障类型：</label>
                <el-tag :type="getFaultTypeColor(currentRepair.fault_type)">
                  {{ getFaultTypeText(currentRepair.fault_type) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>优先级：</label>
                <el-tag :type="getPriorityColor(currentRepair.priority)">
                  {{ getPriorityText(currentRepair.priority) }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          
          <div class="info-item">
            <label>故障标题：</label>
            <span class="repair-title">{{ currentRepair.title }}</span>
          </div>
          
          <div class="info-item">
            <label>详细描述：</label>
            <div class="repair-description">{{ currentRepair.description }}</div>
          </div>
        </div>

        <!-- 报修人和宿舍信息 -->
        <div class="detail-section">
          <h3 class="section-title">👤 报修信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>报修人：</label>
                <span>{{ currentRepair.user?.username || '未知' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>宿舍：</label>
                <span>{{ currentRepair.dormitory?.building_name }}-{{ currentRepair.dormitory?.room_number }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 维修信息 -->
        <div class="detail-section">
          <h3 class="section-title">🔧 维修信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>当前状态：</label>
                <el-tag :type="getStatusColor(currentRepair.status)">
                  {{ getStatusText(currentRepair.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>维修员：</label>
                <span>{{ currentRepair.repair_worker?.username || '未分配' }}</span>
              </div>
            </el-col>
          </el-row>
          
          <div v-if="currentRepair.repair_notes" class="info-item">
            <label>维修说明：</label>
            <div class="repair-notes">{{ currentRepair.repair_notes }}</div>
          </div>
          
          <div v-if="currentRepair.completed_at" class="info-item">
            <label>完成时间：</label>
            <span>{{ formatDateTime(currentRepair.completed_at) }}</span>
          </div>
        </div>

        <!-- 评价信息 -->
        <div v-if="currentRepair.rating" class="detail-section">
          <h3 class="section-title">⭐ 评价信息</h3>
          <div class="info-item">
            <label>评分：</label>
            <el-rate v-model="currentRepair.rating" disabled show-score />
          </div>
          <div v-if="currentRepair.comment" class="info-item">
            <label>评价内容：</label>
            <div class="repair-comment">{{ currentRepair.comment }}</div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="editCurrentRepair">编辑工单</el-button>
          <el-button 
            v-if="currentRepair?.status === 'pending'" 
            type="success" 
            @click="startRepair"
          >
            开始维修
          </el-button>
          <el-button 
            v-if="currentRepair?.status === 'processing'" 
            type="warning" 
            @click="completeRepair"
          >
            完成维修
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑工单弹窗 -->
    <el-dialog 
      v-model="editDialogVisible" 
      title="编辑工单" 
      width="600px"
      :before-close="handleEditClose"
    >
      <el-form 
        v-if="editForm" 
        ref="editFormRef" 
        :model="editForm" 
        :rules="editRules" 
        label-width="100px"
      >
        <el-form-item label="故障标题" prop="title">
          <el-input v-model="editForm.title" maxlength="100" show-word-limit />
        </el-form-item>
        
        <el-form-item label="故障类型" prop="fault_type">
          <el-select v-model="editForm.fault_type" style="width: 100%">
            <el-option label="水电故障" value="water" />
            <el-option label="家具损坏" value="furniture" />
            <el-option label="门窗问题" value="door_window" />
            <el-option label="网络故障" value="network" />
            <el-option label="其他问题" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="editForm.priority" style="width: 100%">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="详细描述" prop="description">
          <el-input 
            v-model="editForm.description" 
            type="textarea" 
            :rows="4" 
            maxlength="500" 
            show-word-limit 
          />
        </el-form-item>
        
        <el-form-item v-if="editForm.status !== 'pending'" label="维修说明">
          <el-input 
            v-model="editForm.repair_notes" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入维修说明..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit" :loading="editLoading">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 状态更新弹窗 -->
    <el-dialog 
      v-model="statusDialogVisible" 
      :title="getStatusDialogTitle()" 
      width="500px"
    >
      <div v-if="statusForm">
        <el-form :model="statusForm" label-width="100px">
          <el-form-item label="当前状态">
            <el-tag :type="getStatusColor(statusForm.currentStatus)">
              {{ getStatusText(statusForm.currentStatus) }}
            </el-tag>
          </el-form-item>
          
          <el-form-item label="目标状态">
            <el-select v-model="statusForm.newStatus" style="width: 100%">
              <el-option 
                v-for="status in getAvailableStatuses(statusForm.currentStatus)"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item v-if="statusForm.newStatus === 'processing'" label="维修员">
            <el-select v-model="statusForm.repair_worker" placeholder="选择维修员" style="width: 100%">
              <el-option label="当前用户" :value="currentUser?.id" />
            </el-select>
          </el-form-item>
          
          <el-form-item v-if="statusForm.newStatus !== 'pending'" label="备注说明">
            <el-input 
              v-model="statusForm.notes" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入状态更新说明..."
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmStatusUpdate" :loading="statusLoading">确认更新</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { repairAPI, dormitoryAPI } from '@/api'
import StatusIcons from '@/components/StatusIcons.vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const repairs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 弹窗相关数据
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const currentRepair = ref(null)
const editForm = ref(null)
const statusForm = ref(null)
const editLoading = ref(false)
const statusLoading = ref(false)
const editFormRef = ref()
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))

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

// 跳转到新建工单页面
const goToCreateOrder = () => {
  router.push('/repair/create')
}

// 测试函数
const testDetailDialog = () => {
  console.log('测试详情弹窗')
  currentRepair.value = {
    id: 1,
    order_number: 'TEST001',
    title: '测试工单',
    description: '这是一个测试工单',
    status: 'pending',
    priority: 'medium',
    fault_type: 'water',
    created_at: new Date().toISOString(),
    user: { username: '测试用户' },
    dormitory: { name: '测试宿舍' }
  }
  detailDialogVisible.value = true
  console.log('测试详情弹窗已设置为true')
}

const testStatusDialog = () => {
  console.log('测试状态弹窗')
  statusForm.value = {
    id: 1,
    currentStatus: 'pending',
    newStatus: 'processing',
    repair_worker: null,
    notes: ''
  }
  statusDialogVisible.value = true
  console.log('测试状态弹窗已设置为true')
}

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

// 表单验证规则
const editRules = {
  title: [
    { required: true, message: '请输入故障标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2-100个字符之间', trigger: 'blur' }
  ],
  fault_type: [
    { required: true, message: '请选择故障类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ]
}

// 查看工单详情
const viewRepairDetail = async (repair) => {
  try {
    console.log('查看工单详情:', repair)
    console.log('调用API获取详情...')
    
    // 获取完整的工单详情
    const response = await repairAPI.getRepairDetail(repair.id)
    console.log('API响应:', response)
    
    currentRepair.value = response.data || response
    console.log('设置currentRepair:', currentRepair.value)
    
    detailDialogVisible.value = true
    console.log('设置detailDialogVisible为true:', detailDialogVisible.value)
    
    // 强制触发响应式更新
    await nextTick()
    console.log('详情弹窗应该已打开')
  } catch (error) {
    console.error('获取工单详情失败:', error)
    ElMessage.error(`获取工单详情失败: ${error.message}`)
  }
}

// 编辑工单
const editRepair = async (repair) => {
  try {
    console.log('编辑工单:', repair)
    // 获取完整的工单详情用于编辑
    const response = await repairAPI.getRepairDetail(repair.id)
    const repairData = response.data || response
    
    editForm.value = {
      id: repairData.id,
      title: repairData.title,
      description: repairData.description,
      fault_type: repairData.fault_type,
      priority: repairData.priority,
      status: repairData.status,
      repair_notes: repairData.repair_notes || ''
    }
    
    editDialogVisible.value = true
    console.log('编辑弹窗已打开')
  } catch (error) {
    console.error('获取工单信息失败:', error)
    ElMessage.error('获取工单信息失败')
  }
}

// 更新工单状态
const updateStatus = async (repair) => {
  try {
    console.log('更新工单状态:', repair)
    
    // 根据当前状态确定操作类型
    const nextStatus = getNextStatus(repair.status)
    console.log('下一个状态:', nextStatus)
    
    // 如果是已完成状态，不允许再次操作
    if (repair.status === 'completed') {
      ElMessage.info('工单已完成，无需再次操作')
      return
    }
    
    statusForm.value = {
      id: repair.id,
      currentStatus: repair.status,
      newStatus: nextStatus,
      repair_worker: repair.status === 'pending' ? currentUser.value.id : repair.repair_worker,
      notes: ''
    }
    console.log('设置statusForm:', statusForm.value)
    
    statusDialogVisible.value = true
    console.log('设置statusDialogVisible为true:', statusDialogVisible.value)
    
    // 强制触发响应式更新
    await nextTick()
    console.log('状态更新弹窗应该已打开')
  } catch (error) {
    console.error('打开状态更新弹窗失败:', error)
    ElMessage.error('打开状态更新弹窗失败')
  }
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
    'pending': '等待分配',
    'processing': '进行中',
    'completed': '已解决',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取状态图标类型
const getStatusIconType = (status) => {
  const iconMap = {
    pending: 'envelope',
    processing: 'worker',
    completed: 'completed',
    cancelled: 'cancelled'
  }
  return iconMap[status] || 'envelope'
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

// 获取状态弹窗标题
const getStatusDialogTitle = () => {
  if (!statusForm.value) return '更新工单状态'
  
  const titleMap = {
    'pending': '🔧 开始维修工单',
    'processing': '✅ 完成维修工单',
    'cancelled': '🔄 重新启动工单'
  }
  return titleMap[statusForm.value.currentStatus] || '更新工单状态'
}

// 获取下一个状态
const getNextStatus = (currentStatus) => {
  const statusFlow = {
    'pending': 'processing',
    'processing': 'completed',
    'completed': 'completed',
    'cancelled': 'pending'
  }
  return statusFlow[currentStatus] || 'processing'
}

// 获取可用的状态选项
const getAvailableStatuses = (currentStatus) => {
  const allStatuses = [
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '维修中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ]
  
  // 根据当前状态过滤可用状态
  return allStatuses.filter(status => {
    if (currentStatus === 'completed') {
      return status.value === 'completed' // 已完成的工单不能改变状态
    }
    return true
  })
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取故障类型颜色
const getFaultTypeColor = (type) => {
  const colorMap = {
    'water': 'primary',
    'furniture': 'success',
    'door_window': 'warning',
    'network': 'info',
    'other': 'default'
  }
  return colorMap[type] || 'default'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'warning',
    'processing': 'primary',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return colorMap[status] || 'info'
}


// 获取优先级颜色
const getPriorityColor = (priority) => {
  const colorMap = {
    'low': 'info',
    'medium': 'warning',
    'high': 'danger',
    'urgent': 'danger'
  }
  return colorMap[priority] || 'info'
}


// 弹窗关闭处理
const handleDetailClose = () => {
  detailDialogVisible.value = false
  currentRepair.value = null
}

const handleEditClose = () => {
  editDialogVisible.value = false
  editForm.value = null
}

// 从详情弹窗编辑工单
const editCurrentRepair = () => {
  if (currentRepair.value) {
    detailDialogVisible.value = false
    editRepair(currentRepair.value)
  }
}

// 开始维修
const startRepair = () => {
  if (currentRepair.value) {
    detailDialogVisible.value = false
    statusForm.value = {
      id: currentRepair.value.id,
      currentStatus: currentRepair.value.status,
      newStatus: 'processing',
      repair_worker: currentUser.value.id,
      notes: ''
    }
    statusDialogVisible.value = true
  }
}

// 完成维修
const completeRepair = () => {
  if (currentRepair.value) {
    detailDialogVisible.value = false
    statusForm.value = {
      id: currentRepair.value.id,
      currentStatus: currentRepair.value.status,
      newStatus: 'completed',
      repair_worker: currentRepair.value.repair_worker?.id || currentUser.value.id,
      notes: ''
    }
    statusDialogVisible.value = true
  }
}

// 保存编辑
const saveEdit = async () => {
  if (!editFormRef.value) return
  
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return
    
    editLoading.value = true
    
    const updateData = {
      title: editForm.value.title,
      description: editForm.value.description,
      fault_type: editForm.value.fault_type,
      priority: editForm.value.priority
    }
    
    // 如果有维修说明，也一起更新
    if (editForm.value.repair_notes) {
      updateData.repair_notes = editForm.value.repair_notes
    }
    
    await repairAPI.updateRepair(editForm.value.id, updateData)
    
    ElMessage.success('工单更新成功')
    editDialogVisible.value = false
    editForm.value = null
    
    // 重新加载数据而不是刷新页面
    await fetchRepairs()
    
  } catch (error) {
    console.error('更新工单失败:', error)
    ElMessage.error('更新工单失败')
  } finally {
    editLoading.value = false
  }
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  if (!statusForm.value) return
  
  try {
    statusLoading.value = true
    
    const updateData = {
      status: statusForm.value.newStatus
    }
    
    // 如果是开始维修，设置维修员
    if (statusForm.value.newStatus === 'processing' && statusForm.value.repair_worker) {
      updateData.repair_worker = statusForm.value.repair_worker
    }
    
    // 如果有备注说明，添加到维修说明中
    if (statusForm.value.notes) {
      updateData.repair_notes = statusForm.value.notes
    }
    
    await repairAPI.updateRepair(statusForm.value.id, updateData)
    
    ElMessage.success('状态更新成功')
    statusDialogVisible.value = false
    statusForm.value = null
    
    // 重新加载数据而不是刷新页面
    await fetchRepairs()
    
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  } finally {
    statusLoading.value = false
  }
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

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, #FFE5CC 0%, #FFD1DC 50%, #E6E6FA 100%);
  color: #333;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  filter: drop-shadow(0 2px 8px rgba(74, 144, 226, 0.3));
}

.title-text h1 {
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: 600;
  color: #4A5568;
  font-family: 'Microsoft YaHei', sans-serif;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #718096;
  font-weight: 400;
}

.add-btn {
  background: linear-gradient(135deg, #FF9A8B 0%, #A8E6CF 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 154, 139, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 154, 139, 0.4);
}

/* 搜索筛选样式 */
.search-filter {
  background: linear-gradient(135deg, #F8F9FA 0%, #FFF8E1 100%);
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.15);
  margin-bottom: 25px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid rgba(255, 182, 193, 0.1);
}

.search-group {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 280px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #E2E8F0;
  border-radius: 15px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #FF9A8B;
  box-shadow: 0 0 0 3px rgba(255, 154, 139, 0.1);
}

.search-btn {
  background: linear-gradient(135deg, #FF9A8B 0%, #A8E6CF 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 154, 139, 0.3);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 154, 139, 0.4);
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-group select {
  padding: 12px 16px;
  border: 2px solid #E2E8F0;
  border-radius: 15px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group select:focus {
  outline: none;
  border-color: #FF9A8B;
  box-shadow: 0 0 0 3px rgba(255, 154, 139, 0.1);
}

/* 统计卡片样式 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #FFF8E1 0%, #F3E5F5 100%);
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 182, 193, 0.1);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.3);
}

.stat-card.total {
  background: linear-gradient(135deg, #FFE5CC 0%, #FFF0E6 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%);
}

.stat-card.processing {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.stat-card.completed {
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF9A8B 0%, #A8E6CF 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 15px rgba(255, 154, 139, 0.3);
}

.stat-info h3 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #4A5568;
  font-family: 'Microsoft YaHei', sans-serif;
}

.stat-info p {
  margin: 0 0 5px 0;
  color: #2D3748;
  font-size: 16px;
  font-weight: 600;
}

.stat-desc {
  font-size: 12px;
  color: #718096;
  font-weight: 400;
}

/* 工单列表样式 */
.repairs-container {
  margin-bottom: 30px;
}

.loading, .no-data {
  text-align: center;
  padding: 50px;
  color: #718096;
  font-size: 16px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFF8E1 100%);
  border-radius: 20px;
  border: 2px dashed #E2E8F0;
}

.repairs-list {
  display: grid;
  gap: 25px;
}

.repair-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.15);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 182, 193, 0.1);
}

.repair-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(255, 182, 193, 0.25);
}

.card-header {
  background: linear-gradient(135deg, #FFE5CC 0%, #FFF0E6 100%);
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 182, 193, 0.1);
}

.order-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-icon {
  filter: drop-shadow(0 2px 8px rgba(255, 154, 139, 0.3));
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-details h3 {
  margin: 0;
  color: #4A5568;
  font-size: 18px;
  font-weight: 600;
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
  padding: 25px;
  background: white;
}

.repair-title {
  margin: 0 0 12px 0;
  color: #2D3748;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.repair-description {
  margin: 0 0 20px 0;
  color: #4A5568;
  font-size: 15px;
  line-height: 1.5;
  background: linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%);
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #FF9A8B;
}

.repair-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F7FAFC;
}

.meta-row:last-child {
  border-bottom: none;
}

.label {
  color: #718096;
  font-size: 14px;
  flex-shrink: 0;
  font-weight: 500;
}

.value {
  font-weight: 600;
  color: #2D3748;
  text-align: right;
  font-size: 14px;
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
  padding: 20px 25px;
  background: linear-gradient(135deg, #F8F9FA 0%, #FFF8E1 100%);
  display: flex;
  gap: 15px;
  border-top: 1px solid rgba(255, 182, 193, 0.1);
}

.detail-btn, .edit-btn, .status-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-btn {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  color: #1976D2;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.detail-btn:hover {
  background: linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.edit-btn {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%);
  color: #F57C00;
  border: 1px solid rgba(245, 124, 0, 0.2);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 124, 0, 0.3);
}

.status-btn {
  background: linear-gradient(135deg, #E8F5E8 0%, #A5D6A7 100%);
  color: #388E3C;
  border: 1px solid rgba(56, 142, 60, 0.2);
}

.status-btn:hover {
  background: linear-gradient(135deg, #A5D6A7 0%, #81C784 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(56, 142, 60, 0.3);
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
/* 弹窗样式 */
.repair-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-item label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
  flex-shrink: 0;
}

.order-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.repair-description,
.repair-notes,
.repair-comment {
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹窗响应式 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 5vh auto !important;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-item label {
    min-width: auto;
  }
  
  .dialog-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>