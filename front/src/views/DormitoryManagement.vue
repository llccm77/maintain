<template>
  <div class="dormitory-management">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <StatusIcons type="house" :size="48" class="header-icon" />
          <div class="title-text">
            <h1>我的小窝们</h1>
            <p class="subtitle">每一个房间都是温馨的小家</p>
          </div>
        </div>
        <button @click="showAddDialog = true" class="add-btn">
          🏠 添加我的新小窝
        </button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <div class="search-group">
        <input
          v-model="searchForm.keyword"
          type="text"
          placeholder="搜索我的小窝楼栋或房间号..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">🔍 寻找小窝</button>
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
          <StatusIcons type="house" :size="32" class="house-icon" />
          <div class="room-info">
            <h3>{{ dormitory.building_name }}-{{ dormitory.room_number }}</h3>
            <span class="floor-badge">第{{ dormitory.floor }}楼</span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="info-row">
            <span class="label">🏠 入住情况:</span>
            <span class="student-count" :class="getOccupancyClass(dormitory.student_count)">
              {{ dormitory.student_count || 0 }}/4 人
            </span>
          </div>
          
          <div class="info-row">
            <span class="label">🔧 报修记录:</span>
            <span class="repair-count">{{ dormitory.repair_count || 0 }} 次</span>
          </div>
          
          <div class="info-row">
            <span class="label">✨ 小窝状态:</span>
            <span class="status" :class="getDormitoryStatusClass(dormitory)">
              {{ getDormitoryStatus(dormitory) }}
            </span>
          </div>
        </div>
        
        <div class="card-actions">
          <button @click.stop="editDormitory(dormitory)" class="edit-btn">
            ✏️ 管理小窝
          </button>
          <button @click.stop="deleteDormitory(dormitory)" class="delete-btn">
            🗑️ 移除
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
import StatusIcons from '@/components/StatusIcons.vue'

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

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #E6E6FA 100%);
  color: #5A5A5A;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  color: #FF69B4;
  filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3));
}

.title-text h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #4A4A4A;
}

.subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #8A8A8A;
  font-weight: 400;
}

.add-btn {
  background: linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

/* 搜索筛选样式 */
.search-filter {
  background: linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 50%, #FFF0F5 100%);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(230, 230, 250, 0.4);
  margin-bottom: 24px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.search-group {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 250px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(255, 182, 193, 0.3);
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #FF69B4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  background: white;
}

.search-btn {
  background: linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.3);
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-group select {
  padding: 12px 16px;
  border: 2px solid rgba(255, 182, 193, 0.3);
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: #FF69B4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

/* 宿舍卡片网格 */
.dormitory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.loading, .no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #8A8A8A;
  font-size: 16px;
  background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
  border-radius: 16px;
  border: 2px dashed rgba(255, 182, 193, 0.3);
}

.dormitory-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(255, 182, 193, 0.2);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 182, 193, 0.1);
}

.dormitory-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(255, 182, 193, 0.3);
  border-color: rgba(255, 105, 180, 0.2);
}

.card-header {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #E6E6FA 100%);
  color: #4A4A4A;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.house-icon {
  color: #FF69B4;
  filter: drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3));
}

.room-info {
  flex: 1;
}

.room-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #4A4A4A;
}

.floor-badge {
  background: rgba(255, 255, 255, 0.6);
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.card-content {
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.05) 0%, rgba(230, 230, 250, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 182, 193, 0.1);
  transition: all 0.3s ease;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row:hover {
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%);
  transform: translateX(2px);
}

.label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.student-count {
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  border: 1px solid;
}

.student-count.empty { 
  background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%); 
  color: #6C757D; 
  border-color: #DEE2E6;
}
.student-count.normal { 
  background: linear-gradient(135deg, #D1ECF1 0%, #BEE5EB 100%); 
  color: #0C5460; 
  border-color: #B8DAFF;
}
.student-count.full { 
  background: linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%); 
  color: #856404; 
  border-color: #FFEAA7;
}
.student-count.overcrowded { 
  background: linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%); 
  color: #721C24; 
  border-color: #F5C6CB;
}

.repair-count {
  font-weight: 600;
  color: #4A4A4A;
  padding: 4px 8px;
  background: rgba(255, 182, 193, 0.1);
  border-radius: 8px;
}

.status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
}

.status-normal { 
  background: linear-gradient(135deg, #D1ECF1 0%, #BEE5EB 100%); 
  color: #0C5460; 
  border-color: #B8DAFF;
}
.status-empty { 
  background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%); 
  color: #6C757D; 
  border-color: #DEE2E6;
}
.status-overcrowded { 
  background: linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%); 
  color: #721C24; 
  border-color: #F5C6CB;
}
.status-repair { 
  background: linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%); 
  color: #856404; 
  border-color: #FFEAA7;
}

.card-actions {
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.05) 0%, rgba(230, 230, 250, 0.05) 100%);
  display: flex;
  gap: 12px;
  border-top: 1px solid rgba(255, 182, 193, 0.1);
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  color: #1976D2;
  border-color: #90CAF9;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.delete-btn {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  color: #D32F2F;
  border-color: #FFAB91;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #FFCDD2 0%, #FFAB91 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.05) 0%, rgba(230, 230, 250, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.1);
}

.page-btn {
  background: linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.3);
}

.page-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.page-btn:disabled {
  background: linear-gradient(135deg, #E9ECEF 0%, #DEE2E6 100%);
  color: #6C757D;
  border-color: #DEE2E6;
  cursor: not-allowed;
  box-shadow: none;
}

.page-info {
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(255, 182, 193, 0.2);
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