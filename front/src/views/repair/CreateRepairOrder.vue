<template>
  <div class="create-repair-order">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <el-icon><Plus /></el-icon>
            新建报修工单
          </h1>
          <p class="page-subtitle">请填写详细的报修信息，我们将尽快为您处理</p>
        </div>
        <div class="header-actions">
          <el-button @click="goBack" icon="ArrowLeft">返回列表</el-button>
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <el-card class="form-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Edit /></el-icon>
              报修信息
            </span>
            <span class="required-note">* 为必填项</span>
          </div>
        </template>

        <el-form
          ref="repairFormRef"
          :model="repairForm"
          :rules="formRules"
          label-width="120px"
          label-position="left"
          class="repair-form"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">
              <el-icon><User /></el-icon>
              基本信息
            </h3>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="报修人" prop="user_id" required>
                  <el-select
                    v-model="repairForm.user_id"
                    placeholder="请选择报修人"
                    filterable
                    remote
                    :remote-method="searchUsers"
                    :loading="userLoading"
                    style="width: 100%"
                    @change="handleUserChange"
                  >
                    <el-option
                      v-for="user in userOptions"
                      :key="user.id"
                      :label="getUserDisplayName(user)"
                      :value="user.id"
                    >
                      <div class="user-option">
                        <span class="user-name">{{ getUserDisplayName(user) }}</span>
                        <span class="user-username">@{{ user.username }}</span>
                        <span v-if="user.email" class="user-email">{{ user.email }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="宿舍" prop="dormitory_id" required>
                  <el-select
                    v-model="repairForm.dormitory_id"
                    placeholder="请选择宿舍"
                    filterable
                    style="width: 100%"
                    @change="handleDormitoryChange"
                  >
                    <el-option-group
                      v-for="building in groupedDormitories"
                      :key="building.building_name"
                      :label="building.building_name"
                    >
                      <el-option
                        v-for="dorm in building.rooms"
                        :key="dorm.id"
                        :label="`${dorm.building_name}-${dorm.room_number} (${dorm.floor}楼)`"
                        :value="dorm.id"
                      />
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 故障信息 -->
          <div class="form-section">
            <h3 class="section-title">
              <el-icon><Tools /></el-icon>
              故障信息
            </h3>
            
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="故障类型" prop="fault_type" required>
                  <el-select
                    v-model="repairForm.fault_type"
                    placeholder="请选择故障类型"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="type in faultTypes"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    >
                      <div class="fault-type-option">
                        <el-icon>
                          <component :is="type.icon" />
                        </el-icon>
                        <span>{{ type.label }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="优先级" prop="priority">
                  <el-select
                    v-model="repairForm.priority"
                    placeholder="请选择优先级"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="priority in priorities"
                      :key="priority.value"
                      :label="priority.label"
                      :value="priority.value"
                    >
                      <div class="priority-option">
                        <el-tag :type="priority.type" size="small">{{ priority.label }}</el-tag>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="故障标题" prop="title" required>
              <el-input
                v-model="repairForm.title"
                placeholder="请简要描述故障问题，如：水龙头漏水、门锁损坏等"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="详细描述" prop="description" required>
              <el-input
                v-model="repairForm.description"
                type="textarea"
                :rows="4"
                placeholder="请详细描述故障情况，包括发生时间、具体位置、故障现象等，以便维修人员更好地了解问题"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </div>

          <!-- 表单操作按钮 -->
          <div class="form-actions">
            <el-button size="large" @click="resetForm">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button size="large" @click="saveDraft">
              <el-icon><Document /></el-icon>
              保存草稿
            </el-button>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="submitForm"
            >
              <el-icon><Check /></el-icon>
              提交工单
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 温馨提示 -->
    <el-card class="tips-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><InfoFilled /></el-icon>
            温馨提示
          </span>
        </div>
      </template>
      
      <div class="tips-content">
        <div class="tip-item">
          <el-icon class="tip-icon"><Clock /></el-icon>
          <div class="tip-text">
            <strong>处理时效：</strong>
            <span>一般故障24小时内响应，紧急故障2小时内响应</span>
          </div>
        </div>
        
        <div class="tip-item">
          <el-icon class="tip-icon"><Phone /></el-icon>
          <div class="tip-text">
            <strong>紧急联系：</strong>
            <span>如遇紧急情况，请拨打24小时服务热线：400-123-4567</span>
          </div>
        </div>
        
        <div class="tip-item">
          <el-icon class="tip-icon"><ChatDotRound /></el-icon>
          <div class="tip-text">
            <strong>进度查询：</strong>
            <span>您可以在"报修工单管理"页面实时查看工单处理进度</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Edit, User, Tools, Check, Refresh, Document, ArrowLeft,
  InfoFilled, Clock, Phone, ChatDotRound,
  Lightning, Cpu, House, Monitor, MoreFilled
} from '@element-plus/icons-vue'

// API导入
import { repairAPI } from '@/api/repair'
import { dormitoryAPI } from '@/api/dormitory'
import { userAPI } from '@/api/user'

const router = useRouter()

// 表单引用
const repairFormRef = ref()

// 表单数据
const repairForm = reactive({
  user_id: null,
  dormitory_id: null,
  fault_type: '',
  priority: 'medium',
  title: '',
  description: ''
})

// 表单验证规则
const formRules = {
  user_id: [
    { required: true, message: '请选择报修人', trigger: 'change' }
  ],
  dormitory_id: [
    { required: true, message: '请选择宿舍', trigger: 'change' }
  ],
  fault_type: [
    { required: true, message: '请选择故障类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入故障标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2-100个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10-500个字符之间', trigger: 'blur' }
  ]
}

// 数据状态
const submitting = ref(false)
const userLoading = ref(false)
const userOptions = ref([])
const dormitoryOptions = ref([])

// 故障类型选项
const faultTypes = [
  { value: 'water', label: '水电故障', icon: Lightning },
  { value: 'furniture', label: '家具损坏', icon: House },
  { value: 'door_window', label: '门窗问题', icon: House },
  { value: 'network', label: '网络故障', icon: Monitor },
  { value: 'other', label: '其他问题', icon: MoreFilled }
]

// 优先级选项
const priorities = [
  { value: 'low', label: '低', type: 'info' },
  { value: 'medium', label: '中', type: 'warning' },
  { value: 'high', label: '高', type: 'danger' },
  { value: 'urgent', label: '紧急', type: 'danger' }
]

// 计算属性：按楼栋分组的宿舍
const groupedDormitories = computed(() => {
  const groups = {}
  dormitoryOptions.value.forEach(dorm => {
    if (!groups[dorm.building_name]) {
      groups[dorm.building_name] = {
        building_name: dorm.building_name,
        rooms: []
      }
    }
    groups[dorm.building_name].rooms.push(dorm)
  })
  return Object.values(groups)
})

// 方法：搜索用户
const searchUsers = async (query) => {
  if (!query) {
    userOptions.value = []
    return
  }
  
  userLoading.value = true
  try {
    const response = await userAPI.searchUsers(query)
    console.log('用户搜索API响应:', response)
    
    // 处理不同的响应格式，确保获取真实的Django用户数据
    let users = []
    if (response && typeof response === 'object') {
      if (response.results && Array.isArray(response.results)) {
        // 标准分页格式: { results: [...], count: n }
        users = response.results
      } else if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          // 嵌套格式: { data: { results: [...] } }
          users = response.data.results
        } else if (Array.isArray(response.data)) {
          // 数组格式: { data: [...] }
          users = response.data
        }
      } else if (Array.isArray(response)) {
        // 直接数组格式: [...]
        users = response
      }
    }
    
    // 验证数据格式
    if (!Array.isArray(users)) {
      console.warn('用户数据格式异常:', response)
      users = []
    }
    
    userOptions.value = users
    console.log('搜索到的用户:', users)
    
  } catch (error) {
    console.error('搜索用户失败:', error)
    ElMessage.error('搜索用户失败，请检查网络连接')
    userOptions.value = []
  } finally {
    userLoading.value = false
  }
}

