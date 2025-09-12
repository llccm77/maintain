<template>
  <div class="login-container">
    <!-- 登录表单卡片 -->
    <div class="login-card">
      <!-- 系统Logo和标题 -->
      <div class="login-header">
        <div class="system-logo">
          <div class="logo-container">
            <div class="logo-bg">
              <div class="logo-icon-main">🏠</div>
            </div>
          </div>
        </div>
        <h1 class="system-title">宿舍维修管理系统</h1>
        <p class="system-subtitle">University Dormitory Maintenance System</p>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-dot"></div>
          <div class="decoration-line"></div>
        </div>
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
        <div class="quick-access">
          <div class="access-item">
            <div class="access-icon">🛠️</div>
            <span>智能派单</span>
          </div>
          <div class="access-item">
            <div class="access-icon">⏰</div>
            <span>实时追踪</span>
          </div>
          <div class="access-item">
            <div class="access-icon">⭐</div>
            <span>服务评价</span>
          </div>
        </div>
        <p class="copyright">
          © 2025 University Dormitory Management System v1.0.0
        </p>
        <p class="powered-by">
          Powered by Smart Campus Technology
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores'
import { House, User, Lock, Right } from '@element-plus/icons-vue'

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
  background: url('@/assets/images/fdf455c9b0aa5ca55656024e88b7008f.jpg') center 60%/cover no-repeat;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

/* 校园背景装饰 */
.campus-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

/* 校园建筑轮廓 */
.building-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  opacity: 0.1;
}

.building {
  background: rgba(255, 255, 255, 0.8);
  position: relative;
}

.building-1 {
  width: 80px;
  height: 120px;
  border-radius: 8px 8px 0 0;
}

.building-2 {
  width: 60px;
  height: 100px;
  border-radius: 4px 4px 0 0;
}

.building-3 {
  width: 90px;
  height: 140px;
  border-radius: 12px 12px 0 0;
}

.building-4 {
  width: 70px;
  height: 110px;
  border-radius: 6px 6px 0 0;
}

.building-5 {
  width: 85px;
  height: 130px;
  border-radius: 10px 10px 0 0;
}

/* 漂浮学术元素 */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.academic-icon {
  position: absolute;
  font-size: 24px;
  opacity: 0.05;
  animation: academicFloat 8s ease-in-out infinite;
}

.book-icon {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.graduation-cap {
  top: 25%;
  right: 15%;
  animation-delay: 2s;
}

.lightbulb {
  top: 60%;
  left: 20%;
  animation-delay: 4s;
}

.pencil {
  top: 70%;
  right: 25%;
  animation-delay: 6s;
}

.atom {
  top: 40%;
  left: 60%;
  animation-delay: 1s;
}

@keyframes academicFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

/* 几何装饰 */
.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  animation: shapeFloat 10s ease-in-out infinite;
}

.hexagon {
  width: 60px;
  height: 60px;
  clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 43px solid rgba(255, 255, 255, 0.05);
  background: transparent;
  top: 80%;
  left: 15%;
  animation-delay: 3s;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: 50%;
  right: 30%;
  animation-delay: 5s;
}

@keyframes shapeFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 左侧校园信息面板 */
.campus-info-panel {
  position: fixed;
  left: 0;
  top: 0;
  width: 350px;
  height: 100vh;
  background: rgba(44, 62, 80, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px 30px;
  color: white;
  z-index: 4;
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.login-container:hover .campus-info-panel {
  transform: translateX(0);
}

.university-logo {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.logo-icon {
  font-size: 32px;
}

.university-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.university-motto {
  font-size: 14px;
  opacity: 0.8;
  font-style: italic;
}

.campus-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #3498db;
}

.feature-card p {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  padding: 50px 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 3;
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.system-logo {
  margin-bottom: 20px;
}

.logo-container {
  display: inline-block;
  position: relative;
}

.logo-bg {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: logoShine 3s ease-in-out infinite;
}

@keyframes logoShine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
}

.logo-icon-main {
  font-size: 36px;
  position: relative;
  z-index: 1;
}

.system-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.system-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.decoration-line {
  width: 30px;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1px;
}

.decoration-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
}

/* 登录表单 */
.login-form {
  margin-bottom: 30px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  background: rgba(248, 249, 250, 0.8);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
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
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 登录页脚 */
.login-footer {
  text-align: center;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  padding-top: 25px;
  margin-top: 20px;
}

.quick-access {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
}

.access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #7f8c8d;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
}

.access-item:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
}

.access-icon {
  font-size: 18px;
  filter: grayscale(0.3);
  transition: filter 0.3s ease;
}

.access-item:hover .access-icon {
  filter: grayscale(0);
}

.copyright {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 8px;
  font-weight: 500;
}

.powered-by {
  font-size: 11px;
  color: #bdc3c7;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    padding: 35px 25px;
    border-radius: 20px;
    max-width: 100%;
  }
  
  .system-title {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 25px 20px;
    border-radius: 16px;
  }
  
  .system-title {
    font-size: 22px;
  }
  
  .quick-access {
    flex-direction: column;
    gap: 12px;
  }
  
  .access-item {
    flex-direction: row;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(44, 62, 80, 0.95);
    color: #ecf0f1;
  }
  
  .system-title {
    color: #ecf0f1;
  }
  
  .system-subtitle {
    color: #bdc3c7;
  }
  
  .copyright {
    color: #7f8c8d;
  }
  
  .powered-by {
    color: #95a5a6;
  }
}
</style>