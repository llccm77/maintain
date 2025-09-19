<template>
  <div class="top-navbar">
    <!-- 左侧：Logo和系统名称 -->
    <div class="navbar-left">
      <div class="logo-section" @click="navigateToHome">
        <div class="custom-logo-icon">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 房屋主体 -->
            <path d="M20 35 L50 15 L80 35 L80 75 L20 75 Z" fill="#87CEEB" stroke="#5B9BD5" stroke-width="2"/>
            <!-- 屋顶 -->
            <path d="M15 35 L50 10 L85 35 L80 35 L50 15 L20 35 Z" fill="#5B9BD5"/>
            <!-- 窗户 -->
            <rect x="30" y="25" width="8" height="8" fill="#ffffff" stroke="#5B9BD5" stroke-width="1"/>
            <rect x="42" y="25" width="8" height="8" fill="#ffffff" stroke="#5B9BD5" stroke-width="1"/>
            <rect x="54" y="25" width="8" height="8" fill="#ffffff" stroke="#5B9BD5" stroke-width="1"/>
            <!-- 门 -->
            <rect x="45" y="55" width="10" height="20" fill="#ffffff" stroke="#5B9BD5" stroke-width="1"/>
            <circle cx="52" cy="65" r="1" fill="#5B9BD5"/>
            <!-- 草地 -->
            <ellipse cx="50" cy="80" rx="35" ry="8" fill="#90EE90"/>
            <!-- 维修工具 -->
            <!-- 扳手 -->
            <path d="M25 60 L35 50 L37 52 L27 62 Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
            <circle cx="26" cy="61" r="2" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
            <!-- 螺丝刀 -->
            <path d="M65 50 L75 60 L73 62 L63 52 Z" fill="#90EE90" stroke="#32CD32" stroke-width="1"/>
            <rect x="74" y="59" width="3" height="3" fill="#FFD700"/>
            <!-- 笑脸 -->
            <circle cx="85" cy="25" r="8" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
            <circle cx="82" cy="22" r="1.5" fill="#5B9BD5"/>
            <circle cx="88" cy="22" r="1.5" fill="#5B9BD5"/>
            <path d="M82 27 Q85 30 88 27" stroke="#5B9BD5" stroke-width="1.5" fill="none"/>
            <!-- 爱心 -->
            <path d="M75 35 C75 32 77 30 80 30 C83 30 85 32 85 35 C85 38 80 43 80 43 C80 43 75 38 75 35 Z" fill="#90EE90" stroke="#32CD32" stroke-width="1"/>
            <!-- 加号 -->
            <path d="M15 45 L25 45 M20 40 L20 50" stroke="#87CEEB" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="system-name">宿舍报修系统</span>
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

.custom-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.custom-logo-icon:hover {
  transform: scale(1.1);
}

.custom-logo-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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