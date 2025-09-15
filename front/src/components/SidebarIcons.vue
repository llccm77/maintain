<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    class="sidebar-icon"
    :class="`icon-${type}`"
  >
    <!-- 小电脑图标 (数据仪表盘) -->
    <g v-if="type === 'computer'">
      <rect x="8" y="12" width="24" height="16" rx="2" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1.5"/>
      <rect x="10" y="14" width="20" height="10" rx="1" fill="#87CEEB" opacity="0.7"/>
      <rect x="17" y="28" width="6" height="4" rx="1" fill="#FF69B4"/>
      <rect x="14" y="32" width="12" height="2" rx="1" fill="#DDA0DD"/>
      <!-- 学士帽 -->
      <rect x="12" y="8" width="16" height="2" rx="1" fill="#8B4513"/>
      <polygon points="20,6 16,10 24,10" fill="#8B4513"/>
      <circle cx="26" cy="8" r="1" fill="#FFD700"/>
      <!-- 屏幕内容 -->
      <rect x="12" y="16" width="16" height="1" rx="0.5" fill="#FF69B4" opacity="0.6"/>
      <rect x="12" y="18" width="12" height="1" rx="0.5" fill="#FF69B4" opacity="0.4"/>
      <rect x="12" y="20" width="14" height="1" rx="0.5" fill="#FF69B4" opacity="0.5"/>
    </g>

    <!-- 工具箱小人图标 (工单管理) -->
    <g v-if="type === 'worker'">
      <!-- 小人身体 -->
      <circle cx="20" cy="8" r="3" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
      <rect x="17" y="11" width="6" height="8" rx="2" fill="#87CEEB" stroke="#4682B4" stroke-width="1"/>
      <rect x="15" y="19" width="3" height="6" rx="1" fill="#DDA0DD"/>
      <rect x="22" y="19" width="3" height="6" rx="1" fill="#DDA0DD"/>
      <!-- 工具箱 -->
      <rect x="25" y="14" width="8" height="6" rx="1" fill="#F0E68C" stroke="#DAA520" stroke-width="1"/>
      <rect x="26" y="12" width="6" height="2" rx="0.5" fill="#DAA520"/>
      <circle cx="29" cy="13" r="0.5" fill="#8B4513"/>
      <!-- 工具 -->
      <rect x="27" y="16" width="1" height="3" fill="#FF69B4"/>
      <rect x="29" y="16" width="1" height="3" fill="#4682B4"/>
      <rect x="31" y="16" width="1" height="3" fill="#32CD32"/>
      <!-- 手臂连接工具箱 -->
      <rect x="23" y="13" width="3" height="1" rx="0.5" fill="#FFB6C1"/>
    </g>

    <!-- 温馨小房子图标 (宿舍管理) -->
    <g v-if="type === 'house'">
      <path d="M20 6L8 16v18h24V16L20 6z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="14" y="24" width="4" height="8" fill="#87CEEB" stroke="#4682B4" stroke-width="1" rx="1"/>
      <rect x="22" y="24" width="4" height="6" fill="#F0E68C" stroke="#DAA520" stroke-width="1" rx="1"/>
      <circle cx="16" cy="28" r="0.5" fill="#4682B4"/>
      <rect x="23" y="26" width="2" height="2" fill="rgba(255,255,255,0.7)"/>
      <!-- 烟囱 -->
      <rect x="26" y="10" width="3" height="8" rx="0.5" fill="#8B4513"/>
      <ellipse cx="27.5" cy="8" rx="2" ry="1" fill="rgba(255,255,255,0.8)"/>
      <!-- 心形装饰 -->
      <path d="M20 12c-1-2 -4-2 -4 0c0 2 4 4 4 4s4-2 4-4c0-2 -3-2 -4 0z" fill="#FF69B4" opacity="0.6"/>
    </g>

    <!-- 笑脸齿轮图标 (系统管理) -->
    <g v-if="type === 'gear'">
      <!-- 齿轮外圈 -->
      <circle cx="20" cy="20" r="10" fill="#DDA0DD" stroke="#9370DB" stroke-width="1.5"/>
      <!-- 齿轮齿 -->
      <rect x="19" y="8" width="2" height="4" rx="1" fill="#9370DB"/>
      <rect x="19" y="28" width="2" height="4" rx="1" fill="#9370DB"/>
      <rect x="8" y="19" width="4" height="2" rx="1" fill="#9370DB"/>
      <rect x="28" y="19" width="4" height="2" rx="1" fill="#9370DB"/>
      <rect x="12.5" y="12.5" width="3" height="2" rx="1" fill="#9370DB" transform="rotate(45 14 13.5)"/>
      <rect x="24.5" y="24.5" width="3" height="2" rx="1" fill="#9370DB" transform="rotate(45 26 25.5)"/>
      <rect x="24.5" y="12.5" width="3" height="2" rx="1" fill="#9370DB" transform="rotate(-45 26 13.5)"/>
      <rect x="12.5" y="24.5" width="3" height="2" rx="1" fill="#9370DB" transform="rotate(-45 14 25.5)"/>
      <!-- 内圈 -->
      <circle cx="20" cy="20" r="6" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
      <!-- 笑脸 -->
      <circle cx="17" cy="17" r="1" fill="#FF69B4"/>
      <circle cx="23" cy="17" r="1" fill="#FF69B4"/>
      <path d="M16 22 Q20 25 24 22" stroke="#FF69B4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- 中心孔 -->
      <circle cx="20" cy="20" r="2" fill="#F0E68C" stroke="#DAA520" stroke-width="1"/>
    </g>

    <!-- 管理员头像图标 -->
    <g v-if="type === 'admin'">
      <!-- 头部 -->
      <circle cx="20" cy="12" r="6" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1.5"/>
      <!-- 身体 -->
      <rect x="14" y="18" width="12" height="14" rx="6" fill="#87CEEB" stroke="#4682B4" stroke-width="1.5"/>
      <!-- 眼镜 -->
      <circle cx="17" cy="11" r="2" fill="rgba(255,255,255,0.8)" stroke="#8B4513" stroke-width="1"/>
      <circle cx="23" cy="11" r="2" fill="rgba(255,255,255,0.8)" stroke="#8B4513" stroke-width="1"/>
      <rect x="19" y="10.5" width="2" height="1" rx="0.5" fill="#8B4513"/>
      <!-- 眼睛 -->
      <circle cx="17" cy="11" r="0.8" fill="#4682B4"/>
      <circle cx="23" cy="11" r="0.8" fill="#4682B4"/>
      <!-- 微笑 -->
      <path d="M16 14 Q20 16 24 14" stroke="#FF69B4" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <!-- 扳手 -->
      <rect x="26" y="20" width="2" height="8" rx="1" fill="#F0E68C" stroke="#DAA520" stroke-width="1" transform="rotate(15 27 24)"/>
      <circle cx="27" cy="21" r="1.5" fill="none" stroke="#DAA520" stroke-width="1" transform="rotate(15 27 24)"/>
      <!-- 帽子装饰 -->
      <ellipse cx="20" cy="6" rx="4" ry="1.5" fill="#DDA0DD" opacity="0.7"/>
    </g>
  </svg>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['computer', 'worker', 'house', 'gear', 'admin'].includes(value)
  },
  size: {
    type: [Number, String],
    default: 24
  }
})

const viewBox = '0 0 40 40'
</script>

<style scoped>
.sidebar-icon {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.sidebar-icon:hover {
  transform: scale(1.1) rotate(2deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.icon-computer:hover {
  animation: wiggle 0.6s ease-in-out;
}

.icon-worker:hover {
  animation: bounce 0.6s ease-in-out;
}

.icon-house:hover {
  animation: float 0.8s ease-in-out;
}

.icon-gear:hover {
  animation: spin 0.8s ease-in-out;
}

.icon-admin:hover {
  animation: nod 0.6s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg) scale(1.1); }
  25% { transform: rotate(2deg) scale(1.15); }
  75% { transform: rotate(-2deg) scale(1.15); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1.1); }
  50% { transform: translateY(-4px) scale(1.15); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1.1); }
  50% { transform: translateY(-2px) scale(1.12); }
}

@keyframes spin {
  0% { transform: rotate(0deg) scale(1.1); }
  100% { transform: rotate(180deg) scale(1.1); }
}

@keyframes nod {
  0%, 100% { transform: translateY(0) scale(1.1); }
  50% { transform: translateY(-1px) scale(1.12); }
}
</style>