<template>
  <main id="main-content" tabindex="-1" class="auth-page">
    <div class="auth-split">

      <!-- Left panel with friendly illustration -->
      <div class="auth-panel" aria-hidden="true">
        <div class="panel-inner">
          <div class="panel-illustration" role="img" aria-label="Community joining together">
            <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="70" cy="45" r="22" fill="rgba(255,255,255,0.25)"/>
              <path d="M45 80c0-14 11-25 25-25s25 11 25 25" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="130" cy="42" r="20" fill="rgba(255,255,255,0.25)"/>
              <path d="M108 74c0-12 10-22 22-22s22 10 22 22" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M90 55l25 25 45-45" stroke="rgba(255,255,255,0.95)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="100" cy="95" r="15" fill="rgba(255,255,255,0.15)"/>
            </svg>
          </div>
          <div class="panel-logo"><ShieldCheck :size="30" /></div>
          <h2 class="panel-headline">
            Join the movement<br />for
            <em>accountability.</em>
          </h2>
          <p class="panel-sub">
            Create your free account and start making your community
            better — one verified complaint at a time.
          </p>
          <ul class="panel-features" role="list">
            <li v-for="f in panelFeatures" :key="f">
              <Check :size="15" aria-hidden="true" />
              {{ f }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Right form -->
      <div class="auth-form-side">
        <div class="auth-form-wrap">

          <router-link to="/" class="back-link" aria-label="Return to home page">
            <ArrowLeft :size="15" aria-hidden="true" /> Back to home
          </router-link>

          <h1 class="auth-heading">Create your account</h1>
          <p class="auth-subtext">
            Already registered?
            <router-link to="/login">Sign in instead</router-link>
          </p>

          <form
            @submit.prevent="handleRegister"
            novalidate
            aria-label="Create a new citizen account"
          >
            <!-- Server error -->
            <div
              v-if="auth.error"
              class="form-alert"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle :size="15" aria-hidden="true" />
              {{ auth.error }}
            </div>

            <!-- Full name -->
            <div class="form-group">
              <label for="reg-name" class="form-label">
                Full Name
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <input
                id="reg-name"
                v-model="form.fullName"
                type="text"
                class="input"
                autocomplete="name"
                placeholder="Your full name"
                required
                :aria-invalid="!!errors.fullName"
                :aria-describedby="errors.fullName ? 'err-reg-name' : undefined"
              />
              <p v-if="errors.fullName" id="err-reg-name" class="form-error" role="alert">
                <AlertCircle :size="13" aria-hidden="true" /> {{ errors.fullName }}
              </p>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="reg-email" class="form-label">
                Email Address
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <input
                id="reg-email"
                v-model="form.email"
                type="email"
                class="input"
                autocomplete="email"
                placeholder="you@example.com"
                required
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'err-reg-email' : undefined"
              />
              <p v-if="errors.email" id="err-reg-email" class="form-error" role="alert">
                <AlertCircle :size="13" aria-hidden="true" /> {{ errors.email }}
              </p>
            </div>

            <!-- Phone (optional) -->
            <div class="form-group">
              <label for="reg-phone" class="form-label">
                Phone Number
                <span class="caption" aria-label="optional"> (optional)</span>
              </label>
              <input
                id="reg-phone"
                v-model="form.phone"
                type="tel"
                class="input"
                autocomplete="tel"
                placeholder="+250 788 000 000"
              />
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="reg-pass" class="form-label">
                Password
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <div class="input-with-btn">
                <input
                  id="reg-pass"
                  v-model="form.password"
                  :type="showPass ? 'text' : 'password'"
                  class="input"
                  autocomplete="new-password"
                  placeholder="Create a strong password"
                  required
                  :aria-invalid="!!errors.password"
                  :aria-describedby="'pass-requirements' + (errors.password ? ' err-reg-pass' : '')"
                />
                <button
                  type="button"
                  class="reveal-btn"
                  @click="showPass = !showPass"
                  :aria-label="showPass ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPass"
                >
                  <Eye    v-if="!showPass" :size="16" aria-hidden="true" />
                  <EyeOff v-else           :size="16" aria-hidden="true" />
                </button>
              </div>
              <p v-if="errors.password" id="err-reg-pass" class="form-error" role="alert">
                <AlertCircle :size="13" aria-hidden="true" /> {{ errors.password }}
              </p>

              <!-- Password strength indicators -->
              <div
                id="pass-requirements"
                class="pass-reqs"
                aria-label="Password requirements"
              >
                <div
                  v-for="req in passReqs"
                  :key="req.label"
                  class="pass-req"
                  :class="{ met: req.met }"
                >
                  <CheckCircle v-if="req.met" :size="11" aria-hidden="true" />
                  <Circle      v-else          :size="11" aria-hidden="true" />
                  <span>{{ req.label }}</span>
                  <span class="sr-only">{{ req.met ? '(met)' : '(not yet met)' }}</span>
                </div>
              </div>
            </div>

            <!-- Confirm password -->
            <div class="form-group">
              <label for="reg-confirm" class="form-label">
                Confirm Password
                <span aria-hidden="true" class="req"> *</span>
              </label>
              <input
                id="reg-confirm"
                v-model="form.confirm"
                :type="showPass ? 'text' : 'password'"
                class="input"
                autocomplete="new-password"
                placeholder="Repeat your password"
                required
                :aria-invalid="!!errors.confirm"
                :aria-describedby="errors.confirm ? 'err-reg-confirm' : undefined"
              />
              <p v-if="errors.confirm" id="err-reg-confirm" class="form-error" role="alert">
                <AlertCircle :size="13" aria-hidden="true" /> {{ errors.confirm }}
              </p>
            </div>

            <button
              type="submit"
              class="auth-submit"
              :disabled="auth.isLoading"
              :aria-busy="auth.isLoading"
            >
              <span v-if="auth.isLoading" class="btn-spinner" aria-hidden="true"></span>
              <UserPlus v-else :size="17" aria-hidden="true" />
              {{ auth.isLoading ? 'Creating account…' : 'Create Account' }}
              <span v-if="auth.isLoading" class="sr-only">Please wait.</span>
            </button>

            <p class="secure-note">
              <Lock :size="12" aria-hidden="true" />
              Free forever. No credit card. Your data stays private.
            </p>
          </form>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useAnnouncer } from '@/composables/useAnnouncer'
