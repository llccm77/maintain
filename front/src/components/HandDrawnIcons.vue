<template>
  <div class="hand-drawn-icons">
    <!-- 根据传入的type显示对应的手绘图标 -->
    <svg v-if="type === 'house'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <path d="M15 85 L15 45 Q15 40 20 35 L45 15 Q50 10 55 15 L80 35 Q85 40 85 45 L85 85 Q85 90 80 90 L20 90 Q15 90 15 85 Z" 
            fill="currentColor" stroke="currentColor" stroke-width="2" opacity="0.8"/>
      <rect x="35" y="65" width="12" height="20" rx="2" fill="rgba(255,255,255,0.3)"/>
      <rect x="53" y="65" width="12" height="20" rx="2" fill="rgba(255,255,255,0.3)"/>
      <path d="M25 50 Q30 45 35 50 Q40 55 45 50 Q50 45 55 50 Q60 55 65 50 Q70 45 75 50" 
            stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="42" cy="75" r="1" fill="rgba(255,255,255,0.6)"/>
      <circle cx="58" cy="75" r="1" fill="rgba(255,255,255,0.6)"/>
    </svg>

    <svg v-else-if="type === 'repair'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <path d="M20 80 Q18 78 20 76 L35 61 Q37 59 39 61 L45 67 Q47 69 49 67 L75 41 Q77 39 79 41 L85 47 Q87 49 85 51 L59 77 Q57 79 55 77 L49 71 Q47 69 45 71 L30 86 Q28 88 26 86 L20 80 Z" 
            fill="currentColor" stroke="currentColor" stroke-width="1.5" opacity="0.9"/>
      <circle cx="82" cy="44" r="3" fill="rgba(255,255,255,0.4)"/>
      <path d="M25 83 Q23 81 25 79" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none"/>
      <path d="M40 64 L52 74" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
      <!-- 可爱的表情 -->
      <circle cx="65" cy="55" r="1.5" fill="rgba(255,255,255,0.8)"/>
      <circle cx="70" cy="60" r="1" fill="rgba(255,255,255,0.6)"/>
    </svg>

    <svg v-else-if="type === 'user'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <circle cx="50" cy="35" r="18" fill="currentColor" opacity="0.8"/>
      <path d="M20 85 Q20 65 35 60 Q42 58 50 58 Q58 58 65 60 Q80 65 80 85 Q80 90 75 90 L25 90 Q20 90 20 85 Z" 
            fill="currentColor" opacity="0.8"/>
      <!-- 可爱的脸部特征 -->
      <circle cx="45" cy="32" r="2" fill="rgba(255,255,255,0.9)"/>
      <circle cx="55" cy="32" r="2" fill="rgba(255,255,255,0.9)"/>
      <path d="M47 40 Q50 43 53 40" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" fill="none"/>
      <!-- 头发 -->
      <path d="M35 25 Q40 20 45 25 Q50 18 55 25 Q60 20 65 25" 
            stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="none"/>
    </svg>

    <svg v-else-if="type === 'manage'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <rect x="20" y="25" width="60" height="50" rx="5" fill="currentColor" opacity="0.8"/>
      <rect x="25" y="30" width="50" height="8" rx="2" fill="rgba(255,255,255,0.4)"/>
      <rect x="25" y="42" width="35" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
      <rect x="25" y="52" width="40" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
      <rect x="25" y="62" width="30" height="6" rx="1" fill="rgba(255,255,255,0.3)"/>
      <!-- 可爱的装饰 -->
      <circle cx="70" cy="45" r="2" fill="rgba(255,255,255,0.6)"/>
      <circle cx="70" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
      <circle cx="70" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
      <!-- 小星星装饰 -->
      <path d="M15 20 L17 22 L15 24 L13 22 Z" fill="rgba(255,255,255,0.5)"/>
      <path d="M85 15 L87 17 L85 19 L83 17 Z" fill="rgba(255,255,255,0.5)"/>
    </svg>

    <svg v-else-if="type === 'chart'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <path d="M15 85 L15 15 Q15 10 20 15 L85 15 Q90 15 85 20 L85 85 Q85 90 80 85 L20 85 Q15 85 15 85 Z" 
            fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="2"/>
      <!-- 手绘柱状图 -->
      <rect x="25" y="65" width="8" height="15" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="38" y="55" width="8" height="25" rx="2" fill="currentColor" opacity="0.8"/>
      <rect x="51" y="45" width="8" height="35" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="64" y="35" width="8" height="45" rx="2" fill="currentColor" opacity="0.8"/>
      <!-- 可爱的趋势线 -->
      <path d="M29 70 Q42 60 55 50 Q68 40 75 35" 
            stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none"/>
      <!-- 小装饰点 -->
      <circle cx="29" cy="70" r="2" fill="rgba(255,255,255,0.8)"/>
      <circle cx="55" cy="50" r="2" fill="rgba(255,255,255,0.8)"/>
      <circle cx="75" cy="35" r="2" fill="rgba(255,255,255,0.8)"/>
    </svg>

    <svg v-else-if="type === 'heart'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <path d="M50 85 Q30 65 20 45 Q15 35 25 30 Q35 25 45 35 Q50 40 50 40 Q50 40 55 35 Q65 25 75 30 Q85 35 80 45 Q70 65 50 85 Z" 
            fill="currentColor" opacity="0.8"/>
      <!-- 可爱的高光 -->
      <circle cx="40" cy="40" r="3" fill="rgba(255,255,255,0.6)"/>
      <circle cx="35" cy="45" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <!-- 小星星 -->
      <path d="M25 25 L27 27 L25 29 L23 27 Z" fill="rgba(255,255,255,0.5)"/>
      <path d="M75 25 L77 27 L75 29 L73 27 Z" fill="rgba(255,255,255,0.5)"/>
    </svg>

    <svg v-else-if="type === 'star'" :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <path d="M50 15 Q52 35 60 40 Q80 45 65 55 Q70 75 50 65 Q30 75 35 55 Q20 45 40 40 Q48 35 50 15 Z" 
            fill="currentColor" opacity="0.8"/>
      <!-- 内部装饰 -->
      <circle cx="50" cy="45" r="8" fill="rgba(255,255,255,0.3)"/>
      <circle cx="50" cy="45" r="3" fill="rgba(255,255,255,0.6)"/>
      <!-- 闪烁效果 -->
      <path d="M45 20 L47 22 L45 24 L43 22 Z" fill="rgba(255,255,255,0.7)"/>
      <path d="M65 35 L67 37 L65 39 L63 37 Z" fill="rgba(255,255,255,0.5)"/>
      <path d="M35 60 L37 62 L35 64 L33 62 Z" fill="rgba(255,255,255,0.5)"/>
    </svg>

    <!-- 默认图标 -->
    <svg v-else :width="size" :height="size" viewBox="0 0 100 100" class="hand-drawn-icon">
      <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.8"/>
      <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)"/>
      <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.6)"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'HandDrawnIcons',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['house', 'repair', 'user', 'manage', 'chart', 'heart', 'star', 'default'].includes(value)
      }
    },
    size: {
      type: [String, Number],
      default: 24
    }
  }
}
</script>

<style scoped>
.hand-drawn-icons {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hand-drawn-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.hand-drawn-icon:hover {
  transform: scale(1.1) rotate(2deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* 添加一些可爱的动画效果 */
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}

.hand-drawn-icon {
  animation: wiggle 3s ease-in-out infinite;
}
</style>