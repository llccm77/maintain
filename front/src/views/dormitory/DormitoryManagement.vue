<template>
  <div class="dormitory-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-background">
        
        <div class="header-content">
          <div class="title-section">
            <!-- 简洁的宿舍楼图标 -->
            <div class="header-icon-wrapper">
              <svg class="header-icon" width="48" height="48" viewBox="0 0 48 48">
                <!-- 简洁的建筑图标 -->
                <rect x="8" y="16" width="32" height="24" rx="2" fill="#4A90E2" stroke="#357ABD" stroke-width="1"/>
                <path d="M6 18 L24 10 L42 18" stroke="#357ABD" stroke-width="2" fill="none" stroke-linecap="round"/>
                <!-- 简洁窗户 -->
                <rect x="12" y="20" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="21" y="20" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="30" y="20" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="30" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="21" y="30" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="30" y="30" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <!-- 简洁门 -->
                <rect x="19" y="34" width="10" height="6" rx="1" fill="#2C5282"/>
              </svg>
            </div>
            <div class="title-text">
              <h1><span class="title-primary">温馨宿舍</span><span class="title-secondary">大家庭</span></h1>
              <p class="subtitle">每一间都是同学们的温暖小窝</p>
              <div class="welcome-stats">
                <span class="stat-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" fill="currentColor"/>
                    <circle cx="8" cy="8" r="2" fill="currentColor"/>
                  </svg>
                  {{ dormitories.length }} 间宿舍
                </span>
                <span class="stat-item">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 1 0 7 7A7 7 0 0 0 8 1zm3.5 6L8 10.5 4.5 7 6 5.5l2 2 3.5-3.5L13 5.5z" fill="currentColor"/>
                  </svg>
                  温馨管理中
                </span>
              </div>
            </div>
          </div>
          <button @click="showAddDialog = true" class="add-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            添加新宿舍
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <div class="search-title">
          <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>快速找到你的宿舍</span>
        </div>
        <div class="search-tips">
          支持楼栋名、房间号搜索
        </div>
      </div>
      
      <div class="search-controls">
        <div class="search-input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchForm.keyword"
            type="text"
            placeholder="输入楼栋名或房间号，如 'A栋' 或 '101'..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            搜索
          </button>
        </div>
        
        <div class="filter-controls">
          <div class="filter-item">
            <label class="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              楼栋筛选
            </label>
            <select v-model="searchForm.building" @change="handleSearch" class="filter-select">
              <option value="">全部楼栋</option>
              <option v-for="building in buildings" :key="building" :value="building">
                {{ building }}
              </option>
            </select>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              楼层筛选
            </label>
            <select v-model="searchForm.floor" @change="handleSearch" class="filter-select">
              <option value="">全部楼层</option>
              <option v-for="floor in floors" :key="floor" :value="floor">
                第{{ floor }}楼
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 温馨宿舍展示区 -->
    <div class="dormitory-showcase">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-animation">
          <svg class="loading-icon" width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" stroke="#FF6B9D" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
          <p>正在加载宿舍信息...</p>
        </div>
      </div>
      
      <!-- 空数据状态 -->
      <div v-else-if="dormitories.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
            <path d="M9 9v.01"/>
            <path d="M9 12v.01"/>
            <path d="M9 15v.01"/>
            <path d="M9 18v.01"/>
          </svg>
        </div>
        <h3>还没有宿舍信息</h3>
        <p>点击上方按钮添加第一个宿舍吧！</p>
      </div>
      
      <!-- 宿舍卡片网格 -->
      <div v-else class="dormitory-grid">
        <div 
          v-for="dormitory in dormitories" 
          :key="dormitory.id"
          class="dormitory-card"
          @click="viewDormitoryDetail(dormitory)"
        >
          <!-- 卡片装饰背景 -->
          <div class="card-decoration">
            <svg class="decoration-pattern" width="100%" height="100%" viewBox="0 0 200 200">
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="rgba(255,182,193,0.1)"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
          </div>
          
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="room-icon-wrapper">
              <svg class="room-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- 简洁房间图标 -->
                <rect x="3" y="9" width="18" height="12" rx="2"/>
                <path d="m9 22 0-10"/>
                <path d="m15 22 0-10"/>
                <path d="M2 11l10-8 10 8"/>
                <circle cx="8" cy="15" r="1"/>
                <circle cx="16" cy="15" r="1"/>
              </svg>
            </div>
            <div class="room-info">
              <h3 class="room-title">{{ dormitory.building_name }}-{{ dormitory.room_number }}</h3>
              <div class="room-meta">
                <span class="floor-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  第{{ dormitory.floor }}楼
                </span>
              </div>
            </div>
          </div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">入住情况</span>
                  <span class="info-value student-count" :class="getOccupancyClass(dormitory.student_count)">
                    {{ dormitory.student_count || 0 }}/4 人
                  </span>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">维修记录</span>
                  <span class="info-value repair-count">{{ dormitory.repair_count || 0 }} 次</span>
                </div>
              </div>
              
              <div class="info-item status-item">
                <div class="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">宿舍状态</span>
                  <span class="info-value status" :class="getDormitoryStatusClass(dormitory)">
                    {{ getDormitoryStatus(dormitory) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 卡片操作区 -->
          <div class="card-actions">
            <button @click.stop="editDormitory(dormitory)" class="action-btn edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              管理
            </button>
            <button @click.stop="deleteDormitory(dormitory)" class="action-btn delete-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6 v14 a2,2 0 0,1 -2,2 H7 a2,2 0 0,1 -2,-2 V6 m3,0 V4 a2,2 0 0,1 2,-2 h4 a2,2 0 0,1 2,2 v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              移除
            </button>
          </div>
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
          <div class="dialog-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dialog-icon">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
              <path d="M9 9v.01"/>
              <path d="M9 12v.01"/>
              <path d="M9 15v.01"/>
              <path d="M9 18v.01"/>
            </svg>
            <h3>{{ showAddDialog ? '新增宿舍' : '编辑宿舍' }}</h3>
          </div>
          <button @click="closeDialog" class="close-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  background: #F7FAFC;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 温馨页面头部样式 */
.page-header {
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-background {
  background: transparent;
  padding: 32px 40px;
  position: relative;
}

/* 装饰元素动画 */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.cloud {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

.cloud-1 {
  top: 20px;
  right: 100px;
  animation-delay: 0s;
}

.cloud-2 {
  top: 60px;
  right: 200px;
  animation-delay: 2s;
}

.star {
  position: absolute;
  animation: twinkle 3s ease-in-out infinite;
}

.star-1 {
  top: 30px;
  left: 80px;
  animation-delay: 1s;
}

.star-2 {
  bottom: 40px;
  right: 150px;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  padding: 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-icon {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.title-text h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #2D3748;
}

.title-primary {
  font-weight: 700;
  color: #2D3748;
}

.title-secondary {
  font-weight: 400;
  color: #4A5568;
}

.subtitle {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #718096;
  font-weight: 400;
}

.welcome-stats {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #4A5568;
  font-weight: 500;
  border: 1px solid #E2E8F0;
}

.add-btn {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.add-btn:hover {
  background: #357ABD;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

/* 搜索区域样式 */
.search-section {
  background: #FFFFFF;
  padding: 28px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #2D3748;
}

.search-icon {
  color: #667eea;
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #718096;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 12px;
}

.search-controls {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-input-wrapper {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  background: #FFFFFF;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  background: white;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #4A90E2;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.search-btn:hover {
  transform: translateY(-50%) translateY(-1px);
  background: #357ABD;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.filter-controls {
  display: flex;
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  background: #FFFFFF;
  transition: all 0.2s ease;
  min-width: 120px;
  color: #4A5568;
}

.filter-select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* 温馨宿舍展示区域样式 */
.dormitory-showcase {
  margin-bottom: 40px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 20px;
  border: 2px dashed rgba(102, 126, 234, 0.2);
}

.loading-animation {
  text-align: center;
}

.loading-icon {
  margin-bottom: 16px;
}

.loading-animation p {
  color: #667eea;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 20px;
  border: 2px dashed rgba(255, 182, 193, 0.3);
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-state h3 {
  color: #4a5568;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.dormitory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
}

.dormitory-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}



.dormitory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}



.card-header {
  background: #F8FAFC;
  color: #2D3748;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
}

.room-icon-wrapper {
  background: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.room-icon {
  display: block;
}

.room-info {
  flex: 1;
}

.room-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
}

.room-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.floor-badge {
  background: #EDF2F7;
  color: #4A5568;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  padding: 24px;
  background: #FFFFFF;
  position: relative;
}

.info-grid {
  display: grid;
  gap: 18px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  transition: all 0.2s ease;
  position: relative;
}

.info-item:hover {
  background: #EDF2F7;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-icon {
  background: #EDF2F7;
  color: #4A90E2;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  color: #718096;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #2D3748;
  font-size: 14px;
  font-weight: 600;
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
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-normal { 
  background: #E6FFFA; 
  color: #234E52; 
}
.status-empty { 
  background: #F7FAFC; 
  color: #4A5568; 
}
.status-overcrowded { 
  background: #FED7D7; 
  color: #742A2A; 
}
.status-repair { 
  background: #FEFCBF; 
  color: #744210; 
}

.card-actions {
  padding: 20px 24px;
  background: #F8FAFC;
  display: flex;
  gap: 12px;
  border-top: 1px solid #E2E8F0;
  position: relative;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
}

.edit-btn {
  background: #EBF8FF;
  color: #4A90E2;
  border-color: #BEE3F8;
}

.edit-btn:hover {
  background: #4A90E2;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.delete-btn {
  background: #FED7D7;
  color: #E53E3E;
  border-color: #FEB2B2;
}

.delete-btn:hover {
  background: #E53E3E;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(245, 101, 101, 0.3);
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
}

.page-btn {
  padding: 12px 18px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.8);
  color: #4a5568;
  border-radius: 14px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s;
}

.page-btn:hover::before {
  left: 100%;
}

.page-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  background: rgba(248, 250, 252, 0.5);
  border-color: rgba(102, 126, 234, 0.1);
  color: #a0aec0;
}

.page-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.page-info {
  color: #4a5568;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog {
  background: #FFFFFF;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #E2E8F0;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}



.dialog-header {
  padding: 24px 28px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border-radius: 12px 12px 0 0;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-title h3 {
  margin: 0;
  color: #2D3748;
  font-size: 18px;
  font-weight: 600;
}

.dialog-icon {
  flex-shrink: 0;
}



.close-btn {
  background: #F7FAFC;
  border: 1px solid #E2E8F0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #EDF2F7;
  color: #4A5568;
}

.dialog-form {
  padding: 24px 28px 28px;
  background: #FFFFFF;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #4A5568;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  background: #FFFFFF;
  transition: all 0.2s ease;
  font-weight: 400;
}

.form-group input::placeholder {
  color: #A0AEC0;
  font-weight: 400;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  background: #FFFFFF;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #E2E8F0;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #F7FAFC;
  color: #4A5568;
  border-color: #E2E8F0;
}

.cancel-btn:hover {
  background: #EDF2F7;
  color: #2D3748;
  border-color: #CBD5E0;
}

.submit-btn {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.submit-btn:hover {
  background: #357ABD;
  border-color: #357ABD;
}

.submit-btn:disabled {
  background: #E2E8F0;
  color: #A0AEC0;
  border-color: #E2E8F0;
  cursor: not-allowed;
}

.submit-btn:disabled:hover {
  background: #E2E8F0;
  border-color: #E2E8F0;
}

@media (max-width: 768px) {
  .dormitory-management {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .search-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-input-wrapper {
    min-width: auto;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .dormitory-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .dormitory-card {
    margin: 0 auto;
    max-width: 400px;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-actions {
    padding: 20px;
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-btn {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>