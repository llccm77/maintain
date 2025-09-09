<script setup>
// 空的脚本块，路由组件将处理所有逻辑
</script>

<template>
  <div id="app">
    <!-- 路由出口，所有页面组件将在这里渲染 -->
    <router-view />
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* 通用按钮样式 */
button {
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:focus {
  outline: none;
}

/* 通用输入框样式 */
input, select, textarea {
  font-family: inherit;
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
}

/* 通用动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
</style>