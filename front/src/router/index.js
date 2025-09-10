import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from '@/views/Login.vue'
import Layout from '@/components/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import DormitoryManagement from '@/views/DormitoryManagement.vue'
import RepairManagement from '@/views/RepairManagement.vue'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { 
          requiresAuth: true,
          title: '仪表盘'
        }
      },
      {
        path: 'dormitory',
        name: 'DormitoryManagement',
        component: DormitoryManagement,
        meta: { 
          requiresAuth: true,
          title: '宿舍管理'
        }
      },
      {
        path: 'repair',
        name: 'RepairManagement',
        component: RepairManagement,
        meta: { 
          requiresAuth: true,
          title: '报修工单管理'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { 
          requiresAuth: true,
          title: '系统设置'
        }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { 
          requiresAuth: true,
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 前后端分离架构
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 宿舍维修管理系统`
  }
  
  // 检查是否需要登录
  const requiresAuth = to.meta.requiresAuth
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  
  if (requiresAuth) {
    if (!token || !savedUser) {
      // 需要登录但未登录，跳转到登录页
      console.log('未找到访问令牌或用户信息，跳转到登录页')
      next('/login')
      return
    }
    
    // 验证token有效性（可选：调用后端验证）
    try {
      // 如果有token和用户信息，允许访问
      next()
    } catch (error) {
      console.log('token验证失败，跳转到登录页')
      // 清除无效的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      next('/login')
    }
  } else if (to.path === '/login' && token && savedUser) {
    // 已登录但访问登录页，跳转到仪表盘
    console.log('已登录，跳转到仪表盘')
    next('/dashboard')
  } else {
    // 允许访问
    next()
  }
})

export default router