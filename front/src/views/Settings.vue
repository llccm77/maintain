<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>系统设置</h1>
    </div>

    <div class="settings-container">
      <div class="settings-card">
        <div class="card-header">
          <h3>🔧 基本设置</h3>
        </div>
        <div class="card-content">
          <div class="setting-item">
            <label>系统名称</label>
            <input v-model="settings.systemName" type="text" placeholder="宿舍维修管理系统" />
          </div>
          <div class="setting-item">
            <label>联系邮箱</label>
            <input v-model="settings.contactEmail" type="email" placeholder="admin@example.com" />
          </div>
          <div class="setting-item">
            <label>系统公告</label>
            <textarea v-model="settings.announcement" placeholder="系统公告内容..."></textarea>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <h3>🔔 通知设置</h3>
        </div>
        <div class="card-content">
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="settings.emailNotification" type="checkbox" />
              <span>启用邮件通知</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="settings.smsNotification" type="checkbox" />
              <span>启用短信通知</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="settings.pushNotification" type="checkbox" />
              <span>启用推送通知</span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <h3>⚙️ 工单设置</h3>
        </div>
        <div class="card-content">
          <div class="setting-item">
            <label>工单自动编号前缀</label>
            <input v-model="settings.orderPrefix" type="text" placeholder="R" />
          </div>
          <div class="setting-item">
            <label>工单超时提醒时间（小时）</label>
            <input v-model="settings.timeoutHours" type="number" min="1" max="168" />
          </div>
          <div class="setting-item">
            <label class="checkbox-label">
              <input v-model="settings.autoAssign" type="checkbox" />
              <span>启用自动分配</span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-actions">
        <button @click="saveSettings" class="save-btn" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
        <button @click="resetSettings" class="reset-btn">
          重置设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据
const saving = ref(false)

// 设置数据
const settings = reactive({
  systemName: '宿舍维修管理系统',
  contactEmail: 'admin@example.com',
  announcement: '欢迎使用宿舍维修管理系统！',
  emailNotification: true,
  smsNotification: false,
  pushNotification: true,
  orderPrefix: 'R',
  timeoutHours: 24,
  autoAssign: false
})

// 默认设置备份
const defaultSettings = { ...settings }

// 保存设置
const saveSettings = async () => {
  try {
    saving.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存到localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settings))
    
    alert('设置保存成功！')
  } catch (error) {
    console.error('保存设置失败:', error)
    alert('保存设置失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

// 重置设置
const resetSettings = () => {
  if (confirm('确定要重置所有设置到默认值吗？')) {
    Object.assign(settings, defaultSettings)
  }
}

// 加载设置
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('systemSettings')
    if (savedSettings) {
      Object.assign(settings, JSON.parse(savedSettings))
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin: 0;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  padding: 20px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.setting-item input,
.setting-item textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.setting-item input:focus,
.setting-item textarea:focus {
  outline: none;
  border-color: #667eea;
}

.setting-item textarea {
  height: 80px;
  resize: vertical;
}

.settings-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn,
.reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.reset-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e1e5e9;
}

.reset-btn:hover {
  background: #e9ecef;
  color: #495057;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .settings-actions {
    flex-direction: column;
  }
  
  .save-btn,
  .reset-btn {
    width: 100%;
  }
}
</style>