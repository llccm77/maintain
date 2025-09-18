<template>
  <div class="user-dropdown-container">
    <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
      <div class="user-info">
        <el-avatar 
          :size="36" 
          :src="userInfo.avatar" 
          class="user-avatar"
        >
          <svg class="admin-avatar-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path d="M516.4 517.4c125 0 226.7-101.7 226.7-226.7 0-18.5-15-33.4-33.4-33.4s-33.4 15-33.4 33.4c0 88.2-71.7 159.9-159.9 159.9s-159.9-71.7-159.9-159.9 71.7-159.9 159.9-159.9c22.7 0 44.6 4.6 65.1 13.8 16.8 7.5 36.6 0 44.1-16.9 7.5-16.8 0-36.6-16.9-44.1-29.2-13-60.2-19.6-92.4-19.6-125 0-226.7 101.7-226.7 226.7s101.8 226.7 226.8 226.7zM619.8 556.8H413c-155.8 0-282.5 126.7-282.5 282.5v55.5c0 18.5 15 33.4 33.4 33.4s33.4-15 33.4-33.4v-55.5c0-118.9 96.8-215.7 215.7-215.7h206.7c118.9 0 215.7 96.8 215.7 215.7v55.5c0 18.5 15 33.4 33.4 33.4 18.5 0 33.4-15 33.4-33.4v-55.5c0.1-155.8-126.6-282.5-282.4-282.5z" fill="#409EFF"/>
            <path d="M674.7 190.9m-33.4 0a33.4 33.4 0 1 0 66.8 0 33.4 33.4 0 1 0-66.8 0Z" fill="#409EFF"/>
          </svg>
        </el-avatar>
        <div class="user-details">
          <span class="username">{{ userInfo.name }}</span>
          <span class="user-role">{{ userInfo.role }}</span>
        </div>
        <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
      </div>
      
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown-menu">
          <div class="dropdown-header">
            <el-avatar :size="48" :src="userInfo.avatar">
              <svg class="admin-avatar-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M516.4 517.4c125 0 226.7-101.7 226.7-226.7 0-18.5-15-33.4-33.4-33.4s-33.4 15-33.4 33.4c0 88.2-71.7 159.9-159.9 159.9s-159.9-71.7-159.9-159.9 71.7-159.9 159.9-159.9c22.7 0 44.6 4.6 65.1 13.8 16.8 7.5 36.6 0 44.1-16.9 7.5-16.8 0-36.6-16.9-44.1-29.2-13-60.2-19.6-92.4-19.6-125 0-226.7 101.7-226.7 226.7s101.8 226.7 226.8 226.7zM619.8 556.8H413c-155.8 0-282.5 126.7-282.5 282.5v55.5c0 18.5 15 33.4 33.4 33.4s33.4-15 33.4-33.4v-55.5c0-118.9 96.8-215.7 215.7-215.7h206.7c118.9 0 215.7 96.8 215.7 215.7v55.5c0 18.5 15 33.4 33.4 33.4 18.5 0 33.4-15 33.4-33.4v-55.5c0.1-155.8-126.6-282.5-282.4-282.5z" fill="#409EFF"/>
                <path d="M674.7 190.9m-33.4 0a33.4 33.4 0 1 0 66.8 0 33.4 33.4 0 1 0-66.8 0Z" fill="#409EFF"/>
              </svg>
            </el-avatar>
            <div class="header-info">
              <div class="header-name">{{ userInfo.name }}</div>
              <div class="header-email">{{ userInfo.email }}</div>
            </div>
          </div>
          
          <el-divider style="margin: 8px 0;" />
          
          <el-dropdown-item command="help" class="dropdown-item">
            <el-icon class="item-icon"><QuestionFilled /></el-icon>
            <span>帮助中心</span>
          </el-dropdown-item>
          
          <el-divider style="margin: 8px 0;" />
          
          <el-dropdown-item command="logout" class="dropdown-item logout-item">
            <el-icon class="item-icon"><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User, ArrowDown, Setting, Tools, QuestionFilled, SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const userInfo = reactive({
  name: '宿舍管理员',
  role: '系统管理员',
  email: 'admin@dormitory.edu.cn',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'help':
      router.push('/contact')
      ElMessage.info('跳转到帮助中心')
      break
      
    case 'logout':
      await handleLogout()
      break
      
    default:
      console.log('未知命令:', command)
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
    )
    
    // 清除用户数据
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    
    // 跳转到登录页
    router.push('/login')
    ElMessage.success('已成功退出登录')
    
  } catch {
    // 用户取消退出
    ElMessage.info('已取消退出')
  }
}
</script>

<style scoped>
.user-dropdown-container {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-avatar-icon {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.user-avatar:hover .admin-avatar-icon {
  transform: scale(1.05);
}

.admin-avatar-icon path {
  transition: fill 0.3s ease;
}

.user-info:hover .admin-avatar-icon path {
  fill: #67C23A;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
:deep(.user-dropdown-menu) {
  min-width: 240px;
  padding: 8px 0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8fafc;
  margin: -8px -0 8px -0;
  border-radius: 12px 12px 0 0;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.header-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 2px;
}

.header-email {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.2;
}

:deep(.dropdown-item) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  font-size: 14px;
  color: #374151;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 2px 8px;
}

:deep(.dropdown-item:hover) {
  background: #f3f4f6;
  color: #1f2937;
}

:deep(.item-icon) {
  font-size: 16px;
  color: #6b7280;
  transition: color 0.3s ease;
}

:deep(.dropdown-item:hover .item-icon) {
  color: #409eff;
}

:deep(.logout-item) {
  color: #ef4444;
}

:deep(.logout-item:hover) {
  background: #fef2f2;
  color: #dc2626;
}

:deep(.logout-item .item-icon) {
  color: #ef4444;
}

:deep(.logout-item:hover .item-icon) {
  color: #dc2626;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-details {
    display: none;
  }
  
  .dropdown-arrow {
    display: none;
  }
  
  :deep(.user-dropdown-menu) {
    min-width: 200px;
  }
}
</style>