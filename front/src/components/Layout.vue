<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <div 
      class="sidebar" 
      :class="{ 'sidebar-collapsed': isCollapsed, 'sidebar-mobile-open': isMobileMenuOpen }"
    >
      <div class="sidebar-header">
        <div class="logo" @click="navigateTo('/dashboard')">
          <el-icon v-if="!isCollapsed" size="24" color="#409eff">
            <House />
          </el-icon>
          <el-icon v-else size="20" color="#409eff">
            <House />
          </el-icon>
          <transition name="fade">
            <span v-if="!isCollapsed" class="logo-text">智能维修</span>
          </transition>
        </div>
        <el-button 
          v-if="!isMobile" 
          @click="toggleSidebar" 
          class="collapse-btn"
          :icon="isCollapsed ? Expand : Fold"
          circle
          size="small"
        />
      </div>

      <div class="sidebar-content">
        <el-menu
          :default-active="currentRoute"
          :collapse="isCollapsed"
          :unique-opened="true"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <!-- 仪表盘 -->
          <el-menu-item index="/dashboard">
            <el-icon><Monitor /></el-icon>
            <template #title>数据仪表盘</template>
          </el-menu-item>

          <!-- 工单管理 -->
          <el-menu-item index="/repair">
            <el-icon><Tools /></el-icon>
            <template #title>工单管理</template>
          </el-menu-item>

          <!-- 学生管理 -->
          <el-menu-item index="/student">
            <el-icon><UserFilled /></el-icon>
            <template #title>学生管理</template>
          </el-menu-item>

          <!-- 宿舍管理 -->
          <el-menu-item index="/dormitory">
            <el-icon><House /></el-icon>
            <template #title>宿舍管理</template>
          </el-menu-item>

          <!-- 系统管理 -->
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/settings">
              <el-icon><Tools /></el-icon>
              <template #title>系统设置</template>
            </el-menu-item>
            <el-menu-item index="/users">
              <el-icon><UserFilled /></el-icon>
              <template #title>用户管理</template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <div class="sidebar-footer">
        <div class="user-profile" @click="showUserMenu = !showUserMenu">
          <el-avatar :size="isCollapsed ? 32 : 40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <div v-if="!isCollapsed" class="user-info">
            <div class="user-name">管理员</div>
            <div class="user-role">超级管理员</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'main-collapsed': isCollapsed }">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="navbar-left">
          <el-button 
            v-if="isMobile" 
            @click="toggleMobileMenu" 
            class="mobile-menu-btn"
            :icon="Menu"
            circle
            size="small"
          />
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="navbar-right">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-input
              v-model="searchQuery"
              placeholder="搜索工单、学生..."
              prefix-icon="Search"
              size="small"
              class="search-input"
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- 通知中心 -->
          <el-badge :value="notificationCount" class="notification-badge">
            <el-button 
              @click="showNotifications = !showNotifications"
              :icon="Bell" 
              circle 
              size="small"
            />
          </el-badge>

          <!-- 用户菜单 -->
          <el-dropdown @command="handleUserCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <!-- 移动端遮罩 -->
    <div 
      v-if="isMobile && isMobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- 通知侧边栏 -->
    <transition name="slide-right">
      <div v-if="showNotifications" class="notification-panel">
        <div class="notification-header">
          <h3>通知中心</h3>
          <el-button @click="showNotifications = false" :icon="Close" circle size="small" />
        </div>
        <div class="notification-content">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'warning'" color="#f39c12"><Warning /></el-icon>
              <el-icon v-else-if="notification.type === 'success'" color="#27ae60"><Check /></el-icon>
              <el-icon v-else color="#3498db"><InfoFilled /></el-icon>
            </div>
            <div class="notification-body">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-desc">{{ notification.description }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores'
