<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    class="base-btn"
    :class="[
      `btn-variant-${variant}`,
      `btn-size-${size}`,
      { 'is-loading': loading, 'is-full': full, 'is-icon-only': iconOnly }
    ]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <span v-if="loading && loadingText" class="sr-only">{{ loadingText }}</span>
    <span v-if="loading && loadingText" aria-hidden="true">{{ loadingText }}</span>
    <slot v-if="!loading || !loadingText" />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:     { type: String, default: 'primary'  }, // primary | secondary | ghost | danger | success
  size:        { type: String, default: 'md'       }, // sm | md | lg
  type:        { type: String, default: 'button'   },
  disabled:    { type: Boolean, default: false     },
  loading:     { type: Boolean, default: false     },
  loadingText: { type: String,  default: ''        },
  full:        { type: Boolean, default: false     },
  iconOnly:    { type: Boolean, default: false     },
  to:          { type: String,  default: null      },
  href:        { type: String,  default: null      }
})

const tag = computed(() => {
  if (props.to)   return 'router-link'
  if (props.href) return 'a'
  return 'button'
})
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: var(--border-width) solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
  white-space: nowrap;
  letter-spacing: 0.01em;
  line-height: 1;
}

/* ── Sizes ── */
.btn-size-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  min-height: 36px;
}
.btn-size-md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  min-height: 46px;
}
.btn-size-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  min-height: 54px;
}

.is-full     { width: 100%; }
.is-icon-only {
  padding: var(--space-3);
  min-width: 46px;
}

/* ── Variants ── */
.btn-variant-primary {
  background: var(--accent-primary);
  color: var(--text-on-primary);
  border-color: var(--accent-primary);
}
.btn-variant-primary:hover:not([disabled]) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-variant-primary:active:not([disabled]) {
  background: var(--accent-active);
  transform: translateY(0);
  box-shadow: none;
}

.btn-variant-secondary {
  background: var(--bg-surface);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}
.btn-variant-secondary:hover:not([disabled]) {
  background: var(--accent-subtle);
  transform: translateY(-1px);
}

.btn-variant-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-default);
}
.btn-variant-ghost:hover:not([disabled]) {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

.btn-variant-danger {
  background: var(--color-danger-500);
  color: #fff;
  border-color: var(--color-danger-500);
}
.btn-variant-danger:hover:not([disabled]) {
  opacity: 0.88;
  transform: translateY(-1px);
}

.btn-variant-success {
  background: var(--color-success-500);
  color: #fff;
  border-color: var(--color-success-500);
}
.btn-variant-success:hover:not([disabled]) {
  opacity: 0.88;
  transform: translateY(-1px);
}

/* ── Loading state ── */
.is-loading { pointer-events: none; opacity: 0.75; }

.btn-spinner {
  display: block;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>