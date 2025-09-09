import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173, // 修正为正确的端口
    open: true,
    proxy: {
      // 代理所有 /api 请求到 Django 后端
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
        // 注意：不要 rewrite，让后端直接处理 /api 路径
      },
      // 代理 Django admin 请求
      '/admin': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      // 代理静态文件请求
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      // 代理媒体文件请求
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
