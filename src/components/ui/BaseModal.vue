<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="emit('update:modelValue', false)"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div
          class="modal-box"
          :style="{ maxWidth: width }"
          ref="boxRef"
        >
          <!-- Header -->
          <div class="modal-header">
            <h2 :id="titleId" class="modal-title">{{ title }}</h2>
            <button
              class="modal-close touch-target"
              @click="emit('update:modelValue', false)"
              aria-label="Close dialog"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Optional footer slot -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title:      { type: String,  default: ''    },
  width:      { type: String,  default: '560px' }
})

const emit   = defineEmits(['update:modelValue'])
const boxRef = ref(null)
const titleId= computed(() =>
  `modal-title-${Math.random().toString(36).slice(2, 8)}`
)

// Trap focus & lock scroll when open
watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Close on Escape
function onKeydown(e) {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false)
  }
}
document.addEventListener('keydown', onKeydown)
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: scaleIn var(--duration-normal) var(--ease-out);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.modal-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: background var(--duration-fast), color var(--duration-fast);
}
.modal-close:hover {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

.modal-body   { padding: var(--space-6); flex: 1; }
.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  flex-shrink: 0;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity var(--duration-normal) var(--ease-out); }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>