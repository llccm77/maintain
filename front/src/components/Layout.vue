<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <TopNavbar />
    
    <!-- 侧边导航栏 -->
    <SideNavbar />
    
    <!-- 主内容区域 -->
    <div class="main-content">
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
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { useAuthStore } from '@/stores'
import {
  Close, Warning, Check, InfoFilled
} from '@element-plus/icons-vue'
import TopNavbar from './TopNavbar.vue'
import SideNavbar from './SideNavbar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式状态
const isMobile = ref(false)
const isMobileMenuOpen = ref(false)
const showNotifications = ref(false)

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: '紧急维修',
    description: '宿舍楼A栋201房间水管爆裂',
    time: '5分钟前'
  },
  {
    id: 2,
    type: 'success',
    title: '维修完成',
    description: '宿舍楼B栋301房间电路维修已完成',
    time: '1小时前'
  },
  {
    id: 3,
    type: 'info',
    title: '系统通知',
    description: '系统将于今晚23:00进行维护',
    time: '2小时前'
  }
])

// 检测屏幕尺寸
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// 方法
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后需要重新登录。',
      '退出确认',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 显示加载状态
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在退出登录...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    try {
      // 调用退出登录API
      await authStore.logout()
      
      // 清除路由守卫可能的缓存
      router.replace('/login')
      
      ElMessage.success({
        message: '退出登录成功',
        duration: 2000
      })
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使API调用失败，也要清除本地状态
      authStore.logout()
      router.replace('/login')
      ElMessage.warning('退出登录完成（网络异常）')
    } finally {
      loadingInstance.close()
    }
  } catch (error) {
    // 用户取消退出
    if (error === 'cancel') {
      ElMessage.info('已取消退出')
    }
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
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-top: 64px; /* 顶部导航栏高度 */
  margin-left: 240px; /* 侧边栏宽度 */
  transition: margin-left 0.3s ease, margin-top 0.3s ease;
}

/* 页面内容 */
.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
  padding: 24px;
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