<template>
  <div class="student-management">
    <div class="page-header">
      <h1>学生管理</h1>
      <button @click="showAddDialog = true" class="add-btn">
        ➕ 新增学生
      </button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <div class="search-group">
        <input
          v-model="searchForm.keyword"
          type="text"
          placeholder="搜索学生姓名、学号或电话..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">搜索</button>
      </div>
      
      <div class="filter-group">
        <select v-model="searchForm.building" @change="handleSearch">
          <option value="">全部楼栋</option>
          <option v-for="building in buildings" :key="building" :value="building">
            {{ building }}
          </option>
        </select>
        
        <select v-model="searchForm.hasRoom" @change="handleSearch">
          <option value="">全部状态</option>
          <option value="true">已分配宿舍</option>
          <option value="false">未分配宿舍</option>
        </select>
      </div>
    </div>

    <!-- 学生列表 -->
    <div class="students-container">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <div v-else-if="students.length === 0" class="no-data">
        暂无学生数据
      </div>
      <div v-else class="students-grid">
        <div 
          v-for="student in students" 
          :key="student.id"
          class="student-card"
          @click="viewStudentDetail(student)"
        >
          <!-- 学生头像和基本信息 -->
          <div class="card-header">
            <div class="avatar" :style="{ backgroundColor: getAvatarColor(student.name) }">
              {{ student.name ? student.name.charAt(0) : 'S' }}
            </div>
            <div class="basic-info">
              <h3>{{ student.name }}</h3>
              <p class="student-id">学号: {{ student.student_id }}</p>
            </div>
          </div>
          
          <!-- 详细信息 -->
          <div class="card-content">
            <div class="info-row">
              <span class="label">📞 联系电话:</span>
              <span class="value">{{ student.phone }}</span>
            </div>
            
            <div class="info-row">
              <span class="label">🏠 宿舍分配:</span>
              <span class="value dormitory-info" :class="getDormitoryClass(student.dormitory)">
                {{ student.dormitory ? `${student.dormitory.building_name}-${student.dormitory.room_number}` : '未分配' }}
              </span>
            </div>
            
            <div class="info-row">
              <span class="label">🔧 报修记录:</span>
              <span class="value repair-info" :class="getRepairStatusClass(student.repair_summary)">
                {{ getRepairStatusText(student.repair_summary) }}
              </span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="card-actions">
            <button @click.stop="editStudent(student)" class="edit-btn">
              ✏️ 编辑
            </button>
            <button @click.stop="assignRoom(student)" class="assign-btn">
              🏠 分配宿舍
            </button>
            <button @click.stop="deleteStudent(student)" class="delete-btn">
              🗑️ 删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && students.length > 0" class="pagination">
      <button 
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页 (共 {{ totalCount }} 条)
      </span>
      
      <button 
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>

    <!-- 新增/编辑学生对话框 -->
    <div v-if="showAddDialog || showEditDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>{{ showAddDialog ? '新增学生' : '编辑学生' }}</h3>
          <button @click="closeDialog" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitForm" class="dialog-form">
          <div class="form-group">
            <label>学号 *</label>
            <input 
              v-model="formData.student_id" 
              type="text" 
              placeholder="请输入学号"
              :disabled="showEditDialog"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>姓名 *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="请输入姓名"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>联系电话 *</label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              placeholder="请输入手机号"
              pattern="^1[3-9]\d{9}$"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>宿舍分配</label>
            <select v-model="formData.dormitory_id">
              <option value="">暂不分配</option>
              <option 
                v-for="dormitory in availableDormitories" 
                :key="dormitory.id" 
                :value="dormitory.id"
              >
                {{ dormitory.building_name }}-{{ dormitory.room_number }} 
                ({{ dormitory.student_count }}/4人)
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeDialog" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 宿舍分配对话框 -->
    <div v-if="showAssignDialog" class="dialog-overlay" @click="closeAssignDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>分配宿舍 - {{ assigningStudent?.name }}</h3>
          <button @click="closeAssignDialog" class="close-btn">✕</button>
        </div>
        
        <div class="dialog-form">
          <div class="current-info" v-if="assigningStudent?.dormitory">
            <p><strong>当前宿舍:</strong> {{ assigningStudent.dormitory.building_name }}-{{ assigningStudent.dormitory.room_number }}</p>
          </div>
          
          <div class="form-group">
            <label>选择新宿舍</label>
            <select v-model="assignForm.dormitory_id" required>
              <option value="">请选择宿舍</option>
              <option 
                v-for="dormitory in availableDormitories" 
                :key="dormitory.id" 
                :value="dormitory.id"
              >
                {{ dormitory.building_name }}-{{ dormitory.room_number }} 
                ({{ dormitory.student_count }}/4人)
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeAssignDialog" class="cancel-btn">
              取消
            </button>
            <button @click="submitAssign" class="submit-btn" :disabled="!assignForm.dormitory_id || submitting">
              {{ submitting ? '分配中...' : '确认分配' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { studentAPI, dormitoryAPI } from '@/api'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const students = ref([])
const availableDormitories = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 对话框状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showAssignDialog = ref(false)
const editingStudent = ref(null)
const assigningStudent = ref(null)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  building: '',
  hasRoom: ''
})

// 表单数据
const formData = reactive({
  student_id: '',
  name: '',
  phone: '',
  dormitory_id: ''
})

