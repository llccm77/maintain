<template>
  <div class="user-management">
    <div class="page-header">
      <h1>用户管理</h1>
      <p class="page-desc">管理系统用户账户和权限</p>
    </div>

    <div class="content-wrapper">
      <div class="info-card">
        <div class="card-icon">👥</div>
        <div class="card-content">
          <h3>用户管理功能</h3>
          <p>此功能需要连接Django用户管理后端接口才能使用。</p>
          <p>当前展示的是基础页面结构，后续将连接真实的用户数据。</p>
        </div>
      </div>
      
      <div class="feature-list">
        <div class="feature-item">
          <h4>📊 用户统计</h4>
          <p>查看系统中各类用户的数量统计</p>
        </div>
        
        <div class="feature-item">
          <h4>👤 用户列表</h4>
          <p>浏览、搜索和管理所有系统用户</p>
        </div>
        
        <div class="feature-item">
          <h4>🔐 权限管理</h4>
          <p>分配和管理用户角色与权限</p>
        </div>
        
        <div class="feature-item">
          <h4>📝 用户操作</h4>
          <p>新增、编辑、禁用用户账户</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api'

// 响应式数据
const loading = ref(false)
const userStats = ref({
  total: 0,
  admin: 0,
  staff: 0,
  student: 0
})

// 获取用户统计（当后端接口可用时）
const fetchUserStats = async () => {
  try {
    loading.value = true
    // 尝试连接Django用户统计接口
    // const response = await authAPI.getUserStats()
    // userStats.value = response.data
    
    ElMessage.info('用户管理功能尚未完全实现，请等待后端接口完善')
    // 保持默认值，不使用模拟数据
    userStats.value = {
      total: 0,
      admin: 0,
      staff: 0,
      student: 0
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchUserStats()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin: 0 0 8px 0;
}

.page-desc {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-content h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 20px;
}

.card-content p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.5;
}

.card-content p:last-child {
  margin-bottom: 0;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 24px;
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-item h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.feature-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }
  
  .info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>
