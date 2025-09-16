<template>
  <div class="cozy-dashboard">
    <!-- 英雄区域：快速行动与个性化欢迎 -->
    <div class="hero-section">
      <div class="hero-background">
        <!-- 背景装饰元素 -->
        <div class="bg-decoration">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </div>
      
      <div class="hero-content">
        <!-- 左侧：动态欢迎语和核心操作 -->
        <div class="hero-left">
          <div class="dynamic-greeting">
            <h1 class="hero-title">
              <span class="greeting-text">{{ getGreeting() }}，</span>
              <span class="user-name">{{ getCurrentUserName() }}</span>
            </h1>
            <p class="hero-subtitle">宿舍小管家，让生活更美好 ✨</p>
          </div>
          
          <!-- 核心操作按钮 -->
          <div class="hero-actions">
            <el-button 
              type="primary" 
              size="large" 
              @click="quickCreateOrder" 
              class="primary-action-btn"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" class="btn-icon">
                <path d="M15 7h-3V4a1 1 0 0 0-2 0v3H7a1 1 0 0 0 0 2h3v3a1 1 0 0 0 2 0v-3h3a1 1 0 0 0 0-2z" fill="currentColor"/>
                <path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              发起报修
            </el-button>
            
            <el-button 
              @click="navigateTo('/repair/records')" 
              size="large" 
              class="secondary-action-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" class="btn-icon">
                <path d="M3 6h12M3 10h12M3 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              查看记录
            </el-button>
          </div>
        </div>
        
        <!-- 右侧：关键数据速览 -->
        <div class="hero-right">
          <div class="key-metrics">
            <div class="metric-item pending" v-if="statistics.pendingOrders > 0">
              <div class="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-number">{{ statistics.pendingOrders }}</div>
                <div class="metric-label">个待处理工单</div>
              </div>
            </div>
            
            <div class="metric-item processing" v-if="statistics.processingOrders > 0">
              <div class="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-number">{{ statistics.processingOrders }}</div>
                <div class="metric-label">个正在维修中</div>
              </div>
            </div>
            
            <div class="metric-item completed">
              <div class="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-number">{{ statistics.completedOrders }}</div>
                <div class="metric-label">个已完成</div>
              </div>
            </div>
          </div>
          
          <!-- 最新动态快报 -->
          <div class="latest-updates">
            <div class="updates-header">
              <svg width="16" height="16" viewBox="0 0 16 16" class="updates-icon">
                <path d="M8 2a6 6 0 0 1 6 6c0 7-6 8-6 8s-6-1-6-8a6 6 0 0 1 6-6z" fill="currentColor"/>
                <path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="white"/>
              </svg>
              <span>最新动态</span>
            </div>
            <div class="updates-content">
              <div class="update-item" v-if="latestUpdate">
                {{ latestUpdate }}
              </div>
              <div class="update-item" v-else>
                暂无最新动态，一切运行正常 ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 独立时间轴区域 -->
    <div class="timeline-full-section">
      <div class="timeline-wrapper">
        <div class="section-header">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 20 20" class="title-icon">
              <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M7 8h6M7 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            我的报修历程
          </h3>
          <button @click="navigateTo('/repair/records')" class="view-all-btn">
            <span>查看全部</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="timeline-container">
          <div v-if="recentOrders.length === 0" class="timeline-empty">
            <div class="empty-illustration">
              <svg width="64" height="64" viewBox="0 0 64 64" class="empty-icon">
                <circle cx="32" cy="32" r="24" fill="none" stroke="#e0e6ed" stroke-width="2"/>
                <path d="M24 32h16M32 24v16" stroke="#e0e6ed" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="empty-text">还没有报修记录，开始您的第一次报修吧</p>
          </div>
          
          <div v-else class="timeline">
            <div 
              v-for="(order, index) in recentOrders.slice(0, 4)" 
              :key="order.id" 
              class="timeline-item"
              @click="viewOrderDetail(order)"
            >
              <!-- 时间轴节点 -->
              <div class="timeline-node">
                <div class="node-dot" :class="getTimelineNodeClass(order.status)"></div>
                <div v-if="index < recentOrders.slice(0, 4).length - 1" class="node-line"></div>
              </div>
              
              <!-- 时间轴内容 -->
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4 class="timeline-title">{{ order.title }}</h4>
                  <div class="timeline-status" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
                <div class="timeline-meta">
                  <span class="timeline-location">
                    <svg width="14" height="14" viewBox="0 0 14 14" class="meta-icon">
                      <path d="M7 1a3 3 0 0 0-3 3c0 2 3 6 3 6s3-4 3-6a3 3 0 0 0-3-3z" fill="none" stroke="currentColor" stroke-width="1.2"/>
                      <circle cx="7" cy="4" r="1" fill="currentColor"/>
                    </svg>
                    {{ order.dormitory }}
                  </span>
                  <span class="timeline-date">
                    <svg width="14" height="14" viewBox="0 0 14 14" class="meta-icon">
                      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M7 3v4l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                    {{ formatTimelineDate(order.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 信息枢纽：实用模块 -->
    <div class="info-hub">
      <!-- 模块一：宿舍小百科 - 简洁列表 -->
      <div class="knowledge-list-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg width="20" height="20" viewBox="0 0 20 20" class="title-icon">
              <path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 6v4M10 14h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            宿舍小百科
          </h3>
        </div>
        
        <div class="knowledge-list">
          <div class="knowledge-item" @click="showKnowledgeDetail('power')">
            <div class="knowledge-icon-wrapper">
              <div class="knowledge-icon power">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="knowledge-content">
              <h4 class="knowledge-title">宿舍跳闸怎么办？</h4>
              <p class="knowledge-desc">检查电器使用情况，重置断路器</p>
            </div>
            <div class="knowledge-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div class="knowledge-item" @click="showKnowledgeDetail('water')">
            <div class="knowledge-icon-wrapper">
              <div class="knowledge-icon water">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="knowledge-content">
              <h4 class="knowledge-title">水管堵塞如何自救？</h4>
              <p class="knowledge-desc">使用疏通工具，避免化学清洁剂</p>
            </div>
            <div class="knowledge-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div class="knowledge-item" @click="showKnowledgeDetail('network')">
            <div class="knowledge-icon-wrapper">
              <div class="knowledge-icon network">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M20.07 16.93a10 10 0 0 1 0-9.86M3.93 7.07a10 10 0 0 1 0 9.86" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <div class="knowledge-content">
              <h4 class="knowledge-title">网络不通怎么处理？</h4>
              <p class="knowledge-desc">重启路由器，检查网线连接</p>
            </div>
            <div class="knowledge-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块三：智能问答助手 - 动态表格 -->
      <div class="hub-module ai-assistant-table-module">
        <div class="module-header">
          <div class="module-title">
            <svg width="20" height="20" viewBox="0 0 20 20" class="module-icon">
              <path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 12a2 2 0 0 0 4 0c0-1-1-1.5-2-1.5s-2 .5-2 1.5z" fill="currentColor"/>
              <circle cx="7" cy="8" r="1" fill="currentColor"/>
              <circle cx="13" cy="8" r="1" fill="currentColor"/>
            </svg>
            智能问答助手
          </div>
          <div class="module-actions">
            <button @click="showAllQuestions" class="view-all-btn">
              <span>查看全部</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <div class="module-content">
          <div class="qa-table-container">
            <div class="qa-table-header">
              <div class="qa-header-item question-col">常见问题</div>
              <div class="qa-header-item answer-col">快速答案</div>
              <div class="qa-header-item action-col">操作</div>
            </div>
            <div class="qa-table-body">
              <div 
                v-for="(qa, index) in displayedQAs" 
                :key="index"
                class="qa-row"
                @click="expandQA(index)"
                :class="{ 'expanded': expandedQA === index }"
              >
                <div class="qa-cell question-col">
                  <div class="question-content">
                    <svg width="14" height="14" viewBox="0 0 14 14" class="qa-icon">
                      <circle cx="7" cy="7" r="6" fill="none" stroke="#3498db" stroke-width="1.5"/>
                      <path d="M5.5 5.5a1.5 1.5 0 0 1 3 0c0 .8-.7 1.2-1.5 1.5M7 10h.01" stroke="#3498db" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    {{ qa.question }}
                  </div>
                </div>
                <div class="qa-cell answer-col">
                  <div class="answer-preview" v-if="expandedQA !== index">
                    {{ qa.shortAnswer }}
                  </div>
                  <div class="answer-full" v-else>
                    {{ qa.fullAnswer }}
                  </div>
                </div>
                <div class="qa-cell action-col">
                  <el-button size="small" type="text" @click.stop="copyAnswer(qa.fullAnswer)">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <rect x="2" y="2" width="8" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>
                      <rect x="4" y="0" width="8" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>
                    </svg>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="qa-input-section">
            <el-input 
              v-model="aiQuestion" 
              placeholder="输入你的问题，获取智能回答..." 
              class="qa-input"
              @keyup.enter="askAI"
            >
              <template #suffix>
                <el-button 
                  @click="askAI" 
                  :loading="aiLoading" 
                  type="primary" 
                  size="small"
                  class="ask-btn"
                >
                  提问
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>



    <!-- 动态公告与活动区 -->
    <div class="announcements-section">
      <div class="section-header">
        <div class="header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" class="section-icon">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
          </svg>
          <h2 class="section-title">动态公告与活动</h2>
        </div>
        <div class="header-actions">
          <el-button @click="refreshAnnouncements" size="small" :loading="announcementsLoading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
      
      <div class="announcements-content">
        <!-- 重要公告 -->
        <div class="announcement-panel important-announcements">
          <div class="panel-header">
            <div class="panel-title">
              <svg width="20" height="20" viewBox="0 0 20 20" class="panel-icon">
                <path d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 6v4M10 14h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              重要公告
            </div>
            <el-tag type="danger" size="small" v-if="importantCount > 0">{{ importantCount }}条新消息</el-tag>
          </div>
          <div class="panel-content">
            <div v-if="announcements.length === 0" class="empty-announcements">
              <svg width="48" height="48" viewBox="0 0 48 48" class="empty-icon">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
              </svg>
              <p>暂无公告信息</p>
            </div>
            <div v-else class="announcements-list">
              <div 
                v-for="announcement in announcements.slice(0, 3)" 
                :key="announcement.id"
                class="announcement-item"
                :class="{ 'is-new': announcement.isNew, 'is-important': announcement.important }"
                @click="viewAnnouncementDetail(announcement)"
              >
                <div class="announcement-header">
                  <div class="announcement-title">{{ announcement.title }}</div>
                  <div class="announcement-meta">
                    <el-tag v-if="announcement.important" type="danger" size="small">重要</el-tag>
                    <el-tag v-if="announcement.isNew" type="success" size="small">新</el-tag>
                    <span class="announcement-date">{{ formatDate(announcement.publishTime) }}</span>
                  </div>
                </div>
                <div class="announcement-summary">{{ announcement.summary }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 宿舍活动 -->
        <div class="announcement-panel dormitory-activities">
          <div class="panel-header">
            <div class="panel-title">
              <svg width="20" height="20" viewBox="0 0 20 20" class="panel-icon">
                <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 8h6M7 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              宿舍活动
            </div>
            <el-link type="primary" @click="navigateTo('/activities')" class="view-more-link">
              查看更多
            </el-link>
          </div>
          <div class="panel-content">
            <div v-if="activities.length === 0" class="empty-activities">
              <svg width="48" height="48" viewBox="0 0 48 48" class="empty-icon">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
              </svg>
              <p>暂无活动信息</p>
            </div>
            <div v-else class="activities-carousel">
              <div class="activity-cards">
                <div 
                  v-for="activity in activities" 
                  :key="activity.id"
                  class="activity-card"
                  @click="viewActivityDetail(activity)"
                >
                  <div class="activity-image">
                    <div class="activity-type-badge" :class="activity.type">
                      {{ getActivityTypeText(activity.type) }}
                    </div>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">
                      <el-icon><Calendar /></el-icon>
                      {{ formatActivityTime(activity.startTime, activity.endTime) }}
                    </div>
                    <div class="activity-location">
                      <el-icon><House /></el-icon>
                      {{ activity.location }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import HandDrawnIcons from '@/components/HandDrawnIcons.vue'
import {
  House, Document, Clock, CircleCheck, User, Plus, List, UserFilled, 
  Bell, Monitor, Refresh, Lightning, Warning, Check, Setting, 
  Lock, Tools, Calendar, Link, TrendCharts, View, SwitchButton
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const refreshing = ref(false)
const ordersLoading = ref(false)
const statusLoading = ref(false)
const apiTesting = ref(false)
const lastLoginTime = ref('今日 09:30')
const autoRefreshTimer = ref(null)

// 统计数据
const statistics = reactive({
  totalOrders: 1,
  pendingOrders: 0,
  processingOrders: 0,
  completedOrders: 1,
  totalUsers: 1,
  totalDormitories: 1
})

// 最新动态
const latestUpdate = ref('')

// AI问答助手相关数据
const aiQuestion = ref('')
const aiLoading = ref(false)
const expandedQA = ref(null)

// 问答数据
const qaData = ref([
  {
    question: '如何提交报修申请？',
    shortAnswer: '点击快速操作中的"报修申请"按钮...',
    fullAnswer: '您可以通过以下步骤提交报修申请：1. 点击首页快速操作区域的"报修申请"按钮；2. 填写详细的故障描述和联系方式；3. 选择故障类型和紧急程度；4. 提交申请等待处理。'
  },
  {
    question: '报修进度如何查询？',
    shortAnswer: '在"我的报修日志"中查看...',
    fullAnswer: '您可以在首页的"我的报修日志"模块中实时查看所有报修申请的处理进度，包括已提交、处理中、已完成等状态。点击具体条目可查看详细信息。'
  },
  {
    question: '常见故障如何自行解决？',
    shortAnswer: '查看"宿舍小百科"获取解决方案...',
    fullAnswer: '"宿舍小百科"模块提供了常见故障的自助解决方案，包括跳闸、水管堵塞、网络不通等问题的处理方法。建议先尝试自行解决，无法解决再提交报修。'
  },
  {
    question: '紧急情况如何处理？',
    shortAnswer: '选择紧急报修并联系管理员...',
    fullAnswer: '遇到紧急情况（如漏水、断电等）时，请立即提交报修申请并选择"紧急"级别，同时可通过系统消息或电话联系宿舍管理员，确保问题得到及时处理。'
  }
])

// 显示的问答数据（默认显示前3条）
const displayedQAs = computed(() => qaData.value.slice(0, 3))

// 知识库详情对话框
const knowledgeDialogVisible = ref(false)
const currentKnowledge = ref(null)

// 公告和活动相关数据
const announcementsLoading = ref(false)
const announcements = ref([
  {
    id: 1,
    title: '关于本周末宿舍楼电力维护的通知',
    summary: '为保障宿舍用电安全，本周六上午9:00-12:00将进行电力设备维护，期间可能出现短暂停电...',
    content: '详细内容...',
    important: true,
    isNew: true,
    publishTime: '2025-01-16T10:00:00Z'
  },
  {
    id: 2,
    title: '宿舍网络升级完成通知',
    summary: '经过技术人员的努力，宿舍网络升级工作已全部完成，网速将有显著提升...',
    content: '详细内容...',
    important: false,
    isNew: false,
    publishTime: '2025-01-15T14:30:00Z'
  }
])

const activities = ref([
  {
    id: 1,
    title: '宿舍文化节',
    type: 'cultural',
    startTime: '2025-01-20T19:00:00Z',
    endTime: '2025-01-20T21:00:00Z',
    location: '宿舍楼下广场',
    description: '展示宿舍文化，增进同学友谊'
  },
  {
    id: 2,
    title: '消防安全演练',
    type: 'safety',
    startTime: '2025-01-18T15:00:00Z',
    endTime: '2025-01-18T16:30:00Z',
    location: '各宿舍楼',
    description: '提高消防安全意识和应急处理能力'
  },
  {
    id: 3,
    title: '宿舍清洁大比拼',
    type: 'competition',
    startTime: '2025-01-22T09:00:00Z',
    endTime: '2025-01-22T17:00:00Z',
    location: '全体宿舍',
    description: '营造整洁舒适的居住环境'
  }
])

// 最新工单数据
const recentOrders = ref([
  {
    id: 1,
    number: 'R202509100082815',
    title: '断电了',
    status: 'completed',
    studentName: '张三',
    dormitory: '10号楼-1010',
    createdAt: '2025-09-10T08:28:00Z'
  }
])

// API连接状态
const apiStatus = reactive({
  system: { connected: true, error: null },
  auth: { connected: true, error: null },
  dormitory: { connected: false, error: '连接超时' },
  repair: { connected: true, error: null }
})

// 计算属性
const completionRate = computed(() => {
  if (statistics.totalOrders === 0) return 0
  return Math.round((statistics.completedOrders / statistics.totalOrders) * 100)
})

const importantCount = computed(() => {
  return announcements.value.filter(item => item.important && item.isNew).length
})

// 概览卡片配置
const overviewCards = computed(() => [
  {
    type: 'primary',
    icon: 'Document',
    actionIcon: 'View',
    title: '工单总数',
    value: statistics.totalOrders,
    trend: '小管家正在运行中~',
    trendType: 'positive',
    trendIcon: 'TrendCharts',
    chartClass: 'mini-chart-line',
    onClick: () => navigateTo('/repair')
  },
  {
    type: 'warning',
    icon: 'Clock',
    actionIcon: 'Warning',
    title: '正在等待分配...',
    value: statistics.pendingOrders,
    trend: statistics.pendingOrders > 0 ? '需要处理哦！' : '当前没有新的报修单哦~',
    trendType: statistics.pendingOrders > 0 ? 'urgent' : 'positive',
    trendIcon: 'Warning',
    chartClass: 'mini-chart-bar',
    badge: statistics.pendingOrders,
    onClick: () => handlePendingOrders()
  },
  {
    type: 'success',
    icon: 'CircleCheck',
    actionIcon: 'Check',
    title: '今日任务完成！',
    value: statistics.completedOrders,
    trend: `完成率 ${completionRate.value}% 棒棒哒！`,
    trendType: 'positive',
    trendIcon: 'Check',
    chartClass: 'mini-chart-progress',
    onClick: () => navigateTo('/repair?status=completed')
  },
  {
    type: 'info',
    icon: 'User',
    actionIcon: 'UserFilled',
    title: '宿舍小伙伴',
    value: statistics.totalUsers,
    trend: `${statistics.totalDormitories} 间温馨小窝`,
    trendType: 'neutral',
    trendIcon: 'House',
    chartClass: 'mini-chart-donut',
    onClick: () => navigateTo('/users')
  }
])



// 系统状态配置
const systemStatus = ref([
  {
    title: '小管家前台',
    value: '精神满满！',
    status: 'online',
    metricLabel: '响应速度',
    metricValue: '< 100ms',
    metricClass: 'success'
  },
  {
    title: '小管家后台',
    value: '工作中...',
    status: 'online',
    metricLabel: '处理速度',
    metricValue: '156ms',
    metricClass: 'success'
  },
  {
    title: '数据小仓库',
    value: '连接顺畅~',
    status: 'online',
    metricLabel: '查询速度',
    metricValue: '23ms',
    metricClass: 'success'
  }
])



// 方法定义
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '晚上好'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const getCurrentUserName = () => {
  // 这里可以从用户store或其他地方获取真实用户名
  return '小管家'
}

const updateLatestActivity = () => {
  if (statistics.pendingOrders > 0) {
    latestUpdate.value = `有 ${statistics.pendingOrders} 个新的报修工单等待处理`
  } else if (statistics.processingOrders > 0) {
    latestUpdate.value = `有 ${statistics.processingOrders} 个工单正在维修中`
  } else if (recentOrders.value.length > 0) {
    const latest = recentOrders.value[0]
    latestUpdate.value = `最新：你的'${latest.title}'报修已${getStatusText(latest.status)}`
  } else {
    latestUpdate.value = ''
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 时间轴专用日期格式化
const formatTimelineDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) {
    return '刚刚'
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { 
      month: 'numeric', 
      day: 'numeric'
    })
  }
}

// 获取时间轴节点样式类
const getTimelineNodeClass = (status) => {
  const classMap = {
    'completed': 'node-completed',
    'in_progress': 'node-progress', 
    'pending': 'node-pending',
    'cancelled': 'node-cancelled'
  }
  return classMap[status] || 'node-pending'
}

// 获取状态样式类
const getStatusClass = (status) => {
  const classMap = {
    'completed': 'status-completed',
    'in_progress': 'status-progress',
    'pending': 'status-pending', 
    'cancelled': 'status-cancelled'
  }
  return classMap[status] || 'status-pending'
}

const getStatusTagType = (status) => {
  const typeMap = {
    'pending': 'warning',
    'processing': 'primary',
    'completed': 'success',
    'cancelled': 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    'pending': '待处理',
    'processing': '维修中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return textMap[status] || '未知'
}

const getApiDisplayName = (api) => {
  const nameMap = {
    system: '系统管理',
    auth: '认证模块',
    dormitory: '宿舍管理',
    repair: '工单管理'
  }
  return nameMap[api] || api
}

const getApiIcon = (api) => {
  const iconMap = {
    system: 'Setting',
    auth: 'Lock',
    dormitory: 'House',
    repair: 'Tools'
  }
  return iconMap[api] || 'Setting'
}

// 事件处理
const navigateTo = (route) => {
  router.push(route)
}

const quickCreateOrder = () => {
  router.push('/repair/create')
}

const handlePendingOrders = () => {
  if (statistics.pendingOrders > 0) {
    navigateTo('/repair?status=pending')
  } else {
    ElMessage.info('当前没有待处理的工单')
  }
}

const viewOrderDetail = (order) => {
  ElMessage.info(`查看工单详情: ${order.title}`)
  // router.push(`/repair/${order.id}`)
}

// 公告和活动相关方法
const refreshAnnouncements = async () => {
  announcementsLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟刷新公告数据
    ElMessage.success('公告信息刷新成功')
  } catch (error) {
    ElMessage.error('公告信息刷新失败')
  } finally {
    announcementsLoading.value = false
  }
}

const viewAnnouncementDetail = (announcement) => {
  ElMessageBox.alert(
    `<div style="text-align: left;">
      <p><strong>发布时间：</strong>${formatDate(announcement.publishTime)}</p>
      <p><strong>内容摘要：</strong></p>
      <p>${announcement.summary}</p>
      <p style="margin-top: 16px; color: #666;">点击确定关闭此公告详情</p>
    </div>`,
    announcement.title,
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了',
      customClass: 'announcement-dialog'
    }
  )
}

const viewActivityDetail = (activity) => {
  ElMessageBox.alert(
    `<div style="text-align: left;">
      <p><strong>活动时间：</strong>${formatActivityTime(activity.startTime, activity.endTime)}</p>
      <p><strong>活动地点：</strong>${activity.location}</p>
      <p><strong>活动描述：</strong></p>
      <p>${activity.description}</p>
      <p style="margin-top: 16px; color: #666;">更多详情请关注宿舍管理通知</p>
    </div>`,
    activity.title,
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了',
      customClass: 'activity-dialog'
    }
  )
}

const getActivityTypeText = (type) => {
  const typeMap = {
    cultural: '文化',
    safety: '安全',
    competition: '竞赛',
    social: '社交',
    maintenance: '维护'
  }
  return typeMap[type] || '活动'
}

const formatActivityTime = (startTime, endTime) => {
  if (!startTime) return '-'
  
  const start = new Date(startTime)
  const end = new Date(endTime)
  
  if (isNaN(start.getTime())) return '-'
  
  const startStr = start.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  if (!endTime || isNaN(end.getTime())) {
    return startStr
  }
  
  const endStr = end.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return `${startStr} - ${endStr}`
}

// AI问答助手方法
const askAI = async () => {
  if (!aiQuestion.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }
  
  aiLoading.value = true
  try {
    // 模拟AI回答
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const answers = {
      '如何提交报修': '点击首页的"发起报修"按钮，填写报修信息即可提交。',
      '报修流程': '提交报修 → 管理员审核 → 分配维修人员 → 维修完成 → 确认结果',
      '联系方式': '如有紧急情况，请联系宿管阿姨或拨打维修热线。'
    }
    
    const answer = answers[aiQuestion.value] || '很抱歉，我暂时无法回答这个问题。请联系管理员获取帮助。'
    
    ElMessageBox.alert(answer, 'AI助手回答', {
      confirmButtonText: '知道了',
      type: 'info'
    })
    
    aiQuestion.value = ''
  } catch (error) {
    ElMessage.error('AI助手暂时无法使用，请稍后再试')
  } finally {
    aiLoading.value = false
  }
}

// 问答表格相关方法
const expandQA = (index) => {
  expandedQA.value = expandedQA.value === index ? null : index
}

const copyAnswer = async (answer) => {
  try {
    await navigator.clipboard.writeText(answer)
    ElMessage.success('答案已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const showAllQuestions = () => {
  ElMessageBox.alert(
    '更多问题和答案请查看帮助文档或联系管理员',
    '全部问题',
    {
      confirmButtonText: '知道了',
      type: 'info'
    }
  )
}

// 知识库详情展示
const showKnowledgeDetail = (type) => {
  const knowledgeData = {
    power: {
      title: '宿舍跳闸怎么办？',
      content: `
        <h4>常见原因：</h4>
        <ul>
          <li>用电器功率过大</li>
          <li>多个大功率设备同时使用</li>
          <li>电路老化或短路</li>
        </ul>
        <h4>解决步骤：</h4>
        <ol>
          <li>立即关闭所有电器</li>
          <li>检查是否有烧焦味道</li>
          <li>找到配电箱，尝试推上跳闸开关</li>
          <li>如果无法恢复，请立即联系宿管</li>
        </ol>
        <p><strong>注意：</strong>如有安全隐患，请勿自行处理！</p>
      `
    },
    water: {
      title: '水管堵塞如何自救？',
      content: `
        <h4>轻微堵塞处理：</h4>
        <ul>
          <li>使用热水冲洗</li>
          <li>用洗洁精疏通</li>
          <li>使用简易疏通器</li>
        </ul>
        <h4>严重堵塞：</h4>
        <ol>
          <li>停止使用该水管</li>
          <li>清理可见的堵塞物</li>
          <li>联系宿管或提交报修</li>
        </ol>
        <p><strong>预防措施：</strong>避免倒入油脂、毛发等易堵塞物质</p>
      `
    },
    network: {
      title: '网络不通怎么处理？',
      content: `
        <h4>基础检查：</h4>
        <ul>
          <li>检查网线连接是否松动</li>
          <li>重启路由器和电脑</li>
          <li>检查网络设置</li>
        </ul>
        <h4>进阶处理：</h4>
        <ol>
          <li>使用网络诊断工具</li>
          <li>检查IP地址配置</li>
          <li>联系网络管理员</li>
        </ol>
        <p><strong>联系方式：</strong>网络故障请拨打校园网服务热线</p>
      `
    }
  }
  
  currentKnowledge.value = knowledgeData[type]
  if (currentKnowledge.value) {
    ElMessageBox.alert(currentKnowledge.value.content, currentKnowledge.value.title, {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了',
      customClass: 'knowledge-dialog'
    })
  }
}

const refreshData = async () => {
  refreshing.value = true
  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根据后台实际数据更新
    const baseOrders = 1      // 实际有 1 个工单
    const basePending = 0     // 0 个待处理
    const baseProcessing = 0  // 0 个维修中
    const baseCompleted = 1   // 1 个已完成
    const baseUsers = 1       // 1 个管理员用户
    
    statistics.totalOrders = baseOrders
    statistics.pendingOrders = basePending
    statistics.processingOrders = baseProcessing
    statistics.completedOrders = baseCompleted
    statistics.totalUsers = baseUsers
    statistics.totalDormitories = 1  // 有 1 间宿舍（10号楼-1010）
    
    // 更新最新动态
    updateLatestActivity()
    
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    refreshing.value = false
  }
}

const refreshSystemStatus = async () => {
  statusLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟状态检查
    systemStatus.value.forEach(status => {
      const isOnline = Math.random() > 0.1 // 90%概率在线
      status.status = isOnline ? 'online' : 'warning'
      status.value = isOnline ? '运行正常' : '性能降级'
    })
    
    ElMessage.success('系统状态刷新成功')
  } catch (error) {
    ElMessage.error('系统状态刷新失败')
  } finally {
    statusLoading.value = false
  }
}

const testApiConnections = async () => {
  if (apiTesting.value) return
  
  apiTesting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟 API 连接测试
    Object.keys(apiStatus).forEach(api => {
      const connected = Math.random() > 0.2 // 80%成功率
      apiStatus[api].connected = connected
      apiStatus[api].error = connected ? null : '连接超时'
    })
    
    ElMessage.success('API连接测试完成')
  } catch (error) {
    ElMessage.error('API连接测试失败')
  } finally {
    apiTesting.value = false
  }
}

// 自动刷新功能
const startAutoRefresh = () => {
  autoRefreshTimer.value = setInterval(() => {
    // 静默刷新数据，保持与后台一致
    const baseOrders = 1
    const basePending = 0
    const baseCompleted = 1
    const baseUsers = 1
    
    statistics.totalOrders = baseOrders
    statistics.pendingOrders = basePending
    statistics.completedOrders = baseCompleted
    statistics.totalUsers = baseUsers
    statistics.totalDormitories = 1
  }, 30000) // 30秒刷新一次
}

const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// 退出登录功能
const handleLogout = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后需要重新登录。',
      '退出确认',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 显示加载状态
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在退出登录...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    try {
      // 停止自动刷新
      stopAutoRefresh()
      
      // 调用退出登录API
      await authStore.logout()
      
      ElMessage.success({
        message: '退出登录成功',
        duration: 2000
      })
      
      // 跳转到登录页
      await router.replace('/login')
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使API调用失败，也要清除本地状态
      authStore.logout()
      ElMessage.warning('退出登录完成（网络异常）')
      await router.replace('/login')
    } finally {
      loadingInstance.close()
    }
  } catch (error) {
    // 用户取消退出
    if (error === 'cancel') {
      ElMessage.info('已取消退出')
    }
  }
}

