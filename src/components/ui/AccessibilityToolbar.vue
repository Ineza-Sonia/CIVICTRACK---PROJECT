<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="a11y-overlay"
      @click.self="$emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
    >
      <div class="a11y-panel" ref="panelRef" tabindex="-1">

        <!-- Header -->
        <div class="panel-header">
          <div>
            <h2 id="a11y-title" class="panel-title">
              <Accessibility :size="17" aria-hidden="true" />
              Accessibility
            </h2>
            <p class="panel-subtitle">Customize your experience</p>
          </div>
          <button
            class="close-btn touch-target"
            @click="$emit('close')"
            aria-label="Close accessibility panel"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Theme -->
        <section class="panel-section" aria-labelledby="theme-section-label">
          <h3 id="theme-section-label" class="section-heading">
            <Palette :size="13" aria-hidden="true" /> Color Theme
          </h3>
          <div class="theme-grid" role="radiogroup" aria-label="Choose color theme">
            <label
              v-for="opt in store.themeOptions"
              :key="opt.value"
              class="theme-option"
              :class="{ active: store.theme === opt.value }"
            >
              <input
                type="radio"
                name="ct-theme"
                :value="opt.value"
                :checked="store.theme === opt.value"
                @change="store.setTheme(opt.value)"
                class="sr-only"
              />
              <component :is="iconMap[opt.icon]" :size="16" aria-hidden="true" />
              <span>{{ opt.label }}</span>
              <CheckCircle
                v-if="store.theme === opt.value"
                :size="13"
                class="option-check"
                aria-hidden="true"
              />
            </label>
          </div>
        </section>

        <!-- Font size -->
        <section class="panel-section" aria-labelledby="font-section-label">
          <h3 id="font-section-label" class="section-heading">
            <Type :size="13" aria-hidden="true" /> Text Size
          </h3>
          <div class="font-grid" role="radiogroup" aria-label="Choose text size">
            <label
              v-for="opt in store.fontSizeOptions"
              :key="opt.value"
              class="font-option"
              :class="{ active: store.fontSize === opt.value }"
            >
              <input
                type="radio"
                name="ct-font"
                :value="opt.value"
                :checked="store.fontSize === opt.value"
                @change="store.setFontSize(opt.value)"
                class="sr-only"
              />
              <span class="font-name">{{ opt.label }}</span>
              <span class="font-desc">{{ opt.desc }}</span>
            </label>
          </div>
        </section>

        <!-- Motion -->
        <section class="panel-section" aria-labelledby="motion-section-label">
          <h3 id="motion-section-label" class="section-heading">
            <Wind :size="13" aria-hidden="true" /> Motion
          </h3>
          <label class="toggle-row">
            <div class="toggle-info">
              <span class="toggle-name">Reduce Animations</span>
              <span class="toggle-desc">For motion-sensitive users</span>
            </div>
            <button
              role="switch"
              :aria-checked="store.reducedMotion"
              class="toggle-switch"
              :class="{ on: store.reducedMotion }"
              @click="store.toggleReducedMotion()"
              aria-label="Toggle reduce motion"
            >
              <span class="toggle-thumb" aria-hidden="true"></span>
            </button>
          </label>
        </section>

        <!-- Live preview -->
        <div class="preview-box" aria-label="Text size preview">
          <p class="preview-label">Live Preview</p>
          <p class="preview-text">The quick brown fox jumps over the lazy dog.</p>
        </div>

        <!-- Reset -->
        <button class="reset-btn" @click="resetAll" aria-label="Reset all accessibility settings to default">
          <RotateCcw :size="13" aria-hidden="true" />
          Reset to defaults
        </button>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAccessibilityStore } from '@/store/useAccessibilityStore'
import {
  Accessibility, X, Palette, Type, Wind,
  Sun, Moon, CheckCircle, RotateCcw
} from 'lucide-vue-next'

// Lucide doesn't export "Contrast" — we use Moon as a stand-in for high-contrast
const Contrast = Moon

const props = defineProps({ isOpen: Boolean })
const emit  = defineEmits(['close'])

const store   = useAccessibilityStore()
const panelRef= ref(null)

const iconMap = { Sun, Moon, Contrast }

function resetAll() {
  store.setTheme('light')
  store.setFontSize('md')
  if (store.reducedMotion) store.toggleReducedMotion()
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) emit('close')
}

// Focus the panel when it opens
watch(() => props.isOpen, (open) => {
  if (open) {
    setTimeout(() => panelRef.value?.focus(), 50)
  }
})

onMounted(()  => document.addEventListener('keydown', onKeydown))
onUnmounted(()=> document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.a11y-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--overlay-bg);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: calc(var(--header-height) + var(--space-3)) var(--space-4) var(--space-4);
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.a11y-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 310px;
  max-height: calc(100vh - var(--header-height) - 2rem);
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  animation: slideInRight var(--duration-normal) var(--ease-out);
}

/* Header */
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.panel-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.panel-subtitle {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 3px;
}

.close-btn {
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
.close-btn:hover {
  background: var(--bg-surface-2);
  color: var(--text-primary);
}

/* Sections */
.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.section-heading {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Theme options */
.theme-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-subtle);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--duration-fast);
  position: relative;
}
.theme-option:hover {
  border-color: var(--border-default);
  background: var(--bg-surface-2);
  color: var(--text-primary);
}
.theme-option.active {
  border-color: var(--accent-primary);
  background: var(--accent-subtle);
  color: var(--accent-primary);
}

.option-check {
  margin-left: auto;
  color: var(--accent-primary);
}

/* Font options */
.font-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.font-option {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--duration-fast);
}
.font-option:hover {
  border-color: var(--border-default);
  background: var(--bg-surface-2);
}
.font-option.active {
  border-color: var(--accent-primary);
  background: var(--accent-subtle);
}

.font-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}
.font-option.active .font-name { color: var(--accent-primary); }

.font-desc {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

/* Motion toggle */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.toggle-name {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}
.toggle-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--bg-surface-3);
  border: 1.5px solid var(--border-default);
  position: relative;
  flex-shrink: 0;
  transition: all var(--duration-fast);
  cursor: pointer;
}
.toggle-switch.on {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast);
}
.toggle-switch.on .toggle-thumb { transform: translateX(20px); }

/* Preview */
.preview-box {
  padding: var(--space-4);
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-default);
}

.preview-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.preview-text {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
}

/* Reset */
.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-tertiary);
  border: 1px dashed var(--border-default);
  transition: all var(--duration-fast);
  cursor: pointer;
  font-family: var(--font-body);
}
.reset-btn:hover {
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  border-color: var(--border-strong);
}
</style>