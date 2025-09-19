<template>
  <div class="dorm-chat">
    <!-- 群聊头部 -->
    <div class="chat-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="group-info">
          <h2 class="group-name">二号楼微楼吧(895)</h2>
          <span class="group-status">在线 126人</span>
        </div>
      </div>
      <div class="header-right">
        <button class="menu-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="19" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div class="message-item" v-for="message in messages" :key="message.id" :class="message.type">
        <div class="message-avatar">
          <img :src="message.avatar" :alt="message.username" v-if="message.avatar">
          <div class="avatar-placeholder" v-else>{{ message.username.charAt(0) }}</div>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="username">{{ message.username }}</span>
            <span class="user-level" v-if="message.level">{{ message.level }}</span>
            <span class="room-info" v-if="message.room">{{ message.room }}</span>
            <span class="timestamp">{{ message.time }}</span>
          </div>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-toolbar">
        <button class="tool-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <button class="tool-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      <div class="input-box">
        <textarea 
          v-model="newMessage" 
          placeholder="说点什么..."
          @keydown.enter.prevent="sendMessage"
          rows="1"
          ref="messageInput"
        ></textarea>
        <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DormChat',
  data() {
    return {
      newMessage: '',
      messages: [
        {
          id: 1,
          username: '小明',
          level: 'A栋302',
          room: '2分钟前',
          content: '今天宿舍的红烧肉超好吃！推荐大家去试试～',
          time: '08/31 15:34',
          type: 'normal',
          avatar: null
        },
        {
          id: 2,
          username: '阿明',
          level: 'B栋206',
          room: '1分钟前',
          content: '哈哈，我也去吃了！阿姨真的我多打了一勺',
          time: '08/31 15:35',
          type: 'normal',
          avatar: null
        },
        {
          id: 3,
          username: '深琳',
          level: 'C栋108',
          room: '刚刚',
          content: '有人知道图书馆今天几点关门吗？想去复习一下',
          time: '08/31 15:36',
          type: 'normal',
          avatar: null
        },
        {
          id: 4,
          username: '小王',
          level: 'A栋405',
          room: '30秒前',
          content: '图书馆今天到晚上10点，记得带学生卡哦',
          time: '08/31 16:32',
          type: 'normal',
          avatar: null
        },
        {
          id: 5,
          username: '李华',
          level: 'D栋301',
          room: '25秒前',
          content: '明天有人一起去打篮球吗？下午4点体育馆见',
          time: '08/31 16:33',
          type: 'normal',
          avatar: null
        },
        {
          id: 6,
          username: '小张',
          level: 'B栋503',
          room: '20秒前',
          content: '我去我去！好久没运动了',
          time: '08/31 16:33',
          type: 'normal',
          avatar: null
        },
        {
          id: 7,
          username: '宿管阿姨',
          level: '管理员',
          room: '15秒前',
          content: '提醒大家：明天上午10点会有宿舍安全检查，请大家整理好内务',
          time: '08/31 16:38',
          type: 'admin',
          avatar: null
        },
        {
          id: 8,
          username: '小刘',
          level: 'C栋207',
          room: '10秒前',
          content: '收到！我们宿舍已经准备好了',
          time: '08/31 16:40',
          type: 'normal',
          avatar: null
        },
        {
          id: 9,
          username: '阿强',
          level: 'A栋101',
          room: '8秒前',
          content: '有人丢了一把黑色雨伞吗？在一楼大厅捡到的',
          time: '08/31 16:42',
          type: 'normal',
          avatar: null
        },
        {
          id: 10,
          username: '小美',
          level: 'D栋402',
          room: '5秒前',
          content: '是我的！谢谢你，我马上下来拿',
          time: '08/31 16:43',
          type: 'normal',
          avatar: null
        },
        {
          id: 11,
          username: '学习委员',
          level: 'B栋305',
          room: '3秒前',
          content: '下周一有英语四级模拟考试，有需要复习资料的同学可以找我',
          time: '08/31 16:45',
          type: 'normal',
          avatar: null
        },
        {
          id: 12,
          username: '小陈',
          level: 'C栋506',
          room: '2秒前',
          content: '我需要！能发一份给我吗？',
          time: '08/31 16:46',
          type: 'normal',
          avatar: null
        },
        {
          id: 13,
          username: '技术宅',
          level: 'A栋203',
          room: '1秒前',
          content: '宿舍WiFi又卡了，有人知道怎么解决吗？',
          time: '08/31 16:47',
          type: 'normal',
          avatar: null
        },
        {
          id: 14,
          username: '网管小哥',
          level: '技术部',
          room: '刚刚',
          content: '可以重启一下路由器试试，或者联系我们技术部',
          time: '08/31 16:48',
          type: 'admin',
          avatar: null
        },
        {
          id: 15,
          username: '夜猫子',
          level: 'D栋108',
          room: '刚刚',
          content: '今晚有人一起看电影吗？新上映的那部科幻片',
          time: '08/31 16:49',
          type: 'normal',
          avatar: null
        },
        {
          id: 16,
          username: '电影迷',
          level: 'B栋401',
          room: '刚刚',
          content: '我要去！几点开始？',
          time: '08/31 16:50',
          type: 'normal',
          avatar: null
        },
        {
          id: 17,
          username: '小吃货',
          level: 'C栋302',
          room: '刚刚',
          content: '楼下新开的奶茶店有优惠，买二送一！',
          time: '08/31 16:51',
          type: 'normal',
          avatar: null
        },
        {
          id: 18,
          username: '减肥中',
          level: 'A栋504',
          room: '刚刚',
          content: '不行不行，我要控制住自己...',
          time: '08/31 16:52',
          type: 'normal',
          avatar: null
        },
        {
          id: 19,
          username: '学霸',
          level: 'D栋201',
          room: '刚刚',
          content: '明天的高数作业有人会做第三题吗？求助！',
          time: '08/31 16:53',
          type: 'normal',
          avatar: null
        },
        {
          id: 20,
          username: '数学天才',
          level: 'C栋405',
          room: '刚刚',
          content: '我会！晚上可以一起讨论',
          time: '08/31 16:54',
          type: 'normal',
          avatar: null
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    sendMessage() {
      if (!this.newMessage.trim()) return
      
      const message = {
        id: Date.now(),
        username: '我',
        level: 'LV5',
        room: 'A栋302',
        content: this.newMessage.trim(),
        time: new Date().toLocaleString('zh-CN', { 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }).replace(/\//g, '/'),
        type: 'self',
        avatar: null
      }
      
      this.messages.push(message)
      this.newMessage = ''
      
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      container.scrollTop = container.scrollHeight
    }
  },
  mounted() {
    this.scrollToBottom()
  }
}
</script>

<style scoped>
.dorm-chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* 头部样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #f0f0f0;
}

.group-info {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.group-status {
  font-size: 12px;
  color: #999;
}

.menu-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-btn:hover {
  background: #f0f0f0;
}

/* 消息列表样式 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
  max-height: calc(100vh - 140px);
  min-height: 400px;
  scroll-behavior: smooth;
}

/* 自定义滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin: 4px 0;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.messages-container::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.4);
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.message-item:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.user-level {
  background: #4CAF50;
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.message-item.admin .user-level {
  background: #FF9800;
}

.room-info {
  background: #e3f2fd;
  color: #1976d2;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.message-item.admin .room-info {
  background: #fff3e0;
  color: #f57c00;
}

.timestamp {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

.message-text {
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  word-wrap: break-word;
  max-width: 70%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.message-text:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.message-item.self {
  flex-direction: row-reverse;
}

.message-item.self .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-item.self .message-header {
  flex-direction: row-reverse;
}

.message-item.self .message-text {
  background: #1976d2;
  color: white;
}

/* 输入区域样式 */
.input-area {
  background: white;
  border-top: 1px solid #e5e5e5;
  padding: 12px 16px;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tool-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.tool-btn:hover {
  background: #f0f0f0;
}

.input-box {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-box textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  resize: none;
  min-height: 36px;
  max-height: 100px;
  font-family: inherit;
}

.input-box textarea:focus {
  outline: none;
  border-color: #1976d2;
}

.send-btn {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 36px;
}

.send-btn:hover:not(:disabled) {
  background: #1565c0;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 10px 12px;
  }
  
  .group-name {
    font-size: 14px;
  }
  
  .messages-container {
    padding: 12px;
  }
  
  .message-item {
    margin-bottom: 12px;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
  }
  
  .input-area {
    padding: 10px 12px;
  }
}
</style>