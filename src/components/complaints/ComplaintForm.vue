<template>
  <form
    @submit.prevent="handleSubmit"
    novalidate
    aria-label="File a new complaint"
    class="complaint-form"
  >
    <!-- Title -->
    <div class="form-group">
      <label for="c-title" class="form-label">
        Complaint Title
        <span aria-hidden="true" class="required-star"> *</span>
      </label>
      <input
        id="c-title"
        v-model="form.title"
        type="text"
        class="input"
        placeholder="Briefly describe the issue in one line"
        maxlength="120"
        required
        :aria-invalid="!!errors.title"
        :aria-describedby="errors.title ? 'err-title' : 'hint-title'"
      />
      <p id="hint-title" class="caption" aria-live="off">
        {{ form.title.length }}/120 characters
      </p>
      <p v-if="errors.title" id="err-title" class="form-error" role="alert">
        <AlertCircle :size="13" aria-hidden="true" /> {{ errors.title }}
      </p>
    </div>

    <!-- Category -->
    <div class="form-group">
      <label for="c-category" class="form-label">
        Category
        <span aria-hidden="true" class="required-star"> *</span>
      </label>
      <select
        id="c-category"
        v-model="form.category"
        class="input"
        required
        :aria-invalid="!!errors.category"
        :aria-describedby="errors.category ? 'err-category' : undefined"
      >
        <option value="" disabled>Select the best category</option>
        <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
      <p v-if="errors.category" id="err-category" class="form-error" role="alert">
        <AlertCircle :size="13" aria-hidden="true" /> {{ errors.category }}
      </p>
    </div>

    <!-- Priority -->
    <div class="form-group">
      <fieldset class="priority-fieldset">
        <legend class="form-label">
          Priority Level
        </legend>
        <div class="priority-options" role="radiogroup" aria-label="Select priority level">
          <label
            v-for="p in PRIORITIES"
            :key="p.value"
            class="priority-option"
            :class="[`priority-${p.value}`, { active: form.priority === p.value }]"
          >
            <input
              type="radio"
              name="c-priority"
              :value="p.value"
              v-model="form.priority"
              class="sr-only"
            />
            {{ p.label }}
          </label>
        </div>
      </fieldset>
    </div>

    <!-- Location -->
    <div class="form-group">
      <label for="c-location" class="form-label">
        Location
        <span class="caption" aria-label="optional"> (optional)</span>
      </label>
      <input
        id="c-location"
        v-model="form.location"
        type="text"
        class="input"
        placeholder="Street, neighborhood, or landmark"
        aria-describedby="hint-location"
      />
      <p id="hint-location" class="caption">
        Providing a location helps authorities respond faster.
      </p>
    </div>

    <!-- Description -->
    <div class="form-group">
      <label for="c-description" class="form-label">
        Detailed Description
        <span aria-hidden="true" class="required-star"> *</span>
      </label>
      <textarea
        id="c-description"
        v-model="form.description"
        class="input"
        placeholder="Describe exactly what happened, when it happened, who was involved, and any other details that will help authorities investigate this issue."
        maxlength="2000"
        required
        rows="5"
        :aria-invalid="!!errors.description"
        :aria-describedby="errors.description ? 'err-desc' : 'hint-desc'"
      ></textarea>
      <p id="hint-desc" class="caption" aria-live="off">
        {{ form.description.length }}/2000 characters
      </p>
      <p v-if="errors.description" id="err-desc" class="form-error" role="alert">
        <AlertCircle :size="13" aria-hidden="true" /> {{ errors.description }}
      </p>
    </div>

    <!-- Anonymous toggle -->
    <div class="anon-section">
      <label class="anon-row" for="c-anonymous">
        <div class="anon-info">
          <EyeOff :size="18" aria-hidden="true" class="anon-icon" />
          <div>
            <span class="anon-title">Submit Anonymously</span>
            <span class="anon-desc">
              Your identity will not be attached to this report.
              You will still receive a tracking code.
            </span>
          </div>
        </div>
        <div
          class="toggle-switch"
          :class="{ on: form.anonymous }"
          role="switch"
          :aria-checked="form.anonymous"
          aria-label="Submit anonymously"
          @click="form.anonymous = !form.anonymous"
          @keydown.enter="form.anonymous = !form.anonymous"
          @keydown.space.prevent="form.anonymous = !form.anonymous"
          tabindex="0"
        >
          <span class="toggle-thumb" aria-hidden="true"></span>
        </div>
        <input
          id="c-anonymous"
          type="checkbox"
          v-model="form.anonymous"
          class="sr-only"
          aria-hidden="true"
          tabindex="-1"
        />
      </label>
    </div>

    <!-- Submit -->
    <div class="form-submit-row">
      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        <span v-if="isSubmitting" class="btn-spinner" aria-hidden="true"></span>
        <Send v-else :size="17" aria-hidden="true" />
        <span>{{ isSubmitting ? 'Submitting…' : 'Submit Complaint' }}</span>
        <span v-if="isSubmitting" class="sr-only">Please wait, submitting your complaint.</span>
      </button>
      <p class="submit-note">
        <Lock :size="12" aria-hidden="true" />
        Secure and confidential submission.
      </p>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { AlertCircle, EyeOff, Send, Lock } from 'lucide-vue-next'
