import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/LandingPage.vue'),
    meta: { title: 'CIVICTRACK — Your Voice, Your Community' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: 'Sign In — CIVICTRACK', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { title: 'Create Account — CIVICTRACK', guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/UserDashboard.vue'),
    meta: { title: 'My Dashboard — CIVICTRACK', requiresAuth: true, requiresRole: 'citizen' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { title: 'Admin Panel — CIVICTRACK', requiresAuth: true, requiresRole: 'admin' }
  },
  {
    // Catch-all — redirect unknown paths home
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash)       return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

// ── Navigation guards ──────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  // Update document title
  document.title = to.meta.title || 'CIVICTRACK'

  const auth = useAuthStore()

  // Protected routes: require valid logged-in session
  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn || !auth.currentUser) {
      return next({ name: 'login' })
    }
  }

  // Role-specific routes
  if (to.meta.requiresRole) {
    if (to.meta.requiresRole === 'admin'   && !auth.isAdmin)   return next({ name: 'dashboard' })
    if (to.meta.requiresRole === 'citizen' && !auth.isCitizen) return next({ name: 'admin'     })
  }

  // Guest-only: redirect authenticated users to their dashboard
  if (to.meta.guestOnly && auth.isLoggedIn && auth.currentUser) {
    return next(auth.isAdmin ? { name: 'admin' } : { name: 'dashboard' })
  }

  next()
})

export default router