// 方法：加载宿舍列表
const loadDormitories = async () => {
  try {
    const response = await dormitoryAPI.getDormitoryList({ page_size: 1000 })
    console.log('宿舍API响应:', response)
    
    // 更健壮的数据处理逻辑
    let dormitories = []
    
    // 尝试多种可能的数据结构
    if (response && typeof response === 'object') {
      if (response.results && Array.isArray(response.results)) {
        // 标准分页格式: { results: [...], count: n }
        dormitories = response.results
      } else if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          // 嵌套格式: { data: { results: [...] } }
          dormitories = response.data.results
        } else if (Array.isArray(response.data)) {
          // 数组格式: { data: [...] }
          dormitories = response.data
        }
      } else if (Array.isArray(response)) {
        // 直接数组格式: [...]
        dormitories = response
      }
    }
    
    // 验证数据格式
    if (!Array.isArray(dormitories)) {
      console.warn('宿舍数据格式异常:', response)
      dormitories = []
    }
    
    dormitoryOptions.value = dormitories
    console.log('加载的宿舍数据:', dormitories)
    
    if (dormitories.length === 0) {
      ElMessage.warning('暂无宿舍数据，请联系管理员添加宿舍信息')
    }
    
  } catch (error) {
    console.error('加载宿舍列表失败:', error)
    ElMessage.error('加载宿舍列表失败，请检查网络连接')
    
    // 使用模拟数据作为备用方案
    dormitoryOptions.value = [
      { id: 1, building_name: '1号楼', room_number: '101', floor: 1 },
      { id: 2, building_name: '1号楼', room_number: '102', floor: 1 },
      { id: 3, building_name: '1号楼', room_number: '201', floor: 2 },
      { id: 4, building_name: '2号楼', room_number: '101', floor: 1 },
      { id: 5, building_name: '2号楼', room_number: '102', floor: 1 }
    ]
    ElMessage.info('已加载示例数据，实际使用请确保后端服务正常')
  }
}

