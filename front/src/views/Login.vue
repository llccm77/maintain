<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="background-decorations">
      <div class="floating-element element-1">🏠</div>
      <div class="floating-element element-2">🔧</div>
      <div class="floating-element element-3">💡</div>
      <div class="floating-element element-4">🛠️</div>
      <div class="floating-element element-5">🏡</div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <!-- 手绘风格的宿舍图标 -->
        <div class="dorm-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <!-- 宿舍楼主体 -->
            <rect x="15" y="35" width="50" height="35" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="2" rx="3"/>
            <!-- 屋顶 -->
            <polygon points="10,35 40,15 70,35" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="2"/>
            <!-- 窗户 -->
            <rect x="22" y="42" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
            <rect x="36" y="42" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
            <rect x="50" y="42" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
            <rect x="22" y="55" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
            <rect x="50" y="55" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
            <!-- 门 -->
            <rect x="36" y="55" width="8" height="15" fill="#DEB887" stroke="#CD853F" stroke-width="1" rx="1"/>
            <circle cx="42" cy="62" r="1" fill="#CD853F"/>
            <!-- 烟囱 -->
            <rect x="55" y="20" width="4" height="15" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="1"/>
            <!-- 爱心装饰 -->
            <path d="M25 25 C25 22, 30 22, 30 25 C30 22, 35 22, 35 25 C35 28, 30 32, 30 32 C30 32, 25 28, 25 25 Z" fill="#FFB6C1"/>
          </svg>
        </div>
        <h1 class="system-title">宿舍小管家</h1>
        <p class="system-subtitle">让宿舍生活更美好 ✨</p>
        <p class="welcome-message">嗨！欢迎回到温馨的小窝～</p>
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
              placeholder="输入你的学号或手机号呀～"
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
              placeholder="悄悄告诉我密码～"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="loginForm.remember">
              <span class="checkbox-text">下次自动登录 💝</span>
            </el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-link">
              <span>忘记密码了？🤔</span>
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
                进入我的小窝 🏠
              </span>
            </template>
            <template v-else>
              <span class="loading-text">正在为你开门中... ✨</span>
            </template>
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="error" class="error-message">
        <div class="error-icon">😅</div>
        <p class="error-text">{{ getErrorMessage(error) }}</p>
      </div>
      
      <!-- 底部温馨提示 -->
      <div class="login-footer">
        <div class="tips">
          <div class="tip-item">
            <span class="tip-icon">💡</span>
            <span class="tip-text">遇到问题？联系宿管阿姨哦～</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🌟</span>
            <span class="tip-text">让我们一起创造美好的宿舍生活</span>
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
    { required: true, message: '别忘了告诉我你是谁呀～', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名要在 3 到 20 个字符之间哦～', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空呢～', trigger: 'blur' },
    { min: 6, message: '密码至少要 6 个字符，安全第一！', trigger: 'blur' }
  ]
}

const getErrorMessage = (error) => {
  const errorMessages = {
    '用户名或密码错误': '哎呀，用户名或密码好像不对呢～再试试？',
    '网络连接失败': '网络好像有点小脾气，稍后再试试吧～',
    '服务器错误': '服务器小哥哥在休息，请稍后再来～',
    '登录失败': '登录遇到了小问题，不要着急哦～'
  }
  return errorMessages[error] || '出了点小状况，但没关系，我们一起解决～'
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
    
    ElMessage.success('欢迎回家！🏠')
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
  justify-content: center;
  background: linear-gradient(135deg, #FFE5CC 0%, #FFD3A5 25%, #FFC3A0 50%, #FF9A8B 75%, #A8E6CF 100%);
  padding: 20px;
  font-family: 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
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

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.element-3 {
  bottom: 30%;
  left: 8%;
  animation-delay: 2s;
}

.element-4 {
  bottom: 15%;
  right: 20%;
  animation-delay: 3s;
}

.element-5 {
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(255, 154, 139, 0.2), 0 8px 32px rgba(168, 230, 207, 0.15);
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 211, 165, 0.3);
  position: relative;
  z-index: 2;
  animation: cardSlideIn 0.8s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
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
  font-size: 28px;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(255, 107, 107, 0.1);
}

.system-subtitle {
  font-size: 16px;
  color: #FF9A8B;
  margin-bottom: 8px;
  font-weight: 500;
}

.welcome-message {
  font-size: 14px;
  color: #A8E6CF;
  margin-bottom: 0;
  font-weight: 400;
}

.login-form {
  margin-bottom: 24px;
  width: 100%;
  padding: 0 24px;
  max-width: 400px;
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
  border: 2px solid #FFE5CC;
  background: rgba(255, 229, 204, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 229, 204, 0.2);
  min-height: 56px;
  width: 100%;
}

.input-wrapper :deep(.el-input__wrapper:hover) {
  border-color: #FFD3A5;
  background: rgba(255, 211, 165, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 211, 165, 0.3);
}

.input-wrapper :deep(.el-input__wrapper.is-focus) {
  border-color: #FF9A8B;
  background: rgba(255, 154, 139, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 154, 139, 0.1);
}

.input-wrapper :deep(.el-input__inner) {
  color: #FF6B6B;
  font-weight: 500;
  padding: 0;
  height: auto;
  font-size: 16px;
  line-height: 1.5;
}

.input-wrapper :deep(.el-input__inner::placeholder) {
  color: #FFB6C1;
  font-weight: 400;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}

.checkbox-text {
  color: #FF9A8B;
  font-weight: 500;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
}

.forgot-link :deep(.el-link__inner) {
  color: #A8E6CF !important;
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 16px;
  background: linear-gradient(135deg, #FF9A8B 0%, #A8E6CF 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(255, 154, 139, 0.3);
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 154, 139, 0.4);
  background: linear-gradient(135deg, #FF8A80 0%, #98E4D6 100%);
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
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid rgba(255, 229, 204, 0.5);
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #FF9A8B;
  font-weight: 400;
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