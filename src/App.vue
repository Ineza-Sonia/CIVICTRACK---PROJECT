<template>
  <div id="app-wrapper">

    <!-- WCAG: Skip navigation -->
    <SkipToMain />

    <!-- ARIA live region for screen reader announcements -->
    <div
      id="a11y-announcer"
      aria-live="polite"
      aria-atomic="true"
      role="status"
      class="sr-only"
    ></div>

    <!-- Fixed header -->
    <AppHeader
      :a11y-open="a11yOpen"
      @open-a11y="a11yOpen = true"
    />

    <!-- Accessibility toolbar panel -->
    <AccessibilityToolbar
      :is-open="a11yOpen"
      @close="a11yOpen = false"
    />

    <!-- Page content -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <!-- Footer (hidden on auth pages for a cleaner look) -->
    <AppFooter v-if="showFooter" />

    <!-- Global toast container -->
    <BaseToast />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAccessibilityStore } from '@/store/useAccessibilityStore'
import { useAuthStore }          from '@/store/useAuthStore'
import SkipToMain           from '@/components/layout/SkipToMain.vue'
import AppHeader            from '@/components/layout/AppHeader.vue'
import AppFooter            from '@/components/layout/AppFooter.vue'
import AccessibilityToolbar from '@/components/ui/AccessibilityToolbar.vue'
import BaseToast            from '@/components/ui/BaseToast.vue'

const route  = useRoute()
const a11y   = useAccessibilityStore()
const auth   = useAuthStore()

const a11yOpen = ref(false)

// Hide footer on dashboard routes — they have their own full-screen layouts
const showFooter = computed(() =>
  ![ '/dashboard', '/admin' ].includes(route.path)
)

// Boot: load stored preferences and seed admin user
a11y.loadPreferences()
auth.init()
</script>

<style>
/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Respect reduced-motion preference */
[data-reduced-motion="true"] .page-enter-active,
[data-reduced-motion="true"] .page-leave-active {
  transition: opacity 80ms ease;
}
[data-reduced-motion="true"] .page-enter-from,
[data-reduced-motion="true"] .page-leave-to {
  transform: none;
}
</style>