// 生命周期钩子
onMounted(async () => {
  try {
    // 并行加载初始数据
    await Promise.allSettled([
      refreshData(),
      refreshSystemStatus()
    ])
    
    // 初始化最新动态
    updateLatestActivity()
    
    // 启动自动刷新
    startAutoRefresh()
    
    // 显示欢迎消息
    await nextTick()
    ElMessage({
      message: '欢迎使用宿舍维修管理系统！',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    console.error('Dashboard初始化失败:', error)
    ElMessage.error('仪表盘初始化失败，请刷新重试')
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<script>
export default {
  name: 'Dashboard',
  components: {
    HandDrawnIcons
  }
}
</script>

<style scoped>
/* 温馨宿舍小管家样式 */
.cozy-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #FFF8F0 0%, #F0F8FF 50%, #F5F0FF 100%);
  min-height: 100vh;
  position: relative;
}

.cozy-dashboard::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(173, 216, 230, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(221, 160, 221, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.cozy-dashboard > * {
  position: relative;
  z-index: 1;
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 24px;
  margin-bottom: 32px;
  overflow: hidden;
  min-height: 280px;
  box-shadow: 0 20px 40px rgba(79, 172, 254, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.bg-decoration {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  top: 30%;
  right: 30%;
  animation-delay: 4s;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  color: white;
  gap: 40px;
}

.hero-left {
  flex: 1;
  max-width: 500px;
}

.dynamic-greeting {
  margin-bottom: 32px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.greeting-text {
  color: rgba(255, 255, 255, 0.9);
}

.user-name {
  color: #fff;
  background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.primary-action-btn {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border: none;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
  transition: all 0.3s ease;
  color: white;
}

.primary-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(79, 172, 254, 0.4);
  background: linear-gradient(45deg, #00f2fe, #4facfe);
}

.secondary-action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 16px 24px;
  font-size: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
}

.secondary-action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  margin-right: 8px;
}

.hero-right {
  flex: 1;
  max-width: 400px;
}

.key-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.metric-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.metric-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.metric-item.pending .metric-icon {
  color: #ffd93d;
}

.metric-item.processing .metric-icon {
  color: #6c5ce7;
}

.metric-item.completed .metric-icon {
  color: #00b894;
}

.metric-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.metric-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.latest-updates {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.updates-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
}

.updates-icon {
  margin-right: 8px;
  color: #74b9ff;
}

.updates-content {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

.update-item {
  padding: 8px 0;
  border-left: 3px solid #74b9ff;
  padding-left: 12px;
  margin-left: 8px;
}

.welcome-illustration {
  margin-bottom: 16px;
}

/* 信息枢纽：三大实用模块样式 */
.info-hub {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.hub-module {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hub-module::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.hub-module:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(79, 172, 254, 0.15);
  border-color: rgba(79, 172, 254, 0.2);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.module-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.module-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  z-index: 1;
}

.module-icon {
  margin-right: 8px;
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.view-all-link {
  font-size: 0.9rem;
  text-decoration: none;
}

.module-content {
  min-height: 200px;
}

/* 简洁时间轴区域样式 */
.timeline-full-section {
  margin: 40px 0;
  background: transparent;
  padding: 0;
  position: relative;
}

.timeline-wrapper {
  padding: 20px 0;
  background: transparent;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(240, 147, 251, 0.2);
  position: relative;
  overflow: hidden;
}

.section-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, -10px) rotate(180deg); }
}

.section-title {
  display: flex;
  color: #ffffff;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.title-icon {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  position: relative;
  z-index: 2;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #f0f8ff;
}

.view-all-btn svg {
  transition: transform 0.2s ease;
}

.view-all-btn:hover svg {
  transform: translateX(2px);
}

.timeline-container {
  position: relative;
}

.timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px dashed #e0e6ed;
}

.empty-illustration {
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.empty-text {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* 主时间轴线 - 居中显示 */
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #ddd;
  border-radius: 1.5px;
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

/* 奇数项目显示在左侧 */
.timeline-item:nth-child(odd) {
  justify-content: flex-start;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-right: 60px;
  text-align: right;
}

/* 偶数项目显示在右侧 */
.timeline-item:nth-child(even) {
  justify-content: flex-end;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-left: 60px;
  text-align: left;
}

.timeline-item:hover {
  opacity: 0.8;
}

.timeline-item:hover .node-dot {
  transform: scale(1.1);
}

.timeline-node {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 15;
}

.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 15;
  transition: all 0.3s ease;
  position: relative;
}

.node-completed {
  background: #27ae60;
}

.node-progress {
  background: #3498db;
}

.node-pending {
  background: #f39c12;
}

.node-cancelled {
  background: #e74c3c;
}

.timeline-content {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 16px 20px;
  max-width: 400px;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
}

/* 左侧内容区域的连接线 */
.timeline-item:nth-child(odd) .timeline-content::before {
  content: '';
  position: absolute;
  right: -30px;
  top: 50%;
  width: 30px;
  height: 2px;
  background: #ddd;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

/* 右侧内容区域的连接线 */
.timeline-item:nth-child(even) .timeline-content::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 50%;
  width: 30px;
  height: 2px;
  background: #ddd;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-content::before {
  background: #666;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.timeline-status {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-progress {
  background: #cce5ff;
  color: #004085;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.timeline-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #666;
  padding-top: 8px;
  margin-top: 8px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 8px;
  margin-top: 12px;
  padding-top: 12px;
}

.timeline-location,
.timeline-date {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(52, 152, 219, 0.05);
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.timeline-location:hover,
.timeline-date:hover {
  background: rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

.meta-icon {
  opacity: 0.8;
  color: #3498db;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3), 0 0 0 4px rgba(255,255,255,0.8), 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3), 0 0 0 4px rgba(255,255,255,0.8), 0 0 0 12px rgba(52, 152, 219, 0.2);
  }
  100% {
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3), 0 0 0 4px rgba(255,255,255,0.8), 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 时间轴整体进入动画 */
.timeline-item {
  animation: slideInFromLeft 0.6s ease-out;
  animation-fill-mode: both;
}

.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.2s; }
.timeline-item:nth-child(3) { animation-delay: 0.3s; }
.timeline-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 宿舍小百科 - 简洁列表样式 */
.knowledge-list-section {
  margin-bottom: 32px;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.knowledge-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 8px 0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.knowledge-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.6s;
}

.knowledge-item:hover::before {
  left: 100%;
}

.knowledge-item:hover {
  background: linear-gradient(135deg, #f8fbff 0%, #e6f3ff 100%);
  border-color: #3498db;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 30px rgba(52, 152, 219, 0.2);
}

.knowledge-item:hover .knowledge-arrow {
  transform: translateX(4px);
  color: #3498db;
}

.knowledge-icon-wrapper {
  margin-right: 16px;
}

.knowledge-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.knowledge-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.knowledge-item:hover .knowledge-icon::before {
  opacity: 1;
}

.knowledge-item:hover .knowledge-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.knowledge-icon.power {
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b35 100%);
}

.knowledge-icon.water {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.knowledge-icon.network {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
}

.knowledge-content {
  flex: 1;
}

.knowledge-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.knowledge-desc {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
}

.knowledge-arrow {
  color: #bdc3c7;
  transition: all 0.3s ease;
  margin-left: 12px;
}

/* 智能问答助手 - 动态表格样式 */
.ai-assistant-table-module {
  margin-bottom: 32px;
}

.qa-table-container {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f2f5;
  margin-bottom: 20px;
}

.qa-table-header {
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.qa-table-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.qa-header-item {
  padding: 16px 20px;
  position: relative;
  z-index: 1;
}

.qa-header-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  bottom: 25%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.question-col {
  flex: 2;
}

.answer-col {
  flex: 3;
}

.action-col {
  flex: 0 0 80px;
  text-align: center;
}

.qa-table-body {
  display: flex;
  flex-direction: column;
}

.qa-row {
  display: flex;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin: 8px 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.qa-row:hover {
  background: #f8fbff;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.qa-row.expanded {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  box-shadow: 0 6px 25px rgba(52, 152, 219, 0.15);
  border-left: 4px solid #3498db;
}

.qa-cell {
  padding: 16px 20px;
  position: relative;
  display: flex;
  align-items: center;
}

.qa-cell:last-child {
  border-right: none;
}

.question-content {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
}

.qa-icon {
  margin-right: 10px;
  flex-shrink: 0;
}

.answer-preview {
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.answer-full {
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.5;
  padding: 8px 0;
}

.qa-input-section {
  margin-top: 20px;
}

.qa-input {
  border-radius: 12px;
}

.qa-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.qa-input :deep(.el-input__wrapper):hover {
  border-color: #3498db;
}

.qa-input :deep(.el-input__wrapper.is-focus) {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.ask-btn {
  border-radius: 8px;
  margin-right: 8px;
}

/* 动态公告与活动区样式 */
.announcements-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.1);
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.announcements-section:hover {
  box-shadow: 0 12px 40px rgba(79, 172, 254, 0.15);
  border-color: rgba(79, 172, 254, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
}

.section-icon {
  margin-right: 12px;
  color: #667eea;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.announcements-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 768px) {
  .announcements-content {
    grid-template-columns: 1fr;
  }
}

.announcement-panel {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.announcement-panel:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.important-announcements {
  border-left: 4px solid #e74c3c;
}

.dormitory-activities {
  border-left: 4px solid #3498db;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.2);
  position: relative;
  overflow: hidden;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 50%);
  pointer-events: none;
}

.panel-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.panel-icon {
  margin-right: 8px;
  color: #667eea;
}

.view-more-link {
  font-size: 0.9rem;
  text-decoration: none;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.empty-announcements,
.empty-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 250px;
  color: #95a5a6;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 公告列表样式 */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.announcement-item {
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 80px;
}

.announcement-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.announcement-item.is-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #27ae60;
  border-radius: 2px 0 0 2px;
}

.announcement-item.is-important {
  border-left: 4px solid #e74c3c;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  flex-shrink: 0;
}

.announcement-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  line-height: 1.3;
  flex: 1;
  margin-right: 12px;
}

.announcement-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.announcement-date {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.announcement-summary {
  font-size: 0.8rem;
  color: #7f8c8d;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

/* 活动卡片样式 */
.activities-carousel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  flex: 1;
}

.activity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 120px;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.activity-image {
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-type-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  position: absolute;
  top: 12px;
  right: 12px;
}

.activity-type-badge.cultural {
  background: rgba(253, 121, 168, 0.9);
  color: white;
}

.activity-type-badge.safety {
  background: rgba(255, 107, 107, 0.9);
  color: white;
}

.activity-type-badge.competition {
  background: rgba(116, 185, 255, 0.9);
  color: white;
}

.activity-content {
  padding: 12px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  line-height: 1.3;
  flex-shrink: 0;
}

.activity-time,
.activity-location {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.activity-time .el-icon,
.activity-location .el-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* 飘浮元素容器 */
.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主房子动画 */
.main-house {
  animation: float-main 6s ease-in-out infinite;
  z-index: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* 小装饰房子动画 */
.small-house-1 {
  position: absolute;
  top: -10px;
  right: -15px;
  animation: float-small-1 8s ease-in-out infinite;
  z-index: 2;
}

.small-house-2 {
  position: absolute;
  bottom: -5px;
  left: -10px;
  animation: float-small-2 7s ease-in-out infinite;
  z-index: 2;
}

/* 星星动画 */
.star-1 {
  position: absolute;
  top: 10px;
  left: -20px;
  animation: twinkle-1 4s ease-in-out infinite;
  z-index: 1;
}

.star-2 {
  position: absolute;
  top: -15px;
  right: 10px;
  animation: twinkle-2 5s ease-in-out infinite;
  z-index: 1;
}

.star-3 {
  position: absolute;
  bottom: 15px;
  right: -5px;
  animation: twinkle-3 3s ease-in-out infinite;
  z-index: 1;
}

.hand-drawn-icon {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.button-icon {
  margin-right: 8px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.cozy-button {
  border-radius: 20px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  border: 2px solid transparent !important;
  backdrop-filter: blur(10px);
}

.cozy-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.cozy-button.secondary {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.cozy-button.goodbye {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 182, 193, 0.5) !important;
  color: #FFB6C1 !important;
}

.welcome-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.welcome-content .welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  animation: fadeInUp 0.8s ease-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-content .greeting {
  margin-right: 12px;
}

.welcome-content .user-name {
  color: #FFF8DC;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.welcome-content .welcome-subtitle {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 20px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.quick-stats {
  display: flex;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  backdrop-filter: blur(15px);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.stat-item:hover {
  opacity: 1;
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-actions {
  display: flex;
  gap: 16px;
  animation: fadeInLeft 0.8s ease-out 0.3s both;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.overview-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #FEFEFE 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 
    0 8px 32px rgba(255, 182, 193, 0.12),
    0 2px 8px rgba(173, 216, 230, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 182, 193, 0.1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  backdrop-filter: blur(10px);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #FFB6C1 0%, #DDA0DD 50%, #87CEEB 100%);
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px 20px 0 0;
}

.overview-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -50px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: all 0.4s ease;
}

.overview-card:hover::before {
  transform: scaleX(1);
}

.overview-card:hover::after {
  right: -30px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.1) 0%, transparent 70%);
}

.overview-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(255, 182, 193, 0.2),
    0 8px 16px rgba(173, 216, 230, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 182, 193, 0.2);
}

.overview-card.primary { --card-color: #FFB6C1; }
.overview-card.warning { --card-color: #F0E68C; }
.overview-card.success { --card-color: #98FB98; }
.overview-card.info { --card-color: #DDA0DD; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 20px rgba(255, 182, 193, 0.2),
    0 2px 4px rgba(221, 160, 221, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.card-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.primary .card-icon { 
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.warning .card-icon { 
  background: linear-gradient(135deg, #F0E68C 0%, #FFFFE0 100%); 
  color: #8B7D3A;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.success .card-icon { 
  background: linear-gradient(135deg, #98FB98 0%, #90EE90 100%); 
  color: #2E8B57;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.info .card-icon { 
  background: linear-gradient(135deg, #DDA0DD 0%, #E6E6FA 100%); 
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.overview-card:hover .card-icon {
  transform: scale(1.15) rotate(8deg);
  box-shadow: 
    0 12px 28px rgba(255, 182, 193, 0.3),
    0 4px 8px rgba(221, 160, 221, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-title {
  font-size: 15px;
  color: #8B7D9B;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF69B4 0%, #9370DB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-family: 'SF Pro Display', -apple-system, sans-serif;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(255, 105, 180, 0.1);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card-trend.positive { 
  color: #20B2AA;
  background: rgba(32, 178, 170, 0.1);
  border: 1px solid rgba(32, 178, 170, 0.2);
}
.card-trend.urgent { 
  color: #FF6B9D;
  background: rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.2);
}
.card-trend.neutral { 
  color: #9B59B6;
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid rgba(155, 89, 182, 0.2);
}

.card-trend:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}



.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #6B5B95;
  padding: 24px 24px 0;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}

.header-left .hand-drawn-icon {
  color: #FFB6C1;
  filter: drop-shadow(0 2px 4px rgba(255, 182, 193, 0.3));
}




/* 已移除系统状态模块相关样式 */

.status-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #303133;
}

.status-value {
  font-size: 12px;
  color: #909399;
}

.status-metrics {
  text-align: right;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  font-size: 10px;
  color: #c0c4cc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  font-family: 'SF Mono', Consolas, monospace;
}

.metric-value.success { color: #67c23a; }
.metric-value.warning { color: #e6a23c; }
.metric-value.danger { color: #f56c6c; }

/* 已移除API状态模块相关样式 */

/* 迷你图表 */
.card-chart {
  width: 60px;
  height: 40px;
  position: relative;
}

.mini-chart-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.3) 100%);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.mini-chart-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to right, 
    transparent 0%, 
    rgba(64, 158, 255, 0.5) 25%, 
    rgba(64, 158, 255, 0.8) 50%, 
    rgba(64, 158, 255, 0.6) 75%, 
    transparent 100%);
  animation: chartFlow 3s ease-in-out infinite;
}

.mini-chart-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(230, 162, 60, 0.3) 0%, rgba(230, 162, 60, 0.1) 100%);
  border-radius: 4px;
  position: relative;
}

.mini-chart-progress {
  width: 100%;
  height: 8px;
  background: #ebeef5;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.mini-chart-progress::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 85%;
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
  border-radius: 4px;
  animation: progressFill 2s ease-out;
}

.mini-chart-donut {
  width: 40px;
  height: 40px;
  border: 3px solid #ebeef5;
  border-top-color: #909399;
  border-radius: 50%;
  margin: auto;
  animation: spin 2s linear infinite;
}

/* 空状态 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes chartFlow {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

@keyframes progressFill {
  from {
    width: 0;
  }
  to {
    width: 85%;
  }
}

@keyframes shimmer {
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 动画关键帧 */
@keyframes float-main {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(1deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-12px) rotate(-1deg); }
}

@keyframes float-small-1 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.7; }
  33% { transform: translateY(-6px) translateX(2px) rotate(2deg); opacity: 0.9; }
  66% { transform: translateY(-3px) translateX(-1px) rotate(-1deg); opacity: 0.6; }
}

@keyframes float-small-2 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.7; }
  40% { transform: translateY(-4px) translateX(-2px) rotate(-2deg); opacity: 0.8; }
  80% { transform: translateY(-7px) translateX(1px) rotate(1deg); opacity: 0.5; }
}

@keyframes twinkle-1 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.4; }
}

@keyframes twinkle-2 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  25% { transform: scale(0.8) rotate(90deg); opacity: 0.9; }
  75% { transform: scale(1.1) rotate(270deg); opacity: 0.3; }
}

@keyframes twinkle-3 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  60% { transform: scale(1.3) rotate(-180deg); opacity: 0.8; }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-dashboard {
    padding: 12px;
  }
  
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .welcome-content .welcome-title {
    font-size: 24px;
  }
  
  .card-value {
    font-size: 28px;
  }
  
  .overview-card {
    padding: 16px;
  }
}</style>