// 分配表单
const assignForm = reactive({
  dormitory_id: ''
})

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
const buildings = computed(() => [...new Set(students.value.map(s => s.dormitory?.building_name).filter(Boolean))])

// 获取学生列表
const fetchStudents = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchForm.keyword,
      building: searchForm.building,
      has_dormitory: searchForm.hasRoom
    }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const response = await studentAPI.getStudentList(params)
    students.value = response.results || []
    totalCount.value = response.count || 0
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败，请检查后端服务连接')
    // 保持空数组，不使用模拟数据
    students.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 获取可用宿舍列表
const fetchAvailableDormitories = async () => {
  try {
    const response = await dormitoryAPI.getDormitoryList({ page_size: 100 })
    availableDormitories.value = response.results || []
  } catch (error) {
    console.error('获取宿舍列表失败:', error)
    ElMessage.error('获取宿舍列表失败，请检查后端服务连接')
    // 保持空数组，不使用模拟数据
    availableDormitories.value = []
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchStudents()
}

// 分页处理
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchStudents()
  }
}

// 查看学生详情
const viewStudentDetail = (student) => {
  console.log('查看学生详情:', student)
  // TODO: 跳转到详情页或显示详情对话框
  alert(`学生详情: ${student.name} (${student.student_id})`)
}

// 编辑学生
const editStudent = (student) => {
  editingStudent.value = student
  Object.assign(formData, {
    student_id: student.student_id,
    name: student.name,
    phone: student.phone,
    dormitory_id: student.dormitory?.id || ''
  })
  showEditDialog.value = true
}

// 分配宿舍
const assignRoom = (student) => {
  assigningStudent.value = student
  assignForm.dormitory_id = student.dormitory?.id || ''
  showAssignDialog.value = true
}

// 删除学生
const deleteStudent = async (student) => {
  if (!confirm(`确定要删除学生 ${student.name} (${student.student_id}) 吗？`)) {
    return
  }
  
  try {
    await studentAPI.deleteStudent(student.id)
    alert('删除成功')
    fetchStudents()
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败: ' + error.message)
  }
}

// 关闭对话框
const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  editingStudent.value = null
  Object.assign(formData, {
    student_id: '',
    name: '',
    phone: '',
    dormitory_id: ''
  })
}

// 关闭分配对话框
const closeAssignDialog = () => {
  showAssignDialog.value = false
  assigningStudent.value = null
  assignForm.dormitory_id = ''
}

// 提交表单
const submitForm = async () => {
  try {
    submitting.value = true
    
    if (showAddDialog.value) {
      await studentAPI.createStudent(formData)
      alert('新增成功')
    } else {
      await studentAPI.updateStudent(editingStudent.value.id, formData)
      alert('更新成功')
    }
    
    closeDialog()
    fetchStudents()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

// 提交宿舍分配
const submitAssign = async () => {
  try {
    submitting.value = true
    
    await studentAPI.updateStudent(assigningStudent.value.id, {
      dormitory_id: assignForm.dormitory_id
    })
    
    alert('宿舍分配成功')
    closeAssignDialog()
    fetchStudents()
  } catch (error) {
    console.error('分配失败:', error)
    alert('分配失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

// 获取头像颜色
const getAvatarColor = (name) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  return colors[name?.charCodeAt(0) % colors.length] || '#ccc'
}

// 获取宿舍状态样式类
const getDormitoryClass = (dormitory) => {
  return dormitory ? 'has-dormitory' : 'no-dormitory'
}

// 获取报修状态样式类
const getRepairStatusClass = (summary) => {
  if (!summary || summary.total === 0) return 'no-repair'
  if (summary.pending > 0) return 'has-pending'
  return 'completed-only'
}

// 获取报修状态文本
const getRepairStatusText = (summary) => {
  if (!summary || summary.total === 0) return '无报修记录'
  if (summary.pending > 0) return `${summary.pending}个待处理 (共${summary.total}次)`
  return `已完成${summary.total}次报修`
}

// 组件挂载时加载数据
onMounted(() => {
  fetchStudents()
  fetchAvailableDormitories()
})
</script>

<style scoped>
.student-management {
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

/* 学生容器和网格 */
.students-container {
  margin-bottom: 30px;
}

.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

/* 学生卡片样式 */
.student-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.basic-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.student-id {
  margin: 0;
  color: #666;
  font-size: 14px;
  background: rgba(255,255,255,0.7);
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-block;
}

.card-content {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.value {
  font-weight: 500;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 10px;
}

.dormitory-info {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.has-dormitory {
  background: #d4edda;
  color: #155724;
}

.no-dormitory {
  background: #f8d7da;
  color: #721c24;
}

.repair-info {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.no-repair {
  background: #e2e3e5;
  color: #6c757d;
}

.has-pending {
  background: #fff3cd;
  color: #856404;
}

.completed-only {
  background: #d4edda;
  color: #155724;
}

/* 卡片操作按钮 */
.card-actions {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 8px;
}

.edit-btn, .assign-btn, .delete-btn {
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

.assign-btn {
  background: #f3e5f5;
  color: #7b1fa2;
}

.assign-btn:hover {
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

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.dialog-form {
  padding: 20px;
}

.current-info {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2196f3;
}

.current-info p {
  margin: 0;
  color: #1565c0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #6c757d;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: #f8f9fa;
  color: #333;
}

.submit-btn {
  background: #667eea;
  color: white;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .students-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>