<template>
  <Teleport to="body">
    <div
      class="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions"
    >
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
          role="alert"
          :aria-label="`${toast.type} notification: ${toast.message}`"
        >
          <component
            :is="icons[toast.type]"
            :size="17"
            aria-hidden="true"
            class="toast-icon"
          />
          <p class="toast-message">{{ toast.message }}</p>
          <button
            class="toast-close"
            @click="removeToast(toast.id)"
            :aria-label="`Dismiss: ${toast.message}`"
          >
            <X :size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const icons = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 500;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-end;
  max-width: 380px;
  width: calc(100vw - var(--space-12));
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-left: 4px solid transparent;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  pointer-events: all;
  width: 100%;
}

.toast-success { border-left-color: var(--color-success-500); }
.toast-error   { border-left-color: var(--color-danger-500);  }
.toast-warning { border-left-color: var(--color-warning-500); }
.toast-info    { border-left-color: var(--accent-primary);    }

.toast-icon { flex-shrink: 0; margin-top: 1px; }
.toast-success .toast-icon { color: var(--color-success-500); }
.toast-error   .toast-icon { color: var(--color-danger-500);  }
.toast-warning .toast-icon { color: var(--color-warning-500); }
.toast-info    .toast-icon { color: var(--accent-primary);    }

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: var(--leading-snug);
}

.toast-close {
  flex-shrink: 0;
  color: var(--text-tertiary);
  padding: 2px;
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-close:hover { color: var(--text-primary); }

/* TransitionGroup */
.toast-enter-active {
  animation: slideInRight var(--duration-normal) var(--ease-out);
}
.toast-leave-active {
  animation: slideInRight var(--duration-fast) var(--ease-out) reverse;
}
.toast-move {
  transition: transform var(--duration-normal) var(--ease-out);
}
</style>