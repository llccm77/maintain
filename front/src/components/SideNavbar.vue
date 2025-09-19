<template>
  <div class="side-navbar" :class="{ 'collapsed': isCollapsed }">
    <!-- 折叠/展开按钮 -->
    <div class="collapse-toggle">
      <el-button 
        @click="toggleCollapse" 
        class="toggle-btn"
        :icon="isCollapsed ? Expand : Fold"
        circle
        size="small"
      />
    </div>

    <!-- 导航菜单 -->
    <div class="nav-content">
      <el-menu
        :default-active="currentRoute"
        :collapse="isCollapsed"
        :unique-opened="true"
        class="side-menu"
        @select="handleMenuSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="/dashboard">
          <el-tooltip :content="isCollapsed ? '首页' : ''" placement="right" :disabled="!isCollapsed">
            <el-icon><Monitor /></el-icon>
          </el-tooltip>
          <template #title v-if="!isCollapsed">首页</template>
        </el-menu-item>

        <!-- 报修管理 -->
        <el-sub-menu index="repair-management" v-if="!isCollapsed">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>报修管理</span>
          </template>
          <el-menu-item index="/repair/records">
            <el-icon><List /></el-icon>
            <template #title>报修记录</template>
          </el-menu-item>
          <el-menu-item index="/repair/create">
            <el-icon><Plus /></el-icon>
            <template #title>新建报修</template>
          </el-menu-item>
          <el-menu-item index="/repair/status">
            <el-icon><Clock /></el-icon>
            <template #title>工单状态</template>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 折叠状态下的报修管理 -->
        <el-menu-item index="/repair/records" v-else>
          <el-tooltip content="报修管理" placement="right">
            <el-icon><Tools /></el-icon>
          </el-tooltip>
        </el-menu-item>

        <!-- 宿舍管理 -->
        <el-sub-menu index="dormitory-management" v-if="!isCollapsed">
          <template #title>
            <el-icon><House /></el-icon>
            <span>宿舍管理</span>
          </template>
          <el-menu-item index="/dormitory">
            <el-icon><View /></el-icon>
            <template #title>宿舍信息</template>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 折叠状态下的宿舍管理 -->
        <el-menu-item index="/dormitory" v-else>
          <el-tooltip content="宿舍管理" placement="right">
            <el-icon><House /></el-icon>
          </el-tooltip>
        </el-menu-item>

        <!-- AI维修小助手 -->
        <el-menu-item index="/ai-assistant">
          <el-tooltip :content="isCollapsed ? 'AI维修小助手' : ''" placement="right" :disabled="!isCollapsed">
            <el-icon><ChatDotRound /></el-icon>
          </el-tooltip>
          <template #title v-if="!isCollapsed">AI维修小助手</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 维修工人插画区域 -->
    <div class="sidebar-illustration" v-if="!isCollapsed">
      <div class="illustration-container">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 宿舍楼轮廓 -->
          <rect x="20" y="30" width="60" height="50" stroke="#6c757d" stroke-width="2" fill="none" rx="2"/>
          <rect x="25" y="35" width="8" height="8" stroke="#6c757d" stroke-width="1.5" fill="none"/>
          <rect x="37" y="35" width="8" height="8" stroke="#6c757d" stroke-width="1.5" fill="none"/>
          <rect x="55" y="35" width="8" height="8" stroke="#6c757d" stroke-width="1.5" fill="none"/>
          <rect x="67" y="35" width="8" height="8" stroke="#6c757d" stroke-width="1.5" fill="none"/>
          
          <!-- 宿舍门 -->
          <rect x="45" y="60" width="10" height="20" stroke="#6c757d" stroke-width="2" fill="none"/>
          <circle cx="52" cy="68" r="1" fill="#6c757d"/>
          
          <!-- 维修工具图标 -->
          <!-- 扳手 -->
          <g transform="translate(15,15)">
            <path d="M2 8 L8 2 L10 4 L4 10 Z" stroke="#4a90e2" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="3" cy="9" r="1.5" stroke="#4a90e2" stroke-width="1.5" fill="none"/>
          </g>
          
          <!-- 螺丝刀 -->
          <g transform="translate(75,15)">
            <line x1="2" y1="8" x2="8" y2="2" stroke="#f39c12" stroke-width="2" stroke-linecap="round"/>
            <rect x="7" y="1" width="3" height="3" stroke="#95a5a6" stroke-width="1.5" fill="none"/>
          </g>
          
          <!-- 维修状态指示 -->
          <circle cx="50" cy="20" r="8" stroke="#27ae60" stroke-width="2" fill="none"/>
          <path d="M46 20 L49 23 L54 18" stroke="#27ae60" stroke-width="2" fill="none" stroke-linecap="round"/>
          
          <!-- 简单装饰线条 -->
          <line x1="10" y1="85" x2="90" y2="85" stroke="#e9ecef" stroke-width="1"/>
          <circle cx="30" cy="85" r="2" fill="#e9ecef"/>
          <circle cx="70" cy="85" r="2" fill="#e9ecef"/>
        </svg>
        
        <div class="illustration-text">
           <h4>宿舍报修</h4>
           <p>快速便捷的维修服务</p>
         </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Tools, House, ChatDotRound, List, Plus, Clock, View, Switch, Grid,
  Expand, Fold, Monitor
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const isCollapsed = ref(false)

