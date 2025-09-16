<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="background-decorations">
      <div class="floating-element element-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="#64748b" stroke-width="1.5" fill="none"/>
          <path d="M8 8h8M8 12h8M8 16h4" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="floating-element element-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L8.7 9.5C8.3 9.9 8.3 10.5 8.7 10.9L13.3 15.5C13.7 15.9 14.3 15.9 14.7 15.5C15.1 15.1 15.1 14.5 14.7 14.1L11.4 10.8H20C20.6 10.8 21 10.4 21 9.8C21 9.2 20.6 8.8 20 8.8H11.4L14.7 6.3Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="floating-element element-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="#64748b" stroke-width="1.5"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="#64748b" stroke-width="1.5"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="#64748b" stroke-width="1.5"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#64748b" stroke-width="1.5"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#64748b" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="floating-element element-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L8.7 9.5C8.3 9.9 8.3 10.5 8.7 10.9L13.3 15.5C13.7 15.9 14.3 15.9 14.7 15.5C15.1 15.1 15.1 14.5 14.7 14.1L11.4 10.8H20C20.6 10.8 21 10.4 21 9.8C21 9.2 20.6 8.8 20 8.8H11.4L14.7 6.3Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="floating-element element-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#64748b" stroke-width="1.5" fill="none"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#64748b"/>
          <polyline points="21,15 16,10 5,21" stroke="#64748b" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <!-- 手绘风格的宿舍图标 -->
        <div class="dorm-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="48" height="48" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/>
            <rect x="16" y="16" width="32" height="32" rx="4" fill="none" stroke="#64748b" stroke-width="1.5"/>
            <circle cx="32" cy="28" r="6" fill="none" stroke="#64748b" stroke-width="1.5"/>
            <path d="M20 44h24" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M24 40h16" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="system-title">宿舍管理系统</h1>
        <p class="system-subtitle">智能化宿舍服务平台</p>
        <p class="welcome-message">欢迎使用宿舍管理系统</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <div class="input-wrapper">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <!-- 手绘风格的用户图标 -->
                <circle cx="10" cy="7" r="3" fill="none" stroke="#A8E6CF" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 18c0-4 2.5-6 6-6s6 2 6 6" fill="none" stroke="#A8E6CF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <el-input
              v-model="loginForm.username"
              size="large"
              placeholder="请输入学号或手机号"
              clearable
              @keyup.enter="handleLogin"
            />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-wrapper">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <!-- 手绘风格的锁图标 -->
                <rect x="6" y="9" width="8" height="7" fill="none" stroke="#FFD3A5" stroke-width="2" rx="1" stroke-linecap="round"/>
                <path d="M8 9V6a2 2 0 0 1 4 0v3" fill="none" stroke="#FFD3A5" stroke-width="2" stroke-linecap="round"/>
                <circle cx="10" cy="13" r="1" fill="#FFD3A5"/>
              </svg>
            </div>
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              placeholder="请输入密码"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="loginForm.remember">
              <span class="checkbox-text">记住登录状态</span>
            </el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-link">
              <span>忘记密码？</span>
            </el-link>
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
              <span class="button-content">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="button-icon">
              <path d="M8 1l6 7H9v7H7V8H2l6-7z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"/>
            </svg>
                登录系统
              </span>
            </template>
            <template v-else>
              <span class="loading-text">正在登录...</span>
            </template>
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="error" class="error-message">
        <div class="error-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" stroke="#E74C3C" stroke-width="1.5" fill="none"/>
            <line x1="10" y1="6" x2="10" y2="10" stroke="#E74C3C" stroke-width="1.5"/>
            <line x1="10" y1="14" x2="10.01" y2="14" stroke="#E74C3C" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="error-text">{{ getErrorMessage(error) }}</p>
      </div>
      
      <!-- 底部温馨提示 -->
      <div class="login-footer">
        <div class="tips">
          <div class="tip-item">
            <span class="tip-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6" stroke="#64748b" stroke-width="1.5" fill="none"/>
              <path d="M8 5v3M8 11h.01" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            </span>
            <span class="tip-text">遇到问题？请联系管理员</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L10.5 5.5L15 6L11.5 9.5L12.5 14L8 11.5L3.5 14L4.5 9.5L1 6L5.5 5.5L8 1Z" stroke="#64748b" stroke-width="1.5" fill="none"/>
            </svg>
            </span>
            <span class="tip-text">致力于提供优质的宿舍管理服务</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧信息展示区域 -->
    <div class="info-panel">
      <div class="info-content">
        <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zM296 136h432c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H296c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8zm432 752H296c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h432c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8zM296 424h432c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H296c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8zm0 144h432c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H296c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8z" fill="#ffffff"/>
                <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z" fill="#ffffff" opacity="0.8"/>
              </svg>
            </div>
            <h3>在线报修</h3>
            <p>快速提交宿舍设施报修申请，专业维修团队及时响应</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="#ffffff"/>
              </svg>
            </div>
            <h3>进度跟踪</h3>
            <p>实时查看报修进度，维修状态一目了然</p>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#ffffff"/>
                <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l188.4 138.9c3.6 2.7 8.8 1.9 11.4-1.6l17.8-24.3c2.7-3.7 1.9-8.9-1.6-11.4z" fill="#ffffff"/>
              </svg>
            </div>
            <h3>24小时服务</h3>
            <p>全天候在线服务，紧急情况快速处理</p>
          </div>
        
        <div class="slogan">
          <h2>让宿舍生活更美好</h2>
          <p>智能化管理 · 贴心服务 · 安全可靠</p>
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
import { User, Lock, Right } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref()
const loading = ref(false)
const error = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ]
}

