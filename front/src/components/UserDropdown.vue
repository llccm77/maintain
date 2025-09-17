<template>
  <div class="user-dropdown-container">
    <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
      <div class="user-info">
        <el-avatar 
          :size="36" 
          :src="userInfo.avatar" 
          class="user-avatar"
        >
          <el-icon><User /></el-icon>
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
              <el-icon><User /></el-icon>
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
          
          <el-dropdown-item command="logout" class="dropdown-item logout-item">
            <el-icon class="item-icon"><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
          
          <el-dropdown-item command="deactivate" class="dropdown-item logout-item">
            <el-icon class="item-icon"><Delete /></el-icon>
            <span>注销账号</span>
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
  User, ArrowDown, QuestionFilled, SwitchButton, Delete
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
      
    case 'deactivate':
      await handleDeactivate()
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
    localStorage.removeItem('user')
    
    // 跳转到登录页
    router.push('/login')
    ElMessage.success('已成功退出登录')
    
  } catch {
    // 用户取消退出
    ElMessage.info('已取消退出')
  }
}

// 处理注销账号
const handleDeactivate = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要注销账号吗？此操作不可逆，您的所有数据将被删除。',
      '注销确认',
      {
        confirmButtonText: '确定注销',
        cancelButtonText: '取消',
        type: 'danger',
        center: true
      }
    )
    
    // 清除用户数据
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 跳转到登录页
    router.push('/login')
    ElMessage.success('账号已注销，感谢您的使用')
    
  } catch {
    // 用户取消注销
    ElMessage.info('已取消注销操作')
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