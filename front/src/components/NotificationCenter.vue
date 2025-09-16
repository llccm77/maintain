<template>
  <div class="notification-center">
    <el-badge :value="notificationCount" :hidden="notificationCount === 0">
      <el-button 
        @click="toggleNotifications"
        :icon="Bell" 
        circle 
        size="default"
        class="notification-btn"
      />
    </el-badge>

    <!-- 通知下拉面板 -->
    <transition name="slide-down">
      <div v-if="showNotifications" class="notification-dropdown">
        <div class="notification-header">
          <h4>通知中心</h4>
          <el-button 
            @click="markAllAsRead" 
            text 
            size="small"
            class="mark-all-btn"
          >
            全部已读
          </el-button>
        </div>
        
        <div class="notification-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id" 
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'warning'" color="#f39c12">
                <Warning />
              </el-icon>
              <el-icon v-else-if="notification.type === 'success'" color="#27ae60">
                <Check />
              </el-icon>
              <el-icon v-else-if="notification.type === 'info'" color="#3498db">
                <InfoFilled />
              </el-icon>
              <el-icon v-else color="#e74c3c">
                <CircleClose />
              </el-icon>
            </div>
            
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-desc">{{ notification.description }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            
            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
        </div>
        
        <div class="notification-footer">
          <el-button text size="small" @click="viewAllNotifications">
            查看全部通知
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Bell, Warning, Check, InfoFilled, CircleClose 
} from '@element-plus/icons-vue'

// 响应式状态
const showNotifications = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: '紧急维修',
    description: '宿舍楼A栋201房间水管爆裂，需要立即处理',
    time: '5分钟前',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: '维修完成',
    description: '宿舍楼B栋301房间电路维修已完成',
    time: '1小时前',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: '系统通知',
    description: '系统将于今晚23:00进行维护，预计持续2小时',
    time: '2小时前',
    read: true
  },
  {
    id: 4,
    type: 'error',
    title: '报修失败',
    description: '您的报修申请提交失败，请重新尝试',
    time: '3小时前',
    read: true
  }
])

// 计算属性
const notificationCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// 方法
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const viewAllNotifications = () => {
  showNotifications.value = false
  // 跳转到通知页面
  console.log('查看全部通知')
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-center')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-btn {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
  color: #409eff;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: rgba(64, 158, 255, 0.2);
  transform: scale(1.05);
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  z-index: 1000;
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.notification-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.mark-all-btn {
  color: #409eff;
  font-size: 12px;
}

.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #f0f9ff;
  border-left: 3px solid #409eff;
}

.notification-icon {
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-content {
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
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
  margin-left: 8px;
  margin-top: 6px;
  flex-shrink: 0;
}

.notification-footer {
  padding: 12px 20px;
  text-align: center;
  border-top: 1px solid #f3f4f6;
  background: #fafbfc;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.8);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.8);
}

/* 滚动条样式 */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>