import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isLoading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_staff || user.value?.is_superuser)

  // 动作
  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await api.auth.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      // 保存到本地存储
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.warn('登出请求失败，但继续清除本地数据', error)
    } finally {
      // 清除状态和本地存储
      token.value = ''
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const getCurrentUser = async () => {
    if (!token.value) return null
    
    try {
      const response = await api.auth.getCurrentUser()
      user.value = response.data
      return response.data
    } catch (error) {
      // 如果获取用户信息失败，清除认证状态
      await logout()
      throw error
    }
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析保存的用户数据失败', error)
        logout()
      }
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    
    // 动作
    login,
    logout,
    getCurrentUser,
    initAuth
  }
})

export const useSystemStore = defineStore('system', () => {
  // 状态
  const statistics = ref({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    total_students: 0,
    total_dormitories: 0
  })
  
  const systemInfo = ref({
    name: '',
    version: '',
    backend: ''
  })
  
  const isLoading = ref(false)

  // 动作
  const fetchSystemInfo = async () => {
    isLoading.value = true
    try {
      const response = await api.system.getSystemInfo()
      statistics.value = response.statistics
      systemInfo.value = response.system
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const healthCheck = async () => {
    try {
      const response = await api.system.healthCheck()
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    // 状态
    statistics,
    systemInfo,
    isLoading,
    
    // 动作
    fetchSystemInfo,
    healthCheck
  }
})

export const useRepairStore = defineStore('repair', () => {
  // 状态
  const orders = ref([])
  const currentOrder = ref(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const isLoading = ref(false)

  // 动作
  const fetchOrders = async (params = {}) => {
    isLoading.value = true
    try {
      const response = await api.repair.list({
        page: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params
      })
      
      orders.value = response.data.results
      pagination.value.total = response.data.count
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createOrder = async (orderData) => {
    try {
      const response = await api.repair.create(orderData)
      // 重新获取列表
      await fetchOrders()
      return response
    } catch (error) {
      throw error
    }
  }

  const updateOrder = async (id, orderData) => {
    try {
      const response = await api.repair.update(id, orderData)
      // 更新本地状态
      const index = orders.value.findIndex(order => order.id === id)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data }
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const deleteOrder = async (id) => {
    try {
      const response = await api.repair.delete(id)
      // 从本地状态中移除
      orders.value = orders.value.filter(order => order.id !== id)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    // 状态
    orders,
    currentOrder,
    pagination,
    isLoading,
    
    // 动作
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder
  }
})