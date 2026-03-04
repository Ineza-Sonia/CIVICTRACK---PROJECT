<template>
  <header class="app-header" role="banner">
    <nav class="header-nav container" aria-label="Main navigation">

      <!-- Logo -->
      <router-link to="/" class="logo" aria-label="CIVICTRACK — Go to home page">
        <span class="logo-mark" aria-hidden="true">
          <ShieldCheck :size="20" />
        </span>
        <span class="logo-text">
          CIVIC<span class="logo-accent">TRACK</span>
        </span>
      </router-link>

      <!-- Desktop nav -->
      <ul class="nav-links" role="list">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="nav-link"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>

      <!-- Right side actions -->
      <div class="header-actions">

        <!-- Accessibility toolbar toggle -->
        <button
          class="icon-btn touch-target"
          @click="$emit('open-a11y')"
          :aria-expanded="a11yOpen"
          aria-label="Open accessibility settings panel"
          aria-haspopup="dialog"
        >
          <Accessibility :size="20" />
        </button>

        <!-- Guest buttons -->
        <template v-if="!isLoggedIn">
          <router-link to="/login"    class="btn btn-ghost btn-sm">Sign In</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">Get Started</router-link>
        </template>

        <!-- Logged-in user menu -->
        <template v-else>
          <div class="user-menu" ref="menuRef">
            <button
              class="user-btn touch-target"
              @click="menuOpen = !menuOpen"
              :aria-expanded="menuOpen"
              aria-haspopup="true"
              aria-label="Open user menu"
            >
              <div class="avatar" aria-hidden="true">{{ userInitials }}</div>
              <ChevronDown :size="14" aria-hidden="true" />
            </button>

            <div
              v-if="menuOpen"
              class="dropdown"
              role="menu"
              aria-label="User account menu"
            >
              <div class="dropdown-header" role="presentation">
                <p class="dropdown-name">{{ currentUser?.fullName }}</p>
                <p class="dropdown-email">{{ currentUser?.email }}</p>
              </div>
              <hr class="divider" />
              <router-link
                :to="isAdmin ? '/admin' : '/dashboard'"
                class="dropdown-item"
                role="menuitem"
                @click="menuOpen = false"
              >
                <LayoutDashboard :size="15" aria-hidden="true" />
                Dashboard
              </router-link>
              <button
                class="dropdown-item"
                role="menuitem"
                @click="handleLogout"
              >
                <LogOut :size="15" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </template>

        <!-- Mobile hamburger -->
        <button
          class="mobile-menu-btn icon-btn touch-target"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
        >
          <Menu v-if="!mobileOpen" :size="22" />
          <X    v-else             :size="22" />
        </button>
      </div>
    </nav>

    <!-- Mobile nav drawer -->
    <div
      v-if="mobileOpen"
      id="mobile-nav"
      class="mobile-menu"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul role="list">
        <li v-for="link in navLinks" :key="link.to">
          <router-link
            :to="link.to"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>
      <div v-if="!isLoggedIn" class="mobile-auth">
        <router-link to="/login"    class="btn btn-ghost w-full"    @click="mobileOpen = false">Sign In</router-link>
        <router-link to="/register" class="btn btn-primary w-full"  @click="mobileOpen = false">Get Started</router-link>
      </div>
      <div v-else class="mobile-auth">
        <router-link
          :to="isAdmin ? '/admin' : '/dashboard'"
          class="btn btn-ghost w-full"
          @click="mobileOpen = false"
        >
          <LayoutDashboard :size="16" aria-hidden="true" /> Dashboard
        </router-link>
        <button class="btn btn-ghost w-full" @click="handleLogout">
          <LogOut :size="16" aria-hidden="true" /> Sign Out
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import {
  ShieldCheck, Accessibility, ChevronDown,
  LayoutDashboard, LogOut, Menu, X
} from 'lucide-vue-next'

