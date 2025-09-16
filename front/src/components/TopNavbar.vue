<template>
  <div class="top-navbar">
    <!-- 左侧：Logo和系统名称 -->
    <div class="navbar-left">
      <div class="logo-section" @click="navigateToHome">
        <el-icon size="28" color="#ffffff">
          <House />
        </el-icon>
        <span class="system-name">智能维修系统</span>
      </div>
    </div>

    <!-- 中间：核心功能导航 -->
    <div class="navbar-center">
      <nav class="main-nav">
        <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
          <el-icon><Monitor /></el-icon>
          <span>首页</span>
        </router-link>
        
        <!-- 我要报修 - 醒目按钮 -->
        <el-button 
          type="primary" 
          size="default"
          class="repair-btn"
          @click="navigateToCreateRepair"
        >
          <el-icon><Tools /></el-icon>
          我要报修
        </el-button>
        
        <router-link to="/repair/records" class="nav-item" :class="{ active: $route.path.includes('/repair/records') }">
          <el-icon><List /></el-icon>
          <span>我的报修</span>
        </router-link>
        
        <router-link to="/contact" class="nav-item" :class="{ active: $route.path === '/contact' }">
          <el-icon><Service /></el-icon>
          <span>联系我们</span>
        </router-link>
      </nav>
    </div>

    <!-- 右侧：通知中心和个人中心 -->
    <div class="navbar-right">
      <!-- 通知中心 -->
      <NotificationCenter />

      <!-- 个人中心 -->
      <UserDropdown />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import {
  House, Monitor, Tools, List, Service
} from '@element-plus/icons-vue'
import NotificationCenter from './NotificationCenter.vue'
import UserDropdown from './UserDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式状态
const searchQuery = ref('')

// 方法
const navigateToHome = () => {
  router.push('/dashboard')
}

const navigateToRepair = () => {
  router.push('/repair')
}

const navigateToMyRepairs = () => {
  router.push('/my-repairs')
}

const navigateToContact = () => {
  router.push('/contact')
}

const navigateToCreateRepair = () => {
  router.push('/repair/create')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 实现搜索逻辑
  }
}
</script>

<style scoped>
.top-navbar {
  height: 64px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1001;
}

/* 左侧Logo区域 */
.navbar-left {
  display: flex;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
}

.logo-section:hover {
  background: rgba(255, 255, 255, 0.1);
}

.system-name {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

/* 中间导航区域 */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
}

.repair-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border: none;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  transition: all 0.3s ease;
}

.repair-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
}

/* 右侧用户区域 */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 组件样式已移至各自的组件文件中 */

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navbar {
    padding: 0 16px;
  }
  
  .main-nav {
    gap: 16px;
  }
  
  .nav-item span {
    display: none;
  }
  
  .system-name {
    font-size: 16px;
  }
  
  .username {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-center {
    display: none;
  }
}
</style>