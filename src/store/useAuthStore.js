import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ct_auth'
const USERS_KEY   = 'ct_users'

const DEFAULT_ADMIN = {
  id:        'admin-001',
  fullName:  'System Administrator',
  email:     'admin@civictrack.gov',
  password:  'Admin@2024',
  role:      'admin',
  createdAt: new Date().toISOString()
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isLoading   = ref(false)
  const error       = ref('')

  const isLoggedIn = computed(() => !!currentUser.value)
  const isAdmin    = computed(() => currentUser.value?.role === 'admin')
  const isCitizen  = computed(() => currentUser.value?.role === 'citizen')

  function getUsers() {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  }

  function seedAdmin() {
    const users = getUsers()
    if (!users.find(u => u.email === DEFAULT_ADMIN.email)) {
      users.push(DEFAULT_ADMIN)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  }

  function init() {
    seedAdmin()
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const user = JSON.parse(saved)
        if (user && typeof user === 'object' && user.id && user.email && user.role) {
          currentUser.value = user
        }
      } catch (_) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  function login(email, password) {
    isLoading.value = true
    error.value     = ''
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers()
        const user  = users.find(
          u => u.email === email.trim().toLowerCase() && u.password === password
        )
        if (user) {
          const { password: _, ...safeUser } = user
          currentUser.value = safeUser
          localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
          isLoading.value = false
          resolve(safeUser)
        } else {
          error.value     = 'Invalid email or password. Please try again.'
          isLoading.value = false
          reject(new Error(error.value))
        }
      }, 600)
    })
  }

  function register(data) {
    isLoading.value = true
    error.value     = ''
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers()
        if (users.find(u => u.email === data.email.trim().toLowerCase())) {
          error.value     = 'An account with this email already exists.'
          isLoading.value = false
          reject(new Error(error.value))
          return
        }
        const newUser = {
          id:        `user-${Date.now()}`,
          fullName:  data.fullName.trim(),
          email:     data.email.trim().toLowerCase(),
          password:  data.password,
          phone:     data.phone || '',
          role:      'citizen',
          createdAt: new Date().toISOString()
        }
        users.push(newUser)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        const { password: _, ...safeUser } = newUser
        currentUser.value = safeUser
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
        isLoading.value = false
        resolve(safeUser)
      }, 700)
    })
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  function getAllUsers() {
    return getUsers().map(({ password: _, ...u }) => u)
  }

  return {
    currentUser, isLoading, error,
    isLoggedIn, isAdmin, isCitizen,
    init, login, register, logout, getAllUsers
  }
})