defineProps({ a11yOpen: Boolean })
defineEmits(['open-a11y'])

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const menuOpen   = ref(false)
const mobileOpen = ref(false)
const menuRef    = ref(null)

const isLoggedIn   = computed(() => auth.isLoggedIn)
const isAdmin      = computed(() => auth.isAdmin)
const currentUser  = computed(() => auth.currentUser)
const userInitials = computed(() => {
  const name = currentUser.value?.fullName || ''
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const navLinks = computed(() => {
  const links = [{ to: '/', label: 'Home' }]
  if (isLoggedIn.value) {
    links.push({ to: isAdmin.value ? '/admin' : '/dashboard', label: 'Dashboard' })
  }
  return links
})

function isActive(path) {
  return route.path === path
}

async function handleLogout() {
  menuOpen.value   = false
  mobileOpen.value = false
  auth.logout()
  await router.push('/')
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(()  => document.addEventListener('click', onClickOutside))
onUnmounted(()=> document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: var(--header-blur);
  -webkit-backdrop-filter: var(--header-blur);
  border-bottom: 1px solid var(--border-subtle);
  height: var(--header-height);
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: var(--space-6);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--text-primary);
  flex-shrink: 0;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--accent-primary);
  color: #fff;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
[data-theme="high-contrast"] .logo-mark {
  background: #fff;
  color: #000;
}

.logo-text {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  letter-spacing: 0.06em;
}

.logo-accent { color: var(--accent-primary); }

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color var(--duration-fast), background var(--duration-fast);
}

.nav-link:hover,
.nav-link[aria-current="page"] {
  color: var(--accent-primary);
  background: var(--accent-subtle);
}

/* Right actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: color var(--duration-fast), background var(--duration-fast);
  flex-shrink: 0;
}

.icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-surface-2);
}

/* Auth buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
  text-decoration: none;
  border: var(--border-width) solid transparent;
  transition: all var(--duration-fast);
  cursor: pointer;
  font-family: var(--font-body);
  white-space: nowrap;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--text-on-primary);
  border-color: var(--accent-primary);
}
.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: var(--text-on-primary);
}

.btn-ghost {
  color: var(--text-secondary);
  border-color: var(--border-default);
  background: transparent;
}
.btn-ghost:hover {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

.btn-sm {
  padding: 6px var(--space-4);
  font-size: var(--text-xs);
  min-height: 34px;
}

/* User dropdown */
.user-menu { position: relative; }

.user-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: background var(--duration-fast), color var(--duration-fast);
  cursor: pointer;
  height: 40px;
}
.user-btn:hover {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background: var(--accent-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 210px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: scaleIn var(--duration-fast) var(--ease-out);
  transform-origin: top right;
  z-index: 200;
}

.dropdown-header {
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface-2);
}
.dropdown-name  { font-size: var(--text-sm); font-weight: 700; color: var(--text-primary); }
.dropdown-email { font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 2px; }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: background var(--duration-fast), color var(--duration-fast);
  cursor: pointer;
  text-align: left;
  background: none;
  font-family: var(--font-body);
}
.dropdown-item:hover {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

/* Mobile */
.mobile-menu-btn { display: none; }

.mobile-menu {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-4);
  animation: fadeInUp var(--duration-fast) var(--ease-out);
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  z-index: 99;
  box-shadow: var(--shadow-lg);
}

.mobile-nav-link {
  display: block;
  padding: var(--space-3) var(--space-4);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: background var(--duration-fast), color var(--duration-fast);
}
.mobile-nav-link:hover,
.mobile-nav-link[aria-current="page"] {
  background: var(--accent-subtle);
  color: var(--accent-primary);
}

.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

.w-full { width: 100%; justify-content: center; }

@media (max-width: 768px) {
  .nav-links              { display: none; }
  .header-actions .btn    { display: none; }
  .mobile-menu-btn        { display: flex; }
}
</style>