import {
  House, Monitor, Tools, UserFilled, Setting,
  Expand, Fold, Menu, Search, Bell, ArrowDown, SwitchButton, Close,
  Warning, Check, InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式状态
const isCollapsed = ref(false)
const isMobile = ref(false)
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')
const notificationCount = ref(3)

// 当前路由
const currentRoute = computed(() => route.path)

// 面包屑导航
const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbItems = [{ title: '首页', path: '/dashboard' }]
  
  const routeMap = {
    'dashboard': '仪表盘',
    'repair': '工单列表',
    'student': '学生列表',
    'dormitory': '宿舍列表',
    'settings': '系统设置',
    'users': '用户管理'
  }
  
  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += '/' + segment
    if (routeMap[segment]) {
      breadcrumbItems.push({
        title: routeMap[segment],
        path: currentPath
      })
    }
  })
  
  return breadcrumbItems
})

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: '新的报修工单',
    description: 'A栋-101宿舍水龙头漏水，需要尽快处理',
    time: '5分钟前'
  },
  {
    id: 2,
    type: 'success',
    title: '工单已完成',
    description: 'B栋-205宿舍灯泡更换已完成',
    time: '1小时前'
  },
  {
    id: 3,
    type: 'info',
    title: '系统更新',
    description: '系统将在今晚进行维护更新',
    time: '2小时前'
  }
])

// 检测屏幕尺寸
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isCollapsed.value = true
    isMobileMenuOpen.value = false
  }
}

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const navigateTo = (path) => {
  router.push(path)
  if (isMobile.value) {
    closeMobileMenu()
  }
}

const handleMenuSelect = (index) => {
  router.push(index)
  if (isMobile.value) {
    closeMobileMenu()
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`搜索: ${searchQuery.value}`)
    // 实现搜索逻辑
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* 应用布局 */
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-mobile-open {
  transform: translateX(0);
}

/* 侧边栏头部 */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  min-height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  color: #1f2937;
  transition: all 0.3s ease;
}

.logo:hover {
  color: #409eff;
}

.logo-text {
  white-space: nowrap;
}

.collapse-btn {
  border: none;
  background: #f3f4f6;
}

/* 侧边栏内容 */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu {
  margin: 4px 12px;
  border-radius: 8px;
  overflow: hidden;
}

.sidebar-menu .el-menu-item {
  height: 44px;
  line-height: 44px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #f8faff;
  color: #409eff;
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #409eff, #6c5ce7);
  color: white;
  position: relative;
}

.sidebar-menu .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: white;
  border-radius: 0 2px 2px 0;
}

.sidebar-menu .el-sub-menu__title {
  height: 44px;
  line-height: 44px;
  color: #6b7280;
  border-radius: 8px;
  margin: 0;
  transition: all 0.3s ease;
}

.sidebar-menu .el-sub-menu__title:hover {
  background-color: #f8faff;
  color: #409eff;
}

.sidebar-menu .el-menu-item .el-icon {
  width: 20px;
  margin-right: 12px;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f3f4f6;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: #f3f4f6;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-collapsed {
  margin-left: 64px;
}

/* 顶部导航栏 */
.top-navbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  border: none;
  background: #f3f4f6;
}

.breadcrumb {
  font-size: 14px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-input {
  width: 240px;
  transition: width 0.3s ease;
}

.search-input:focus-within {
  width: 280px;
}

.notification-badge {
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-dropdown:hover {
  background-color: #f3f4f6;
}

.username {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

/* 页面内容 */
.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 通知面板 */
.notification-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 320px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.notification-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.notification-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.page-enter-active, .page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar-mobile-open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .main-collapsed {
    margin-left: 0;
  }
  
  .top-navbar {
    padding: 0 16px;
  }
  
  .search-input {
    width: 180px;
  }
  
  .search-input:focus-within {
    width: 200px;
  }
  
  .username {
    display: none;
  }
  
  .notification-panel {
    width: 280px;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    padding: 0 12px;
  }
  
  .navbar-right {
    gap: 8px;
  }
  
  .search-box {
    display: none;
  }
  
  .notification-panel {
    width: 100vw;
  }
}

/* Element Plus 样式覆盖 */
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-sub-menu__title span {
  display: none;
}

.el-menu--collapse .el-menu-item .el-icon {
  margin: 0;
}

.el-breadcrumb__inner {
  color: #6b7280;
  font-weight: 500;
}

.el-breadcrumb__inner:hover {
  color: #409eff;
}

.el-breadcrumb__inner.is-link {
  color: #409eff;
}
</style>