import {
  validateEmail, validatePassword,
  validateMinLength, validateRequired
} from '@/utils/validators'
import {
  ShieldCheck, ArrowLeft, Check, AlertCircle,
  Eye, EyeOff, CheckCircle, Circle, UserPlus, Lock
} from 'lucide-vue-next'

const router = useRouter()
const auth   = useAuthStore()
const { announce } = useAnnouncer()

const form = reactive({
  fullName: '', email: '', phone: '',
  password: '', confirm: ''
})
const errors   = reactive({})
const showPass = ref(false)

const panelFeatures = [
  'Free account — no credit card required',
  'Submit complaints with or without identity',
  'Real-time tracking with unique code',
  'Full complaint history in your dashboard',
  'Works on any device, accessible to all'
]

const passReqs = computed(() => [
  { label: '8+ characters',     met: form.password.length >= 8              },
  { label: 'Uppercase letter',  met: /[A-Z]/.test(form.password)            },
  { label: 'One number',        met: /[0-9]/.test(form.password)            },
  { label: 'Special character', met: /[^A-Za-z0-9]/.test(form.password)     }
])

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!validateMinLength(form.fullName, 2))
    errors.fullName = 'Full name must be at least 2 characters.'
  if (!validateEmail(form.email))
    errors.email = 'Please enter a valid email address.'
  const passErrors = validatePassword(form.password)
  if (passErrors.length > 0)
    errors.password = `Password needs: ${passErrors.join(', ')}.`
  if (form.password !== form.confirm)
    errors.confirm = 'Passwords do not match.'
  return Object.keys(errors).length === 0
}

async function handleRegister() {
  if (!validate()) {
    announce('Please correct the form errors before submitting.', 'assertive')
    const first = document.querySelector('[aria-invalid="true"]')
    first?.focus()
    return
  }
  try {
    const user = await auth.register(form)
    announce(`Account created. Welcome to CIVICTRACK, ${user.fullName}.`)
    await router.push('/dashboard')
  } catch (_) {
    announce('Registration failed. Please try again.', 'assertive')
  }
}
</script>

<style scoped>
.auth-page  { flex: 1; display: flex; padding-top: var(--header-height); }
.auth-split {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - var(--header-height));
}

.auth-panel {
  background: var(--accent-primary);
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-12);
}
[data-theme="dark"]          .auth-panel { background: var(--color-primary-800); }
[data-theme="high-contrast"] .auth-panel { background: #000; border-right: 2px solid #fff; }

.panel-inner { max-width: 380px; }

.panel-illustration {
  margin-bottom: var(--space-5);
  opacity: 0.95;
}
.panel-illustration svg {
  width: 130px;
  height: auto;
}

.panel-logo {
  width: 54px; height: 54px;
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  margin-bottom: var(--space-8);
}

.panel-headline {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 3vw, var(--text-5xl));
  color: #fff;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-5);
}

.panel-sub {
  color: rgba(255,255,255,0.92);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
}

.panel-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.panel-features li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.95);
}
.panel-features li svg { color: rgba(255,255,255,0.9); flex-shrink: 0; }

.auth-form-side {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-10) var(--space-12);
  background: var(--bg-canvas);
  overflow-y: auto;
}

.auth-form-wrap {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-block: var(--space-4);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color var(--duration-fast);
  align-self: flex-start;
}
.back-link:hover { color: var(--accent-primary); }

.auth-heading {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  color: var(--text-primary);
}
.auth-subtext { font-size: var(--text-base); color: var(--text-secondary); }
.auth-subtext a { color: var(--accent-primary); text-decoration: underline; text-underline-offset: 2px; }

form { display: flex; flex-direction: column; gap: var(--space-4); }
.req { color: var(--color-danger-500); }

.form-alert {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-100);
  border: 1px solid var(--color-danger-500);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-danger-500);
}
[data-theme="dark"] .form-alert { background: rgba(146,50,50,0.15); }

.input-with-btn { position: relative; }
.input-with-btn .input { padding-right: var(--space-12); }

.reveal-btn {
  position: absolute;
  right: var(--space-3); top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: color var(--duration-fast);
}
.reveal-btn:hover { color: var(--text-primary); }

/* Password requirements */
.pass-reqs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1);
  margin-top: var(--space-2);
}
.pass-req {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  transition: color var(--duration-fast);
}
.pass-req.met { color: var(--color-success-500); }
.pass-req svg { flex-shrink: 0; }

.auth-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4);
  background: var(--accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  font-family: var(--font-body);
  transition: all var(--duration-fast);
}
.auth-submit:hover:not([disabled]) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.auth-submit[disabled] { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  display: block;
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
}

@media (max-width: 768px) {
  .auth-split     { grid-template-columns: 1fr; }
  .auth-panel     { display: none; }
  .auth-form-side { padding: var(--space-8) var(--space-4); }
}
</style>