<template>
  <div class="dormitory-management">
    <div class="page-header">
      <h1>宿舍管理</h1>
      <button @click="showAddDialog = true" class="add-btn">
        ➕ 新增宿舍
      </button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <div class="search-group">
        <input
          v-model="searchForm.keyword"
          type="text"
          placeholder="搜索楼栋名称或房间号..."
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
        
        <select v-model="searchForm.floor" @change="handleSearch">
          <option value="">全部楼层</option>
          <option v-for="floor in floors" :key="floor" :value="floor">
            第{{ floor }}楼
          </option>
        </select>
      </div>
    </div>

    <!-- 宿舍列表 -->
    <div class="dormitory-grid">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <div v-else-if="dormitories.length === 0" class="no-data">
        暂无宿舍数据
      </div>
      <div 
        v-else 
        v-for="dormitory in dormitories" 
        :key="dormitory.id"
        class="dormitory-card"
        @click="viewDormitoryDetail(dormitory)"
      >
        <div class="card-header">
          <h3>{{ dormitory.building_name }}-{{ dormitory.room_number }}</h3>
          <span class="floor-badge">第{{ dormitory.floor }}楼</span>
        </div>
        
        <div class="card-content">
          <div class="info-row">
            <span class="label">入住情况:</span>
            <span class="student-count" :class="getOccupancyClass(dormitory.student_count)">
              {{ dormitory.student_count || 0 }}/4 人
            </span>
          </div>
          
          <div class="info-row">
            <span class="label">报修次数:</span>
            <span class="repair-count">{{ dormitory.repair_count || 0 }} 次</span>
          </div>
          
          <div class="info-row">
            <span class="label">状态:</span>
            <span class="status" :class="getDormitoryStatusClass(dormitory)">
              {{ getDormitoryStatus(dormitory) }}
            </span>
          </div>
        </div>
        
        <div class="card-actions">
          <button @click.stop="editDormitory(dormitory)" class="edit-btn">
            ✏️ 编辑
          </button>
          <button @click.stop="deleteDormitory(dormitory)" class="delete-btn">
            🗑️ 删除
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && dormitories.length > 0" class="pagination">
      <button 
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      
      <button 
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>

    <!-- 新增/编辑宿舍对话框 -->
    <div v-if="showAddDialog || showEditDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>{{ showAddDialog ? '新增宿舍' : '编辑宿舍' }}</h3>
          <button @click="closeDialog" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitForm" class="dialog-form">
          <div class="form-group">
            <label>楼栋名称</label>
            <input 
              v-model="formData.building_name" 
              type="text" 
              placeholder="如：A栋"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>房间号</label>
            <input 
              v-model="formData.room_number" 
              type="text" 
              placeholder="如：101"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>楼层</label>
            <input 
              v-model.number="formData.floor" 
              type="number" 
              placeholder="如：1"
              min="1"
              required 
            />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { dormitoryAPI } from '@/api'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const dormitories = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 对话框状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingDormitory = ref(null)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  building: '',
  floor: ''
})

// 表单数据
const formData = reactive({
  building_name: '',
  room_number: '',
  floor: 1
})

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
const buildings = computed(() => [...new Set(dormitories.value.map(d => d.building_name))])
const floors = computed(() => [...new Set(dormitories.value.map(d => d.floor))].sort((a, b) => a - b))

// 获取宿舍列表
const fetchDormitories = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchForm.keyword,
      building_name: searchForm.building,
      floor: searchForm.floor
    }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const response = await dormitoryAPI.getDormitoryList(params)
    dormitories.value = response.results || []
    totalCount.value = response.count || 0
  } catch (error) {
    console.error('获取宿舍列表失败:', error)
    ElMessage.error('获取宿舍列表失败，请检查后端服务连接')
    // 保持空数组，不使用模拟数据
    dormitories.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchDormitories()
}

// 分页处理
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchDormitories()
  }
}

// 查看宿舍详情
const viewDormitoryDetail = (dormitory) => {
  console.log('查看宿舍详情:', dormitory)
  // TODO: 跳转到详情页或显示详情对话框
  alert(`宿舍详情: ${dormitory.building_name}-${dormitory.room_number}`)
}

// 编辑宿舍
const editDormitory = (dormitory) => {
  editingDormitory.value = dormitory
  Object.assign(formData, {
    building_name: dormitory.building_name,
    room_number: dormitory.room_number,
    floor: dormitory.floor
  })
  showEditDialog.value = true
}

// 删除宿舍
const deleteDormitory = async (dormitory) => {
  if (!confirm(`确定要删除宿舍 ${dormitory.building_name}-${dormitory.room_number} 吗？`)) {
    return
  }
  
  try {
    await dormitoryAPI.deleteDormitory(dormitory.id)
    alert('删除成功')
    fetchDormitories()
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败: ' + error.message)
  }
}

// 关闭对话框
const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  editingDormitory.value = null
  Object.assign(formData, {
    building_name: '',
    room_number: '',
    floor: 1
  })
}

// 提交表单
const submitForm = async () => {
  try {
    submitting.value = true
    
    if (showAddDialog.value) {
      await dormitoryAPI.createDormitory(formData)
      alert('新增成功')
    } else {
      await dormitoryAPI.updateDormitory(editingDormitory.value.id, formData)
      alert('更新成功')
    }
    
    closeDialog()
    fetchDormitories()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

// 获取入住情况样式类
const getOccupancyClass = (count) => {
  if (count === 0) return 'empty'
  if (count <= 2) return 'normal'
  if (count <= 4) return 'full'
  return 'overcrowded'
}

// 获取宿舍状态
const getDormitoryStatus = (dormitory) => {
  const studentCount = dormitory.student_count || 0
  const repairCount = dormitory.repair_count || 0
  
  if (repairCount > 0) return '有待修'
  if (studentCount === 0) return '空置'
  if (studentCount > 4) return '超员'
  return '正常'
}

// 获取宿舍状态样式类
const getDormitoryStatusClass = (dormitory) => {
  const status = getDormitoryStatus(dormitory)
  const statusMap = {
    '正常': 'status-normal',
    '空置': 'status-empty',
    '超员': 'status-overcrowded',
    '有待修': 'status-repair'
  }
  return statusMap[status] || 'status-normal'
}

// 组件挂载时加载数据
onMounted(() => {
  fetchDormitories()
})
</script>

<style scoped>
.dormitory-management {
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

/* 宿舍卡片网格 */
.dormitory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.loading, .no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
}

.dormitory-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dormitory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
}

.floor-badge {
  background: rgba(255,255,255,0.2);
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
}

.card-content {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-size: 14px;
}

.student-count {
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 13px;
}

.student-count.empty { background: #f8f9fa; color: #6c757d; }
.student-count.normal { background: #d4edda; color: #155724; }
.student-count.full { background: #fff3cd; color: #856404; }
.student-count.overcrowded { background: #f8d7da; color: #721c24; }

.repair-count {
  font-weight: 500;
  color: #333;
}

.status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.status-normal { background: #d4edda; color: #155724; }
.status-empty { background: #f8f9fa; color: #6c757d; }
.status-overcrowded { background: #f8d7da; color: #721c24; }
.status-repair { background: #fff3cd; color: #856404; }

.card-actions {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #bbdefb;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
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
  
  .dormitory-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>