// 方法：获取用户显示名称
const getUserDisplayName = (user) => {
  if (!user) return ''
  
  // 优先显示姓名，如果没有姓名则显示用户名
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')
  if (fullName) {
    return `${fullName} (${user.username})`
  }
  return user.username
}

// 方法：处理用户选择
const handleUserChange = (userId) => {
  console.log('选择用户:', userId)
  const selectedUser = userOptions.value.find(user => user.id === userId)
  if (selectedUser) {
    console.log('选择的用户信息:', selectedUser)
  }
}

// 方法：处理宿舍选择
const handleDormitoryChange = (dormitoryId) => {
  console.log('选择宿舍:', dormitoryId)
}

// 方法：重置表单
const resetForm = () => {
  repairFormRef.value?.resetFields()
  Object.assign(repairForm, {
    user_id: null,
    dormitory_id: null,
    fault_type: '',
    priority: 'medium',
    title: '',
    description: ''
  })
}

// 方法：保存草稿
const saveDraft = () => {
  const draft = { ...repairForm }
  localStorage.setItem('repair_order_draft', JSON.stringify(draft))
  ElMessage.success('草稿已保存')
}

// 方法：加载草稿
const loadDraft = () => {
  const draft = localStorage.getItem('repair_order_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(repairForm, draftData)
      ElMessage.info('已加载草稿数据')
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
  }
}

// 方法：提交表单
const submitForm = async () => {
  if (!repairFormRef.value) return
  
  try {
    const valid = await repairFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    // 提交数据
    const submitData = { ...repairForm }
    const response = await repairAPI.createRepair(submitData)
    
    ElMessage.success('工单创建成功！')
    
    // 清除草稿
    localStorage.removeItem('repair_order_draft')
    
    // 跳转到工单详情或列表页
    router.push('/repair')
    
  } catch (error) {
    console.error('创建工单失败:', error)
    ElMessage.error(error.response?.data?.error || '创建工单失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 方法：返回列表
const goBack = () => {
  router.push('/repair')
}

// 方法：加载初始用户列表
const loadInitialUsers = async () => {
  try {
    const response = await userAPI.getUserList({ page_size: 50 })
    console.log('初始用户列表API响应:', response)
    
    // 处理响应数据格式
    let users = []
    if (response && typeof response === 'object') {
      if (response.results && Array.isArray(response.results)) {
        users = response.results
      } else if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          users = response.data.results
        } else if (Array.isArray(response.data)) {
          users = response.data
        }
      } else if (Array.isArray(response)) {
        users = response
      }
    }
    
    // 只显示活跃用户
    const activeUsers = users.filter(user => user.is_active !== false)
    userOptions.value = activeUsers
    console.log('加载的初始用户列表:', activeUsers)
    
  } catch (error) {
    console.error('加载用户列表失败:', error)
    // 不显示错误消息，因为用户可以通过搜索来查找用户
  }
}

// 组件挂载时的初始化
onMounted(() => {
  loadDormitories()
  loadInitialUsers()
  loadDraft()
})
</script>

<style scoped>
.create-repair-order {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面头部 */
.page-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-subtitle {
  color: #909399;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 表单容器 */
.form-container {
  margin-bottom: 20px;
}

.form-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.required-note {
  color: #909399;
  font-size: 12px;
}

/* 表单样式 */
.repair-form {
  padding: 20px 0;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 选项样式 */
.user-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.user-username {
  color: #909399;
  font-size: 12px;
}

.user-email {
  color: #606266;
  font-size: 11px;
  font-style: italic;
}

.fault-type-option,
.priority-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

/* 提示卡片 */
.tips-card {
  border-radius: 8px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.tip-icon {
  color: #409eff;
  margin-top: 2px;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  line-height: 1.5;
}

.tip-text strong {
  color: #303133;
  margin-right: 8px;
}

.tip-text span {
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .create-repair-order {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .tips-content {
    gap: 12px;
  }
}
</style>
