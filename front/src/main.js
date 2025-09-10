import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import env from '@/config/env'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/global.css'

// 创建Vue应用实例
const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化认证状态
const authStore = useAuthStore()
authStore.initAuth()

// 全局配置
app.config.globalProperties.$env = env

// 开发环境下的调试配置
if (env.isDev) {
  app.config.devtools = true
  console.log('🚀 开发环境启动')
  console.log('📡 后端服务地址:', env.backendUrl)
  console.log('🔧 环境配置:', env)
}

// 挂载应用
app.mount('#app')