const getErrorMessage = (error) => {
  const errorMessages = {
    '用户名或密码错误': '用户名或密码错误，请重新输入',
    '网络连接失败': '网络连接失败，请检查网络后重试',
    '服务器错误': '服务器暂时无法响应，请稍后重试',
    '登录失败': '登录失败，请检查输入信息'
  }
  return errorMessages[error] || '系统异常，请稍后重试'
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    error.value = ''
    
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    if (loginForm.remember) {
      localStorage.setItem('remember_user', loginForm.username)
    } else {
      localStorage.removeItem('remember_user')
    }
    
    ElMessage.success('登录成功')
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

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
  
  const rememberedUser = localStorage.getItem('remember_user')
  if (rememberedUser) {
    loginForm.username = rememberedUser
    loginForm.remember = true
  }
})
</script>

<style scoped>
/* 导入可爱字体 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: url('@/assets/1.png') center/cover no-repeat;
  padding: 20px;
  padding-left: 3%;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* 背景装饰元素 */
.background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 右侧信息面板 */
.info-panel {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 360px;
  z-index: 2;
  color: white;
  animation: slideInRight 1s ease-out 0.5s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.info-content {
  padding: 24px;
}

.feature-item {
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}

.feature-item:hover {
  transform: translateX(-8px);
  filter: brightness(1.1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.feature-item:hover .feature-icon::before {
  opacity: 1;
  transform: rotate(45deg) translate(50%, 50%);
}

.feature-item:hover .feature-icon {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.feature-item h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.feature-item:hover h3 {
  color: #60a5fa;
}

.feature-item p {
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  font-weight: 400;
}

.slogan {
  margin-top: 48px;
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border-radius: 24px;
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.slogan::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.8s ease;
}

.slogan:hover::before {
  left: 100%;
}

.slogan:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 80px rgba(59, 130, 246, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.slogan h2 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #ffffff;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.slogan p {
  font-size: 17px;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
  font-weight: 500;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  color: #8892b0;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  top: 25%;
  right: 15%;
  animation-delay: 1.5s;
}

.element-3 {
  top: 65%;
  left: 8%;
  animation-delay: 3s;
}

.element-4 {
  bottom: 25%;
  right: 12%;
  animation-delay: 4.5s;
}

.element-5 {
  bottom: 15%;
  left: 18%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.15;
  }
  50% {
    transform: translateY(-15px) rotate(3deg);
    opacity: 0.08;
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  animation: cardSlideIn 0.8s ease-out;
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.dorm-icon {
  margin-bottom: 16px;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.system-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
  text-shadow: none;
  letter-spacing: -0.025em;
}

.system-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 400;
}

.welcome-message {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 0;
  font-weight: 400;
}

.login-form {
  margin-bottom: 20px;
  width: 100%;
  padding: 0 20px;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
}

.login-form .el-form-item:last-child {
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.input-wrapper :deep(.el-input__wrapper) {
  padding-left: 50px;
  padding-right: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 20px;
  border: 2px solid #e5e7eb;
  background: rgba(249, 250, 251, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.1);
  min-height: 56px;
  width: 100%;
}

.input-wrapper :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(156, 163, 175, 0.15);
}

.input-wrapper :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper :deep(.el-input__inner) {
  color: #374151;
  font-weight: 500;
  padding: 0;
  height: auto;
  font-size: 16px;
  line-height: 1.5;
}

.input-wrapper :deep(.el-input__inner::placeholder) {
  color: #9ca3af;
  font-weight: 400;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 16px 0;
}

.checkbox-text {
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
}

.forgot-link :deep(.el-link__inner) {
  color: #3b82f6 !important;
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-icon {
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.loading-text {
  animation: textShimmer 1.5s ease-in-out infinite;
}

@keyframes textShimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.error-message {
  background: rgba(255, 182, 193, 0.2);
  border: 2px solid #FFB6C1;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
  text-align: center;
  animation: errorShake 0.5s ease-in-out;
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.error-text {
  color: #FF6B6B;
  font-weight: 500;
  margin: 0;
}

.login-footer {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%);
  border-radius: 12px;
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
  margin-bottom: 12px;
  line-height: 1.6;
}

.tip-item:last-child {
  margin-bottom: 0;
  color: #94a3b8;
  font-style: italic;
}

.tip-icon {
  font-size: 16px;
}

.tip-text {
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 10px;
  }
  
  .system-title {
    font-size: 24px;
  }
  
  .system-subtitle {
    font-size: 14px;
  }
  
  .welcome-message {
    font-size: 12px;
  }
  
  .floating-element {
    font-size: 1.5rem;
  }
  
  .tips {
    gap: 8px;
  }
  
  .tip-item {
    font-size: 12px;
  }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-checkbox__label) {
  color: #FF9A8B !important;
  font-weight: 500;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #A8E6CF !important;
  border-color: #A8E6CF !important;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #A8E6CF !important;
}

:deep(.el-form-item__error) {
  color: #E74C3C !important;
  font-weight: 600;
  font-size: 13px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  padding: 8px 16px;
  border-radius: 12px;
  margin-top: 8px;
  margin-left: 0;
  margin-right: 0;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.1);
  position: static;
  display: block;
  text-align: left;
  width: 100%;
}

:deep(.el-form-item__error):before {
  content: '⚠️ ';
  margin-right: 4px;
}

/* 确保错误提示显示在正确位置 */
:deep(.el-form-item__content) {
  position: relative;
  display: flex;
  flex-direction: column;
}

:deep(.el-form-item.is-error) {
  margin-bottom: 32px;
}

/* 确保表单项有足够的间距 */
:deep(.el-form-item) {
  margin-bottom: 28px;
}

:deep(.el-form-item:first-child) {
  margin-top: 8px;
}

/* 优化输入框在错误状态下的样式 */
:deep(.el-form-item.is-error .el-input__wrapper) {
  border-color: #E74C3C !important;
  box-shadow: 0 0 0 1px rgba(231, 76, 60, 0.2) !important;
}

:deep(.el-form-item.is-error .el-input__wrapper):hover {
  border-color: #E74C3C !important;
}

:deep(.el-form-item.is-error .el-input__wrapper.is-focus) {
  border-color: #E74C3C !important;
  box-shadow: 0 0 0 1px rgba(231, 76, 60, 0.3) !important;
}
</style>