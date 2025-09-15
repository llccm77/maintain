<template>
  <div class="status-icon" :class="`icon-${type}`" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- 新工单 - 正在打开的信封 -->
    <svg v-if="type === 'envelope'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 信封底部 -->
      <rect x="15" y="35" width="70" height="45" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="2" rx="3"/>
      <!-- 信封盖子 -->
      <polygon points="15,35 50,55 85,35" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="2"/>
      <!-- 信封边缘装饰 -->
      <path d="M15,35 L50,55 L85,35" stroke="#FF6B6B" stroke-width="1" fill="none" stroke-dasharray="2,2"/>
      <!-- 小心形装饰 -->
      <circle cx="25" cy="65" r="2" fill="#FF6B6B" opacity="0.6"/>
      <circle cx="75" cy="65" r="2" fill="#FF6B6B" opacity="0.6"/>
    </svg>

    <!-- 维修中 - 正在拧螺丝的小人 -->
    <svg v-else-if="type === 'worker'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 小人头部 -->
      <circle cx="50" cy="25" r="8" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="1.5"/>
      <!-- 安全帽 -->
      <ellipse cx="50" cy="22" rx="9" ry="6" fill="#4A90E2" stroke="#357ABD" stroke-width="1"/>
      <!-- 身体 -->
      <rect x="45" y="33" width="10" height="25" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="2"/>
      <!-- 左臂 -->
      <line x1="45" y1="40" x2="35" y2="45" stroke="#FFE5CC" stroke-width="3" stroke-linecap="round"/>
      <!-- 右臂（拿工具） -->
      <line x1="55" y1="40" x2="65" y2="35" stroke="#FFE5CC" stroke-width="3" stroke-linecap="round"/>
      <!-- 扳手 -->
      <rect x="63" y="32" width="8" height="3" fill="#A0A0A0" stroke="#808080" stroke-width="1" rx="1"/>
      <circle cx="67" cy="30" r="2" fill="none" stroke="#808080" stroke-width="1"/>
      <!-- 腿部 -->
      <line x1="47" y1="58" x2="42" y2="75" stroke="#4A90E2" stroke-width="4" stroke-linecap="round"/>
      <line x1="53" y1="58" x2="58" y2="75" stroke="#4A90E2" stroke-width="4" stroke-linecap="round"/>
      <!-- 工具箱 -->
      <rect x="25" y="70" width="15" height="8" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="1" rx="1"/>
      <line x1="27" y1="74" x2="38" y2="74" stroke="#FF6B6B" stroke-width="1"/>
      <!-- 螺丝钉装饰 -->
      <circle cx="75" cy="50" r="1.5" fill="#A0A0A0"/>
      <circle cx="80" cy="55" r="1.5" fill="#A0A0A0"/>
    </svg>

    <!-- 已完成 - 打着勾的笑脸 -->
    <svg v-else-if="type === 'completed'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 笑脸底色 -->
      <circle cx="50" cy="50" r="35" fill="#D4F6D4" stroke="#4CAF50" stroke-width="2"/>
      <!-- 眼睛 -->
      <circle cx="40" cy="42" r="3" fill="#4CAF50"/>
      <circle cx="60" cy="42" r="3" fill="#4CAF50"/>
      <!-- 笑容 -->
      <path d="M35,58 Q50,70 65,58" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 对勾 -->
      <path d="M42,50 L48,56 L58,46" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- 装饰星星 -->
      <polygon points="25,25 27,31 33,31 28,35 30,41 25,37 20,41 22,35 17,31 23,31" fill="#FFD700" opacity="0.8"/>
      <polygon points="75,25 77,31 83,31 78,35 80,41 75,37 70,41 72,35 67,31 73,31" fill="#FFD700" opacity="0.8"/>
    </svg>

    <!-- 已取消 - 叉号表情 -->
    <svg v-else-if="type === 'cancelled'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 底色 -->
      <circle cx="50" cy="50" r="35" fill="#FFE5E5" stroke="#FF6B6B" stroke-width="2"/>
      <!-- 眼睛（X形） -->
      <path d="M37,39 L43,45" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
      <path d="M43,39 L37,45" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
      <path d="M57,39 L63,45" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
      <path d="M63,39 L57,45" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
      <!-- 嘴巴（倒弧形） -->
      <path d="M38,62 Q50,52 62,62" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- 大叉号 -->
      <path d="M42,48 L58,64" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round"/>
      <path d="M58,48 L42,64" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round"/>
    </svg>

    <!-- 宿舍楼 - 手绘风格 -->
    <svg v-else-if="type === 'building'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 主楼体 -->
      <rect x="25" y="40" width="50" height="50" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="2" rx="3"/>
      <!-- 屋顶 -->
      <polygon points="20,40 50,20 80,40" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="2"/>
      <!-- 窗户第一排 -->
      <rect x="32" y="48" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <rect x="46" y="48" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <rect x="60" y="48" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <!-- 窗户第二排 -->
      <rect x="32" y="62" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <rect x="46" y="62" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <rect x="60" y="62" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <!-- 门 -->
      <rect x="44" y="76" width="12" height="14" fill="#8B4513" stroke="#654321" stroke-width="1" rx="1"/>
      <circle cx="53" cy="83" r="1" fill="#FFD700"/>
      <!-- 装饰云朵 -->
      <ellipse cx="15" cy="25" rx="6" ry="4" fill="#F0F8FF" opacity="0.8"/>
      <ellipse cx="85" cy="30" rx="8" ry="5" fill="#F0F8FF" opacity="0.8"/>
    </svg>

    <!-- 小房子 - 温馨版本 -->
    <svg v-else-if="type === 'house'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 房子主体 -->
      <rect x="30" y="50" width="40" height="35" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="2" rx="2"/>
      <!-- 屋顶 -->
      <polygon points="25,50 50,30 75,50" fill="#FF9A8B" stroke="#FF6B6B" stroke-width="2"/>
      <!-- 烟囱 -->
      <rect x="60" y="35" width="6" height="15" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <!-- 烟雾 -->
      <circle cx="63" cy="32" r="2" fill="#F0F8FF" opacity="0.7"/>
      <circle cx="65" cy="28" r="1.5" fill="#F0F8FF" opacity="0.6"/>
      <!-- 门 -->
      <rect x="45" y="65" width="10" height="20" fill="#8B4513" stroke="#654321" stroke-width="1" rx="1"/>
      <circle cx="52" cy="75" r="1" fill="#FFD700"/>
      <!-- 窗户 -->
      <rect x="35" y="58" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <rect x="57" y="58" width="8" height="8" fill="#87CEEB" stroke="#4A90E2" stroke-width="1" rx="1"/>
      <!-- 窗户十字 -->
      <line x1="39" y1="58" x2="39" y2="66" stroke="#4A90E2" stroke-width="0.5"/>
      <line x1="35" y1="62" x2="43" y2="62" stroke="#4A90E2" stroke-width="0.5"/>
      <line x1="61" y1="58" x2="61" y2="66" stroke="#4A90E2" stroke-width="0.5"/>
      <line x1="57" y1="62" x2="65" y2="62" stroke="#4A90E2" stroke-width="0.5"/>
      <!-- 花朵装饰 -->
      <circle cx="25" cy="75" r="3" fill="#FFB6C1"/>
      <circle cx="22" cy="72" r="2" fill="#FF69B4"/>
      <circle cx="28" cy="72" r="2" fill="#FF69B4"/>
      <line x1="25" y1="78" x2="25" y2="85" stroke="#4CAF50" stroke-width="2"/>
    </svg>

    <!-- 管理员头像 - 温馨版本 -->
    <svg v-else-if="type === 'admin'" :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 头部 -->
      <circle cx="50" cy="35" r="18" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="2"/>
      <!-- 帽子 -->
      <ellipse cx="50" cy="25" rx="20" ry="8" fill="#4A90E2" stroke="#357ABD" stroke-width="1"/>
      <rect x="45" y="20" width="10" height="3" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
      <!-- 眼睛 -->
      <circle cx="44" cy="32" r="2" fill="#333"/>
      <circle cx="56" cy="32" r="2" fill="#333"/>
      <!-- 笑容 -->
      <path d="M42,40 Q50,46 58,40" stroke="#FF9A8B" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- 身体 -->
      <rect x="40" y="53" width="20" height="30" fill="#87CEEB" stroke="#4A90E2" stroke-width="2" rx="3"/>
      <!-- 领带 -->
      <polygon points="50,53 47,60 50,75 53,60" fill="#FF6B6B" stroke="#FF4444" stroke-width="1"/>
      <!-- 胳膊 -->
      <ellipse cx="35" cy="65" rx="5" ry="12" fill="#87CEEB" stroke="#4A90E2" stroke-width="1"/>
      <ellipse cx="65" cy="65" rx="5" ry="12" fill="#87CEEB" stroke="#4A90E2" stroke-width="1"/>
      <!-- 手 -->
      <circle cx="35" cy="77" r="4" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="1"/>
      <circle cx="65" cy="77" r="4" fill="#FFE5CC" stroke="#FF9A8B" stroke-width="1"/>
      <!-- 钥匙装饰 -->
      <rect x="62" y="75" width="6" height="2" fill="#FFD700" stroke="#FFA500" stroke-width="0.5" rx="1"/>
      <circle cx="68" cy="76" r="2" fill="none" stroke="#FFD700" stroke-width="1"/>
    </svg>

    <!-- 默认图标 -->
    <svg v-else :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="2"/>
      <text x="50" y="55" text-anchor="middle" font-size="16" fill="#757575">?</text>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => [
      'envelope', 'worker', 'completed', 'cancelled',
      'building', 'house', 'admin'
    ].includes(value)
  },
  size: {
    type: Number,
    default: 24
  }
})
</script>

<style scoped>
.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-icon:hover {
  transform: scale(1.1);
}

.icon-envelope:hover {
  filter: drop-shadow(0 2px 4px rgba(255, 154, 139, 0.3));
}

.icon-worker:hover {
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.3));
}

.icon-completed:hover {
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.icon-cancelled:hover {
  filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3));
}

.icon-building:hover,
.icon-house:hover {
  filter: drop-shadow(0 2px 4px rgba(255, 154, 139, 0.3));
}

.icon-admin:hover {
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.3));
}
</style>