// 计算属性
const currentRoute = computed(() => route.path)

// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleMenuSelect = (index) => {
  router.push(index)
}


</script>

<style scoped>
.side-navbar {
  width: 240px;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px); /* 减去顶部导航栏高度 */
  position: fixed;
  left: 0;
  top: 64px;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.side-navbar.collapsed {
  width: 64px;
}

/* 折叠按钮 */
.collapse-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.toggle-btn {
  background: #ffffff;
  border: 1px solid #dee2e6;
  color: #6c757d;
}

.toggle-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

/* 导航内容 */
.nav-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.side-menu {
  border: none;
  background: transparent;
}

.side-menu .el-menu-item,
.side-menu .el-sub-menu {
  margin: 2px 8px;
  border-radius: 8px;
  overflow: hidden;
}

.side-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  color: #495057;
  transition: all 0.3s ease;
  font-weight: 500;
}

.side-menu .el-menu-item:hover {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.side-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  color: #ffffff;
}

.side-menu .el-sub-menu .el-sub-menu__title {
  height: 48px;
  line-height: 48px;
  color: #495057;
  font-weight: 600;
}

.side-menu .el-sub-menu .el-sub-menu__title:hover {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.side-menu .el-sub-menu .el-menu-item {
  height: 40px;
  line-height: 40px;
  margin: 1px 4px;
  font-size: 14px;
}

/* 底部区域 */
.nav-footer {
  padding: 16px;
  border-top: 1px solid #dee2e6;
  background: rgba(255, 255, 255, 0.5);
}

.quick-actions {
  display: flex;
  justify-content: center;
}

.quick-repair-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  transition: all 0.3s ease;
  width: 100%;
}

.quick-repair-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.collapsed .quick-repair-btn {
  width: 36px;
  height: 36px;
}

/* 图标样式 */
.side-menu .el-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.collapsed .side-menu .el-icon {
  margin-right: 0;
}

/* 工具提示样式 */
.el-tooltip__popper {
  background: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  padding: 8px 12px;
}

/* 滚动条样式 */
.nav-content::-webkit-scrollbar {
  width: 4px;
}

.nav-content::-webkit-scrollbar-track {
  background: transparent;
}

.nav-content::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 2px;
}

.nav-content::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* 插画区域样式 */
.sidebar-illustration {
  margin-top: auto;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration-container {
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.illustration-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.illustration-container svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 10px auto;
}

.illustration-text {
  margin-top: 8px;
}

.illustration-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.illustration-text p {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.illustration-text {
  color: #495057;
}

.illustration-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.illustration-text p {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .side-navbar {
    transform: translateX(-100%);
  }
  
  .side-navbar.mobile-open {
    transform: translateX(0);
  }
  
  .sidebar-illustration {
    padding: 12px;
  }
  
  .illustration-container svg {
    width: 120px;
  }
  
  .illustration-text h4 {
    font-size: 13px;
  }
  
  .illustration-text p {
    font-size: 11px;
  }
}
</style>