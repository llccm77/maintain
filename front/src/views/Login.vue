<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <!-- 登录表单卡片 -->
    <div class="login-card">
      <!-- 系统Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <el-icon size="48" color="#409eff">
            <House />
          </el-icon>
        </div>
        <h1 class="system-title">宿舍维修管理系统</h1>
        <p class="system-subtitle">智能化维修服务平台</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            size="large"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            <template v-if="!loading">
              <el-icon><Right /></el-icon>
              登录
            </template>
            <template v-else>
              登录中...
            </template>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        center
        show-icon
        :closable="false"
      />

      <!-- 页脚信息 -->
      <div class="login-footer">
        <p class="copyright">
          © 2025 宿舍维修管理系统 v1.0.0
        </p>
        <div class="features">
          <div class="feature-item">
            <el-icon><Tools /></el-icon>
            <span>智能派单</span>
          </div>
          <div class="feature-item">
            <el-icon><Clock /></el-icon>
            <span>实时追踪</span>
          </div>
          <div class="feature-item">
            <el-icon><Star /></el-icon>
            <span>服务评价</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores'
import { House, User, Lock, Right, Tools, Clock, Star } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref()

// 加载状态
const loading = ref(false)
const error = ref('')

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    loading.value = true
    error.value = ''
    
    // 调用登录API
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    // 记住用户选项
    if (loginForm.remember) {
      localStorage.setItem('remember_user', loginForm.username)
    } else {
      localStorage.removeItem('remember_user')
    }
    
    ElMessage.success('登录成功！')
    
    // 跳转到仪表盘
    router.push('/dashboard')
    
  } catch (err) {
    console.error('登录失败:', err)
    
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = '登录失败，请检查网络连接'
    }
  } finally {
    loading.value = false
  }
}

// 组件挂载后的初始化
onMounted(() => {
  // 如果已经登录，直接跳转到仪表盘
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
  
  // 记住的用户名
  const rememberedUser = localStorage.getItem('remember_user')
  if (rememberedUser) {
    loginForm.username = rememberedUser
    loginForm.remember = true
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 20px;
}

.system-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color-primary);
  margin-bottom: 8px;
  background: linear-gradient(135deg, #409eff, #6c5ce7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.system-subtitle {
  font-size: 14px;
  color: var(--text-color-secondary);
  font-weight: 400;
}

/* 登录表单 */
.login-form {
  margin-bottom: 30px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #6c5ce7);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

/* 登录页脚 */
.login-footer {
  text-align: center;
  border-top: 1px solid var(--border-color-lighter);
  padding-top: 20px;
}

.copyright {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-bottom: 16px;
}

.features {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-color-secondary);
}

.feature-item .el-icon {
  font-size: 16px;
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
    border-radius: 16px;
  }
  
  .system-title {
    font-size: 24px;
  }
  
  .floating-shape {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px 16px;
  }
  
  .system-title {
    font-size: 20px;
  }
  
  .features {
    flex-direction: column;
    gap: 8px;
  }
  
  .feature-item {
    flex-direction: row;
    gap: 8px;
  }
}
</style>