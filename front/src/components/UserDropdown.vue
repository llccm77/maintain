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
            <path d="M675 673.6c10.6 0 19.4-8.7 18.4-19-10.4-111.4-86.4-198-178.9-198s-168.6 86.6-178.9 198c-1 10.2 7.8 19 18.4 19h321z" fill="#67C23A"/>
            <path d="M409.4 301.6a105.1 104.3 0 1 0 210.2 0 105.1 104.3 0 1 0-210.2 0Z" fill="#67C23A"/>
            <path d="M243.5 471.6c-59.6 0-108.1-48.2-108.1-107.4s48.5-107.4 108.1-107.4c59.6 0 108.1 48.2 108.1 107.4s-48.5 107.4-108.1 107.4z m0-177.7c-39.1 0-70.9 31.5-70.9 70.2s31.8 70.2 70.9 70.2c39.1 0 70.9-31.5 70.9-70.2s-31.8-70.2-70.9-70.2zM795.7 471.6c-59.6 0-108.1-48.2-108.1-107.4s48.5-107.4 108.1-107.4S903.8 305 903.8 364.2s-48.5 107.4-108.1 107.4z m0-177.7c-39.1 0-70.9 31.5-70.9 70.2s31.8 70.2 70.9 70.2 70.9-31.5 70.9-70.2-31.8-70.2-70.9-70.2zM514.5 413.5c-89.6 0-162.5-72.4-162.5-161.3S424.9 90.9 514.5 90.9 677 163.3 677 252.2s-72.9 161.3-162.5 161.3z m0-285.5c-69.1 0-125.3 55.7-125.3 124.2s56.2 124.2 125.3 124.2 125.3-55.7 125.3-124.2S583.6 128 514.5 128zM734.3 780.1H294.7c-12.5 0-24.5-5.3-32.9-14.5-8.1-8.8-11.9-20.1-10.8-31.8 15.3-164.2 128.6-288 263.5-288s248.2 123.8 263.5 288c1.1 11.7-2.8 23-10.8 31.8-8.4 9.2-20.4 14.5-32.9 14.5zM514.5 483c-115.6 0-213 109.3-226.5 254.2-0.1 1.2 0.3 2.3 1.3 3.3 1.3 1.5 3.4 2.3 5.5 2.3h439.5c2.1 0 4.1-0.9 5.5-2.3 1-1 1.4-2.2 1.3-3.3C727.5 592.3 630.1 483 514.5 483z" fill="#409EFF"/>
            <path d="M293.5 699.6H116.3c-12.4 0-24.2-5.3-32.3-14.7-8.1-9.4-11.8-21.9-10-34.2 14.4-100.3 85.6-173.1 169.5-173.1 43.8 0 85.5 20.1 117.4 56.5l10.7 12.2-10.6 12.2c-29.9 34.5-52 78.4-64 127l-3.5 14.1z m-50-184.8c-65.2 0-120.9 59.4-132.7 141.2-0.3 2.3 0.7 3.9 1.3 4.6 1.1 1.2 2.5 1.8 4.2 1.8h148.4c12.4-42.8 32-82 57.4-115-22.9-21.2-50.4-32.6-78.6-32.6zM735.5 699.6l-3.5-14.1c-11.4-46.1-31.9-88.1-59.2-121.5l-9.6-11.7 9.4-11.8c32.6-40.6 76.3-63 123-63 42.8 0 83.8 19.1 115.4 53.9 30.4 33.5 50 79.1 55.3 128.5 1 9.8-2.2 19.7-9 27.2-7.1 7.9-17.2 12.4-27.8 12.4l-194 0.1z m-24.2-146.7c23.3 31.7 41.4 69 53.1 109.5h164.8c-9.5-84.3-66.7-147.6-133.5-147.6-30.9 0-60.4 13.4-84.4 38.1z" fill="#409EFF"/>
          </svg>
        </el-avatar>
      </div>
      
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown-menu">
          <div class="dropdown-header">
            <el-avatar :size="48" :src="userInfo.avatar">
              <svg class="admin-avatar-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M675 673.6c10.6 0 19.4-8.7 18.4-19-10.4-111.4-86.4-198-178.9-198s-168.6 86.6-178.9 198c-1 10.2 7.8 19 18.4 19h321z" fill="#67C23A"/>
                <path d="M409.4 301.6a105.1 104.3 0 1 0 210.2 0 105.1 104.3 0 1 0-210.2 0Z" fill="#67C23A"/>
                <path d="M243.5 471.6c-59.6 0-108.1-48.2-108.1-107.4s48.5-107.4 108.1-107.4c59.6 0 108.1 48.2 108.1 107.4s-48.5 107.4-108.1 107.4z m0-177.7c-39.1 0-70.9 31.5-70.9 70.2s31.8 70.2 70.9 70.2c39.1 0 70.9-31.5 70.9-70.2s-31.8-70.2-70.9-70.2zM795.7 471.6c-59.6 0-108.1-48.2-108.1-107.4s48.5-107.4 108.1-107.4S903.8 305 903.8 364.2s-48.5 107.4-108.1 107.4z m0-177.7c-39.1 0-70.9 31.5-70.9 70.2s31.8 70.2 70.9 70.2 70.9-31.5 70.9-70.2-31.8-70.2-70.9-70.2zM514.5 413.5c-89.6 0-162.5-72.4-162.5-161.3S424.9 90.9 514.5 90.9 677 163.3 677 252.2s-72.9 161.3-162.5 161.3z m0-285.5c-69.1 0-125.3 55.7-125.3 124.2s56.2 124.2 125.3 124.2 125.3-55.7 125.3-124.2S583.6 128 514.5 128zM734.3 780.1H294.7c-12.5 0-24.5-5.3-32.9-14.5-8.1-8.8-11.9-20.1-10.8-31.8 15.3-164.2 128.6-288 263.5-288s248.2 123.8 263.5 288c1.1 11.7-2.8 23-10.8 31.8-8.4 9.2-20.4 14.5-32.9 14.5zM514.5 483c-115.6 0-213 109.3-226.5 254.2-0.1 1.2 0.3 2.3 1.3 3.3 1.3 1.5 3.4 2.3 5.5 2.3h439.5c2.1 0 4.1-0.9 5.5-2.3 1-1 1.4-2.2 1.3-3.3C727.5 592.3 630.1 483 514.5 483z" fill="#409EFF"/>
                <path d="M293.5 699.6H116.3c-12.4 0-24.2-5.3-32.3-14.7-8.1-9.4-11.8-21.9-10-34.2 14.4-100.3 85.6-173.1 169.5-173.1 43.8 0 85.5 20.1 117.4 56.5l10.7 12.2-10.6 12.2c-29.9 34.5-52 78.4-64 127l-3.5 14.1z m-50-184.8c-65.2 0-120.9 59.4-132.7 141.2-0.3 2.3 0.7 3.9 1.3 4.6 1.1 1.2 2.5 1.8 4.2 1.8h148.4c12.4-42.8 32-82 57.4-115-22.9-21.2-50.4-32.6-78.6-32.6zM735.5 699.6l-3.5-14.1c-11.4-46.1-31.9-88.1-59.2-121.5l-9.6-11.7 9.4-11.8c32.6-40.6 76.3-63 123-63 42.8 0 83.8 19.1 115.4 53.9 30.4 33.5 50 79.1 55.3 128.5 1 9.8-2.2 19.7-9 27.2-7.1 7.9-17.2 12.4-27.8 12.4l-194 0.1z m-24.2-146.7c23.3 31.7 41.4 69 53.1 109.5h164.8c-9.5-84.3-66.7-147.6-133.5-147.6-30.9 0-60.4 13.4-84.4 38.1z" fill="#409EFF"/>
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

.user-info:hover .admin-avatar-icon path[fill="#67C23A"] {
  fill: #E6A23C;
}

.user-info:hover .admin-avatar-icon path[fill="#409EFF"] {
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