import { CATEGORIES, PRIORITIES } from '@/store/useComplaintStore'
import { useComplaintStore } from '@/store/useComplaintStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { sanitizeInput } from '@/utils/sanitize'

const emit = defineEmits(['submitted'])

const store  = useComplaintStore()
const auth   = useAuthStore()
const { announce } = useAnnouncer()

const form = reactive({
  title: '', category: '', priority: 'medium',
  location: '', description: '', anonymous: false
})

const errors      = reactive({})
const isSubmitting = ref(false)

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.title.trim() || form.title.trim().length < 5)
    errors.title = 'Title must be at least 5 characters.'
  if (!form.category)
    errors.category = 'Please select a category.'
  if (!form.description.trim() || form.description.trim().length < 20)
    errors.description = 'Description must be at least 20 characters.'
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    announce('Form has errors. Please review and correct them.', 'assertive')
    const firstInvalid = document.querySelector('[aria-invalid="true"]')
    firstInvalid?.focus()
    return
  }

  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 800))

  const sanitized = {
    title: sanitizeInput(form.title, { maxLength: 120, allowNewlines: false }),
    category: form.category,
    priority: form.priority,
    location: sanitizeInput(form.location, { maxLength: 200, allowNewlines: false }),
    description: sanitizeInput(form.description, { maxLength: 2000 }),
    anonymous: form.anonymous
  }

  const result = store.submit(sanitized, auth.currentUser?.id)
  isSubmitting.value = false

  announce(
    `Complaint submitted successfully. Your tracking code is ${result.trackingCode}.`
  )

  emit('submitted', result)

  // Reset form
  Object.assign(form, {
    title: '', category: '', priority: 'medium',
    location: '', description: '', anonymous: false
  })
}
</script>

<style scoped>
.complaint-form { display: flex; flex-direction: column; gap: var(--space-5); }

.required-star { color: var(--color-danger-500); }

/* Priority fieldset */
.priority-fieldset {
  border: none;
  padding: 0;
}
.priority-fieldset > .form-label {
  display: block;
  margin-bottom: var(--space-3);
}
.priority-options {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.priority-option {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  border: 1.5px solid var(--border-default);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  min-height: 36px;
}
.priority-option:hover { border-color: var(--border-strong); color: var(--text-primary); }
.priority-critical.active { border-color: var(--color-danger-500);  background: var(--color-danger-100);  color: var(--color-danger-500);  }
.priority-high.active     { border-color: var(--color-warning-500); background: var(--color-warning-100); color: var(--color-warning-500); }
.priority-medium.active   { border-color: var(--accent-primary);    background: var(--accent-subtle);     color: var(--accent-primary);    }
.priority-low.active      { border-color: var(--color-success-500); background: var(--color-success-100); color: var(--color-success-500); }

[data-theme="dark"] .priority-critical.active { background: rgba(146,50,50,0.15); }
[data-theme="dark"] .priority-high.active     { background: rgba(150,107,26,0.15); }
[data-theme="dark"] .priority-low.active      { background: rgba(42,122,82,0.15); }

/* Anonymous toggle */
.anon-section {
  background: var(--bg-surface-2);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.anon-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  cursor: pointer;
}
.anon-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}
.anon-icon { color: var(--text-tertiary); margin-top: 2px; flex-shrink: 0; }
.anon-title {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}
.anon-desc {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
  line-height: var(--leading-relaxed);
}

.toggle-switch {
  width: 48px;
  height: 26px;
  border-radius: var(--radius-full);
  background: var(--bg-surface-3);
  border: 1.5px solid var(--border-default);
  position: relative;
  flex-shrink: 0;
  transition: all var(--duration-fast);
  cursor: pointer;
}
.toggle-switch.on { background: var(--accent-primary); border-color: var(--accent-primary); }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast);
}
.toggle-switch.on .toggle-thumb { transform: translateX(22px); }

/* Submit */
.form-submit-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-subtle);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-8);
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  min-height: 50px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
}
.submit-btn:hover:not([disabled]) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.submit-btn[disabled] { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.submit-note {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
</style>